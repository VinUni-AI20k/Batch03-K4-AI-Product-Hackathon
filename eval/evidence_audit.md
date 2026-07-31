# Evidence audit — chatlog VLearn

## Kết quả tái lập

- **2,522 messages = 1,261 cặp student–tutor**, 585 hội thoại.
- **582/1261** câu tutor có `citations` rỗng.
- Ý định tóm tắt: **144 lượt**; **69** có ngôn ngữ từ chối/không tìm thấy; **90** không citation.
- Yêu cầu vùng ảnh rõ ràng (`khoanh|bôi đỏ|vùng chọn|crop`): **14 lượt**; **9** bị từ chối/không tìm thấy; **9** không citation.

## Phương pháp

- Ghép đúng một message `student` với một message `tutor` theo `turn_id`.
- Summary regex: `tóm tắt|tóm gọn|tổng hợp|khái quát|ý chính|đầu mục`.
- Visual regex (cố ý hẹp): `khoanh|bôi đỏ|vùng chọn|crop`.
- Refusal regex nhận các cụm như `rất tiếc`, `không tìm thấy`, `không thể truy cập/nhìn thấy`, `không có thông tin`.
- Đây là phép đếm keyword có thể tái lập, không phải phân loại semantic hoàn hảo.

## Ví dụ visual bị từ chối

- `T0399` — (Trang 6, đoạn được chọn: "Giải thích biều đồ đc bôi đỏ") Giải thích biều đồ đc bôi đỏ
- `T0482` — (Trang 12, đoạn được chọn: "Tui bôi đỏ á") Tui bôi đỏ á
- `T0950` — (Trang 24, đoạn được chọn: "giải thích phần khoanh vùng") giải thích phần khoanh vùng
- `T0850` — (Trang 24, đoạn được chọn: "giải thích đoạn tôi vừa bôi đỏ") giải thích đoạn tôi vừa bôi đỏ
- `T0601` — (Trang 18, đoạn được chọn: "mình đang khoanh tròn rồi ất") mình đang khoanh tròn rồi ất
