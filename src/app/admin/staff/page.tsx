'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Upload, 
  X,
  Loader2,
  Edit,
  User
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminStaff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const fetchStaff = useCallback(async () => {
    console.log("FETCH CALLED - fetchStaff");
    setLoading(true);
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching staff:', error);
    } else {
      setStaff(data || []);
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
        fetchStaff();
      }
    };
    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router, fetchStaff]);

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingStaff(item);
      setName(item.name);
      setPosition(item.position);
      setSpecialization(item.specialization);
    } else {
      setEditingStaff(null);
      setName('');
      setPosition('');
      setSpecialization('');
    }
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) return;

    setSubmitting(true);
    try {
      let image_url = editingStaff?.image_url || '';

      if (file) {
        // 1. Upload image to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `staff/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('staff-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('staff-images')
          .getPublicUrl(filePath);
        
        image_url = publicUrl;
      }

      const staffData = { name, position, specialization, image_url };

      if (editingStaff) {
        const { error } = await supabase
          .from('staff')
          .update(staffData)
          .eq('id', editingStaff.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('staff')
          .insert([staffData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchStaff();
      alert(editingStaff ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cán bộ này?')) return;

    try {
      if (imageUrl) {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `staff/${fileName}`;
        await supabase.storage.from('staff-images').remove([filePath]);
      }

      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchStaff();
    } catch (error: any) {
      alert('Lỗi khi xóa: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-all">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý đội ngũ cán bộ</h1>
              <p className="text-sm text-gray-500">Quản lý danh sách y bác sĩ và nhân viên trạm</p>
            </div>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" /> Thêm cán bộ
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cán bộ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Chức vụ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Chuyên môn</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Đang tải danh sách...</td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Chưa có cán bộ nào.</td>
                </tr>
              ) : (
                staff.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 border border-gray-200 relative">
                          {item.image_url ? (
                            <Image 
                              src={item.image_url} 
                              alt={item.name} 
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold">{item.name[0]}</span>
                          )}
                        </div>
                        <span className="font-bold text-gray-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--primary)] font-bold uppercase">{item.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.specialization}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.image_url)}
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{editingStaff ? 'Cập nhật cán bộ' : 'Thêm cán bộ mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Họ tên</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  placeholder="Ví dụ: BS. Nguyễn Văn An" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Chức vụ</label>
                <input 
                  type="text" 
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  placeholder="Ví dụ: Trạm trưởng" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Chuyên môn</label>
                <input 
                  type="text" 
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  placeholder="Ví dụ: Bác sĩ đa khoa" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Ảnh đại diện</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="staff-image-upload"
                  />
                  <label 
                    htmlFor="staff-image-upload"
                    className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--primary)] hover:bg-blue-50 transition-all"
                  >
                    {file ? (
                      <div className="flex items-center gap-2 text-[var(--primary)] font-bold">
                        <User className="w-6 h-6" />
                        <span>{file.name}</span>
                      </div>
                    ) : editingStaff?.image_url ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-[var(--primary)] relative">
                          <Image 
                            src={editingStaff.image_url} 
                            alt="Preview" 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs text-gray-500">Nhấn để thay đổi ảnh</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Nhấn để chọn ảnh</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-[var(--primary)] text-white font-bold py-3 rounded-xl hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /> {editingStaff ? 'Cập nhật' : 'Thêm mới'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
