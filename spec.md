# AI SPEC — AI Learning Bridge · Nhóm BrainStormers · Zone [X]
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tính năng mới

## §1. User & Job

- **Job executor + workflow:** Học viên khóa AI Thực Chiến, chủ yếu thuộc K3 và K4, khi bắt đầu một buổi học mới trên VLearn.

  - **Workflow:** Kết thúc buổi N → Bắt đầu buổi N+1 → Cố nhớ lại kiến thức buổi trước → Mở lại slide, video, ghi chú, đoạn chat hoặc hỏi bạn bè/trợ giảng → Lấy lại ngữ cảnh để tiếp tục học, hoặc học bài mới khi chưa hiểu rõ mối liên hệ giữa các buổi.

- **Core JTBD** *(không có tên sản phẩm hoặc AI trong câu):* Khi bắt đầu một buổi học mới, học viên muốn nhanh chóng nhớ lại những kiến thức quan trọng của buổi trước và hiểu chúng liên quan như thế nào đến nội dung hôm nay, để tiếp thu bài mới hiệu quả mà không phải mất nhiều thời gian tìm lại tài liệu.

- **Problem statement** *(không dùng chữ AI):* Khi bắt đầu buổi học mới, nhiều học viên không nhớ rõ nội dung buổi trước, không biết nên ôn lại phần nào hoặc không nhận ra mối liên hệ giữa các buổi học. Họ phải mở lại slide, video, ghi chú, đoạn chat hoặc hỏi người khác để lấy lại ngữ cảnh, làm gián đoạn mạch tư duy, tốn thời gian và giảm hiệu quả tiếp thu kiến thức mới.

- **Evidence** *(chuẩn A — khảo sát người dùng; log đầy đủ tại `evidence/survey_log.md`):*
  - Khảo sát ghi nhận tổng cộng **27 phản hồi**, gồm:
    - **20 học viên K4**.
    - **5 học viên K3**.
    - **1 người thuộc khóa AI khác**.
    - **1 người chọn nhóm “Khác”**.
  - **23/27 người (85,2%)** không nhớ rõ toàn bộ nội dung buổi trước:
    - 14 người chỉ nhớ một phần.
    - 7 người phải xem lại tài liệu mới nhớ.
    - 2 người gần như quên hoàn toàn.
  - Chỉ **4/27 người (14,8%)** cho biết họ nhớ khá rõ nội dung buổi trước.
  - **14/27 người (51,9%)** mất từ **10 phút trở lên** để lấy lại mạch kiến thức:
    - 8 người mất từ 10–20 phút.
    - 6 người mất trên 20 phút.
  - Các khoảng thời gian còn lại:
    - 8 người mất từ 3–10 phút.
    - 5 người mất dưới 3 phút.
  - **24/27 người (88,9%)** xác nhận có ít nhất một khó khăn cụ thể khi bắt đầu buổi học mới; chỉ 3 người chọn “Không gặp khó khăn”.
  - Những khó khăn được ghi nhận nhiều nhất:
    - **11/27 người (40,7%)** không biết nội dung hôm nay liên quan như thế nào đến buổi trước.
    - **6/27 người (22,2%)** không biết nên ôn lại phần nào.
    - **6/27 người (22,2%)** không nhớ buổi trước đã học gì.
    - **1/27 người (3,7%)** khó tìm lại đúng tài liệu.
  - **20/27 người (74,1%)** gặp tình trạng này từ khoảng một nửa số buổi trở lên:
    - 11 người gặp gần như mọi buổi học.
    - 9 người gặp khoảng một nửa số buổi.
  - Các mức tần suất còn lại:
    - 5 người gặp thỉnh thoảng.
    - 2 người gặp hiếm khi.
  - **18/27 người (66,7%)** đánh giá tính năng tóm tắt và kết nối kiến thức giữa các buổi là **“Hữu ích” hoặc “Rất hữu ích”**:
    - 9 người đánh giá “Hữu ích”.
    - 9 người đánh giá “Rất hữu ích”.
  - **26/27 người (96,3%)** cho biết chắc chắn hoặc có thể sử dụng nếu tính năng được tích hợp vào VLearn:
    - 12 người chọn “Chắc chắn có”.
    - 14 người chọn “Có thể”.
    - 1 người chọn “Chưa chắc”.

### Ví dụ nguyên văn từ khảo sát

> “Tôi phải lướt lại hết slide để xem buổi trước học những kiến thức nào.”

> “Việc khó khăn nhất là khi chưa kịp nhớ ra buổi trc học gì thì giảng viên đã giảng dạy bài học mới, vì vậy mình phải tự đọc cả 2 bài học cùng một lúc và sẽ gây khó khăn và quá tải nếu bài học quá khó.”

