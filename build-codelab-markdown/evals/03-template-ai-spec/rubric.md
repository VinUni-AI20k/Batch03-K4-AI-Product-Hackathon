# Rubric audit — Mini Hackathon AI Batch 03

Đây là rubric chuẩn của chương trình, không phải một thang điểm mới. Nguồn
authoritative là `04-rubric.md` ở repository root.

## Phân bổ điểm

| Phần | Điểm | Artifact/chứng cứ chương trình yêu cầu |
|---|---:|---|
| CP1–CP5 nộp đúng hạn | 25 | Canvas, prototype, AI call + lượt đo đầu, spec chốt, validation + dry run; mỗi checkpoint 5 điểm |
| R1 — Bằng chứng & impact | 15 | `spec.md` §1–§2 + log khảo sát/mining |
| R2 — Lát cắt & thiết kế | 15 | `spec.md` §4 |
| R3 — Chỗ khó & kịch bản | 11 | `spec.md` §5–§6 |
| R4 — Kiểm thử | 15 | `spec.md` §7 + `eval/` |
| R5 — Prototype chạy được | 8 | `codebase/` + demo |
| R6 — Validation với user | 8 | `validation/` |
| R7 — Quy trình & repo | 3 | Cấu trúc repo + README phân công có tên |
| **Tổng** | **100** | Chưa gồm điểm reflection cá nhân và thể lệ demo/chấm chéo |

Chi tiết sub-criteria phải giữ nguyên theo `04-rubric.md`:

- **R1:** Evidence chuẩn A/B (6), pain cụ thể (3), impact ≥3 ứng viên có số
  liệu (3), ứng viên bị loại và lý do bằng số (3).
- **R2:** Lát cắt MỘT CÂU (3), ≥3 non-goals (2), automation + cost-of-error
  (4), ≥4 HAX/PAIR có vị trí áp dụng cụ thể (6).
- **R3:** 4 lớp taxonomy cụ thể (4), ≥8 kịch bản phủ đủ lớp (4), happy /
  low-confidence / failure / correction (3).
- **R4:** Golden set ≥20 case đúng cơ cấu và ≥10 case từ chatlog (4), chiều
  chất lượng kiểm chứng được bởi người ngoài nhóm (4), quality bar bằng số
  chốt trước deadline (3), bảng chạy đủ case kể cả fail + RCA (4).
- **R5:** End-to-end không can thiệp tay (3), ≥1 AI call thật có trace (3),
  mức prototype khai báo khớp thực tế (2).
- **R6:** ≥5 feedback từ ≥5 người ngoài nhóm, quote + tên/vai + willing user
  (4), có thay đổi hoặc lý do giữ nguyên trong changelog (4).
- **R7:** Repo đúng cấu trúc (2), README phân công có tên (1).

## Giới hạn thực thi của benchmark này

Benchmark này đánh giá **guide do skill sinh ra**, không giả mạo một learner
submission đã hoàn tất. Vì tính chất repo-level, việc chạy trọn bộ 20
testcase trên nhiều repo cần clone, setup, chạy, đọc output và lưu artifact
cho từng repo. Không đủ thời gian để thực hiện phần đó trong timebox 1,5 ngày;
do đó R4 golden set 20 case được ghi là:

> **Not executed — scope limitation:** chưa chạy trọn bộ 20 testcase; không
> được tính là đạt quality bar và không được báo cáo phần trăm kết quả giả.

Các kết quả đã chạy chỉ gồm source-contract checks và Day 3 mock smoke run.
Chúng chứng minh benchmark không bịa runtime, nhưng không thay thế golden set,
validation với user hoặc demo thật.

## Điều kiện fail trực tiếp

- Dùng một keyword như bằng chứng đã đạt một sub-criterion.
- Ghi “đạt quality bar” khi chưa có bảng chạy đủ 20 case.
- Ghi số liệu khảo sát, quote, feedback hoặc API output không có log nguồn.
- Gọi smoke run là automated test khi không có test runner/assertion.
- Gọi file mới là file đã có, hoặc bỏ nhãn `FILE MỚI`/`KHÔNG COMMIT`.

## Cách đọc kết quả

`evaluate_output.py` chỉ là lớp semantic/grounding gate cho codelab. Điểm R1–R7
chỉ được chấm sau khi learner nộp artifact thật theo rubric ở trên. Kết quả
`PASS` của benchmark không đồng nghĩa đạt 100 điểm chương trình.
