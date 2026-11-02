# WO-WEB-08 Checks

| # | Hạng mục | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Sao lưu toàn bộ bot_chunks trước thay đổi, đếm khớp 321 đoạn theo từng văn bản | pass | ~/workspace/backups/bot-chunks-backup-20261102-wo-web-08.json: LUAT-03-2007: 71, ND-104-2016: 40, ND-13-2024: 6, NQ-104-2022: 6, TT-13-2026: 45, TT-51-2017: 32, QD-1575-2023: 35, QD-2780-2025: 86 |
| 2 | File nguồn mới lưu vào kho-tri-thuc-an/tiem-chung + cắt đoạn đúng chuẩn WO-WEB-07 | pass (phần chuẩn bị) | Luật 114/2025: 68 đoạn (đủ Điều 21, 22, 45). NĐ 165/2026: cắt đúng 16 Điều trong phạm vi (Điều 5, 26, Mục 5 Điều 48-58, Điều 94, 95, 96) thành 31 đoạn từ toàn văn Công báo số 300, đối chiếu điểm bản ký số |
| 3 | Gỡ LUAT-03-2007, ND-13-2024; ND-104-2016 chỉ còn Điều 9, 10, 11 kèm ghi chú chuyển tiếp | pending (chờ SQL Editor) | sql/dot4a đã soạn; gói nạp lại 6 đoạn ND-104 (ord 13-18 của bản sao lưu, ghi chú chèn vào đoạn đầu mỗi Điều, dài tối đa 1.458 ký tự, dưới trần 2.000 của hàm nạp) đã sẵn sàng trong chunks_wo_web_08.json |
| 4 | Nạp đoạn Luật 114/2025 + NĐ 165/2026; đếm lại khớp từng văn bản; thu hồi quyền ghi anon | pending (chờ SQL Editor) | Gói nạp 105 đoạn (LUAT-114-2025: 68, ND-165-2026: 31, ND-104-2016: 6) + load_wo_web_08.py sẵn sàng; số đoạn kỳ vọng sau nạp: tổng 309 (68/31/6/6/45/32/35/86); sql/dot4b thu hồi quyền đã soạn |
| 5 | Live (a): câu bệnh tiêm chủng bắt buộc dẫn đúng Điều 3 TT 13/2026 | pending | Chờ nạp xong |
| 6 | Live (b): câu điều kiện cơ sở tiêm chủng dẫn căn cứ hiện hành, không trình bày NĐ 104 như còn hiệu lực toàn bộ | pending | Chờ nạp xong |
| 7 | Live (c): câu xử trí phản vệ dẫn TT 51/2017 | pending | Chờ nạp xong |
| 8 | Live (d): câu về phòng bệnh dẫn được Luật 114/2025 | pending | Chờ nạp xong |
| 9 | Live (e): không hồi quy lịch tiêm chủng 18/24/25, giờ làm việc 7:30-16:30, sàng lọc khẩn cấp trả 0203.3822.115 không qua AI | pending | Chờ nạp xong |

## Nhật ký kiểm chứng

| Thời gian | Cách kiểm | Môi trường | Kết quả |
|---|---|---|---|
| 02/11/2026 sáng | Đọc REST toàn bảng bot_chunks bằng khóa anon, đếm theo doc_code | Supabase live | 321 đoạn, khớp tuyệt đối trạng thái WO-WEB-07; đã lưu sao lưu |
| 02/11/2026 sáng | Cắt Luật 114/2025 bằng loader WO-WEB-07 | Local | 68 đoạn, 47 section; Điều 21, 22, 23, 45 có mặt |
| 02/11/2026 sáng | Đối chiếu Điều 94 NĐ 165/2026 trên toàn văn Công báo số 300 với sổ rà soát kho và bản ký số (OCR điểm trang 38-39) | Local | Khoản 4 điểm a, c: NĐ 104/2016 và NĐ 13/2024 hết hiệu lực từ 01/7/2026; khoản 5: Điều 9, 10, 11 NĐ 104 còn hiệu lực đến 30/6/2027; khoản 2: Điều 49 NĐ 165 hiệu lực từ 01/7/2027 |
| 02/11/2026 sáng | Mô phỏng offline thuật toán truy xuất (cụm 2 âm tiết + IDF, khử trùng theo Điều, top 4) trên tập 309 đoạn sau thay đổi | Local | (b) Điều 9 NĐ 104 (bản ghi chú) hạng 1, Điều 10 hạng 3; (c) TT 51/2017 chiếm cả 4 vị trí đầu; (d) Luật 114/2025 vào top 4; câu rà soát học sinh: Điều 5 NĐ 165 hạng 1; câu bồi thường: Điều 50-52 NĐ 165 chiếm 3 vị trí đầu. Điểm cần theo dõi: (a) Điều 3 TT 13/2026 hạng 9 trong mô phỏng, bị Luật 114 Điều 22 cạnh tranh; mô phỏng cũng không tái lập đúng kết quả live WO-WEB-07 trên tập cũ nên chỉ coi là tín hiệu, kết luận cuối ở kiểm chứng live |
