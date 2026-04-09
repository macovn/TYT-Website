'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { sanitizeHtml } from '@/lib/utils';

// Mock data as requested
const posts = [
  {
    slug: "kham-sang-loc-2026",
    title: "Chiến dịch khám sàng lọc sức khỏe cộng đồng năm 2026",
    content: `
      <p>Nhằm nâng cao chất lượng chăm sóc sức khỏe cho người dân trên địa bàn xã Cái Bầu, Trạm Y tế phối hợp với Trung tâm Y tế huyện Vân Đồn tổ chức chiến dịch khám sàng lọc sức khỏe cộng đồng năm 2026.</p>
      
      <h3>1. Đối tượng tham gia</h3>
      <p>Tất cả người dân có hộ khẩu thường trú hoặc tạm trú tại xã Cái Bầu, đặc biệt ưu tiên người cao tuổi, phụ nữ mang thai và trẻ em dưới 5 tuổi.</p>
      
      <h3>2. Nội dung khám</h3>
      <ul>
        <li>Khám tổng quát, đo huyết áp, nhịp tim.</li>
        <li>Sàng lọc các bệnh mãn tính: Tiểu đường, tăng huyết áp.</li>
        <li>Tư vấn dinh dưỡng và chế độ sinh hoạt lành mạnh.</li>
        <li>Cấp phát thuốc miễn phí cho các đối tượng chính sách.</li>
      </ul>
      
      <h3>3. Thời gian và địa điểm</h3>
      <p><strong>Thời gian:</strong> Từ 7:30 đến 16:30, các ngày từ 15/04/2026 đến 20/04/2026.</p>
      <p><strong>Địa điểm:</strong> Hội trường Trạm Y tế xã Cái Bầu.</p>
      
      <p>Kính mời toàn thể bà con nhân dân sắp xếp thời gian đến khám để đảm bảo sức khỏe cho bản thân và gia đình.</p>
    `,
    date: "2026-04-08",
    author: "BS. Nguyễn Văn A",
    category: "Thông báo"
  },
  {
    slug: "huong-dan-phong-dich-mua-he",
    title: "Hướng dẫn phòng chống dịch bệnh mùa hè cho trẻ em",
    content: `
      <p>Mùa hè là thời điểm các dịch bệnh như tay chân miệng, sốt xuất huyết và tiêu chảy mùa hè có xu hướng gia tăng. Để bảo vệ sức khỏe cho trẻ, phụ huynh cần lưu ý các biện pháp sau:</p>
      
      <h3>Vệ sinh cá nhân</h3>
      <p>Rửa tay thường xuyên bằng xà phòng cho trẻ và người chăm sóc trẻ. Giữ gìn vệ sinh thân thể sạch sẽ.</p>
      
      <h3>Ăn chín uống sôi</h3>
      <p>Đảm bảo thực phẩm tươi ngon, chế biến kỹ. Không cho trẻ ăn thức ăn ôi thiu hoặc chưa được nấu chín.</p>
      
      <h3>Diệt muỗi, lăng quăng</h3>
      <p>Ngủ màn kể cả ban ngày. Thường xuyên kiểm tra và loại bỏ các vật dụng chứa nước đọng quanh nhà.</p>
    `,
    date: "2026-04-07",
    author: "ĐD. Trần Thị B",
    category: "Kiến thức"
  }
];

export default function PostDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h1>
        <Link href="/tin-tuc" className="text-[var(--primary)] font-bold flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--gray-50)] min-h-screen pb-14">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <div className="flex items-center gap-2 text-sm opacity-75 mb-6">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <Link href="/tin-tuc">Tin tức</Link>
            <span className="opacity-50">/</span>
            <span className="truncate max-w-[200px]">{post.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-serif leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--accent)]" />
              {new Date(post.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--accent)]" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent)]" />
              5 phút đọc
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-[-40px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[var(--gray-800)] prose-p:text-[var(--gray-600)] prose-p:leading-relaxed prose-li:text-[var(--gray-600)] prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
              />
              
              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Chia sẻ:</span>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-500 hover:text-white transition-all">
                      <LinkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <Link href="/tin-tuc" className="text-[var(--primary)] font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[var(--primary)] inline-block">Bài viết liên quan</h3>
              <div className="space-y-4">
                {posts.filter(p => p.slug !== slug).map((p) => (
                  <Link key={p.slug} href={`/tin-tuc/${p.slug}`} className="group block">
                    <h4 className="text-sm font-bold text-gray-700 group-hover:text-[var(--primary)] transition-colors line-clamp-2 mb-1">
                      {p.title}
                    </h4>
                    <span className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString('vi-VN')}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-3xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-4">Bạn cần hỗ trợ?</h3>
              <p className="text-sm opacity-90 mb-6 leading-relaxed">Đội ngũ y bác sĩ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn.</p>
              <Link href="/lien-he" className="block w-full bg-white text-[var(--primary)] text-center py-3 rounded-xl font-bold hover:bg-[var(--accent)] hover:text-white transition-all">
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
