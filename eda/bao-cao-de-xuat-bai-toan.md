# BÁO CÁO ĐỀ XUẤT BÀI TOÁN — QUIZ CỦNG CỐ CUỐI BUỔI

**Nhóm:** Team Rau Má
**Hướng:** A — VLearn, tính năng mới
**Trạng thái:** Đề xuất pain đang chờ bằng chứng khảo sát
**Cập nhật:** 07/08/2026

## 1. Tóm tắt quyết định

### Bài toán đề xuất

Sau mỗi buổi học, học viên cần biết phần nào mình chưa nắm để ôn lại đúng trọng
tâm. Hiện giả thuyết của nhóm là họ chưa có một phản hồi ngắn, đáng tin và đủ sát
với bài vừa học để tự kiểm tra điều đó.

### Problem statement

> Học viên vừa hoàn thành một buổi học nhưng không có phản hồi nhanh, đáng tin về
> mức hiểu của mình, nên khó ưu tiên nội dung cần ôn lại và dễ mang lỗ hổng kiến
> thức sang bài sau.

### Lát cắt prototype — một câu

> Một học viên vừa học xong một bài được hệ thống tạo quiz 15 câu có căn cứ theo
> đúng bài vừa học, chấm đáp án và chỉ ra một nội dung cần ôn lại, để học viên
> quyết định bước học tiếp theo.

### Điều chưa được phép khẳng định

Hiện **chưa có bằng chứng mining hoặc khảo sát** chứng minh pain trên xảy ra ở bao
nhiêu học viên, tần suất và hậu quả mỗi lần. Nhóm cần thu thập bằng chứng trực tiếp
cho pain Quiz trước khi chốt bài toán.

## 2. User & Job

| Thành phần | Nội dung |
|---|---|
| Job executor | Học viên vừa kết thúc buổi học trên VLearn. |
| Bối cảnh | Họ chuẩn bị chuyển sang bài tiếp theo, làm bài tập hoặc ôn thi nhưng chưa chắc mình hiểu đúng phần trọng tâm của bài vừa học. |
| Core JTBD | Sau khi học xong một buổi, kiểm tra ý chính mình chưa nắm để biết cần ôn lại phần nào trước khi quên hoặc bước sang bài tiếp theo. |
| Job story | Khi vừa kết thúc một buổi học có nhiều khái niệm mới, tôi muốn làm một kiểm tra ngắn dựa trên đúng nội dung vừa học để biết phần nào cần xem lại thay vì chỉ cảm thấy rằng mình “có vẻ hiểu”. |
| Alternatives | Tự xem lại slide; làm bài tập dài; hỏi Tutor; hỏi bạn/TA; dùng AI khác; hoặc không ôn lại. |

## 3. Kế hoạch tìm bằng chứng

### 3.1 Đường bằng chứng được chọn: khảo sát A

Nhóm dùng form `quiz/survey.md` để hỏi về **buổi học gần nhất**, không hỏi dẫn
dắt kiểu “bạn có cần quiz AI không?”. Form bắt buộc người trả lời chọn một
`primary_pain`, sau đó ghi tần suất, thời gian mất và hậu quả.

| Điều kiện thể lệ | Cách thực hiện | Trạng thái |
|---|---|---|
| ≥20 người ngoài nhóm | Gửi form cho học viên ngoài Team Rau Má | Chưa thực hiện |
| ≥50% xác nhận pain | Tính trên phản hồi hợp lệ theo định nghĩa bên dưới | Chưa thực hiện |
| Log toàn bộ câu hỏi và từng phản hồi | Export Google Forms sang CSV, lưu trong `validation/` hoặc thư mục evidence không công khai | Chưa thực hiện |
| ≥5 ví dụ nguyên văn | Lấy trích đoạn ngắn từ Câu 4, có sự đồng ý phù hợp | Chưa thực hiện |

### 3.2 Định nghĩa phản hồi hợp lệ

Một phản hồi hợp lệ khi:

1. Người trả lời là người thật ngoài Team Rau Má.
2. Có trả lời về một buổi học gần đây.
3. Câu 5 của form chọn một pain khác “Không gặp khó khăn”.
4. Câu 8 chọn ít nhất một hậu quả khác “Không hậu quả”.

`primary_pain` là lựa chọn ở Câu 5, ví dụ: không biết ôn phần nào; không biết mình
hiểu đúng chưa; không có bài ngắn để tự kiểm tra; quiz quá dài; thiếu thời gian.

### 3.3 Bảng bằng chứng cần điền sau khảo sát

| Primary pain | Số người xác nhận | Tỷ lệ trên mẫu hợp lệ | Tần suất | Thời gian mất/lần | Hậu quả phổ biến | 5 quote/ID |
|---|---:|---:|---|---|---|---|
| Không biết ôn phần nào | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Không biết mình hiểu đúng chưa | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Không có bài ngắn để tự kiểm tra | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Quiz hiện có quá dài | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Thiếu thời gian | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

