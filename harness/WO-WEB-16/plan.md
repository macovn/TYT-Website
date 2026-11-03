# WO-WEB-16: Kiểm soát độ dài câu trả lời bằng thang viết lại

- Nguồn lệnh: Chỉ đạo phê duyệt và triển khai Bot An V1.1 của Maco ngày 03/11/2026 (Maco xác nhận triển khai riêng WO này lúc 06:07 ngày 04/11/2026).
- Xử lý phát hiện F11 (trần khoảng 250 từ chỉ tồn tại ở tầng prompt, không có cơ chế thực thi) theo thiết kế tại Mục 3 Báo cáo chỉnh lý: BỎ HẲN cắt cơ học, thay bằng thang ba bước đo, viết lại một lần, kiểm tra bảo toàn. Kèm yêu cầu Mục II.2 của Chỉ đạo: kiểm tra bảo toàn phải bao phủ cả dấu hiệu nguy hiểm và hướng dẫn an toàn; không kiểm chứng được nội dung thiết yếu còn nguyên thì giữ bản gốc.
- Nhánh: dot-2/wo-web-16-thang-viet-lai (từ main sau WO-WEB-15B).

## Thiết kế

Vị trí: sau khi có câu trả lời mô hình (gồm cả nhánh ghi nhận tại cơ sở y tế và nhánh ép kiểm thử), trước chốt số điện thoại đầu ra của WO-WEB-15D, để chốt luôn quét trên văn bản cuối cùng. Câu trả lời xác định (cấp cứu mẫu sẵn, dự phòng, chưa cấu hình) được miễn trừ.

1. Đo: số từ là số token tách theo khoảng trắng của văn bản đã cắt khoảng trắng hai đầu. Câu trả lời từ 300 từ trở xuống cho qua nguyên vẹn.
2. Viết lại một lần: câu trả lời vượt 300 từ được gửi lại cho chính nhà cung cấp vừa trả lời, kèm chỉ thị nén xuống tối đa 250 từ, giữ nguyên mọi hướng dẫn an toàn, dấu hiệu nguy hiểm, thông tin liên hệ và toàn bộ nội dung liệt kê. Chỉ thử đúng một lần; lỗi thì coi như không có bản viết lại.
3. Kiểm tra bảo toàn xác định, bản viết lại chỉ được dùng khi đạt cả bốn điều kiện:
   - Mọi dãy số dạng số điện thoại trong bản gốc (dãy bắt đầu 0 hoặc +84, dài 9 đến 11 chữ số sau khi bỏ ký tự ngăn cách) đều còn trong bản viết lại, so trên dạng chỉ gồm chữ số.
   - Khi bản gốc có từ ba dòng liệt kê trở lên (dòng bắt đầu bằng dấu gạch, dấu sao, dấu chấm đầu dòng hoặc số thứ tự), bản viết lại không được ít dòng liệt kê hơn bản gốc.
   - Mọi dấu hiệu nguy hiểm thuộc danh sách đóng (khó thở, co giật, tím môi, tím tái, lơ mơ, bất tỉnh, chảy máu, sốt cao, nôn nhiều, bỏ bú, khóc thét, lạnh tay chân, nổi vân tím, thở rít, đau ngực, vã mồ hôi, sưng nề, phát ban) xuất hiện trong bản gốc dưới dạng đã bỏ dấu đều phải xuất hiện trong bản viết lại. Đây là hiện thực hóa Mục II.2 ở mức xác định được: số điện thoại và dấu hiệu nguy hiểm là hai lớp nội dung thiết yếu kiểm chứng được bằng máy; hướng dẫn an toàn tổng quát hơn vẫn do chỉ thị viết lại và kỷ luật prompt bảo vệ, và mọi trường hợp nghi ngờ đều rơi về giữ bản gốc.
   - Bản viết lại ngắn hơn bản gốc và không vượt 300 từ.
4. Không đạt bất kỳ điều kiện nào, hoặc lượt viết lại lỗi, hoặc bản viết lại vẫn vượt 300 từ: giữ nguyên bản gốc và ghi cờ vào trường nhà cung cấp của nhật ký dạng |vuot-tran-do-dai:<số từ gốc>. Bản viết lại được dùng thì ghi |rut-gon:<số từ gốc>-><số từ mới> để rà soát định kỳ nhìn thấy cả hai tình huống.

## Tiêu chí đạt

- Kiểm thử ngoại tuyến các hàm thuần: đếm từ, trích dãy số, đếm dòng liệt kê, kiểm tra bảo toàn (đủ số thì đạt; thiếu một số thì trượt; mất dòng liệt kê thì trượt; mất một dấu hiệu nguy hiểm thì trượt; giữ đủ dấu hiệu thì đạt).
- T30: câu hỏi danh mục vắc xin, danh mục còn nguyên vẹn, số điện thoại và hành động tiếp theo còn nguyên.
- T40: câu trả lời dài chứa hướng dẫn phản ứng sau tiêm, dấu hiệu nguy hiểm và cả hai số của Trạm: đầu ra cuối cùng còn nguyên dấu hiệu và cả hai số, kết thúc bằng câu hoàn chỉnh; nếu vượt trần thì nhật ký có cờ vượt trần.
- Ca kích hoạt thang: câu hỏi đòi liệt kê đầy đủ nhóm A, B, C (81 bệnh, chắc chắn vượt 300 từ) phải cho thấy hoặc bản rút gọn đạt kiểm tra bảo toàn, hoặc bản gốc kèm cờ vượt trần; nội dung không được đứt giữa câu trong mọi trường hợp.
- Hồi quy bắt buộc: 9 cách hỏi vắc xin, T08, T24, T41, độ trễ.

## Ngoài phạm vi

Không thay đổi prompt gốc, truy xuất, bộ lọc cấp cứu, chốt số điện thoại, chuỗi nhà cung cấp. Không tồn tại bất kỳ thao tác cắt ký tự, cắt đoạn hay cắt câu nào trong WO này.

## Điều kiện dừng

Bản viết lại làm mất nội dung thiết yếu mà kiểm tra bảo toàn không bắt được ở bất kỳ ca kiểm chứng nào: dừng, báo Maco kèm bằng chứng trước khi merge.

## Phương án quay lui

Revert commit gộp của PR WO-WEB-16. Không có thay đổi dữ liệu.
