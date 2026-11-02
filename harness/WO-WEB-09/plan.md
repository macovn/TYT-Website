# WO-WEB-09: Tinh chỉnh truy xuất cho câu hỏi về loại vắc xin trong TCMR

- Nguồn lệnh: ngày 02/11/2026 Maco gửi ảnh chụp Bot An trả lời người dân "chưa có thông tin chi tiết về danh mục các loại vắc xin cụ thể trong Chương trình tiêm chủng mở rộng" dù dữ liệu đã có trong kho, và lệnh "Làm đi em" lúc 14:38.
- Nhánh: dot-2/wo-web-09-truy-xuat-vac-xin (chỉ sửa src/app/api/chat/route.ts, phần truy xuất bot_chunks; không đổi dữ liệu, không đổi prompt, không đổi truy xuất bài viết).

## Sự cố

Câu hỏi "Chương trình tiêm chủng mở rộng gồm những loại vắc xin nào?" trên bản live chọn 3 đoạn Nghị định 165/2026 + 1 đoạn Nghị quyết 104, không có đoạn Điều 3 Thông tư 13/2026 (danh mục bệnh/vắc xin bắt buộc) cũng không có đoạn bảng vắc xin của Quyết định 2780/QĐ-BYT; An trả lời chưa có thông tin. Đây là họ lỗi cạnh tranh truy xuất còn sót sau lượt tinh chỉnh của WO-WEB-08 (lượt đó mới khép 3 cách hỏi về danh mục bệnh).

## Chẩn đoán (mô phỏng offline trung thực trên tập 309 đoạn live)

1. Pool ứng viên theo từng đơn vị (ILIKE, limit 12, không ORDER BY) phụ thuộc thứ tự quét bảng không xác định của PostgREST: mô phỏng cùng thuật toán với 5 thứ tự pool khác nhau cho thấy thuật toán hiện tại trượt cổng câu đích ở 16/55 lượt; riêng cách hỏi "Bé được tiêm những vắc xin gì..." trượt ở mọi thứ tự.
2. Từ dừng "xin" (động từ xin hỏi) là âm tiết thứ hai của "vắc xin": cụm 2 âm tiết dựng từ chuỗi đã lọc từ dừng nên cụm khóa "vắc xin" không bao giờ thành đơn vị truy xuất.
3. Chấm trên toàn bộ tập (pool đầy đủ) cho thấy đoạn Điều 3 TT 13/2026 chỉ xếp hạng 6 (câu trong ảnh), hạng 4 đồng điểm mong manh (cách hỏi "có những vắc xin gì cho trẻ em"), hạng 15 (cách hỏi "Bé được tiêm..."): các đoạn dài của Mục 5 Nghị định 165/2026 lặp cụm khóa hai lần thắng đoạn liệt kê ngắn nêu mỗi cụm một lần.

## Phương án (đạt toàn bộ cổng offline, cơ chế tổng quát)

1. Cụm 2 âm tiết dựng từ chuỗi âm tiết THÔ trước khi lọc từ dừng; chỉ bỏ cụm khi cả hai âm tiết đều là từ dừng; khử trùng, tối đa 12 cụm. Âm tiết đơn và trần 8 giữ nguyên; đường mã văn bản được nêu đích danh giữ nguyên.
2. Điểm vùng tiêu đề Điều tăng từ w × mult × 1 lên w × mult × 2: tiêu đề Điều là tín hiệu mạnh nhất của đoạn liệt kê ngắn.
3. Chấm trên toàn bộ bảng bot_chunks (tải một lần, sắp theo cột ord, đếm IDF cục bộ trên cùng tập): loại bỏ hoàn toàn phụ thuộc thứ tự quét; hành vi xác định, mô phỏng offline khớp live.
4. Mỗi văn bản tối đa 3 đoạn trong nhóm chọn 4 đoạn: chống một mục dài của một văn bản chiếm cả nhóm chọn, vẫn cho phép văn bản chuyên sâu (Thông tư 51/2017) giữ 3 vị trí.

## Ngoài phạm vi

- Dữ liệu bot_chunks (giữ nguyên 309 đoạn của WO-WEB-08).
- Prompt, FAQ, sàng lọc khẩn cấp, truy xuất bài viết, nhật ký chat_logs.
- Trần 8 âm tiết chủ đề và cách xử lý mã văn bản nêu đích danh của WO-WEB-08.

## Nguyên tắc khóa

- Không hardcode theo câu hỏi hay văn bản cụ thể; mọi thay đổi là cơ chế tổng quát.
- Cổng offline phải đạt ở cả 12 câu (4 câu đích về loại vắc xin + 8 câu hồi quy) trước khi mở PR; sau gộp phải kiểm chứng live cùng bộ câu cộng câu khẩn cấp và câu lịch tiêm.
