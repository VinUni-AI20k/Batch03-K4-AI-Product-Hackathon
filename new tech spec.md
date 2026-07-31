# Trợ lý tổng hợp thông tin tuyển sinh — AI Thực Chiến

Chatbot/agent trả lời câu hỏi của người đang tìm hiểu chương trình, dựa trên **hai luồng thông tin tách biệt rõ ràng về độ tin cậy** — không trộn lẫn "chính thức" với "cộng đồng".

> Đổi scope so với bản trước: **bỏ RAG cho phần Facebook.** RAG chỉ áp dụng cho sổ tay chính thức. Phần Facebook chuyển thành agent tìm-kiếm-và-tổng-hợp theo thời gian thực, kèm nguồn + disclaimer, không lưu trữ/đánh index trước.

---

## 1. Vì sao tách hai luồng — đây là quyết định thiết kế trung tâm

| | Luồng 1 — RAG sổ tay | Luồng 2 — Agent tìm Facebook |
|---|---|---|
| Nguồn | Sổ tay/tài liệu chính thức của chương trình | Bài post/comment công khai trên Facebook (fanpage + group) |
| Độ tin cậy | Cao — coi là nguồn sự thật | Không xác thực — cộng đồng tự chia sẻ |
| Cách lấy | Index trước (chunk → embed → Qdrant), retrieve khi hỏi | **Search on-demand mỗi lần có câu hỏi**, không cào/lưu hàng loạt trước |
| Automation | Conditional/Automate — hệ thống tự tin trả lời thẳng | **Augment** — hệ thống chỉ gom và trình bày, người dùng tự đánh giá |
| Output | Câu trả lời + trích dẫn mục/trang trong sổ tay | Đoạn tổng hợp + **link bài viết gốc** + **disclaimer cố định** |

Đây chính là cách xử lý cost-of-error đúng bài (§4 template spec): thông tin càng khó kiểm chứng, mức độ tự động hoá càng giảm — không cố "AI hoá" phần Facebook thành câu trả lời chắc nịch, mà hạ xuống đúng vai trò của nó: **gom hộ, không quyết hộ.**

Cách tiếp cận "search on-demand, không cào-lưu-trước" này cũng nhẹ rủi ro hơn hẳn phương án cào toàn bộ group đã bàn trước đó — không giữ kho dữ liệu cá nhân của người khác trong repo, chỉ truy vấn và trả về ngay trong phiên hỏi-đáp.

---

## 2. Kiến trúc

```
                        Câu hỏi người dùng
                               │
                       [Router / Intent check]
                               │
        ┌──────────────────────┼───────────────────────┐
        ▼                      ▼                        ▼
  Ngoài thẩm quyền      Có thể trả lời từ           Cần thông tin
   (③ — VD: "em có       sổ tay chính thức          cộng đồng/review
    đậu không")                │                    (④ — không có
        │                      ▼                     trong sổ tay)
        ▼               [Luồng 1: RAG]                    │
   Từ chối cố định       retrieve → generate              ▼
   + hướng dẫn kênh      có trích dẫn trang           [Luồng 2: Agent search]
   chính thức                  │                      search Facebook realtime
        │                      │                      → LLM tổng hợp + gắn nguồn
        │                      │                             │
        │                      ▼                             ▼
        │              Dưới ngưỡng tin cậy?           Luôn kèm:
        │              (① — không tìm thấy             - danh sách link bài gốc
        │               trong sổ tay)                  - disclaimer cố định
        │                      │                        - ngày đăng từng bài
        │                      ▼                             │
        │              → chuyển sang Luồng 2               │
        │              hoặc nói "chưa có trong             │
        │              sổ tay, đây là thông tin            │
        │              cộng đồng tìm được:"                │
        └──────────────────────┴───────────────────────────┘
                               │
                    Trả lời cho người dùng
```

---

## 3. Luồng 1 — RAG trên sổ tay chính thức

Pipeline chuẩn, không có gì đặc biệt so với RAG thông thường:

1. **Parse** sổ tay (pdf/docx) → giữ số trang/mục để trích dẫn kiểu `[trang N]` — giống cách AI tutor VLearn đã làm, tận dụng luôn pattern quen thuộc của chương trình.
2. **Chunk** theo mục/heading tự nhiên của sổ tay (không cắt cơ học theo ký tự).
3. **Embed** → **Qdrant**, 1 collection: `handbook_official`.
4. **Retrieve** top-k + ngưỡng similarity — dưới ngưỡng → coi như miss, chuyển sang kiểm tra Luồng 2.
5. **Generate** câu trả lời, bắt buộc kèm trích dẫn `[trang N]`/mục.

Vì đây là RAG trên tài liệu đã chính thức xác thực, độ khó chính không nằm ở "nguồn có đáng tin không" mà ở **retrieval đúng đoạn** và **không suy diễn ngoài những gì sổ tay ghi** — vẫn là lớp ① nhưng dạng nhẹ hơn hẳn so với RAG trên nguồn hỗn tạp.

---

## 4. Luồng 2 — Agent tìm kiếm Facebook, tổng hợp có nguồn

