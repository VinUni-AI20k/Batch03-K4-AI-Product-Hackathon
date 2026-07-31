# Eval Run Guide

## Chuẩn bị

1. Mở `codebase/index.html` bằng trình duyệt hoặc VS Code Live Server.
2. Nhập OpenRouter API key trong panel AI Co-Pilot.
3. Nếu muốn chạy chế độ mock thì bấm `Dùng Mock`.

## Chạy test

1. Mở `eval/golden-set.md`.
2. Đi lần lượt từ G01 đến G22.
3. Với mỗi case, gửi đúng câu input trong panel AI Co-Pilot.
4. Ghi lại câu trả lời rút gọn, rồi chấm C1, C2, C3.

## Chạy script tự động

```powershell
.\scripts\run-golden-set.ps1 -DryRun        # xem ngữ cảnh nạp cho từng case, không tốn quota
.\scripts\run-golden-set.ps1                # chạy trọn bộ 22 case
```

Hoặc gọi thẳng Node: `node scripts/run-golden-set.js [--dry-run] [--limit N]`.
Cần `OPENROUTER_API_KEY` trong `.env` (xem `.env.example`).

Kết quả ghi ra `eval/results-run-YYYYMMDD-HHMMSS.md` + JSON tương ứng, kèm output đầy đủ
của từng case để soát tay.

Runner nạp knowledge base và dựng system prompt bằng đúng `codebase/prompt.js` mà app
đang dùng — sửa prompt hay ngưỡng retrieval thì phải chạy lại trọn bộ.

## Sinh lại knowledge base

```powershell
node scripts/build_knowledge_base.js
```

Đọc `data/vlearn-pack/transcript/`, sinh `codebase/knowledge_base.js` (645 đoạn có mã
`[Txx-NNN]`, đã bỏ các đoạn `[Hoạt động lớp: ...]`). **Không sửa tay file này** — mọi
mã trong đó phải mở đúng đoạn trong transcript gốc, nếu không thì chính sản phẩm đang
mắc lỗi lớp ① mà nó hứa chống.

## Cách ghi kết quả

- Dùng `eval/results-template.md` làm bản ghi run 1, run 2.
- Chỉ cần một dòng ngắn cho `Output summary`, không cần chép nguyên văn dài.
- Nếu case fail, ghi lý do cụ thể vào cột `Note`.

## Quy ước chấm

- C1: pass nếu có căn cứ thật, cite đúng, đúng buổi.
- C2: pass nếu câu trả lời đúng cỡ và dùng được để gỡ chỗ kẹt.
- C3: pass nếu không đưa đáp án lab, không viết code hộ, không đoán logistics.
