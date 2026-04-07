'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      setError("Hệ thống chưa được cấu hình Supabase. Vui lòng kiểm tra biến môi trường trên Vercel.");
      setLoading(false);
      return;
    }

    // 1. LOGIN BẰNG SUPABASE
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 2. CHECK ERROR
    if (error) {
      console.error("Login Error:", error);
      
      if (error.message.includes("API key")) {
        setError("Lỗi: API Key không hợp lệ. Vui lòng kiểm tra lại NEXT_PUBLIC_SUPABASE_ANON_KEY trên Vercel.");
      } else if (error.message === "Invalid login credentials") {
        setError("Sai tài khoản hoặc mật khẩu");
      } else if (error.message.includes("Email logins are disabled")) {
        setError("Lỗi: Đăng nhập bằng Email đang bị tắt trong Supabase Dashboard. Vui lòng vào Authentication -> Providers -> Email và BẬT nó lên.");
      } else {
        setError(`Lỗi đăng nhập: ${error.message}`);
      }
      
      setLoading(false);
      return;
    }

    if (data.user) {
      // ... existing success logic ...
      // QUICK FIX: Hardcode admin email bypass (vẫn giữ để đảm bảo admin chính luôn vào được)
      const ADMIN_EMAIL = "macovn@gmail.com";
      if (data.user.email === ADMIN_EMAIL) {
        router.push('/admin/dashboard');
        return;
      }

      // 3. LẤY ROLE
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      // 4. CHECK ROLE
      if (!profile || profile.role === 'viewer') {
        await supabase.auth.signOut();
        setError("Không có quyền truy cập");
        setLoading(false);
        return;
      }

      // 5. CHO VÀO ADMIN
      router.push('/admin/dashboard');
    }
  };

  const handleInitializeAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'admin' }),
      });
      const result = await response.json();
      if (response.ok) {
        setError("Đã khởi tạo Admin thành công! Vui lòng nhấn Đăng nhập lại.");
      } else {
        setError("Lỗi khởi tạo: " + result.error);
      }
    } catch (err: any) {
      setError("Lỗi kết nối: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] p-6">
      <div className="bg-white rounded-[32px] p-10 shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[var(--primary-light)] rounded-3xl flex items-center justify-center text-[var(--primary)] mx-auto mb-4">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--gray-800)]">Quản Trị Hệ Thống</h2>
          <p className="text-sm text-[var(--gray-500)] mt-1">Trạm Y tế Cái Bầu – Admin Panel</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100">
            {error}
            {error.includes("cấu hình") && (
              <div className="mt-2 text-[10px] font-normal opacity-80">
                URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "Chưa có"}<br/>
                Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Đã có" : "Chưa có"}
              </div>
            )}
            {error === "Sai tài khoản hoặc mật khẩu" && email === "macovn@gmail.com" && (
              <div className="mt-4 pt-4 border-t border-red-200">
                <p className="text-[11px] font-normal mb-2">Nếu đây là lần đầu bạn sử dụng hệ thống này, hãy nhấn nút bên dưới để khởi tạo tài khoản Admin với email và mật khẩu bạn vừa nhập.</p>
                <button 
                  onClick={handleInitializeAdmin}
                  className="w-full bg-red-600 text-white py-2 rounded-lg text-xs hover:bg-red-700 transition-all"
                >
                  Khởi tạo Admin
                </button>
              </div>
            )}
            {error?.includes("Email logins are disabled") && (
              <div className="mt-4 pt-4 border-t border-red-200">
                <p className="text-[11px] font-normal mb-2 text-red-700 font-bold">HƯỚNG DẪN CỐ ĐỊNH:</p>
                <ol className="text-[10px] font-normal list-decimal pl-4 space-y-1 mt-1">
                  <li>Vào <b>Supabase Dashboard</b></li>
                  <li>Chọn dự án của bạn</li>
                  <li>Vào <b>Authentication</b> {'>'} <b>Providers</b></li>
                  <li>Tìm <b>Email</b> và đảm bảo nó đang ở trạng thái <b>Enabled</b></li>
                  <li>Trong cùng trang đó, hãy TẮT <b>Confirm email</b> nếu bạn không muốn xác nhận qua mail.</li>
                </ol>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--gray-700)]">Email đăng nhập</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)] transition-all"
              placeholder="admin@example.com" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--gray-700)]">Mật khẩu</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)] transition-all"
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--primary-dark)] transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : <><LogIn className="w-5 h-5" /> Đăng nhập</>}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
