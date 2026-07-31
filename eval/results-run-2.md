# Kết quả lượt chạy #2 — sau khi sửa 2 lỗi từ lượt #1

**Chạy sau khi sửa `codebase/server/server.js`:** (1) chặn `sections` rỗng bằng validation 400,
(2) thay đoạn "điều chỉnh theo hồ sơ học viên" chung chung bằng chỉ thị điều kiện cụ thể theo persona.
**Model:** gpt-4o-mini · **Raw output:** `eval/results-run-2.json` (20/21 gọi thành công — 1 case (C04) đổi
hành vi có chủ đích, xem bên dưới)

## Đối chiếu quality bar (`eval/results-run-1.md` có định nghĩa đầy đủ)

| Điều kiện | Lượt #1 | Lượt #2 | Đạt? |
|---|---|---|:---:|
| ≥90% pass D1 (có căn cứ) | 95,2% | 20/20 = 100% | ✅ |
| 100% case lớp③ pass D3 (an toàn) | 100% | 100% (không đổi, không chạm vào phần này) | ✅ |
| ≥80% pass D2 (không bịa) | 95,2% | 21/21 = 100% *(C04 giờ trả lỗi rõ ràng thay vì bịa)* | ✅ |
| ≥50% cặp D4 có khác biệt rõ | 0/2 = 0% | **2/2 = 100%** | ✅ |

**→ Đạt quality bar ở lượt #2**, sau đúng 1 vòng lặp `chạy → chọn 1 failure đau nhất → sửa → chạy lại trọn bộ` theo guide §4.1.

## C04 — hành vi đã đổi (fix có chủ đích, không phải fail mới)

Lượt #1: model tự bịa 3 khái niệm với citation giả `"(trang X)"`.
Lượt #2: server trả lỗi rõ ràng ngay từ validation — **`sections rỗng — không có nội dung slide để tóm tắt`** —
đúng hành vi mong muốn ban đầu ("phải nói rõ không có gì để tóm tắt, không bịa"). Client (`codebase/prototype/index.html`)
đã có sẵn logic fallback về bản mock khi gặp lỗi này (xem `askSummary()`), nên trải nghiệm học viên không bị vỡ.

## C07/C08 — trước/sau (bằng chứng D4)

**C07a (persona "Code: thành thạo") — lượt #2:**
> - LLM là mô hình ngôn ngữ lớn dự đoán từ tiếp theo dựa trên xác suất... (trang 5)
> - Instruction định hình vai trò và ràng buộc cho model... (trang 15)
> - Chỉ đưa vào facts thật sự cần cho task hiện tại... (trang 22)

Súc tích, không có câu giải thích thêm — đúng kỳ vọng.

**C07b (persona "Code: chưa biết") — lượt #2:**
> 1. **LLM là gì**: ... (trang 5)
>    *Ẩn dụ*: Giống như một người kể chuyện, luôn cố gắng đoán xem câu chuyện sẽ diễn ra như thế nào tiếp theo.
> 2. **Instruction & Prompt**: ... (trang 15)
>    *Ẩn dụ*: Như một đầu bếp nhận công thức nấu ăn rõ ràng...
> 3. **Memory & Context**: ... (trang 22)
>    *Ẩn dụ*: Như một người bạn chỉ nhớ những kỷ niệm gần đây...

Mỗi khái niệm đều có 1 ẩn dụ đời thường riêng — khác biệt rõ rệt so với C07a. **D4 đạt.**

**C08a (persona "rẽ ngành sang AI") — lượt #2:** mỗi mục có thêm "Ẩn dụ" + "Ví dụ" liên hệ kinh doanh cụ thể
(quản lý kho hàng, công ty bán lẻ, dây chuyền sản xuất). **C08b (persona "CNTT")** giữ nguyên súc tích, không có
các ví dụ này. Khác biệt rõ rệt — **D4 đạt.**

*Lưu ý về D2 cho các ẩn dụ/ví dụ mới này: đây là minh hoạ được gắn nhãn rõ ("Ẩn dụ:", "Ví dụ:"), không mang số
trang, không bị hiểu nhầm là trích từ slide — khác với việc bịa nội dung có citation giả như ở C04 lượt #1. Vẫn
tính là D2 pass.*

## Việc còn lại trước khi tính là "quality bar chốt chính thức"

- [ ] Người thứ 2 trong nhóm đọc lại toàn bộ 21 case (D2/D3/D4) độc lập, so với chấm ở đây — hiện mới 1 người chấm.
- [ ] Vì lượt #2 đổi prompt sau khi quality bar đã "chốt" về mặt số (%) — **cần ghi rõ trong spec.md §9 Changelog**
      rằng thay đổi này xảy ra TRƯỚC 23:59 ngày 1 (lúc quality bar chính thức đóng băng), không phải sau.
- [ ] Mở rộng golden set lên 30+ (khuyến nghị guide khi dùng promptfoo).
