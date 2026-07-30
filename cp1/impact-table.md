# Nguyên liệu cho spec — §1, §2 và §4 non-goals

> Không cần ở CP1 (canvas CP1 chỉ có 8 mục theo `02-guide.md` §1.5). Dùng khi viết spec, hạn chốt 23:59 N1. Rubric R1 cho **3 điểm** cho bảng impact và **3 điểm** cho "ứng viên đã loại + lý do chọn bằng số"; R2 cho **2 điểm** cho ≥3 non-goals — nên phần bị loại và phần bị phủ định ở dưới **đừng dọn cho gọn**, nó chính là phần ăn điểm.

## Non-goals — cho spec §4 (≥3, đây là 5)

1. **Vẽ sơ đồ / sinh hình ảnh** — không một lượt nào trong 1.261 lượt xin AI vẽ sơ đồ; học viên chỉ hỏi để **hiểu** sơ đồ có sẵn (`"Giải thích biểu đồ đc bôi đỏ"`, `"phân tích hình ảnh được khoanh đỏ ở slide 59"`). Build là build trên 0 bằng chứng, và thêm một dạng output thứ hai → phá "1 kết quả".
2. **Câu hỏi gợi ý chủ động** — là quyết định AI thứ hai (khi nào chen vào + gợi ý gì). Field `follow_ups` đã có sẵn trong schema và rỗng 0/1.261 → đang nằm trên roadmap VLearn.
3. **Tính năng "ôn tập" riêng** — không build màn ôn tập. Nhu cầu ôn tập (`T0258` *"chỉ ra những kiến thức trọng tâm cần thi"*, `T0932` *"tôi cần chuẩn bị..."*) được phục vụ bằng chính bản tóm tắt có trích dẫn — nó là **mục đích** của việc xin tóm tắt, không phải tính năng thứ hai.
4. **Sửa retrieval production của VLearn** — prototype dựng retrieval tối thiểu trên corpus của data pack: `data/vlearn-pack/slides/` (2 bộ bản hackathon, 29 trang/bộ, text extract được sạch) + 6 transcript (700 đoạn có mã `[Txx-NNN]`); đóng góp nằm ở lớp quyết định.
5. **Bản đồ lỗ hổng cho giảng viên · câu hỏi logistics · lượt chào hỏi · tối ưu độ dài câu trả lời** — cái cuối đã đo và loại: nhóm trả lời dài nhất 0/10 👎.

## Bảng impact

> Nền: 1.261 turn · **369 user** · 8 ngày (22–29/07/2026). Khoá có ~1.000 học viên.

| Ứng viên | Bao nhiêu người | Tần suất | Tốn gì mỗi lần | 👎 | Chọn? |
|---|---|---|---|---|---|
| **① Trang đang mở: gõ tự do không tra được nội dung** | **112/369 = 30%** → ~300/1.000 HV | 160 lượt · **20 lượt/ngày** · 1,4 lượt/user | **62,5% câu hỏi không bao giờ được trả lời** (100/160) · **49% là câu hỏi cuối cùng trong ngày** (78/160) · ca được trả lời phải hỏi lại thêm 1 lượt | **15/15 = 100%** | ✅ **CHỌN** |
| **② Cả bộ: xin tổng quan/tóm tắt cả buổi** | **53/369 = 14%** → ~145/1.000 HV | 67 lượt · **8,4 lượt/ngày** · 1,3 lượt/user | **56,5% không được giải quyết** (13/23 ca từ chối thẳng) · 43,5% hội thoại dừng luôn tại đó | 4/5 = 80% | ✅ **CHỌN** (cùng một quyết định) |
| ③ Trả lời nội dung nhưng không nguồn nào | 206/369 = 56% | 412 lượt · 51,5 lượt/ngày | Không đo được bằng "không giải quyết" vì tutor **có** trả lời — cái mất là khả năng tự kiểm | 14/26 = 54% | Gộp vào lát cắt, không lấy làm lý do chọn |
| ④ Trích dẫn lệch trang đang xem | 147/369 = 40% | 239 lượt · 29,9 lượt/ngày | Kiểm chéo sai trang; không đo được đúng/sai vì thiếu `slides/` | 6/15 = 40% | ❌ Loại — cần `slides/` mới verify, pack chưa có |
| ⑤ Trả lời quá dài (top 25%) | 146/369 = 40% | 313 lượt · 39,1 lượt/ngày | **Không tốn gì đo được** — 0/10 👎 | **0/10 = 0%** | ❌ **Loại — đo ra thì không phải pain** |

### Cách đo cột "tốn gì mỗi lần" *(verify.py §8)*

