'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Activity, Send, Facebook, Youtube } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('messages')
      .insert([formData]);

    setLoading(false);
    if (!error) {
      setSuccess(true);
      setFormData({ full_name: '', phone: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Liên Hệ</h1>
          <p className="opacity-90 text-lg">Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp thắc mắc của bạn</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Liên hệ</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="grid gap-4">
                {[
                  { icon: <MapPin />, label: "Địa chỉ", value: "Thôn Đông Hải, Đặc khu Vân Đồn, Tỉnh Quảng Ninh" },
                  { icon: <Phone />, label: "Điện thoại", value: "0203.3795.898" },
                  { icon: <Activity className="text-[var(--red)]" />, label: "Đường dây cấp cứu", value: "0203.3822.115", highlight: true },
                  { icon: <Mail />, label: "Email", value: "lienhe@tramytecaibau.vn" },
                  { icon: <Clock />, label: "Giờ làm việc", value: "T2–T6: 7:00–17:00 | T7 & CN: Cấp cứu 24/7" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 bg-white p-5 rounded-xl shadow-[var(--shadow)] border border-[var(--gray-100)] items-start">
                    <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center text-[var(--primary)] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[13px] text-[var(--gray-500)] font-bold uppercase mb-1">{item.label}</h4>
                      <p className={`text-[15px] font-bold ${item.highlight ? 'text-[var(--red)] text-xl' : 'text-[var(--gray-800)]'}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--gray-100)] p-4 h-[350px] overflow-hidden flex items-center justify-center text-[var(--gray-400)]">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50 text-[var(--primary)]" />
                  <p className="font-bold text-[var(--gray-700)]">Bản đồ Trạm Y tế Cái Bầu</p>
                  <p className="text-[13px]">Thôn Đông Hải, Đặc khu Vân Đồn, Quảng Ninh</p>
                  <a 
                    href="https://www.google.com/maps/search/Tr%E1%BA%A1m+Y+t%E1%BA%BF+C%C3%A1i+B%E1%BA%A7u+V%C3%A2n+%C4%90%E1%BB%93n" 
                    target="_blank" 
                    className="mt-4 inline-flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    Xem trên Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow)] border border-[var(--gray-100)] p-8">
              <h3 className="text-2xl font-bold text-[var(--gray-800)] mb-6 flex items-center gap-3">
                <Send className="w-6 h-6 text-[var(--primary)]" /> Gửi tin nhắn cho chúng tôi
              </h3>
              
              {success && (
                <div className="bg-[var(--green-light)] text-[var(--green)] p-4 rounded-lg mb-6 font-bold text-sm">
                  Cảm ơn bạn! Tin nhắn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--gray-700)]">Họ và tên *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)] transition-all"
                      placeholder="Nguyễn Văn A" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--gray-700)]">Số điện thoại</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)] transition-all"
                      placeholder="0912.345.678" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--gray-700)]">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)] transition-all"
                    placeholder="email@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--gray-700)]">Chủ đề</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)] transition-all"
                    placeholder="Hỏi về dịch vụ y tế..." 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--gray-700)]">Nội dung tin nhắn *</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)] transition-all min-h-[120px]"
                    placeholder="Nhập nội dung tin nhắn của bạn tại đây..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--primary-dark)] transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Đang gửi...' : <><Send className="w-5 h-5" /> Gửi tin nhắn</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
