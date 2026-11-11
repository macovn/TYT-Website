# WO-WEB-20 — Checks

| Bước | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| T1 | Diff chỉ gồm page.tsx, globals.css và hồ sơ WO; không thành phần nào khác thay đổi | pass | push-files chỉ đẩy đúng 4 đường dẫn: src/app/page.tsx, src/app/globals.css, harness/WO-WEB-20/plan.md, checks.md, progress.md |
| T2 | npx tsc --noEmit sạch; npm run build sạch | pass | 11/11/2026: TSC-CLEAN; build hoàn tất không lỗi (sau rm -rf .next) |
| T3 | Preview: 4 thẻ hiển thị đúng 4 tông màu nhạt, biểu tượng và chữ phụ cùng tông, hover viền đậm theo tông | pass | Kiểm chứng bằng mắt trên Preview PR #75 ngày 11/11/2026: Khám bệnh xanh dương nhạt, Tiêm chủng xanh lá nhạt, Tư vấn tím nhạt, Cấp cứu đỏ nhạt; biểu tượng đậm cùng tông; bố cục sạch, không vỡ. Hover không bấm thử trực tiếp, bảo đảm bằng quy tắc CSS đã biên dịch trong bundle (đủ 10 mã màu) |
| T4 | Chữ và liên kết 4 thẻ không đổi: /dich-vu-y-te (x2), /suc-khoe, /lien-he; giờ 7:30–16:30, ngày 18/24/25, số 0203.3822.115 nguyên vẹn | pass | Dòng phụ trên Preview khớp nguyên văn cả 4 thẻ; diff page.tsx chỉ đổi class, không đổi href hay nội dung |
