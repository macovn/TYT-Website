# WO-WEB-26: Khối "Đọc thêm" của An chỉ gồm bài viết liên quan trên website

- TASK: Maco lệnh 17/11/2026 (kèm ảnh chụp): phần "Đọc thêm" dưới câu trả lời của An đang lẫn các đoạn văn bản pháp luật dạng "Căn cứ: ..." không liên quan tới câu hỏi (ví dụ câu hỏi lịch tiêm tháng 11 hiện Nghị định 165 Điều 5, 26, 48 và bài về trẻ sinh non). Yêu cầu: "Đọc thêm" chỉ để các bài viết liên quan đến nội dung câu hỏi trên Website.
- OUTPUT: src/app/api/chat/route.ts; src/components/SupportChat.tsx; hồ sơ harness/WO-WEB-26/.
- CHECKS: xem checks.md (T1 phạm vi diff, T2 cổng build, T3 mô phỏng ngoại tuyến trên 300 bài viết thật, T4 kiểm chứng Preview, T5 hồi quy Production sau gộp nếu được duyệt).
- SOURCES: lệnh và ảnh chụp của Maco 17/11/2026; route.ts hiện hành (retrieveContext: sources = đoạn kho có url rỗng + bài viết có url /tin-tuc/<id>; bài viết chấm tiêu đề x3/nội dung x1, ngưỡng 4, tối đa 2); SupportChat.tsx hiện hành (hiện mọi sources dưới nhãn "Đọc thêm:", đoạn kho hiện dạng "Căn cứ: ...").
- THIẾT KẾ:
  1. route.ts: sources trả về CHỈ gồm bài viết (posts). Các đoạn kho tri thức/văn bản pháp luật vẫn là ngữ cảnh nội bộ để An trả lời như cũ, không còn đưa vào danh sách hiển thị. Ngữ cảnh và cách chấm đoạn kho không đổi.
  2. Điều kiện hiển thị bài viết (chỉ áp cho danh sách hiển thị, không đổi ngữ cảnh): điểm >= 6; tiêu đề khớp ít nhất 1 âm tiết chủ đề không phải số thuần (loại khớp tình cờ kiểu "11" trong "15/11/2026"); nếu câu hỏi nêu tháng cụ thể, bài có tiêu đề nhắc tháng khác bị loại (tránh dẫn bài lịch tiêm tháng khác).
  3. SupportChat.tsx: bỏ nhánh hiển thị "Căn cứ: ..." (mọi mục trong danh sách nay đều là liên kết bài viết); giữ nguyên nhãn "Đọc thêm:" và kiểu hiển thị liên kết.
- SCOPE: chỉ 2 file trên + hồ sơ WO. Không đổi truy xuất đoạn kho, không đổi prompt, không đổi ngưỡng đưa bài viết vào ngữ cảnh (>= 4 như cũ), không đổi các đường khẩn cấp/xã giao/giới hạn tốc độ.
- LIMIT: tối đa 3 vòng sửa; gộp main chỉ khi Maco xác nhận riêng.
