# WO-WEB-13: Lớp thông tin ghim và ngữ cảnh hội thoại

- Nguồn lệnh: Chỉ đạo phê duyệt và triển khai Bot An V1.1 của Maco ngày 03/11/2026 (Maco xác nhận triển khai riêng WO này lúc 12:11 cùng ngày).
- Xử lý phát hiện F3 (truy xuất mù ngữ cảnh và cửa sổ lịch sử 6 tin nhắn) của Báo cáo kiểm toán V1.1, theo thiết kế tại Báo cáo bổ sung Mục 1 và Báo cáo chỉnh lý Mục 2 và Mục 6.
- Nhánh: dot-2/wo-web-13-thong-tin-ghim (từ main sau WO-WEB-14).

## Thiết kế chốt (extractPinnedFacts, hàm thuần xác định trong route.ts)

Đầu vào: toàn bộ tin nhắn người dùng của yêu cầu (mảng userTexts đã trích từ body gốc cho WO-WEB-14). Đầu ra: tối đa 6 dòng thông tin ghim, mỗi dòng không quá 80 ký tự, kèm số thứ tự lượt người dùng đã nêu thông tin. Toàn bộ nằm sau hằng số công tắc PIN_FACTS_ENABLED; tắt là trở về hành vi trước WO (trừ cửa sổ 10 tin nhắn, giữ nguyên vì là cải thiện nền độc lập).

1. Khớp mẫu trên dạng đã gấp dấu của tin nhắn, yêu cầu từ chỉ đối tượng đi kèm đối với tuổi trẻ em. Tập loại thông tin là danh sách đóng, chỉ gồm:
   - Tuổi trẻ em: mẫu có chủ thể trẻ (bé, con, cháu, trẻ) kèm định danh nếu có (bé lớn, bé nhỏ, bé đầu, bé út...) và số kèm đơn vị tháng hoặc tuổi. Không có chủ thể trẻ thì không ghi tuổi trẻ em.
   - Tuổi người hỏi: chỉ khi gắn với chính người hỏi (em 30 tuổi, tôi 45 tuổi, mình 28 tuổi); ghi riêng loại người lớn, không bao giờ lẫn vào tuổi trẻ em.
   - Tình trạng thai kỳ: mẫu mang thai, bầu, có thai kèm số tuần hoặc tháng nếu có; ghi kèm chủ thể đã nêu (vợ, con dâu...) khi bắt được từ danh sách xưng hô đóng đứng ngay trước mẫu, mặc định là người hỏi.
   - Mốc tiêm gần nhất: đoạn văn bản gốc bắt đầu tại đã tiêm hoặc vừa tiêm, cắt tối đa 80 ký tự.
   - Triệu chứng, bệnh sử và mọi nội dung tự do khác tuyệt đối không ghim.
2. Quy tắc giá trị hiệu lực: quét theo thứ tự thời gian; cùng một khóa (loại thông tin cộng định danh đối tượng) thì lần nêu gần nhất thắng. Dấu sửa đổi tường minh trong cùng tin nhắn (không phải, nhầm, sửa lại, ý em là) làm mất hiệu lực mọi giá trị đứng trước dấu đó trong tin nhắn. Hai giá trị khác nhau cho hai định danh khác nhau được giữ cả hai (ca T37). Trường hợp mơ hồ không gán chắc được đối tượng (hai giá trị khác nhau cùng một định danh chung trong cùng một tin nhắn, không có dấu sửa đổi) thì không ghim mục gây tranh cãi đó (đoán gán là không đạt theo Báo cáo chỉnh lý Mục 2.1).
3. Khối prompt: khi có ít nhất một mục ghim, buildSystemPrompt nhận thêm các dòng và chèn mục THÔNG TIN NGƯỜI DÂN ĐÃ CUNG CẤP TRONG CUỘC TRÒ CHUYỆN kèm kỷ luật dùng: chỉ dùng mục liên quan trực tiếp tới câu hỏi hiện tại; không áp thông tin của trẻ sang câu hỏi về người lớn và ngược lại; không nhắc lại thông tin ghim khi người dân không hỏi tới; khi hai giá trị của hai đối tượng cùng ảnh hưởng tới câu trả lời thì hỏi lại đúng một câu thay vì tự chọn.
4. Cửa sổ nguyên văn: history nâng từ 6 lên 10 tin nhắn (trần 1.000 ký tự mỗi tin giữ nguyên) làm lớp đệm gần, độc lập với lớp ghim.
5. Ngữ cảnh hóa truy vấn truy xuất: khi tin nhắn người dùng cuối ngắn (không quá 60 ký tự) hoặc chứa từ tham chiếu thuộc danh sách đóng (thế còn, vậy còn, thế, vậy, đó, này, tháng sau, tháng trước, tiếp theo, chi phí, giá, bao nhiêu), truy vấn truy xuất bằng tin nhắn người dùng gần nhất trước đó ghép với tin nhắn cuối; ngoài các trường hợp đó truy vấn giữ nguyên là tin nhắn cuối. Thuật toán chấm điểm, nhóm chọn 5 đoạn, trần mỗi văn bản và truy vấn bài viết giữ nguyên tuyệt đối.
6. Nguyên tắc không lưu trữ (Báo cáo chỉnh lý Mục 2.2): thông tin ghim chỉ tồn tại trong quá trình xử lý của chính lượt gọi, trích xuất từ lịch sử gửi kèm, dùng để dựng prompt rồi hủy cùng tiến trình. Không ghi vào cơ sở dữ liệu, tệp hay nhật ký; đường ghi dữ liệu duy nhất vẫn là logChat hiện hành với đúng các trường hiện hành. Cuộc hội thoại mới bắt đầu với lớp ghim rỗng tuyệt đối.

