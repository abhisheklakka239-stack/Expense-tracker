import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Trash2, Edit2, AlertCircle, Calendar, CreditCard } from 'lucide-react';
import type { Expense, SortOption } from '../types/expense';
import { CATEGORY_COLORS } from '../types/expense';
import { formatINR, formatDate } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => Promise<void>;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered and sorted expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesPayment = selectedPayment === 'all' || item.payment_method === selectedPayment;

        return matchesSearch && matchesCategory && matchesPayment;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [expenses, searchQuery, selectedCategory, selectedPayment, sortBy]);

  const confirmDelete = async (id: string) => {
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-lg shadow-black/20">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">Expense Records</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
            {filteredExpenses.length} items
          </span>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 appearance-none"
            >
              <option value="all">All Categories</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills & Utilities">Bills & Utilities</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Travel">Travel</option>
              <option value="Education">Education</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <CreditCard className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 appearance-none"
            >
              <option value="all">All Payment Modes</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 appearance-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table / List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No expenses found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredExpenses.map((expense) => {
            const categoryColor = CATEGORY_COLORS[expense.category] || '#64748b';

            return (
              <div
                key={expense.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 transition-all gap-3"
              >
                {/* Left section: Category Icon & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="p-3 rounded-xl shrink-0 flex items-center justify-center border shadow-sm"
                    style={{
                      backgroundColor: `${categoryColor}15`,
                      borderColor: `${categoryColor}40`,
                      color: categoryColor,
                    }}
                  >
                    <CategoryIcon category={expense.category} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {expense.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {expense.category}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(expense.date)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-emerald-400 font-mono text-[11px]">
                        {expense.payment_method}
                      </span>
                    </div>
                    {expense.notes && (
                      <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">{expense.notes}</p>
                    )}
                  </div>
                </div>

                {/* Right section: Amount in INR & Actions */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="text-base font-bold text-white font-mono tracking-tight">
                      {formatINR(expense.amount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      title="Edit Expense"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(expense.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this expense record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingId)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