> “Tôi thường nhớ mang máng, không chắc chắn, phần giảng viên giảng không hiểu dù đã học, nhưng tìm lại rất khó khăn, mất khoảng 20 - 30ph vì không biết tìm ở đâu, do quên kiến thức buổi trước.”

> “Không nhớ bài - Mở slide và hỏi bạn bè - khoảng 20ph.”

> “Tôi quên mất Transformer hoạt động ntn và tôi phải nhờ bạn chỉ lại mất 15p.”

> “Thường quên kiến thức, phải mất khoảng 30p để reload lại.”

> “Khi bắt đầu một buổi học mới tôi luôn mơ hồ về việc hôm nay giảng viên đang giảng dạy phần nào và có nhiều buổi gần như tôi không biết giảng viên đang giảng về thứ gì liên quan tới chương trình.”

> “Không nhớ buổi trước học gì và mất thời gian tìm tài liệu, ghi chú, hỏi bạn bè. Nếu như quá lười hoặc bận sau một vài buổi học sẽ ko có kiến thức gì đọng lại và mất thời gian để xem và tìm lại những gì đã học.”

> “Khi bắt đầu buổi hc ms tôi thường ko bt bài tới sẽ làm j và liên quan j dênd buổi trc.”

> “Slide quá nhiều mà không biết tóm tắt là gì nên, không có keyword nên rất khó để hiểu.”

---

## §2. Impact & quyết định chọn

### Bảng impact các ứng viên

| Ứng viên | Quy mô ảnh hưởng | Tần suất xảy ra | Chi phí/tác động mỗi lần | Khả thi trong hackathon | Quyết định |
|---|---:|---|---|---|---|
| **Học viên khó lấy lại mạch kiến thức và kết nối nội dung giữa các buổi học** | **24/27 người (88,9%)** xác nhận gặp ít nhất một khó khăn cụ thể; **23/27 (85,2%)** không nhớ rõ toàn bộ nội dung buổi trước | **20/27 (74,1%)** gặp tình trạng từ khoảng một nửa số buổi trở lên | **14/27 (51,9%)** mất từ 10 phút trở lên; phải tìm lại slide, video, ghi chú, đoạn chat hoặc hỏi người khác; làm gián đoạn mạch tư duy | **Cao** — đã có transcript và slide để tạo recap, bridge và trích dẫn nguồn; phạm vi MVP có thể giới hạn ở hai buổi liên tiếp | ✅ **CHỌN** |
| **Học viên không biết nên ôn lại phần nào trước buổi học mới** | **6/27 người (22,2%)** xác nhận đây là khó khăn làm họ mất nhiều thời gian nhất | Xuất hiện khi bắt đầu buổi học mới hoặc khi chuẩn bị cho bài tiếp theo | Phải tự lướt lại nhiều slide, video và ghi chú; có thể ôn sai trọng tâm hoặc bỏ sót kiến thức nền | **Cao** — có thể tạo checklist kiến thức cần ôn từ tài liệu của hai buổi | ❌ **LOẠI** |
| **Học viên không nhớ buổi trước đã học gì** | **6/27 người (22,2%)** chọn đây là khó khăn lớn nhất; tổng cộng **23/27 (85,2%)** không nhớ rõ toàn bộ nội dung | Xuất hiện khi chuyển sang buổi học tiếp theo | Phải mở lại slide, video, ghi chú hoặc hỏi bạn bè; các phản hồi thực tế ghi nhận thời gian tìm lại từ 15 đến trên 30 phút | **Cao** — có thể tạo bản recap từ transcript và slide | ❌ **LOẠI** |

### Ứng viên đã loại và lý do

- **Học viên không biết nên ôn lại phần nào — LOẠI:** Pain này được **6/27 người (22,2%)** xác định là khó khăn làm họ mất nhiều thời gian nhất. Một checklist ôn tập có thể giúp học viên tìm đúng nội dung cần xem lại. Tuy nhiên, phạm vi này chỉ giải quyết câu hỏi “cần ôn phần nào”, chưa giải quyết đầy đủ việc học viên không nhớ kiến thức cũ và không hiểu kiến thức đó liên quan như thế nào đến bài học mới.

