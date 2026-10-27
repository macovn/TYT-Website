# WO-WEB-03 — Thiết kế lại UI website Trạm Y tế Cái Bầu

## Hợp đồng đầu vào
- TASK: Triển khai hướng thiết kế đã trình Maco ngày 27/10/2026 (từ nghiên cứu 5 website y tế cơ sở: Anh Sơn, Tân Bình, SingHealth Polyclinics, NHS.uk, Wrekenton): giao diện phẳng, đơn giản, chuyên nghiệp, không giống mẫu AI/SaaS.
- OUTPUT: repo macovn/TYT-Website, nhánh dot-2/thiet-ke-lai-ui; sản phẩm là code giao diện đã gộp main và lên live qua Vercel.
- SOURCES: ~/workspace/research_notes/nghien-cuu-web-y-te-co-so-20261027-0723/report.md (mục 3c); thông tin chính thức đã chốt 27/10/2026 (giờ 7:30–16:30, lịch tiêm 18/24/25 trừ T7/CN, cấp cứu 0203.3822.115, chính 0203.3795.898).
- SCOPE: globals.css (design tokens + hero/quick/section/card/ticker), tailwind.config (font serif), TopBar, Header (chỉ style), Hero, AnnouncementTicker (bỏ marquee, hiện tĩnh), ServicesSection (thêm dòng lịch), NewsSection (bỏ gradient placeholder), trang chủ page.tsx (khối đội ngũ phẳng), Footer (màu phẳng + logo thật thay icon). KHÔNG đổi: route, model dữ liệu, nội dung chữ đã chốt, khu admin (ngoài việc kế thừa token), logic Supabase.
- LIMIT: tối đa 3 vòng sửa mỗi bước; Maco đã duyệt hướng thiết kế và lệnh "Triển khai" ngày 27/10/2026 nên không chờ duyệt plan.

## Hệ thiết kế đích
- Màu phẳng: primary #0C6B58, primary-dark #084C3E, primary-light #E9F3EF, nền phụ #F4F7F5, chữ chính #17201C, chữ phụ #4A5A54, đỏ #B42318 chỉ cho cấp cứu/khẩn cấp. Không gradient ở hero, dải truy cập nhanh, thẻ, avatar, placeholder ảnh.
- Chữ: Be Vietnam Pro cho cả tiêu đề (bỏ Playfair); thân 17px/1.65; số điện thoại trong hero 24–28px đậm, bấm gọi được.
- Hình khối: bo góc tối đa 10px, viền 1px, bóng đổ gần như không; thẻ không nhảy khi hover.
- Trang chủ: hero trắng/xanh nhạt phẳng, cột phải là bảng "Giờ làm việc và lịch tiêm" (giờ hôm nay tự tính theo ngày, lịch tiêm 18/24/25, số cấp cứu); dải truy cập nhanh phẳng; thông báo dạng tĩnh dễ đọc.

## Bước thực thi
1. globals.css: tokens + hero + quick-access + section-tag + post-card/service-card + announcement-bar + prose headings.
2. tailwind.config.js: serif -> Be Vietnam Pro.
3. TopBar: chữ lớn hơn, badge cấp cứu đỏ phẳng là tel link, bỏ pulse.
4. Header: bỏ shadow, viền dưới mảnh (kiểm tra markup hiện tại trước khi sửa).
5. Hero: viết lại theo bố cục mới, bỏ cụm số liệu (số liệu vẫn còn ở trang Giới thiệu).
6. AnnouncementTicker: hiện tối đa 2 thông báo dạng tĩnh, bỏ animation marquee.
7. ServicesSection: thêm dòng lịch có icon Clock; NewsSection: placeholder phẳng; page.tsx: thẻ đội ngũ phẳng, bỏ gradient avatar và hover nâng; Footer: nền primary-dark phẳng, dùng logo-tram.svg thay ô icon PlusCircle.
8. Kiểm chứng: tsc, build, grep; PR, gộp, kiểm chứng trực quan bản live (tab mới).
