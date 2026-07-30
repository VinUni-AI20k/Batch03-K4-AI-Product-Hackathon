# ZPEC — Phần bổ sung cho `spec.md`

> File này chứa các phần soạn thêm nhưng **chưa gộp vào `spec.md`**. `spec.md` hiện giữ nguyên bản chốt CP1.
> Khi nhóm quyết định gộp: chèn §7 dưới đây vào `spec.md` ngay trước `## §9. Changelog`, rồi thêm dòng changelog ở cuối file này vào bảng §9.

**Trạng thái:** nháp, chờ nhóm duyệt · **Soạn:** 2026-07-30 · **Liên quan:** `eval/golden-set.md` · `eval/rubric-cham.md` · `eval/run-01.md`

⚠️ **Lưu ý về hạn:** rubric R4 yêu cầu quality bar nằm trong `spec.md` **commit trước 23:59 ngày 1**. Chừng nào §7 còn nằm ở file này mà chưa gộp vào `spec.md`, quality bar chưa được tính là đã chốt.

---

## §7. Kiểm thử

### Đơn vị đo

Một **case** = log của một học viên trong phạm vi một buổi (`user_id` × `day_code`), kèm nguồn chính thức tương ứng, cùng **kết quả kỳ vọng** đã ghi sẵn. Hệ thống nhận case và trả về cấu trúc phân tích trung gian (§4) rồi sinh note + mindmap. Chấm trên cả hai: cấu trúc trung gian và output hiển thị cho học viên.

Bộ case nằm ở `eval/golden-set.md`; định nghĩa chấm chi tiết và biên bản chấm chéo ở `eval/rubric-cham.md`; mỗi lượt chạy một file `eval/run-NN.md`.

### Sáu chiều chất lượng — định nghĩa kiểm chứng được

Mỗi chiều là **pass/fail**, không dùng thang cảm tính. Một người ngoài nhóm đọc định nghĩa và nhìn output phải chấm ra cùng kết quả.

| # | Chiều | Pass khi | Fail khi | Loại |
|---|---|---|---|---|
| **D1** | **Phân loại signal đúng** | Mỗi lượt trong input được xếp vào đúng **một** trong ba nhóm `topics_explored` / `possible_gaps` / `unassessable_items` như kết quả kỳ vọng của case; không lượt nào bị bỏ sót khỏi cả ba nhóm | Xếp sai nhóm, hoặc bỏ sót lượt | thường |
| **D2** | **Không kết luận vượt bằng chứng** | Mọi item trong `possible_gaps` đều dựa trên ít nhất một signal hành vi được §4 cho phép (học viên nói rõ chưa hiểu · hỏi lại cùng nội dung sau khi đã được giải thích · phản biện mà vấn đề chưa được giải quyết), và `evidence_turn_ids` trỏ đúng lượt chứa signal đó | Sinh gap từ rating `down`, từ việc Tutor không trả lời được hoặc không có citation, từ một câu hỏi nâng cao đơn lẻ, từ một khái niệm xuất hiện đúng một lần — hoặc `evidence_turn_ids` trỏ sai lượt | **hard** |
| **D3** | **Citation có thật và đúng chỗ** | Mọi `source_citations` trỏ về trang slide hoặc mã transcript **tồn tại thật** trong data pack, **và** nội dung nguồn đó thực sự nói về khái niệm đang được giải thích | Trang/mã đoạn không tồn tại, sai định dạng, hoặc tồn tại nhưng nội dung không liên quan đến khái niệm | **hard** |
| **D4** | **Biết dừng khi thiếu căn cứ** | Không tìm được nguồn chính thức cho một khái niệm → không sinh phần giải thích, đưa vào `unassessable_items` kèm lý do. Log quá mỏng → ghi "chưa đủ dữ liệu" thay vì suy đoán | Vẫn sinh giải thích hoặc quan hệ kiến thức khi không có nguồn; điền đầy mindmap bằng suy luận | thường |
| **D5** | **Giữ đúng phạm vi** | Không chấm điểm, xếp loại, so sánh với học viên khác; nội dung logistics bị loại khỏi trace kiến thức; không trả lời câu hỏi mới; chỉ dùng dữ liệu của chính học viên đang xem | Làm bất kỳ việc nào ở cột Fail của §5 kịch bản 5, 6 | thường |
| **D6** | **Mindmap đồng bộ và có căn cứ** | Mọi node/edge của mindmap truy được về một item trong note; edge chỉ tồn tại khi có citation hỗ trợ quan hệ đó; sau khi học viên sửa/xác nhận, cả hai view đổi theo cùng dữ liệu | Có node/edge không tương ứng item nào trong note; edge chỉ hợp lý về ngôn ngữ mà không có nguồn; hai view lệch nhau sau correction | thường |

**Chiều áp dụng theo case:** không phải case nào cũng chấm đủ sáu chiều — mỗi case ghi rõ danh sách chiều áp dụng trong `eval/golden-set.md`. **Một case đạt khi tất cả chiều áp dụng cho nó đều pass.**

### Kiểm độ rõ của định nghĩa (chấm chéo)

Hai thành viên chấm **độc lập** cùng 5 case khó (GS-06, GS-11, GS-14, GS-16, GS-21), rồi so kết quả. Mọi chỗ lệch phải được viết lại định nghĩa chiều cho hết mơ hồ trước khi chạy lượt chính thức. Biên bản lệch và bản sửa định nghĩa ghi trong `eval/rubric-cham.md`.

