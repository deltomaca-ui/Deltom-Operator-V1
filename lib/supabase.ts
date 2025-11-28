import { createClient } from '@supabase/supabase-js';

// Configuration placeholder - to be replaced with actual env vars in production
// Since we don't have the user's keys yet, we use placeholders to prevent crash on init
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);