- **Học viên không nhớ buổi trước đã học gì — LOẠI:** Đây là khó khăn lớn nhất của **6/27 người (22,2%)**, đồng thời **23/27 người (85,2%)** không nhớ rõ toàn bộ nội dung buổi trước. Một bản recap có thể hỗ trợ học viên nhớ lại các ý chính, nhưng nếu chỉ tóm tắt nội dung cũ thì học viên vẫn có thể chưa hiểu kiến thức đó được sử dụng như thế nào trong buổi học tiếp theo. Vì vậy, recap được giữ lại như một phần của giải pháp tổng thể, thay vì được chọn làm toàn bộ bài toán trung tâm.

### Ứng viên được chọn và lý do

Nhóm chọn bài toán **học viên khó lấy lại mạch kiến thức và kết nối nội dung giữa các buổi học** vì đây là ứng viên có bằng chứng mạnh nhất về quy mô ảnh hưởng, tần suất, chi phí và tính khả thi:

1. **24/27 người (88,9%)** xác nhận gặp ít nhất một khó khăn cụ thể khi bắt đầu buổi học mới.
2. **23/27 người (85,2%)** không nhớ rõ toàn bộ nội dung buổi trước.
3. **20/27 người (74,1%)** gặp tình trạng này từ khoảng một nửa số buổi trở lên.
4. **14/27 người (51,9%)** mất từ **10 phút trở lên** để lấy lại mạch kiến thức.
5. **11/27 người (40,7%)** không biết nội dung hôm nay liên quan như thế nào đến buổi trước.
6. **6/27 người (22,2%)** không biết nên ôn lại phần nào.
7. **6/27 người (22,2%)** không nhớ buổi trước đã học gì.
8. **18/27 người (66,7%)** đánh giá tính năng recap và kết nối kiến thức là hữu ích hoặc rất hữu ích.
9. **26/27 người (96,3%)** cho biết chắc chắn hoặc có thể sử dụng tính năng nếu được tích hợp vào VLearn.
10. Nhóm đã có transcript và slide bài giảng để xây dựng, trích dẫn và kiểm thử một MVP gồm recap kết hợp bridge giữa hai buổi liên tiếp.

Ứng viên được chọn bao phủ đồng thời ba nhu cầu xuất hiện rõ trong khảo sát:

- Nhớ lại những kiến thức quan trọng của buổi trước.
- Xác định nội dung cần ưu tiên ôn lại.
- Hiểu mối liên hệ giữa kiến thức cũ và bài học mới.

Phạm vi này tạo tác động rộng hơn hai ứng viên còn lại nhưng vẫn đủ cụ thể để xây dựng và demo trong thời gian hackathon. MVP không cần xử lý toàn bộ lịch sử khóa học mà chỉ tập trung tạo recap và bridge giữa hai buổi liên tiếp, có trích dẫn đến slide hoặc transcript để học viên tự kiểm chứng.

## §3. Giải pháp tương tự đã nghiên cứu
- [NotebookLM]: _TODO_
- [Khanmigo]: _TODO_
- [ChatGPT study mode]: _TODO_

## §4. Thiết kế
- Lát cắt MỘT CÂU: Một học viên bắt đầu buổi Day 02 trên VLearn · AI tự động hiển thị recap Day 01 + bridge chỉ ra kiến thức Day 01 nào là nền tảng cho Day 02 kèm trích dẫn cụ thể · giúp học viên nắm được mạch kiến thức trong ≤3 phút thay vì tự tìm 15 phút.
- Non-goals (≥3):
  1. Không build lại toàn bộ UI của VLearn
  2. Không tạo hệ thống chấm điểm chính thức
  3. Không thay thế vai trò giảng viên
  4. Không xây chatbot Q&A tổng quát
