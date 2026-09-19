import type { Expense } from '../types/expense';
import { getSupabaseClient } from '../lib/supabase';
import { MOCK_EXPENSES } from '../data/mockExpenses';

const LOCAL_STORAGE_KEY = 'inr_expenses_data';

// Helper to get local storage data
const getLocalExpenses = (): Expense[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_EXPENSES));
    return MOCK_EXPENSES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return MOCK_EXPENSES;
  }
};

// Helper to set local storage data
const setLocalExpenses = (expenses: Expense[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
};

export const expenseService = {
  /**
   * Fetch all expenses. Tries Supabase first if available, falls back to local storage.
   */
  async getExpenses(): Promise<{ expenses: Expense[]; isSupabase: boolean; error?: string }> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.warn('Supabase fetch error, falling back to LocalStorage:', error.message);
          return {
            expenses: getLocalExpenses(),
            isSupabase: false,
            error: `Supabase error (${error.message}). Using local mode.`,
          };
        }

        return {
          expenses: data as Expense[],
          isSupabase: true,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Connection failed';
        return {
          expenses: getLocalExpenses(),
          isSupabase: false,
          error: `Supabase error: ${msg}. Using local mode.`,
        };
      }
    }

    // Default LocalStorage mode
    return {
      expenses: getLocalExpenses(),
      isSupabase: false,
    };
  },

  /**
   * Add a new expense.
   */
  async addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<{ expense: Expense; isSupabase: boolean }> {
    const supabase = getSupabaseClient();
    const newId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        const insertPayload: Record<string, unknown> = {
          id: newId,
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          payment_method: expense.payment_method,
          notes: expense.notes || '',
          created_at: createdAt,
        };

        if (user) {
          insertPayload.user_id = user.id;
        }

        const { data, error } = await supabase
          .from('expenses')
          .insert([insertPayload])
          .select()
          .single();

        if (!error && data) {
          const current = getLocalExpenses();
          setLocalExpenses([data as Expense, ...current]);
          return { expense: data as Expense, isSupabase: true };
        } else {
          console.warn('Supabase insert failed, saving locally:', error?.message);
        }
      } catch (err) {
        console.warn('Supabase insert error, saving locally:', err);
      }
    }

    // Local fallback
    const fullExpense: Expense = {
      ...expense,
      id: newId,
      created_at: createdAt,
    };
    const current = getLocalExpenses();
    const updated = [fullExpense, ...current];
    setLocalExpenses(updated);
    return { expense: fullExpense, isSupabase: false };
  },

  /**
   * Update an existing expense.
   */
  async updateExpense(id: string, expenseData: Partial<Expense>): Promise<{ expense: Expense; isSupabase: boolean }> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .update({
            title: expenseData.title,
            amount: expenseData.amount,
            category: expenseData.category,
            date: expenseData.date,
            payment_method: expenseData.payment_method,
            notes: expenseData.notes,
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const current = getLocalExpenses();
          const updated = current.map((item) => (item.id === id ? (data as Expense) : item));
          setLocalExpenses(updated);
          return { expense: data as Expense, isSupabase: true };
        }
      } catch (err) {
        console.warn('Supabase update error:', err);
      }
    }

    // Local fallback
    const current = getLocalExpenses();
    let updatedItem: Expense | null = null;
    const updated = current.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...expenseData };
        return updatedItem;
      }
      return item;
    });
    setLocalExpenses(updated);
    return { expense: updatedItem || ({ id, ...expenseData } as Expense), isSupabase: false };
  },

  /**
   * Delete an expense.
   */
  async deleteExpense(id: string): Promise<{ success: boolean; isSupabase: boolean }> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { error } = await supabase.from('expenses').delete().eq('id', id);
        if (!error) {
          const current = getLocalExpenses();
          setLocalExpenses(current.filter((item) => item.id !== id));
          return { success: true, isSupabase: true };
        }
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    // Local fallback
    const current = getLocalExpenses();
    setLocalExpenses(current.filter((item) => item.id !== id));
    return { success: true, isSupabase: false };
  },

  /**
   * Reset local storage data to default mock set.
   */
  resetToMockData(): Expense[] {
    setLocalExpenses(MOCK_EXPENSES);
    return MOCK_EXPENSES;
  },
};
