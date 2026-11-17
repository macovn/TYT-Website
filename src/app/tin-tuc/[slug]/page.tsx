import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { stripHtml, slugify, extractFirstImage } from '@/lib/utils';
import PostDetailClient from './PostDetailClient';

interface PageProps {
  // WO-WEB-27: Next 16 — params la Promise, phai await truoc khi dung.
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  
  if (isUuid) {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('id', slug)
      .single();
    if (data) return data;
  }

  // WO-WEB-28: bang posts khong co cot excerpt; truy van cu loi nen
  // getPost luon tra null voi URL dang slug va generateMetadata roi ve
  // "Khong tim thay bai viet". Mo ta da co duong du phong tu content.
  const { data: allPosts } = await supabase
    .from('posts')
    .select('id, title, content, thumbnail');

  return allPosts?.find(p => slugify(p.title) === slug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Không tìm thấy bài viết',
    };
  }

  const description = post.excerpt || stripHtml(post.content).substring(0, 160);
  const image = post.thumbnail || extractFirstImage(post.content);
  
  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      images: image ? [{ url: image }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: image ? [image] : [],
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <PostDetailClient slug={slug} />;
}
