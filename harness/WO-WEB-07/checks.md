# WO-WEB-07 Checks

| # | Hạng mục | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Bảng bot_chunks + policy đọc công khai tạo xong; hàm add_bot_chunk tạo xong | pass | SQL Editor Success; kiểm chứng so_doan = 0, rls_bat = true trước khi nạp |
| 2 | Cắt đoạn đủ 8 văn bản, số đoạn khớp sổ nạp; nạp xong thu hồi quyền ghi của anon | pass | Cắt 321 đoạn (Luật 71, NĐ 104: 40, NĐ 13: 6, NQ 104: 6, TT 13: 45, TT 51: 32, QĐ 1575: 35, QĐ 2780: 86); nạp 321/321, fail 0; REST đếm lại đúng từng văn bản; lệnh thu hồi quyền anon đã giao chạy trên SQL Editor |
| 3 | `npm run build` exit 0 | pass | Compiled successfully, route /api/chat có mặt |
| 4 | PR merged vào main | unresolved | |
| 5 | Live: hỏi nội dung thuộc NĐ 104/2016 và TT 13/2026 trả lời có căn cứ văn bản/Điều; hỏi vắc xin Rota trả đúng lộ trình NQ 104/NQ-CP | unresolved | |
| 6 | Không hồi quy: lịch tiêm chủng của Trạm, giờ làm việc vẫn đúng; chat_logs vẫn ghi; sốt xuất huyết không báo động giả | unresolved | |

## Nhật ký kiểm chứng

| Thời gian | Cách kiểm | Môi trường | Kết quả |
|---|---|---|---|
|  |  |  |  |
