'use client';

import Link from 'next/link';
import { MapPin, CalendarCheck, Phone } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="hero-badge">
              <MapPin className="w-4 h-4 text-[var(--accent)]" /> Thôn Đông Hải – Đặc khu Vân Đồn – Quảng Ninh
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4 font-serif">
              Chăm Sóc Sức Khỏe<br />Vì Cộng Đồng
            </h2>
            <p className="text-base opacity-90 leading-relaxed mb-7 max-w-lg">
              Trạm Y tế Cái Bầu cung cấp dịch vụ chăm sóc sức khỏe ban đầu toàn diện cho người dân Đặc khu Vân Đồn và các vùng lân cận. Chúng tôi cam kết mang đến dịch vụ y tế chất lượng, tận tâm và miễn phí.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dich-vu" className="btn-hero-primary">
                <CalendarCheck className="w-4 h-4" /> Xem dịch vụ y tế
              </Link>
              <Link href="/lien-he" className="btn-hero-secondary">
                <Phone className="w-4 h-4" /> Liên hệ ngay
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="quick-item">
              <div className="text-3xl font-extrabold text-[var(--accent)] mb-1">1.200+</div>
              <div className="text-[12.5px] opacity-85 font-medium">Lượt khám/tháng</div>
            </div>
            <div className="quick-item">
              <div className="text-3xl font-extrabold text-[var(--accent)] mb-1">95%</div>
              <div className="text-[12.5px] opacity-85 font-medium">Tỷ lệ tiêm chủng</div>
            </div>
            <div className="quick-item">
              <div className="text-3xl font-extrabold text-[var(--accent)] mb-1">6</div>
              <div className="text-[12.5px] opacity-85 font-medium">Cán bộ y tế</div>
            </div>
            <div className="quick-item">
              <div className="text-3xl font-extrabold text-[var(--accent)] mb-1">24/7</div>
              <div className="text-[12.5px] opacity-85 font-medium">Hỗ trợ cấp cứu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