Với mỗi lượt bị từ chối, xét các lượt **sau** nó trong cùng hội thoại: học viên có hỏi lại không, mấy lượt nữa mới được trả lời, và có bao giờ được giải quyết không.

Lỗ hổng đã bịt: *"học viên có thể mở hội thoại mới để hỏi lại"*. Đo: trong **84** ca hội thoại dừng luôn tại lượt bị từ chối, chỉ **6/84 = 7,1%** mở hội thoại khác trong cùng ngày; **78/84 = 92,9%** không mở nữa. Nên con số "bỏ hẳn" không phải ảo giác do cắt theo hội thoại.

Không dùng cột "phút" làm chi phí chính: khoảng cách tới lượt hỏi kế tiếp là median 0,8 phút (p90 17 phút), nhưng đó là **thời gian giữa hai tin nhắn**, không phải thời gian học viên loay hoay — họ có thể đang nghe giảng. Chỉ dùng làm biên trên.

*(Đối chứng: nhóm trả lời có trích dẫn **đúng** trang → chỉ 2/14 = 14% 👎)*

**Lý do chọn bằng số:** ① không phải ứng viên rộng nhất — ③ ảnh hưởng 56% user so với 30% của ①. Nhưng ① là ứng viên **đau nhất**: 100% 👎 và là ứng viên duy nhất **không có một lượt 👍 nào**, so với 54% của ③. Cộng thêm ① có nguyên nhân gốc xác định được (`T0482`) nên biết chính xác phải sửa gì, còn ③ thì không. ② được chọn cùng vì nó hỏng vì **cùng một lý do** (hệ thống không suy nghĩ về phạm vi nào nó có căn cứ) nên một quyết định phủ cả hai.

## Trigger xác định — bằng chứng mạnh nhất

Giao diện VLearn (ảnh 30/07/2026) cho thấy panel tutor hiện nhãn `NGỮ CẢNH: SLIDE TRANG 37` **kèm nguyên văn nội dung slide** khi học viên bôi đen. Suy ra: gõ câu hỏi tự do thì tutor chỉ nhận được *số trang*. Kiểm trên data:

| Đường vào | Số lượt | Tutor nói "không tìm thấy" | Rating |
|---|---|---|---|
| **Gõ câu hỏi tự do** — tutor chỉ nhận số trang | 757 | 160 = **21,1%** | 32 👎 / 19 👍 = **63% 👎** |
| **Bôi đen** — text slide được truyền vào prompt | 495 | 10 = **2,0%** | 5 👎 / 14 👍 = 26% 👎 |

**Chênh 10 lần.** Và độ dài đoạn bôi đen không liên quan — bôi đen ngắn <30 ký tự thất bại 3,1%, vừa 0,6%, dài >200 ký tự 1,8%. Biến duy nhất là **có nội dung được truyền hay không**.

*Quy tắc phân nhóm:* mỗi tin nhắn học viên có dạng `(Trang N, đoạn được chọn: "X") + câu gõ`. Nếu `X` trùng câu gõ → UI echo lại câu hỏi, tức **không bôi đen thật**. Nếu `X` khác → có bôi đen, text slide được truyền. Script kiểm lại được.

**Nghĩa là:** hệ thống đang render nội dung trang đó trên màn hình nhưng không dùng nó làm căn cứ khi học viên gõ câu hỏi tự do — nó đem số trang đi keyword-search thay vì đọc trang đang mở.

**Hệ quả cho demo (CP6):** lỗi **tái tạo được theo lệnh** — cùng một câu hỏi, cùng một trang, chạy hai lần (một lần bôi đen, một lần không). Đó là kịch bản cho *"1 case chuẩn + 1 case chỗ khó"* mà [02-guide.md](../02-guide.md) §5.1 yêu cầu.

**Nguyên nhân gốc — tutor tự khai:**
> *"Rất tiếc là mình chưa thấy được nội dung cụ thể mà bạn đã bôi đỏ trên **Trang 12** (do mình chỉ có thể tìm kiếm theo từ khóa)"* — `T0482`

> *"hệ thống tìm kiếm không trả về kết quả liên quan đến từ khóa này tại vị trí đó"* — `T0062`

Retrieval là **keyword search trên toàn tài liệu**, không phải tra cứu địa chỉ theo trang. Nên "trang 33" bị đem đi search như từ khoá và trả về các trang chứa "33%" (`T1258`).

## ≥5 ví dụ nguyên văn (spec §1)

