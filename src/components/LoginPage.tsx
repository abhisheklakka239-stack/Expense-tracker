import React, { useState } from 'react';
import { IndianRupee, Lock, Mail, User, Eye, EyeOff, LogIn, UserPlus, Database, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onOpenSettingsModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onOpenSettingsModal }) => {
  const { signIn, signUp, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await signIn(email, password);
        if (res.error) {
          setError(res.error);
        }
      } else {
        const res = await signUp(email, password, fullName);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccessMessage('Account created successfully! Logging you in...');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center relative overflow-hidden font-sans p-4 sm:p-6">
      {/* Background Glow Effects */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-5xl w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-md shadow-emerald-500/20">
            <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Expense Tracker</span>
        </div>

        <button
          onClick={onOpenSettingsModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Supabase Config</span>
        </button>
      </header>

      {/* Main Centered Login Box */}
      <main className="relative z-10 w-full max-w-md my-auto py-8">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 backdrop-blur-xl">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-emerald-500/25 mb-4 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <IndianRupee className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login'
                ? 'Sign in to access your INR Expense Tracker'
                : 'Sign up to start tracking expenses with Supabase'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/70 text-red-300 text-xs font-medium animate-in fade-in">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/70 text-emerald-300 text-xs font-medium animate-in fade-in">
                {successMessage}
              </div>
            )}

            {/* Full Name field (Sign Up mode only) */}
            {mode === 'signup' && (
              <div className="animate-in fade-in">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login / Sign Up Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle link below form */}
          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            {mode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1 cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1 cursor-pointer"
                >
                  Login
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Mode Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={continueAsGuest}
              className="text-[11px] text-slate-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Or continue in Demo Mode</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-2 text-center text-[11px] text-slate-600">
        © 2026 Expense Tracker • Powered by Supabase Auth & React
      </footer>
    </div>
  );
};
