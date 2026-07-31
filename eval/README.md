# Eval & Prompt — recap buổi trước + bridge sang buổi hiện tại

Phạm vi này chỉ đánh giá hai đầu ra: **recap** và **bridge có citation**. Không đánh giá UI, checklist, quiz hay chatbot Q&A.

## Contract dùng chung với Build Lead

```json
{
  "status": "ok | insufficient_context | low_overlap",
  "recap": [
    {"claim": "...", "citations": ["T04-046"]}
  ],
  "bridges": [
    {
      "from_concept": "...",
      "to_concept": "...",
      "explanation": "...",
      "source_citations": ["T04-046"],
      "target_citations": ["T01-023"]
    }
  ],
  "warnings": []
}
```

Prompt chính ở `codebase/prompts/`; baseline và candidate có thể truy vết tại `codebase/prompts/versions/v1` và `v2`.

## Golden set

`golden_set.json` có đúng 22 case:

| Cohort | Số case | Chi tiết |
|---|---:|---|
| Thường | 10 | Cả 10 có mã conversation thật `Cxxxx` từ chatlog |
| Khó | 8 | Đúng 2 case cho mỗi lớp: nguồn sự thật, thiếu/mơ hồ, ngoài phạm vi, đặc thù domain |
| Hiếm | 4 | Ít overlap, nguồn quá ngắn, nguồn mâu thuẫn, thiếu một phía |

Golden set chỉ lưu mã conversation/segment và excerpt tối thiểu. Runner resolve nội dung từ `data/vlearn-pack/` lúc chạy; không sao chép data pack vào artifact nộp.

## Validator tự động

Validator kiểm:

- JSON/schema và enum status;
- recap 5–7 ý, bridge 2–4 liên kết, tối đa 300 từ;
- citation tồn tại trong đúng phía input;
- mỗi recap có citation, mỗi bridge có citation cả nguồn và đích;
- fallback khớp expectation của case;
- phrase từ prompt injection, hành chính hoặc off-topic không lọt vào output;
- thiếu data/API error luôn là fail, không tạo pass giả.

Mã citation **tồn tại** là kiểm tra tự động. Citation **thực sự hỗ trợ claim** là kiểm tra độc lập của con người; không đánh đồng hai metric.

## Chạy

Yêu cầu Python 3.12. API key chỉ đọc từ `GOOGLE_API_KEY`.

```bash
python3 -m pip install -r eval/requirements.txt

# Không gọi API: validate prompt, cơ cấu golden set và resolve toàn bộ mã nguồn
python3 eval/run_eval.py validate

# Smoke một case thật bằng baseline
python3 eval/run_eval.py smoke --case normal_01 --prompt-version v1

# Round 1: đủ 22 case
python3 eval/run_eval.py run --round 1 --prompt-version v1

# Nếu tự thay key sau khi chạm quota: chỉ chạy lại case fail, không xoay key tự động
python3 eval/run_eval.py run --round 1 --prompt-version v1 --resume

# Sau khi chọn đúng một failure ưu tiên và chốt v2: chạy lại đủ 22 case
python3 eval/run_eval.py run --round 2 --prompt-version v2

# Chỉ chạy sau khi hai reviewer điền đủ bảng chấm
python3 eval/run_eval.py summarize
```

Mỗi result lưu model, prompt hash, case version, timestamp UTC, latency, số attempt, output, validator errors, API errors và toàn bộ attempt log. Schema/citation lỗi được retry đúng một lần; API error không retry và được ghi fail.

Model mặc định cho cả hai round là `gemini-3.1-flash-lite` (stable, hỗ trợ structured output), có thể đổi bằng `GEMINI_MODEL`. Baseline dự kiến ban đầu dùng `gemini-2.5-flash`, nhưng API live trả 404 vì model không còn cấp cho tài khoản mới; `gemini-3.6-flash` tiếp tục chạm giới hạn 20 request/ngày của project free tier, không đủ cho pipeline hai bước 22 case. Thay đổi model không làm thay đổi prompt hay quality bar.

## Hai reviewer độc lập

Eval & Prompt Lead và Spec & Design Lead cùng chấm toàn bộ 8 case khó và cùng 5 case thường trong `reviews/`. Mỗi chiều dùng `pass | fail | na`:

1. citation có thực sự hỗ trợ claim;
2. bridge có quan hệ logic thật;
3. thuật ngữ domain có đúng nghĩa;
4. output đúng cỡ và hữu ích.

Bất đồng ghi tại `reviews/disagreements.md`; không ghi đè điểm gốc.

## Metric và quality bar đã khóa

Quality bar giữ nguyên bản đã khóa lúc 23:48 ngày 30/07:

1. Tỷ lệ case recap có ít nhất một citation **chính xác** ≥80%. Mẫu số là các case có expectation `ok` hoặc `low_overlap`; loại các case được thiết kế để fallback `insufficient_context` vì các case đó bắt buộc `recap=[]`. “Chính xác” cần reviewer xác nhận nội dung.
2. Tỷ lệ bridge không trace được phải bằng 0%. Validator đếm bridge thiếu/sai citation ở một trong hai phía; reviewer kiểm thêm quan hệ ngữ nghĩa.
3. ≥70% user thấy recap hữu ích. Chỉ lấy từ Validation Lead; khi chưa có feedback thật hiển thị `pending validation`.

Kết quả hiện tại:

- Offline asset validation: xem lệnh `validate`.
- Round 1: xem `results_round_1.md`.
- Round 2: xem `results_round_2.md`.
- Live JSON: `results/`.

Không thay đổi ngưỡng sau deadline. Không điền số live/human khi chưa thực sự chạy hoặc chấm.