| Mã | HV đang ở | Câu hỏi | Tutor trả lời |
|---|---|---|---|
| `T0769` | trang 4 | giải thích nghĩa chi tiết của trang 4 | *"...không tìm thấy nội dung cụ thể cho trang 4... Bạn có thể vui lòng cung cấp nội dung hoặc tiêu đề của trang 4 đó..."* |
| `T1258` | trang 33 | tóm tắt slide này | *"...chưa tìm thấy nội dung cụ thể của Trang 33. Kết quả tìm kiếm chỉ hiển thị các trang khác có nhắc đến con số "33" (như mức điểm 33%... trên trang 60 và 72)."* |
| `T0549` | trang 41 | Explain detail on section 04, page 41 | *"...không tìm thấy nội dung chi tiết cho mục "Workflow pain point" tại trang 41..."* |
| `T0408` | trang 14 | tóm tắt các chủ đề chính của slide day05...pdf | *"...không thể tìm thấy tệp tin hoặc nội dung chi tiết của day05-lecture-slides-batch03.pdf..."* |
| `C0001` | trang 37 | tóm tắt nội dung chính trong slide này | *"...không tìm thấy nội dung cụ thể cho slide 37... Bạn có thể cung cấp thêm thông tin hoặc tiêu đề của slide đó..."* |

## Phương pháp đếm (chuẩn B — phải kiểm lại được)

- **Đếm gì:** lượt hỏi-đáp (turn) mà nội dung tutor khớp một trong: `không tìm thấy` · `không thể tìm thấy` · `chưa tìm thấy` · `không thể truy cập` · `không tìm được`
- **Trên bao nhiêu mẫu:** toàn bộ 1.261 turn (2.522 dòng, 369 user, 585 hội thoại)
- **Quy tắc xếp loại:** ưu tiên theo thứ tự ① khớp regex trên → ② cột `citations` rỗng → ③ có citations nhưng không chứa trang học viên đang xem → OK
- **Kiểm lại:** chạy script, ra đúng 171

## Giới hạn bằng chứng — ghi nhận trung thực

1. **Rating thưa.** Chỉ 70/2.522 tin nhắn có rating (2,8%). Mọi tỷ lệ 👎 ở trên đứng trên 70 điểm dữ liệu; "15/15" là mười lăm người. Cái đỡ được: **so sánh giữa các nhóm** đáng tin hơn từng số lẻ, vì thiên lệch "ai rate thường là người bực" áp đều cho cả 5 nhóm.

2. **Bộ đếm bắt nhầm và bỏ sót.** Bộ rộng ra 23,2% nhưng có false positive (câu trả lời thật chứa chữ "rất tiếc"). Bộ hẹp ra 13,6% nhưng bỏ sót ca nói bằng cách khác — `T0176` (*"hệ thống không hiển thị danh mục tóm tắt..."*) là UV1 thật mà regex không bắt. **Con số thật nằm giữa 13,6% và 23,2%; lấy 13,6% làm biên dưới.**

3. **Một giả thuyết đã kiểm và KHÔNG ĐỨNG VỮNG.** Giả thuyết: "bị từ chối thì học viên bỏ cuộc". Kết quả **phụ thuộc bộ đếm**, nên ghi cả hai:

   | Bộ đếm | Câu đầu bị từ chối → chết sau 1 câu | Câu đầu được trả lời | Lệch |
   |---|---|---|---|
   | Rộng | 82/156 = 52,6% | 227/429 = 52,9% | −0,3 điểm |
   | Hẹp *(bộ dùng cho con số chính)* | 54/90 = 60,0% | 255/495 = 51,5% | **+8,5 điểm** |

   Bộ hẹp cho hiệu 8,5 điểm đúng chiều giả thuyết, nhưng n=90 nên chưa phân biệt được với nhiễu (z≈1,5 · p≈0,14). **Kết luận: chưa có bằng chứng → không dùng con số 309/585 (hội thoại 1 turn) làm hậu quả.** Việc hỏi-một-câu-rồi-thôi có thể chỉ là cách dùng bình thường trong giờ học.

   **Phân biệt với cột "tốn gì mỗi lần" ở trên — hai phép đo khác nhau, không mâu thuẫn:** ở đây câu hỏi là *"tỷ lệ hội thoại chết có khác nhau giữa hai nhóm không"* → chưa kết luận được. Ở §8 câu hỏi sắc hơn: *"câu hỏi bị từ chối có bao giờ được trả lời không"* → đo rõ, 62,5% không, và 92,9% ca dừng luôn thì không mở hội thoại nào khác trong ngày. Cái thứ hai không cần nhóm đối chứng nên đo được; cái thứ nhất cần và n quá nhỏ.

