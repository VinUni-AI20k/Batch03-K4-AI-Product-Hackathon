# Chỉ mục trích dẫn slide hackathon

Chỉ mục này giúp nhóm dẫn nguồn ngắn gọn mà không chép nguyên nội dung data pack vào bài nộp. Số trang bên dưới là **trang PDF, đếm từ 1** trong bản hackathon; không dùng số trang của bộ slide gốc còn xuất hiện ở một số footer.

## Cách trích dẫn

### Trong `spec.md`

- Dẫn ngay sau nhận định: `... nên ưu tiên augmentation ở tác vụ rủi ro cao ([D2-S17], tr. 17).`
- Ở mục nguồn, ghi: `D2-S17 - AI in Action, Day 02, "Automation vs Augmentation", bản hackathon, trang PDF 17.`
- Nếu một nhận định dựa trên nhiều slide, liệt kê từng mã: `[D1-S14; D1-S16]`.

### Trong golden set

Lưu mã slide và trang ở metadata; chỉ ghi một câu diễn giải ngắn nếu cần để người chấm hiểu tiêu chí. Ví dụ:

```yaml
source_ref: D2-S23
source_page: 23
evidence_note: Kiểm tra sự đánh đổi giữa precision và recall theo tác động tới người dùng.
```

Không dán toàn văn slide, ảnh chụp slide hoặc file PDF vào `eval/`. Nếu test cần một câu trích nguyên văn, chỉ lấy phần tối thiểu (tối đa vài dòng) và vẫn kèm mã slide. Mã trong chỉ mục là locator, không thay thế tiêu chí pass/fail hay expected output của từng case.

### Bảo mật

