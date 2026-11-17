# WO-WEB-27 (ĐÁNH GIÁ): Nâng cấp Next.js 14.1 + React 18 lên Next.js 16 + React 19

- NGUỒN: Maco yêu cầu lập hồ sơ đánh giá 17/11/2026, sau nghiên cứu repo meta/astryx (design system của Meta, đang Beta, bắt buộc React 19+). Hồ sơ này CHỈ là đánh giá để Maco quyết; chưa phải lệnh thực thi.
- MỤC TIÊU ĐÁNH GIÁ: xác định tính khả thi, điểm vỡ cụ thể theo file, rủi ro, cổng kiểm chứng và phạm vi của việc nâng cấp nền tảng website Trạm (tramytecaibau.com) từ Next.js 14.1.0/React 18.2 lên Next.js 16.x/React 19.x. Nâng cấp này là điều kiện tiên quyết nếu sau này muốn thử Astryx, đồng thời xử lý hạng mục treo đã biết (khối Blocker B4 từ rà soát 27/10/2026) và gói @supabase/auth-helpers-nextjs đã bị khai tử chính thức.

## 1. Hiện trạng (bằng chứng: package.json tại main, kiểm tra 17/11/2026)
- next 14.1.0; react và react-dom ^18.2.0; @types/react ^18.2.47; typescript ^5.3.3; eslint ^8.56.0 + eslint-config-next ^14.1.0; script lint đang dùng "next lint".
- tailwindcss ^3.4.1 (+ @tailwindcss/typography, autoprefixer, postcss).
- @supabase/supabase-js ^2.39.0; @supabase/auth-helpers-nextjs ^0.10.0 (npm ghi rõ "Package no longer supported" — đã khai tử).
- @tiptap/* ^3.22.2 (soạn thảo trong Admin); lucide-react ^0.300.0 (rất cũ); dompurify, sanitize-html.
- Node tại máy Marley: v24.22.1. Triển khai: Vercel, tự động từ main.

## 2. Đích đề xuất (phiên bản mới nhất trên npm, kiểm tra 17/11/2026)
- next 16.4.6; react/react-dom 19.3.1; @types/react 19.3.0.
- @supabase/ssr 0.12.7 thay auth-helpers; @supabase/supabase-js 2.119.0.
- lucide-react lên bản mới (1.74.0) — kèm rà soát tên icon đã đổi/bỏ.
- GIỮ NGUYÊN để khóa phạm vi: Tailwind 3.4 (bản 4 là một cuộc di trú riêng, không gộp); TypeScript ở nhánh 5.x mới nhất (không nhảy thẳng lên 7); không đổi cấu trúc thư mục, không đổi giao diện, KHÔNG gồm Astryx (đánh giá riêng sau khi nền tảng ổn định).

## 3. Điểm vỡ cụ thể theo file (đã rà soát mã nguồn hiện hành)
1. API động chuyển sang bất đồng bộ (Next 15+): src/app/admin/layout.tsx đang gọi headers() đồng bộ (dòng 18) — phải await. Các trang động dùng params đồng bộ phải chuyển sang Promise và await: src/app/tin-tuc/[slug]/page.tsx (cả generateMetadata lẫn thân trang), src/app/gioi-thieu/[slug]/page.tsx, src/app/thong-bao/[id]/page.tsx, src/app/admin/posts/edit/[id]/page.tsx. Trang admin/pages/[slug] dùng hook useParams() phía client — không ảnh hưởng. Không có trang nào dùng searchParams — bớt một hạng mục.
2. Thay gói auth Supabase đã khai tử: 3 điểm dùng — src/middleware.ts (createMiddlewareClient), src/lib/supabase.ts (createClientComponentClient), src/app/admin/layout.tsx (createServerComponentClient). Chuyển sang @supabase/ssr (createServerClient/createBrowserClient + getAll/setAll cookie). Đây là điểm rủi ro cao nhất vì chạm đường đăng nhập Admin; bắt buộc kiểm chứng đăng nhập Admin và phiên làm việc sau nâng cấp.
3. next.config.js có tùy biến webpack (tắt fs/net/tls/canvas/jsdom/undici/sanitize-html phía client): Next 16 mặc định build bằng Turbopack, cấu hình webpack tùy biến không tự áp dụng — phải chọn một trong hai: giữ build bằng webpack (cờ --webpack) hoặc chuyển tương đương sang cấu hình Turbopack. Cần xác định lý do gốc của khối fallback (phục vụ sanitize-html) trước khi quyết.
4. "next lint" bị gỡ ở Next 16: đổi script sang gọi ESLint trực tiếp; eslint-config-next lên bản 16 (đi cùng ESLint 9 dạng flat config).
5. Thay đổi mặc định bộ nhớ đệm (từ Next 15): fetch và GET handler không còn tự cache; trang đọc dữ liệu qua supabase-js nên tác động thấp, nhưng phải kiểm chứng trang chủ và trang tin không chậm bất thường hay cũ dữ liệu.
6. Tương thích thư viện: TipTap 3 thiết kế cho React 19 (kiểm chứng bằng build + mở trình soạn thảo Admin); lucide-react 1.x có thể đã bỏ một số tên icon cũ — rà soát toàn bộ import icon.

## 4. Rủi ro chính và giảm thiểu
- Đăng nhập Admin hỏng sau khi đổi gói auth: giảm thiểu bằng kiểm chứng đăng nhập + tạo/sửa/xóa bài viết thử trên Preview trước gộp; hoàn lưu bằng revert PR.
- Hành vi An thay đổi ngoài ý muốn: route chat không dùng API bị vỡ (không params/headers đồng bộ), nhưng vẫn chạy trọn bộ cổng hồi quy trực tiếp sau gộp như WO-WEB-26 (bộ câu hỏi tiêm chủng tự nhiên, 10 ca hành vi WO-WEB-10, kiểm tra nguồn Đọc thêm WO-WEB-26).
- Preview không kiểm chứng được /api/chat (khóa AI chỉ đặt cho Production, bài học WO-WEB-26): kế hoạch kiểm chứng chia hai — Preview cho trang và Admin, Production cho An ngay sau gộp, sẵn sàng hoàn lưu.
- Vercel: Next 16 được hỗ trợ chính thức; rủi ro triển khai thấp.

## 5. Phạm vi và trình tự đề xuất (nếu Maco duyệt mở WO)
- Đúng một WO, một nhánh, một PR. Thứ tự trong WO: (a) nâng phiên bản + codemod chính thức của Next; (b) sửa các điểm vỡ mục 3 theo thứ tự auth sau cùng và kiểm chứng riêng; (c) cổng build (tsc + build sạch); (d) kiểm chứng Preview: trang chủ, tin tức (danh sách + chi tiết + phân trang), giới thiệu, thông báo, dịch vụ, văn bản, Admin (đăng nhập, danh sách bài, mở trình soạn thảo); (e) báo cáo trước gộp, Maco xác nhận riêng; (f) gộp, kiểm chứng Production: An (bộ hồi quy đầy đủ) + các trang chính; (g) hồ sơ đóng WO.
- Ước lượng: khoảng 10–15 file thay đổi (package.json, lockfile, next.config, middleware, lib/supabase, admin/layout, 4 trang động, cấu hình lint, hồ sơ WO). Không phát sinh chi phí dịch vụ.
- NGOÀI PHẠM VI: Astryx, Tailwind 4, TypeScript 7, thay đổi giao diện hay tính năng, di trú dữ liệu.

## 6. Khuyến nghị
- NÊN LÀM, theo đúng một WO độc lập như trên: nền tảng hiện tại đã cũ 2 thế hệ lớn, một gói auth đã bị khai tử (rủi ro bảo mật và tương thích tăng theo thời gian), và đây là điều kiện mở khóa cho mọi lựa chọn giao diện sau này kể cả Astryx.
- KHÔNG gộp chung với bất kỳ thay đổi giao diện/tính năng nào trong cùng WO.
- Sau nâng cấp, vận hành ổn định một thời gian rồi mới đánh giá Astryx ở phạm vi hẹp theo đề xuất tại báo cáo nghiên cứu 17/11/2026.

## 7. Thực thi (Maco duyệt mở WO ngày 17/11/2026)
- Nhánh: dot-2/wo-web-27-next16-react19. Quyết định kỹ thuật khi thực thi:
  - Build giữ webpack (script "next build --webpack", dev tương tự): next.config.js có tùy biến webpack tắt các module Node phía client phục vụ sanitize-html trong src/lib/utils.ts (được import bởi cả client component); giữ webpack là đường thay đổi ít nhất, Turbopack để đánh giá riêng sau.
  - Giữ nguyên tên middleware.ts (Next 16 vẫn hỗ trợ; đổi sang proxy là tùy chọn, không bắt buộc) và giữ getSession() như hiện hành để không đổi hành vi xác thực ngoài việc thay gói.
  - Thay gói: bỏ @supabase/auth-helpers-nextjs, thêm @supabase/ssr ^0.12.7; @supabase/supabase-js ^2.119.0; lucide-react ^0.577.0 (bản 1.x đã bỏ các icon thương hiệu Facebook/Youtube/Twitter mà website đang dùng ở 6 file; 0.577 là bản 0.x cuối, hỗ trợ React 19, giữ nguyên giao diện); eslint ^9 + eslint-config-next 16.4.6 với eslint.config.mjs (script lint gọi eslint trực tiếp); typescript ^5.9.3.
  - File sửa: package.json, package-lock.json, eslint.config.mjs (mới), src/middleware.ts, src/lib/supabase.ts, src/app/admin/layout.tsx, src/app/tin-tuc/[slug]/page.tsx, src/app/thong-bao/[id]/page.tsx + hồ sơ WO. Các trang dùng useParams() phía client không đổi.
