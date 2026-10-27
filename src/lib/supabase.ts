import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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

// WO-WEB-01: Phía trình duyệt dùng cookie-based client của
// @supabase/auth-helpers-nextjs thay cho supabase-js thuần (vốn lưu phiên
// ở localStorage). Nhờ phiên nằm trong cookie, middleware và layout phía
// server mới kiểm chứng được đăng nhập + role cho khu /admin.
// Phía server (SSR/generateMetadata) giữ client anon thuần: chỉ đọc dữ
// liệu công khai, không mang phiên người dùng.
// Use placeholders only if keys are missing to avoid crash, but log error
// TODO: For enhanced security against XSS, consider moving session management to HttpOnly cookies
// instead of the default localStorage used by Supabase client.
function createBrowserClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    return createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-key'
    );
  }
  return createClientComponentClient();
}

export const supabase: SupabaseClient =
  typeof window !== 'undefined'
    ? createBrowserClient()
    : createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key'
      );
