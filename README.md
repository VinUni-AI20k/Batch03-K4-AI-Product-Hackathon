# Discord Knowledge Finder - Nhóm Gehihi36

Prototype AI hỗ trợ học viên khóa AI Thực Chiến tìm lại thông tin, tài nguyên, hướng dẫn và kinh nghiệm đã được đăng trên Discord trong các nguồn được whitelist.

## Đề Tài

- Track: Hướng B - Trợ lý Học viên Discord.
- Tên lát cắt: Discord Knowledge Finder.
- Actor: Học viên trong khóa học đang cần tìm lại một thông tin, tài nguyên, hướng dẫn hoặc kinh nghiệm từng được đăng trên Discord.
- Problem: Học viên phải đoán keyword, đoán channel và mở nhiều post/thread thủ công; cách diễn đạt trong trí nhớ của học viên thường khác với tiêu đề/nội dung thật trên Discord.
- AI decision trung tâm: `answer / clarify / abstain`.
- Mức automation: Conditional - AI trả lời khi đủ căn cứ, hỏi lại khi mơ hồ, từ chối generate khi không đủ nguồn.

## Thành Viên Và Phân Công

| Thành viên | Mã HV | Vai trò chính | Đầu ra chịu trách nhiệm |
|---|---|---|---|
| Nguyễn Tuấn Đức | 2A202601380 | Nhóm trưởng, Product Architect, AI Engine | `spec.md`, kiến trúc sản phẩm, luồng quyết định AI, tích hợp engine |
| Nguyễn Việt Phong | 2A202601975 | Prompt, Guardrail | prompt intent/decision/answer, policy answer-clarify-abstain, risk scenarios |
| Lê Trọng Việt Dũng | 2A202601746 | Tools, Data Pipeline | snapshot Discord, ingest, keyword/semantic retrieval, citation/link resolver |
| Ngô Quang Anh | 2A202601106 | Testcase, Evaluation | golden set, eval rubric, kết quả chạy, phân tích failure |

Chi tiết việc cần làm theo từng người nằm trong [PHAN_CONG.md](D:/codein/misp@ce/aiaction/Batch03-K4-Gehihi36/PHAN_CONG.md).

## Cấu Trúc Repo Nộp Bài

```text
repo/
├── README.md
├── spec.md
├── PHAN_CONG.md
├── demo-slides-outline.md
├── evidence/
│   ├── README.md
│   ├── survey_log.csv
│   └── mining_log.md
├── codebase/
│   ├── README.md
│   ├── data/
│   │   └── discord_snapshot_sample.json
│   ├── src/
│   │   └── ARCHITECTURE.md
│   └── traces/
│       └── README.md
├── eval/
│   ├── README.md
│   ├── golden_set.csv
│   ├── rubric.md
│   ├── run_01_results.csv
│   └── analysis.md
├── validation/
│   ├── README.md
│   ├── user_test_log.csv
│   ├── summary.md
│   └── changes_from_feedback.md
└── reflection/
    ├── README.md
    ├── nguyen-tuan-duc.md
    ├── nguyen-viet-phong.md
    ├── le-trong-viet-dung.md
    └── ngo-quang-anh.md
```

## Cách Chạy Prototype

Sẽ cập nhật sau khi hoàn thành `codebase/`.

Dự kiến MVP:

1. Load snapshot JSON các post/thread Discord được phép dùng.
2. Người dùng nhập câu hỏi tìm tài nguyên/hướng dẫn.
3. Retriever tìm bằng semantic + keyword trong nguồn whitelist.
4. AI engine quyết định `answer`, `clarify` hoặc `abstain`.
5. Hệ thống trả lời ngắn kèm citation đến đúng post/thread, hoặc hỏi lại/từ chối khi không đủ căn cứ.
6. Trace mỗi lượt chạy vào `codebase/traces/`.

## Phần Thật Và Phần Mock

- Thật trong MVP: snapshot whitelist, search, AI call ở quyết định trung tâm, citation, trace, golden set.
- Mock có thể chấp nhận: kết nối Discord API realtime, permission sync, UI bot Discord thật, analytics dashboard.

## Evidence

Phần evidence để trong `evidence/` và sẽ được cập nhật sau khi nhóm có khảo sát/mining Discord. Không đưa nội dung nhạy cảm hoặc Discord private không được phép vào repo public.

## Tài Liệu Gốc

- [01-de-bai.md](D:/codein/misp@ce/aiaction/Batch03-K4-Gehihi36/01-de-bai.md)
- [02-guide.md](D:/codein/misp@ce/aiaction/Batch03-K4-Gehihi36/02-guide.md)
- [03-template-ai-spec.md](D:/codein/misp@ce/aiaction/Batch03-K4-Gehihi36/03-template-ai-spec.md)
- [04-rubric.md](D:/codein/misp@ce/aiaction/Batch03-K4-Gehihi36/04-rubric.md)
