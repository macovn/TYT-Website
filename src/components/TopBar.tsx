'use client';

import Link from 'next/link';
import { Phone, Mail, Clock, Activity, LogIn } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="flex justify-between items-center gap-3">
          <div className="hidden md:flex gap-5 flex-wrap">
            <a href="tel:02033795898" className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[var(--accent)]" /> 0203.3795.898
            </a>
            <a href="mailto:lienhe@tramytecaibau.vn" className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[var(--accent)]" /> lienhe@tramytecaibau.vn
            </a>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--accent)]" /> T2-T6: 7:00–17:00
            </span>
          </div>
          <div className="flex gap-4 items-center ml-auto md:ml-0">
            <div className="emergency-badge">
              <div className="pulse"></div>
              <Activity className="w-3.5 h-3.5" /> Cấp cứu: 0203.3822.115
            </div>
            <Link href="/admin/login" className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors">
              <LogIn className="w-3.5 h-3.5 text-[var(--accent)]" /> Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
