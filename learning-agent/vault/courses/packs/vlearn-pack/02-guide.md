---
course: packs
generated: '2026-07-30T10:12:18+00:00'
lang: vi
lesson: 02-guide
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/02-guide.md
source_hash: sha256:22b6c6a62a7918e902299e0b24309ffd397c3127e8009ed84cf41f0777d0860e
type: lesson-note
---

## Slide 1 — Hướng dẫn tổng quan

Cách dùng: Một file duy nhất, đọc theo thứ tự giai đoạn. Mỗi giai đoạn mở đầu bằng các câu hỏi nhóm phải tự suy luận và trả lời — đó là phần quan trọng nhất; scaffold chỉ là phần nhẹ để chốt lại. Các worksheet và bảng mẫu chỉ để chốt lại kết quả — phần quan trọng là nhóm tự trả lời được các câu hỏi. 

| Giai đoạn | Mốc tương ứng | Mục |
|---|---|---|
| 1 · Khám phá | Phát đề → CP1 Canvas | §1 |
| 2 · Thiết kế & Spec | CP1 → CP4 + spec.md 23:59 N1 | §2 |
| 3 · Build | CP2 → CP3 | §3 |
| 4 · Đo & Validate | CP3 → CP5 | §4 |
| 5 · Demo & Nộp | CP5 → CP6 | §5 |

---

## Slide 2 — KHÁM PHÁ *(phát đề → CP1, ~1 giờ)*

### 2.1 Năm câu hỏi phải tự trả lời — theo đúng thứ tự

1. **Ai** là người trực tiếp làm việc này? Một vai cụ thể (học viên đang-trong-buổi-học, học viên ôn trước quiz, học viên nghỉ buổi, học viên hỏi bài trên Discord, giảng viên soạn quiz).
2. Họ đang cố **hoàn thành việc gì**? Viết thành một câu `verb + object + bối cảnh`, không có tên sản phẩm/AI trong câu.
3. Hôm nay họ đang giải quyết bằng gì? **Nó fail ở đâu, và vì sao họ chưa bỏ nó?**
4. **Bằng chứng nào** cho thấy họ đau thật? Cảm nhận cá nhân chưa phải là bằng chứng.
5. Nhóm thấy **≥3 hướng khả dĩ** — vì sao chọn hướng này?

### 2.2 Cách làm nhanh JTBD *(15-20')*

- Chọn job executor → viết job statement → liệt kê alternatives và chỗ fail.
- Nghĩ thêm 2-3 **job story**: `When [tình huống], I want to [động lực], so I can [kết quả]`.
- Tra [[Strategyn Playbook]] đúng 2 thứ: cách viết job statement và job map 8 bước.

### 2.3 Cách mining data & thu bằng chứng

1. **Đọc 30-50 mẫu trước, đếm sau** — xác định loại pattern tồn tại.
2. **Đếm được mới là bằng chứng**.
3. **Ghi phương pháp đếm**.
4. Khảo sát/phỏng vấn: hỏi về **lần gần nhất** — tránh hỏi ý kiến kiểu "bạn có cần tính năng X không?".

### 2.4 Chọn bài toán bằng bảng impact *(scaffold nhẹ)*

Với ≥3 ứng viên, mỗi cái một dòng: `ứng viên | bao nhiêu người gặp | tần suất | mỗi lần tốn gì | build nổi không | chọn?`.

### 2.5 Gặp TA ở CP1 cần show *(scaffold Canvas — 7 dòng)*

- Hướng (A/B/C) · job executor · pain một câu · 1-2 bằng chứng đầu tiên · **lát cắt MỘT CÂU** · automation dự kiến + 1 dòng lý do · ≥3 willing users dự kiến · phân công có tên.
  
---

## Slide 3 — THIẾT KẾ & SPEC *(CP1 → CP4 · spec.md chốt 23:59 N1)*

### 3.1 Các câu hỏi phải tự trả lời

1. Người khác đã giải bài này thế nào?
2. AI nên **tự làm đến đâu** — và nếu sai thì ai chịu gì?
3. Sản phẩm sẽ **hành xử thế nào khi sai / khi không chắc**?
4. **"Tốt" nghĩa là gì, đo bằng gì** — và bar của nhóm là bao nhiêu %?

### 3.2 Nghiên cứu giải pháp tương tự *(express — chia người, 15'/người)*

Mỗi thành viên dùng thử 1 sản phẩm gần giống và trả lời đúng 4 câu: họ giải job này bằng flow nào? Một điều đáng học? Một điều đáng né? Mình sẽ khác gì ở lát cắt này?

### 3.3 Chọn mức automation theo cost-of-error

| Mức | Khi nào đúng | Ví dụ trong khoá |
|---|---|---|
| **Augment** | Sai thì đắt | Quiz AI sinh, giảng viên duyệt từng câu |
| **Conditional** | Đa số case lành, số ít hiểm | Trợ lý trả lời khi có căn cứ trong tài liệu |
| **Automate** | Sai thì rẻ | Sinh chapter/timestamp cho video |

