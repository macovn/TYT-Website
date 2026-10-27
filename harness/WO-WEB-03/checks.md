# WO-WEB-03 — Checks (viết trước khi sửa code)

| # | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| C1 | `npx tsc --noEmit` đạt 0 lỗi | pass | Chạy 27/10/2026 sau khi sửa xong: không có output lỗi |
| C2 | `npm run build` đạt, số route không giảm so với baseline 25 | pass | Build đạt, "Generating static pages (25/25)", bảng route đầy đủ như baseline |
| C3 | Không còn gradient ở hero/quick-access/thẻ/avatar/placeholder: grep `linear-gradient` và `bg-gradient` trong globals.css + các component trang chủ chỉ còn ở ngoài phạm vi (nếu có phải ghi rõ) | pass | grep trên globals.css và 8 component trang chủ/chrome: 0 kết quả. Gradient còn ở các trang con (dải tiêu đề trang) và admin/login: ngoài phạm vi, ghi ở progress.md |
| C4 | Token màu đích có mặt: #0C6B58, #084C3E, #B42318 trong globals.css; Playfair không còn áp cho tiêu đề (tailwind serif trỏ Be Vietnam Pro) | pass | 5 dòng token khớp; tailwind serif = var(--font-be-vietnam); Playfair = 0 trong globals.css và components |
| C5 | Hero mới chứa: bảng giờ làm việc (7:30–16:30), lịch tiêm 18/24/25, số cấp cứu 0203.3822.115 dạng tel link; không còn cụm số liệu 3.000+/95%/60+ ở hero | pass | grep Hero.tsx: 4/4 mẫu khóa có mặt; 3.000+/95% = 0 |
| C6 | Nội dung đã chốt không đổi: grep các chuỗi giờ/lịch tiêm/số điện thoại ở các trang liên quan vẫn đúng như trước đợt này | pass | git status xác nhận chỉ sửa đúng 10 file trong SCOPE, không đụng trang nội dung; số cấp cứu còn nguyên ở gioi-thieu/thong-bao |
| C7 | Kiểm chứng trực quan bản live sau gộp (tab mới): header phẳng, hero mới hiển thị đúng, logo mới còn nguyên | unresolved | Chờ gộp PR và kiểm chứng live |
