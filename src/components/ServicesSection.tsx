'use client';

import Link from 'next/link';
import { Stethoscope, Syringe, Heart, Baby, ShieldCheck, Activity, Clock } from 'lucide-react';

const services = [
  {
    name: "Khám chữa bệnh",
    icon: <Stethoscope className="w-6 h-6" />,
    desc: "Khám và điều trị các bệnh thông thường, cấp phát thuốc BHYT cho người dân trong xã.",
    schedule: "T2–T6: 7:30–11:30 và 13:30–16:30"
  },
  {
    name: "Tiêm chủng mở rộng",
    icon: <Syringe className="w-6 h-6" />,
    desc: "Tiêm chủng đầy đủ các loại vaccine theo chương trình tiêm chủng mở rộng quốc gia, miễn phí.",
    schedule: "Thứ 4 hàng tuần: 7:30–11:00"
  },
  {
    name: "Quản lý bệnh mãn tính",
    icon: <Heart className="w-6 h-6" />,
    desc: "Theo dõi và quản lý bệnh nhân mắc tăng huyết áp, đái tháo đường, COPD và các bệnh mãn tính.",
    schedule: "T2 và T5: 7:30–10:30"
  },
  {
    name: "SK Sinh sản",
    icon: <Baby className="w-6 h-6" />,
    desc: "Khám thai, tư vấn kế hoạch hóa gia đình, chăm sóc bà mẹ trước và sau sinh.",
    schedule: "T3 và T6: 7:30–11:00"
  },
  {
    name: "Y tế dự phòng",
    icon: <ShieldCheck className="w-6 h-6" />,
    desc: "Phòng chống dịch bệnh, vệ sinh môi trường, an toàn thực phẩm, kiểm soát vector truyền bệnh.",
    schedule: "Hàng ngày trong giờ hành chính"
  },
  {
    name: "Cấp cứu ban đầu",
    icon: <Activity className="w-6 h-6" />,
    desc: "Xử lý cấp cứu ban đầu, ổn định người bệnh trước khi chuyển lên tuyến trên.",
    schedule: "24/7 – Gọi: 0203.3822.115"
  }
];

export default function ServicesSection() {
  return (
    <section className="py-14 bg-[var(--gray-50)]">
      <div className="container">
        <div className="flex justify-between items-end mb-9">
          <div>
            <div className="section-tag"><ShieldCheck className="w-4 h-4" /> Dịch vụ</div>
            <h2 className="text-3xl font-bold text-[var(--gray-800)] font-serif">Dịch Vụ Y Tế</h2>
          </div>
          <Link href="/dich-vu" className="flex items-center gap-1.5 text-[var(--primary)] font-semibold text-[13.5px] px-4.5 py-2 border-1.5 border-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-all">
            Xem chi tiết <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <div key={i} className="service-card group">
              <div className="w-[52px] h-[52px] bg-[var(--primary-light)] rounded-[14px] flex items-center justify-center mb-4 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                {service.icon}
              </div>
              <h3 className="text-[15px] font-bold text-[var(--gray-800)] mb-2">{service.name}</h3>
              <p className="text-[13px] text-[var(--gray-500)] leading-[1.7] mb-3">{service.desc}</p>
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--primary)] font-bold bg-[var(--primary-light)] px-2.5 py-1.5 rounded-md">
                <Clock className="w-3.5 h-3.5" /> {service.schedule}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  )
}
