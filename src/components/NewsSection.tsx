'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, ArrowRight, Calendar, Syringe, Apple, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { stripHtml, extractFirstImage } from '@/lib/utils';

export default function NewsSection() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('posts')
        .select('*, categories(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) setPosts(data);
    }
    fetchPosts();
  }, []);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <section className="py-14">
      <div className="container">
        <div className="flex justify-between items-end mb-9">
          <div>
            <div className="section-tag"><Newspaper className="w-4 h-4" /> Tin tức</div>
            <h2 className="text-3xl font-bold text-[var(--gray-800)] font-serif">Tin Nổi Bật</h2>
          </div>
          <Link href="/tin-tuc" className="flex items-center gap-1.5 text-[var(--primary)] font-semibold text-[13.5px] px-4.5 py-2 border-1.5 border-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-all">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredPost ? (
            <div className="post-card">
              <div className="w-full aspect-[16/10] bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary-mid)] flex items-center justify-center text-[var(--primary)] overflow-hidden relative">
                {(featuredPost.thumbnail || extractFirstImage(featuredPost.content)) ? (
                  <img 
                    src={featuredPost.thumbnail || extractFirstImage(featuredPost.content)!} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Syringe className="w-16 h-16" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="bg-[var(--primary-light)] text-[var(--primary)] px-2.5 py-0.5 rounded-full text-[11.5px] font-bold uppercase tracking-wider">
                    {featuredPost.categories?.name || 'Tin tức'}
                  </span>
                  <span className="text-[12px] text-[var(--gray-500)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(featuredPost.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--gray-800)] leading-tight mb-2.5 line-clamp-2">
                  {featuredPost.title}
                </h3>
                <p className="text-[13.5px] text-[var(--gray-500)] leading-relaxed line-clamp-3">
                  {featuredPost.excerpt || stripHtml(featuredPost.content || "").substring(0, 150)}
                </p>
              </div>
            </div>
          ) : (
            <div className="post-card animate-pulse bg-gray-100 h-[400px]"></div>
          )}

          <div className="flex flex-col gap-3">
            {otherPosts.map((post) => (
              <Link key={post.id} href={`/tin-tuc/${post.id}`} className="flex gap-3.5 bg-white rounded-[var(--radius)] p-3.5 shadow-[var(--shadow)] border border-[var(--gray-100)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 transition-all">
                <div className="w-20 h-[72px] rounded-lg shrink-0 bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] overflow-hidden relative">
                  {(post.thumbnail || extractFirstImage(post.content)) ? (
                    <img 
                      src={post.thumbnail || extractFirstImage(post.content)!} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Newspaper className="w-7 h-7" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-[var(--green)] uppercase mb-1.5">
                    {post.categories?.name || 'Hoạt động'}
                  </div>
                  <h3 className="text-[13.5px] font-bold text-[var(--gray-800)] leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="text-[12px] text-[var(--gray-500)] mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
