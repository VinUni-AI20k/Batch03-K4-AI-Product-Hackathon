SLIDE_SINGLE_PASS_PROMPT = """Dưới đây là toàn bộ nội dung trích xuất từ bộ slide bài giảng (gồm {total_slides} trang):

--- NỘI DUNG SLIDE ---
{full_text}
----------------------

Hãy phân tích toàn bộ nội dung trên và tạo một bản tóm tắt bài giảng hoàn chỉnh gồm các phần sau (định dạng Markdown):

1. **Tổng quan Executive Summary**: (Tóm tắt mục tiêu chính và thông điệp cốt lõi của bộ slide trong 3-5 câu).
2. **Luồng kiến thức & Bố cục (Outline)**: (Liệt kê các chương/chủ đề chính bài giảng đề cập kèm phạm vi slide tương ứng).
3. **Chi tiết nội dung theo Slide**:
   - Đối với mỗi slide hoặc cụm slide liên quan, tóm tắt 2-4 ý chính cốt lõi kèm trích dẫn `[Slide X]`.
4. **Từ khóa chuyên môn & Câu hỏi ôn tập**:
   - Top 5-10 thuật ngữ/từ khóa quan trọng cần nhớ.
   - 3 câu hỏi gợi mở để người học tự kiểm tra mức độ hiểu bài.
"""

SLIDE_MAP_PROMPT = """Dưới đây là nội dung của [Slide {slide_number}]:

--- NỘI DUNG ---
{content}
----------------

Hãy tóm tắt ngắn gọn Slide này theo các yêu cầu sau:
- **Tiêu đề/Chủ đề chính**: (Đoán hoặc trích xuất từ slide).
- **Ý chính cốt lõi**: (1 - 3 gạch đầu dòng ngắn gọn).
- **Từ khóa quan trọng**: (List ngắn các khái niệm/từ khóa nếu có).
"""

SLIDE_REDUCE_PROMPT = """Dưới đây là danh sách tóm tắt từng slide đã trích xuất từ bộ slide ({total_slides} trang):

--- BẢN TÓM TẮT CÁC SLIDE ---
{map_summaries}
----------------------------

Dựa trên bản tóm tắt từng slide trên, hãy tổng hợp thành một báo cáo bài giảng hoàn chỉnh bao gồm:

1. **Tổng quan Executive Summary** (3-5 câu bao quát toàn bộ nội dung).
2. **Bố cục bài giảng (Outline)** (tổng hợp các phần chính và số trang tương ứng).
3. **Tổng hợp kiến thức trọng tâm theo chủ đề** (góm nhóm các slide cùng chủ đề và nêu bật ý cốt lõi, trích dẫn [Slide X]).
4. **Key Takeaways & Action Items** (Những điểm cốt lõi nhất học viên/người xem cần ghi nhớ).
"""
