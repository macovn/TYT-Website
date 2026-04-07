'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Megaphone, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Printer,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AnnouncementDetailPage() {
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching announcement:', error);
      } else {
        setAnnouncement(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <Loader2 className="animate-spin text-[var(--primary)] mb-4" size={48} />
        <p className="text-gray-500 font-medium">Đang tải nội dung...</p>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 px-6 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-500" size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy thông báo</h1>
        <p className="text-gray-600 max-w-md mb-8">
          Thông báo này có thể đã bị xóa hoặc không còn tồn tại. Vui lòng quay lại trang danh sách.
        </p>
        <Link 
          href="/thong-bao"
          className="bg-[var(--primary)] text-white px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      {/* Breadcrumbs & Header */}
      <section className="bg-white border-b border-gray-100 pt-12 pb-8">
        <div className="container">
          <Link 
            href="/thong-bao"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--primary)] font-medium mb-8 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Quay lại danh sách thông báo
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full font-medium">
                <Calendar size={14} />
                {new Date(announcement.created_at).toLocaleDateString('vi-VN')}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {new Date(announcement.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
              {announcement.title}
            </h1>

            <div className="flex items-center gap-4 border-t border-gray-100 pt-8">
              <button className="flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] font-medium transition-colors">
                <Share2 size={18} />
                Chia sẻ
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] font-medium transition-colors"
              >
                <Printer size={18} />
                In thông báo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[var(--primary)] prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />
          </div>
        </div>
      </section>

      {/* Related Info */}
      <section className="py-12 bg-gray-100/50">
        <div className="container">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-[var(--primary)] rounded-3xl p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                <Megaphone size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Cần hỗ trợ thêm?</h3>
                <p className="text-white/80">Liên hệ ngay với trạm y tế để được giải đáp thắc mắc.</p>
              </div>
            </div>
            <Link 
              href="/lien-he"
              className="bg-white text-[var(--primary)] px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg whitespace-nowrap"
            >
              Liên hệ ngay
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
