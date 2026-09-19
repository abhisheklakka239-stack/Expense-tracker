import React, { useMemo, useState } from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { Expense, Category } from '../types/expense';
import { CATEGORY_COLORS } from '../types/expense';
import { formatINR } from '../utils/formatters';
import { PieChart, BarChart3, CreditCard } from 'lucide-react';

interface ExpenseChartsProps {
  expenses: Expense[];
}

export const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ expenses }) => {
  const [activeTab, setActiveTab] = useState<'category' | 'payment'>('category');

  // Category breakdown data
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });

    return Object.entries(totals)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name as Category] || '#64748b',
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Payment method data
  const paymentData = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((e) => {
      totals[e.payment_method] = (totals[e.payment_method] || 0) + e.amount;
    });

    const colors: Record<string, string> = {
      UPI: '#10b981', // Emerald
      'Credit Card': '#ec4899', // Pink
      'Debit Card': '#3b82f6', // Blue
      'Net Banking': '#8b5cf6', // Purple
      Cash: '#f59e0b', // Amber
    };

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#38bdf8',
    }));
  }, [expenses]);

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 mb-6 shadow-lg shadow-black/20">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Visual Analytics</h2>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('category')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'category'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Category Share</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'payment'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment Mode</span>
          </button>
        </div>
      </div>

      {/* Chart View */}
      {activeTab === 'category' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Pie Chart */}
          <div className="lg:col-span-6 h-64 sm:h-72 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1e293b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl shadow-xl text-xs">
                          <p className="font-semibold text-slate-200">{item.name}</p>
                          <p className="text-emerald-400 font-bold mt-0.5">{formatINR(item.value)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown Table / Legend */}
          <div className="lg:col-span-6 space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {categoryData.map((item) => {
              const totalSum = categoryData.reduce((s, i) => s + i.value, 0);
              const percentage = totalSum > 0 ? ((item.value / totalSum) * 100).toFixed(1) : '0';

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300 font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-400 font-medium">{percentage}%</span>
                    <span className="text-slate-100 font-bold">{formatINR(item.value)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl shadow-xl text-xs">
                        <p className="font-semibold text-slate-200">{item.name}</p>
                        <p className="text-emerald-400 font-bold mt-0.5">{formatINR(item.value)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {paymentData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