4. **Một giả thuyết đã kiểm và BỊ ĐẢO NGƯỢC.** Giả thuyết: "trả lời quá dài gây khó chịu" (hỏi median 35 ký tự → trả 768). Đo: nhóm trả lời dài nhất **0%** bị 👎; nhóm ngắn nhất **76%** bị 👎. Học viên thích câu dài, ghét câu ngắn — vì ngắn phần lớn là câu từ chối (median 362 ký tự vs 882 của câu trả lời thật). Ứng viên ⑤ bị loại vì chính lý do này.

5. **Một giả thuyết đã kiểm và ĐƯỢC XÁC NHẬN.** Giả thuyết (từ ảnh giao diện): "thất bại tập trung ở đường gõ-câu-hỏi-tự-do, vì đường đó không được truyền nội dung slide". Đo: 21,1% vs 2,0% — chênh 10 lần, và độ dài đoạn bôi đen không phải biến giải thích. Đây là bằng chứng mạnh nhất của bộ, vì nó vừa có số vừa có cơ chế.

6. **Ô hậu quả đang thu tiếp.** Chatlog cho biết học viên bấm 👎, không cho biết sau đó họ làm gì và mất gì → vòng hỏi 10 người ([khao-sat.md](khao-sat.md)) lấp ô này.

7. **Quota tutor — chưa dùng được.** Giao diện hiện `Quota Tutor trong ngày 0/15 câu`. Nếu đúng 15 câu/ngày thì 21% thất bại ≈ mất 3 trong 15 câu mỗi ngày — con số rất mạnh. Nhưng data cho thấy có 3 (user, ngày) vượt 15 lượt, cao nhất **30 lượt/ngày** → quota này là mới hoặc BYOK đi vòng. **Không đưa vào spec/pitch tới khi xác nhận với team kỹ thuật.**

8. **Slide trong pack là bản rút gọn, không phải bản học viên đã dùng.** Pack cấp `slides/d1-slide-hackathon.pdf` + `d2-slide-hackathon.pdf`, **29 trang/bộ**, rút từ slide gốc (Day 2 gốc: **83 trang**). Chatlog nhắc `day01-slide-blue-v1.pdf` **37 lần** và số trang học viên đang xem là số trang **bản gốc** — tối đa **trang 98**. Ba điều đã kiểm:

   - **Text sạch, không phải ảnh scan.** Cả 58 trang extract ra text được (kiểm bằng `pypdf`) → retrieval dựng được, và giả thuyết "tutor hỏng vì slide là ảnh" bị loại thêm một lần nữa từ phía tài liệu, không chỉ từ phía chatlog (§3 `verify.py`).
   - **Day 2 map được trang gốc → trang rút gọn.** `d2` có footer `DAY 02 · N / 83` ở **28/29 trang**, cho map chính xác `{4→2, 16→3, 17→4, 22→5, … 78→29}`. `d1` **không** có footer số trang → Day 1 không map được.
   - **Nhưng trùng số trang ≠ trùng tài liệu.** 51/170 = 30,0% lượt thất bại (bộ hẹp) có số trang nằm trong map `d2`, song chỉ **62 lượt** có `day_code` chỉ rõ Day 2, trong đó **20 lượt** có trang nằm trong map. Phần lớn `day_code` là mã ẩn (`Lecture_material_ms…`) hoặc `New learning material` (397 lượt) nên không biết thuộc bộ nào.

   **Hệ quả cho `eval/`:** ground truth chỉ verify được trên corpus là 2 bộ slide bản hackathon + 6 transcript. Case lấy từ chatlog thật dùng lại **hình dạng** case (gõ tự do về trang đang mở · xin tóm tắt cả bộ · trang không có nội dung), số trang chuyển sang hệ đánh số của bản hackathon. **Trong `eval/` phải ghi rõ case nào verify trực tiếp được (20 lượt Day 2) và case nào đã chuyển hệ trang**, đừng để nó âm thầm làm sai con số % đối chiếu quality bar.

## Ứng viên ③ — vì sao loại, và cần gì mới làm được

Đo được **không cần slides**: mỗi turn có trang học viên đang xem *và* danh sách trang tutor cite → 239/679 = 35,2% lượt có citation không chứa trang đang xem.

Nhưng **không verify được** trang được cite *có chứa* câu trả lời hay không — cần `slides/`, mà [data/vlearn-pack/README.md](../data/vlearn-pack/README.md) ghi "sẽ bổ sung trước sự kiện" và hiện chưa có. Nên ③ đo được độ lệch, không đo được đúng/sai. Đó là lý do loại.
