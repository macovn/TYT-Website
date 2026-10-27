'use client';

import { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
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
      <div className="container">
        <div className="flex items-center gap-4 py-3 flex-wrap">
          <div className="bg-[var(--primary-dark)] text-white px-3 py-1.5 rounded font-bold text-[12.5px] flex items-center gap-2 whitespace-nowrap shrink-0">
            <Megaphone className="w-4 h-4" /> THÔNG BÁO
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8">
            {announcements.slice(0, 2).map((item) => (
              <Link
                key={item.id}
                href={`/thong-bao/${item.id}`}
                className="text-[14.5px] font-medium text-[var(--gray-800)] hover:text-[var(--primary)] transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <Link href="/thong-bao" className="ml-auto text-[13.5px] font-semibold text-[var(--primary)] hover:underline whitespace-nowrap">
            Xem tất cả
          </Link>
        </div>
      </div>
    </div>
  );
}