Các PDF và chỉ mục này vẫn thuộc data pack cấp riêng cho hackathon. Chỉ dùng trong phạm vi sự kiện; không chia sẻ ra ngoài khóa học, không đưa nguyên file/ảnh chụp/đoạn dài vào repo công khai hoặc công cụ ngoài. Repo bài nộp chỉ nên chứa mã nguồn, tên chủ đề, số trang và trích đoạn ngắn tối thiểu. Khi đưa dữ liệu vào công cụ AI, chỉ gửi phần thật sự cần thiết; không cố suy ngược danh tính và xóa bản sao khi ban tổ chức yêu cầu. Xem đầy đủ tại [quy tắc bảo mật của data pack](../README.md#luật-dùng--bảo-mật) và [quy định gốc của hackathon](../../../README.md#bảo-mật-dữ-liệu-được-cung-cấp).

<a id="day-1"></a>

## Day 1 - AI & LLM Foundation

Nguồn: [`d1-slide-hackathon.pdf`](d1-slide-hackathon.pdf)

| Mã | Trang PDF | Tiêu đề / chủ đề |
|---|---:|---|
| D1-S01 | 1 | AI & LLM Foundation |
| D1-S02 | 2 | Agenda |
| D1-S03 | 3 | AI, ML, Deep Learning, GenAI và LLM trong cùng một hệ |
| D1-S04 | 4 | Ba nhóm AI chính: phân loại, sinh nội dung và hành động |
| D1-S05 | 5 | Lịch sử AI 70 năm |
| D1-S06 | 6 | 1980: Hệ chuyên gia (expert system) |
| D1-S07 | 7 | 2009: Fei-Fei Li và ImageNet - cuộc cách mạng của dữ liệu |
| D1-S08 | 8 | 2017: Transformer |
| D1-S09 | 9 | 2022: ChatGPT |
| D1-S10 | 10 | LLM là gì? Một bộ não nền, không phải một chatbot |
| D1-S11 | 11 | Bên trong Transformer: đầu ra là một phân bố xác suất |
| D1-S12 | 12 | Sinh văn bản: đoán, nối vào câu, rồi đoán tiếp |
| D1-S13 | 13 | Token: model đọc mảnh chữ, không đọc nguyên từ |
| D1-S14 | 14 | Context: bàn làm việc có hạn của model |
| D1-S15 | 15 | Attention: mỗi từ nhìn sang các từ quan trọng khác |
| D1-S16 | 16 | Quản context là quản sự chú ý |
| D1-S17 | 17 | Parameter: những khớp nối model học được |
| D1-S18 | 18 | Quy trình tạo LLM: pre-training, SFT, RLHF/DPO và luyện suy luận |
| D1-S19 | 19 | RLHF: uốn máy đoán token thành trợ lý biết nghe lời |
| D1-S20 | 20 | Giới hạn bẩm sinh: học giả trong bong bóng |
| D1-S21 | 21 | Vì sao model vẫn sai: học vẹt đường tắt |
| D1-S22 | 22 | Chain-of-Thought: thêm giấy nháp để suy luận |
| D1-S23 | 23 | Từ LLM đến agent: bốn mức độ năng lực |
| D1-S24 | 24 | Giải phẫu agent: năm bộ phận trong một vòng lặp |
| D1-S25 | 25 | Chi phí cho cùng mức năng lực giảm theo thời gian |
| D1-S26 | 26 | Chọn model theo tầng, không theo tên |
| D1-S27 | 27 | Chi phí token: đầu vào và đầu ra |
| D1-S28 | 28 | Giải phẫu prompt: bốn lớp xếp chồng |
| D1-S29 | 29 | Temperature và top_p |

<a id="day-2"></a>

## Day 2 - Xác định bài toán cho AI

Nguồn: [`d2-slide-hackathon.pdf`](d2-slide-hackathon.pdf)

| Mã | Trang PDF | Tiêu đề / chủ đề |
|---|---:|---|
| D2-S01 | 1 | Xác định bài toán cho AI |
| D2-S02 | 2 | Agenda |
| D2-S03 | 3 | Tìm đúng vấn đề trước khi tìm giải pháp |
| D2-S04 | 4 | Diamond 1: Tìm đúng vấn đề |
| D2-S05 | 5 | Khởi nguồn từ bài toán, không bắt đầu từ AI |
| D2-S06 | 6 | Tìm bài toán AI ở đâu? |
| D2-S07 | 7 | Sai lầm thường gặp - anti-patterns |
| D2-S08 | 8 | PAIR: đổi câu hỏi "Có thể dùng AI?" thành câu hỏi về vấn đề và giá trị riêng của AI |
| D2-S09 | 9 | Quick Problem Card |
| D2-S10 | 10 | Câu hỏi khai thác bài toán |
| D2-S11 | 11 | Định lượng hóa bài toán |
| D2-S12 | 12 | Thiết lập chỉ số: Output và Input |
| D2-S13 | 13 | Ba bước quyết định AI theo PAIR |
| D2-S14 | 14 | Khi nào AI có lợi thế? |
| D2-S15 | 15 | Khi nào AI không tốt hơn? |
| D2-S16 | 16 | Hệ thống AI = Model + Context + Planning + Tools |
| D2-S17 | 17 | Automation và Augmentation |
| D2-S18 | 18 | Ba mức giải pháp: Rule, Workflow và Agent |
| D2-S19 | 19 | Một tình huống, ba cấp độ giải pháp |
| D2-S20 | 20 | Workflow patterns - đủ cho hầu hết bài toán |
| D2-S21 | 21 | Cây quyết định lựa chọn cấp độ giải pháp |
| D2-S22 | 22 | Reward function: hệ thống hiểu đúng và sai thế nào? |
| D2-S23 | 23 | Precision và Recall: đánh đổi không tránh khỏi |
| D2-S24 | 24 | Viết tiêu chí thành công có thể hành động |
| D2-S25 | 25 | Khoảng cách giữa demo và production |
| D2-S26 | 26 | Từ Problem Statement đến Eval Plan |
| D2-S27 | 27 | Problem Statement cho hệ thống AI |
| D2-S28 | 28 | Khung quyết định: Go, Not Yet và No-Go |
| D2-S29 | 29 | Sáu nguyên tắc cốt lõi sau Day 02 |
