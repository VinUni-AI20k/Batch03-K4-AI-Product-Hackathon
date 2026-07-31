# AI SPEC — Slide-aware VLearn Tutor · Nhóm 04 · Zone A
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tối ưu tính năng có sẵn  [ ] Tính năng mới

## §1. User & Job
- Job executor + workflow: Sinh viên đang học trong buổi học/ôn tập trên VLearn, đang nhìn một slide cụ thể, muốn hiểu ngay nội dung của trang đó hoặc tóm tắt nội dung để tiếp tục học. Workflow: mở slide → đặt câu hỏi về trang hiện tại/slide đang xem → hệ thống dùng ngữ cảnh trang hiện tại để trả lời → nếu không chắc, hỏi lại hoặc thu hẹp phạm vi.
- Core JTBD: Khi đang xem một slide trong buổi học, tôi muốn hiểu ngay nội dung của trang đang nhìn để tiếp tục học mà không cần tốn công mô tả lại slide cho AI.
- Problem statement: Học viên phải tự mô tả lại trang slide mình đang xem và AI thường không hiểu đúng ngữ cảnh đang hiển thị, dẫn đến câu trả lời sai, thiếu căn cứ hoặc phải hỏi ngược lại.
- Evidence (Đường B — mining):
  - Số liệu mining: trên 105 cặp student–tutor lọc từ 91 conversation của 85 user, 56/105 (53%) học viên yêu cầu tóm tắt nội dung slide/trang cụ thể; 53/105 (50%) tutor báo không tìm thấy nội dung trang/slide; 51/105 (49%) tutor hỏi ngược lại người dùng cung cấp thêm ngữ cảnh; 9/105 (9%) có rating down.
  - ≥5 quote nguyên văn + nguồn:
    1. Case C0076: "tóm tắt slide này" → tutor trả lời: "tôi đã tra cứu ... chưa tìm thấy nội dung cụ thể của Trang 33". Nguồn: mining-log.md.
    2. Case C0031: "tóm tắt các chủ đề chính của slide day05-lecture-slides-batch03.pdf này" → tutor không truy cập được file. Nguồn: mining-log.md.
    3. Case C0414: "Tổng hợp thông tin của toàn bộ bài giảng hôm nay" → tutor không thể truy xuất nội dung tổng hợp. Nguồn: mining-log.md.
    4. Case C0001: "tóm tắt nội dung chính trong slide này" → tutor trả lời không tìm thấy nội dung cho slide 37. Nguồn: mining-log.md.
    5. Case C0021: "giải thích nghĩa chi tiết của trang 4" → tutor lại hỏi người dùng cung cấp nội dung. Nguồn: mining-log.md.
    6. Case C0165: "Tóm tắt slide pdf day2 cho tôi" → tutor xác nhận không truy cập được PDF trực tiếp. Nguồn: mining-log.md.

## §2. Impact & quyết định chọn
- Bảng impact (3 ứng viên):

| Ứng viên | Bao nhiêu người gặp | Tần suất | Mỗi lần tốn gì | Khả thi | Trạng thái |
|---|---:|---:|---|---|---|
| Tutor hiểu ngay trang đang xem và tóm tắt/giải thích nội dung đó | 56+ học viên trong mẫu mining, cộng với các lượt hỏi trang cụ thể | 53% của mẫu có intent tóm tắt trang cụ thể; 28% hỏi giải thích trang | Tốn 1–2 phút và làm gián đoạn flow học vì phải mô tả lại slide | Cao | Chọn |
| Tutor tóm tắt toàn bộ bài giảng từ trang hiện tại | 13/105 (12%) trong mẫu | Thấp hơn nhưng vẫn có nhu cầu review | Tốn nhiều thời gian và dễ sai vì quá rộng | Trung bình | Loại |
| Tutor trả lời câu hỏi về “slide này là gì” khi không có ngữ cảnh | 23/105 (22%) trong mẫu | Tần suất vừa phải | Cần người dùng mô tả lại lại slide | Cao nhưng phụ thuộc vào cùng root cause | Chọn như một nhánh con của feature |

- Ứng viên ĐÃ LOẠI: Tóm tắt toàn bộ bài giảng từ đầu đến cuối, vì nhu cầu xuất hiện ít hơn, phạm vi quá rộng và dễ dẫn đến trả lời dài, thiếu độ chính xác.
- Ứng viên CHỌN: Tutor có khả năng hiểu trang đang xem trong VLearn và trả lời câu hỏi về nội dung trang đó bằng căn cứ, không cần học viên mô tả lại slide. Lý do bằng số: 56/105 lượt hỏi tóm tắt trang cụ thể + 53/105 lượt fail do không biết slide context + 51/105 lượt bị hỏi ngược lại.

