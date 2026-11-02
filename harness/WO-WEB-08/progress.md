# WO-WEB-08 Progress

- 02/11/2026: Maco duyệt xử lý kho tiêm chủng của Bot An trên website (cùng phát hiện pháp lý với kho Zalo: Luật 03/2007, NĐ 104/2016, NĐ 13/2024 hết hiệu lực từ 01/7/2026). Lập plan.md, checks.md; nhánh dot-2/wo-web-08-kho-tiem-chung.
- Sao lưu: đã đọc toàn bộ bot_chunks qua REST (khóa anon, policy SELECT công khai) và lưu ~/workspace/backups/bot-chunks-backup-20261102-wo-web-08.json, 321 đoạn, đếm khớp từng văn bản với trạng thái sau WO-WEB-07 (71/40/6/6/45/32/35/86). Khôi phục khi cần: chạy lại tuyến WO-WEB-07 (cấp EXECUTE tạm, nạp loader/chunks.json gốc sau khi xóa bảng, thu hồi quyền).
- Nguồn mới đã sao vào ~/workspace/kho-tri-thuc-an/tiem-chung/: luat-114-2025-qh15.pdf (bản Cổng Chính phủ, có lớp chữ) và nghi-dinh-165-2026-nd-cp.pdf (bản ký số, scan).
- Luật 114/2025/QH15: trích txt bằng pdftotext, cắt bằng loader hiện hữu (chunk_wo_web_08.py) được 68 đoạn theo Điều/mục, đủ Điều 21 (sử dụng vắc xin), Điều 22 (tiêm chủng), Điều 45 (hiệu lực, khoản 2 bãi bỏ Luật 03/2007).
- NĐ 104/2016 giữ lại: 6 đoạn ord 13-18 thuộc Điều 9, 10, 11 lấy nguyên văn từ bản sao lưu; ghi chú chuyển tiếp (còn hiệu lực đến hết 30/6/2027 theo khoản 5 Điều 94 NĐ 165/2026) chèn vào đầu đoạn đầu của mỗi Điều (ord 13, 15, 17).
- NĐ 165/2026/NĐ-CP: bản ký số là bản quét 139 trang, OCR toàn văn chậm và nhiễu; đã chuyển sang toàn văn Công báo số 300 ngày 01-06-2026 (bản điện tử có lớp chữ, đúng văn bản đã công báo), đối chiếu điểm với bản ký số tại trang 1, Điều 49 và Điều 94 (OCR trang 38-39 bản ký số khớp nội dung bồi thường), chuẩn hóa NFC. PHẠM VI CẮT (16 Điều, 31 đoạn): Điều 5 (rà soát tiền sử tiêm chủng trong cơ sở giáo dục), Điều 26 (giấy chứng nhận quốc tế về tiêm chủng), Mục 5 TIÊM CHỦNG gồm Điều 48 (ngân sách tiêm chủng bắt buộc), Điều 49 (điều kiện cơ sở tiêm chủng; lưu ý Điều 49 hiệu lực từ 01/7/2027 theo khoản 2 Điều 94), Điều 50-57 (bồi thường tai biến sau tiêm chủng), Điều 58 (trách nhiệm tổ chức tiêm chủng của UBND), Điều 94 (hiệu lực thi hành), Điều 95 (quy định chuyển tiếp), Điều 96 (điều khoản tham chiếu). File txt đã trích lưu tại tiem-chung/nghi-dinh-165-2026-nd-cp.txt.
- Gói nạp đã sẵn sàng: loader/chunks_wo_web_08.json (105 đoạn: LUAT-114-2025 68, ND-165-2026 31, ND-104-2016 6) + loader/load_wo_web_08.py; SQL hai phần tại sql/dot4a-bot-chunks-hieu-luc-mo-nap.sql (xóa + cấp quyền tạm) và sql/dot4b-bot-chunks-hieu-luc-thu-hoi.sql (thu hồi + đếm kiểm chứng). Số đoạn kỳ vọng sau nạp: tổng 309 (LUAT-114-2025: 68, ND-165-2026: 31, ND-104-2016: 6, NQ-104-2022: 6, TT-13-2026: 45, TT-51-2017: 32, QD-1575-2023: 35, QD-2780-2025: 86; LUAT-03-2007 và ND-13-2024 bằng 0).
- Mô phỏng offline thuật toán truy xuất trên tập sau thay đổi: các câu (b), (c), (d) và câu bồi thường, rà soát học sinh đều ra đúng văn bản đích ở top 4; riêng câu (a) có tín hiệu cạnh tranh (Điều 3 TT 13/2026 hạng 9 trong mô phỏng, Luật 114 Điều 22 hạng 1) nhưng mô phỏng không tái lập được kết quả live đã đạt của WO-WEB-07 trên tập cũ, nên phải kết luận bằng kiểm chứng live sau nạp; nếu live (a) trượt, phương án dự phòng là PR tinh chỉnh truy xuất (ưu tiên đoạn thuộc Điều có tiêu đề khớp "Danh mục") ở lượt riêng.