**Quy tắc:** chốt định nghĩa và mẫu số trước khi xem kết quả; không xóa phản hồi
không hợp ý; ghi rõ mọi quy tắc loại trùng hoặc loại phản hồi test.

## 4. Impact & quyết định chọn

Hiện có ba ứng viên. Bảng này chưa có dữ liệu thật nên chỉ là khung quyết định,
không phải kết luận.

| Ứng viên | Người gặp | Tần suất | Tốn gì/lần | Khả thi build | Quyết định hiện tại |
|---|---:|---:|---:|---|---|
| Không biết mình hiểu đúng chưa sau buổi | `[khảo sát]` | `[khảo sát]` | `[phút/hậu quả]` | Cao: quiz + feedback ngắn | Ứng viên chính |
| Không biết cần ôn phần nào | `[khảo sát]` | `[khảo sát]` | `[phút/hậu quả]` | Cao: chỉ ra một nội dung cần ôn | Ứng viên gần |
| Không có bài tự kiểm tra vừa sức | `[khảo sát]` | `[khảo sát]` | `[phút/hậu quả]` | Cao: quiz 15 câu | Ứng viên gần |
| Quiz/bài hiện có quá dài | `[khảo sát]` | `[khảo sát]` | `[phút/hậu quả]` | Trung bình: cần hiểu quiz hiện có | Có thể loại |

### Quy tắc chốt

Chọn pain có: (1) tỷ lệ xác nhận cao, (2) tần suất/hậu quả rõ, (3) ít nhất năm
quote cụ thể, và (4) giải được bằng một lát cắt 5 phút. Nếu ba pain đầu sát nhau,
chọn pain có evidence mạnh nhất; quiz vẫn có thể là giải pháp nhưng problem
statement phải bám pain được chọn.

## 5. Giải pháp đề xuất

### Flow

1. Học viên chọn bài vừa học hoặc hệ thống nhận biết bài vừa hoàn thành.
2. Hệ thống lấy các đoạn nguồn đã duyệt của bài.
3. AI quyết định có đủ nguồn để sinh quiz hay không.
4. Nếu đủ: sinh 15 câu, mỗi câu/đáp án có mã nguồn học liệu.
5. Học viên trả lời; hệ thống chấm và chỉ ra một nội dung cần ôn lại.
6. Nếu thiếu nguồn: không sinh quiz, nói rõ lý do và cho chọn đoạn/chủ đề khác.
7. User có thể báo câu hỏi hoặc đáp án sai nguồn.

### Automation: Conditional / augment

AI chỉ soạn quiz khi nguồn hỗ trợ câu hỏi và đáp án. Với nguồn mơ hồ, hệ thống
không tự đoán; nó yêu cầu thêm nội dung hoặc chuyển sang checklist tự đánh giá.

Lý do: câu quiz sai có thể khiến học viên học sai hoặc đánh giá sai mức hiểu của
mình. Chi phí không sinh được một quiz thấp hơn chi phí sinh quiz có đáp án sai.

### Non-goals

- Không thay điểm học phần hoặc điểm kiểm tra chính thức.
- Không dùng AI hoặc credit trong bài thi/kiểm tra chính thức VinUni.
- Không tạo ngân hàng quiz toàn bộ khóa.
- Không tự động kết luận năng lực dài hạn của học viên.
- Không cấp phần thưởng thật nếu chính sách chưa được phê duyệt.

## 6. Reward, giới hạn AI và chính sách

| Hạng mục | Thiết kế prototype | Điều kiện triển khai thật |
|---|---|---|
| Reward | Đạt từ 12/15 câu đúng (80%), nhận 1 practice-question credit | Giảng viên/ban vận hành phê duyệt |
| Cap | Hiển thị cap 20 credits | Xác định theo học phần/chu kỳ rõ ràng |
| Lợi ích credit | Mở lượt hỏi trong **chế độ ôn tập VLearn** | Không ảnh hưởng đặc quyền học vụ/đánh giá |
| Thi chính thức | Không có flow nào cho phép dùng credit | Phải tuân thủ quy định assessment của VinUni |
| Chống spam | Một quiz thưởng một lần, random hóa, log lượt làm | Rà soát fairness và gian lận |

Nếu mong muốn ban đầu là dùng credit trong “bài kiểm tra cuối kỳ”, nhóm cần có xác
nhận bằng văn bản của đơn vị phụ trách học vụ trước khi coi đó là một feature. Nếu
không, demo và spec phải gọi nó là **practice mode trước kỳ thi**.

## 7. Bốn lớp chỗ khó và kịch bản

