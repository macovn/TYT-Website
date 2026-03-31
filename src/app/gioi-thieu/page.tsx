import { Building2, ClipboardList, Info, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Giới Thiệu Trạm Y Tế</h1>
          <p className="opacity-90 text-lg">Cái Bầu – Vân Đồn – Quảng Ninh</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <span>Trang chủ</span>
            <span className="opacity-50">/</span>
            <span>Giới thiệu</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4 text-[var(--primary)]">
                <Building2 className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Giới thiệu Trạm Y tế Cái Bầu</h3>
              </div>
              <div className="space-y-4 text-[var(--gray-600)] leading-relaxed">
                <p>
                  Trạm Y tế Cái Bầu là cơ sở y tế cấp cơ sở thuộc hệ thống y tế nhà nước, trực thuộc Trung tâm Y tế Đặc khu Vân Đồn, tỉnh Quảng Ninh. Trạm được thành lập và đi vào hoạt động nhằm cung cấp dịch vụ chăm sóc sức khỏe ban đầu cho người dân trên địa bàn Đặc khu Vân Đồn.
                </p>
                <p>
                  Với đội ngũ 6 cán bộ y tế có chuyên môn, trạm phục vụ trên 2.000 hộ dân với hơn 8.000 nhân khẩu. Trạm hoạt động theo nguyên tắc công bằng, hiệu quả và phát triển, lấy người dân làm trung tâm phục vụ.
                </p>
              </div>

              <div className="mt-10">
                <div className="flex items-center gap-3 mb-6 text-[var(--primary)]">
                  <ClipboardList className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Chức năng nhiệm vụ</h3>
                </div>
                <div className="grid gap-3">
                  {[
                    "Cung cấp dịch vụ chăm sóc sức khỏe ban đầu: khám bệnh, điều trị, cấp phát thuốc BHYT",
                    "Thực hiện các chương trình y tế quốc gia: tiêm chủng mở rộng, phòng chống suy dinh dưỡng, HIV/AIDS",
                    "Phòng chống dịch bệnh, kiểm soát các bệnh truyền nhiễm trong cộng đồng",
                    "Chăm sóc sức khỏe bà mẹ – trẻ em, kế hoạch hóa gia đình",
                    "Quản lý bệnh mãn tính, theo dõi người bệnh tại cộng đồng",
                    "Truyền thông giáo dục sức khỏe, nâng cao nhận thức người dân về phòng bệnh",
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-[var(--primary-light)] rounded-xl items-start">
                      <div className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <p className="text-[13.5px] text-[var(--gray-700)] font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)] border border-[var(--gray-100)]">
                <h4 className="text-lg font-bold text-[var(--gray-800)] mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-[var(--primary)]" /> Thông tin cơ bản
                </h4>
                <div className="divide-y divide-[var(--gray-100)]">
                  {[
                    { label: "Tên đơn vị", value: "Trạm Y tế Cái Bầu" },
                    { label: "Trực thuộc", value: "TT Y tế Đặc khu Vân Đồn" },
                    { label: "Tỉnh/Thành", value: "Quảng Ninh" },
                    { label: "Trạm trưởng", value: "BS. Nguyễn Văn An" },
                    { label: "Số cán bộ", value: "6 người" },
                    { label: "Phân hạng", value: "Hạng IV" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between py-3 text-[13.5px]">
                      <span className="font-bold text-[var(--gray-800)]">{row.label}</span>
                      <span className="text-[var(--gray-600)] text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)] border border-[var(--gray-100)]">
                <h4 className="text-lg font-bold text-[var(--gray-800)] mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--primary)]" /> Lịch hoạt động
                </h4>
                <div className="divide-y divide-[var(--gray-100)]">
                  {[
                    { label: "Thứ 2 – Thứ 6", value: "7:00 – 17:00" },
                    { label: "Buổi sáng", value: "7:00 – 11:30" },
                    { label: "Buổi chiều", value: "13:30 – 17:00" },
                    { label: "Thứ 7 – CN", value: "Nghỉ (cấp cứu 24/7)" },
                    { label: "Tiêm chủng", value: "Thứ 4 hàng tuần" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between py-3 text-[13.5px]">
                      <span className="font-bold text-[var(--gray-800)]">{row.label}</span>
                      <span className="text-[var(--gray-600)] text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
