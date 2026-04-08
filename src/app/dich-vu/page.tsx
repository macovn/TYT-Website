import { Stethoscope, Syringe, Heart, Baby, ShieldCheck, Activity, Info, Phone } from "lucide-react";
import Link from "next/link";

const services = [
  {
    name: "Khám chữa bệnh",
    icon: <Stethoscope className="w-8 h-8" />,
    desc: "Khám và điều trị các bệnh thông thường, cấp phát thuốc BHYT cho người dân trong xã. Bác sĩ thực hiện thăm khám, chẩn đoán, kê đơn thuốc và theo dõi điều trị. Người có thẻ BHYT được khám miễn phí hoặc giảm chi phí theo quy định.",
    schedule: "T2–T6: 7:30–11:30 và 13:30–16:30"
  },
  {
    name: "Tiêm chủng mở rộng",
    icon: <Syringe className="w-8 h-8" />,
    desc: "Tiêm chủng đầy đủ các loại vaccine trong chương trình tiêm chủng mở rộng quốc gia cho trẻ em từ 0–24 tháng và phụ nữ có thai. Hoàn toàn miễn phí. Đăng ký trước ngày tiêm để được sắp xếp lịch hợp lý.",
    schedule: "Thứ 4 hàng tuần: 7:30–11:00"
  },
  {
    name: "Quản lý bệnh mãn tính",
    icon: <Heart className="w-8 h-8" />,
    desc: "Theo dõi và quản lý bệnh nhân mắc bệnh mãn tính như tăng huyết áp, đái tháo đường, COPD tại cộng đồng. Người bệnh được cấp thuốc BHYT, đo huyết áp, đường huyết và tư vấn chế độ ăn uống sinh hoạt.",
    schedule: "T2 và T5: 7:30–10:30"
  },
  {
    name: "Chăm sóc SK Sinh sản",
    icon: <Baby className="w-8 h-8" />,
    desc: "Khám thai định kỳ, quản lý thai nghén, tư vấn kế hoạch hóa gia đình, chăm sóc bà mẹ trước và sau sinh, sức khỏe trẻ em. Theo dõi cân nặng và phát triển của trẻ từ 0–5 tuổi.",
    schedule: "T3 và T6: 7:30–11:00"
  },
  {
    name: "Y tế dự phòng",
    icon: <ShieldCheck className="w-8 h-8" />,
    desc: "Phòng chống dịch bệnh, giám sát dịch tễ, vệ sinh môi trường, an toàn thực phẩm, kiểm soát vector truyền bệnh (muỗi, chuột, gián). Phun thuốc diệt muỗi theo đợt khi có dịch.",
    schedule: "Hàng ngày trong giờ hành chính"
  },
  {
    name: "Cấp cứu ban đầu",
    icon: <Activity className="w-8 h-8" />,
    desc: "Xử lý cấp cứu ban đầu: băng bó vết thương, hồi sức, xử lý ngộ độc, đột quỵ, chấn thương. Ổn định người bệnh trước khi chuyển lên tuyến trên. Luôn có cán bộ trực 24/7.",
    schedule: "24/7 – Hotline: 0203.3822.115"
  }
];

export default function ServicesPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <div key={i} className="bg-white rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow)] border border-[var(--gray-100)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
                <div className="flex gap-6 items-start mb-6">
                  <div className="w-16 h-16 bg-[var(--primary-light)] rounded-2xl flex items-center justify-center text-[var(--primary)] shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--gray-800)] mb-2">{service.name}</h3>
                    <div className="flex items-center gap-2 text-[13px] text-[var(--primary)] font-bold bg-[var(--primary-light)] px-3 py-1.5 rounded-lg inline-flex">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {service.schedule}
                    </div>
                  </div>
                </div>
                <p className="text-[14.5px] text-[var(--gray-600)] leading-relaxed mb-6">
                  {service.desc}
                </p>
                <button className="text-[var(--primary)] font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                  Tìm hiểu thêm <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
              </div>
            ))}
          </div>

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
