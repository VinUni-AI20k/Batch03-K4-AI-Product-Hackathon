# PRODUCT CANVAS — VLEARN GROUNDED TUTOR

| Thông tin | Nội dung |
|---|---|
| **Nhóm** | `[Tên nhóm]` |
| **Zone** | `[Zone]` |
| **Hướng** | **A — VLearn:** tối ưu AI Tutor hiện có |
| **Loại** | Tối ưu tính năng có sẵn |
| **Mức prototype** | Mock — flow bấm được, dữ liệu giả ở giao diện và AI thật tại quyết định có đủ căn cứ hay không |

## 1. Canvas CP1

| Thành phần | Nội dung |
|---|---|
| **Job executor** | Học viên đang đọc slide/tài liệu trên VLearn và cần hiểu, tóm tắt hoặc phân biệt một khái niệm trong bài. |
| **Core JTBD** | Hiểu và kiểm tra lại một khái niệm trong tài liệu đang học để tiếp tục bài học mà không phải chuyển qua nhiều nguồn khác. |
| **Pain cụ thể** | Khi học viên hỏi để hiểu nội dung đang học, nhiều câu trả lời không chỉ ra căn cứ nằm ở trang/đoạn nào, khiến học viên khó kiểm tra lại và không biết nên tin câu trả lời đến mức nào. |
| **Bằng chứng ban đầu** | Trong 740/1.261 turn được heuristic nhận diện là câu hỏi học thuật, **258/740 turn không có citation (34,9%)**, ảnh hưởng **170 học viên** và **201 hội thoại**. Trong mẫu học thuật có rating, **16/21** lượt không citation bị downvote, so với **4/19** lượt có citation. |
| **Lát cắt một câu** | Một học viên đang đọc tài liệu và hỏi về một khái niệm được Tutor quyết định trả lời kèm nguồn khi có đủ căn cứ, hoặc nói rõ chưa đủ căn cứ khi không tìm thấy nguồn, để học viên kiểm tra và tiếp tục học. |
| **Automation** | **Conditional:** tự trả lời khi nguồn đủ mạnh; nếu nguồn không đủ thì nói rõ giới hạn, thu hẹp phạm vi và hỏi lại. |
| **Lý do automation** | Trả lời sai hoặc dùng nguồn không hỗ trợ có thể khiến học viên học sai và mất niềm tin. Chi phí hỏi lại thấp hơn chi phí trả lời chắc chắn nhưng không có căn cứ. |
| **Willing users** | **Lâm Vũ** · **Lê Văn Tuấn** · **Cao Hương Giang** — học viên lớp D303, đã đồng ý thử lúc 14:00 ngày 2 |
| **Phân công** | Evidence/mining: `[Tên]` · Product/spec: `[Tên]` · Retrieval/prompt: `[Tên]` · Prototype/code: `[Tên]` · Eval/demo: `[Tên]` |

## 2. Problem–Evidence–Impact

| Thành phần | Nội dung |
|---|---|
| **Problem statement** | Học viên đang tìm cách hiểu nội dung trong tài liệu nhưng không có đủ căn cứ để kiểm tra câu trả lời nhận được, dẫn đến mức tin không phù hợp và gián đoạn luồng học. |
| **Nguồn dữ liệu** | `chat_history_anonymized_for_hackathon.csv`, từ 22–29/07/2026 |
| **Đơn vị phân tích** | Một `turn_id` = một câu hỏi của học viên + một câu trả lời của Tutor |
| **Quy mô dữ liệu** | 1.261 turn · 369 học viên · 585 hội thoại |
| **Cách nhận diện intent học thuật** | Câu hỏi chứa ít nhất một từ/cụm: giải thích, tóm tắt, tóm gọn, nội dung, là gì, tại sao, vì sao, ý nghĩa, phân tích, ví dụ, kiến thức, nắm vững, khái niệm, so sánh hoặc phân biệt |
| **Cách nhận diện thiếu citation** | Trường cấu trúc `citations` của message Tutor bằng danh sách rỗng `[]` |
| **Kết quả chính** | 258/740 turn học thuật không citation — 34,9% |
| **Độ phủ người dùng** | 170/369 học viên — 46,1% tổng số học viên trong data |
| **Độ phủ hội thoại** | 201/585 hội thoại — 34,4% tổng số hội thoại |
| **Tín hiệu hậu quả** | Trong mẫu học thuật có rating: nhóm không citation có 16/21 downvote; nhóm có citation có 4/19 downvote |
| **Giới hạn bằng chứng** | Intent là heuristic; rating có cỡ mẫu nhỏ và selection bias; không citation không đồng nghĩa câu trả lời sai; có citation cũng chưa đảm bảo nguồn hỗ trợ đúng claim |

## 3. So sánh các pain candidate