## Điểm nghẽn cần Marley/Maco xử lý qua Supabase SQL Editor

- Việc xóa đoạn và cấp/thu hồi EXECUTE của hàm add_bot_chunk chỉ thực hiện được bằng SQL trên Supabase (khóa anon chỉ đọc; service_role key do Maco giữ trong Vercel, không dùng ở lượt này theo đúng tuyến WO-WEB-07). Trình tự: chạy dot4a, báo Marley để chạy load_wo_web_08.py bằng khóa anon công khai, chạy dot4b ngay sau đó, rồi kiểm chứng live 5 câu (a)-(e). Kiểm chứng live trên widget website cần phiên trình duyệt của Marley.

## Hoàn tất chuỗi nạp (Marley điều phối, 02/11/2026)
- 08:44–08:46: chạy sql/dot4a qua Supabase SQL Editor (trình duyệt): còn đúng 204 đoạn (NQ-104-2022: 6, QD-1575-2023: 35, QD-2780-2025: 86, TT-13-2026: 45, TT-51-2017: 32); LUAT-03-2007, ND-13-2024, ND-104-2016 đã gỡ.
- Chạy loader/load_wo_web_08.py bằng khóa anon công khai: ok=105, fail=0.
- 08:49–08:51: chạy sql/dot4b: đã thu hồi EXECUTE của anon; đếm cuối khớp tuyệt đối, tổng 309 đoạn (LUAT-114-2025: 68, ND-104-2016: 6, ND-165-2026: 31, NQ-104-2022: 6, QD-1575-2023: 35, QD-2780-2025: 86, TT-13-2026: 45, TT-51-2017: 32).
- Kiểm chứng live qua POST /api/chat (www): (b) điều kiện cơ sở ĐẠT (Điều 49 NĐ 165 + Điều 11, Điều 10 NĐ 104 kèm ghi chú còn hiệu lực đến 30/6/2027); (c) phản vệ ĐẠT (TT 51/2017); (d) Luật Phòng bệnh ĐẠT (Luật 114/2025, Điều 51 NĐ 165); (e) lịch tiêm 18/24/25, giờ 7:30–16:30, sàng lọc khẩn cấp rule-emergency 0203.3822.115 đều ĐẠT.
- (a) CHƯA ỔN ĐỊNH: cách hỏi "Danh mục các bệnh phải tiêm chủng bắt buộc gồm những bệnh nào?" ĐẠT đủ 14 bệnh theo Điều 3 TT 13/2026; cách hỏi gốc của WO-WEB-07 chỉ dừng ở khung Điều 22 Luật 114 (không liệt kê); cách hỏi nêu đích danh TT 13/2026 không lấy được Điều 3. Nguyên nhân: truy xuất cạnh tranh sau khi thêm đoạn Luật 114/NĐ 165, đúng nguy cơ đã ghi ở mục dự phòng. Phương án dự phòng: PR tinh chỉnh truy xuất ở lượt riêng, chờ Maco duyệt.
- Hồ sơ: nhánh dot-2/wo-web-08-kho-tiem-chung (commit a734a1d) đã push; PR chưa mở vì gh CLI trên máy chưa đăng nhập.

## Lượt tinh chỉnh truy xuất (Maco duyệt 09:04 ngày 02/11/2026)

Chẩn đoán trên tập 309 đoạn (mô phỏng offline sao chép trung thực thuật toán route /api/chat: ứng viên = hợp các truy vấn ILIKE limit 12 theo từng đơn vị, IDF qua đếm REST, khử trùng theo Điều, chọn top 4):

