import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variable extraction with support for various naming conventions
const metaEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : null) || {};
const procEnv = (typeof process !== 'undefined' ? process.env : null) || {};

const supabaseUrl = 
  metaEnv.VITE_SUPABASE_URL ||
  metaEnv.VITE_API_URL ||
  procEnv.API_URL ||
  procEnv.SUPABASE_URL ||
  '';

const supabaseAnonKey = 
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  metaEnv.VITE_PUBLISHABLE_KEY ||
  procEnv.PUBLISHABLE_KEY ||
  procEnv.SUPABASE_ANON_KEY ||
  '';

let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (clientInstance) return clientInstance;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return clientInstance;
    } catch (err) {
      console.warn('Erro ao inicializar cliente Supabase no frontend:', err);
      return null;
    }
  }

  return null;
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
