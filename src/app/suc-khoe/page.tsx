'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Syringe, Baby, Apple, Users, Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

const healthCats = [
  { name: "Phòng chống Dịch bệnh", icon: <ShieldCheck className="w-6 h-6" />, color: "bg-blue-50 text-blue-600", slug: "phong-dich" },
  { name: "Tiêm chủng", icon: <Syringe className="w-6 h-6" />, color: "bg-amber-50 text-amber-600", slug: "tiem-chung" },
  { name: "Bệnh không lây", icon: <Heart className="w-6 h-6" />, color: "bg-red-50 text-red-600", slug: "benh-man-tinh" },
  { name: "Dinh dưỡng", icon: <Apple className="w-6 h-6" />, color: "bg-green-50 text-green-600", slug: "dinh-duong" },
  { name: "SK Bà mẹ Trẻ em", icon: <Baby className="w-6 h-6" />, color: "bg-purple-50 text-purple-600", slug: "ba-me-tre-em" },
  { name: "Dân số", icon: <Users className="w-6 h-6" />, color: "bg-emerald-50 text-emerald-600", slug: "dan-so" },
];

export const dynamic = 'force-dynamic';

export default function HealthPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('posts')
        .select('*, categories(*)')
        .eq('status', 'published')
        // .eq('categories.type', 'health') // Assuming we have a type field
        .order('created_at', { ascending: false });
      
      if (data) setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-14 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3 font-serif">Truyền Thông Sức Khỏe</h1>
          <p className="opacity-90 text-lg">Thông tin y tế chính xác, thiết thực cho cộng đồng</p>
          <div className="flex items-center gap-2 text-sm opacity-75 mt-4">
            <Link href="/">Trang chủ</Link>
            <span className="opacity-50">/</span>
            <span>Sức khỏe</span>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {healthCats.map((cat, i) => (
              <Link key={i} href={`/suc-khoe?cat=${cat.slug}`} className="bg-white rounded-2xl p-6 text-center shadow-[var(--shadow)] border-2 border-transparent hover:border-[var(--primary)] hover:-translate-y-1 transition-all group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${cat.color}`}>
                  {cat.icon}
                </div>
                <h3 className="text-[13px] font-bold text-[var(--gray-800)] leading-tight group-hover:text-[var(--primary)] transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="section-tag"><Heart className="w-4 h-4" /> Kiến thức mới nhất</div>
              <div className="grid gap-6">
                {posts.slice(0, 4).map((post) => (
                  <Link key={post.id} href={`/tin-tuc/${post.slug || slugify(post.title)}`} className="flex gap-4 bg-white p-4 rounded-2xl shadow-[var(--shadow)] border border-[var(--gray-100)] hover:shadow-[var(--shadow-lg)] transition-all">
                    <div className="w-24 h-24 bg-[var(--primary-light)] rounded-xl shrink-0 flex items-center justify-center text-[var(--primary)]">
                      <Newspaper className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-[var(--primary)] uppercase mb-1">{post.categories?.name}</div>
                      <h3 className="text-[15px] font-bold text-[var(--gray-800)] leading-snug line-clamp-2 mb-2">{post.title}</h3>
                      <div className="text-[12px] text-[var(--gray-500)] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[var(--gray-50)] rounded-3xl p-8 border border-[var(--gray-200)]">
              <h3 className="text-xl font-bold text-[var(--gray-800)] mb-6 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[var(--primary)]" /> Cẩm nang phòng bệnh
              </h3>
              <div className="space-y-4">
                {[
                  "Hướng dẫn rửa tay đúng cách theo Bộ Y tế",
                  "Chế độ dinh dưỡng cho người cao tuổi",
                  "Lịch tiêm chủng cho phụ nữ mang thai",
                  "Cách xử lý khi trẻ bị sốt cao tại nhà",
                  "Phòng chống các bệnh lây qua đường hô hấp",
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-[var(--primary)] transition-colors cursor-pointer group">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[var(--primary)]">{item}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--primary)]" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 bg-white border-2 border-[var(--primary)] text-[var(--primary)] font-bold py-3 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all">
                Xem tất cả tài liệu
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
