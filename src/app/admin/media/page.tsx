'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Upload, 
  X,
  Loader2,
  Play,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function AdminMedia() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [source, setSource] = useState<'upload' | 'youtube'>('upload');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      fetchMedia();
    };
    checkAuth();
  }, [router]);

  const fetchMedia = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media:', error);
    } else {
      setMediaItems(data || []);
    }
    setLoading(false);
  };

  const parseYoutubeUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (source === 'upload' && !file) return;
    if (source === 'youtube' && !youtubeUrl) return;
    if (!title) return;

    setSubmitting(true);
    try {
      let finalUrl = '';

      if (source === 'upload' && file) {
        // 1. Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        
        finalUrl = publicUrl;
      } else if (source === 'youtube') {
        const embedUrl = parseYoutubeUrl(youtubeUrl);
        if (!embedUrl) {
          throw new Error('Link YouTube không hợp lệ');
        }
        finalUrl = embedUrl;
      }

      // 3. Insert into DB
      const { error: dbError } = await supabase
        .from('media')
        .insert([{ title, type, url: finalUrl, source }]);

      if (dbError) throw dbError;

      setIsModalOpen(false);
      setTitle('');
      setFile(null);
      setYoutubeUrl('');
      setSource('upload');
      fetchMedia();
      alert('Tải lên media thành công!');
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, url: string, source: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa media này?')) return;

    try {
      if (source === 'upload') {
        // Extract file path from URL
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `gallery/${fileName}`;

        // 1. Delete from Storage
        await supabase.storage.from('media').remove([filePath]);
      }

      // 2. Delete from DB
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMedia();
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
              <h1 className="text-2xl font-bold text-gray-800">Thư viện Media</h1>
              <p className="text-sm text-gray-500">Quản lý hình ảnh và video hoạt động của trạm</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" /> Thêm Media
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
            <p className="text-gray-500 font-medium">Đang tải thư viện...</p>
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400">Chưa có hình ảnh hoặc video nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative">
                <div className="aspect-video relative bg-gray-100">
                  {item.type === 'image' ? (
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <Video className="w-10 h-10 text-white/50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </a>
                    <button 
                      onClick={() => handleDelete(item.id, item.url, item.source)}
                      className="p-2 bg-red-500/80 backdrop-blur-md rounded-lg text-white hover:bg-red-600 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {item.type === 'image' ? (
                      <ImageIcon className="w-3 h-3 text-blue-500" />
                    ) : (
                      <Video className="w-3 h-3 text-red-500" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.type}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tải lên Media mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Tiêu đề</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  placeholder="Ví dụ: Lễ khánh thành trạm y tế mới" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Loại Media</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setType('image');
                      setSource('upload');
                    }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                      type === 'image' 
                        ? 'border-[var(--primary)] bg-blue-50 text-[var(--primary)]' 
                        : 'border-gray-100 bg-gray-50 text-gray-400'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" /> Hình ảnh
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType('video')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                      type === 'video' 
                        ? 'border-[var(--primary)] bg-blue-50 text-[var(--primary)]' 
                        : 'border-gray-100 bg-gray-50 text-gray-400'
                    }`}
                  >
                    <Video className="w-4 h-4" /> Video
                  </button>
                </div>
              </div>

              {type === 'video' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nguồn Video</label>
                  <select 
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  >
                    <option value="upload">Tải lên file</option>
                    <option value="youtube">Link YouTube</option>
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  {source === 'upload' ? 'Chọn file' : 'Link YouTube'}
                </label>
                {source === 'upload' ? (
                  <div className="relative">
                    <input 
                      type="file" 
                      required
                      accept={type === 'image' ? 'image/*' : 'video/*'}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="media-upload"
                    />
                    <label 
                      htmlFor="media-upload"
                      className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--primary)] hover:bg-blue-50 transition-all"
                    >
                      {file ? (
                        <div className="flex items-center gap-2 text-[var(--primary)] font-bold">
                          {type === 'image' ? <ImageIcon className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                          <span>{file.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Nhấn để chọn {type === 'image' ? 'ảnh' : 'video'}</span>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <input 
                    type="text" 
                    required
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                    placeholder="Dán link YouTube (ví dụ: https://www.youtube.com/watch?v=...)" 
                  />
                )}
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
                  disabled={submitting || (source === 'upload' && !file) || (source === 'youtube' && !youtubeUrl)}
                  className="flex-[2] bg-[var(--primary)] text-white font-bold py-3 rounded-xl hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /> Tải lên</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