## §3. Giải pháp tương tự đã nghiên cứu
- ChatGPT Study Mode: mạnh ở việc giải thích nhưng không tự biết ngữ cảnh trang đang mở trong một hệ thống học tập cụ thể; đáng học ở cách giải thích từng bước, đáng né ở việc không có nguồn/slide context.
- NotebookLM: đáng học ở chỗ luôn gắn câu trả lời với nguồn; đáng né ở chỗ yêu cầu upload tài liệu và không tự lẫn vào flow học hiện tại của VLearn.
- Khanmigo / Quizlet AI: có thể hỗ trợ học tập, nhưng thường không thể trực tiếp hiểu trạng thái “người dùng đang xem trang nào trong bài giảng”. Điểm khác của mình là tích hợp trực tiếp vào flow đọc slide hiện tại của VLearn.

## §4. Thiết kế
- Lát cắt MỘT CÂU: Khi sinh viên đang xem một slide trong VLearn và hỏi về nội dung trang đó, hệ thống tự dùng ngữ cảnh trang đang mở để trả lời ngay bằng căn cứ, và nếu không chắc hoặc ngoài phạm vi thì hỏi lại/thu hẹp phạm vi thay vì bịa.
- Non-goals (không build trong vòng này):
  - Không tự chấm bài/quiz cho học viên.
  - Không hỗ trợ toàn bộ khoá học bằng tìm kiếm tự do ngoài dữ liệu slide đã cung cấp.
  - Không thay thế TA/giảng viên khi câu hỏi cần thẩm quyền chuyên môn.
  - Không xây dựng hệ thống upload và index tài liệu mới ngoài slide hiện có.
- Mức prototype nhắm tới: [x] Working — phần core “dùng slide context hiện tại để trả lời câu hỏi” chạy thật; UI điều hướng và một số fallback sẽ giữ ở mức mock/đơn giản.
- Automation: [x] conditional — phần lớn trường hợp có ngữ cảnh slide rõ ràng sẽ tự trả lời; khi không chắc, thiếu căn cứ hoặc ngoài phạm vi thì chuyển sang hỏi lại/thu hẹp phạm vi. Lý do theo cost-of-error: sai ở đây có thể khiến học viên hiểu sai kiến thức, nên AI không được làm liều; cần có đường lui rõ.
- §4b. Nguyên tắc đã áp dụng:

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| G1 — Làm rõ hệ thống làm được gì | Trên giao diện đầu tiên, hiện rõ: “Mình có thể giải thích nội dung trang hiện tại dựa trên slide đang mở.” |
| G10 — Thu hẹp phạm vi khi nghi ngờ | Nếu không tìm thấy nội dung trang hoặc không có ngữ cảnh đủ, hệ thống trả lời: “Mình không chắc trang này; bạn có thể mở đúng trang hoặc cho mình biết câu hỏi cụ thể hơn.” |
| G9 — Sửa dễ dàng | Người dùng có thể hỏi lại ngay bằng câu ngắn như “không, trang này là…” hoặc “giải thích ngắn hơn”. |
| G11 — Giải thích vì sao | Mỗi câu trả lời có gợi ý “dựa trên [Trang X]” và, khi cần, nêu lý do vì sao không chắc.
| PAIR — Explainability + Trust | Hiển thị trích dẫn [Trang X] và chỉ trả lời khi có căn cứ từ slide đang mở.
| PAIR — Feedback + Control | Người dùng có thể bỏ qua/đổi câu hỏi/đặt câu hỏi tiếp theo bất cứ lúc nào. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (8+)

| Tình huống cụ thể | Lớp | Hành vi mong muốn | Nguyên tắc áp |
|---|---|---|---|
| Học viên hỏi “tóm tắt slide này” nhưng hệ thống không có nội dung trang hiện tại | Nguồn sự thật | Trả lời rõ rằng không có slide context để dùng; không bịa; cho phép mở lại trang đúng | G10, G11 |
| Học viên đang ở trang 33 nhưng hệ thống nhầm sang trang khác do mapping sai | Nguồn sự thật | Nhận diện lỗi, nêu “mình đang dùng trang X”, cho phép người dùng chỉnh lại | G10, G9 |
| Học viên hỏi “giải thích trang 4” nhưng không có đúng page context | Mơ hồ / thiếu thông tin | Hỏi lại 1 câu ngắn: “Bạn đang xem trang nào?” hoặc “Bạn muốn tóm tắt hay giải thích khái niệm?” | G10 |
| Học viên hỏi về một câu hỏi quá rộng như “tóm tắt toàn bộ bài giảng” | Ngoài phạm vi / thẩm quyền | Thu hẹp phạm vi: “Mình có thể tóm tắt trang hiện tại hoặc một phần slide đã chọn” | G10, G11 |
| Học viên hỏi về thời tiết/đời sống thay vì môn học | Ngoài phạm vi / thẩm quyền | Lịch sự chuyển hướng về nội dung học tập, không lẫn sang đời sống | G1 |
| Học viên hỏi về khái niệm khó và AI hiểu sai vì slide không đủ chi tiết | Đặc thù domain | Trả lời bằng cách nêu “dựa trên slide hiện tại” và lưu ý nếu cần hỏi TA/giảng viên | G11 |
| Học viên không đồng ý với câu trả lời: “không, trang này là…” | Correction / sửa sai | Chấp nhận sửa, cập nhật context và phản hồi lại | G9 |
| Học viên đưa một câu hỏi có nhiều nghĩa (ví dụ “giải thích slide này”) | Mơ hồ / thiếu thông tin | Yêu cầu làm rõ bằng một câu hỏi ngắn, không đoán | G10 |

