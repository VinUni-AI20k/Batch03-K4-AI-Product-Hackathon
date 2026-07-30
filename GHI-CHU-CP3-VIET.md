# Ghi chú — mấy thứ em sửa sau khi rà lại CP3

---

## 1. Cái regex kia nó chỉ bắt đúng câu mình đã viết sẵn thôi

Chỗ này em thấy là nặng nhất.

Trong `agent_core.py` cũ, việc quyết định "câu này ngoài phạm vi hay không" là do một
cái regex làm, chứ AI không tham gia. Mà cái regex nó thế này:

```python
r"deadline|hạn nộp|link nộp|lịch thi|điểm số|flappy|pygame|viết (?:hộ )?code game"
```

Ba cái `flappy`, `pygame`, `viết code game` — cả ba đều khớp đúng 1case duy nhất
trong golden set là GS-14 ("Viết hộ tôi code game Flappy Bird bằng pygame"). Tức là luật
được viết ra để pass đúng cái case đó, chứ không phải để nhận diện câu ngoài phạm vi.

Em thử gõ 4 câu khác cùng ý mà diễn đạt khác đi:

```
Bao giờ thì phải nộp bài tập này?          -> SAI (ra clarify, đáng lẽ refuse)
Mấy giờ thi cuối kỳ vậy?                    -> SAI
Nộp bài ở chỗ nào ạ?                        -> SAI
Viết giúp mình game rắn săn mồi bằng Python -> SAI
```

**0/4.** Đúng cái tình huống mà slide CP3 nói là chưa đạt: *"chỉ chạy đúng 3 câu đã chuẩn
bị trước"*. Nếu hôm demo Labcoach gõ một câu tự nghĩ ra thì mình toang.

**Em sửa thế này:** không bỏ hết rule, mà chia làm hai loại

- **Nhóm logistics** (deadline, link nộp, lịch thi, điểm số) — **vẫn để rule chốt cứng**.
  Cái này em giữ có chủ đích : trả lời sai deadline là hại học viên
  thật, không nên để model ứng biến. Chỗ này mình còn giải thích được là quyết định
  automation level có lý do, ăn điểm R2.
- **Mọi thứ ngoài phạm vi khác** (nhờ viết code, hỏi chuyện ngoài môn) — **để AI quyết**.
  Em bỏ hẳn `flappy|pygame` ra khỏi regex và dạy trong system prompt khi nào phải từ chối.

Xong test lại đúng 4 câu đó: **5/5** (em thêm cả câu GS-14 gốc). Và GS-14 vẫn refuse
được **dù đã bỏ regex đỡ**, tức là model tự làm được thật.


---

## 2. Con số 95% đang tính cả phần AI không làm gì

Bảng Run 12 ghi 19/20 = 95%. Nhưng em check trace thì **5/20 case có `model: null` —
tức là không hề gọi AI, rule trả lời luôn bằng một chuỗi viết sẵn. Mà 5 case đó lại đúng
là mấy case khó (GS-09, 11, 12, 13, 14).

Nên 5 case đó pass là chuyện đương nhiên, luật viết ra để bắt đúng chúng mà. Gộp chung
vào rồi báo 95% thì hơi ảo.

**Em sửa `run_eval.py`** cho bảng tách hai cột, mỗi dòng ghi rõ **AI** hay **RULE**, và
báo riêng hai con số. Em nghĩ mình nên chủ động báo cả hai — nếu giám khảo tự soi trace
thấy 5 case không có `model` mà bảng vẫn ghi 95% thì mất điểm nhiều hơn là mình tự khai.

---

## 3. Có case làm sập cả lượt hỏi

GS-19 hỏi *"so sánh Rule/Workflow/Agent trong một bảng ngắn"*. Model dựng bảng markdown,
bên trong có dấu nháy kép, thế là vỡ JSON, retry sửa một lần cũng không xong → cả lượt
hỏi chết, trả về `error`.

Em thêm vào system prompt là trong chuỗi không được dùng dấu `"` và không dùng ký tự `|`,
muốn kẻ bảng thì mỗi dòng là một phần tử; đồng thời cho retry sửa JSON **2 lần** thay vì 1.
Hết lỗi.

---

## 4. Mấy thứ em nâng cấp thêm

- **BM25 thay cho đếm từ chung.** Code cũ đếm số từ trùng nhau, không có IDF, nên mấy từ
  kiểu "không", "được", "trong" được tính ngang với thuật ngữ chuyên môn, trang nào dài
  thì dễ thắng oan.
