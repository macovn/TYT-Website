# WO-WEB-28 — Kiểm chứng

| Mã | Hạng mục | Kết quả | Bằng chứng |
| --- | --- | --- | --- |
| ĐG1 | Nguyên nhân gốc xác định bằng bằng chứng | pass | API Supabase trả lỗi 42703 "column posts.excerpt does not exist" cho đúng danh sách cột của nhánh tra slug; danh sách cột của phía client (không có excerpt) chạy bình thường |
| T1 | Diff chỉ gồm file src/app/tin-tuc/[slug]/page.tsx + hồ sơ WO | pass | push-files chỉ đẩy file trang chi tiết bài viết và hồ sơ WO-WEB-28 |
| T2 | npx tsc --noEmit sạch; npm run build sạch sau rm -rf .next | pass | TSC-CLEAN, build hoàn tất ngày 17/11/2026 |
| T3 | Kiểm chứng tại máy/Preview: URL dạng slug có thẻ tiêu đề là tiêu đề bài viết thật; URL dạng UUID vẫn đúng | pass | Tại máy Marley (bản build mới, dữ liệu thật): URL slug bài COPD cho thẻ tiêu đề đúng tên bài "HƯỞNG ỨNG NGÀY THẾ GIỚI PHÒNG, CHỐNG COPD (18/11/2026)" thay vì "Không tìm thấy bài viết"; URL dạng UUID của bài thông báo lịch tiêm tháng 11 vẫn cho tiêu đề đúng như trước |
| T4 | Production sau gộp: URL bài COPD dạng slug có tiêu đề đúng; một URL dạng UUID vẫn đúng; trang chủ và /tin-tuc không đổi | pending | |
| T5 | Hoàn lưu sẵn sàng: ghi rõ mã PR và cách revert trước khi gộp | pending | |
