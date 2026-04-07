'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Eye, 
  EyeOff,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  AlertCircle,
  Loader2
} from 'lucide-react';
import RichTextEditor from '@/components/Editor';

export default function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchAnnouncements = useCallback(async () => {
    console.log("FETCH CALLED - fetchAnnouncements");
    setLoading(true);
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
    } else {
      setAnnouncements(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      if (mounted) {
        fetchAnnouncements();
      }
    };
    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router, fetchAnnouncements]);

  const handleOpenModal = (announcement: any = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setTitle(announcement.title || '');
      setContent(announcement.content || '');
      setIsPublished(announcement.is_published ?? true);
    } else {
      setEditingAnnouncement(null);
      setTitle('');
      setContent('');
      setIsPublished(true);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setSubmitting(true);
    try {
      const announcementData = { 
        title, 
        content, 
        is_published: isPublished 
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editingAnnouncement.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert([announcementData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchAnnouncements();
      alert(editingAnnouncement ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAnnouncements();
    } catch (error: any) {
      alert('Lỗi khi xóa: ' + error.message);
    }
  };

  const togglePublish = async (announcement: any) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_published: !announcement.is_published })
        .eq('id', announcement.id);

      if (error) throw error;
      fetchAnnouncements();
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    }
  };

  const filteredAnnouncements = announcements.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Thông báo</h1>
          <p className="text-gray-500">Tạo và cập nhật các thông báo mới nhất cho trạm y tế</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-4 py-2.5 rounded-xl hover:bg-opacity-90 transition-all shadow-sm font-medium"
        >
          <Plus size={20} />
          Thêm thông báo mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-600 text-sm font-medium">
                <th className="px-6 py-4">Tiêu đề</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
                      <p className="text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredAnnouncements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <AlertCircle size={48} strokeWidth={1.5} />
                      <p>Không tìm thấy thông báo nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAnnouncements.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                        {a.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(a.created_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(a)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          a.is_published 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {a.is_published ? (
                          <><Eye size={14} /> Đã đăng</>
                        ) : (
                          <><EyeOff size={14} /> Bản nháp</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(a)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAnnouncement ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tiêu đề thông báo</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                  placeholder="Nhập tiêu đề..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nội dung chi tiết</label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isPublished ? 'bg-[var(--primary)]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublished ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {isPublished ? 'Đăng công khai ngay' : 'Lưu dưới dạng bản nháp'}
                </span>
              </div>
            </form>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-2.5 rounded-xl hover:bg-opacity-90 transition-all shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="animate-spin" size={18} />}
                {editingAnnouncement ? 'Cập nhật' : 'Đăng thông báo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
