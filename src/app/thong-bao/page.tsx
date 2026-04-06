'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, Calendar, ChevronRight, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { stripHtml } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAnnouncements() {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setAnnouncements(data);
    }
    fetchAnnouncements();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Thông Báo Quan Trọng</h1>
          <p className="opacity-90 text-lg">Cập nhật các thông báo khẩn cấp và thông tin từ Trạm Y tế</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Thông báo</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {announcements.length > 0 ? announcements.map((ann) => (
                <div key={ann.id} className="bg-white rounded-2xl p-6 shadow-[var(--shadow)] border border-[var(--gray-100)] hover:border-[var(--primary)] transition-all group">
                  <div className="flex gap-5 items-start">
                    <div className="w-14 h-14 bg-[var(--primary-light)] rounded-xl flex items-center justify-center text-[var(--primary)] shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                      <Megaphone className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-[var(--primary)] uppercase tracking-wider">Thông báo</span>
                        <span className="text-[12px] text-[var(--gray-400)] flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" /> {new Date(ann.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--gray-800)] leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors">
                        {ann.title}
                      </h3>
                      <p className="text-[14px] text-[var(--gray-600)] leading-relaxed">
                        {stripHtml(ann.content || "")}
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="space-y-6">
                  {[
                    { title: "Lịch tiêm chủng mở rộng tháng 04/2026", date: "30/03/2026", content: "Trạm Y tế Cái Bầu thông báo lịch tiêm chủng mở rộng tháng 04/2026 cho trẻ em từ 0-24 tháng tuổi vào sáng thứ 4 hàng tuần. Kính mời các bậc phụ huynh đưa con em đến đúng giờ." },
                    { title: "Thông báo về việc khám sức khỏe định kỳ cho người cao tuổi", date: "28/03/2026", content: "Thực hiện kế hoạch chăm sóc sức khỏe người cao tuổi, Trạm Y tế tổ chức khám sức khỏe định kỳ cho các cụ từ 60 tuổi trở lên vào sáng thứ 5 tuần tới." },
                    { title: "Khuyến cáo phòng chống dịch bệnh mùa hè", date: "25/03/2026", content: "Để chủ động phòng chống dịch bệnh mùa hè, đặc biệt là sốt xuất huyết và tay chân miệng, Trạm Y tế khuyến cáo người dân thực hiện các biện pháp vệ sinh môi trường, diệt lăng quăng." },
                  ].map((ann, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-[var(--shadow)] border border-[var(--gray-100)] hover:border-[var(--primary)] transition-all group">
                      <div className="flex gap-5 items-start">
                        <div className="w-14 h-14 bg-[var(--primary-light)] rounded-xl flex items-center justify-center text-[var(--primary)] shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                          <Megaphone className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-[var(--primary)] uppercase tracking-wider">Thông báo</span>
                            <span className="text-[12px] text-[var(--gray-400)] flex items-center gap-1 font-medium">
                              <Calendar className="w-3 h-3" /> {ann.date}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[var(--gray-800)] leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors">
                            {ann.title}
                          </h3>
                          <p className="text-[14px] text-[var(--gray-600)] leading-relaxed">
                            {ann.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-[var(--primary-light)] rounded-3xl p-8 border border-[var(--primary)] border-opacity-10">
                <h3 className="text-xl font-bold text-[var(--primary)] mb-4 flex items-center gap-3">
                  <Info className="w-6 h-6" /> Lưu ý quan trọng
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-[14px] text-[var(--gray-700)] leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-2"></div>
                    Các thông báo khẩn cấp sẽ được cập nhật liên tục trên website và loa phát thanh xã.
                  </li>
                  <li className="flex gap-3 text-[14px] text-[var(--gray-700)] leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-2"></div>
                    Người dân nên theo dõi thường xuyên để không bỏ lỡ các đợt tiêm chủng và khám sức khỏe định kỳ.
                  </li>
                  <li className="flex gap-3 text-[14px] text-[var(--gray-700)] leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-2"></div>
                    Mọi thắc mắc về nội dung thông báo, xin vui lòng liên hệ trực tiếp tại Trạm hoặc qua hotline.
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow)] border border-[var(--gray-100)]">
                <h3 className="text-lg font-bold text-[var(--gray-800)] mb-4 pb-2 border-b-2 border-[var(--primary)] inline-block">Liên kết nhanh</h3>
                <ul className="space-y-2">
                  {[
                    { label: "Lịch khám bệnh", href: "/dich-vu" },
                    { label: "Kiến thức phòng bệnh", href: "/suc-khoe" },
                    { label: "Tải mẫu văn bản", href: "/tai-lieu" },
                    { label: "Gửi phản hồi", href: "/lien-he" },
                  ].map((link, i) => (
                    <li key={i}>
                      <Link href={link.href} className="flex items-center justify-between py-2.5 text-[14px] text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors group">
                        <span className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[var(--primary)]" /> {link.label}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ArrowRight(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
  )
}
