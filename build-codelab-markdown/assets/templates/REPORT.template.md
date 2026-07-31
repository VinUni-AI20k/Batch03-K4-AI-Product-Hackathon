<!--
TEMPLATE — report/TEMPLATE_REPORT.md
Xoá mọi comment HTML trước khi giao. Giữ ô trống cho learner tự điền.

Luật gốc: mỗi ô trong report phải trỏ về một file bằng chứng trong repo.
Report không có evidence file là report tự khai — không chấm được.

PHẦN A ngắn, hạn sớm, để nhóm khác hiểu nhanh khi demo.
PHẦN B đầy đủ, hạn sau, dựa trên log thật.
Lab nhỏ thì bỏ PHẦN A. Lab có demo/chấm chéo thì giữ cả hai.
-->
# <Tên lab> — Báo cáo nhóm

- **Nhóm:**
- **Thành viên (mã HV + tên):**
- **Provider / model:**
- **Ngày:**

---

# PHẦN A — Giới thiệu (hạn: <thời điểm>)

## A1. Hệ thống này làm được gì

> 1–2 câu. Người ngoài nhóm đọc là hiểu ngay.

## A2. Thành phần đã xây

| Thành phần | Làm được gì | File bằng chứng | Ai làm (Role) |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |

## A3. Câu hỏi mẫu để nhóm khác tự thử

> 3–5 câu, phủ được cả case đơn giản và case bẫy.

1.
2.
3.

## A4. Link chạy thử

> Public URL nếu có; localhost cũng được nếu demo trên máy trình chiếu.

---

# PHẦN B — Bằng chứng (hạn: <thời điểm>)

<!-- Điều kiện metric hợp lệ — sửa theo lab. Không có điều kiện này thì số nào cũng "đẹp". -->
> **Điều kiện để số liệu được tính:** số case đã đo phải bằng tổng số case; `provider_error` phải bằng 0;
> mọi case có tool error phải được review thủ công vì routing PASS không chứng minh tool chạy đúng.

## B1. Kết quả theo version

> Điền từ `<artifacts/version_log.csv>` và `<runs/*.json>`. Không có log → không điền.

| Version | Đổi gì (prompt/tool) | Giả thuyết | Metric | Trước | Sau | File log |
|---|---|---|---|---:|---:|---|
| v0 | baseline | — |  |  |  |  |
| v1 |  |  |  |  |  |  |
| v2 |  |  |  |  |  |  |

## B2. Phân tích lỗi (RCA)

> Lấy từ failure thật, không phải failure tưởng tượng. Mỗi case một dòng.

| Case ID | Loại lỗi | Hệ thống đã làm gì | Nguyên nhân gốc | Đã sửa thế nào | File bằng chứng |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

<!-- Ít nhất 1 case phải phân tích sâu ở dạng prose bên dưới -->

### Case study: <tên case>

- **Input:**
- **Hệ thống đã làm:**
- **Nguyên nhân gốc:**
- **Sửa ở đâu (file + dòng):**
- **Sau khi sửa:**

## B3. Bộ test case của nhóm

> <Số> case nhóm tự thiết kế, trong `<path>`. Ghi rõ case nào là bẫy.

| Case ID | Kiểm gì | Hành vi kỳ vọng | Kết quả thật |
|---|---|---|---|
|  |  |  |  |

## B4. Trace / log thực tế

> Dán trace thật, không dán trace mẫu trong hướng dẫn.

| Case | Version | Các bước đã chạy | File transcript | Kết luận |
|---|---|---|---|---|
|  |  |  |  |  |

## B5. So sánh với baseline

| Case | Baseline | Sau cải tiến | Thắng | Vì sao |
|---|---|---|---|---|
|  |  |  |  |  |

## B6. Rủi ro và guardrail

| Rủi ro | Biểu hiện | Guardrail đã cài | File |
|---|---|---|---|
|  |  |  |  |

## B7. Reflection nhóm

- Sửa nào thuộc về prompt, sửa nào thuộc về tool/code?
- Failure nào phải review thủ công vì chấm tự động không phát hiện được?
- Số nào **không** đạt mục tiêu nhóm tự đặt? <!-- Ghi trung thực. Số bị chỉnh sửa thì không tính điểm. -->
- Làm lại thì đổi gì trước tiên?

---

<!-- Reflection cá nhân tách file riêng, mỗi người một file, chấm riêng -->
# Reflection cá nhân — <tên>, Role <n>

- **Tôi sở hữu file nào, đã làm gì trong đó:**
- **AI hỗ trợ tôi phần nào, sai hoặc hời hợt ở đâu, tôi sửa gì bằng nhận định của mình:**
- **Phần có tên tôi mà tôi giải thích được ngay nếu bị hỏi:** <!-- Không giải thích được thì phần đó không tính điểm -->
- **Học được gì, làm lại sẽ đổi gì:**
