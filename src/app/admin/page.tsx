'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });
import { Newspaper, Send, PlusCircle, Trash2, Edit, Eye, Youtube, Plus } from 'lucide-react';
import Link from 'next/link';
import type { EditorRef } from '@/components/Editor';

export default function AdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'published'
  });
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const editorRef = useRef<EditorRef>(null);

  const handleInsertYoutube = () => {
    if (!youtubeUrl) return;
    if (editorRef.current) {
      editorRef.current.insertYoutubeVideo(youtubeUrl);
      setYoutubeUrl('');
    }
  };

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }

      setSession(session);

      const ADMIN_EMAIL = "macovn@gmail.com";
      if (session.user.email === ADMIN_EMAIL) {
        setRole('admin');
        fetchPosts();
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (profile && (profile.role === 'admin' || profile.role === 'editor')) {
        setRole(profile.role);
        fetchPosts();
      } else {
        router.push('/');
      }
    }

    checkAuth();
  }, [router]);

  const fetchPosts = async () => {
    setFetching(true);
    console.log("Fetching posts...");
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      console.log("Posts fetched:", data?.length);
      setPosts(data || []);
    }
    setFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log("SUPABASE URL (Admin Page):", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('START SUBMIT - Form Data:', formData);

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            status: formData.status
          }
        ])
        .select();

      console.log('RESULT:', { data, error });

      setLoading(false);
      if (!error) {
        setMessage('Đã tạo bài viết thành công!');
        setFormData({ title: '', content: '', status: 'published' });
        fetchPosts(); // Reload list
      } else {
        console.error('Supabase Insert Error (posts):', error);
        setMessage('Lỗi: ' + error.message);
      }
    } catch (err) {
      console.error('CRASH DURING SUBMIT:', err);
      setMessage('Lỗi runtime: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Lỗi xoá bài");
      console.error(error);
    } else {
      alert("Đã xoá");
      fetchPosts();
    }
  };

  const handleEditPost = (id: string) => {
    router.push(`/admin/posts/edit/${id}`);
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
      fetchPosts();
    } else {
      console.error('Supabase Seed Error (posts):', error);
      setMessage('Lỗi khi thêm dữ liệu: ' + error.message + ' (Xem console để biết chi tiết)');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)] py-12">
      <div className="container max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-[var(--gray-100)] overflow-hidden sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="bg-[var(--primary)] p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white rounded-full p-1 shrink-0">
                    <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <h1 className="text-xl font-bold">Thêm bài viết</h1>
                </div>
                <p className="text-xs opacity-80">Tạo nội dung mới cho trang tin tức</p>
              </div>

              <div className="p-6">
                {message && (
                  <div className={`p-4 rounded-xl mb-6 font-bold text-xs ${message.includes('Lỗi') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--gray-700)] uppercase tracking-wider">Tiêu đề</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                      placeholder="Nhập tiêu đề..." 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--gray-700)] uppercase tracking-wider">Nội dung</label>
                    
                    {/* Chèn Video YouTube */}
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100 mb-2">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Youtube className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-500" />
                          <input 
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="Link YouTube..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleInsertYoutube}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-red-600 transition-all"
                        >
                          <Plus className="w-3 h-3" /> Chèn
                        </button>
                      </div>
                    </div>

                    <Editor 
                      ref={editorRef}
                      content={formData.content}
                      onChange={(html) => setFormData({...formData, content: html})}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--primary)] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 shadow-lg text-sm"
                  >
                    {loading ? 'Đang xử lý...' : <><Send className="w-4 h-4" /> Đăng bài viết</>}
                  </button>

                  <button 
                    type="button"
                    onClick={handleSeedData}
                    disabled={loading}
                    className="w-full bg-gray-50 text-gray-500 font-bold py-3 rounded-xl border border-gray-200 text-xs hover:bg-gray-100 transition-all"
                  >
                    Thêm 10 bài mẫu
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-[var(--gray-100)] overflow-hidden">
              <div className="p-6 border-b border-[var(--gray-100)] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--gray-800)] flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-[var(--primary)]" /> Danh sách bài viết
                </h2>
                <span className="text-xs font-bold text-[var(--gray-400)] uppercase">{posts.length} bài viết</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[var(--gray-50)] text-[11px] uppercase tracking-wider font-bold text-[var(--gray-500)]">
                    <tr>
                      <th className="px-6 py-4">Bài viết</th>
                      <th className="px-6 py-4">Ngày đăng</th>
                      <th className="px-6 py-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--gray-100)]">
                    {fetching ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-sm text-[var(--gray-400)]">Đang tải danh sách...</td>
                      </tr>
                    ) : posts.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-sm text-[var(--gray-400)]">Chưa có bài viết nào.</td>
                      </tr>
                    ) : (
                      posts.map((post) => (
                        <tr key={post.id} className="hover:bg-[var(--gray-50)] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-[var(--gray-800)] text-sm line-clamp-1">{post.title}</div>
                            <div className="text-[11px] text-[var(--gray-400)] mt-0.5 flex items-center gap-2">
                              <Eye className="w-3 h-3" /> {post.views || 0} lượt xem
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-[var(--gray-500)]">
                            {new Date(post.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleEditPost(post.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(post.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center px-4">
              <Link href="/" className="text-sm font-bold text-[var(--gray-500)] hover:text-[var(--primary)] transition-colors">
                Quay lại trang chủ
              </Link>
              <Link href="/tin-tuc" className="text-sm font-bold text-[var(--primary)] hover:underline">
                Xem trang tin tức công khai
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