## Kiểm thử

- Ngoại tuyến, hàm trích xuất (trích nguyên văn từ route.ts chạy bằng node): các ca trích xuất của T37 (hai bé hai mục riêng đúng định danh), T21 và ca sửa trong cùng tin nhắn (giá trị sau thắng tuyệt đối), T23 âm tính (em 30 tuổi đưa bé đi tiêm: không có mục tuổi trẻ em bằng 30), T22 (tuổi trẻ em và thai kỳ là hai mục tách bạch), âm tính triệu chứng (bé sốt 39 độ không sinh mục nào), trần cứng (tối đa 6 mục, mỗi mục không quá 80 ký tự, có số thứ tự lượt), ca mơ hồ cùng tin nhắn (không ghim mục tranh cãi), mốc tiêm gần nhất, tuổi người hỏi tách riêng.
- Ngoại tuyến, cổng hồi quy truy xuất: bộ 17 câu của thư mục wo-web-09 tiếp tục đạt trên mô phỏng (thuật toán không đổi; kiểm chứng lại cùng đợt).
- Live sau merge: T01 (tham chiếu tuổi ở cuối hội thoại nhiều lượt), T02 (hỏi tiếp chi phí có căn cứ Điều 48 Nghị định 165/2026, không lặp phần lịch), T05 (hỏi tháng sau theo ngữ cảnh), T20 (hội thoại 12 lượt, thông tin lượt 1 và 2 dùng đúng ở lượt 12), T21 (sửa tuổi giữa hội thoại, lượt cuối dùng tuổi đã sửa), T22 (không áp tuổi bé sang câu hỏi về bà bầu), T23 live, T37 (hỏi xen kẽ hai bé, tham chiếu đúng từng bé), T38 (ba đối tượng không áp chéo), T39 (mở hội thoại mới phải hỏi lại như chưa biết).
- Hồi quy bắt buộc: 9 cách hỏi vắc xin, 10 ca hành vi WO-WEB-10, bộ lọc cấp cứu (T08 và T24 chấm điểm), độ trễ.

## Ngoài phạm vi

Không đổi thuật toán chấm điểm truy xuất, dữ liệu kho, FAQ, quy trình 5 bước, bộ lọc cấp cứu (chỉ chạy hồi quy). Không lưu trữ thông tin ghim dưới bất kỳ hình thức nào.

## Điều kiện dừng

Ca âm tính T23 trượt (ghim sai tuổi trẻ em bằng 30) hoặc bất kỳ ca áp chéo nào trong T22, T37, T38 ở mức hàm trích xuất: dừng, sửa trong tối đa 3 vòng theo harness; quá 3 vòng thì báo cáo và không trình merge.

## Phương án quay lui

Đặt PIN_FACTS_ENABLED thành false để quay lui nóng lớp ghim và ngữ cảnh hóa truy vấn; hoặc revert commit gộp của PR WO-WEB-13. Không có thay đổi dữ liệu.
