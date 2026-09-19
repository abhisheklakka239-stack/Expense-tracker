import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { getStoredSupabaseCredentials, testSupabaseConnection, reinitializeSupabaseClient } from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    const creds = getStoredSupabaseCredentials();
    setUrl(creds.url);
    setAnonKey(creds.anonKey);
    setStatusMessage(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter both Supabase URL and Anon Key.' });
      return;
    }

    setIsTesting(true);
    setStatusMessage({ type: 'info', text: 'Connecting to Supabase...' });

    const result = await testSupabaseConnection(url.trim(), anonKey.trim());

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: result.error || 'Successfully connected to Supabase database!',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: `Connection failed: ${result.error}`,
      });
    }

    setIsTesting(false);
  };

  const handleSave = () => {
    reinitializeSupabaseClient(url.trim(), anonKey.trim());
    onConfigChanged();
    onClose();
  };

  const handleClear = () => {
    setUrl('');
    setAnonKey('');
    reinitializeSupabaseClient('', '');
    setStatusMessage({ type: 'info', text: 'Cleared Supabase credentials. Switched to Demo / LocalStorage mode.' });
    onConfigChanged();
  };

  const copySqlSchema = () => {
    const sqlText = `-- Supabase INR Expense Tracker Table Schema
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'UPI',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all" ON public.expenses FOR ALL USING (true);`;

    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-4 h-4" />
            </span>
            <span>Supabase Database Settings</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-400">
            Connect your Supabase project to store your expenses live in the cloud. Get your URL and Anon key from your{' '}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1"
            >
              Supabase Dashboard <ExternalLink className="w-3 h-3" />
            </a>
          </p>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-red-950/50 border-red-800/60 text-red-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Project URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Supabase Project URL
            </label>
            <input
              type="url"
              placeholder="https://your-project-id.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Anon Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Supabase Anon Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* SQL Schema Copy Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-semibold text-slate-300 block">Database Table Schema</span>
              <span className="text-slate-500">Includes `expenses` table SQL script</span>
            </div>
            <button
              onClick={copySqlSchema}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Switch to Demo Mode
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-400/20 transition-colors"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
