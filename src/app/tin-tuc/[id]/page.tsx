'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Newspaper, Calendar, Eye, ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function NewsDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      console.log("Fetching post detail for ID:", id);
      let { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*, categories(*)')
        .eq('id', id)
        .single();
      
      // Fallback if categories relation fails
      if (postError) {
        console.warn("Categories relation failed in detail, fetching post only:", postError.message);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();
        
        if (fallbackError) console.error("Fallback detail fetch failed:", fallbackError);
        postData = fallbackData;
      }
      
      if (postData) {
        setPost(postData);
        // Increment views
        await supabase.from('posts').update({ views: (postData.views || 0) + 1 }).eq('id', id);

        const { data: relatedData } = await supabase
          .from('posts')
          .select('*')
          .neq('id', id)
          .limit(3);
        
        if (relatedData) setRelatedPosts(relatedData);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải bài viết...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy bài viết!</div>;

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[var(--accent)] text-[var(--gray-800)] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              {post.categories?.name}
            </span>
            <span className="text-[12px] opacity-75 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}
            </span>
            <span className="text-[12px] opacity-75 flex items-center gap-1">
              <Eye className="w-3 h-3" /> {post.views} lượt xem
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-serif leading-tight max-w-4xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-sm opacity-75">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <Link href="/tin-tuc">Tin tức</Link>
            <span className="opacity-50">/</span>
            <span className="line-clamp-1">{post.title}</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow)] border border-[var(--gray-100)]">
                <div 
                  className="prose prose-lg max-w-none text-[var(--gray-700)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-12 pt-8 border-t border-[var(--gray-100)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[var(--gray-500)] uppercase tracking-wider">Chia sẻ:</span>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform"><Facebook className="w-4 h-4" /></button>
                      <button className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:scale-110 transition-transform"><Twitter className="w-4 h-4" /></button>
                      <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:scale-110 transition-transform"><LinkIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <Link href="/tin-tuc" className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm hover:gap-3 transition-all">
                    <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
                  </Link>
                </div>
              </div>

              {/* Related Posts */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-[var(--gray-800)] mb-8 flex items-center gap-3">
                  <Newspaper className="w-6 h-6 text-[var(--primary)]" /> Bài viết liên quan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((rp) => (
                    <Link key={rp.id} href={`/tin-tuc/${rp.id}`} className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow)] border border-[var(--gray-100)] hover:-translate-y-1 transition-all group">
                      <div className="aspect-video bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)]">
                        <Newspaper className="w-8 h-8" />
                      </div>
                      <div className="p-4">
                        <h4 className="text-[14px] font-bold text-[var(--gray-800)] leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                          {rp.title}
                        </h4>
                        <div className="mt-3 text-[11px] text-[var(--gray-400)] font-bold uppercase">
                          {new Date(rp.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)]">
                <h3 className="text-lg font-bold text-[var(--gray-800)] mb-4 pb-2 border-b-2 border-[var(--primary)] inline-block">Mới cập nhật</h3>
                <ul className="space-y-4">
                  {relatedPosts.map((rp) => (
                    <li key={rp.id} className="group">
                      <Link href={`/tin-tuc/${rp.id}`} className="flex gap-3 items-start">
                        <div className="w-16 h-16 bg-[var(--primary-light)] rounded-xl shrink-0 flex items-center justify-center text-[var(--primary)]">
                          <Newspaper className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-[var(--gray-700)] leading-snug group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                            {rp.title}
                          </h4>
                          <span className="text-[11px] text-[var(--gray-400)] font-bold uppercase mt-1 block">
                            {new Date(rp.created_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[var(--primary-light)] rounded-[var(--radius-lg)] p-8 text-center border border-[var(--primary)] border-opacity-10">
                <h3 className="text-lg font-bold text-[var(--primary)] mb-3">Cần hỗ trợ?</h3>
                <p className="text-[13px] text-[var(--gray-600)] mb-6">Liên hệ với chúng tôi để được tư vấn y tế kịp thời.</p>
                <Link href="/lien-he" className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--primary-dark)] transition-all shadow-md">
                  Gửi yêu cầu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
