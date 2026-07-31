# Validation log — CP5

Theo guide §4.2: ≥5 người ngoài nhóm, ưu tiên willing users đã khai ở CP1 + thành viên zone khác. Một phiên 10 phút/người.

## Cách chạy một phiên (đọc trước khi bắt đầu)

1. **Giao task thật** — nói đúng câu: *"Bạn hãy dùng trang này để tìm một đề tài capstone phù hợp với bạn."* Không giải thích thêm cách dùng, không chỉ tay vào nút nào.
2. **Im lặng quan sát** — không thuyết minh, không gợi ý khi họ lúng túng. Ghi lại: họ bấm gì, kẹt ở đâu, mất bao lâu để ra kết quả đầu tiên.
3. **Hỏi đúng 3 câu, theo thứ tự này**:
   - "Điều gì khó hiểu hoặc khó chịu nhất?"
   - "Kết quả này bạn có tin không — vì sao?"
   - "Bạn có dùng thật không — vì sao / vì sao chưa?"
4. **Log nguyên văn ngay lúc đó** — không diễn giải lại, không sửa câu cho "gọn".
5. Nếu người thử chỉ toàn khen → phiên chưa đạt. Đổi task khó hơn (ví dụ: "hãy tìm một đề tài về an ninh mạng dù bạn không giỏi kỹ thuật") hoặc đổi người thử.

Trước khi mời người thử: đảm bảo cả 3 service đang chạy (`codebase/server` :8001, `backend` :8080, frontend :8000) — xem `codebase/README.md` và `backend/README.md`.

## Bảng log

| # | Người thử (tên/vai — willing user?)        | Task | Quan sát (bấm gì, kẹt đâu, mất bao lâu)                                                                                                                                                                                                                                                                                                                                              | Quote nguyên văn (3 câu)                                                                                                                                                                                                                                                                                                                                           | Mức nghiêm trọng                                                                                     |
| - | ----------------------------------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1 | Lưu Xuân Dũng —**willing user (CP1)** | chat | **~3 phút.** Gõ thẳng câu hỏi tự do vào chat (nguyên văn trong quote), không dùng form hồ sơ. Nhận được câu trả lời và **chấp nhận nội dung** ("thấy câu trả lời hợp lý"). Kẹt ở bước sau: yêu cầu đổi sang nhóm đề tài khác → agent không thực hiện được. → **đã tái hiện được lỗi này, xem mục Thay đổi** | "Tôi chuyên backend và không hiểu gì về business thì chọn đề tài AI nào để đảm bảo người dùng nào cũng thấy tốt nhất", "Tôi thấy câu trả lời hợp lý, tuy nhiên khi tôi muốn gợi ý các đề tài khác thì agent chưa thực hiện được"                                                                                    | **gây khó chịu rõ** — người dùng nêu đúng một chức năng không chạy                |
| 2 | Nguyễn Phương Thùy                          | chat | **~3 phút.** Không kẹt ở thao tác nào. Phản ứng xảy ra ở mức khái niệm ngay khi hiểu sản phẩm làm gì — chất vấn lý do tồn tại thay vì hỏi cách dùng                                                                                                                                                                                                        | Tại sao bạn lại cần làm chatbot để tìm ra những đề tài này thay vì thế bạn có thể lên Chatgpt và prompt điểm mạnh và nó cũng sinh ra đề tài như thế?                                                                                                                                                                                   | **chặn hoàn toàn (quyết định dùng tiếp)** — phản đối lý do tồn tại của sản phẩm |
| 3 | Trần Thê Ninh —**willing user (CP1)**  | chat | **~3 phút.** Gõ yêu cầu tìm đề tài vào chat (nguyên văn trong quote: *"Gợi ý cho tôi đề tài liên quan đến Data và sản phẩm thực tế"*) → nhận được kết quả, không kẹt thao tác. Kết luận tiêu cực đến sau khi đã thấy kết quả, không phải do không dùng được                                                                     | Gợi ý cho tôi đề tài liên quan đến Data và sản phẩm thực tế" "Tôi ứng dụng này chưa cần thiết lắm, có thể sử dụng GPT để tra mà"                                                                                                                                                                                                         | **chặn hoàn toàn (quyết định dùng tiếp)** — nói thẳng "chưa cần thiết"              |
| 4 | Lê Thị Trúc Linh                             | chat | **~3 phút.** Xem được danh sách gợi ý và **đánh giá là hợp sở thích**. Kẹt ở khâu ra quyết định chứ không phải thao tác: không có thông tin nào trên màn hình cho biết đề nào khả thi để hoàn thành                                                                                                                                     | “Tôi muốn hệ thống hỏi thêm nhóm có bao nhiêu người, còn bao nhiêu thời gian và có dữ liệu gì trước khi gợi ý. Hiện các đề tài nghe khá phù hợp với sở thích nhưng tôi chưa biết đề nào thực sự có thể hoàn thành. Nếu chỉ dựa trên kỹ năng trong CV thì kết quả chưa khác nhiều so với hỏi ChatGPT.”  | **gây khó chịu rõ** — tin kết quả nhưng không dùng được để ra quyết định        |
| 5 | Nguyễn Thị Huyền Trang                       | chat | **~3 phút.** Đọc hết 3 đề tài đầu và **nhận ra giá trị lõi** (danh sách có sẵn + rủi ro) — người duy nhất trong 5 người tự thấy điều này. Kẹt khi muốn từ chối cả 3 và nêu tiêu chí mới (loại công nghệ / giảm độ khó / dữ liệu dễ tìm)                                                                                        | “Điểm tôi thấy hữu ích là ứng dụng lấy đề tài từ một danh sách có sẵn và đưa ra rủi ro, nhưng khi tôi không thích ba đề đầu thì chưa có cách nói rõ lý do để nhận một nhóm đề khác. Tôi muốn loại một công nghệ, giảm độ khó hoặc yêu cầu đề tài có dữ liệu dễ tìm rồi hệ thống gợi ý lại.” | **gây khó chịu rõ** — thấy hữu ích nhưng bị kẹt khi muốn đổi hướng                |

