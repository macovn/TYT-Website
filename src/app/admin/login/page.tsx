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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
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
