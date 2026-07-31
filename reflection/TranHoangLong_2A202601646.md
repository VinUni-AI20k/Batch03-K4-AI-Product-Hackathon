# Reflection cá nhân
- **Họ và tên**: Trần Hoàng Long
- **Mã học viên**: 2A202601646
- **Nhóm**: 5tuat
- **Vai trò trong nhóm**: Data & Evidence Lead (Đào dữ liệu chatlog & Phân tích khảo sát)

# 1. Bài học từ data thật
Mình phụ trách phần Evidence (§1) và bài học được rút ra là pain point chỉ có giá trị
khi có data theo sau. Ban đầu, giả thuyết "học viên ảo tưởng đã hiểu bài" nghe rất hợp lý, nhưng nếu chỉ dừng ở trực giác thì spec sẽ yếu.

Mình đã chứng minh nỗi đau này qua 2 dataset
1. **Lượt chat**: Trong `chat_history_anonymized_for_hackathon.csv` 99.88% lượt chat AI Tutor chưa từng chủ động hỏi lại để kiểm tra hiểu bài, và field `misconceptions` rỗng 100% dù đã có sẵn trong DB. Điều này chứng mình hệ thống im lặng trước lỗ hổng kiến thức. 
2. **Khảo sát thực tế**: Sau khi làm form và thu thập 36 mẫu khảo sát trong lớp, 3 con số được rút ra. 88.88% sẵn sàng làm Quiz ngắn, 91.66% đồng ý chia sẻ lịch sử câu sai, và đặc biệt là 38.9% yêu cầu nút "Đồng ý gửi". Con số này sau đó trở thành cơ sở trực tiếp cho nguyên tắc PAIR Control ở §4b.

**Bài học**: Việc phân tích data từ log cho thấy "vấn đề tồn tại", còn khảo sát cho thấy
"người dùng có muốn giải pháp đó không". 2 bộ dataset này củng cố
Impact Table ở §2. 

# 2. Khó khăn trong việc chọn con số thô đến quyết định sản phẩm
Cái khó không nằm ở việc tổng hợp số liệu, mà nằm ở phần lựa chọn các ứng viên phù hợp dựa vào con số đó. Lí do ứng viên 1 VLearn Active Recal được chọn là vì với quy mô 1000 học viên, tần suất 2-3 lần/tuần, và với 88% nhu cầu cần bài quiz để
kiểm tra độ hiểu bài. 2 ứng viên còn lại thì một là cảm nhận định tính, hai là out of score cho hạ tầng VLearn. 

# 3. Trải nghiệm làm việc nhóm
Nhóm 5tuat vận hành theo mô hình rất rõ vai trò: Bảo phụ trách khung Spec và rủi ro AI, mình lo phần Evidence, Đức Bảo lo Prompt/Eval, Cường code prototype, Đạt lo validation với người dùng thật. Nhờ dữ liệu và khảo sát của mình được chốt sớm (merge lúc 16:35 ngày 30/07), cả nhóm có nền tảng số liệu vững để không phải tranh cãi nên mọi quyết định đều có thể trace ngược về một con số cụ thể trong §1/§2.

# 4. Tự đánh giá đóng góp cá nhân
- **Đóng góp chính**: Khai thác 2.522 dòng chatlog và thu thập/phân tích khảo sát 36 học viên. Xây dựng bảng Impact 3 ứng viên để đưa ra quyết định sản phâm.
- **Tác động tới sản phẩm**: Số liệu 99.88% và 38.9% trực tiếp định hình Non-goals, mức Automation và nguyên tắc PAIR Control trong thiết kế cuối.
- **Đánh giá mức độ hoàn thành**: Hoàn thành đúng hạn, dữ liệu đạt và vượt chuẩn rubric (N≥20).