# WO-WEB-08 Checks

| # | Hạng mục | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Sao lưu toàn bộ bot_chunks trước thay đổi, đếm khớp 321 đoạn theo từng văn bản | pass | ~/workspace/backups/bot-chunks-backup-20261102-wo-web-08.json: LUAT-03-2007: 71, ND-104-2016: 40, ND-13-2024: 6, NQ-104-2022: 6, TT-13-2026: 45, TT-51-2017: 32, QD-1575-2023: 35, QD-2780-2025: 86 |
| 2 | File nguồn mới lưu vào kho-tri-thuc-an/tiem-chung + cắt đoạn đúng chuẩn WO-WEB-07 | pass (phần chuẩn bị) | Luật 114/2025: 68 đoạn (đủ Điều 21, 22, 45). NĐ 165/2026: cắt đúng 16 Điều trong phạm vi (Điều 5, 26, Mục 5 Điều 48-58, Điều 94, 95, 96) thành 31 đoạn từ toàn văn Công báo số 300, đối chiếu điểm bản ký số |
| 3 | Gỡ LUAT-03-2007, ND-13-2024; ND-104-2016 chỉ còn Điều 9, 10, 11 kèm ghi chú chuyển tiếp | pass | dot4a chạy 08:44-08:46 ngày 02/11/2026 qua SQL Editor; sau xóa còn đúng 204 đoạn thuộc 5 văn bản giữ lại |
| 4 | Nạp đoạn Luật 114/2025 + NĐ 165/2026; đếm lại khớp từng văn bản; thu hồi quyền ghi anon | pass | load_wo_web_08.py: ok=105, fail=0; dot4b chạy 08:49-08:51 đã thu hồi EXECUTE của anon; đếm cuối khớp tuyệt đối: tổng 309 (68/31/6/6/45/32/35/86), LUAT-03-2007 và ND-13-2024 bằng 0 |
| 5 | Live (a): câu bệnh tiêm chủng bắt buộc dẫn đúng Điều 3 TT 13/2026 | fail (chưa ổn định theo cách hỏi) -> đã xử lý ở lượt tinh chỉnh truy xuất, xem mục riêng bên dưới | Cách hỏi "Danh mục..." đạt đủ 14 bệnh; cách hỏi gốc WO-WEB-07 chỉ dừng ở khung Điều 22 Luật 114; cách hỏi nêu đích danh TT 13/2026 không lấy được Điều 3 |
| 6 | Live (b): câu điều kiện cơ sở tiêm chủng dẫn căn cứ hiện hành, không trình bày NĐ 104 như còn hiệu lực toàn bộ | pass | Đáp án dẫn Điều 49 NĐ 165/2026, Điều 11 và Điều 10 NĐ 104/2016 kèm ghi chú còn hiệu lực đến hết 30/6/2027 |
| 7 | Live (c): câu xử trí phản vệ dẫn TT 51/2017 | pass | Nguồn TT 51/2017 ở đầu, nội dung xử trí đúng |
| 8 | Live (d): câu về phòng bệnh dẫn được Luật 114/2025 | pass | Đáp án dẫn Luật 114/2025/QH15 và Điều 51 NĐ 165/2026 |
| 9 | Live (e): không hồi quy lịch tiêm chủng 18/24/25, giờ làm việc 7:30-16:30, sàng lọc khẩn cấp trả 0203.3822.115 không qua AI | pass | Lịch 18, 24, 25 kèm ngoại lệ; giờ Thứ 2-Thứ 6, 7:30-16:30; câu khẩn cấp trả provider rule-emergency, không qua AI |

## Lượt tinh chỉnh truy xuất (Maco duyệt 09:04 ngày 02/11/2026)

| # | Hạng mục | Kết quả | Bằng chứng |
|---|---|---|---|
| T1 | Chẩn đoán nguyên nhân tụt hạng của Điều 3 TT 13/2026 cho cả 3 cách hỏi | pass | Mô phỏng offline trung thực trên tập 309 đoạn: cách hỏi đích danh bị mã văn bản chiếm trần 8 âm tiết (Điều 3 đạt 4,90 điểm, hạng 124); cách hỏi gốc thua 3,22 điểm do đoạn liệt kê nêu cụm khóa một lần so với đoạn thủ tục lặp hai lần; cách hỏi "Danh mục..." đồng điểm ở vị trí chọn cuối |
| T2 | Offline: cả 3 cách hỏi danh mục đều đưa Điều 3 TT 13/2026 vào nhóm chọn | pass | Hạng 2 (134,8), hạng 2 (95,4), hạng 4 (73,8) sau tinh chỉnh |
| T3 | Offline: không hồi quy điều kiện cơ sở (giữ Điều 49 NĐ 165 + Điều 9, 10, 11 NĐ 104), phản vệ (TT 51/2017 cả 4 vị trí), Luật Phòng bệnh (có đoạn Luật 114/2025), lịch tiêm và giờ làm việc (tập đoạn chọn không đổi) | pass | Mô phỏng offline 11 câu (3 câu đích + 8 câu hồi quy), toàn bộ cổng đạt |
| T4 | Live sau gộp PR code: 3 cách hỏi danh mục liệt kê đủ theo Điều 3 TT 13/2026 + 3 câu hồi quy (điều kiện cơ sở, phản vệ, lịch tiêm) | pending | Chờ gộp PR code và bản live Vercel cập nhật |

## Nhật ký kiểm chứng

| Thời gian | Cách kiểm | Môi trường | Kết quả |
|---|---|---|---|
| 02/11/2026 sáng | Đọc REST toàn bảng bot_chunks bằng khóa anon, đếm theo doc_code | Supabase live | 321 đoạn, khớp tuyệt đối trạng thái WO-WEB-07; đã lưu sao lưu |
| 02/11/2026 sáng | Cắt Luật 114/2025 bằng loader WO-WEB-07 | Local | 68 đoạn, 47 section; Điều 21, 22, 23, 45 có mặt |
| 02/11/2026 sáng | Đối chiếu Điều 94 NĐ 165/2026 trên toàn văn Công báo số 300 với sổ rà soát kho và bản ký số (OCR điểm trang 38-39) | Local | Khoản 4 điểm a, c: NĐ 104/2016 và NĐ 13/2024 hết hiệu lực từ 01/7/2026; khoản 5: Điều 9, 10, 11 NĐ 104 còn hiệu lực đến 30/6/2027; khoản 2: Điều 49 NĐ 165 hiệu lực từ 01/7/2027 |
| 02/11/2026 sáng | Mô phỏng offline thuật toán truy xuất (cụm 2 âm tiết + IDF, khử trùng theo Điều, top 4) trên tập 309 đoạn sau thay đổi | Local | (b) Điều 9 NĐ 104 (bản ghi chú) hạng 1, Điều 10 hạng 3; (c) TT 51/2017 chiếm cả 4 vị trí đầu; (d) Luật 114/2025 vào top 4; câu rà soát học sinh: Điều 5 NĐ 165 hạng 1; câu bồi thường: Điều 50-52 NĐ 165 chiếm 3 vị trí đầu. Điểm cần theo dõi: (a) Điều 3 TT 13/2026 hạng 9 trong mô phỏng, bị Luật 114 Điều 22 cạnh tranh; mô phỏng cũng không tái lập đúng kết quả live WO-WEB-07 trên tập cũ nên chỉ coi là tín hiệu, kết luận cuối ở kiểm chứng live |
