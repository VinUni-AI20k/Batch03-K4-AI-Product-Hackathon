# Worked example

Đọc khi chưa rõ "đúng format" trông thế nào.

Ví dụ dưới đây lấy từ một lab dạng fill-in-có-test: learner điền TODO trong `template.py`, chạy pytest theo từng part. **Đây là minh hoạ cách viết, không phải khuôn để copy.** Lab của bạn khác dạng thì đổi xương theo Phase 2; cái cần học ở đây là mật độ thông tin và cách ghép lệnh với output, không phải tên file.

## Bản coach thường viết lần đầu, và học viên tắc ở đâu

- `## 🚀 Bước 1: Khám phá thế giới LLM API đầy thú vị` cùng 4 dòng "trong thời đại AI ngày nay" → đọc 120 từ vẫn chưa biết phải làm gì.
- Một block gộp `pip install` → `python -m venv` → `activate` → `pytest` → sai thứ tự, cài vào Python hệ thống chứ không vào venv.
- "mở file template và implement các hàm cần thiết" → `template.py` có 3 hàm, hàm nào?
- "sau đó chạy test" → fail hàng loạt là bình thường hay là lỗi setup?
- `**Lưu ý:** Nhớ import OpenAI bên trong hàm nhé!` → không nói vì sao, học viên import đầu file, test gọi API thật, fail.
- `- [X] Hiểu về LLM API` → tick sẵn, và không verify được.
- `[file này](file:///c:/Users/Admin/Documents/...)` → chết trên mọi máy trừ máy coach.
- Không có mốc thời gian ở đâu → học viên làm tới phút 90 mới biết mình đáng lẽ phải xong step 2 từ phút 60.

## Cùng nội dung đó, đúng format

````markdown
## 1. Gọi được Chat Completions API và đo latency

**40 phút · mốc 20–60.**

:::goal{title="`call_openai` chạy được, 3 test đầu pass"}
Bạn có hàm gọi Chat Completions trả về `(text, latency)`, và hiểu vì sao `import` phải nằm trong thân hàm.
:::

### Tại sao import OpenAI bên trong hàm?

Bộ test thay một người đóng thế vào chỗ `openai.OpenAI` — giống việc đổi diễn viên trước khi
quay, nhưng chỉ đổi được nếu cảnh chưa bắt đầu.

Import ở đầu file thì hàm của bạn đã giữ tham chiếu tới class thật từ trước, nên người đóng thế
vào muộn không thay được gì: test sẽ gọi API thật và fail vì không có key.

**Bạn làm:**

1. Mở `template.py`, tìm `call_openai` — đọc docstring, đừng sửa chữ ký hàm.
2. Xoá dòng `raise NotImplementedError(...)`.
3. Viết thân hàm: `from openai import OpenAI` **trong hàm**, tạo client, gọi `create()`.
4. Đo `time.time()` sát trước và sát sau `create()` — latency chỉ tính lời gọi mạng.
5. Trả về tuple `(response.choices[0].message.content, latency)`.

```bash
pytest tests/test_part1.py -k TestCallOpenAI -v
```

Kết quả đúng:

```text
tests/test_part1.py::TestCallOpenAI::test_returns_non_empty_string PASSED
tests/test_part1.py::TestCallOpenAI::test_latency_is_positive_float PASSED
tests/test_part1.py::TestCallOpenAI::test_returns_tuple_of_two PASSED
3 passed
```

Chưa viết code thì 3 test này fail với `NotImplementedError` — đó là trạng thái đúng của môi
trường, không phải lỗi setup.

**Nếu bị chậm:** làm xong bullet 1–3 là đủ điều kiện sang step sau.
**Xong sớm:** gọi `call_openai` với `temperature=0` và `1.5` trên cùng prompt, ghi khác biệt vào `exercises.md` câu 2.

:::checkpoint{title="Hoàn thành khi"}
[ ] `pytest tests/test_part1.py -k TestCallOpenAI -v` → `3 passed`
[ ] `template.py` không còn `raise NotImplementedError` trong `call_openai`
[ ] Bạn giải thích được vì sao import ở đầu file làm test fail
:::

:::caution{title="Troubleshooting — Vấn đề thường gặp"}
`ModuleNotFoundError: No module named 'openai'`
→ **Mindset**: tách "môi trường nào đang chạy?" khỏi "code đúng chưa?".
→ Kiểm đầu dòng lệnh có `(.venv)` chưa.

Test fail với lỗi liên quan API key
→ **Mindset**: test dùng mock, không cần key. Fail vì key nghĩa là mock không bắt được lời gọi.
→ Kiểm `from openai import OpenAI` đã nằm **trong** thân hàm chưa.
:::
````

## Đã đổi gì

Bản đúng dài hơn khoảng 40%, nhưng phần thêm vào là output kỳ vọng, checkpoint, và troubleshooting — thứ học viên cần để tự đi. Phần bị cắt là prose không mang thông tin.

Bốn thứ đáng để ý:

- **Thời lượng ra khỏi heading, thành một dòng riêng có mốc.** `(40 phút)` chỉ nói step này dài bao lâu; `mốc 20–60` nói học viên đang ở đâu trong buổi. Cái thứ hai mới giúp họ biết mình chậm.
- **Một câu ví dụ đời thường trước cơ chế.** "Người đóng thế vào muộn không thay được gì" gánh phần trực giác, rồi mới đến chuyện tham chiếu class. Đúng một câu — câu thứ hai là bắt đầu viết văn tả.
- **Câu "chưa viết code thì 3 test này fail" là phần dễ bị bỏ nhất.** Nó nói cho học viên biết trạng thái fail ban đầu là đúng, chứ không phải setup sai. Thiếu nó là chỗ mất người nhiều nhất ở step 1.
- **Bullet chia thân hàm thành 5 bước** nhưng không viết hộ thân hàm. Đó là mức tiết lộ đúng cho người mới: không phải đoán coach muốn gì, vẫn phải tự viết cái được chấm.

Lưu ý về nhãn: block `3 passed` ở trên suy ra từ tên test trong `tests/test_part1.py`, chưa chạy thật. Trong guide thật, coach chạy một lần rồi dán output thật. Chưa chạy được thì phải ghi `Kết quả kỳ vọng (Coach inference — chưa chạy được vì cần API key):`. Đừng để học viên đối chiếu với output bịa rồi tưởng mình sai.
