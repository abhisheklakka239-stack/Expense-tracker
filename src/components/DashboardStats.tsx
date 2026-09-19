import React, { useMemo } from 'react';
import { IndianRupee, Calendar, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';
import type { Expense } from '../types/expense';
import { formatINR } from '../utils/formatters';

interface DashboardStatsProps {
  expenses: Expense[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ expenses }) => {
  const stats = useMemo(() => {
    const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const thisMonthExpenses = expenses.filter((e) => e.date.startsWith(currentYearMonth));
    const thisMonthTotal = thisMonthExpenses.reduce((sum, item) => sum + item.amount, 0);

    // Calculate daily average for this month up to current day
    const dayOfMonth = now.getDate();
    const dailyAverage = dayOfMonth > 0 ? thisMonthTotal / dayOfMonth : 0;

    // Highest category calculation
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    let topCategory = 'None';
    let topCategoryAmount = 0;

    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > topCategoryAmount) {
        topCategoryAmount = amount;
        topCategory = cat;
      }
    });

    return {
      totalAmount,
      thisMonthTotal,
      dailyAverage,
      topCategory,
      topCategoryAmount,
      totalCount: expenses.length,
    };
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Spending */}
      <div className="relative overflow-hidden bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg shadow-black/20 hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Outflow</span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {formatINR(stats.totalAmount)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center">
              {stats.totalCount} {stats.totalCount === 1 ? 'transaction' : 'transactions'}
            </span>
            <span>recorded</span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Card 2: This Month */}
      <div className="relative overflow-hidden bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg shadow-black/20 hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">This Month</span>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {formatINR(stats.thisMonthTotal)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Current billing cycle</span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Card 3: Daily Average */}
      <div className="relative overflow-hidden bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg shadow-black/20 hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Average</span>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {formatINR(stats.dailyAverage)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            <span>Average spending per day</span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Card 4: Top Category */}
      <div className="relative overflow-hidden bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg shadow-black/20 hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Category</span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <PieChart className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-bold text-white truncate" title={stats.topCategory}>
            {stats.topCategory}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">{formatINR(stats.topCategoryAmount)}</span>
            <span>total spent</span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
};
