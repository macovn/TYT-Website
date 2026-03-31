'use client';

import { Megaphone } from 'lucide-react';

const tickerItems = [
  "Lịch tiêm chủng tháng 03/2026: Thứ 4 ngày 12/03 tại Trạm Y tế Cái Bầu",
  "Phòng chống sốt xuất huyết mùa mưa: Diệt lăng quăng, ngủ màn phòng muỗi đốt",
  "Khám sức khỏe học sinh: 15-20/03/2026 tại các trường trên địa bàn xã",
];

export default function AnnouncementTicker() {
  return (
    <div className="announcement-bar">
      <div className="container !px-0">
        <div className="flex items-stretch">
          <div className="bg-[var(--accent)] text-white px-5 py-3 font-bold text-[13px] flex items-center gap-2 whitespace-nowrap shrink-0">
            <Megaphone className="w-4 h-4" /> THÔNG BÁO
          </div>
          <div className="flex-1 overflow-hidden py-3 px-4">
            <div className="flex gap-10 ticker-animation whitespace-nowrap hover:[animation-play-state:paused]">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <div key={i} className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[var(--gray-700)]">
                  <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"></span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
