import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { stripHtml, extractFirstImage } from '@/lib/utils';
import AnnouncementDetailClient from './AnnouncementDetailClient';

interface PageProps {
  // WO-WEB-27: Next 16 — params la Promise, phai await truoc khi dung.
  params: Promise<{ id: string }>;
}

async function getAnnouncement(id: string) {
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const announcement = await getAnnouncement(id);
  
  if (!announcement) {
    return {
      title: 'Không tìm thấy thông báo',
    };
  }

  const description = stripHtml(announcement.content).substring(0, 160);
  const image = extractFirstImage(announcement.content);
  
  return {
    title: announcement.title,
    description: description,
    openGraph: {
      title: announcement.title,
      description: description,
      images: image ? [{ url: image }] : [],
      type: 'article',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: announcement.title,
      description: description,
      images: image ? [image] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <AnnouncementDetailClient id={id} />;
}
