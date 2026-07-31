# AI SPEC — Tóm tắt bài giảng thông minh bằng AI Tutor VLearn · Nhóm [B4] · Zone [B]
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tối ưu tính năng có sẵn  [ ] Tính năng mới
## §1. User & Job

- Job executor + workflow:
  Học viên sử dụng VLearn để ôn tập trước các bài kiểm tra và kỳ thi.

  Workflow:
  1. Mở VLearn.
  2. Chọn môn học.
  3. Mở slide bài giảng.
  4. Đọc lại toàn bộ slide.
  5. Ghi chú hoặc tự tóm tắt.
  6. Ôn tập trước kỳ thi.

- Core JTBD:
  Khi chuẩn bị cho kỳ thi, tôi muốn nhanh chóng nắm được các ý chính của bài giảng để ôn tập hiệu quả mà không phải đọc lại toàn bộ slide.

- Problem statement:
  Sinh viên mất nhiều thời gian đọc lại toàn bộ slide khi ôn thi để tìm nội dung quan trọng cần ghi nhớ, dẫn đến việc ôn tập kém hiệu quả.

- Evidence (chuẩn A – Khảo sát người dùng thật):

    - Số liệu khảo sát (n = 57):
        - 39/57 (68,4%) người tham gia cho biết AI Tutor hiện chưa thể tóm tắt slide, đây là bất tiện lớn nhất khi sử dụng để ôn tập.
        - 24/57 (42,1%) cho rằng câu trả lời còn quá chung chung, chưa đủ trọng tâm.
        - 20/57 (35,1%) mong muốn AI chỉ rõ nội dung đang nằm ở slide hoặc phần nào của bài giảng.
        - 16/57 (28,1%) nhận xét AI chưa làm nổi bật được các ý chính cần ghi nhớ.
        - 15/57 (26,3%) cho rằng AI chưa chia nội dung theo từng phần/chủ đề nên khó theo dõi khi ôn tập.

    - ≥5 quote/ví dụ nguyên văn + nguồn:

        1. "AI ko đọc dc slide."
        2. "k tóm tắt dc toàn bộ slide."
        3. "Hơi vô tri hỏi nội dung thì ko giải thích dc đọc sờ lai còn hơn."
        4. "k tóm tắt dc khi chỉ số trang."
        5. "Câu trả lời chưa sát lắm."
        6. "k tóm tắt được slide theo số trang"

  Nguồn: Khảo sát người dùng (Google Forms – Câu 10: "Nếu bạn từng có trải nghiệm 'tệ' với AI Tutor...", 57 người tham gia).

- Kết quả khảo sát cho thấy nhu cầu cải thiện chức năng tóm tắt bài giảng là rõ ràng. Đa số người tham gia gặp khó khăn khi AI Tutor chưa hỗ trợ tóm tắt slide, đồng thời mong muốn nội dung trả lời ngắn gọn, đúng trọng tâm và có cấu trúc rõ ràng để phục vụ việc ôn thi hiệu quả hơn.

## §2. Impact & quyết định chọn

- Bảng impact ≥3 ứng viên (bao nhiêu người · tần suất · tốn gì mỗi lần · khả thi):

| Ứng viên | Bao nhiêu người | Tần suất | Tốn gì mỗi lần | Khả thi |
|----------|----------------:|----------|----------------|----------|
| AI Tutor chưa thể tóm tắt slide | 39/57 (68,4%) | Mỗi lần ôn thi hoặc xem lại bài giảng | Phải đọc lại toàn bộ slide | Cao |
| Câu trả lời quá chung chung | 24/57 (42,1%) | Thường xuyên | Mất thời gian tự lọc ý chính | Trung bình - Cao |
| Không chỉ rõ vị trí nội dung trong slide | 20/57 (35,1%) | Khi tra cứu | Mất thời gian tìm lại slide | Trung bình |

- Ứng viên ĐÃ LOẠI + vì sao:

1. Câu trả lời quá chung chung: đây là vấn đề về cách diễn đạt, chưa giải quyết pain point lớn nhất là AI chưa hỗ trợ tóm tắt.
2. Không chỉ rõ vị trí nội dung trong slide: hữu ích nhưng mức độ ảnh hưởng và nhu cầu thấp hơn.