*(Mức nghiêm trọng: chặn hoàn toàn / gây khó chịu rõ / nhỏ, không ảnh hưởng quyết định dùng tiếp.)*

> **Về cột "Quan sát"**: phần hành vi được rút **trực tiếp từ lời người thử**, không suy đoán — phần lớn họ đã tự thuật lại thao tác của mình (Dũng và Ninh ghi nguyên văn câu đã gõ vào chat; Trang nói rõ đã đọc 3 đề đầu rồi mới kẹt; Linh và Dũng tự đánh giá kết quả trước khi nêu vấn đề). Thời lượng ~3 phút/phiên do người log ghi nhận. Thứ vẫn **không** có: số lần bấm và đường đi chuột trong từng phiên — xem ghi chú cuối file.

## Tổng hợp sau 5 phiên

### Điều bảng quan sát cho thấy rõ nhất

**4/5 người không kẹt ở bất kỳ thao tác nào.** Thùy chất vấn ngay ở mức khái niệm trước cả khi dùng; Ninh gõ yêu cầu, nhận kết quả bình thường rồi mới kết luận "chưa cần thiết"; Linh xem được danh sách và thấy hợp sở thích; Trang đọc hết 3 đề đầu. Chỉ Dũng gặp lỗi chức năng thật (không đổi được nhóm đề tài) — và lỗi đó đã tái hiện được 2/3 lần rồi sửa.

Điều này định hướng lại việc cần ưu tiên: **vấn đề của sản phẩm không nằm ở khả năng dùng (usability), mà ở tính thuyết phục.** Người dùng vào được, gõ được, nhận được kết quả, hiểu được kết quả — rồi vẫn kết luận là không cần. Sửa nút bấm hay luồng onboarding sẽ không chạm được vào phản hồi của Thùy, Ninh, Linh.

### Chủ đề lặp nhiều nhất

**1. "Sao không dùng thẳng ChatGPT?" — 3/5 người nêu (Thùy, Ninh, Linh).** Đây là phản hồi nặng nhất, và nó không phải về lỗi giao diện mà về lý do tồn tại của sản phẩm. Thùy hỏi thẳng *"tại sao bạn lại cần làm chatbot... thay vì lên Chatgpt và prompt điểm mạnh"*; Ninh kết luận *"chưa cần thiết lắm, có thể sử dụng GPT để tra mà"*; Linh cụ thể hơn: *"nếu chỉ dựa trên kỹ năng trong CV thì kết quả chưa khác nhiều so với hỏi ChatGPT"*.

Điểm đáng chú ý: chính Trang — người duy nhất nói rõ điều thấy hữu ích — đã chỉ ra khác biệt thật mà 3 người kia không nhận ra: *"ứng dụng lấy đề tài từ một danh sách có sẵn và đưa ra rủi ro"*. Tức là giá trị lõi (chọn trong 170 đề tài có thật, kèm `rui_ro_domain` từ dữ liệu, không bịa) **có tồn tại nhưng sản phẩm không truyền đạt được** — người dùng phải tự phát hiện ra.

**2. Không đổi được hướng sau khi đã có gợi ý — 2/5 người (Dũng, Trang).** Dũng: *"khi tôi muốn gợi ý các đề tài khác thì agent chưa thực hiện được"*. Trang cụ thể hơn: *"khi tôi không thích ba đề đầu thì chưa có cách nói rõ lý do để nhận một nhóm đề khác... muốn loại một công nghệ, giảm độ khó hoặc yêu cầu đề tài có dữ liệu dễ tìm rồi hệ thống gợi ý lại"*.