- Mức prototype nhắm tới: [ ] Sketch [x] Mock [ ] Working — phần mock: UI hiển thị, knowledge map; phần thật: LLM call sinh recap/bridge
- Automation: [x] augment [ ] conditional [ ] automate — lý do: recap/bridge sai kiến thức → học viên ôn sai → chi phí lỗi trung bình–cao. AI sinh, kèm trích dẫn để user tự kiểm tra.
- §4b. Nguyên tắc đã áp dụng (≥4):

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| G2 — Làm rõ nó làm tốt đến đâu | Mỗi ý recap kèm [trang/đoạn] trích dẫn → user biết kiểm lại ở đâu |
| G10 — Thu hẹp phạm vi khi nghi ngờ | Transcript thiếu → hiển thị "Chưa đủ dữ liệu, xem lại slide gốc" |
| G8 — Gạt bỏ dễ dàng | Nút "Bỏ qua recap" luôn hiện, không chặn flow vào bài mới |
| G11 — Giải thích vì sao | Bridge map ghi "vì Day 01 slide 20 nói về giới hạn bẩm sinh → Day 02 dùng để phân tích khi nào AI không phù hợp" |
| G15 — Mời feedback chi tiết | Nút 👍👎 + "Sai chỗ nào?" sau mỗi recap |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| # | Tình huống cụ thể | Lớp | Hành vi mong muốn | Nguyên tắc |
|---|---|---|---|---|
| 1 | AI bịa liên kết giữa 2 buổi không liên quan | ① | Không đưa ra liên kết, hiển thị "Hai buổi này ít overlap" | G10 |
| 2 | AI trích dẫn sai trang slide | ① | Mọi citation phải match nội dung gốc | G2 |
| 3 | Transcript buổi bị thiếu/ngắn | ② | Báo rõ "Dữ liệu buổi này chưa đầy đủ" + link slide gốc | G10 |
| 4 | Học viên highlight đoạn mơ hồ, hỏi "liên quan gì buổi sau?" | ② | Trả lời "Chưa đủ thông tin để xác định" thay vì đoán | G10 |
| 5 | Hỏi nội dung ngoài khóa học | ③ | "Mình chỉ hỗ trợ nội dung khóa AI Thực Chiến" | G10 |
| 6 | Yêu cầu AI viết bài tập hộ | ③ | Từ chối + gợi ý "Bạn có thể ôn lại recap rồi thử tự làm" | G8 |
| 7 | Nhầm "attention mechanism" (kỹ thuật) với "attention" (chú ý thông thường) | ④ | Dùng đúng thuật ngữ như trong transcript gốc | G2 |
| 8 | Recap gộp Chain-of-Thought với Prompt Engineering thành 1 khái niệm | ④ | Giữ tách biệt, cite đúng slide từng khái niệm | G11 |
| 9 | Học viên bỏ 2 buổi liên tiếp, quay lại buổi N+2 | Hiếm | Sinh recap cả 2 buổi bỏ lỡ + bridge tích lũy | G2 |

## §6. Bốn đường đi của trải nghiệm
- Happy path: Học viên vào buổi N+1 → thấy recap buổi N (5–7 ý, có cite) + bridge map (2–4 liên kết) + checklist → đọc 3 phút → bắt đầu bài mới
- Low-confidence (②): Transcript thiếu → hiển thị recap ngắn + warning "Dữ liệu chưa đầy đủ" + link xem slide gốc
- Failure/không căn cứ (①): AI không tìm được liên kết → "Hai buổi này ít overlap — bạn có thể bắt đầu buổi mới ngay"
- Correction (user sửa): 👎 → "Sai chỗ nào?" → log lại → cải thiện prompt
- Khi bị đòi ngoài phạm vi (③): "Mình chỉ hỗ trợ nội dung khóa AI Thực Chiến — câu này ngoài phạm vi mình nhé!"
- Case đặc thù domain (④): Thuật ngữ AI dùng đúng như trong tài liệu gốc, không paraphrase sai nghĩa

## §7. Kiểm thử
- Chiều chất lượng và cách đo chi tiết: xem `eval/README.md`. Validator tự động kiểm schema, số lượng 5–7 recap/2–4 bridge, giới hạn 300 từ, citation tồn tại đúng phía và fallback. Hai reviewer độc lập kiểm citation thực sự hỗ trợ claim, logic bridge, nghĩa thuật ngữ domain và độ hữu ích.
- Golden set: `eval/golden_set.json` — đúng 22 case (10 thường, 8 khó với đúng 2 case cho mỗi lớp, 4 hiếm); 10 case thường truy được về chatlog bằng conversation ID ẩn danh. Nội dung đầy đủ được resolve từ `data/` khi chạy, không sao chép data pack vào artifact.
- Quality bar đã khóa lúc 23:48 ngày 30/07, giữ nguyên: "Đạt khi ≥ 80% recap có ít nhất 1 citation chính xác, VÀ 0% bridge chứa thông tin không trace được về tài liệu gốc, VÀ ≥ 70% học viên thử nghiệm xác nhận recap hữu ích."
- Kết quả: Round 1 pass tự động 81,8% (18/22), Round 2 pass 100% (22/22); recap có citation tồn tại tăng từ 73,3% lên 100%, bridge không trace được bằng 0. Xem `eval/results_round_1.md`, `eval/results_round_2.md` và JSON live trong `eval/results/`. Citation chính xác chờ đủ hai reviewer; chỉ số hữu ích lấy từ Validation Lead và vẫn là `pending validation` nếu chưa có feedback thật.

## §8. Phân công & kế hoạch
- Phân công có tên: _xem phan-cong.md_
- Willing users (≥3 tên): _TODO_
- Multi-prototype (nếu làm): _TODO_

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| _TODO_ | | |