- Ứng viên CHỌN + vì sao (bằng số):

    Chọn **"AI Tutor chưa thể tóm tắt slide"** vì có **39/57 người (68,4%)** xác nhận đây là bất tiện lớn nhất khi sử dụng AI Tutor. Đây là tỷ lệ cao nhất trong khảo sát và phù hợp với mục tiêu giúp sinh viên ôn thi nhanh, đúng trọng tâm và tiết kiệm thời gian.

## §3. Giải pháp tương tự đã nghiên cứu

### ChatGPT
- Flow:
  Người dùng tải lên hoặc dán nội dung tài liệu, nhập yêu cầu tóm tắt và nhận bản tóm tắt do LLM sinh ra.
- Đáng học:
  - Khả năng hiểu ngữ cảnh và tạo bản tóm tắt tự nhiên.
  - Có thể điều chỉnh mức độ chi tiết theo yêu cầu.
- Đáng né:
  - Không gắn với cấu trúc môn học hoặc slide cụ thể.
  - Có thể sinh thông tin ngoài tài liệu nếu ngữ cảnh chưa đầy đủ.
- Mình khác gì:
  - Chỉ làm việc với slide trên VLearn.
  - Hỗ trợ tóm tắt theo Day/Page.
  - Chỉ sử dụng nội dung lấy từ slide để giảm hallucination.

### NotebookLM
- Flow:
  Người dùng tải tài liệu lên, hệ thống lập chỉ mục, sau đó sinh câu trả lời và bản tóm tắt dựa trên tài liệu đã cung cấp.
- Đáng học:
  - Luôn bám sát tài liệu nguồn.
  - Có khả năng trích dẫn nguồn khi trả lời.
- Đáng né:
  - Người dùng phải tự tải tài liệu lên.
  - Chưa tích hợp trực tiếp với hệ thống học tập.
- Mình khác gì:
  - Không cần tải tài liệu vì slide đã có sẵn trên VLearn.
  - Tập trung vào workflow ôn thi của sinh viên.
  - Truy xuất theo Day/Page trước khi sinh bản tóm tắt.

## §4. Thiết kế

- Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả)

    - Một học viên đang ôn lại bài sau buổi học · yêu cầu tóm tắt một bài giảng từ slide · AI quyết định nội dung nào là trọng tâm · trả về bản tóm tắt ngắn gọn phục vụ ôn tập.


- Non-goals (≥3)

    - Không trả lời các câu hỏi ngoài phạm vi nội dung học tập trên VLearn.
    - Không tạo hoặc suy diễn thêm kiến thức ngoài nội dung có trong slide bài giảng.
    - Không hỗ trợ tóm tắt các tài liệu không thuộc hệ thống VLearn.
    - Không thay thế giảng viên hoặc trợ giảng trong việc giải thích chuyên sâu hay tư vấn học tập.


- Mức prototype nhắm tới

    - [ ] Sketch
    - [ ] Mock
    - [x] Working

    **Phần đã hiện thực:**
    - Truy xuất nội dung slide từ VLearn.
    - Sử dụng GPT-4.1 mini để tạo bản tóm tắt.
    - Kiểm tra đầu vào (Day/Page) trước khi xử lý.
    - Đánh giá bằng bộ test tự động gồm 20 test case.

    **Phần chưa hiện thực:**
    - Chưa tích hợp trực tiếp vào hệ thống VLearn chính thức.
    - Chưa hỗ trợ giao diện người dùng hoàn chỉnh trong môi trường production.


- Automation:

    - [x] augment
    - [ ] conditional
    - [ ] automate

**Giải thích:**

AI chỉ đóng vai trò hỗ trợ sinh viên tạo bản tóm tắt để ôn tập. Sinh viên vẫn là người đánh giá và sử dụng nội dung tóm tắt trong quá trình học, vì việc hiểu sai hoặc bỏ sót kiến thức có thể ảnh hưởng đến kết quả học tập.


- §4b. Nguyên tắc HAX / PAIR đã áp dụng

| Nguyên tắc | Áp dụng trong prototype |
|------------|-------------------------|
| **Làm rõ khả năng và giới hạn của AI** | AI chỉ hỗ trợ tóm tắt nội dung từ slide trên VLearn và từ chối các yêu cầu ngoài phạm vi bài giảng. |
| **Giữ người dùng là người ra quyết định cuối cùng** | Bản tóm tắt chỉ mang tính hỗ trợ; sinh viên tự quyết định sử dụng nội dung nào khi ôn tập. |
| **Giảm thiểu lỗi bằng cách yêu cầu đủ thông tin** | Nếu người dùng chưa cung cấp đủ thông tin (ví dụ Day hoặc Page), hệ thống yêu cầu bổ sung trước khi tạo tóm tắt thay vì tự suy đoán. |
| **Bám sát dữ liệu người dùng cung cấp** | AI chỉ sử dụng nội dung truy xuất từ slide bài giảng để tạo bản tóm tắt, không tự bổ sung kiến thức ngoài tài liệu. |

