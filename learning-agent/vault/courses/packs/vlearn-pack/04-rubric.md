---
course: packs
generated: '2026-07-30T10:11:39+00:00'
lang: vi
lesson: 04-rubric
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/04-rubric.md
source_hash: sha256:53288a12279c6ef23106dbe01ca6ab2ca9a7bf46bebaf35a4a84e0bc16f38bd0
type: lesson-note
---

```markdown
## Slide 1 — Rubric tổng quát

Rubric chấm điểm cho dự án bao gồm tổng số 100 điểm, chia thành 25 điểm cho việc nộp checkpoint và 75 điểm cho việc chấm bài nộp. Mỗi điểm sẽ liên kết với một file cụ thể trong repo và phúc khảo được. Không đánh giá dựa trên mức độ hoành tráng mà chỉ chấm dựa trên [[artifact]] và các bằng chứng cụ thể.

## Slide 2 — Phần 1: Nộp checkpoint (25 điểm)

Nộp đúng hạn sẽ được 5 điểm, trong khi nộp muộn sẽ không được điểm. Mỗi thành viên trong nhóm cần nộp riêng liên quan đến link repo chung.

| CP1 | CP2 | CP3 | CP4 | CP5 |
|:---:|:---:|:---:|:---:|:---:|
| 5 | 5 | 5 | 5 | 5 |

## Slide 3 — Phần 2: Chấm điểm (75 điểm)

Điểm chấm được phân chia theo từng khối cụ thể dựa trên các điều kiện và file tương ứng trong repo. 

| Khối | Điểm | Chấm trên file nào |
|---|---|---|
| R1 · Bằng chứng & impact | **15** | `spec.md` §1-§2 + log khảo sát/mining |
| R2 · Lát cắt & thiết kế | **15** | `spec.md` §4 |
| R3 · Chỗ khó & kịch bản rủi ro | 11 | `spec.md` §5-§6 |
| R4 · Kiểm thử | **15** | `spec.md` §7 + `eval/` |
| R5 · Prototype chạy được | 8 | `codebase/` + demo |
| R6 · Validation với user | 8 | `validation/` |
| R7 · Quy trình & repo | 3 | cấu trúc repo |

## Slide 4 — Điều kiện chấm: R1 · Bằng chứng & impact

R1 cần đạt các tiêu chí cụ thể về bằng chứng thu thập được từ khảo sát và phương pháp đo lường tác động, với nhiều mức điểm dựa vào chất lượng từng chứng cứ.

| Điều kiện | Điểm |
|---|---|
| Evidence đạt chuẩn **A** hoặc **B** | 6 |
| Pain cụ thể | 3 |
| Bảng impact ≥3 ứng viên có con số | 3 |
| Ứng viên bị loại giữ lại + lý do chọn | 3 |

## Slide 5 — Điều kiện chấm: R2 · Lát cắt & thiết kế

R2 chấm dựa vào độ chính xác của lát cắt, sự tuân thủ nguyên tắc thiết kế và khả năng tự động hóa.

| Điều kiện | Điểm |
|---|---|
| Lát cắt đúng format | 3 |
| ≥3 non-goals | 2 |
| Automation chọn rõ + lý do | 4 |
| ≥4 nguyên tắc HAX/PAIR được xác định | 6 |

## Slide 6 — Điều kiện chấm: R3 · Chỗ khó & kịch bản

R3 yêu cầu liệt kê và cụ thể hóa chỗ khó theo taxonomy, cùng với kịch bản ứng dụng.

| Điều kiện | Điểm |
|---|---|
| 4 lớp chỗ khó | 4 |
| ≥8 kịch bản hành vi | 4 |
| 4 đường đi trải nghiệm | 3 |

## Slide 7 — Điều kiện chấm: R4 · Kiểm thử

R4 cần thiết lập một golden set và định nghĩa các chiều chất lượng một cách cụ thể.

| Điều kiện | Điểm |
|---|---|
| Golden set tự xây | 4 |
| Định nghĩa chất lượng kiểm chứng được | 4 |
| Quality bar bằng con số | 3 |
| Kết quả chạy trọn bộ | 4 |

## Slide 8 — Điều kiện chấm: R5 · Prototype

R5 đánh giá dựa trên việc hoạt động của prototype và các lệnh gọi AI.

| Điều kiện | Điểm |
|---|---|
| Chạy end-to-end | 3 |
| ≥1 lời gọi AI thật | 3 |
| Mức prototype khai báo khớp thực tế | 2 |

## Slide 9 — Điều kiện chấm: R6 · Validation với user

R6 yêu cầu phải có phản hồi từ người dùng và ghi nhận các thay đổi từ feedback.

| Điều kiện | Điểm |
|---|---|
| Feedback log ≥5 mẩu | 4 |
| Thay đổi từ feedback | 4 |

## Slide 10 — Điều kiện chấm: R7 · Quy trình & repo

R7 đánh giá cấu trúc và quy trình làm việc của repo.

| Điều kiện | Điểm |
|---|---|
| Repo đủ cấu trúc chuẩn | 2 |
| README phân công tên người | 1 |

## Slide 11 — Reflection cá nhân

Mỗi thành viên phải giải thích rõ ràng vai trò của mình và phần việc mà mình đảm nhiệm trong dự án.

## Slide 12 — Phần 3: Checklist xác minh 6 mốc

Mỗi nhóm cần thực hiện kiểm tra nhịp và xác minh các checkpoint để nhận điểm cho phần nộp, điều này cũng giúp tránh tình trạng kẹt kỹ thuật.

| Mốc | K3 | K4 | Nhóm cần show | TA tích Có/Không |
|---|---|---|---|---|
| **CP1 · Canvas** | 10:00 N1 | 15:00 N1 | Canvas 7 dòng | ☐ |
| **CP2 · Bấm được** | 12:00 N1 | 17:00 N1 | Prototype Sketch/Mock | ☐ |
| **CP3 · AI thật + đo lượt đầu** | 16:00 N1 | 10:30 N2 | Lời gọi AI thật | ☐ |
| **CP4 · Chốt tiến độ** | 17:30 N1 | 12:00 N2 | Spec gần cuối | ☐ |
| **CP5 · Xác minh + validation + dry run** | 09:00 N2 | 14:00 N2 | Feedback log ≥5 | ☐ |
| **CP6 · Demo** | 10:00 N2 | 15:00 N2 | 5' trình bày | — |

## Khái niệm chính

- [[rubric]]: Bộ tiêu chí và điểm số dùng để đánh giá dự án.
- [[artifact]]: Tài liệu hoặc sản phẩm phần mềm được tạo ra trong tiến trình làm việc.
- [[checkpoint]]: Điểm mốc trong quá trình thực hiện dự án cần nộp để đánh giá.
- [[prototype]]: Mẫu thử nghiệm của sản phẩm được phát triển để kiểm tra ý tưởng và chức năng.
- [[validation]]: Quá trình xác minh sản phẩm từ phản hồi của người dùng để cải thiện chất lượng.
```