| Pain candidate | Quy mô quan sát | Tần suất trên user bị ảnh hưởng | Hậu quả/proxy | Khả thi | Quyết định |
|---|---:|---:|---|---|---|
| **Câu hỏi học thuật không citation** | 258 turn · 170 user · 201 hội thoại | 1,52 turn/user | 16/21 lượt có rating bị downvote | Cao: cải thiện retrieval, threshold, output và fallback | **Chọn** |
| Tutor báo không tìm thấy hoặc không đủ nguồn | 291/1.261 turn · 170 user theo heuristic rộng | 1,71 turn/user | Không hoàn thành job, phải hỏi lại hoặc tự tìm | Trung bình: cần tách lỗi retrieval khỏi câu ngoài phạm vi | Giữ làm failure mode |
| Câu trả lời quá dài so với câu hỏi | 316/1.261 turn · 150 user | 2,11 turn/user | Tăng công đọc nhưng chưa đo được số phút | Cao, nhưng phụ thuộc intent và sở thích | Loại ở vòng này |

## 4. Giải pháp trong phạm vi prototype

| Bước | Input/trạng thái | Quyết định hoặc hành vi | Output cho người dùng |
|---:|---|---|---|
| 1 | Câu hỏi + trang/đoạn đang chọn | Truy xuất các đoạn nguồn liên quan | Danh sách nguồn ứng viên |
| 2 | Câu hỏi + nguồn ứng viên | AI quyết định `SUPPORTED`, `LOW_CONFIDENCE` hoặc `NO_EVIDENCE` | Trạng thái đủ căn cứ |
| 3A | `SUPPORTED` | Chỉ tạo claim được nguồn hỗ trợ | Câu trả lời ngắn, citation cạnh từng claim |
| 3B | `LOW_CONFIDENCE` | Chỉ trả lời phần có căn cứ và hỏi một câu làm rõ | Phần đã biết, giới hạn và câu hỏi tiếp theo |
| 3C | `NO_EVIDENCE` | Không tạo claim học thuật ngoài nguồn | Thông báo chưa tìm thấy căn cứ và bước tiếp theo |
| 4 | User báo citation không hỗ trợ | Giữ câu hỏi, đổi/chọn lại nguồn và sinh lại | Câu trả lời đã sửa cùng citation mới |

## 5. Phạm vi và non-goals

| Trong phạm vi | Ngoài phạm vi |
|---|---|
| Câu hỏi học thuật dựa trên tài liệu đang mở | Xây lại toàn bộ Tutor hoặc VLearn |
| Quyết định có đủ căn cứ để trả lời | Trả lời logistics của Discord |
| Citation cạnh từng claim | Trả lời kiến thức ngoài tài liệu bằng trí nhớ mô hình |
| Fallback khi thiếu nguồn | Tự động chấm điểm học viên |
| Flow báo citation sai và sửa lại | Xây bản đồ lỗ hổng kiến thức toàn lớp |

## 6. Bốn lớp chỗ khó

| Lớp | Kịch bản cụ thể | Hành vi mong muốn |
|---|---|---|
| **① Nguồn sự thật** | Retrieval trả về đoạn không hỗ trợ claim hoặc sai trang | Không dùng đoạn đó làm căn cứ; hiển thị nguồn để user kiểm tra |
| **② Mơ hồ/thiếu thông tin** | User hỏi “giải thích cái này” nhưng không có đoạn được chọn | Hỏi lại đúng một câu hoặc yêu cầu chọn đoạn |
| **③ Ngoài phạm vi/thẩm quyền** | User hỏi ngoại hình, xin file tải xuống hoặc hỏi ngoài khóa | Từ chối ngắn và chỉ đường hữu ích trong phạm vi |
| **④ Đặc thù domain** | Citation đúng trang nhưng không hỗ trợ đúng khái niệm được giải thích | Không tính là pass; cho phép report và correction ngay trên output |

## 7. Bốn đường đi trải nghiệm

| Đường đi | Trigger | Hành vi của prototype | Kết quả mong muốn |
|---|---|---|---|
| **Happy path** | Có nguồn trực tiếp hỗ trợ câu hỏi | Trả lời từng ý kèm citation | User mở đúng nguồn và tiếp tục học |
| **Low-confidence** | Nguồn chỉ hỗ trợ một phần | Trả lời phần có căn cứ, nêu giới hạn và hỏi lại | Không biến phần chưa biết thành câu trả lời chắc chắn |
| **Failure** | Không có nguồn phù hợp | Không đoán; đề nghị chọn đoạn, nhập trang hoặc thu hẹp câu hỏi | User có bước tiếp theo rõ ràng |
| **Correction** | User báo citation không hỗ trợ ý | Cho xem/chọn nguồn khác và sinh lại | Sửa được output mà không bắt đầu lại toàn bộ flow |

## 8. Nguyên tắc HAX/PAIR

