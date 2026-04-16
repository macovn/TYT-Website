'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Link as LinkIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sanitizeHtml, slugify } from '@/lib/utils';

export default function PostDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      setPost(null);
      setLoading(true);
      
      try {
        // 1. Try to fetch by ID if slug is a UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        
        if (isUuid) {
          const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('id', slug)
            .single();
          
          if (data) {
            setPost(data);
            fetchRelated(data.id);
            setLoading(false);
            return;
          }
        }

        // 2. Fetch all posts and match by slugified title (Resilient fallback)
        const { data: allPosts } = await supabase
          .from('posts')
          .select('id, title, content, created_at, status, thumbnail, category');
        
        const found = allPosts?.find(p => slugify(p.title) === slug);
        if (found) {
          setPost(found);
          fetchRelated(found.id);
        }
      } catch (err) {
        console.error('Error in fetchPost:', err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchRelated(currentId: string) {
      const { data: related } = await supabase
        .from('posts')
        .select('id, title, created_at')
        .neq('id', currentId)
        .limit(5);
      
      if (related) {
        setRelatedPosts(related);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
        <p className="text-gray-500 font-medium">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h1>
        <Link href="/tin-tuc" className="text-[var(--primary)] font-bold flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--gray-50)] min-h-screen pb-14">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <div className="flex items-center gap-2 text-sm opacity-75 mb-6">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <Link href="/tin-tuc">Tin tức</Link>
            <span className="opacity-50">/</span>
            <span className="truncate max-w-[200px]">{post.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-serif leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--accent)]" />
              {new Date(post.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--accent)]" />
              Trạm Y tế Cái Bầu
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent)]" />
              5 phút đọc
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-[-40px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[var(--gray-800)] prose-p:text-[var(--gray-600)] prose-p:leading-relaxed prose-li:text-[var(--gray-600)] prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
              />
              
              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Chia sẻ:</span>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-500 hover:text-white transition-all">
                      <LinkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <Link href="/tin-tuc" className="text-[var(--primary)] font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[var(--primary)] inline-block">Bài viết liên quan</h3>
              <div className="space-y-4">
                {relatedPosts.map((p) => (
                  <Link key={p.slug} href={`/tin-tuc/${p.slug}`} className="group block">
                    <h4 className="text-sm font-bold text-gray-700 group-hover:text-[var(--primary)] transition-colors line-clamp-2 mb-1">
                      {p.title}
                    </h4>
                    <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('vi-VN')}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-3xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-4">Bạn cần hỗ trợ?</h3>
              <p className="text-sm opacity-90 mb-6 leading-relaxed">Đội ngũ y bác sĩ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn.</p>
              <Link href="/lien-he" className="block w-full bg-white text-[var(--primary)] text-center py-3 rounded-xl font-bold hover:bg-[var(--accent)] hover:text-white transition-all">
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
