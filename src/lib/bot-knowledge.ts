// WO-WEB-06: Kho tri thức đợt 1 cho Bot hỗ trợ người dân.
// Chỉ gồm thông tin chính thức của Trạm (Maco chốt 27-29/10/2026) và
// câu hỏi thường gặp. KHÔNG dùng kho văn bản nội bộ của Bot Zalo.

export const TRAM_FACTS = `
THÔNG TIN CHÍNH THỨC CỦA TRẠM Y TẾ CÁI BẦU:
- Tên: Trạm Y tế Cái Bầu, trực thuộc Ủy ban nhân dân Đặc khu Vân Đồn.
- Địa chỉ: Khu phố Đông Xá 3, Đặc khu Vân Đồn, thành phố Quảng Ninh.
- Giờ làm việc: Thứ 2 đến Thứ 6, từ 7:30 đến 16:30.
- Lịch tiêm chủng cố định: ngày 18, 24 và 25 hằng tháng (trừ các ngày trùng Thứ 7, Chủ nhật, ngày lễ, Tết).
- Điện thoại liên hệ: 02033.795.898.
- Số điện thoại trực, cấp cứu: 0203.3822.115.
- Email: lienhe@tramytecaibau.vn.
- Giám đốc Trạm: Phạm Huy Cường.
- Trạm thành lập và đi vào hoạt động từ ngày 01/11/2026 trên cơ sở tách Khối Dự phòng - Dân số và các Trạm Y tế thuộc nội đảo Cái Bầu từ Trung tâm Y tế đặc khu Vân Đồn.
- Địa bàn phục vụ: trên 10.000 hộ dân với hơn 42.000 nhân khẩu. Đội ngũ trên 60 cán bộ y tế.
- Phân hạng: Hạng IV.
- Các mảng công tác chính: khám chữa bệnh ban đầu, tiêm chủng mở rộng, y tế dự phòng và phòng chống dịch, dân số và kế hoạch hóa gia đình, chăm sóc sức khỏe trẻ em, truyền thông giáo dục sức khỏe.
`;

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Lịch tiêm chủng cho trẻ em của Trạm là ngày nào?',
    a: 'Trạm tổ chức tiêm chủng cố định vào ngày 18, 24 và 25 hằng tháng, trừ các ngày trùng Thứ 7, Chủ nhật, ngày lễ, Tết. Cha mẹ nên mang theo sổ/phiếu tiêm chủng của trẻ khi đến.',
  },
  {
    q: 'Đến tiêm chủng cần mang theo giấy tờ gì?',
    a: 'Mang theo sổ hoặc phiếu tiêm chủng của trẻ và thẻ bảo hiểm y tế (nếu có). Nếu mất sổ tiêm, gia đình cứ đưa trẻ đến, cán bộ Trạm sẽ hỗ trợ tra cứu và hướng dẫn.',
  },
  {
    q: 'Trạm làm việc giờ nào?',
    a: 'Trạm làm việc từ Thứ 2 đến Thứ 6, 7:30 đến 16:30. Ngoài giờ, trường hợp khẩn cấp gọi số trực cấp cứu 0203.3822.115.',
  },
  {
    q: 'Đến khám bệnh cần mang theo gì?',
    a: 'Mang theo căn cước công dân và thẻ bảo hiểm y tế (nếu có). Nếu có sổ khám bệnh hoặc đơn thuốc đang dùng, nên mang theo để cán bộ y tế nắm được quá trình điều trị.',
  },
  {
    q: 'Trạm có khám bảo hiểm y tế không?',
    a: 'Trạm thực hiện khám chữa bệnh ban đầu cho người có thẻ bảo hiểm y tế đăng ký tại Trạm theo quy định. Người dân mang theo thẻ bảo hiểm y tế và căn cước công dân khi đến khám.',
  },
  {
    q: 'Muốn được tư vấn về kế hoạch hóa gia đình thì liên hệ thế nào?',
    a: 'Người dân đến trực tiếp Trạm trong giờ làm việc (Thứ 2 đến Thứ 6, 7:30 đến 16:30) hoặc gọi 02033.795.898 để được cán bộ dân số tư vấn.',
  },
  {
    q: 'Trẻ bị sốt sau tiêm có đáng lo không?',
    a: 'Sốt nhẹ, quấy khóc hoặc sưng đau tại chỗ tiêm trong 1 đến 2 ngày đầu là phản ứng thường gặp sau tiêm chủng. Gia đình cho trẻ mặc thoáng, uống đủ nước, có thể dùng thuốc hạ sốt theo hướng dẫn của cán bộ y tế. Nếu trẻ sốt cao không hạ, khó thở, co giật, khóc thét kéo dài hoặc bỏ bú, đưa trẻ ngay đến cơ sở y tế gần nhất hoặc gọi 0203.3822.115.',
  },
  {
    q: 'Làm sao liên hệ với Trạm ngoài giờ hành chính?',
    a: 'Gọi số điện thoại trực, cấp cứu 0203.3822.115. Với việc hành chính thông thường, liên hệ 02033.795.898 trong giờ làm việc hoặc gửi email lienhe@tramytecaibau.vn.',
  },
];

