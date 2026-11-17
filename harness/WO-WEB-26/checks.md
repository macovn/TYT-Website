# WO-WEB-26 — Checks

| Bước | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| T1 | Diff chỉ gồm route.ts, SupportChat.tsx và hồ sơ WO | pass | push-files chỉ đẩy 2 file nguồn + plan.md + checks.md lên nhánh dot-2/wo-web-26-doc-them-bai-viet |
| T2 | npx tsc --noEmit sạch; npm run build sạch sau rm -rf .next | pass | 17/11/2026: TSC-CLEAN; build hoàn tất không lỗi |
| T3 | Mô phỏng ngoại tuyến trên toàn bộ 300 bài viết thật: câu "Tháng 11 tiêm gì?" luật hiện hành cho bài trẻ sinh non (điểm 5) đứng đầu, luật mới cho danh sách rỗng; câu lừa đảo giả danh cho bài CẢNH BÁO đứng đầu; câu tháng 10 vẫn cho 2 bài tháng 10 | pass | Chạy 17/11/2026 trước khi sửa code: CURRENT top của câu tháng 11 = bài trẻ sinh non (5) + bài lịch tháng 05 (4); NEW top = rỗng; câu giả danh: bài CẢNH BÁO 28 điểm, 7 khớp tiêu đề; câu tháng 10: cả 2 bài tháng 10 đạt |
| T4 | Preview: (a) "Tháng 11 tiêm gì?" sources rỗng, không khối Đọc thêm, nội dung trả lời giữ nguyên chất; (b) câu giả danh cán bộ: sources có liên kết bài CẢNH BÁO; (c) câu vắc xin miễn phí: sources chỉ gồm bài viết hoặc rỗng, không còn dòng "Căn cứ"; (d) câu lịch tháng 10: hiện bài tháng 10 | pending | |
| T5 | Hồi quy Production sau gộp (nếu Maco duyệt): bộ câu hỏi tiêm chủng tự nhiên + câu danh mục tháng 11 trả lời như trước; khối Đọc thêm đúng luật mới | pending | |
