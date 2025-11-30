import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ⚠️ NOTE DEV : Fallback pour environnement de preview
const ENV_URL = import.meta.env?.VITE_SUPABASE_URL;
const ENV_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY;

const FALLBACK_URL = "https://ftrvezaqopbrwiczvems.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cnZlemFxb3BicndpY3p2ZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyOTQ3NzUsImV4cCI6MjA3OTg3MDc3NX0.HGETO0FE7dH62vLd9aew0tfxXgfCJP-T_l3rOlTS0S0";

const SUPABASE_URL = ENV_URL || FALLBACK_URL;
const SUPABASE_ANON_KEY = ENV_KEY || FALLBACK_KEY;

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: 'sb-auth-token',
      },
      global: {
        headers: {
          'X-Client-Info': 'cleaning-platform-v2'
        }
      }
    })
  : null;

export type { SupabaseClient };