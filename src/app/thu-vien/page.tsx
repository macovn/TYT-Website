'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Image as ImageIcon, 
  Video, 
  Play, 
  Loader2, 
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';

export default function GalleryPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    async function fetchMedia() {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setMediaItems(data);
      setLoading(false);
    }
    fetchMedia();
  }, []);

  const openLightbox = (item: any) => {
    setSelectedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Thư Viện Media</h1>
          <p className="opacity-90 text-lg">Hình ảnh và video các hoạt động tại Trạm Y tế Cái Bầu</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Thư viện</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
              <p className="text-gray-500 font-medium">Đang tải thư viện...</p>
            </div>
          ) : mediaItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mediaItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => openLightbox(item)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="aspect-square relative bg-gray-100">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 overflow-hidden">
                        <Video className="w-12 h-12 text-white/30 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                            <Play className="w-7 h-7 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                      <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wider">
                        {item.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        {item.type}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-[var(--primary)] transition-colors">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">Chưa có hình ảnh hoặc video nào được cập nhật.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-6xl w-full h-full flex flex-col items-center justify-center relative">
            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl bg-black/50">
              {selectedItem.type === 'image' ? (
                <img 
                  src={selectedItem.url} 
                  alt={selectedItem.title} 
                  className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-300"
                  referrerPolicy="no-referrer"
                />
              ) : selectedItem.source === 'youtube' ? (
                <iframe 
                  src={selectedItem.url} 
                  className="w-full aspect-video rounded-xl animate-in zoom-in-95 duration-300"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              ) : (
                <video 
                  src={selectedItem.url} 
                  controls 
                  autoPlay
                  className="max-w-full max-h-full rounded-xl animate-in zoom-in-95 duration-300"
                />
              )}
            </div>
            
            <div className="mt-6 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
              <div className="flex items-center justify-center gap-4 text-white/50 text-sm">
                <span className="flex items-center gap-1.5 uppercase font-bold tracking-widest">
                  {selectedItem.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  {selectedItem.type}
                </span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span>{new Date(selectedItem.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