- **Chống prompt injection.** Text của slide đang được nhét thẳng vào prompt. Nếu trong
  slide có câu kiểu "bỏ qua hướng dẫn phía trên" là model nghe theo luôn. Em bọc lại trong
  thẻ `<evidence>` và nói rõ đó là dữ liệu chứ không phải mệnh lệnh. Có thêm case GS-24 để
  nghiệm thu, và em thêm cơ chế `forbidden_terms` cho runner kiểm được cả chữ **không được**
  xuất hiện (trước chỉ kiểm được chữ phải có).
- **Độ tin cậy % không còn để model tự khai.** Trước lấy nguyên con số model tự chấm, mà
  LLM tự chấm thì lệch lắm. Giờ em kéo về theo hai thứ đo được: bao nhiêu ý có citation, và
  bao nhiêu citation đối chiếu được. Số model tự khai vẫn lưu lại trong trace để đối chiếu.
- **Luồng chụp vùng:** frontend vốn đã gửi `slide_text` (chữ chính xác lấy từ text layer
  của PDF) sang backend rồi, mà **backend bỏ quên không dùng**. Em nối lại — VLM đọc số
  liệu trong biểu đồ hay nhầm, có chữ chuẩn đối chiếu thì đỡ hơn nhiều. Thêm nữa nếu vision
  lỗi thì giờ nó trả lời bằng text của trang kèm cảnh báo, chứ không chết cả lượt hỏi.
- **Linh tinh:** cache theo câu hỏi, khoá file trace (server chạy đa luồng, không khoá thì
  hai dòng JSON ghi đè lên nhau), retry mạng cho lỗi 429/5xx, ước tính chi phí mỗi lượt.



---

## 5. Kết quả — em ghi cả mấy lượt chạy tệ

Em chạy 3 lượt và giữ lại hết, không xoá lượt xấu:

| Lượt | Thay đổi | Tổng | Riêng AI |
|---|---|---|---|
| Run 13 | sau khi sửa citation + chuyển refuse sang AI + BM25 + transcript | 21/24 = 88% | **15/18 = 83%** — chưa đạt bar |
| Run 14 | hạ `temperature` 0.1 → 0 | 20/24 = 83% | **14/18 = 78%** — tệ hơn |
| Run 15 | sau khi sửa lỗi vỡ JSON | **23/24 = 96%** | **17/18 = 94%** — đạt |

Vụ Run 14 em nói rõ: em hạ temperature vì Run 13 cho thấy **cùng một câu lúc trả refuse
lúc trả clarify**, mình chấm bằng golden set thì cần chạy lại ra kết quả giống nhau. Em đổi
vì lý do đó, không phải để tăng điểm — và thực tế nó làm tụt điểm. Em vẫn giữ nguyên
temperature = 0 và ghi lại đúng con số xấu, vì rubric ghi rõ "kết quả thấp không bị trừ điểm,
số liệu bị chỉnh sửa mới không được tính".

**Case còn fail duy nhất là GS-14** — model trả **đúng** `refuse`, nhưng trượt điều kiện
`required_terms: ["ngoài phạm vi"]`. Từ khoá đó hồi trước viết theo đúng chuỗi cứng của rule
cũ, giờ AI tự viết câu từ chối theo cách khác nên không chứa cụm đó. Em **cố ý để nguyên
FAIL** chứ không sửa golden set — sửa đề sau khi đã nhìn đáp án là nới rubric. Hai anh xem
rồi quyết định giúp em nhé.

---

## 6. Còn mấy việc em không tự làm được

1. **Hai anh chấm độc lập ≥5 case khó.** Rubric bắt buộc phải có người thứ hai chấm, em
   với máy không thay được. Chấm xong ghi tên và chỗ nào lệch vào report Run 15.
2. **Tải `pdf.js` về để trong repo.** Hiện đang load từ CDN cloudflare. Hôm demo mà mạng
   hội trường chặn hoặc rớt là viewer trắng bóc luôn, không có PDF nào hiện ra. Em thấy đây
   là rủi ro thật, làm mất có 5 phút.
3. **Bấm thử lại mấy công cụ trên slide** (Bút / Khoanh / Text / Tẩy / Chụp vùng). Em có gỡ
   550 dòng code chết trong `app.js` nên dù chỉ là code chết, hai anh cứ bấm qua một lượt
   cho chắc.
4. **Nhờ người ngoài nhóm gõ vài câu tự nghĩ.** 4 câu em dùng để test ở mục 1 giờ đã nằm
   trong golden set rồi, tức là mình "biết đề". Muốn biết thật sự có ổn không thì phải nhờ
   người khác gõ câu mình chưa từng thấy.

---

Có gì hai anh cứ nhắn em. Chỗ nào em nói chưa đúng thì bảo, em sửa lại.
