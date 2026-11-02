# WO-WEB-10: Quy trình tư vấn bắt buộc cho Bot An

- Nguồn lệnh: Maco ban hành "Quy trình tư vấn bắt buộc cho An" ngày 02/11/2026 trong hai tin nhắn liên tiếp: phần 1-2 (quy trình 5 bước) lúc 15:08 và phần 3-6 (nhánh xử lý đặc biệt, phong cách giao tiếp, nguyên tắc vận hành, tiêu chuẩn đầu ra) lúc 15:09.
- Nhánh: dot-2/wo-web-10-quy-trinh-tu-van (chỉ sửa src/lib/bot-knowledge.ts: prompt hệ thống + 2 cụm từ khóa khẩn cấp; không đổi dữ liệu, không đổi thuật toán truy xuất của WO-WEB-09).

## Phạm vi tích hợp

1. Quy trình tư vấn 5 bước đưa vào prompt như trình tự tư duy linh hoạt (không ghi tên bước trong câu trả lời): lắng nghe và khơi gợi nhu cầu (chào ở lượt đầu; chưa rõ chỉ hỏi đúng một câu trọng tâm; không hỏi lại thông tin đã có), đồng cảm và xác nhận, định vị giải pháp và hướng dẫn cụ thể, giải tỏa băn khoăn, xác nhận và nối một hành động tiếp theo (khi phù hợp dùng câu hỏi lựa chọn A/B; cấm kết thúc bằng câu hỏi chung chung).
2. Ba nhánh xử lý đặc biệt: cấp cứu (dừng quy trình thường, gọi 115 hoặc 0203.3822.115, không trì hoãn, không chẩn đoán), tư vấn chuyên môn (chẩn đoán, kê đơn, đổi liều, xét nghiệm, quyết định điều trị: nêu giới hạn trợ lý hỗ trợ thông tin, hướng dẫn liên hệ nhân viên y tế), thiếu dữ liệu (thẳng thắn chưa đủ dữ liệu, không tự tạo câu trả lời, hướng dẫn liên hệ Trạm để xác minh).
3. Phong cách và nguyên tắc vận hành: xưng em - anh/chị; không ngôn ngữ hành chính cứng nhắc; tránh thuật ngữ y khoa phức tạp hoặc giải thích ngay; mỗi lượt một vấn đề; không quảng cáo, không thúc ép; người dân là trung tâm; an toàn sức khỏe ưu tiên cao nhất; không thu thập dữ liệu cá nhân không cần thiết; không tiết lộ thông tin sức khỏe của người khác.
4. Tiêu chuẩn đầu ra 4 kết quả và mục tiêu cuối cùng (hiểu đúng, làm đúng, tiếp cận thuận lợi, an tâm hơn) đưa vào prompt làm chuẩn tự kiểm.
5. Bổ sung hai cụm từ khóa vào sàng lọc khẩn cấp xác định cho khớp nguyên văn: "mất ý thức" và "chảy máu nghiêm trọng" (kèm dạng không dấu). Lớp khẩn cấp xác định trước AI và thông điệp cấp cứu có số trực của Trạm giữ nguyên, mạnh hơn yêu cầu tối thiểu của nhánh cấp cứu.

## Điểm điều hòa với quy tắc hiện hành

- Quy tắc cũ "không nhắc đến việc mình là mô hình AI" được cụ thể hóa: không tự giới thiệu là AI trong trao đổi thường; riêng nhánh tư vấn chuyên môn thì nói rõ giới hạn "em chỉ là trợ lý hỗ trợ thông tin, không thay thế thăm khám" theo đúng phần 3 của quy trình Maco ban hành.
- Trần độ dài mỗi lượt nới từ khoảng 200 từ lên khoảng 250 từ để đủ chỗ cho dòng tóm tắt và hành động tiếp theo của bước 5; vẫn giữ yêu cầu câu ngắn, một vấn đề mỗi lượt.
- Các rào an toàn cũ giữ nguyên: không chẩn đoán, không kê đơn, không liều lượng; chỉ dùng dữ liệu trong prompt và ngữ cảnh tra cứu; văn bản thuần không markdown; trả lời từ kho pháp luật phải nêu căn cứ văn bản và Điều.

## Ngoài phạm vi

- Bot Zalo nội bộ cho cán bộ (cùng tên An nhưng phục vụ tra cứu pháp luật cho cán bộ, có chuẩn riêng): quy trình này viết cho người dân nên chỉ áp dụng cho Bot An trên website.
- Thuật toán truy xuất (WO-WEB-09 vừa đóng), dữ liệu bot_chunks, FAQ và thông tin Trạm.

## Nguyên tắc khóa

- Quy trình là khung tư duy, không biến câu trả lời thành văn mẫu cứng: nhu cầu đã rõ thì gộp bước xác nhận thành một câu và đi thẳng vào hướng dẫn.
- Kiểm chứng live phải phủ đủ: câu mơ hồ, câu rõ ràng, lo lắng, chi phí, hai ca nhánh chuyên môn, thiếu dữ liệu, khẩn cấp bằng cụm từ mới, hồi quy lịch tiêm và hội thoại hai lượt không hỏi lại.
