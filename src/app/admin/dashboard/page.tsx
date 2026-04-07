'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Edit,
  Stethoscope,
  Image as ImageIcon,
  Users
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import dynamicImport from 'next/dynamic';

const RichTextEditor = dynamicImport(() => import('@/components/Editor'), { ssr: false });

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'news' });
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'editor' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async (currentSession?: any) => {
    console.log("FETCH CALLED - fetchData");
    const activeSession = currentSession || session;
    
    try {
      // Fetch Posts
      const { data: postsData, error: postsError } = await supabase.from('posts').select('*, categories(*)').order('created_at', { ascending: false });
      console.log("POSTS:", postsData, postsError);
      if (postsError) console.error("Error fetching posts:", postsError);
      if (postsData) setPosts(postsData);
      
      // Fetch Messages
      const { data: msgsData, error: msgsError } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (msgsError) console.error("Error fetching messages:", msgsError);
      if (msgsData) setMessages(msgsData);
      
      // Fetch Users (Admin only)
      console.log("Attempting to fetch users from profiles table...");
      const { data: usersData, error: usersError } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      
      if (usersError) {
        console.error("CRITICAL: Error fetching users from profiles:", usersError);
      } else {
        console.log("SUCCESS: Users fetched from profiles:", usersData);
        if (usersData) setUsers(usersData);
        
        // Check if current user profile exists
        if (activeSession?.user?.id) {
          const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', activeSession.user.id).single();
          console.log("DEBUG: My current profile in DB:", myProfile);
        }
      }
    } catch (err) {
      console.error("Exception in fetchData:", err);
    }
  }, [session]);

  useEffect(() => {
    let mounted = true;

    async function fetchProfile(user: any) {
      const ADMIN_EMAIL = "macovn@gmail.com";
      
      // Bypass for hardcoded admin
      if (user.email === ADMIN_EMAIL) {
        if (mounted) {
          setRole('admin');
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (mounted) {
        if (data) {
          setRole(data.role);
          if (data.role !== 'admin' && data.role !== 'editor') {
            router.push('/');
          }
        } else {
          // If profile not found and not hardcoded admin, block access
          router.push('/');
        }
        setLoading(false);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/admin/login');
      } else {
        if (mounted) {
          setSession(session);
          fetchProfile(session.user);
          fetchData(session);
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("SUPABASE URL (Admin):", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("START SUBMIT - Post Data:", newPost);

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: newPost.title,
            content: newPost.content,
            category: newPost.category,
            status: 'published'
          }
        ])
        .select();

      console.log("RESULT:", { data, error });

      if (error) {
        alert("Lỗi: " + error.message);
        setIsSubmitting(false);
        return;
      }

      alert("Đăng bài thành công!");
      setNewPost({ title: '', content: '', category: 'news' });
      setIsAddingPost(false);
      setIsSubmitting(false);
      fetchData(); // Reload list
    } catch (err) {
      console.error("CRASH DURING SUBMIT:", err);
      alert("Lỗi runtime: " + (err instanceof Error ? err.message : String(err)));
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Lỗi khi xóa: " + error.message);
    } else {
      fetchData();
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the new API route
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          role: newUser.role
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Lỗi khi tạo người dùng');
      }

      alert("Tạo người dùng thành công!");
      setNewUser({ email: '', password: '', role: 'editor' });
      setIsAddingUser(false);
      fetchData();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      alert("Cập nhật vai trò thành công!");
      fetchData();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    const { id: userId, email: userEmail } = userToDelete;

    if (userId === session.user.id) {
      alert("Bạn không thể tự xóa chính mình!");
      setUserToDelete(null);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Lỗi khi xóa người dùng');
      }

      setUserToDelete(null);
      fetchData();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang kiểm tra quyền truy cập...</div>;
  if (!session || !role) return null;

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
            { id: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Tổng quan', roles: ['admin', 'editor'] },
            { id: 'posts', icon: <Newspaper className="w-4 h-4" />, label: 'Bài viết', roles: ['admin', 'editor'] },
            { id: 'announcements', icon: <Megaphone className="w-4 h-4" />, label: 'Thông báo', roles: ['admin'] },
            { id: 'documents', icon: <FileText className="w-4 h-4" />, label: 'Tài liệu', roles: ['admin'] },
            { id: 'messages', icon: <MessageSquare className="w-4 h-4" />, label: 'Tin nhắn', roles: ['admin'], count: messages.filter(m => !m.is_read).length },
            { id: 'users', icon: <Settings className="w-4 h-4" />, label: 'Quản lý User', roles: ['admin'] },
          ].filter(item => item.roles.includes(role as string)).map((item) => (
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
          
          <Link 
            href="/admin/pages"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4" /> Quản lý trang
          </Link>

          <Link 
            href="/admin/services"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Stethoscope className="w-4 h-4" /> Quản lý dịch vụ
          </Link>

          <Link 
            href="/admin/documents"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4" /> Quản lý tài liệu
          </Link>

          <Link 
            href="/admin/media"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ImageIcon className="w-4 h-4" /> Thư viện Media
          </Link>

          <Link 
            href="/admin/staff"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Users className="w-4 h-4" /> Quản lý cán bộ
          </Link>
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
          {isAddingPost && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm bài viết mới</h2>
                <form onSubmit={handleCreatePost} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Tiêu đề</label>
                    <input 
                      type="text" 
                      required
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                      placeholder="Nhập tiêu đề bài viết..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phân loại</label>
                    <select 
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                    >
                      <option value="news">Tin tức</option>
                      <option value="announcement">Thông báo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nội dung</label>
                    <RichTextEditor 
                      content={newPost.content}
                      onChange={(html) => setNewPost({...newPost, content: html})}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsAddingPost(false)}
                      className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] bg-[var(--primary)] text-white font-bold py-3 rounded-xl hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Đang đăng...' : 'Đăng bài viết'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
                  <button 
                    onClick={() => setIsAddingPost(true)}
                    className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                  >
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
                        <td className="px-6 py-4 text-gray-500">
                          {post.category === 'news' ? 'Tin tức' : 'Thông báo'}
                        </td>
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
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
                <button 
                  onClick={() => setIsAddingPost(true)}
                  className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                >
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
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'announcements' && role === 'admin' && (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
              <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800">Quản lý thông báo</h3>
              <p className="text-gray-500">Tính năng đang được phát triển.</p>
            </div>
          )}

          {activeTab === 'documents' && role === 'admin' && (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800">Quản lý tài liệu</h3>
              <p className="text-gray-500">Tính năng đang được phát triển.</p>
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

          {activeTab === 'users' && role === 'admin' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">Quản lý người dùng</h3>
                  <button 
                    onClick={() => setIsAddingUser(true)}
                    className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Thêm User
                  </button>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[11px] uppercase tracking-wider font-bold text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Vai trò</th>
                      <th className="px-6 py-4">Ngày tạo</th>
                      <th className="px-6 py-4">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">Chưa có người dùng nào hoặc bạn không có quyền xem danh sách.</td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="text-sm">
                          <td className="px-6 py-4 font-medium">{u.email}</td>
                          <td className="px-6 py-4">
                            <select 
                              value={u.role}
                              onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase focus:outline-none border border-transparent hover:border-gray-200 transition-all ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              <option value="admin">Admin</option>
                              <option value="editor">Editor</option>
                              <option value="viewer">Viewer</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => setUserToDelete({ id: u.id, email: u.email })}
                              disabled={u.id === session.user.id}
                              className={`p-2 rounded-lg transition-colors ${
                                u.id === session.user.id 
                                  ? 'text-gray-300 cursor-not-allowed' 
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title={u.id === session.user.id ? "Không thể xóa chính mình" : "Xóa người dùng"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* User Modal */}
        {isAddingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl">
              <div className="bg-[var(--primary)] p-6 text-white">
                <h3 className="text-xl font-bold">Thêm người dùng mới</h3>
              </div>
              <form onSubmit={handleCreateUser} className="p-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                  <input 
                    type="email" 
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Mật khẩu</label>
                  <input 
                    type="password" 
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Vai trò</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[var(--primary)] text-white py-3 rounded-xl text-sm font-bold hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Đang tạo...' : 'Tạo User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {userToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-[60]">
            <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl">
              <div className="bg-red-600 p-6 text-white">
                <h3 className="text-xl font-bold">Xác nhận xóa</h3>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-gray-600">
                  Bạn có chắc chắn muốn xóa người dùng <span className="font-bold text-gray-900">{userToDelete.email}</span>? 
                  Hành động này không thể hoàn tác.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setUserToDelete(null)}
                    className="flex-1 px-6 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleDeleteUser}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-2xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Đang xóa...' : 'Xác nhận xóa'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
