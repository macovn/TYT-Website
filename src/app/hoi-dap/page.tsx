'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const faqs = [
  {
    q: "Thủ tục khám bệnh tại Trạm Y tế Cái Bầu cần những gì?",
    a: "Khi đến khám bệnh, người dân cần mang theo Thẻ Bảo hiểm Y tế (BHYT) còn hạn sử dụng, Chứng minh nhân dân hoặc Căn cước công dân (CCCD). Đối với trẻ em dưới 6 tuổi, nếu chưa có thẻ BHYT thì mang theo Giấy khai sinh."
  },
  {
    q: "Lịch tiêm chủng mở rộng hàng tháng diễn ra vào khi nào?",
    a: "Lịch tiêm chủng mở rộng tại Trạm Y tế Cái Bầu thường diễn ra vào sáng thứ 4 hàng tuần. Tuy nhiên, lịch cụ thể có thể thay đổi tùy theo kế hoạch của Trung tâm Y tế huyện. Chúng tôi sẽ cập nhật thông báo cụ thể trên website và loa phát thanh xã trước mỗi đợt tiêm."
  },
  {
    q: "Trạm Y tế có khám bệnh vào ngày thứ 7 và Chủ nhật không?",
    a: "Trạm Y tế Cái Bầu làm việc theo giờ hành chính từ thứ 2 đến thứ 6. Vào các ngày thứ 7, Chủ nhật và ngày lễ, trạm không tổ chức khám bệnh thông thường nhưng luôn có cán bộ y tế trực 24/24 để xử lý các trường hợp cấp cứu khẩn cấp."
  },
  {
    q: "Làm thế nào để được cấp thuốc Bảo hiểm Y tế tại Trạm?",
    a: "Người dân có thẻ BHYT đăng ký khám chữa bệnh ban đầu tại Trạm Y tế Cái Bầu hoặc các cơ sở y tế tương đương sẽ được khám và cấp thuốc theo danh mục thuốc BHYT quy định. Bác sĩ sẽ kê đơn dựa trên tình trạng bệnh lý sau khi thăm khám."
  },
  {
    q: "Trạm Y tế có dịch vụ xét nghiệm máu không?",
    a: "Hiện tại, Trạm Y tế Cái Bầu thực hiện được một số xét nghiệm nhanh cơ bản như xét nghiệm đường huyết, test nhanh HIV, test nhanh sốt xuất huyết. Đối với các xét nghiệm chuyên sâu hơn, trạm sẽ thực hiện lấy mẫu gửi lên tuyến trên hoặc hướng dẫn người bệnh đến Trung tâm Y tế huyện."
  }
];

export default function QAPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: '', question: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('questions')
      .insert([formData]);
    setLoading(false);
    if (!error) {
      setSuccess(true);
      setFormData({ name: '', question: '' });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      console.error('Supabase Insert Error (questions):', error);
      alert('Có lỗi xảy ra: ' + error.message + '. Vui lòng kiểm tra console.');
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Hỏi Đáp Y Tế</h1>
          <p className="opacity-90 text-lg">Giải đáp các thắc mắc thường gặp về dịch vụ và sức khỏe</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Hỏi đáp</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-[var(--shadow)] border border-[var(--gray-100)] overflow-hidden transition-all">
                    <button 
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--gray-50)] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${openIndex === i ? 'bg-[var(--primary)] text-white' : 'bg-[var(--primary-light)] text-[var(--primary)]'}`}>
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-[16px] font-bold text-[var(--gray-800)] leading-snug">{faq.q}</h3>
                      </div>
                      {openIndex === i ? <ChevronUp className="w-5 h-5 text-[var(--gray-400)]" /> : <ChevronDown className="w-5 h-5 text-[var(--gray-400)]" />}
                    </button>
                    {openIndex === i && (
                      <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                        <div className="pl-14">
                          <div className="h-px bg-[var(--gray-100)] mb-4"></div>
                          <p className="text-[14.5px] text-[var(--gray-600)] leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-white rounded-3xl p-8 shadow-[var(--shadow)] border border-[var(--gray-100)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center text-[var(--primary)]">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--gray-800)]">Gửi câu hỏi của bạn</h3>
                    <p className="text-[14px] text-[var(--gray-500)]">Chúng tôi sẽ phản hồi sớm nhất qua website</p>
                  </div>
                </div>

                {success && (
                  <div className="bg-[var(--green-light)] text-[var(--green)] p-4 rounded-xl mb-6 font-bold text-sm">
                    Cảm ơn bạn! Câu hỏi đã được gửi thành công.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--gray-700)]">Họ và tên</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                      placeholder="Nguyễn Văn A" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--gray-700)]">Nội dung câu hỏi</label>
                    <textarea 
                      required
                      value={formData.question}
                      onChange={(e) => setFormData({...formData, question: e.target.value})}
                      className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all min-h-[120px]"
                      placeholder="Nhập câu hỏi của bạn tại đây..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Đang gửi...' : <><Send className="w-5 h-5" /> Gửi câu hỏi</>}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow)] border border-[var(--gray-100)]">
                <h3 className="text-lg font-bold text-[var(--gray-800)] mb-4 pb-2 border-b-2 border-[var(--primary)] inline-block">Chủ đề quan tâm</h3>
                <div className="flex flex-wrap gap-2">
                  {["Bảo hiểm y tế", "Tiêm chủng", "Khám bệnh", "Cấp cứu", "Dinh dưỡng", "Phòng dịch", "Sức khỏe trẻ em", "Kế hoạch hóa"].map((tag, i) => (
                    <button key={i} className="px-4 py-2 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl text-[13px] font-semibold text-[var(--gray-600)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--primary)] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-bold mb-4 relative z-10">Tư vấn trực tiếp</h3>
                <p className="text-[14px] opacity-85 mb-6 leading-relaxed relative z-10">
                  Bạn cần tư vấn y tế gấp? Hãy gọi trực tiếp cho cán bộ y tế trực của chúng tôi.
                </p>
                <div className="text-2xl font-extrabold text-[var(--accent)] mb-2 flex items-center gap-2 relative z-10">
                  0203.3822.115
                </div>
                <div className="text-[12px] opacity-75 relative z-10">Phục vụ 24/7 cho các trường hợp khẩn cấp</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
