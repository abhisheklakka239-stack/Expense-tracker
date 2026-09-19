import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'inr_expense_supabase_url';
const STORAGE_KEY_KEY = 'inr_expense_supabase_key';

const DEFAULT_URL = 'https://fhnggwlwpctddhdsehqg.supabase.co';
const DEFAULT_KEY = 'sb_publishable_E5ZgZxW-Jz5MtZbjOwsYQQ_wtbClt46';

export const getStoredSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

  const storedUrl = localStorage.getItem(STORAGE_KEY_URL) || envUrl;
  const storedKey = localStorage.getItem(STORAGE_KEY_KEY) || envKey;

  return {
    url: storedUrl,
    anonKey: storedKey,
    isEnvProvided: Boolean(envUrl && envKey),
    isConfigured: Boolean(storedUrl && storedKey),
  };
};

export const setStoredSupabaseCredentials = (url: string, anonKey: string) => {
  if (url && anonKey) {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getStoredSupabaseCredentials();

  if (!url || !anonKey) {
    return null;
  }

  // Create or return existing client
  if (!clientInstance) {
    try {
      clientInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
        },
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return clientInstance;
};

export const reinitializeSupabaseClient = (url: string, anonKey: string): SupabaseClient | null => {
  setStoredSupabaseCredentials(url, anonKey);
  clientInstance = null;
  return getSupabaseClient();
};

/**
 * Tests connection to Supabase database.
 */
export const testSupabaseConnection = async (url: string, anonKey: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const tempClient = createClient(url, anonKey);
    // Simple query to verify connection
    const { error } = await tempClient.from('expenses').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means 0 rows returned, which is fine!
      if (error.message.includes('relation "expenses" does not exist') || error.code === '42P01') {
        return { success: true, error: 'Connected to Supabase! Note: The "expenses" table is not created yet. Run the SQL schema script provided.' };
      }
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid URL or connection failed';
    return { success: false, error: message };
  }
};
