# WO-WEB-12: Nền thời gian và kỷ luật khẳng định lịch cho Bot An

- Nguồn lệnh: Chỉ đạo phê duyệt và triển khai Bot An V1.1 của Maco ngày 03/11/2026. WO đầu tiên trong thứ tự triển khai mới: 12, 15A, 14, 13, 15D, 15B, 16, 15C.
- Xử lý phát hiện F4 (Báo cáo kiểm toán V1.1): Bot không có mốc thời gian hiện tại; câu hỏi ngày tương đối bị lảng tránh (thăm dò P9) hoặc trả lời bằng khẳng định không có dữ liệu chống lưng (P10, khẳng định về ngày lễ).
- Nhánh: dot-2/wo-web-12-nen-thoi-gian (từ main 1c1a8e9).

## Phạm vi

1. route.ts: bổ sung hàm thuần buildScheduleLines() tính theo múi giờ Asia/Bangkok: hôm nay là thứ mấy, ngày tháng năm; ba đợt tiêm dự kiến theo lịch cố định sắp tới (ngày 18, 24, 25 hằng tháng, loại trừ Thứ 7 và Chủ nhật, đợt đầu tiên lớn hơn hoặc bằng hôm nay).
2. bot-knowledge.ts: buildSystemPrompt nhận thêm tham số các dòng lịch; bổ sung một mục mới THỜI GIAN HIỆN TẠI VÀ LỊCH TIÊM DỰ KIẾN chứa dữ kiện máy chủ cấp và kỷ luật khẳng định ba loại ngày:
   - Ngày dự kiến: chỉ gọi là "ngày dự kiến theo lịch cố định", luôn kèm đường xác nhận (bài thông báo lịch tiêm của tháng trên website hoặc gọi 02033.795.898).
   - Ngày đã xác nhận: chỉ khẳng định khi bài thông báo được truy xuất trong chính lượt trả lời ghi rõ ngày đó, và phải dẫn nguồn bài thông báo.
   - Ngày lễ, Tết, điều chỉnh lịch: không khẳng định, không phủ định; nói rõ chưa có dữ liệu và hướng dẫn xác nhận.
3. POST handler truyền kết quả hàm tính lịch vào prompt.

## Ngoài phạm vi

- Không thay đổi quy trình tư vấn 5 bước, ba nhánh đặc biệt, quy tắc bắt buộc và tiêu chuẩn đầu ra đã nghiệm thu tại WO-WEB-10 (chỉ cộng thêm một mục độc lập).
- Không thay đổi truy xuất, dữ liệu kho, FAQ, TRAM_FACTS và thông tin chính thức của Trạm.
- Không nạp dữ liệu ngày nghỉ lễ (tùy chọn dữ liệu riêng, chờ quyết định riêng của Maco theo Báo cáo bổ sung Mục 3.3).
- Không thuộc WO này: các nội dung của WO-WEB-13, 14, 15A, 15B, 15C, 15D, 16.

## Ghi chú về phạm vi kiểm thử theo Chỉ đạo Mục IV

Chỉ đạo yêu cầu chạy T01 đến T42 cho chương trình. Với từng WO, bộ tình huống thuộc phạm vi WO đó được chạy đầy đủ, cộng toàn bộ các cổng đã nghiệm thu trước đó dưới dạng hồi quy (17 câu ngoại tuyến, 9 cách hỏi vắc xin, 10 ca WO-WEB-10, 29 mẫu từ khóa nền khi WO chạm bộ lọc). Các tình huống thuộc WO chưa tới lượt được liệt kê rõ là hoãn tới WO sở hữu, không chạy trước để tránh ghi nhận "không đạt" giả tạo cho tính năng chưa triển khai. Với WO-WEB-12, tình huống thuộc phạm vi là T15, T16, T28, T29; các tình huống còn lại hoãn tới WO-WEB-13 (T01, T02, T05, T20 đến T23, T37 đến T39), WO-WEB-14 (T08, T09, T11 đến T13, T19, T24 đến T27, T31 đến T36), WO-WEB-15A (T17), WO-WEB-15B (T18), WO-WEB-15C (T42), WO-WEB-15D (T14, T41), WO-WEB-16 (T30, T40). T03, T04, T06, T07, T10 là các ca hành vi đã đạt ở trạng thái hiện hành, được giữ trong bộ hồi quy hành vi chạy lại sau merge.

## Phương án quay lui

Revert commit gộp của PR WO-WEB-12 trên nhánh chính; Vercel tự triển khai lại trạng thái trước. Không có thay đổi dữ liệu nên không tồn tại rủi ro quay lui dữ liệu. Đã kiểm chứng tính khả thi của revert bằng chính quy trình PR một WO một nhánh đang áp dụng.
