# Lượt cắt slop

Đọc ở Phase 6. Chạy sau khi viết xong, như một lượt riêng. Không vừa viết vừa sửa, sẽ bỏ sót.

Slop không phải văn dở. Nó là văn **trôi qua mắt mà không để lại thông tin** — đọc xong learner không biết thêm gì và cũng không làm được gì. Nó nguy hiểm vì nó trông giống nội dung thật, nên người viết tưởng bài đã đủ.

## Ba test

Đây là luật. Áp cho từng câu.

1. **Không có tham chiếu** — câu này trỏ về file nào, lệnh nào, hay số nào? Không có thì cắt.
2. **Không kiểm chứng được** — học viên làm sao biết đã đạt? Chuyển thành checkpoint, hoặc cắt.
3. **Đảo được mà vẫn đúng** — viết ngược nghĩa mà câu vẫn nghe hợp lý thì câu đó không mang thông tin. Test này mạnh nhất. "Prompt engineering là kỹ năng quan trọng trong thời đại AI" đảo thành "không quan trọng" vẫn nghe được như một ý kiến. Cắt.

Hai danh sách dưới đây chỉ là **dấu hiệu thường gặp, không phải blacklist.** Mục tiêu là bỏ sự rỗng, không phải bỏ từ. "Hiệu quả" kèm con số thì giữ; đổi "tối ưu" thành từ khác mà câu vẫn rỗng thì vẫn cắt.

## Dấu hiệu trong prose

**Mở đầu và chuyển ý hay rỗng:** "Trong thế giới AI ngày nay" · "Hãy cùng nhau khám phá" · "Trước khi bắt đầu, chúng ta cần hiểu rằng" · "Điều quan trọng cần lưu ý là" · "Như bạn có thể thấy" · "Bây giờ đã xong X, hãy chuyển sang Y" · "Chúc bạn thành công".

**Từ định tính rỗng khi đứng một mình:** mạnh mẽ · hiệu quả · tối ưu · linh hoạt · toàn diện · dễ dàng · chuyên nghiệp · sâu sắc · đột phá.

Sửa bằng cách thay bằng số:

| Rỗng | Có thông tin |
|---|---|
| "chạy hiệu quả hơn" | "chạy 20 case trong 45s, trước là 3 phút" |
| "prompt được tối ưu" | "giảm token mỗi task từ 350 xuống 210" |
| "kết quả chính xác hơn" | "4/5 case pass, trước là 2/5" |

**Cấu trúc câu:** bỏ "không chỉ X mà còn Y" (nhồi hai ý cho câu dài ra) · bỏ triad tính từ (thường có một cái sai) · bỏ "Điều này giúp bạn hiểu rõ hơn về" (mô tả lợi ích thay vì đưa nội dung) · câu dài hơn 40 từ thì tách · câu kết thúc bằng `!` đổi thành `.` · bullet không có động từ thì không phải hành động.

**Với người mới, thêm một loại nữa phải cắt:** "chỉ cần", "đơn giản là", "rõ ràng là", "dễ thôi". Với người mới không có gì là đơn giản, và câu đó chỉ làm người đang tắc cảm thấy mình kém.

## Slop đặc thù lab guide

Loại nguy hiểm nhất, vì nó trông giống hướng dẫn thật.

| Slop | Sửa thành |
|---|---|
| Lệnh không có output kỳ vọng | thêm khối `Kết quả đúng:` |
| "Chạy file và kiểm tra kết quả" | dán output cụ thể |
| "Cài các thư viện cần thiết" | `pip install -r requirements.txt` |
| "Mở file config" | `config/test_cases.json` |
| "Sửa lại prompt cho tốt hơn" | "Thêm luật: chỉ trả Final Answer khi đã có Observation" |
| Gọi smoke run là "test" | gọi đúng loại lệnh |
| Bịa output không chạy được | gắn nhãn `Coach inference` |
| Trỏ tới file không tồn tại | kiểm bằng `ls`, hoặc đánh dấu `FILE MỚI` + cách tạo |
| Copy nguyên đoạn README vào guide | guide nói cách làm, README nói tổng quan, link qua nhau |
| Checkpoint "Hiểu được X" | "Chạy `<lệnh>` ra `<output>`" hoặc "Giải thích được vì sao..." |

## Trình bày

- Bỏ emoji trong heading. Directive đã là signal; emoji rải rác tạo tín hiệu giả, và máy thiếu font emoji render nó thành ô vuông rỗng.
- Bold ≤ 3 chỗ mỗi step. Bold mọi thứ là không bold gì cả.
- `**Lưu ý:**` rải rác thì gom vào `:::caution`.
- Bỏ heading H4+.
- `[X]` đổi thành `[ ]`.

## Cắt 20%

Sau ba test, đọc lại từng step và cắt cho tới khi bỏ được khoảng một phần năm số câu. Ngưỡng này tồn tại vì lượt cắt đầu luôn quá nhẹ tay: người viết đã đầu tư vào từng câu nên khó nhìn ra câu nào không cần.

Cái được giữ lại là: lệnh, output, path, số, và câu giải thích *vì sao* một lựa chọn tồn tại. Cái bị cắt là mọi câu chỉ để chuyển ý.
