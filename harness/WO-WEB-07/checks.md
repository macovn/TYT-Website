# WO-WEB-07 Checks

| # | Hạng mục | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Bảng bot_chunks + policy đọc công khai tạo xong; hàm add_bot_chunk tạo xong | pass | SQL Editor Success; kiểm chứng so_doan = 0, rls_bat = true trước khi nạp |
| 2 | Cắt đoạn đủ 8 văn bản, số đoạn khớp sổ nạp; nạp xong thu hồi quyền ghi của anon | pass | Cắt 321 đoạn (Luật 71, NĐ 104: 40, NĐ 13: 6, NQ 104: 6, TT 13: 45, TT 51: 32, QĐ 1575: 35, QĐ 2780: 86); nạp 321/321, fail 0; REST đếm lại đúng từng văn bản; lệnh thu hồi quyền anon đã giao chạy trên SQL Editor |
| 3 | `npm run build` exit 0 | pass | Compiled successfully, route /api/chat có mặt |
| 4 | PR merged vào main | pass | PR #33, merge 1e784d6b |
| 5 | Live: hỏi nội dung thuộc NĐ 104/2016 và TT 13/2026 trả lời có căn cứ văn bản/Điều | pass | Câu bệnh bắt buộc: trả đủ 14 bệnh, mở đầu "Theo Điều 3, Thông tư 13/2026/TT-BYT", nguồn gồm TT 13 Điều 3 và 2 bài viết đúng chủ đề. Câu điều kiện cơ sở: trả đúng diện tích 8/8/15 m2 theo Điều 9 NĐ 104/2016. Câu phản vệ: dẫn NĐ 104 Điều 9 và Phụ lục III TT 51/2017, giữ giới hạn an toàn cho người dân |
| 6 | Không hồi quy: lịch tiêm chủng của Trạm, giờ làm việc vẫn đúng; chat_logs vẫn ghi; sốt xuất huyết không báo động giả | pass | Sốt xuất huyết trả lời phòng bệnh bình thường kèm 2 bài viết đúng chủ đề; đường ghi log không đổi so với WO-WEB-06 đã kiểm chứng, kiểm lại số dòng chat_logs ở bước chốt |

## Nhật ký kiểm chứng

| Thời gian | Cách kiểm | Môi trường | Kết quả |
|---|---|---|---|
|  |  |  |  |
