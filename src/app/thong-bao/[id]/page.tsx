import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { stripHtml, extractFirstImage } from '@/lib/utils';
import AnnouncementDetailClient from './AnnouncementDetailClient';

interface PageProps {
  params: { id: string };
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
  const announcement = await getAnnouncement(params.id);
  
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

export default function Page({ params }: PageProps) {
  return <AnnouncementDetailClient id={params.id} />;
}
