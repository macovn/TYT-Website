import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// WO-WEB-01: Lớp chặn phía server cho khu quản trị.
// - Gắn header x-pathname để admin layout (server component) biết trang
//   hiện tại và bỏ qua kiểm tra cho riêng /admin/login.
// - Chưa có phiên đăng nhập (cookie) mà vào /admin/* (trừ /admin/login)
//   thì chuyển về trang đăng nhập ngay từ server, trước khi trang kịp tải.
// Biên bảo mật thật vẫn là RLS trong Supabase (vá B1/B2); middleware này
// là lớp chặn sớm, không thay thế RLS.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const isLoginPage = pathname === '/admin/login';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isLoginPage && supabaseUrl && supabaseAnonKey) {
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
