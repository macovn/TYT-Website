'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Loader2, AlertCircle, Phone, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/utils';

export default function PublicPage() {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching page:', error);
      } else {
        setPage(data);
      }
      setLoading(false);
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
          <p className="text-gray-500 font-medium">Đang tải nội dung...</p>
        </div>
      </div>
    );
  }

  if (!page && !loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy trang</h2>
          <Link href="/" className="text-[var(--primary)] font-bold hover:underline flex items-center gap-2 justify-center">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">{page.title}</h1>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Giới thiệu</span>
            <span className="opacity-50">/</span>
            <span>{page.title}</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[var(--gray-800)] prose-p:text-[var(--gray-600)] prose-p:leading-relaxed prose-img:rounded-2xl"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content || '<p class="text-gray-400 italic">Nội dung đang được cập nhật...</p>') }}
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-[24px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--gray-800)] mb-6 pb-2 border-b-2 border-[var(--primary)] inline-block">Giới thiệu</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/gioi-thieu/gioi-thieu-tram" className={`flex items-center justify-between py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${slug === 'gioi-thieu-tram' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-[var(--gray-600)] hover:bg-gray-50'}`}>
                      <span>Giới thiệu trạm</span>
                      <ChevronRight className={`w-4 h-4 ${slug === 'gioi-thieu-tram' ? 'text-white' : 'text-[var(--primary)]'}`} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/gioi-thieu/chuc-nang-nhiem-vu" className={`flex items-center justify-between py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${slug === 'chuc-nang-nhiem-vu' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-[var(--gray-600)] hover:bg-gray-50'}`}>
                      <span>Chức năng nhiệm vụ</span>
                      <ChevronRight className={`w-4 h-4 ${slug === 'chuc-nang-nhiem-vu' ? 'text-white' : 'text-[var(--primary)]'}`} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/gioi-thieu/co-cau-to-chuc" className={`flex items-center justify-between py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${slug === 'co-cau-to-chuc' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-[var(--gray-600)] hover:bg-gray-50'}`}>
                      <span>Cơ cấu tổ chức</span>
                      <ChevronRight className={`w-4 h-4 ${slug === 'co-cau-to-chuc' ? 'text-white' : 'text-[var(--primary)]'}`} />
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="bg-[var(--primary)] rounded-[24px] p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-[var(--accent)] inline-block">Hỗ trợ khẩn cấp</h3>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[var(--accent)]">0203.3822.115</div>
                      <div className="text-[12px] opacity-70">Đường dây cấp cứu 24/7</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold">Làm việc: 7:00 – 17:00</div>
                      <div className="text-[12px] opacity-70">Thứ 2 – Thứ 6 hàng tuần</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-[13px] leading-relaxed opacity-90">
                      Thôn Đông Hải, Đặc khu Vân Đồn, Tỉnh Quảng Ninh
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