1. Cách hỏi nêu đích danh "Thông tư 13/2026/TT-BYT": các mảnh mã văn bản (thông, tư, 13, 2026, tt, byt, trẻ, phải) chiếm trọn trần 8 âm tiết chủ đề; các âm tiết nội dung (tiêm, chủng, bắt, buộc, bệnh) ở vị trí 9-13 bị cắt. Điều 3 TT 13/2026 chỉ đạt 4,90 điểm, hạng 124 toàn tập (hạng 48 trong pool ứng viên) — thắng thua nằm ở nhiễu chuỗi trích dẫn.
2. Cách hỏi gốc WO-WEB-07: Điều 3 đạt 53,66 điểm, hạng 5 trong pool, thua vị trí chọn cuối 3,22 điểm. Nguyên nhân: Điều 3 nêu mỗi cụm khóa đúng một lần (điểm bị giới hạn ở mức xuất hiện 1), trong khi các đoạn thủ tục dài 1.200 ký tự lặp lại cụm khóa hai lần (chênh khoảng 22 điểm); thêm cụm 2 âm tiết "ma" hình thành ngang qua từ dừng đã bị loại ("buộc quy" từ "bắt buộc theo quy định").
3. Cách hỏi "Danh mục..." đạt nhưng mong manh: Điều 3 đồng điểm 70,6 với Điều 1 ở vị trí chọn cuối.

Phương án chọn (biến thể đạt toàn bộ cổng offline, không đổi dữ liệu, không đổi prompt, không hardcode câu hỏi/văn bản):

- Tách mã tham chiếu: token chứa chữ số kèm "/" hoặc "-" (ví dụ 13/2026/TT-BYT) hoặc token toàn chữ số được coi là mã văn bản — âm tiết của chúng không chiếm trần 8 âm tiết chủ đề; cặp số đầu (ví dụ 13/2026) dùng để nhận diện văn bản được nêu đích danh: mọi đoạn của văn bản đó vào pool ứng viên và được cộng điểm phẳng 3 × log(1 + tổng số đoạn / số đoạn của văn bản). Câu không chứa mã thì hành vi giữ nguyên như cũ.
- Điểm tiêu đề Điều: đoạn có mốc mở Điều/Mục/Chương/Phần trong 400 ký tự đầu (kể cả khi đoạn mở đầu bằng ghi chú hiệu lực chèn trước, như 6 đoạn NĐ 104/2016 giữ lại) được cộng thêm w × mult × 1 cho mỗi đơn vị truy xuất xuất hiện trong vùng tiêu đề — vùng tiêu đề tính đến mốc liệt kê " 1. " đầu tiên (tối đa 160 ký tự), hoặc 64 ký tự đầu nếu Điều không có mốc liệt kê.

Kết quả cổng offline (nhóm đoạn được chọn sau tinh chỉnh):
- 3 cách hỏi danh mục bệnh: Điều 3 TT 13/2026 đều vào nhóm chọn (hạng 2, 2 và 4; điểm 134,8 / 95,4 / 73,8).
- Điều kiện cơ sở (2 cách hỏi): giữ Điều 49 NĐ 165/2026 và các Điều 9, 10, 11 NĐ 104/2016 trong nhóm chọn; cách hỏi đã kiểm chứng live giữ nguyên đúng tập đoạn chọn như trước.
- Phản vệ (2 cách hỏi): cả 4 vị trí đầu đều thuộc TT 51/2017.
- Luật Phòng bệnh (2 cách hỏi): đều có đoạn Luật 114/2025/QH15 trong nhóm chọn.
- Lịch tiêm của Trạm và giờ làm việc: tập đoạn chọn giống hệt trước tinh chỉnh.

Mã nguồn ở nhánh riêng dot-2/wo-web-08-tinh-chinh-truy-xuat (chỉ sửa src/app/api/chat/route.ts, phần truy xuất bot_chunks; phần bài viết giữ nguyên). Kiểm chứng live sau gộp sẽ bổ sung vào mục này.

## Kiểm chứng live sau gộp PR #36 (Marley, 02/11/2026, T4)
- PR hồ sơ #35 (merge 58eb466) và PR code #36 (merge 01a039e) đã gộp lúc 11:37–11:39 ngày 02/11/2026.
- Kiểm chứng live qua POST https://www.tramytecaibau.com/api/chat sau khi bản live cập nhật, 6/6 câu ĐẠT:
  - T1 cách hỏi gốc WO-WEB-07: Điều 3 TT 13/2026 vào nguồn, liệt kê đủ 14 mục.
  - T2 "Danh mục các bệnh...": ĐẠT đủ danh mục Điều 3.
  - T3 nêu đích danh TT 13/2026: Điều 3 vào nguồn, liệt kê đủ.
  - R1 điều kiện cơ sở: Điều 49 NĐ 165 + Điều 11 NĐ 104 kèm ghi chú còn hiệu lực đến 30/6/2027 + Điều 10, không hồi quy.
  - R2 phản vệ: 4/4 nguồn đầu đều TT 51/2017.
  - R3 lịch tiêm: 18, 24, 25 hằng tháng, trừ Thứ 7, Chủ nhật, lễ, Tết.
- WO-WEB-08 đóng toàn bộ: dữ liệu, tinh chỉnh truy xuất, kiểm chứng live.
