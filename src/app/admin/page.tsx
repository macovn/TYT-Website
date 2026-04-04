'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Newspaper, Send, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'published'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('posts')
      .insert([formData]);

    setLoading(false);
    if (!error) {
      setMessage('Đã tạo bài viết thành công!');
      setFormData({ title: '', content: '', status: 'published' });
    } else {
      console.error('Supabase Insert Error (posts):', error);
      setMessage('Lỗi: ' + error.message + ' (Xem console để biết chi tiết)');
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    setMessage('');
    
    const examplePosts = [
      {
        title: 'Thông báo lịch tiêm chủng mở rộng tháng 4/2026',
        content: 'Trạm Y tế Cái Bầu thông báo lịch tiêm chủng mở rộng cho trẻ em trong độ tuổi vào sáng thứ 4 hàng tuần. Kính mời các bậc phụ huynh đưa con em đến đúng giờ, mang theo sổ tiêm chủng và thẻ BHYT.',
        status: 'published',
        views: Math.floor(Math.random() * 100)
      },
      {
        title: 'Chiến dịch vệ sinh môi trường phòng chống sốt xuất huyết',
        content: 'Trước diễn biến phức tạp của thời tiết, Trạm Y tế phối hợp cùng đoàn thanh niên xã tổ chức ra quân dọn dẹp vệ sinh, diệt lăng quăng tại các khu dân cư. Đề nghị người dân chủ động lật úp các dụng cụ chứa nước không cần thiết.',
        status: 'published',
        views: Math.floor(Math.random() * 100)
      },
      {
        title: 'Khám sức khỏe định kỳ cho người cao tuổi xã Cái Bầu',
        content: 'Trong tuần tới, Trạm Y tế sẽ tổ chức đợt khám sức khỏe tổng quát, đo huyết áp và tư vấn dinh dưỡng miễn phí cho người cao tuổi trên địa bàn xã. Thời gian từ 7h30 đến 11h00 các ngày trong tuần.',
        status: 'published',
        views: Math.floor(Math.random() * 100)
      },
      {
        title: 'Hướng dẫn phòng ngừa các bệnh đường hô hấp khi giao mùa',
        content: 'Thời tiết giao mùa là điều kiện thuận lợi cho vi khuẩn, virus phát triển. Trạm Y tế khuyến cáo người dân cần giữ ấm cơ thể, đeo khẩu trang nơi công cộng và bổ sung đầy đủ vitamin để tăng cường sức đề kháng.',
        status: 'published',
        views: Math.floor(Math.random() * 100)
      },
      {
        title: 'Tổ chức lớp tập huấn sơ cấp cứu cơ bản cho giáo viên',
        content: 'Nhằm nâng cao năng lực xử lý tình huống khẩn cấp tại trường học, Trạm Y tế đã tổ chức buổi tập huấn kỹ năng sơ cứu, băng bó vết thương và hà hơi thổi ngạt cho đội ngũ giáo viên các trường mầm non, tiểu học trên địa bàn.',
        status: 'published',
        views: Math.floor(Math.random() * 100)
      },
      {
        title: 'Thông báo về việc cấp phát thuốc BHYT tại Trạm',
        content: 'Hiện tại danh mục thuốc Bảo hiểm Y tế tại Trạm đã được bổ sung đầy đủ các loại thuốc điều trị bệnh mãn tính như cao huyết áp, tiểu đường. Người dân có thẻ BHYT đăng ký tại trạm vui lòng đến khám để được cấp thuốc.',
        status: 'published',
        views: Math.floor(Math.random() * 100)
      },
      {
        title: 'Tuyên truyền về an toàn thực phẩm tại các cơ sở kinh doanh',
        content: 'Đoàn kiểm tra liên ngành y tế xã đã tiến hành kiểm tra và hướng dẫn các hộ kinh doanh ăn uống thực hiện đúng quy định về vệ sinh an toàn thực phẩm, đảm bảo sức khỏe cho cộng đồng.',
        status: 'published',
        views: Math.floor(Math.random() * 100)
      },
      {
        title: 'Tầm quan trọng của việc tiêm vắc xin phòng cúm hàng năm',
        content: 'Tiêm phòng cúm là biện pháp hiệu quả nhất để bảo vệ bản thân và gia đình khỏi các biến chứng nguy hiểm của bệnh cúm. Trạm Y tế hiện có sẵn vắc xin cúm dịch vụ cho người dân có nhu cầu.',
        status: 'published',
        views: Math.floor(Math.random() * 100)
      },
      {
        title: 'Hướng dẫn chăm sóc trẻ bị sốt tại nhà đúng cách',
        content: 'Khi trẻ bị sốt, cha mẹ cần bình tĩnh theo dõi nhiệt độ, cho trẻ mặc quần áo thoáng mát, uống nhiều nước và sử dụng thuốc hạ sốt theo đúng liều lượng chỉ định của bác sĩ. Nếu sốt cao không hạ cần đưa ngay đến cơ sở y tế.',
        status: 'published',
        views: Math.floor(Math.random() * 100)
      },
      {
        title: 'Kỷ niệm ngày Thầy thuốc Việt Nam tại Trạm Y tế Cái Bầu',
        content: 'Buổi lễ kỷ niệm diễn ra trong không khí ấm cúng, nhằm tri ân những đóng góp của đội ngũ y bác sĩ, nhân viên y tế đang công tác tại trạm, luôn hết lòng vì sự nghiệp chăm sóc sức khỏe nhân dân.',
        status: 'published',
        views: Math.floor(Math.random() * 100)
      }
    ];

    const { error } = await supabase
      .from('posts')
      .insert(examplePosts);

    setLoading(false);
    if (!error) {
      setMessage('Đã thêm 10 bài viết ví dụ thành công!');
    } else {
      console.error('Supabase Seed Error (posts):', error);
      setMessage('Lỗi khi thêm dữ liệu: ' + error.message + ' (Xem console để biết chi tiết)');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)] py-12">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl border border-[var(--gray-100)] overflow-hidden">
          <div className="bg-[var(--primary)] p-8 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <PlusCircle className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Quản trị bài viết</h1>
              </div>
              <button 
                onClick={handleSeedData}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Thêm 10 bài mẫu
              </button>
            </div>
            <p className="opacity-80">Tạo bài viết mới cho trang tin tức</p>
          </div>

          <div className="p-8">
            {message && (
              <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${message.includes('Lỗi') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--gray-700)]">Tiêu đề bài viết</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  placeholder="Nhập tiêu đề..." 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--gray-700)]">Nội dung bài viết</label>
                <textarea 
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all min-h-[200px]"
                  placeholder="Nhập nội dung bài viết..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Đang xử lý...' : <><Send className="w-5 h-5" /> Đăng bài viết</>}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-[var(--gray-100)] flex justify-between items-center">
              <Link href="/tin-tuc" className="text-sm font-bold text-[var(--primary)] hover:underline flex items-center gap-1">
                <Newspaper className="w-4 h-4" /> Xem trang tin tức
              </Link>
              <Link href="/" className="text-sm font-bold text-[var(--gray-500)] hover:underline">
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
