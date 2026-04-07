'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, title')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching ticker announcements:', error);
      } else {
        setAnnouncements(data || []);
      }
      setLoading(false);
    };

    fetchAnnouncements();
  }, []);

  if (loading) return null;
  if (announcements.length === 0) return null;

  return (
    <div className="announcement-bar">
      <div className="container !px-0">
        <div className="flex items-stretch">
          <div className="bg-[var(--accent)] text-white px-5 py-3 font-bold text-[13px] flex items-center gap-2 whitespace-nowrap shrink-0">
            <Megaphone className="w-4 h-4" /> THÔNG BÁO
          </div>
          <div className="flex-1 overflow-hidden py-3 px-4">
            <div className="flex gap-10 ticker-animation whitespace-nowrap hover:[animation-play-state:paused]">
              {[...announcements, ...announcements].map((item, i) => (
                <Link 
                  key={i} 
                  href={`/thong-bao/${item.id}`}
                  className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"></span> {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