## §5. Các kiểu lỗi

| Kiểu lỗi | Ví dụ | Ảnh hưởng | Cách giảm thiểu |
|----------|--------|-----------|-----------------|
| Thiếu thông tin đầu vào (Missing Information) | Người dùng yêu cầu "Tóm tắt bài giảng" nhưng không cung cấp Day hoặc Page. | AI không biết cần tóm tắt phần nào, có thể trả lời sai hoặc suy đoán. | Kiểm tra đầu vào và yêu cầu người dùng bổ sung thông tin trước khi xử lý. |
| Truy xuất sai công cụ (Wrong Tool) | AI cố gọi công cụ tóm tắt khi người dùng chỉ đang chào hỏi hoặc hỏi thông tin chung. | Tăng chi phí gọi LLM/tool và trả lời không phù hợp. | Chỉ gọi công cụ khi yêu cầu thực sự liên quan đến tóm tắt bài giảng. |
| Sai phạm vi (Wrong Boundary) | Người dùng yêu cầu AI giải thích kiến thức ngoài nội dung slide hoặc hỏi vấn đề không thuộc VLearn. | AI có thể sinh nội dung ngoài phạm vi sản phẩm hoặc hallucination. | Xác định rõ phạm vi hỗ trợ và từ chối các yêu cầu không thuộc bài giảng. |
| Yêu cầu ngoài phạm vi (Out of Scope) | Người dùng yêu cầu viết email, lập trình hoặc trả lời các câu hỏi không liên quan đến việc học trên VLearn. | AI thực hiện sai nhiệm vụ của sản phẩm. | Thông báo rõ giới hạn của AI Tutor và hướng người dùng quay lại các chức năng được hỗ trợ. |
| Gọi công cụ không cần thiết (Unnecessary Tool Use) | Người dùng chỉ hỏi "AI Tutor làm được gì?" nhưng AI vẫn truy xuất slide và gọi LLM tóm tắt. | Lãng phí tài nguyên và làm tăng thời gian phản hồi. | Phân loại ý định người dùng trước khi quyết định có sử dụng công cụ hay không. |

## §6. Bốn đường đi của trải nghiệm

### Happy path:

- Low-confidence:
    - AI không chắc chắn vì nội dung truy xuất quá ít, quá mơ hồ hoặc yêu cầu chưa đủ rõ để tạo bản tóm tắt chất lượng.
    - AI **không tự suy đoán**, mà thông báo mức độ không chắc chắn và đề nghị người dùng cung cấp thêm thông tin hoặc chọn lại phạm vi cần tóm tắt.


- Failure / không căn cứ:
    - AI không tìm thấy dữ liệu bài giảng tương ứng hoặc không có đủ căn cứ từ slide để tạo bản tóm tắt.
    - AI thông báo không thể thực hiện yêu cầu thay vì tự tạo nội dung ngoài tài liệu.


- Correction (user sửa):
    - Sau khi AI yêu cầu bổ sung hoặc báo lỗi, người dùng nhập lại đúng Day/Page hoặc chọn đúng bài giảng.
    - AI thực hiện lại quy trình và trả về bản tóm tắt.


### Khi bị đòi ngoài phạm vi:

- Case đặc thù domain:
    - Người dùng yêu cầu tóm tắt bài giảng có nhiều thuật ngữ chuyên ngành hoặc nhiều công thức.
    - AI vẫn chỉ tóm tắt dựa trên nội dung của slide, giữ nguyên các thuật ngữ chuyên môn quan trọng và không tự bổ sung kiến thức ngoài tài liệu.

## §7. Kiểm thử

### Chiều chất lượng + định nghĩa kiểm chứng được

| Chiều chất lượng | Định nghĩa kiểm chứng |
|------------------|------------------------|
| Đúng hành vi | AI phản hồi đúng theo hành vi mong đợi của từng test case. |
| Đúng phạm vi | AI không thực hiện các yêu cầu ngoài phạm vi AI Tutor. |
| Sử dụng tool hợp lý | AI chỉ gọi tool khi cần thiết. |
| Làm rõ khi thiếu thông tin | AI yêu cầu bổ sung thông tin thay vì tự suy đoán. |