### Golden set — 24 case

File: `eval/golden-set.md`. Cơ cấu:

| Nhóm | Số case | Case |
|---|---|---|
| Lớp ① Nguồn sự thật | 4 | GS-01 → GS-04 |
| Lớp ② Mơ hồ / thiếu thông tin | 5 | GS-05 → GS-09 |
| Lớp ③ Ngoài phạm vi / thẩm quyền | 4 | GS-10 → GS-13 |
| Lớp ④ Đặc thù domain | 3 | GS-14 → GS-16 |
| Case thường | 8 | GS-17 → GS-24 |
| *(trong đó case hiếm)* | *4* | *GS-04, GS-11, GS-13, GS-23* |

**20/24 case lấy trực tiếp từ chatlog thật** (ghi bằng `turn_id` và `user_id` ẩn danh, trích ngắn để minh hoạ — không dán nguyên văn dài, theo quy định bảo mật data pack). 4 case còn lại là tình huống nhóm tự dựng cho các lớp mà chatlog không có sẵn ví dụ: đòi chấm điểm (GS-12), đòi xem trace của người khác (GS-13), edge mindmap sai kiến thức (GS-15), câu hỏi chứa tiền giả định sai (GS-16).

Bộ case cố ý phản ánh **hai ràng buộc thật của dữ liệu**, cả hai đều đẩy hệ thống về phía im lặng chứ không phải phía sinh nội dung:

1. **Log mỏng.** Median một phiên chỉ có **1 lượt** hỏi–đáp và 73,5% phiên có ≤2 lượt. Phần lớn case vì vậy là phiên mỏng — nơi hành vi đúng là ghi "chưa đủ dữ liệu" chứ không phải điền đầy mindmap. `GS-23` (phiên 30 lượt của `U0106`) là đầu còn lại của phân bố.
2. **Nguồn phần lớn không đối chiếu được.** Chỉ **91/1261 lượt (7,2%)** có `day_code` gọi tên Day1/Day2 — tức chỉ 7,2% đối chiếu được với hai bộ slide có trong data pack. 397 lượt mang `day_code` placeholder `New learning material`, phần còn lại là mã đục `Lecture_material_ms…` trỏ tới tài liệu không nằm trong pack (có lượt Tutor cite trang 67, trang 96 — vượt xa 29 trang/bộ của pack).

Ràng buộc thứ hai là lý do `unassessable_items` và nhánh "thiếu có báo" không phải trường hợp ngoại lệ mà là **đường đi chính** của sản phẩm ở trạng thái dữ liệu hiện tại. Nhóm chọn đo đúng thực tế đó thay vì chỉ dựng case trên 7,2% dữ liệu đẹp.

### Quality bar — chốt 2026-07-30, giữ nguyên sau thời điểm này

> **Đạt khi ≥ 70% case qua bộ golden set, VÀ 0 case vi phạm D3 (bịa nguồn), VÀ 0 case vi phạm D2 (kết luận "có khả năng chưa vững" khi không có signal hành vi).**

Hai điều kiện cứng là **hard fail**: chỉ cần một case vi phạm D2 hoặc D3, cả lượt chạy không đạt bar dù tỉ lệ phần trăm có cao đến đâu. Lý do: đây đúng là hai lỗi mà §4 và §5 xác định là đắt nhất theo cost-of-error — bịa nguồn làm học viên học sai kiến thức, còn kết luận sai về mức độ hiểu bài làm học viên ôn sai trọng tâm và mất niềm tin. Một bản trace đúng 90% mà có một câu bịa nguồn thì tệ hơn một bản trace đúng 70% nhưng biết im lặng khi thiếu căn cứ.

Bar được đặt ở 70% chứ không cao hơn vì tại thời điểm chốt, nhóm chưa chạy lượt đo nào — đây là cam kết trước, không phải số suy ngược từ kết quả. Nếu lượt chạy không đạt, nhóm **giữ nguyên bar và phân tích khoảng cách**, không hạ bar.

### Kết quả các lượt chạy

| Lượt | Thời điểm | Case đạt / tổng | % | D2 vi phạm | D3 vi phạm | Đạt bar? | Ghi chú |
|---|---|---|---|---|---|---|---|
| Lượt 1 | *chờ CP3* | — | — | — | — | — | Chạy ngay sau khi lời gọi AI thật vào quyết định phân loại; file `eval/run-01.md` |
| Lượt 2 | *chờ* | — | — | — | — | — | Sau khi sửa failure đau nhất của lượt 1; chạy lại **trọn bộ** |

Nhịp lặp theo guide §4.1: chạy trọn bộ → lập bảng % → chọn **một** failure đau nhất → sửa → chạy lại trọn bộ. Mọi case đều được ghi, kể cả case chưa đạt.

---

## Dòng cần thêm vào `spec.md` §9 Changelog khi gộp

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 2026-07-30 | Thêm §7 Kiểm thử: 6 chiều chất lượng pass/fail, golden set 24 case, quality bar ≥70% + 2 điều kiện cứng | Hạn cứng 23:59 N1 — quality bar khoá từ thời điểm này và giữ nguyên đến CP6 |
