# DEMO SLIDES — TEAM RAU MÁ · VLEARN MASTERY LOOP

> Mạch pitch chuẩn: **Vấn đề → User/JTBD → Giải pháp team → Trải nghiệm → AI đáng tin →
> Đo lường & bước tiếp**. Số liệu user research chưa có được ghi trung thực, không thay bằng ước lượng.

## 1. Vấn đề

Học viên vừa hoàn thành bài học nhưng chưa có feedback loop ngắn, đáng tin để biết mình đã hiểu
gì và còn hổng gì. Hệ quả giả thuyết: ôn lan man, bỏ qua điểm yếu, hoặc mang lỗ hổng sang bài sau.

## 2. User & mục tiêu

**JTBD:** “Sau khi học xong, tôi muốn kiểm tra nhanh các ý chính để biết chính xác mình cần ôn gì
tiếp — thay vì tự đoán mình đã hiểu.”

Success demo: 15 câu quiz cuối bài → % theo 4 mục đề cương → 5 câu củng cố đúng phần yếu.

## 3. Giải pháp của Team — VLearn Mastery Loop

- AI hỗ trợ soạn nháp, giảng viên verify, rồi mới release quiz 15 câu cố định.
- Học viên nhận kết quả theo 4 mục đề cương, không chỉ một điểm tổng.
- Khi một mục dưới 70%, hệ thống đề xuất Quiz củng cố 5 câu theo đúng phần đó.

## 4. Trải nghiệm sản phẩm

1. Học slide Day03.
2. Mở Quiz cuối bài đã phát hành ở sidebar.
3. Xem đúng/sai và tỷ lệ nắm vững theo 4 mục.
4. Tạo Quiz củng cố ngắn cho phần yếu.

## 5. AI & niềm tin

Quiz củng cố chạy LangGraph: `retrieve_transcript → generate_quiz → validate_quiz → retry`.
Nguồn là transcript Day03 có source ID; validator chặn output sai schema/nguồn hoặc thiếu evidence.

## 6. Đo lường & bước tiếp

Hiện có 6/6 unit test pass, 20 golden cases đã chuẩn bị, 3 willing users đã xác định. Trước demo
cuối cần hoàn tất survey ≥20 người, validation ≥5 người và đo golden set thật trước khi tuyên bố
hiệu quả hoặc đạt quality bar.
