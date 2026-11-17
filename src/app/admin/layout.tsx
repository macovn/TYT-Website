import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

// WO-WEB-01: Kiểm tra quyền phía server cho toàn bộ khu /admin.
// Trước đây mọi trang admin tự kiểm tra đăng nhập ở client (useEffect +
// getSession) — chỉ là lớp giao diện. Layout này chạy trên server:
// chưa có phiên hoặc role không thuộc {admin, editor} thì chuyển về
// /admin/login. Ngưỡng role {admin, editor} khớp trang đăng nhập hiện
// hành; riêng quản trị tài khoản vẫn chỉ dành cho admin (API route
// create-user/delete-user kiểm tra role = 'admin' phía server).
// Trang /admin/login được bỏ qua nhờ header x-pathname do middleware gắn.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // WO-WEB-27: Next 16 — headers() la API bat dong bo, phai await.
  const pathname = (await headers()).get('x-pathname') || '';

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Chưa cấu hình Supabase: giữ hành vi cũ (các trang con tự báo lỗi
  // cấu hình) thay vì khóa toàn bộ khu admin.
  if (!supabaseUrl || !supabaseAnonKey) {
    return <>{children}</>;
  }

  // WO-WEB-27: thay createServerComponentClient (auth-helpers da khai
  // tu) bang createServerClient cua @supabase/ssr; cookies() cung la API
  // bat dong bo tu Next 15.
  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component khong dat duoc cookie; middleware da lo
          // lam moi phien dang nhap.
        }
      },
    },
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
