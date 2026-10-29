'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ChevronRight, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--primary-dark)] text-white/80 pt-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1.15fr] gap-9 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-white overflow-hidden relative shrink-0">
                <Image src="/images/logo-tram.svg" alt="Logo Trạm Y tế Cái Bầu" fill className="object-contain" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">TRẠM Y TẾ CÁI BẦU</h3>
                <p className="text-[12px] opacity-60">Đặc khu Vân Đồn – Quảng Ninh</p>
              </div>
            </div>
            <ul className="text-[13px] space-y-2">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9FD8C9] shrink-0 mt-0.5" />
                <span>Khu phố Đông Xá 3, Đặc khu Vân Đồn, thành phố Quảng Ninh</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#9FD8C9] shrink-0 mt-0.5" />
                <span>0203.3795.898 – Cấp cứu: 0203.3822.115</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#9FD8C9] shrink-0 mt-0.5" />
                <span>lienhe@tramytecaibau.vn</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#9FD8C9] shrink-0 mt-0.5" />
                <span>T2-T6: 7:30–16:30 | Cấp cứu: 24/7</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 pb-2.5 border-b-2 border-[var(--primary)] inline-block">Tin tức & Thông báo</h4>
            <ul className="text-[13px] space-y-2">
              <li><Link href="/tin-tuc" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Tin tức hoạt động</Link></li>
              <li><Link href="/thong-bao" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Thông báo</Link></li>
              <li><Link href="/suc-khoe" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Kiến thức sức khỏe</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 pb-2.5 border-b-2 border-[var(--primary)] inline-block">Dịch vụ & Tài liệu</h4>
            <ul className="text-[13px] space-y-2">
              <li><Link href="/dich-vu-y-te" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Dịch vụ y tế</Link></li>
              <li><Link href="/tai-lieu" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Tài liệu y tế</Link></li>
              <li><Link href="/thu-vien" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Thư viện ảnh</Link></li>
              <li><Link href="/hoi-dap" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Hỏi đáp</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 pb-2.5 border-b-2 border-[var(--primary)] inline-block">Thông tin khác</h4>
            <ul className="text-[13px] space-y-2">
              <li><Link href="/gioi-thieu/gioi-thieu-tram" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Giới thiệu trạm</Link></li>
              <li><Link href="/lien-he" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Liên hệ</Link></li>
              <li><a href="https://syt.quangninh.gov.vn" target="_blank" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Sở Y tế Quảng Ninh</a></li>
              <li><a href="https://moh.gov.vn" target="_blank" className="hover:text-[#9FD8C9] transition-colors flex items-center gap-1.5 before:content-['›'] before:text-[var(--primary)]">Bộ Y tế Việt Nam</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-4 pb-2.5 border-b-2 border-[var(--primary)] inline-block">Mạng xã hội</h4>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/tramytecaibau"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Fanpage Facebook Trạm Y tế Cái Bầu"
                title="Fanpage Facebook Trạm Y tế Cái Bầu"
                className="w-10 h-10 rounded-full bg-white text-[var(--primary-dark)] flex items-center justify-center hover:bg-[var(--primary-light)] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@TramYTeCaiBau"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kênh YouTube Trạm Y tế Cái Bầu"
                title="Kênh YouTube Trạm Y tế Cái Bầu"
                className="w-10 h-10 rounded-full bg-white text-[var(--primary-dark)] flex items-center justify-center hover:bg-[var(--primary-light)] transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <p className="text-[13px] mt-3.5 leading-relaxed">Theo dõi Fanpage và kênh YouTube của Trạm để cập nhật thông báo, lịch tiêm chủng và kiến thức sức khỏe.</p>
          </div>
        </div>
      </div>
      <div className="bg-black/20 py-4.5 mt-0">
        <div className="container">
          <div className="flex flex-wrap justify-between items-center gap-2 text-[12.5px] py-4">
            <span>© 2026 Trạm Y tế Cái Bầu – Đặc khu Vân Đồn – thành phố Quảng Ninh</span>
            <span>Thiết kế bởi: <span className="text-[#9FD8C9]">Trương Thái Nguyên</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