| Nguyên tắc | Cách áp dụng cụ thể |
|---|---|
| **G1 — Làm rõ hệ thống làm được gì** | Màn hình đầu nói rõ Tutor chỉ trả lời dựa trên tài liệu khóa học |
| **G2 — Làm rõ nó làm tốt đến đâu** | Hiển thị rõ ba trạng thái có căn cứ, chưa đủ căn cứ và không có căn cứ |
| **G10 — Thu hẹp khi nghi ngờ** | Low-confidence hỏi lại hoặc chỉ trả lời phần được nguồn hỗ trợ |
| **G11 — Giải thích vì sao** | Citation đặt cạnh claim và mở được đúng đoạn nguồn |
| **G9 — Sửa dễ dàng** | User có thể báo citation sai và yêu cầu tạo lại |
| **G15 — Feedback chi tiết** | Feedback có lý do: sai nguồn, sai ý, quá dài hoặc lý do khác |

## 9. Giả thuyết và thước đo

| Thành phần | Nội dung |
|---|---|
| **Giả thuyết sản phẩm** | Nếu mỗi claim học thuật có nguồn hỗ trợ dễ kiểm tra và Tutor biết dừng khi không đủ nguồn, học viên sẽ tin đúng mức hơn và ít phải rời VLearn để kiểm tra lại. |
| **North-star cho prototype** | Tỷ lệ case học thuật được xử lý đúng chế độ: trả lời có căn cứ hoặc từ chối đúng khi thiếu căn cứ |
| **Citation coverage** | 100% claim học thuật có citation |
| **Citation faithfulness** | ≥90% citation thực sự hỗ trợ claim theo hai người chấm độc lập |
| **Abstention correctness** | 100% case không đủ nguồn không tạo claim học thuật ngoài nguồn |
| **Answer relevance** | ≥85% case trả lời đúng intent, không chỉ lặp lại tài liệu |
| **Correction success** | 100% case correction hoàn thành được flow báo lỗi và tạo lại |
| **Quality bar tổng đề xuất** | ≥85% toàn bộ golden set, đồng thời không có lỗi hard constraint về bịa nguồn |

> Quality bar chỉ là đề xuất. Nhóm phải thống nhất, ghi vào `spec.md` trước 23:59
> ngày 1 và không thay đổi sau khi thấy kết quả test.

## 10. Validation và willing users

| Nội dung | Kế hoạch |
|---|---|
| **Ba willing users CP1** | **Lâm Vũ** · D303 · đã đồng ý · 14:00 ngày 2<br>**Lê Văn Tuấn** · D303 · đã đồng ý · 14:00 ngày 2<br>**Cao Hương Giang** · D303 · đã đồng ý · 14:00 ngày 2 |
| **Task giao cho user** | “Hãy dùng prototype để hiểu khái niệm trong đoạn tài liệu này và quyết định xem bạn có đủ tin tưởng để tiếp tục làm bài hay không.” |
| **Câu hỏi 1** | Điều gì khó hiểu hoặc khó chịu nhất? |
| **Câu hỏi 2** | Bạn có tin kết quả này không — vì sao? |
| **Câu hỏi 3** | Bạn có dùng thật không — vì sao hoặc vì sao chưa? |
| **Mẫu validation CP5** | Ít nhất 5 người ngoài nhóm, trong đó có ít nhất 2 willing users đã khai tại CP1 |
| **Output cần lưu** | Tên/vai trò, task, quan sát, quote nguyên văn, mức nghiêm trọng và thay đổi sau feedback |

## 11. Phân công

| Workstream | Người phụ trách | Artifact |
|---|---|---|
| Evidence + manual review | `[Tên]` | Log review, phương pháp đếm và ≥5 ví dụ |
| Survey + willing users | `[Tên]` | Log khảo sát và danh sách người thử |
| Product + spec | `[Tên]` | Canvas và `spec.md` |
| Retrieval/prompt | `[Tên]` | Quyết định supported/low/no-evidence |
| Prototype/code | `[Tên]` | Flow bấm được và ít nhất một AI call thật |
| Golden set/eval | `[Tên]` | ≥20 case và bảng kết quả đầy đủ |
| Validation/demo | `[Tên]` | Feedback log, slide và demo script |

## 12. Checklist trước CP1

| Điều kiện | Trạng thái |
|---|:---:|
| Hướng A và loại tối ưu tính năng hiện có | ✅ |
| Pain một câu: ai, làm gì, vướng đâu, hậu quả gì | ✅ |
| Có bằng chứng mining ban đầu và phương pháp đếm | ✅ |
| Lát cắt đúng format một câu | ✅ |
| Mức automation và lý do cost-of-error | ✅ |
| Đọc tay ít nhất 20 case flagged, ghi tỷ lệ valid | ⬜ |
| Điền ba willing users thật ngoài nhóm | ✅ |
| Điền tên phân công cho từng phần | ⬜ |
| Điền tên nhóm và zone | ⬜ |

## 13. Tài liệu truy vết

| Tài liệu | Đường dẫn trong repo |
|---|---|
| EDA notebook | `eda/vlearn_ai_tutor_eda.ipynb` |
| Báo cáo mining | `eda/bao-cao-de-xuat-bai-toan.md` |
| Product Canvas chi tiết | `product-canvas.md` |
| Data dictionary | `data/vlearn-pack/chatlog/DATA_DICTIONARY.md` |