### Golden Set

Golden Set gồm **30 test case** được lưu trong thư mục `eval/`.

| Nhóm test | Số lượng |
|------------|---------:|
| Missing Information | 7 |
| Wrong Tool | 10 |
| Wrong Boundary | 4 |
| Out of Scope | 7 |
| Unnecessary Tool Use | 2 |

Tổng cộng: **30 test case**


### Quality Bar

Prototype được coi là đạt khi:

- Tổng tỷ lệ pass ≥ **95%** qua bộ.
- **100%** test thuộc nhóm **Out of Scope** đạt.
- **100%** test thuộc nhóm **Missing Information** đạt.


### Kết quả các lượt chạy

| Lần chạy | Pass | Fail | Tỷ lệ |
|----------|------|------|--------|
| Run 1 | 17 | 3 | 85% |
| Run 2 | 19 | 1 | 95% |
| Run 3 | 22 | 30 | 73.33% |

## §8. Phân công & kế hoạch

### Phân công

| Hạng mục | Thành viên phụ trách |
|----------|----------------------|
| Spec | Nguyễn Đức Mạnh |
| Evidence (khảo sát, phân tích dữ liệu) | Nguyễn Đức Mạnh |
| Prompt Engineering | Vũ Quang Huy |
| Code (Tool) | Mai Văn Phương |
| Test case | Thiều Thị Ngọc Ánh |
| UI | Nguyễn Hoàng Sơn |
| Demo & Presentation | Vũ Quang Huy |

### Willing Users (Validation CP5)

**Người dùng sẵn sàng tham gia thử nghiệm**

1. Phạm Hoàng Anh
2. Bùi Xuân Hòa
3. Hồ Trọng Hảo

**Ba câu hỏi sau khi dùng prototype**

1. Bản tóm tắt có giúp bạn nắm được nội dung chính của bài giảng nhanh hơn không?
2. Có nội dung quan trọng nào trong slide mà AI bỏ sót hoặc tóm tắt chưa chính xác không?
3. Nếu AI Tutor có tính năng này trên VLearn, bạn có sử dụng trong quá trình ôn thi không? Vì sao?

**Người ghi nhận kết quả (log)**

Vũ Quang Huy

### Multi-prototype (nếu có)

#### Prototype A
- AI tạo bản tóm tắt dạng đoạn văn ngắn.
- Ưu điểm: dễ đọc, gần với cách ghi chú tự nhiên.
- Nhược điểm: khó tra cứu nhanh từng ý.

#### Prototype B
- AI tạo bản tóm tắt theo các gạch đầu dòng.
- Mỗi ý thể hiện một nội dung trọng tâm của bài giảng.
- Ưu điểm: dễ đọc, dễ ôn tập và tra cứu.
- Nhược điểm: ít diễn giải hơn.

**Phương án được chọn:** Prototype B.

**Lý do**

Đối tượng người dùng là sinh viên đang ôn tập, xem lại bài nên ưu tiên khả năng đọc nhanh và ghi nhớ các ý chính. Dạng bullet giúp người học tiết kiệm thời gian hơn so với bản tóm tắt dạng đoạn văn.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|-----------|---------|-----------------------------------|
| CP2 | Thu hẹp phạm vi từ "AI Tutor hỗ trợ học tập" thành "AI Tutor tóm tắt bài giảng". | Sau Problem Scan và khảo sát, 68.4% người dùng cho biết khó tóm tắt slide nhanh khi ôn thi. |
| CP3 | Thiết kế workflow sử dụng Slide Tool và Glossary Tool thay vì để LLM trả lời trực tiếp. | Giảm hallucination và đảm bảo AI chỉ dựa trên dữ liệu của VLearn. |
| CP3 | Bổ sung xử lý thiếu Day/Page trước khi gọi tool. | Phát hiện qua nhóm test Missing Information trong Golden Set. |
| CP3 | Thêm cơ chế từ chối các yêu cầu ngoài phạm vi. | Dựa trên nhóm test Out of Scope và Wrong Boundary. |
| CP4 | Mở rộng Golden Set từ 20 lên 30 test case. | Bổ sung các tình huống hội thoại nhiều lượt và Prompt Injection để đánh giá prototype đầy đủ hơn. |
| CP4 | Điều chỉnh prompt để giảm việc gọi tool không cần thiết. | Sau khi kiểm thử nhóm Unnecessary Tool Use. |