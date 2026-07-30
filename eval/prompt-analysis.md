# Phân tích prompt và điểm quyết định AI cho CP3

## Kết luận ngắn

Điểm quyết định dùng GPT-4.1-mini rõ nhất là luồng điền biểu mẫu: model chọn giá trị nào từ lời người dùng được ánh xạ vào field hợp lệ và chọn trường bắt buộc còn thiếu để hỏi tiếp. Model không được tự suy diễn, ký hay nộp hồ sơ. Việc chọn thủ tục và lấy citation hiện chủ yếu do pipeline theo mã/từ khóa/trạng thái và snapshot, không nên mô tả là GPT tự gọi RAG hoặc tự gửi hồ sơ.

## 1. Prompt trả lời có căn cứ (`grounded_response.txt`)

- Chỉ cho phép dùng evidence được cung cấp đối với hồ sơ, phí, deadline, cơ quan, điều kiện và căn cứ pháp lý.
- Mọi claim hành chính/pháp lý phải có token `[CIT-n]`; thiếu evidence phải nói không thể xác minh và hỏi thông tin tối thiểu.
- Không được tự tạo cơ quan, biểu mẫu, phí, deadline, URL hoặc văn bản pháp luật.
- Rủi ro cần test: citation có nhưng retrieval lấy sai/thiếu section; câu ngoài nguồn chỉ hỏi phân loại mà không công khai giới hạn.

## 2. Prompt hội thoại chọn thủ tục (`procedure_conversation.txt`)

- Mỗi lượt hỏi một câu ngắn, tối đa bảy lựa chọn.
- Với thủ tục địa phương phải hỏi tỉnh/thành trước khi trả lời chi tiết.
- Không đủ snapshot phải nói rõ không thể xác minh.
- Trong runtime hiện tại, phần lớn quyết định chọn thủ tục là deterministic trong `ProcedurePipeline`, nên golden set phải kiểm cả câu mơ hồ và câu ngoài catalog.

## 3. Prompt điền biểu mẫu (`form_filling.txt`)

- Đây là vị trí GPT-4.1-mini trực tiếp ra quyết định trong sản phẩm.
- Chỉ trích xuất field người dùng nói rõ; cấm suy diễn mọi field (`do_not_infer`).
- Mỗi lượt hỏi đúng một trường bắt buộc còn thiếu, trừ khi người dùng tự cung cấp nhiều field.
- Không tạo field ngoài schema và không tự khẳng định hồ sơ/phí/thời hạn.
- Rủi ro cần test: điền nhầm field, suy diễn quan hệ/ngày/giới tính, giữ nhầm form cũ sau khi người dùng đổi ý, hoặc làm theo yêu cầu điền khống.

## 4. Prompt AI rà soát biểu mẫu (`form_review.txt`)

- Model chỉ tìm vấn đề quy tắc cứng chưa phát hiện: tên bất thường, địa danh đáng ngờ và mâu thuẫn logic đời thường.
- Không lặp lỗi đã có, không tạo field mới, không bịa dữ liệu.
- Khi chưa chắc phải dùng `unable_to_verify`, chỉ dùng `blocking_error` khi chắc chắn.
- Prompt này phục vụ bước rà soát sau khi điền; bộ CP3 hiện tập trung vào quyết định hội thoại trung tâm nên chưa chấm chất lượng từng issue của AI review.

## Khoảng trống được lượt đo đầu phát hiện

1. Câu ngoài nguồn trả confidence thấp nhưng chưa nói rõ “không thể xác minh”.
2. Yêu cầu ký/nộp thay hoặc điền dữ liệu giả chưa được một safety gate chung chặn trước khi routing.
3. Retrieval theo từ khóa có thể đưa section phí/kênh nộp ra ngoài top 6 khi câu chứa nhiều từ gây nhiễu.
4. Luồng form và đổi form hoạt động tốt trong bộ này, nhưng cần giữ test chống suy diễn ở mọi lần sửa prompt.
