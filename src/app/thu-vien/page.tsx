'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, Play, Eye, Maximize2, X } from 'lucide-react';

const galleryItems = [
  { id: 1, title: "Hoạt động tiêm chủng tại Trạm", type: "image", url: "https://picsum.photos/seed/medical1/800/600" },
  { id: 2, title: "Khám bệnh cho người cao tuổi", type: "image", url: "https://picsum.photos/seed/medical2/800/600" },
  { id: 3, title: "Tư vấn dinh dưỡng cho bà mẹ", type: "image", url: "https://picsum.photos/seed/medical3/800/600" },
  { id: 4, title: "Phun thuốc diệt muỗi phòng dịch", type: "image", url: "https://picsum.photos/seed/medical4/800/600" },
  { id: 5, title: "Tập huấn sơ cấp cứu cộng đồng", type: "image", url: "https://picsum.photos/seed/medical5/800/600" },
  { id: 6, title: "Cơ sở vật chất Trạm Y tế", type: "image", url: "https://picsum.photos/seed/medical6/800/600" },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Thư Viện Hình Ảnh</h1>
          <p className="opacity-90 text-lg">Hình ảnh hoạt động và cơ sở vật chất của Trạm Y tế</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Thư viện</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-6 py-2.5 bg-[var(--primary)] text-white font-bold rounded-full text-sm shrink-0">Tất cả</button>
            <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-full text-sm hover:bg-gray-50 transition-colors shrink-0">Hoạt động y tế</button>
            <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-full text-sm hover:bg-gray-50 transition-colors shrink-0">Cơ sở vật chất</button>
            <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-full text-sm hover:bg-gray-50 transition-colors shrink-0">Video</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white rounded-2xl overflow-hidden shadow-[var(--shadow)] border border-[var(--gray-100)] cursor-pointer"
                onClick={() => setSelectedImage(item.url)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest mb-1">
                    {item.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {item.type === 'image' ? 'Hình ảnh' : 'Video'}
                  </div>
                  <h3 className="text-white font-bold text-[15px] leading-tight">{item.title}</h3>
                  <div className="mt-4 flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-[var(--primary)] transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-[var(--primary)] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl w-full max-h-[80vh] relative">
            <img 
              src={selectedImage} 
              alt="Gallery Preview" 
              className="w-full h-full object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </>
  );
}
