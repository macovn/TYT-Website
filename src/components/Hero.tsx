'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, CalendarCheck, Phone, Clock, Syringe } from 'lucide-react';

function tinhTrangThaiMoCua(d: Date): boolean {
  const day = d.getDay(); // 0 = Chủ nhật, 1-5 = Thứ 2 - Thứ 6
  if (day < 1 || day > 5) return false;
  const phut = d.getHours() * 60 + d.getMinutes();
  return phut >= 7 * 60 + 30 && phut < 16 * 60 + 30;
}

export default function Hero() {
  const [moCua, setMoCua] = useState<boolean | null>(null);

  useEffect(() => {
    const capNhat = () => setMoCua(tinhTrangThaiMoCua(new Date()));
    capNhat();
    const id = setInterval(capNhat, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 items-start">
          <div>
            <div className="hero-badge">
              <MapPin className="w-4 h-4 text-[var(--primary)]" />
              <span>Khu phố Đông Xá 3, Đặc khu Vân Đồn, thành phố Quảng Ninh</span>
            </div>
            <h1 className="text-[34px] md:text-[42px] font-extrabold leading-[1.2] mb-4 text-[var(--gray-800)]">
              Chăm sóc sức khỏe<br />vì cộng đồng
            </h1>
            <p className="text-[17px] text-[var(--gray-600)] leading-relaxed mb-7 max-w-xl">
              Trạm Y tế Cái Bầu cung cấp dịch vụ chăm sóc sức khỏe ban đầu cho người dân
              Đặc khu Vân Đồn và các vùng lân cận: khám chữa bệnh, tiêm chủng, quản lý
              bệnh mãn tính và y tế dự phòng.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dich-vu-y-te" className="btn-hero-primary">
                <CalendarCheck className="w-5 h-5" /> Xem dịch vụ y tế
              </Link>
              <a href="tel:02033795898" className="btn-hero-secondary">
                <Phone className="w-5 h-5" /> Gọi trạm: 0203 3795 898
              </a>
            </div>
          </div>

          <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius)] p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-[17px] font-bold text-[var(--gray-800)] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--primary)]" /> Giờ làm việc
              </h2>
              {moCua !== null && (
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--gray-600)]">
                  <span className={`w-2 h-2 rounded-full ${moCua ? 'bg-[var(--green)]' : 'bg-[var(--red)]'}`}></span>
                  {moCua ? 'Đang mở cửa' : 'Ngoài giờ làm việc'}
                </span>
              )}
            </div>
            <ul className="text-[15px] text-[var(--gray-700)] space-y-2 leading-relaxed">
              <li className="flex justify-between gap-3">
                <span>Thứ 2 – Thứ 6</span>
                <strong className="text-[var(--gray-800)]">7:30 – 16:30</strong>
              </li>
            </ul>

            <div className="border-t border-[var(--gray-200)] mt-5 pt-4">
              <h3 className="text-[15px] font-bold text-[var(--gray-800)] flex items-center gap-2 mb-1.5">
                <Syringe className="w-5 h-5 text-[var(--primary)]" /> Tiêm chủng mở rộng
              </h3>
              <p className="text-[15px] text-[var(--gray-700)] leading-relaxed">
                Ngày <strong>18, 24, 25</strong> hằng tháng (trừ Thứ 7, Chủ nhật).
              </p>
            </div>

            <div className="border-t border-[var(--gray-200)] mt-5 pt-4 text-center">
              <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--gray-500)] mb-1.5">
                Trực cấp cứu 24/7
              </div>
              <a
                href="tel:02033822115"
                className="text-[26px] font-extrabold text-[var(--red)] leading-none hover:underline"
              >
                0203.3822.115
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
