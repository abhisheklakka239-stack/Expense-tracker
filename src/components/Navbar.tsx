import React, { useState } from 'react';
import { IndianRupee, Database, Plus, Settings, RefreshCw, LogOut, LogIn, ChevronDown } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  totalAmount: number;
  isSupabase: boolean;
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAuthModal: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalAmount,
  isSupabase,
  onOpenAddModal,
  onOpenSettingsModal,
  onOpenAuthModal,
  onResetData,
}) => {
  const { user, isGuest, signOut } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Expense Tracker
              </h1>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                INR ₹
              </span>
            </div>
            <p className="text-xs text-slate-400">Expense Analytics & Supabase Sync</p>
          </div>
        </div>

        {/* Center: Total Spent Quick Pill */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 shadow-inner">
          <span className="text-xs text-slate-400 font-medium">Total Tracked:</span>
          <span className="text-sm font-bold text-emerald-400">{formatINR(totalAmount)}</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Connection Status Badge */}
          <button
            onClick={onOpenSettingsModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isSupabase
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/40'
            }`}
            title="Click to configure Supabase"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabase ? 'Supabase Live' : 'Demo Mode'}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabase ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* User Profile / Auth Action */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[11px] font-bold uppercase">
                  {user.fullName ? user.fullName[0] : user.email[0]}
                </div>
                <span className="max-w-[100px] truncate">{user.fullName || user.email}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{user.fullName || 'User'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenSettingsModal();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Database Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Login / Sign Up</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Supabase Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Reset Demo Data (if in demo mode or guest) */}
          {(!isSupabase || isGuest) && (
            <button
              onClick={onResetData}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors"
              title="Reset Sample Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Add Expense Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
};
