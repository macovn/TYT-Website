# WO-WEB-11: Nhóm chọn 5 đoạn cho truy xuất của Bot An

## Bối cảnh

Chiều 02/11/2026, sau khi WO-WEB-09 và WO-WEB-10 đã đóng, Maco gửi ảnh chụp một cách hỏi khác của người dân: "Các loại vắc xin trong Chương trình tiêm chủng mở rộng là gì?". An vẫn trả lời chưa có dữ liệu liệt kê. Kiểm chứng live xác nhận lỗi còn thật trên bản hiện hành: nguồn trả về là 3 đoạn Nghị định 165/2026 và Nghị quyết 104/NQ-CP, không có Điều 3 Thông tư 13/2026/TT-BYT, nên nhánh thiếu dữ liệu của quy trình tư vấn (WO-WEB-10) kích hoạt đúng thiết kế và An từ chối liệt kê.

## Chẩn đoán (bằng chứng ngoại tuyến trên đúng 309 đoạn live)

Công cụ: ~/workspace/wo-web-09/diag5.py và test_top5.py, mô phỏng trung thực thuật toán hiện hành (cụm 2 âm tiết từ chuỗi thô, điểm vùng tiêu đề nhân 2, chấm toàn bảng, trần 3 đoạn mỗi văn bản).

- Cách hỏi trong ảnh: Điều 3 Thông tư 13/2026 đứng hạng 7 toàn bảng với 130,9 điểm. Ba vị trí đầu thuộc Mục 5 Nghị định 165/2026 (158 đến 167 điểm, các đoạn thủ tục dài chứa dày cụm "Chương trình tiêm chủng mở rộng" và "vắc xin"); vị trí chọn thứ tư thuộc Điều 3 Nghị quyết 104/NQ-CP với 131,4 điểm, hơn Điều 3 đúng 0,5 điểm. Điều 3 bị loại ở lằn ranh cuối cùng.
- Bốn cách hỏi anh em cùng họ ("Vắc xin trong chương trình tiêm chủng mở rộng gồm những loại nào?", "Trong chương trình tiêm chủng mở rộng có các loại vắc xin nào?", "Cho em hỏi các vắc xin thuộc tiêm chủng mở rộng gồm những gì?", "Danh mục vắc xin tiêm chủng mở rộng gồm những loại nào?") cho thấy Điều 3 dao động hạng 2 đến hạng 6: họ câu hỏi này nằm sát ngưỡng chọn, không ổn định.
- Nguyên nhân gốc: trần 3 đoạn mỗi văn bản cộng nhóm chọn chỉ 4 đoạn khiến vị trí cuối là cuộc cạnh tranh sít sao giữa các đoạn danh mục và đoạn thủ tục; chênh lệch dưới 1 điểm đổi theo từng cách diễn đạt.

## Thay đổi

Một thay đổi duy nhất trong src/app/api/chat/route.ts: nhóm chọn gồm 5 đoạn thay vì 4, giữ nguyên trần 3 đoạn mỗi văn bản và toàn bộ cơ chế chấm điểm của WO-WEB-09. Nhóm chọn 5 đoạn là tập cha theo đúng thứ tự của nhóm 4 đoạn cũ, nên không câu hỏi nào mất ngữ cảnh đã có; chỉ bổ sung thêm một đoạn ngữ cảnh.

Phương án đã cân nhắc và loại: hạ trần xuống 2 đoạn mỗi văn bản (phá chất lượng ca phản vệ cần 3 đoạn Thông tư 51/2017); chuẩn hóa điểm theo độ dài đoạn kiểu BM25 (thay đổi hành vi trên toàn bộ họ câu hỏi, rủi ro hồi quy lớn, cần kiểm chứng lại toàn diện).

## Kiểm chứng ngoại tuyến trước khi gộp

test_top5.py: nhóm chọn 5 đoạn đạt toàn bộ 17 cổng, gồm 12 cổng gốc của WO-WEB-09 (4 cách hỏi loại vắc xin, 3 cách hỏi danh mục bệnh, điều kiện cơ sở, phản vệ, sàng lọc, lịch tiêm, chi phí) và 5 cách hỏi mới của họ liệt kê vắc xin.

## Ngoài phạm vi

- Không thay đổi cơ chế chấm điểm, dữ liệu kho, prompt tư vấn (WO-WEB-10) hay truy xuất bài viết.
- Không áp dụng cho Bot Zalo nội bộ.