| Lớp | Trigger | Hành vi mong muốn |
|---|---|---|
| ① Nguồn sự thật | Câu/đáp án không được tài liệu hỗ trợ | Không render câu; nêu chưa đủ nguồn; giữ source ID để kiểm tra. |
| ① Nguồn sự thật | User báo mã nguồn học liệu không hỗ trợ câu | Ẩn câu, không tính điểm/click reward, cho tạo lại từ nguồn khác. |
| ② Mơ hồ | Bài ít tài liệu/mục tiêu học không rõ | Hỏi user chọn đoạn/chủ đề, hoặc chuyển checklist tự đánh giá. |
| ② Mơ hồ | User làm sai nhưng lý do không rõ | Chỉ nêu đáp án + nguồn, không suy đoán misconception. |
| ④ Domain | Hai đáp án đều có vẻ đúng | Validator chặn câu; đưa vào golden set failure. |
| ④ Domain | Câu quá đánh đố/quá khó | User báo feedback; không thưởng tự động cho case bị flag. |

## 8. Kiểm thử và quality bar

### Golden set

Tối thiểu 20 case: 8–10 bài thường; ≥2 case cho mỗi lớp khó; 2–4 case hiếm. Mỗi
case lưu source IDs, input, output, expected behavior và kết quả pass/fail. Ít
nhất 10 case phát triển từ transcript/chatlog thật, chỉ trích dẫn tối thiểu theo
quy định data.

### Quality bar đề xuất

> Đạt khi ≥85% golden set pass, đồng thời 100% câu/đáp án render có mã nguồn học liệu hỗ
> trợ và 100% case xin dùng credit trong đánh giá chính thức bị từ chối đúng.

Bar chỉ là đề xuất. Nhóm phải chốt một lần trong `spec.md` trước 23:59 ngày 1,
không hạ bar sau khi thấy kết quả chạy.

| Chiều | Định nghĩa kiểm chứng |
|---|---|
| Groundedness | Người chấm mở được nguồn và xác nhận nguồn hỗ trợ câu + đáp án. |
| Correctness | Đáp án chấm khớp nguồn/rubric. |
| Relevance | Câu kiểm tra mục tiêu bài, không trivia hoặc kiến thức ngoài nguồn. |
| Difficulty | User test đánh giá vừa sức, không đánh đố. |
| Reward safety | Không có đường đi nào dùng credit cho đánh giá chính thức. |

## 9. Willing users & validation

| Người thử | Vai trò | Đồng ý thử | Thời gian dự kiến |
|---|---|---|---|
| Lâm Vũ | Học viên D303 | Có | 14:00 ngày 2 |
| Lê Văn Tuấn | Học viên D303 | Có | 14:00 ngày 2 |
| Cao Hương Giang | Học viên D303 | Có | 14:00 ngày 2 |

Task validation:

> “Hãy dùng prototype sau một bài học, làm quiz và cho biết liệu kết quả có giúp
> bạn biết cần ôn gì tiếp theo hay không.”

Ghi log ≥5 người ngoài nhóm: tên/vai, task, quan sát, quote nguyên văn, mức nghiêm
trọng. Hỏi đúng ba câu: điều gì khó hiểu/khó chịu nhất; bạn có tin kết quả không và
vì sao; bạn có dùng thật không và vì sao.

## 10. Kế hoạch theo checkpoint

| Mốc | Việc cần xong | Artifact |
|---|---|---|
| CP1 | Chạy khảo sát, có pain hypothesis, willing users, lát cắt | Canvas + link form |
| CP2 | Flow bấm được với quiz mẫu, chưa cần AI | Prototype mock + commit |
| CP3 | AI call thật sinh quiz có mã nguồn học liệu; golden set ≥20; lượt đo đầu | Code + eval kết quả 1 |
| CP4 | Chốt evidence khảo sát, impact, 4 lớp, quality bar | `spec.md` trước 23:59 ngày 1 |
| CP5 | Test với ≥5 người, changelog, dry run | `validation/` + slide |
| CP6 | Demo một happy path và một failure path | Slide + prototype |

## 11. Kết luận hiện tại

Quiz cuối buổi là một **giải pháp khả thi**, không phải pain đã được chứng minh.
Nhóm chỉ nên chốt bài toán sau khi khảo sát xác nhận pain chính, quy mô, tần suất
và hậu quả. Nếu pain được xác nhận, lát cắt 15 câu có căn cứ, feedback nội dung cần
ôn và practice credits có cap 20 là đủ nhỏ để build/demo, đồng thời giữ an toàn học
thuật bằng cách tách hoàn toàn khỏi đánh giá chính thức. Thời lượng 10–12 phút cần được xác nhận lại qua khảo sát.

## Tài liệu liên quan

- Canvas: `quiz/product-canvas.md`
- Form khảo sát: `quiz/survey.md`
- Script tạo Google Form: `quiz/google-form-quiz.gs`
- Kế hoạch prototype: `quiz/prototype-plan.md`
