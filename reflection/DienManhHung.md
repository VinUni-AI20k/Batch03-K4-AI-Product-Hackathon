# Reflection — Điền Mạnh Hùng

## Vai trò trong nhóm

Phần **prompt** — theo phân công tại `03-template-ai-spec.md` §8 (`spec:Cả nhóm / evidence:Bách / prompt:Hùng / code:Nghĩa / demo:Quang`). Cụ thể là phần quyết định AI trung tâm của lát cắt: `SYSTEM_PROMPT` trong `codebase/server/main.py` (điều gì model được yêu cầu làm, khi nào phải trả `confidence="low"` thay vì đoán liều) và hành vi thật của model qua các lượt eval — không phải phần hạ tầng server (đó là phần của Nghĩa) mà là phần "model được yêu cầu làm gì và có làm đúng không".

## Phần mình đã làm

- Viết/duyệt `SYSTEM_PROMPT` (`codebase/server/main.py`) — 6 chỉ dẫn cho model: chọn đúng 3 đề tài trong candidate list (không bịa mã), viết `reasons` bám field thật của đề tài, viết `risk_note` bám `rui_ro_domain`/`hitl`/`gioi_han_tham_quyen`, tự báo `confidence="low"` khi thiếu tín hiệu, không đưa lời khuyên ngoài phạm vi.
- Đối chiếu 8 kịch bản chỗ khó ở §5 với hành vi thật của model qua 3 lượt eval — không chỉ đọc log một lần rồi kết luận, mà chạy lại toàn bộ golden set (20 case) sau mỗi lần sửa prompt/logic để chắc sửa đúng chỗ không vỡ chỗ khác.
- Tham gia quyết định 2 lần đổi checkbox ở §4 (Working → Mock, automate → conditional) — cả hai đều đổi vì đối chiếu với UI thật và kết quả eval lượt 1 cho thấy model tự báo `confidence="high"` sai ở 50% case, không đủ tin cậy để tự động hoàn toàn.

## AI hỗ trợ thế nào

- Hỗ trợ chạy 3 lượt eval liên tiếp (`eval/run-01.md` → `run-03.md`), mỗi lượt đối chiếu case-by-case với `golden-set.json`, không chỉ báo % mà chỉ đúng case nào sai và vì sao.
- Phát hiện một lỗi cụ thể: fix đầu cho "confidence lạc quan giả" (đếm `team_size` làm tín hiệu) sai vì hầu hết đề tài đều thoả `max_team >= team_size` — không phải tín hiệu thật. Phải sửa lại chỉ đếm skill khớp thật.
- Khi tôi (Hùng) yêu cầu AI "cứ làm bình thường dựa vào số liệu giả định" để điền feedback validation cho R6, AI đã **từ chối** — giải thích đây là bịa quote gán cho người thật, không phải số liệu bị chỉnh sửa mà là số liệu không tồn tại được trình bày như thật, và không làm dù được yêu cầu lại lần hai. Lúc đó tôi thấy hơi bị chặn vì đang muốn xong nhanh cho đủ 6 mốc, nhưng nghĩ lại thì đúng — rubric của khoá nói rõ "số liệu bị chỉnh sửa hoặc che giấu sẽ không được tính", và nếu bị hỏi ngẫu nhiên ở CP5/CP6 mà quote đó là giả, tôi sẽ không giải thích được — đúng vào vibe-coding rule.

## Một bài học từ case fail của chính nhóm

**Sửa "confidence lạc quan giả" ở lượt 2 tạo ra một lỗi mới ở lượt đó (case G02)**: hồ sơ kỹ năng an ninh mạng viết bằng tiếng Anh ("Network", "Log analysis", "Linux") — đúng lĩnh vực, đáng lẽ phải tự tin cao — bị hệ thống tự hạ nhầm xuống `confidence="low"` vì code chỉ so khớp chữ trong `tech_stack` tiếng Việt, không hiểu "Network" và "an ninh mạng" là cùng nghĩa. Lượt 3 sửa bằng bảng đồng nghĩa Anh-Việt tối thiểu theo `interest`, nhưng khi thử sửa tiếp case L01 (model bịa liên hệ giả trong `reasons`) bằng một heuristic so khớp từ khác, nó lại xung đột trực tiếp với chính fix G02 vừa sửa — một heuristic cần *nới rộng* để chấp nhận diễn giải đồng nghĩa, một heuristic khác cần *siết chặt* để bắt bịa đặt, và hai mục tiêu này không tách được bằng so khớp từ đơn giản.

Bài học: sửa một lỗi cụ thể bằng luật cứng (heuristic) rất dễ tạo lỗi mới ở hướng đối lập — không thể chỉ test lại đúng case vừa sửa mà phải chạy lại toàn bộ golden set mỗi lần đổi logic. Và đôi khi quyết định đúng là **bỏ** một fix chưa chín (L01 vẫn FAIL ở lượt 3, ghi nhận cần LLM-judge riêng) thay vì giữ nó và để lại một regression ẩn không ai biết.

## Điều mình sẽ làm khác nếu làm lại

Viết golden set với case "đồng nghĩa/diễn giải khác từ" ngay từ đầu (không chỉ case đúng-từ hoặc sai-hẳn), vì đây là chỗ heuristic đơn giản dễ vỡ nhất và tốn 2 lượt eval mới lộ ra. Cũng sẽ tách rõ hơn ngay từ prompt: chiều "model có tự tin đúng mức không" nên đo riêng khỏi chiều "model có bịa nội dung không" — trộn hai chiều này vào cùng một cơ chế downgrade `confidence` là lý do hai fix của tôi giẫm chân nhau ở lượt 3.
