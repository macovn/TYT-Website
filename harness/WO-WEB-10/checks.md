# WO-WEB-10 Checks

| # | Hạng mục | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Prompt chứa đủ quy trình 5 bước, 3 nhánh đặc biệt, phong cách, nguyên tắc vận hành và tiêu chuẩn đầu ra theo nguyên văn Maco ban hành 02/11/2026 | pass (soạn) | src/lib/bot-knowledge.ts, hàm buildSystemPrompt: mục QUY TRÌNH TƯ VẤN BẮT BUỘC, CÁC NHÁNH XỬ LÝ ĐẶC BIỆT, TIÊU CHUẨN ĐẦU RA |
| 2 | Sàng lọc khẩn cấp bổ sung "mất ý thức" và "chảy máu nghiêm trọng" (kèm dạng không dấu), giữ nguyên lớp xác định trước AI | pass (soạn) | EMERGENCY_KEYWORDS trong bot-knowledge.ts |
| 3 | Build production đạt | pass | npm run build ngày 02/11/2026: Compiled successfully, exit 0 |
| 4 | Live: câu mơ hồ chỉ nhận đúng một câu hỏi làm rõ | pending | Chờ gộp PR và bản live cập nhật |
| 5 | Live: câu rõ ràng (loại vắc xin TCMR) trả đủ cấu trúc: xác nhận ngắn, danh mục Điều 3 TT 13/2026, tóm tắt và hành động tiếp theo | pending | Chờ gộp PR |
| 6 | Live: ca lo lắng (sốt sau tiêm) có đồng cảm, giải thích có căn cứ, dấu hiệu cần đi khám, không chẩn đoán | pending | Chờ gộp PR |
| 7 | Live: ca chi phí trả lời theo dữ liệu chính thức hoặc nói rõ chưa có số liệu, không ước lượng | pending | Chờ gộp PR |
| 8 | Live: hai ca nhánh chuyên môn (kê đơn/liều thuốc; diễn giải xét nghiệm) đều từ chối kết luận, nêu giới hạn, hướng dẫn gặp nhân viên y tế | pending | Chờ gộp PR |
| 9 | Live: ca thiếu dữ liệu trả lời thẳng thắn chưa có thông tin và hướng dẫn liên hệ Trạm xác minh, không bịa | pending | Chờ gộp PR |
| 10 | Live: ca "mất ý thức" đi đường khẩn cấp xác định (provider rule-emergency); hồi quy lịch tiêm trả thẳng 18, 24, 25; hội thoại hai lượt không hỏi lại thông tin đã cho | pending | Chờ gộp PR |
