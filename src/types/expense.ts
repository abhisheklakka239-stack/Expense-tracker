export type Category = 
  | 'Food & Dining'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Transportation'
  | 'Entertainment'
  | 'Healthcare'
  | 'Travel'
  | 'Education'
  | 'Others';

export type PaymentMethod = 
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Net Banking'
  | 'Cash';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  payment_method: PaymentMethod;
  notes?: string;
  created_at?: string;
  user_id?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
}

export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export interface ExpenseFilter {
  category: string;
  paymentMethod: string;
  searchQuery: string;
  startDate: string;
  endDate: string;
  sortBy: SortOption;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  isDemoMode: boolean;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  'Food & Dining': '#f59e0b', // Amber
  'Shopping': '#ec4899', // Pink
  'Bills & Utilities': '#3b82f6', // Blue
  'Transportation': '#8b5cf6', // Purple
  'Entertainment': '#10b981', // Emerald
  'Healthcare': '#ef4444', // Red
  'Travel': '#06b6d4', // Cyan
  'Education': '#6366f1', // Indigo
  'Others': '#64748b', // Slate
};

export const CATEGORY_ICONS: Record<Category, string> = {
  'Food & Dining': 'Utensils',
  'Shopping': 'ShoppingBag',
  'Bills & Utilities': 'Receipt',
  'Transportation': 'Car',
  'Entertainment': 'Film',
  'Healthcare': 'HeartPulse',
  'Travel': 'Plane',
  'Education': 'GraduationCap',
  'Others': 'MoreHorizontal',
};
