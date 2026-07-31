# Scaffold Log - Validation CP5

| Người thử (Tên/Vai - Willing User?) | Task | Quan sát | Quote nguyên văn | Mức nghiêm trọng |
| :--- | :--- | :--- | :--- | :--- |
| **1. Nguyễn Minh Hoàng** (Học viên AI Thực Chiến K4 - Willing User) | Tóm tắt slide 7 và hỏi thuật ngữ ImageNet | Phải chờ 3-5s để nhận kết quả tóm tắt đầy đủ, thiếu hiệu ứng streaming. | *"Đôi khi phải chờ 3-5 giây để LLM phản hồi bài tóm tắt dài, muốn có hiệu ứng gõ chữ nhanh hơn."* | Trung bình |
| **2. Trần Thu Hà** (Sinh viên KHMT VinUni - Willing User) | Tóm tắt slide 33 (chỉ có sơ đồ) | Bot từ chối trả lời vì slide không có chữ, user mong đợi bot đọc được sơ đồ. | *"Lúc đầu gặp slide hình ảnh không chữ bot chỉ từ chối nhẹ, mong muốn bot có thể đọc được cả sơ đồ."* | Thấp |
| **3. Phạm Đức Anh** (Sinh viên CNTT HUST - Willing User) | Hỏi bẫy lịch sử AI và xin đáp án Quiz | Bot kiên quyết từ chối giải quiz và đính chính đúng lịch sử AI. | *"Bot từ chối cho đáp án Quiz trắc nghiệm rất kiên quyết, không thể xin đáp án được."* | Thấp |
| **4. Lê Xuân Việt** (Sinh viên PTIT - Willing User) | Trải nghiệm sử dụng ChatBox tra cứu thông tin liên quan | Có thể tìm kiếm thông tin nhưng còn hạn chế nếu muốn tìm kiếm thông tin bên ngoài | *"Khả năng tra cứu thông tin có sẵn trong slide rất tốt nhưng khi hỏi thêm thì không trả lời được điều này khiến trải nghiệm trở nên có chút rắc rối."* | Trung bình |
| **5. Nguyễn Hoàng Duy** (Học viên AI Thực Chiến K4 - Willing User) | Tương tác slide với chatbox | Trích dẫn `[Trang N]` hoạt động tốt, giúp kiểm chứng nhanh. | *"Rất tin tưởng, trích dẫn rõ ràng giúp tra cứu vô cùng tiện lợi."* | Thấp |
| **6. Vũ Khánh Linh** (Học viên AI Thực Chiến K4 - Willing User) | Hỏi tóm tắt bằng từ lóng, câu hỏi nối tiếp | AI xử lý tốt ngữ cảnh nối tiếp, giao diện thân thiện. | *"Không có điểm khó chịu nào đáng kể, UI đẹp và dễ dùng hơn VLearn cũ."* | Thấp |

---

### Tổng hợp đánh giá

- **Chủ đề lặp nhiều nhất**: Độ trễ khi phản hồi nội dung dài (thiếu text streaming) và giới hạn hiển thị giao diện trên thiết bị di động, mong muốn AI đọc được hình ảnh.
- **1-2 thay đổi làm trước demo (-> Changelog spec §9)**: Cập nhật prompt từ chối cho slide hình ảnh (thêm gợi ý người dùng tự đặt câu hỏi cụ thể) và tích hợp *Slide Parsing Cache* để giảm độ trễ đọc file PDF.
- **Giữ nguyên có lý do**: Giữ nguyên rào chắn an toàn (từ chối giải quiz/bài tập) để đảm bảo tuân thủ liêm chính học thuật (HAX G10).
- **Đưa vào backlog (slide 6)**: Tích hợp Vision OCR để đọc thông tin trong sơ đồ đồ họa, tối ưu UI/UX Responsive cho di động, và thêm Streaming Text cho Chatbot.
