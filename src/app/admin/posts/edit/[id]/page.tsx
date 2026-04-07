'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import { extractFirstImage } from '@/lib/utils';
import { Newspaper, Send, ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'published'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [role, setRole] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    console.log("FETCH CALLED - fetchPost", id);
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      setMessage('Lỗi: Không tìm thấy bài viết');
    } else if (data) {
      setFormData({
        title: data.title,
        content: data.content,
        status: data.status
      });
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const ADMIN_EMAIL = "macovn@gmail.com";
      if (session.user.email === ADMIN_EMAIL) {
        if (mounted) {
          setRole('admin');
          fetchPost();
        }
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (mounted) {
        if (profile && (profile.role === 'admin' || profile.role === 'editor')) {
          setRole(profile.role);
          fetchPost();
        } else {
          router.push('/');
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router, fetchPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const thumbnail = extractFirstImage(formData.content);
      const { error } = await supabase
        .from('posts')
        .update({
          title: formData.title,
          content: formData.content,
          thumbnail,
          status: formData.status
        })
        .eq('id', id);

      if (!error) {
        setMessage('Đã cập nhật bài viết thành công!');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        console.error('Supabase Update Error (posts):', error);
        setMessage('Lỗi: ' + error.message);
      }
    } catch (err) {
      console.error('CRASH DURING UPDATE:', err);
      setMessage('Lỗi runtime: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--gray-50)] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
        <p className="text-gray-500 font-medium">Đang tải dữ liệu bài viết...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)] py-12">
      <div className="container max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa bài viết</h1>
            <p className="text-sm text-gray-500">Cập nhật nội dung bài viết đã đăng</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-[var(--gray-100)] overflow-hidden">
          <div className="bg-[var(--primary)] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Newspaper className="w-6 h-6" />
              <h2 className="text-xl font-bold">Nội dung bài viết</h2>
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              ID: {id.substring(0, 8)}...
            </span>
          </div>

          <div className="p-8">
            {message && (
              <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${message.includes('Lỗi') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--gray-700)] uppercase tracking-wider">Tiêu đề bài viết</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[var(--primary)] transition-all"
                  placeholder="Nhập tiêu đề..." 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--gray-700)] uppercase tracking-wider">Nội dung chi tiết</label>
                <Editor 
                  content={formData.content}
                  onChange={(html) => setFormData({...formData, content: html})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Link 
                  href="/admin/dashboard"
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl text-center hover:bg-gray-200 transition-all"
                >
                  Hủy bỏ
                </Link>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-[var(--primary)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 shadow-lg"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <><Save className="w-5 h-5" /> Lưu thay đổi</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
