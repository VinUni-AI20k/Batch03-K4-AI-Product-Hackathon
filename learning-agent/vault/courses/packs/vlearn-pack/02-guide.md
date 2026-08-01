---
course: packs
generated: '2026-07-31T18:00:52+00:00'
lang: vi
lesson: 02-guide
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\02-guide.md
source_hash: sha256:b67fd578717d2665dd2923cadfae0c89563222acf7a57362d9491dc2f48f4294
type: lesson-note
---

```markdown
## Slide 1 — Hướng dẫn tổng quan

> **Hướng dẫn**: Một file duy nhất, đọc theo từng giai đoạn. Mỗi giai đoạn bắt đầu bằng các câu hỏi nhóm cần tự suy luận và trả lời, phần này quan trọng nhất; các scaffold chỉ là phần chốt lại. Bảng mẫu chỉ sử dụng để chốt kết quả — phần quan trọng là nhóm tự trả lời được các câu hỏi.

| Giai đoạn | Mốc tương ứng | Mục |
|---|---|---|
| 1 · Khám phá | Phát đề → CP1 Canvas | §1 |
| 2 · Thiết kế & Spec | CP1 → CP4 + spec.md 23:59 N1 | §2 |
| 3 · Build | CP2 → CP3 | §3 |
| 4 · Đo & Validate | CP3 → CP5 | §4 |
| 5 · Demo & Nộp | CP5 → CP6 | §5 |

---

## Slide 2 — KHÁM PHÁ *(phát đề → CP1, ~1 giờ)*

### 2.1 Năm câu hỏi cần tự trả lời

1. **Ai** là người trực tiếp làm việc này? Một vai cụ thể, không phải "học viên nói chung".
2. Họ đang cố **hoàn thành việc gì**? Viết thành một câu không có tên sản phẩm/AI. 
3. Hôm nay họ đang giải quyết bằng gì? **Nó fail ở đâu, và vì sao họ chưa bỏ nó?**
4. **Bằng chứng nào** cho thấy họ đau thật? 
5. Nhóm thấy **≥3 hướng khả dĩ** — lý do chọn hướng này là gì?

### 2.2 Cách làm nhanh [[JTBD]] *(15-20')*

- Chọn job executor (câu 1) → viết job statement (câu 2) → liệt kê alternatives và chỗ fail (câu 3).
- Nghĩ thêm 2-3 **job story**.
- Tra [[Strategyn Playbook]] để biết cách viết job statement và job map 8 bước.

### 2.3 Cách mining data & thu bằng chứng

1. **Đọc 30-50 mẫu trước, đếm sau** — xác định loại pattern tồn tại.
2. **Đếm được mới là bằng chứng**.
3. **Ghi phương pháp đếm** — để người khác kiểm tra lại.
4. Khảo sát/phỏng vấn: hỏi về **lần gần nhất**.

### 2.4 Chọn bài toán bằng bảng impact

Với ≥3 ứng viên, ghi rõ các tiêu chí để chọn hướng mạnh hơn.

### 2.5 Gặp TA ở CP1 cần show 

Hướng (A/B/C) · job executor · pain một câu · 1-2 bằng chứng đầu tiên · **lát cắt MỘT CÂU** · automation dự kiến + 1 dòng lý do · ≥3 willing users dự kiến.

---

## Slide 3 — THIẾT KẾ & SPEC *(CP1 → CP4 · spec.md chốt 23:59 N1)*

### 3.1 Các câu hỏi phải tự trả lời

1. Người khác đã giải bài này thế nào?
2. AI nên **tự làm đến đâu**?
3. Sản phẩm sẽ **hành xử thế nào khi sai**?
4. **"Tốt" nghĩa là gì, đo bằng gì?**

### 3.2 Nghiên cứu giải pháp tương tự

Mỗi thành viên dùng thử một sản phẩm gần giống và trả lời 4 câu hỏi cụ thể.

### 3.3 Chọn mức automation theo cost-of-error

Triển khai 3 mức độ automation tùy thuộc vào mỗi quyết định.

### 3.4 Nguyên tắc HAX/PAIR

Chọn ≥4 nguyên tắc, khai trong spec với vị trí áp dụng cụ thể.

### 3.5 Bốn lớp chỗ khó + kịch bản rủi ro

Cụ thể hóa từng lớp bằng câu hỏi chi tiết và chốt ≥8 kịch bản.

### 3.6 Định nghĩa "tốt" + golden set + quality bar

Đưa ra các điều kiện cụ thể cho từng chiều chất lượng.

### 3.7 Trước CP4 tự soát

Kiểm tra spec theo template và chuẩn bị tài liệu cần thiết.

---

## Slide 4 — BUILD *(CP2 → CP3)*

### 4.1 Câu hỏi định hướng + nguyên tắc xương sống 

Xác định flow chính trước, xây dựng các yếu tố khác sau. 

### 4.2 Ba mức prototype

Triển khai theo từng mức độ khác nhau (Sketch, Mock, Working).

### 4.3 Multi-prototype

Khuyến khích xây dựng ≥2 phương án khác nhau.

### 4.4 Tool menu + luật an toàn

Hướng dẫn sử dụng các công cụ và quy định an toàn.

### 4.5 Phân công song song

Phân chia công việc cho nhóm một cách hiệu quả.

---

## Slide 5 — ĐO & VALIDATE *(CP3 → CP5)*

### 5.1 Đo bằng máy

Chạy golden set và ghi nhận kết quả.

### 5.2 Đo bằng người 

Thực hiện vòng validation với người thử bên ngoài.

### 5.3 Gặp TA ở CP5 cần show 

Chuẩn bị feedback log và changelog để trình bày.

---

## Slide 6 — DEMO & NỘP *(CP5 → CP6)*

### 6.1 Slide 6 trang — luật "không có bằng chứng thì không có slide"

Mỗi slide cần có bằng chứng cụ thể.

### 6.2 Checklist nộp cuối

Kiểm tra đầy đủ các tài liệu cần thiết trước khi nộp.
   
## Khái niệm chính

- [[JTBD]]: (Jobs To Be Done) là phương pháp để xác định nhu cầu và mục tiêu của người sử dụng.
- [[Strategyn Playbook]]: Tài liệu hướng dẫn cách viết các tuyên bố công việc và các bước trong quy trình JTBD.
- [[HAX/PAIR]]: Các nguyên tắc lập trình và thiết kế AI nhằm tạo ra trải nghiệm người dùng đáng tin cậy và hiệu quả.
```
