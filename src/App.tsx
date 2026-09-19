import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { ExpenseCharts } from './components/ExpenseCharts';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import type { Expense } from './types/expense';
import { expenseService } from './services/expenseService';
import { useAuth } from './context/AuthContext';
import { Database, Plus, Info, RefreshCw } from 'lucide-react';

export function App() {
  const { user, isGuest, loading } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isSupabase, setIsSupabase] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await expenseService.getExpenses();
      setExpenses(result.expenses);
      setIsSupabase(result.isSupabase);
      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setErrorMessage(null);
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
      setErrorMessage('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user || isGuest) {
      loadExpenses();
    }
  }, [loadExpenses, user, isGuest]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsFormModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormModalOpen(true);
  };

  const handleSaveExpense = async (data: Omit<Expense, 'id' | 'created_at'>) => {
    if (editingExpense) {
      const res = await expenseService.updateExpense(editingExpense.id, data);
      setExpenses((prev) =>
        prev.map((item) => (item.id === editingExpense.id ? res.expense : item))
      );
    } else {
      const res = await expenseService.addExpense(data);
      setExpenses((prev) => [res.expense, ...prev]);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    await expenseService.deleteExpense(id);
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetData = () => {
    const mockData = expenseService.resetToMockData();
    setExpenses(mockData);
  };

  // Initial authentication loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading Expense Tracker...</span>
        </div>
      </div>
    );
  }

  // MANDATORY LOGIN GATE: If not logged in and not in guest mode, keep user on Login screen
  if (!user && !isGuest) {
    return (
      <div className="animate-in fade-in duration-300">
        <LoginPage onOpenSettingsModal={() => setIsSettingsModalOpen(true)} />
        <SupabaseConfigModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onConfigChanged={loadExpenses}
        />
      </div>
    );
  }

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans animate-in fade-in duration-500">
      {/* Top Navigation */}
      <Navbar
        totalAmount={totalAmount}
        isSupabase={isSupabase}
        onOpenAddModal={handleAddExpense}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Supabase Demo Banner (if not connected) */}
        {!isSupabase && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-200">
                  Running in Demo / LocalStorage Mode
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your expenses are saved locally in your browser. Connect Supabase to sync data across all your devices in real-time.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/10 transition-colors shrink-0"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Connect Supabase</span>
            </button>
          </div>
        )}

        {/* Error message banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={loadExpenses}
              className="px-2.5 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 text-white font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-28 bg-slate-900 rounded-2xl border border-slate-800" />
              ))}
            </div>
            <div className="h-72 bg-slate-900 rounded-2xl border border-slate-800" />
            <div className="h-96 bg-slate-900 rounded-2xl border border-slate-800" />
          </div>
        ) : (
          <>
            {/* Dashboard Overview Cards */}
            <DashboardStats expenses={expenses} />

            {/* Visual Charts */}
            <ExpenseCharts expenses={expenses} />

            {/* Expense Records List */}
            <ExpenseList
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Expense Tracker • INR Expense Tracker with Supabase Backend</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" /> Supabase Setup
            </button>
            <button
              onClick={handleAddExpense}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Transaction
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExpenseFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveExpense}
        editingExpense={editingExpense}
      />

      <SupabaseConfigModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onConfigChanged={loadExpenses}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;
