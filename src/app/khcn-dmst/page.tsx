'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, Calendar, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify, extractFirstImage, stripHtml } from '@/lib/utils';

export default function KhcnDmstPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('posts')
        .select('*, categories(*)')
        .eq('status', 'published')
        .eq('category', 'khcn')
        .order('created_at', { ascending: false })
        .limit(30);

      if (data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <>
      <div className="bg-[var(--primary-dark)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3">Khoa học công nghệ – Đổi mới sáng tạo</h1>
          <p className="opacity-90 text-lg">Bài viết tuyên truyền về khoa học công nghệ và đổi mới sáng tạo trong lĩnh vực y tế</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>KHCN - ĐMST</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="section-tag"><Lightbulb className="w-4 h-4" /> Bài viết mới nhất</div>

          {loading ? (
            <div className="text-center py-10 text-[var(--gray-500)]">Đang tải bài viết...</div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {posts.map((post) => {
                const img = post.thumbnail || extractFirstImage(post.content);
                return (
                  <Link
                    key={post.id}
                    href={`/tin-tuc/${post.slug || slugify(post.title)}`}
                    className="flex gap-4 bg-white p-4 rounded-[var(--radius)] shadow-[var(--shadow)] border border-[var(--gray-200)] hover:shadow-[var(--shadow-lg)] transition-all"
                  >
                    <div className="w-24 h-24 bg-[var(--primary-light)] rounded-[var(--radius)] shrink-0 flex items-center justify-center text-[var(--primary)] overflow-hidden relative">
                      {img ? (
                        <Image src={img} alt={post.title} fill className="object-cover" />
                      ) : (
                        <Newspaper className="w-8 h-8" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold text-[var(--gray-800)] leading-snug line-clamp-2 mb-1.5">{post.title}</h3>
                      <p className="text-[13px] text-[var(--gray-500)] leading-relaxed line-clamp-2 mb-2">
                        {stripHtml(post.content).slice(0, 140)}...
                      </p>
                      <div className="text-[12px] text-[var(--gray-500)] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--gray-500)]">
              Chưa có bài viết trong mục này. Nội dung đang được cập nhật.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
