'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, Menu, X, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { name: 'Trang chủ', path: '/' },
  { 
    name: 'Giới thiệu', 
    path: '/gioi-thieu',
    dropdown: [
      { name: 'Giới thiệu trạm', path: '/gioi-thieu' },
      { name: 'Chức năng nhiệm vụ', path: '/gioi-thieu#chuc-nang' },
      { name: 'Cơ cấu tổ chức', path: '/gioi-thieu#co-cau' },
    ]
  },
  { 
    name: 'Tin tức & Thông báo', 
    path: '/tin-tuc',
    dropdown: [
      { name: 'Tin tức', path: '/tin-tuc' },
      { name: 'Thông báo', path: '/thong-bao' },
    ]
  },
  { name: 'Sức khỏe', path: '/suc-khoe' },
  { name: 'Dịch vụ y tế', path: '/dich-vu' },
  { 
    name: 'Tài liệu & Thư viện', 
    path: '/tai-lieu',
    dropdown: [
      { name: 'Tài liệu', path: '/tai-lieu' },
      { name: 'Thư viện', path: '/thu-vien' },
    ]
  },
  { name: 'Hỏi đáp', path: '/hoi-dap' },
  { name: 'Liên hệ', path: '/lien-he' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="container">
        <div className="flex items-center justify-between py-3.5 gap-5">
          <Link href="/" className="flex items-center gap-3.5">
            <div className="logo-icon">
              <PlusCircle className="w-7 h-7 text-white" />
            </div>
            <div className="logo-text">
              <h1 className="text-[17px] font-extrabold text-[var(--primary-dark)] leading-tight tracking-tight">
                TRẠM Y TẾ CÁI BẦU
              </h1>
              <p className="text-[12px] text-[var(--gray-500)] font-normal leading-tight">
                Đặc khu Vân Đồn – Tỉnh Quảng Ninh
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.path}
                  className={cn(
                    "flex items-center gap-1 px-3.5 py-2.5 text-[13.5px] font-semibold text-[var(--gray-700)] rounded-lg transition-all hover:bg-[var(--primary-light)] hover:text-[var(--primary)]",
                    pathname === link.path && "bg-[var(--primary-light)] text-[var(--primary)]"
                  )}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-3 h-3 opacity-50 transition-transform group-hover:rotate-180" />}
                </Link>
                
                {link.dropdown && (
                  <div className="absolute top-full left-0 mt-2 min-w-[220px] bg-white border border-[var(--gray-100)] rounded-[var(--radius)] shadow-[var(--shadow-lg)] opacity-0 invisible translate-y-[-8px] transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-[200] overflow-hidden">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className="block px-4.5 py-2.5 text-[13.5px] font-medium text-[var(--gray-700)] border-b border-[var(--gray-50)] last:border-0 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] hover:pl-6 transition-all"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <button 
            className="lg:hidden p-1.5 text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-white z-[9999] flex flex-col transition-transform duration-300",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 bg-[var(--primary-dark)] text-white">
          <h3 className="text-base font-bold uppercase">Trạm Y tế Cái Bầu</h3>
          <button onClick={() => setIsMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-3 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-3.5 rounded-lg text-base font-semibold text-[var(--gray-700)] border-b border-[var(--gray-100)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
