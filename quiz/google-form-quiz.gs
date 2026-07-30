/** Run createQuizPainSurvey() once in https://script.google.com/ to create the form. */
function createQuizPainSurvey() {
  var form = FormApp.create('Khảo sát trải nghiệm củng cố kiến thức sau buổi học trên VLearn');
  form.setDescription('Team Rau Má tìm hiểu điều học viên thật sự làm sau mỗi buổi học để biết phần nào cần củng cố. Hãy trả lời về buổi học gần nhất; form mất khoảng 3 phút. Kết quả chỉ dùng trong mini hackathon của khóa học.')
    .setConfirmationMessage('Cảm ơn bạn! Team Rau Má đã ghi nhận trải nghiệm của bạn.')
    .setProgressBar(true)
    .setCollectEmail(false);

  form.addTextItem().setTitle('1. Họ tên và lớp của bạn').setHelpText('Ví dụ: Nguyễn Văn A — D303. Dùng để lưu log nội bộ.').setRequired(true);
  form.addMultipleChoiceItem().setTitle('2. Buổi học gần nhất bạn hoàn thành là khi nào?').setChoiceValues(['Hôm nay', 'Hôm qua', '2–3 ngày trước', 'Lâu hơn', 'Không nhớ']).setRequired(true);
  form.addCheckboxItem().setTitle('3. Sau buổi đó, bạn đã làm gì để kiểm tra hoặc củng cố kiến thức?').setChoiceValues(['Không làm gì', 'Tự xem lại tài liệu', 'Làm bài tập/quiz', 'Hỏi VLearn AI Tutor', 'Hỏi bạn/TA', 'Dùng AI khác']).showOtherOption(true).setRequired(true);
  form.addScaleItem().setTitle('4. Sau buổi đó, bạn có biết rõ phần nào mình chưa hiểu không?').setBounds(1, 5).setLabels('Hoàn toàn không rõ', 'Rất rõ').setRequired(true);
  form.addMultipleChoiceItem().setTitle('5. Khó khăn lớn nhất khi củng cố sau buổi học là gì?').setHelpText('Chọn một pain chính để nhóm phân tích.').setChoiceValues(['Không biết ôn phần nào', 'Không biết mình hiểu đúng chưa', 'Không có bài ngắn để tự kiểm tra', 'Quiz hiện có quá dài', 'Thiếu thời gian', 'Không tìm được tài liệu', 'Không gặp khó khăn']).showOtherOption(true).setRequired(true);
  form.addMultipleChoiceItem().setTitle('6. Pain này xuất hiện với tần suất nào?').setChoiceValues(['Hiếm khi (<1/10)', 'Thỉnh thoảng (1–3/10)', 'Khá thường xuyên (4–6/10)', 'Rất thường xuyên (>6/10)', 'Không nhớ']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('7. Pain này khiến bạn tốn thêm bao nhiêu thời gian mỗi lần?').setChoiceValues(['Không tốn', '<2 phút', '2–<5 phút', '5–<10 phút', '10–<20 phút', '≥20 phút', 'Không ước lượng được']).setRequired(true);
  form.addCheckboxItem().setTitle('8. Hậu quả thực tế là gì?').setChoiceValues(['Không ôn lại', 'Ôn không đúng trọng tâm', 'Hỏi người/công cụ khác', 'Mang lỗ hổng sang bài sau', 'Thiếu tự tin khi làm bài', 'Tốn thời gian', 'Không hậu quả']).showOtherOption(true).setRequired(true);
  form.addScaleItem().setTitle('9. Quiz 15 câu, khoảng 10–12 phút, dựa trên đúng bài vừa học có phù hợp không?').setBounds(1, 5).setLabels('Không phù hợp', 'Rất phù hợp').setRequired(true);
  form.addMultipleChoiceItem().setTitle('10. Bạn có sẵn sàng thử prototype 10 phút không?').setChoiceValues(['Có — nhóm có thể liên hệ', 'Có thể — tùy thời gian', 'Không']).setRequired(true);

  Logger.log('FORM EDIT URL: ' + form.getEditUrl());
  Logger.log('FORM RESPONSE URL: ' + form.getPublishedUrl());
}