**3. Thiếu tín hiệu về tính khả thi — 1/5 (Linh), nhưng đáng lưu ý.** *"các đề tài nghe khá phù hợp với sở thích nhưng tôi chưa biết đề nào thực sự có thể hoàn thành"* — Linh muốn hệ thống hỏi thêm số người, thời gian còn lại, dữ liệu sẵn có trước khi gợi ý.

### Thay đổi làm trước demo (→ đã ghi vào Changelog `spec.md` §9)

**Đã sửa xong và đo lại — chủ đề 2 (Dũng + Trang):**

| Feedback                                                                    | Đã làm gì                                                                                                                                    | Kiểm chứng                                                                                                                                                                                         |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dũng: không xin được nhóm đề tài khác                             | Thêm lọc cứng theo`ma_de` trong `_retrieve_candidates` + quy tắc prompt bắt agent đưa toàn bộ mã đang hiển thị vào `exclude` | Trước sửa:**2/3 lần** vẫn trả lại đúng đề tài vừa bị từ chối. Sau sửa: **4/4 lần** không mã nào trùng lại                                                         |
| Trang: muốn loại công nghệ / giảm độ khó / đòi dữ liệu dễ tìm | `exclude` (loại công nghệ) + `khoi`/`max_team` (lọc cứng) + `randomize` đã có từ đợt mở rộng tool                           | *"bỏ mấy đề dùng machine learning đi, tôi muốn đề dễ hơn"* → 3 đề tài DATA không ML; *"đề tài có dữ liệu dễ tìm"* → trả kết quả kèm `confidence=low` đúng mức |

Trong lúc sửa cho Dũng, một bug mới phát sinh: model bắt đầu trả `selections` **rỗng** (2/3 lần) trong khi vẫn nói "Mình đã tìm các đề tài mới" — vì quy tắc "thiếu thì trả ít hơn 3, không độn" khiến nó hiểu nhầm việc bị loại vài mã là "kho không còn gì phù hợp". Đã sửa prompt nói rõ *"hệ thống đã loại sẵn các mã đó, mọi đề tài công cụ trả về đều hợp lệ"* — sau đó 4/4 lần đều có kết quả. Ghi lại vì đây đúng kiểu "sửa A phá B" mà nhóm đã gặp ở eval lượt 2-3.

### Giữ nguyên có lý do

**Không thêm bước hỏi thời gian / dữ liệu sẵn có trước khi gợi ý (Linh).** Đề xuất này đúng về mặt sản phẩm — tính khả thi là thứ hệ thống hiện không đánh giá được. Nhưng làm đúng nghĩa là phải có dữ liệu về effort thật của từng đề tài trong 170 đề, mà `mock-data.json` không có field đó; nếu chỉ hỏi thêm 2 câu rồi vẫn xếp hạng bằng cùng một cơ chế thì đó là **giao diện giả vờ cá nhân hoá** — thêm ma sát mà không thêm thông tin. Ưu tiên trước demo là sửa thứ đã hỏng (chủ đề 2) hơn là thêm thứ chưa có căn cứ dữ liệu.

**Không phản bác trực tiếp "sao không dùng ChatGPT" bằng cách thêm câu quảng cáo vào UI.** Vấn đề là sản phẩm chưa *chứng minh* được khác biệt, không phải chưa *tuyên bố* nó. Thêm dòng chữ "chúng tôi khác ChatGPT vì..." không làm người dùng tin hơn.

### Đưa vào backlog (slide 6)

1. **Làm lộ ra giá trị lõi ngay trong luồng chính** — ưu tiên cao nhất, vì 3/5 người không nhận ra nó. Ý tưởng cụ thể từ chính quote của Trang: hiển thị rõ "đề tài này nằm trong danh mục X đề tài đã được duyệt của trường" + `rui_ro_domain`/`hitl` lấy từ dữ liệu thật, kèm chỉ dấu cho biết đây là thông tin *tra được*, không phải AI tự nghĩ ra.
2. **Đánh giá tính khả thi** (Linh) — cần bổ sung field effort/thời gian/dữ liệu-sẵn-có vào kho đề tài trước, rồi mới hỏi user.
3. **Cho phép nói lý do từ chối bằng lời** (Trang) — hiện agent làm được khi user gõ rõ ("bỏ ML đi"), nhưng chưa có lối tắt trên UI (nút "không thích vì...").
4. Hai hạn chế agent còn lại đã biết từ đợt tự phản biện: tiền giả định sai và input rác vẫn ra `confidence=high`.

## Người ưu tiên mời

- Đã thử thật (5 người, ngoài nhóm, mỗi phiên ~3 phút): **Lưu Xuân Dũng** (willing user CP1) · Nguyễn Phương Thùy · **Trần Thê Ninh** (willing user CP1) · Lê Thị Trúc Linh · Nguyễn Thị Huyền Trang
- Willing user từ CP1: **2/2 đạt yêu cầu rubric R6** — Dũng và Ninh
- Ai log: **Điền Mạnh Hùng** (vai trò prompt) — trực tiếp chạy 5 phiên và ghi nhận quote, thời lượng, danh tính willing user
