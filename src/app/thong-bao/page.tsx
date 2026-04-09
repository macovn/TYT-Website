'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Megaphone, 
  Calendar, 
  ChevronRight, 
  Clock, 
  ArrowRight,
  Search,
  Filter,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/utils';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
      } else {
        setAnnouncements(data || []);
      }
      setLoading(false);
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Megaphone size={18} />
              <span>Thông tin từ Trạm Y tế</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
              Thông báo & <br />
              <span className="text-[var(--accent)]">Tin tức mới nhất</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Cập nhật các thông tin quan trọng về lịch tiêm chủng, khám sức khỏe định kỳ và các hoạt động y tế tại xã Cái Bầu.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20 -mt-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm thông báo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-medium px-4">
                  <Filter size={18} />
                  <span>Sắp xếp: Mới nhất</span>
                </div>
              </div>

              {/* Announcements List */}
              <div className="space-y-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Loader2 className="animate-spin text-[var(--primary)] mb-4" size={40} />
                    <p className="text-gray-500 font-medium">Đang tải thông báo...</p>
                  </div>
                ) : filteredAnnouncements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center px-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="text-gray-300" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy thông báo</h3>
                    <p className="text-gray-500 max-w-md">
                      Hiện tại chưa có thông báo nào phù hợp với tìm kiếm của bạn. Vui lòng thử lại với từ khóa khác.
                    </p>
                  </div>
                ) : (
                  filteredAnnouncements.map((a, index) => (
                    <article 
                      key={a.id} 
                      className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[var(--primary)]/20 transition-all group animate-in fade-in slide-in-from-bottom-10 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full font-medium">
                              <Calendar size={14} />
                              {new Date(a.created_at).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} />
                              {new Date(a.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[var(--primary)] transition-colors leading-tight">
                            {a.title}
                          </h2>
                          
                          <div 
                            className="text-gray-600 line-clamp-3 mb-6 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(a.content) }}
                          />
                          
                          <Link 
                            href={`/thong-bao/${a.id}`}
                            className="inline-flex items-center gap-2 text-[var(--primary)] font-bold hover:gap-4 transition-all"
                          >
                            Xem chi tiết
                            <ArrowRight size={18} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 space-y-8">
              {/* Important Info Card */}
              <div className="bg-[var(--primary)] rounded-3xl p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-20">
                  <Megaphone size={120} />
                </div>
                <h3 className="text-xl font-bold mb-4 relative z-10">Liên hệ khẩn cấp</h3>
                <p className="text-white/80 mb-6 relative z-10">
                  Trong trường hợp khẩn cấp, vui lòng liên hệ trực tiếp với trạm y tế qua số điện thoại:
                </p>
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl relative z-10">
                  <p className="text-sm font-medium text-white/70 mb-1">Hotline 24/7</p>
                  <p className="text-2xl font-bold">0203.3858.123</p>
                </div>
              </div>

              {/* Categories/Tags (Optional) */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Danh mục</h3>
                <div className="space-y-2">
                  {['Tất cả thông báo', 'Lịch tiêm chủng', 'Khám sức khỏe', 'Phòng chống dịch'].map((cat) => (
                    <button 
                      key={cat}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-[var(--primary)] transition-all group"
                    >
                      <span className="font-medium">{cat}</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-[var(--primary)]" />
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
