'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  FileText, 
  Download, 
  Search, 
  Loader2, 
  ChevronRight,
  Info,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchDocuments() {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setDocuments(data);
      setLoading(false);
    }
    fetchDocuments();
  }, []);

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Tài Liệu & Biểu Mẫu</h1>
          <p className="opacity-90 text-lg">Tra cứu và tải về các văn bản hướng dẫn, biểu mẫu y tế</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Tài liệu</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-6 py-4 shadow-sm focus:outline-none focus:border-[var(--primary)] transition-all"
              />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
                <p className="text-gray-500 font-medium">Đang tải danh sách tài liệu...</p>
              </div>
            ) : filteredDocs.length > 0 ? (
              <div className="space-y-4">
                {filteredDocs.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[var(--primary)] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 group-hover:text-[var(--primary)] transition-colors">{doc.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">Ngày đăng: {new Date(doc.created_at).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all"
                        title="Xem trực tuyến"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <a 
                        href={doc.file_url} 
                        download
                        className="flex items-center gap-2 bg-[var(--primary-light)] text-[var(--primary)] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[var(--primary)] hover:text-white transition-all"
                      >
                        <Download className="w-4 h-4" /> Tải về
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">Không tìm thấy tài liệu nào phù hợp.</p>
              </div>
            )}

            <div className="mt-12 bg-blue-50 rounded-3xl p-8 border border-blue-100 flex gap-6 items-start">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[var(--primary)] shrink-0 shadow-sm">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Bạn không tìm thấy tài liệu cần thiết?</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Nếu bạn cần các biểu mẫu hoặc văn bản hướng dẫn khác không có trong danh sách trên, vui lòng liên hệ trực tiếp với Trạm Y tế để được hỗ trợ cung cấp.
                </p>
                <Link href="/lien-he" className="inline-flex items-center gap-2 text-[var(--primary)] font-bold text-sm mt-4 hover:gap-3 transition-all">
                  Liên hệ ngay <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