Kích hoạt khi: câu hỏi miss ở Luồng 1, **hoặc** câu hỏi có bản chất "kinh nghiệm/review/dư luận" mà sổ tay vốn không bao giờ có (VD: "học ở đây thực tế thế nào", "mọi người review sao").

### Các bước

1. **Search** — agent dùng tool tìm kiếm trên Facebook (qua search công khai, không đăng nhập cào hàng loạt) theo từ khoá suy ra từ câu hỏi.
2. **Tổng hợp** — LLM đọc kết quả tìm được, viết đoạn tóm tắt. Ràng buộc bắt buộc trong prompt:
   - Không chọn 1 ý kiến làm đại diện cho "đa số" nếu không đếm được — chỉ nói "một số bài viết đề cập...", tránh khái quát hoá.
   - Nếu các bài mâu thuẫn nhau → liệt kê cả hai chiều, không tự chọn bên đúng.
   - Giữ ngày đăng của từng bài — bài càng cũ càng cần cảnh báo có thể lỗi thời (lớp ④).
3. **Output cố định kèm mọi câu trả lời của Luồng 2:**

```
[đoạn tổng hợp]

Nguồn tham khảo:
- [tiêu đề/trích ngắn] — [link] — [ngày đăng]
- ...

⚠️ Đây là thông tin tổng hợp từ cộng đồng trên Facebook, CHƯA được chương trình xác nhận
chính thức. Vui lòng đối chiếu với sổ tay/kênh chính thức trước khi quyết định.
```

Disclaimer này **không phải là lời tự vệ pháp lý cho vui** — nó là guardrail thật, đúng chức năng lớp ①: hệ thống không giả vờ chắc chắn về thứ mình không thể xác thực, và chuyển quyền quyết định cuối về người dùng một cách tường minh.

---

## 5. Bốn lớp chỗ khó áp cho kiến trúc mới

| Lớp | Áp dụng thế nào trong kiến trúc 2-luồng này |
|---|---|
| ① Nguồn sự thật | Ranh giới rõ giữa 2 luồng trong output — Luồng 1 nói chắc + trích trang, Luồng 2 luôn kèm disclaimer, không bao giờ hệ thống được lẫn lộn giọng điệu "chắc chắn" cho nội dung từ Luồng 2 |
| ② Mơ hồ/thiếu thông tin | Câu hỏi thiếu ngữ cảnh (track/hoàn cảnh cụ thể) → hỏi lại trước khi route sang luồng nào |
| ③ Ngoài phạm vi/thẩm quyền | Câu hỏi xin dự đoán/tư vấn cá nhân ("em có đậu không") → chặn ở Router, từ chối cố định, **không đi qua cả 2 luồng** |
| ④ Đặc thù domain | Luồng 2 gặp bài cũ/mâu thuẫn → hiển thị ngày đăng + liệt kê mâu thuẫn thay vì chọn 1; Luồng 1 nếu sổ tay có version cũ thì retrieval cần ưu tiên bản mới nhất |

---

## 6. Golden set — cần phủ cả 2 luồng

- Case Luồng 1 (RAG sổ tay): câu hỏi có đáp án rõ trong sổ tay.
- Case Luồng 2 (agent search): câu hỏi kiểu review/kinh nghiệm không có trong sổ tay.
- Case routing sai: câu hỏi tưởng cần Luồng 2 nhưng thực ra sổ tay đã có (test xem router có ưu tiên Luồng 1 trước không, tránh trả lời từ nguồn yếu hơn khi nguồn mạnh hơn đã đủ).
- Case ③: câu hỏi xin tư vấn cá nhân — test router chặn đúng trước khi vào cả 2 luồng.
- Case ④: câu hỏi có khả năng có bài Facebook mâu thuẫn nhau về cùng chủ đề.

---

## 7. Cấu trúc repo (theo chuẩn README hackathon)

```
repo/
├── README.md              ← file này
├── spec.md                ← AI Spec theo 03-template-ai-spec.md
├── demo-slides.pdf
├── codebase/
│   ├── router/             ← phân loại câu hỏi (③ / Luồng 1 / Luồng 2)
│   ├── rag_handbook/        ← pipeline Luồng 1: parse, chunk, embed, retrieve
│   └── agent_fb_search/     ← pipeline Luồng 2: search tool, tổng hợp, disclaimer
├── eval/                   ← golden set + bảng kết quả các lượt chạy
├── validation/             ← feedback log từ vòng user test
└── reflection/             ← mỗi người 1 file
```

---

## 8. Việc còn thiếu để chốt spec.md

- §1-§2: số liệu evidence — riêng cho Luồng 2, evidence nên là số câu hỏi thật KHÔNG có trong sổ tay mà người tìm hiểu vẫn hỏi (khác với evidence bản trước vốn gộp chung).
- §4: automation ghi rõ **khác nhau theo luồng** — đây là điểm mạnh nên nhấn trong bảng nguyên tắc HAX/PAIR (G2 nói rõ phạm vi từng luồng ngay từ đầu hội thoại).
- §7: quality bar nên tách riêng 2 chỉ số — độ chính xác Luồng 1 (bám sát sổ tay) và độ minh bạch Luồng 2 (có disclaimer + nguồn đầy đủ hay không), vì hai luồng có "đúng" nghĩa khác nhau.