## §6. Bốn đường đi của trải nghiệm
- Happy path: Học viên đang xem slide, hỏi “tóm tắt nội dung chính của trang này”, hệ thống đọc trang hiện tại, trả lời ngắn gọn, có trích dẫn [Trang X].
- Low-confidence (②): Học viên hỏi về trang nhưng ngữ cảnh thiếu hoặc không đủ rõ; hệ thống nói rõ “mình chưa chắc” và hỏi thêm một câu ngắn thay vì đoán.
- Failure/không căn cứ (①): Không có nội dung trang, hoặc mapping page lỗi; hệ thống trả lời bằng thái độ rõ ràng, không bịa, và cho phép người dùng chỉnh lại.
- Correction (user sửa): Người dùng phản hồi “không, mình đang xem trang 14”, hệ thống cập nhật và trả lời lại.
- Khi bị đòi ngoài phạm vi (③): Học viên hỏi chuyện ngoài môn học hoặc yêu cầu làm quá phạm vi; hệ thống chuyển hướng ngắn gọn.
- Case đặc thù domain (④): Nếu câu hỏi cần chuyên môn sâu hoặc có khả năng hiểu sai về kiến thức, hệ thống nhấn mạnh giới hạn và đề xuất hỏi TA/giảng viên.

## §7. Kiểm thử
- Chiều chất lượng + định nghĩa kiểm chứng được:
  - Groundedness: câu trả lời có căn cứ từ slide hiện tại hoặc nói rõ không có căn cứ.
  - Relevance: câu trả lời đúng câu hỏi về trang/slide hiện tại.
  - Safety/clarity: không bịa, không vượt phạm vi, không làm học viên hiểu sai.
- Golden set: file sẽ lưu trong eval/ với tối thiểu 20 case, gồm 8 case thường, 8 case khó/biên, 4 case hiếm; trong đó ≥10 case được phát triển từ chatlog thật hoặc từ dữ liệu mining.
- Quality bar (chốt từ 23:59 N1 và giữ nguyên): “Đạt khi ≥85% các case qua bộ có groundedness pass, và 100% các case out-of-scope/uncertain phải không trả lời sai thành thật.”
- Kết quả các lượt chạy:

| Lượt chạy | Groundedness | Relevance | Safety | Ghi chú |
|---|---:|---:|---:|---|
| Lượt 1 (manual) | TBD | TBD | TBD | Chưa chạy chính thức; sẽ cập nhật trong eval/ |
| Lượt 2 | TBD | TBD | TBD | Sau khi chỉnh prompt và fallback |

## §8. Phân công & kế hoạch
- Phân công có tên: spec / evidence / prompt / code / demo.
  - Spec: viết lại mục tiêu, chỗ khó, quality bar.
  - Evidence: duy trì mining log và ví dụ bằng chứng.
  - Prompt: thiết kế intent classifier + prompt trả lời có slide context.
  - Code: tích hợp vào prototype VLearn Tutor.
  - Demo: chuẩn bị case happy path + case lỗi và dry run.
- Willing users (≥3 người): [Tên 1], [Tên 2], [Tên 3] — sẽ được mời thử trong vòng validation CP5. Kế hoạch validation: 1) giao task thật “hãy dùng trợ lý này để hiểu nội dung trang đang mở”; 2) quan sát chỗ bấm, chỗ khó hiểu; 3) hỏi đúng 3 câu: “Điều gì khó hiểu nhất?”, “Kết quả này có tin không?”, “Bạn có dùng thật không?”. Mỗi người thử sẽ được log thành 1 dòng trong validation/.
- Multi-prototype (nếu làm): hai phương án sẽ được thử trước khi chốt: (1) trả lời ngay khi có slide context, (2) hỏi trước “bạn muốn tóm tắt hay giải thích?” trước khi trả lời. Chọn phương án 1 vì ít gây friction và khớp trực tiếp với pain trong mining log.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 2026-07-31 | Hoàn thiện spec cho feature “slide-aware VLearn Tutor” | Dựa trên bằng chứng mining log và hiện trạng code trong repo |
| 2026-07-31 | Chốt automation ở mức conditional | Vì sai có thể làm học viên hiểu sai kiến thức, nên cần đường lui rõ |
