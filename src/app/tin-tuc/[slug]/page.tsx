import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { stripHtml, slugify, extractFirstImage } from '@/lib/utils';
import PostDetailClient from './PostDetailClient';

interface PageProps {
  params: { slug: string };
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

  const { data: allPosts } = await supabase
    .from('posts')
    .select('id, title, excerpt, content, thumbnail');
  
  return allPosts?.find(p => slugify(p.title) === slug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  
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

export default function PostDetailPage({ params }: PageProps) {
  return <PostDetailClient slug={params.slug} />;
}
