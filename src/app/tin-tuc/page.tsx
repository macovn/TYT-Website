'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, Calendar, Eye, ChevronRight, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function NewsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: postsData } = await supabase
        .from('posts')
        .select('*, categories(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      const { data: catsData } = await supabase
        .from('categories')
        .select('*');

      if (postsData) setPosts(postsData);
      if (catsData) setCategories(catsData);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Tin Tức – Hoạt Động</h1>
          <p className="opacity-90 text-lg">Cập nhật hoạt động của Trạm Y tế và thông tin y tế mới nhất</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Tin tức</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid gap-6">
                {posts.length > 0 ? posts.map((post) => (
                  <Link key={post.id} href={`/tin-tuc/${post.id}`} className="flex flex-col md:flex-row bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow)] border border-[var(--gray-100)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
                    <div className="md:w-64 shrink-0 bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] h-48 md:h-auto">
                      <Newspaper className="w-12 h-12" />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-[var(--primary-light)] text-[var(--primary)] px-2.5 py-0.5 rounded-full text-[11.5px] font-bold uppercase tracking-wider">
                          {post.categories?.name || 'Tin tức'}
                        </span>
                        <span className="text-[12px] text-[var(--gray-500)] flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-[12px] text-[var(--gray-500)] flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {post.views} lượt xem
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[var(--gray-800)] leading-tight mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[14px] text-[var(--gray-500)] leading-relaxed line-clamp-3">
                        {post.excerpt || post.content?.substring(0, 150)}
                      </p>
                    </div>
                  </Link>
                )) : (
                  <div className="text-center py-12 text-[var(--gray-500)]">Đang tải tin tức...</div>
                )}
              </div>

              {/* Pagination Placeholder */}
              <div className="flex justify-center gap-2 mt-8">
                <button className="w-10 h-10 rounded-lg bg-[var(--primary)] text-white font-bold">1</button>
                <button className="w-10 h-10 rounded-lg bg-white border border-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--primary-light)] transition-colors">2</button>
                <button className="w-10 h-10 rounded-lg bg-white border border-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--primary-light)] transition-colors">3</button>
                <button className="w-10 h-10 rounded-lg bg-white border border-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--primary-light)] transition-colors flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)]">
                <h3 className="text-lg font-bold text-[var(--gray-800)] mb-4 pb-2 border-b-2 border-[var(--primary)] inline-block">Danh mục</h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.id} className="border-b border-[var(--gray-50)] last:border-0">
                      <Link href={`/tin-tuc?cat=${cat.slug}`} className="flex items-center justify-between py-2 text-[14px] text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors">
                        <span className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[var(--primary)]" /> {cat.name}</span>
                        <span className="text-[12px] text-[var(--gray-400)] font-medium">(12)</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)]">
                <h3 className="text-lg font-bold text-[var(--gray-800)] mb-4 pb-2 border-b-2 border-[var(--primary)] inline-block">Bài viết xem nhiều</h3>
                <ul className="space-y-4">
                  {posts.slice(0, 5).map((post, i) => (
                    <li key={post.id} className="flex gap-3 items-start group">
                      <div className={`w-6 h-6 rounded bg-[var(--primary)] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${i === 0 ? 'bg-[var(--accent)]' : ''}`}>
                        {i + 1}
                      </div>
                      <Link href={`/tin-tuc/${post.id}`} className="text-[13.5px] font-semibold text-[var(--gray-700)] leading-snug group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[var(--primary)] rounded-[var(--radius-lg)] p-6 text-white shadow-[var(--shadow)]">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-[var(--accent)] inline-block">Hỗ trợ khẩn cấp</h3>
                <p className="text-[13px] opacity-85 mb-4 leading-relaxed">Cần tư vấn y tế hoặc cấp cứu? Liên hệ ngay với chúng tôi.</p>
                <div className="text-2xl font-extrabold text-[var(--accent)] mb-2 flex items-center gap-2">
                  <Phone className="w-6 h-6" /> 0203.3822.115
                </div>
                <div className="text-[12px] opacity-75">Đường dây cấp cứu 24/7</div>
                <div className="mt-4 pt-4 border-t border-white/10 text-[13px] font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4" /> 0203.3795.898
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
