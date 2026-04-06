'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Stethoscope, 
  Syringe, 
  Heart, 
  Baby, 
  ShieldCheck, 
  Activity, 
  Info, 
  Phone,
  ChevronRight,
  Loader2
} from "lucide-react";
import Link from "next/link";

const ICON_MAP: { [key: string]: any } = {
  Stethoscope: <Stethoscope className="w-8 h-8" />,
  Syringe: <Syringe className="w-8 h-8" />,
  Heart: <Heart className="w-8 h-8" />,
  Baby: <Baby className="w-8 h-8" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8" />,
  Activity: <Activity className="w-8 h-8" />,
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: true });
      
      if (data) setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Dịch Vụ Y Tế</h1>
          <p className="opacity-90 text-lg">Các dịch vụ chăm sóc sức khỏe miễn phí và chất lượng cho người dân</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Dịch vụ y tế</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
              <p className="text-gray-500 font-medium">Đang tải danh sách dịch vụ...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow)] border border-[var(--gray-100)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
                  <div className="flex gap-6 items-start mb-6">
                    <div className="w-16 h-16 bg-[var(--primary-light)] rounded-2xl flex items-center justify-center text-[var(--primary)] shrink-0">
                      {ICON_MAP[service.icon] || <Stethoscope className="w-8 h-8" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--gray-800)] mb-2">{service.name}</h3>
                      <div className="flex items-center gap-2 text-[13px] text-[var(--primary)] font-bold bg-[var(--primary-light)] px-3 py-1.5 rounded-lg inline-flex">
                        <Activity className="w-4 h-4" />
                        Đang hoạt động
                      </div>
                    </div>
                  </div>
                  <p className="text-[14.5px] text-[var(--gray-600)] leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link href="/lien-he" className="text-[var(--primary)] font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                    Tìm hiểu thêm <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">Chưa có dịch vụ nào được cập nhật.</p>
            </div>
          )}

          <div className="bg-[var(--primary-light)] rounded-[var(--radius-lg)] p-8 mt-12 text-center border border-[var(--primary)] border-opacity-10">
            <h3 className="text-xl font-bold text-[var(--primary)] mb-3 flex items-center justify-center gap-2">
              <Info className="w-6 h-6" /> Lưu ý khi đến khám
            </h3>
            <p className="text-[14.5px] text-[var(--gray-600)] max-w-2xl mx-auto mb-6 leading-relaxed">
              Mang theo Thẻ BHYT, CMND/CCCD và sổ y bạ (nếu có). Đến đúng giờ và thực hiện các biện pháp phòng dịch theo quy định. Phụ nữ mang thai, trẻ em và người cao tuổi được ưu tiên khám trước.
            </p>
            <Link href="/lien-he" className="btn-hero-primary inline-flex">
              <Phone className="w-4 h-4" /> Đặt lịch hoặc hỏi thêm
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
