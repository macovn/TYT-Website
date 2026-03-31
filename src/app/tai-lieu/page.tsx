'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Search, ChevronRight, FileType } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDocs() {
      const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (data) setDocs(data);
    }
    fetchDocs();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Văn Bản – Tài Liệu</h1>
          <p className="opacity-90 text-lg">Tải các tài liệu truyền thông và văn bản y tế</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Tài liệu</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu, văn bản..." 
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)] transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-6 py-3.5 bg-[var(--primary)] text-white font-bold rounded-2xl shadow-lg">Tất cả</button>
              <button className="px-6 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors">Văn bản pháp quy</button>
              <button className="px-6 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors">Tài liệu truyền thông</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-[var(--primary)]" /> Tài liệu truyền thông
              </h3>
              <div className="space-y-4">
                {docs.filter(d => d.category === 'media').length > 0 ? docs.filter(d => d.category === 'media').map((doc) => (
                  <div key={doc.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-[var(--primary)] transition-all group">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${doc.file_type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                      <FileType className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 leading-tight mb-1 group-hover:text-[var(--primary)] transition-colors">{doc.title}</h4>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{doc.file_type} | {doc.file_size} | {new Date(doc.created_at).getFullYear()}</p>
                    </div>
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-[var(--primary)] hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )) : (
                  <div className="space-y-4">
                    {[
                      { title: "Hướng dẫn phòng chống sốt xuất huyết Dengue 2026", type: "pdf", size: "2.4 MB" },
                      { title: "Tờ rơi tiêm chủng mở rộng – Các vaccine cần thiết", type: "pdf", size: "1.8 MB" },
                      { title: "Tài liệu truyền thông dinh dưỡng 1000 ngày đầu đời", type: "doc", size: "3.1 MB" },
                    ].map((doc, i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-[var(--primary)] transition-all group">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                          <FileType className="w-7 h-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 leading-tight mb-1 group-hover:text-[var(--primary)] transition-colors">{doc.title}</h4>
                          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{doc.type.toUpperCase()} | {doc.size} | 2026</p>
                        </div>
                        <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-[var(--primary)] hover:text-white transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-[var(--primary)]" /> Văn bản ngành y tế
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Thông tư 09/2023/TT-BYT về khám chữa bệnh cơ sở", type: "pdf", size: "1.2 MB" },
                  { title: "Quyết định 2085 về tiêm chủng mở rộng quốc gia", type: "pdf", size: "980 KB" },
                  { title: "Kế hoạch phòng chống dịch bệnh Đặc khu Vân Đồn", type: "doc", size: "870 KB" },
                ].map((doc, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-[var(--primary)] transition-all group">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                      <FileType className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 leading-tight mb-1 group-hover:text-[var(--primary)] transition-colors">{doc.title}</h4>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{doc.type.toUpperCase()} | {doc.size} | 2025</p>
                    </div>
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-[var(--primary)] hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
