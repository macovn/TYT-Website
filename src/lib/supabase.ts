import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Supabase environment variables are missing!");
    console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Present" : "MISSING");
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Present" : "MISSING");
  } else {
    console.log("Supabase initialized with URL:", supabaseUrl);
  }
}

// Use placeholders only if keys are missing to avoid crash, but log error
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
