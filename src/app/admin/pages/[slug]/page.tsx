'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Save, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/Editor';

export default function AdminPageEdit() {
  const [page, setPage] = useState<any>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const fetchPage = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching page:', error);
      setMessage({ type: 'error', text: 'Không tìm thấy trang này.' });
    } else {
      setPage(data);
      setContent(data.content || '');
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      // Hardcoded admin bypass
      if (session.user.email === 'macovn@gmail.com') {
        fetchPage();
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
        router.push('/');
        return;
      }

      fetchPage();
    };

    checkAuth();
  }, [router, slug, fetchPage]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from('pages')
      .update({ 
        content: content,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug);

    if (error) {
      console.error('Error updating page:', error);
      setMessage({ type: 'error', text: 'Lỗi khi lưu: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Cập nhật nội dung thành công!' });
      // Auto hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
          <p className="text-gray-500 font-medium">Đang tải nội dung...</p>
        </div>
      </div>
    );
  }

  if (!page && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy trang</h2>
          <Link href="/admin/pages" className="text-[var(--primary)] font-bold hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/pages" className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-all">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa: {page.title}</h1>
              <p className="text-sm text-gray-500">Đường dẫn: /gioi-thieu/{page.slug}</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-bold text-sm">{message.text}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung trang</label>
            <RichTextEditor 
              content={content} 
              onChange={(html) => setContent(html)} 
            />
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-all shadow-lg disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
