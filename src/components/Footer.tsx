'use client';

import Link from 'next/link';
import { PlusCircle, MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--gray-800)] text-white/75 pt-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">TRẠM Y TẾ CÁI BẦU</h3>
                <p className="text-[12px] opacity-60">Đặc khu Vân Đồn – Quảng Ninh</p>
              </div>
            </div>
            <p className="text-[13.5px] leading-relaxed mb-5">
              Cung cấp dịch vụ chăm sóc sức khỏe ban đầu toàn diện, miễn phí và chất lượng cho người dân Đặc khu Vân Đồn và các vùng lân cận. Chúng tôi cam kết phục vụ cộng đồng với tinh thần tận tâm.
            </p>
            <ul className="text-[13px] space-y-2">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>Thôn Đông Hải, Đặc khu Vân Đồn, Tỉnh Quảng Ninh</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>0203.3795.898 – Cấp cứu: 0203.3822.115</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>lienhe@tramytecaibau.vn</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>T2–T6: 7:00–17:00 | Cấp cứu: 24/7</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 pb-2.5 border-b-2 border-[var(--primary)] inline-block">Trang chủ</h4>
            <ul className="text-[13px] space-y-2">
              <li><Link href="/gioi-thieu" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Giới thiệu trạm</Link></li>
              <li><Link href="/gioi-thieu" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Cán bộ y tế</Link></li>
              <li><Link href="/tin-tuc" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Tin tức hoạt động</Link></li>
              <li><Link href="/tin-tuc" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Thông báo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 pb-2.5 border-b-2 border-[var(--primary)] inline-block">Dịch vụ</h4>
            <ul className="text-[13px] space-y-2">
              <li><Link href="/dich-vu" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Khám chữa bệnh</Link></li>
              <li><Link href="/dich-vu" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Tiêm chủng</Link></li>
              <li><Link href="/dich-vu" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">SK Sinh sản</Link></li>
              <li><Link href="/dich-vu" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Bệnh mãn tính</Link></li>
              <li><Link href="/dich-vu" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Y tế dự phòng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 pb-2.5 border-b-2 border-[var(--primary)] inline-block">Liên kết</h4>
            <ul className="text-[13px] space-y-2">
              <li><a href="https://syt.quangninh.gov.vn" target="_blank" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Sở Y tế Quảng Ninh</a></li>
              <li><a href="https://moh.gov.vn" target="_blank" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Bộ Y tế Việt Nam</a></li>
              <li><Link href="/tai-lieu" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Tài liệu y tế</Link></li>
              <li><Link href="/thu-vien" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Thư viện ảnh</Link></li>
              <li><Link href="/lien-he" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-black/20 py-4.5 mt-0">
        <div className="container">
          <div className="flex flex-wrap justify-between items-center gap-2 text-[12.5px] py-4">
            <span>© 2026 Trạm Y tế Cái Bầu – Đặc khu Vân Đồn – Tỉnh Quảng Ninh</span>
            <span>Thiết kế bởi <a href="#" className="text-[var(--accent)]">Hệ thống Y tế Quảng Ninh</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
