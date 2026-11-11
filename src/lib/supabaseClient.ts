import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase';

/**
 * true hanya jika VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY benar-benar diisi di .env.local.
 * (config/supabase.ts memiliki nilai fallback placeholder, jadi tidak bisa dipakai sebagai penanda.)
 */
export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.roleKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
