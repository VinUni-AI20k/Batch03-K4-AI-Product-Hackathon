# Survey Summary - Discord Knowledge Finder

## Khảo Sát Ban Đầu

Nguồn: khảo sát nhanh học viên trong khóa.  
Cỡ mẫu: n = 54.

| # | Câu hỏi | Có | Không | Other | Tỉ lệ Có |
|---|---|---:|---:|---:|---:|
| 1 | Bạn có gặp khó khăn khi tìm lại các thông báo hay đường link quan trọng trong Discord do có quá nhiều kênh (channel) không? | 49 | 5 | 0 | 90,7% |
| 2 | Bạn có từng lỡ mất các thông báo gấp (ví dụ: đổi lịch học, dời deadline) chỉ vì tin nhắn bị trôi quá nhanh chưa? | 36 | 17 | 1 | 66,7% |
| 3 | Bạn có cảm thấy tốn thời gian khi phải lội ngược dòng tin nhắn (scroll) hoặc dùng thanh search của Discord nhưng vẫn không tìm thấy thứ mình cần không? | 46 | 8 | 0 | 85,2% |
| 4 | Khi cần tìm tài liệu/link bài giảng của một buổi học cụ thể, bạn có phải đi hỏi lại bạn bè thay vì tự tìm trên Discord không? | 38 | 16 | 0 | 70,4% |

## Diễn Giải Cho Lát Cắt

- Q1 và Q3 xác nhận pain tìm kiếm chung: nhiều học viên khó tìm lại thông báo/link và thấy tốn thời gian khi dùng scroll/Search.
- Q2 xác nhận nhóm thông tin có cost-of-error cao: thông báo gấp, đổi lịch học, dời deadline.
- Q4 cho thấy khi không tìm được, học viên chuyển sang hỏi lại người khác, tạo câu hỏi lặp trong cộng đồng.

## Khảo Sát Bổ Sung Giả Lập Để Định Hướng

Phần này là số liệu giả lập/placeholder để định hình thêm scope sản phẩm. Không dùng như evidence chấm điểm nếu chưa khảo sát thật.

| # | Câu hỏi | Có | Không | Other | Tỉ lệ Có |
|---|---|---:|---:|---:|---:|
| 5 | Khi bạn hỏi một vấn đề học tập, bạn có muốn hệ thống gợi ý các thread liên quan trong mục Chia sẻ thay vì chỉ trả lời trực tiếp không? | 47 | 6 | 1 | 87,0% |
| 6 | Bạn có tin kết quả hơn nếu hệ thống tách rõ nguồn Thông báo chính thức và nguồn Chia sẻ cộng đồng không? | 51 | 2 | 1 | 94,4% |
| 7 | Với deadline/link quan trọng, bạn có muốn hệ thống ưu tiên nguồn từ Thông báo thay vì comment trong thread Chia sẻ không? | 50 | 3 | 1 | 92,6% |
| 8 | Nếu câu hỏi của bạn chưa rõ, bạn có chấp nhận assistant hỏi lại một câu trước khi tìm/đề xuất nguồn không? | 44 | 9 | 1 | 81,5% |

## Kết Luận Product

Lát cắt nên giới hạn vào hai nguồn có hành vi khác nhau:

1. `Chia sẻ`: tìm/gợi ý thread liên quan đến câu hỏi học tập hoặc kinh nghiệm.
2. `Thông báo`: tìm link, deadline và thông tin chính thức có cost-of-error cao.

AI không nên trở thành Discord Assistant tổng quát. Nó nên là Knowledge Finder có citation, biết hỏi lại khi mơ hồ và biết abstain khi không đủ nguồn.