### 3.4 Nguyên tắc HAX/PAIR — chọn ≥4

**Nhóm khởi đầu (chọn ≥1):**
- **G1** — Làm rõ hệ thống làm được gì.
- **G2** — Làm rõ nó làm tốt đến đâu.

**Khi không chắc / khi sai (G10 bắt buộc + ≥1 trong G8/G9/G11):**
- **G10** — Thu hẹp phạm vi khi nghi ngờ.
- **G8** — Gạt bỏ dễ dàng.
- **G9** — Sửa dễ dàng.
- **G11** — Giải thích vì sao.

**Nhóm nâng cao (tự chọn nếu hợp)**: G5, G12, G13/G14, G15, G17.

### 3.5 Bốn lớp chỗ khó + kịch bản rủi ro *(≥8 kịch bản — TA soát tại CP4)*

Tự cụ thể hoá 4 lớp cho lát cắt của mình bằng 4 câu hỏi:
- Nguồn sự thật.
- Mơ hồ / thiếu thông tin.
- Ngoài phạm vi / thẩm quyền.
- Đặc thù domain.

Chạy [[HAX Playbook]] → chốt ≥8 kịch bản.

---

## Slide 4 — BUILD *(CP2 → CP3)*

### 4.1 Câu hỏi định hướng + nguyên tắc xương sống

*"Demo 5 phút thì bấm vào đâu, gõ gì, ra gì?"* — build đúng đường đó trước.

### 4.2 Ba mức prototype — chọn theo sức nhóm

| Mức | Là gì | Đủ để |
|---|---|---|
| Sketch | Màn hình dựng nhanh + 1 AI call chạy demo được | Chứng minh concept + hành vi khi sai |
| Mock | Flow bấm được, data giả, AI thật ở lõi | Demo trọn 4 đường đi trải nghiệm |
| Working | Chạy end-to-end với data pack thật | Đưa cho user thật dùng thử |

### 4.3 Multi-prototype *(khuyến khích)*

Dựng nhanh **≥2 phương án khác nhau** — chọn theo trục thiết kế chính.

### 4.4 Tool menu + luật an toàn

- **Builder:** v0.dev, Lovable/Bolt.new, Figma Make, Claude Code/Cursor.
- **AI call:** Google AI Studio.
- **Luật an toàn:** Không commit API key/.env và dữ liệu thật.

### 4.5 Phân công song song *(nhóm 4-5 người)*

1 người evidence, 1-2 người build flow, 1 người prompt + golden set, 1 người spec + chuẩn bị validation.

---

## Slide 5 — ĐO & VALIDATE *(CP3 → CP5)*

### 5.1 Đo bằng máy — chạy golden set

Chạy trọn bộ → bảng % → chọn MỘT failure đau nhất → sửa.

### 5.2 Đo bằng người — vòng validation *(CP5, trước dry run)*

Gặp ≥5 người ngoài nhóm. Ghi log nguyên văn và tự soát phản hồi.

### 5.3 Gặp TA ở CP5 cần show

Feedback log ≥5 mẩu, changelog có thay đổi từ feedback, slide final + demo script.

---

## Slide 6 — DEMO & NỘP *(CP5 → CP6)*

### 6.1 Slide 6 trang — luật "không có bằng chứng thì không có slide"

1. **User & Job** — job executor + core JTBD.
2. **Vì sao chọn tính năng này** — bảng impact.
3. **Giải pháp & demo live** — demo trực tiếp.
4. **Kết quả đo** — % qua golden set.
5. **User thật nói gì** — ≥2 quote nguyên văn.
6. **Nếu có thêm 1 tuần** — 2-3 việc ưu tiên.

### 6.2 Checklist nộp cuối *(trước CP6)*

- Repo đủ: README, spec.md, demo-slides.pdf, codebase/, eval/, validation/, reflection/. 
- Backup demo. 
- Cả nhóm trả lời được câu hỏi quan trọng.

---

## Khái niệm chính

- [[khám-phá]]: Giai đoạn tìm hiểu và phân tích nhu cầu của người dùng.
- [[thiết-kế]]: Giai đoạn lập kế hoạch, thiết kế sản phẩm và các đặc tính của nó.
- [[build]]: Giai đoạn xây dựng và phát triển sản phẩm.
- [[đo-validate]]: Giai đoạn kiểm tra và xác thực hiệu suất của sản phẩm.
- [[demo-nop]]: Giai đoạn trình diễn sản phẩm và thực hiện nộp. 
- [[job-to-be-done]]: Phương pháp nghiên cứu nhu cầu người dùng dựa trên công việc mà họ muốn hoàn thành. 
- [[impact]]: Phân tích ảnh hưởng của các giải pháp và lựa chọn trong thiết kế. 
- [[golden-set]]: Tập hợp các trường hợp kiểm tra tiêu chuẩn để đánh giá chất lượng sản phẩm. 
- [[spec]]: Tài liệu yêu cầu kỹ thuật mô tả tính năng và hành vi của sản phẩm.
