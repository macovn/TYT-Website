'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Newspaper, 
  Megaphone, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Plus, 
  Eye, 
  Trash2, 
  Edit 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/admin/login');
      } else {
        setSession(session);
        fetchData();
      }
      setLoading(false);
    });
  }, [router]);

  async function fetchData() {
    const { data: postsData } = await supabase.from('posts').select('*, categories(*)').order('created_at', { ascending: false });
    const { data: msgsData } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (postsData) setPosts(postsData);
    if (msgsData) setMessages(msgsData);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang kiểm tra quyền truy cập...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--gray-800)] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Y tế Cái Bầu</h2>
            <p className="text-[10px] opacity-50 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Tổng quan' },
            { id: 'posts', icon: <Newspaper className="w-4 h-4" />, label: 'Bài viết' },
            { id: 'announcements', icon: <Megaphone className="w-4 h-4" />, label: 'Thông báo' },
            { id: 'documents', icon: <FileText className="w-4 h-4" />, label: 'Tài liệu' },
            { id: 'messages', icon: <MessageSquare className="w-4 h-4" />, label: 'Tin nhắn', count: messages.filter(m => !m.is_read).length },
            { id: 'settings', icon: <Settings className="w-4 h-4" />, label: 'Cài đặt' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === item.id ? 'bg-[var(--primary)] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon} {item.label}
              </div>
              {item.count ? (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{item.count}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'posts' && 'Quản lý bài viết'}
            {activeTab === 'messages' && 'Tin nhắn liên hệ'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{session.user.email}</p>
              <p className="text-[11px] text-gray-500">Quản trị viên</p>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
              {session.user.email[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Bài viết', value: posts.length, icon: <Newspaper />, color: 'bg-blue-500' },
                  { label: 'Lượt xem', value: '1,248', icon: <Eye />, color: 'bg-green-500' },
                  { label: 'Tin nhắn', value: messages.length, icon: <MessageSquare />, color: 'bg-yellow-500' },
                  { label: 'Tài liệu', value: '12', icon: <FileText />, color: 'bg-red-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      {stat.icon}
                    </div>
                    <h3 className="text-3xl font-extrabold text-gray-800">{stat.value}</h3>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">Bài viết gần đây</h3>
                  <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Thêm mới
                  </button>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[11px] uppercase tracking-wider font-bold text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Tiêu đề</th>
                      <th className="px-6 py-4">Danh mục</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4">Ngày đăng</th>
                      <th className="px-6 py-4">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {posts.slice(0, 5).map((post) => (
                      <tr key={post.id} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800">{post.title}</td>
                        <td className="px-6 py-4 text-gray-500">{post.categories?.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            post.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(post.created_at).toLocaleDateString('vi-VN')}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Tất cả bài viết</h3>
                <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Thêm mới
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[11px] uppercase tracking-wider font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Tiêu đề</th>
                    <th className="px-6 py-4">Danh mục</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Ngày đăng</th>
                    <th className="px-6 py-4">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="text-sm hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800">{post.title}</td>
                      <td className="px-6 py-4 text-gray-500">{post.categories?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          post.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(post.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ${!msg.is_read ? 'border-l-4 border-l-[var(--primary)]' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-800">{msg.full_name}</h4>
                      <p className="text-xs text-gray-500">{msg.email} | {msg.phone}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(msg.created_at).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-[var(--primary)] mb-2 uppercase tracking-wider">Chủ đề: {msg.subject}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    {!msg.is_read && (
                      <button className="text-[11px] font-bold text-[var(--primary)] uppercase hover:underline">Đánh dấu đã đọc</button>
                    )}
                    <button className="text-[11px] font-bold text-red-500 uppercase hover:underline">Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