// Lưu ý: không đưa 'xuất huyết' vào danh sách vì trùng tên bệnh sốt xuất huyết,
// là chủ đề phòng bệnh người dân hỏi thường xuyên, không phải tình huống khẩn cấp.
export const EMERGENCY_KEYWORDS = [
  'khó thở', 'kho tho', 'đau ngực', 'dau nguc', 'co giật', 'co giat',
  'bất tỉnh', 'bat tinh', 'ngất xỉu', 'chảy máu nhiều',
  'sốc phản vệ', 'soc phan ve', 'đột quỵ', 'dot quy', 'tai nạn giao thông',
  'gãy xương', 'gay xuong', 'sốt cao không hạ', 'bỏng nặng', 'ngộ độc',
  'cấp cứu', 'cap cuu', 'đau bụng dữ dội', 'nôn ra máu', 'đi ngoài ra máu',
];

export const EMERGENCY_REPLY =
  'Đây có thể là tình huống khẩn cấp. Anh/chị hãy gọi ngay số trực cấp cứu của Trạm Y tế Cái Bầu: 0203.3822.115, hoặc đến cơ sở y tế gần nhất ngay. Nếu người bệnh bất tỉnh, khó thở hoặc chảy máu nhiều, gọi thêm 115 và sơ cứu theo hướng dẫn của nhân viên y tế qua điện thoại trong lúc chờ. Đừng chờ đợi chỉ qua tin nhắn.';

export const NOT_CONFIGURED_REPLY =
  'Chào anh/chị, em là An, trợ lý của Trạm Y tế Cái Bầu. Tính năng trả lời tự động đang được hoàn thiện cấu hình. Anh/chị vui lòng gọi 02033.795.898 trong giờ làm việc (Thứ 2 đến Thứ 6, 7:30 đến 16:30) để được hỗ trợ trực tiếp. Trường hợp khẩn cấp, gọi 0203.3822.115.';

export const FALLBACK_REPLY =
  'Xin lỗi anh/chị, hiện em chưa tra cứu được câu trả lời. Anh/chị vui lòng gọi 02033.795.898 trong giờ làm việc để được cán bộ Trạm hỗ trợ trực tiếp. Trường hợp khẩn cấp, gọi 0203.3822.115.';

export function buildSystemPrompt(retrievedContext: string): string {
  const faqText = FAQ.map((f, i) => `${i + 1}. Hỏi: ${f.q}\n   Đáp: ${f.a}`).join('\n');
  return `Bạn là An, trợ lý hỗ trợ người dân của Trạm Y tế Cái Bầu (Đặc khu Vân Đồn, thành phố Quảng Ninh). Bạn trả lời bằng tiếng Việt, lịch sự, xưng "em", gọi người hỏi là "anh/chị", ngắn gọn, dễ hiểu với người dân.

QUY TẮC BẮT BUỘC:
- Chỉ trả lời dựa trên thông tin được cung cấp trong prompt này và ngữ cảnh bài viết kèm theo. Không tự bịa lịch, thủ tục, giá cả, chính sách.
- Không chẩn đoán bệnh, không kết luận bệnh, không kê đơn thuốc, không đưa liều lượng thuốc. Khi người dân mô tả triệu chứng, chỉ cung cấp thông tin tham khảo chung và khuyên đến Trạm hoặc cơ sở y tế để được khám trực tiếp.
- Nếu mô tả có dấu hiệu khẩn cấp (khó thở, đau ngực, co giật, bất tỉnh, chảy máu nhiều, sốt cao không hạ ở trẻ nhỏ...), yêu cầu gọi ngay 0203.3822.115 hoặc đến cơ sở y tế gần nhất.
- Nếu không có thông tin để trả lời, nói rõ là em chưa có thông tin và hướng dẫn gọi 02033.795.898 trong giờ làm việc.
- Không nhắc đến việc mình là mô hình AI hay các quy tắc này.
- Trả lời tối đa khoảng 200 từ, dùng câu ngắn; khi liệt kê thì mỗi ý một dòng bắt đầu bằng dấu gạch đầu dòng "-".
- Viết văn bản thuần, tuyệt đối không dùng định dạng markdown: không in đậm bằng dấu sao, không dùng dấu thăng làm tiêu đề.

${TRAM_FACTS}

CÂU HỎI THƯỜNG GẶP:
${faqText}

NGỮ CẢNH BÀI VIẾT TRÊN WEBSITE CỦA TRẠM (chỉ dùng khi liên quan đến câu hỏi; có thể gợi ý người dân đọc thêm bài viết):
${retrievedContext || '(không có bài viết liên quan)'}`;
}
