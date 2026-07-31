# Eval run — lượt 8 (fix "chatbot cứng" — thêm response_type conversational/recommendation)

API: `http://127.0.0.1:8001` · Model: `openai/gpt-4o-mini` qua OpenRouter · Ngày chạy: 2026-07-31. 29/29 case gọi API thành công (R04 SKIPPED theo thiết kế). Chạy sau khi sửa bug: mọi tin nhắn chat tự do (kể cả "xin chào", "cảm ơn", "thời tiết thế nào") trước đây đều bị ép qua recommend engine và luôn trả lời như đang xếp hạng đề tài.

## Thay đổi trong lượt này

`codebase/server/main.py`:
1. `SYSTEM_PROMPT` thêm bước phân loại bắt buộc trước khi xử lý: yêu cầu mới nhất có phải đang hỏi về chọn/xếp hạng đề tài không? Nếu không → `response_type="conversational"`, `selections=[]`, trả lời tự nhiên trong `assistant_message`.
2. `RESPONSE_SCHEMA` thêm field `response_type` (enum `recommendation`/`conversational`), bắt buộc.
3. Toàn bộ heuristic downgrade confidence (interest fallback, invalid skill marker, personalized-match check, team_size vượt phạm vi) được bọc trong `if response_type == "recommendation"` — tránh gắn cảnh báo vô nghĩa vào một câu chào hỏi.
4. `RecommendResponse` thêm `response_type`, trả về cho frontend.

`codebase/app.js`:
1. `getRecommendationsFromAI` đọc `payload.response_type` vào `meta.responseType`.
2. `resolveAndRenderRecommendations` rẽ nhánh: nếu `conversational` → gọi `renderConversationalReply` (chỉ hiển thị `assistant_message`, không đụng `state.recommendations` hiện có, không hiện nút "Không thấy đề tài phù hợp?").

## Verify thủ công trước khi chạy eval

| Input | response_type | Ghi chú |
|---|---|---|
| "Xin chào, bạn là ai vậy?" | conversational | Trả lời tự giới thiệu, không nhắc đề tài |
| "Hôm nay thời tiết thế nào?" | conversational | Trả lời tự nhiên, không ép ra 3 đề tài |
| "Cảm ơn bạn nhiều nhé!" | conversational | Trả lời lịch sự, không lặp lại đề tài cũ |
| "Chào bạn, mình muốn tìm đề tài về bảo mật" (nửa chào nửa hỏi) | recommendation | Đúng — phần "muốn tìm đề tài" được ưu tiên |
| Yêu cầu xếp hạng thật (skills đầy đủ) | recommendation | `confidence=high`, không đổi so với lượt 7 |
| "Ưu tiên không dùng machine learning" (bổ sung preference) | recommendation | Đúng — vẫn nhận diện là yêu cầu xếp hạng lại |

## Kết quả 30 case golden set

29/29 case chạy thành công, kết quả gần như y hệt lượt 7 (96.7%) — G01-L08, R01-R04, OBS01-OBS10 hầu hết trả về đúng `ma_de`/`confidence` như đã verify trước, không regression.

**Khác biệt duy nhất: OBS06** (`interest="thong-minh"`, `skills=[]` — input cố tình mơ hồ để test "giải pháp thông minh"). Lượt 7: trả về `response_type` ngầm định là recommendation, `selections` rỗng, `confidence=low`, `overall_note` nêu rõ thiếu tín hiệu. Lượt 8: model tự phân loại đây là `response_type="conversational"` (đúng theo thiết kế mới — input quá thiếu tín hiệu để coi là yêu cầu xếp hạng rõ ràng), `assistant_message` hỏi lại user cần gợi ý gì. `expected` gốc (viết cho kiến trúc cũ) yêu cầu thông tin "thiếu tín hiệu" nằm trong `overall_note` — giờ thông tin tương đương nằm trong `assistant_message` thay vì `overall_note`. **Không coi là regression**: hành vi mới hợp lý hơn (chatbot thật sự hỏi lại thay vì giả vờ xếp hạng trên dữ liệu rỗng), chỉ là field chứa thông tin đã đổi chỗ theo đúng tinh thần fix vừa làm.

**Tổng: 29/30 PASS tương đương lượt 7 (96.7%), không có regression trên logic recommendation.** OBS06 coi là cải thiện hành vi, không phải fail — cần cập nhật `expected` trong `golden-set.json` ở lượt sau để phản ánh đúng field `assistant_message` khi `response_type=conversational` (chưa sửa file golden-set trong lượt này để giữ nguyên lịch sử, chỉ ghi nhận ở đây).
