import Hero from "@/components/Hero";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import NewsSection from "@/components/NewsSection";
import ServicesSection from "@/components/ServicesSection";
import Link from "next/link";
import { Stethoscope, Syringe, Heart, Activity } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <Hero />
      <AnnouncementTicker />
      
      {/* QUICK ACCESS */}
      <div className="quick-access">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <Link href="/dich-vu" className="quick-item">
              <Stethoscope className="w-8 h-8 mx-auto mb-3 text-[var(--accent)]" />
              <h3 className="text-sm font-bold mb-1">Khám bệnh</h3>
              <p className="text-[12px] opacity-75">T2–T6: 7:00–17:00</p>
            </Link>
            <Link href="/dich-vu" className="quick-item">
              <Syringe className="w-8 h-8 mx-auto mb-3 text-[var(--accent)]" />
              <h3 className="text-sm font-bold mb-1">Tiêm chủng</h3>
              <p className="text-[12px] opacity-75">Thứ 4 hàng tuần</p>
            </Link>
            <Link href="/suc-khoe" className="quick-item">
              <Heart className="w-8 h-8 mx-auto mb-3 text-[var(--accent)]" />
              <h3 className="text-sm font-bold mb-1">Tư vấn sức khỏe</h3>
              <p className="text-[12px] opacity-75">Miễn phí cho người dân</p>
            </Link>
              <Link href="/lien-he" className="quick-item">
                <Activity className="w-8 h-8 mx-auto mb-3 text-[var(--accent)]" />
                <h3 className="text-sm font-bold mb-1">Cấp cứu 24/7</h3>
                <p className="text-[12px] opacity-75">Gọi ngay: 0203.3822.115</p>
              </Link>
          </div>
        </div>
      </div>

      <NewsSection />
      <ServicesSection />

      {/* STAFF SECTION (Static for now, can be moved to DB later) */}
      <section className="py-14">
        <div className="container">
          <div className="text-center mb-9">
            <div className="section-tag">Đội ngũ</div>
            <h2 className="text-3xl font-bold text-[var(--gray-800)] font-serif">Đội Ngũ Cán Bộ Y Tế</h2>
            <p className="text-[15px] text-[var(--gray-500)] max-w-lg mx-auto leading-relaxed mt-2">
              Đội ngũ y bác sĩ tận tâm, có chuyên môn cao, luôn sẵn sàng phục vụ sức khỏe người dân
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "BS. Nguyễn Văn An", pos: "Trạm trưởng", dept: "Bác sĩ đa khoa" },
              { name: "Y sĩ Trần Thị Bình", pos: "Trạm phó", dept: "Y sĩ đa khoa" },
              { name: "ĐD. Lê Thị Cúc", pos: "Điều dưỡng trưởng", dept: "Cử nhân Điều dưỡng" },
            ].map((staff, i) => (
              <div key={i} className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow)] border border-[var(--gray-100)] text-center p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary-mid)] mx-auto mb-4 flex items-center justify-center text-[var(--primary)] border-4 border-[var(--primary-light)]">
                  <span className="text-2xl font-bold">{staff.name.split(' ').pop()?.[0]}</span>
                </div>
                <h3 className="text-[16px] font-bold text-[var(--gray-800)] mb-1">{staff.name}</h3>
                <div className="text-[13px] font-bold text-[var(--primary)] uppercase mb-1">{staff.pos}</div>
                <div className="text-[12px] text-[var(--gray-500)]">{staff.dept}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
