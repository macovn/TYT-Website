'use client';

import Link from 'next/link';
import { Phone, Mail, Clock, Activity, LogIn } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="flex justify-between items-center gap-3">
          <div className="hidden md:flex gap-5 flex-wrap">
            <a href="tel:02033795898" className="flex items-center gap-1.5 font-semibold hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-white/70" /> 0203.3795.898
            </a>
            <a href="mailto:lienhe@tramytecaibau.vn" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-white/70" /> lienhe@tramytecaibau.vn
            </a>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-white/70" /> Thứ 2 – Thứ 6: 7:30 – 16:30
            </span>
          </div>
          <div className="flex gap-4 items-center ml-auto md:ml-0">
            <a href="tel:02033822115" className="emergency-badge">
              <Activity className="w-4 h-4" /> Cấp cứu: 0203.3822.115
            </a>
            <Link href="/admin/login" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <LogIn className="w-4 h-4 text-white/70" /> Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
