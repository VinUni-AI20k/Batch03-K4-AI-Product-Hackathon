# 1 day04 prompt engineering tool calling

## Slide 1

**Nội dung hình ảnh:** Slide bìa với logo VinUniversity, ảnh nền mờ khuôn viên trường (toà nhà, cây xanh, đường tròn) phủ lớp overlay xanh dương.

Prompt Engineering & Tool Calling
AICB-P1 · Ngày 4 · Nói thếnào đểmodel làm đúng — rồi cho nó dùng tool
Tên Giảng Viên
VinUniversity · Phase 1 · Tuần 1 · 2026

## Slide 2

**Nội dung hình ảnh:** Nền xanh dương đậm với hình dấu chấm hỏi lớn mờ làm hoạ tiết nền phía sau đoạn trích dẫn.

?
HÃY SUY NGHĨ...
“Hai người hỏi AI cùng một việc, một người nhận
kết quảxuất sắc, người kia nhận rác. Tại sao?”
Giữcâu hỏi này trong đầu khi học bài hôm nay

## Slide 3

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung.

Nội Dung Bài Học
PHẦN A — Nguyên lý
1. Prompt fundamentals
2. Lịch sử& tiến hoá prompting
3. Advanced prompting techniques
4. System prompt engineering
5. Context engineering
6. Tool calling →create_agent
7. Thiết kếtool & tool-use patterns
8. Harness engineering (2026)
PHẦN B — Áp dụng
■Capstone: agent thật (áp dụng Phần A)
■Bài lab + deliverable cuối buổi
Phần A dạy nguyên lý trên một ví dụchung — trợlý mua sắm ShopBot. Phần B áp
dụng đúng các nguyên lý đó vào một agent thật trong bài lab (cùng cấu trúc, khác
lĩnh vực).
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
1 / 49

## Slide 4

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung.

Mục Tiêu Ngày 4
■Viết prompt rõ ràng theo Role / Task / Context / Format và bằng cấu trúc (tags/sections)
■Biết khi nào dùng few-shot / CoT — và khi nào không nên (CoT có lúc làm hại)
■Viết system prompt như một contract: role + tiêu chí + ràng buộc + output
■Tư duy context engineering: chọn đúng tập token (system, tools, examples, memory),
không chỉcâu chữ
■Khai báo tool bằng @tool và dựng agent gọi tool bằng create_agent, grounded trong output
tool
Buổi này dạy cơ chế, không phải mẹo: prompt là interface giữa ý định và hành vi model; tool
calling là interface giữa model và thếgiới ngoài.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
2 / 49

## Slide 5

**Nội dung hình ảnh:** Slide chương mục (section divider) với số "01" lớn mờ làm hoạ tiết nền bên phải, gạch đỏ dưới tiêu đề.

01
Prompt Engineering Fundamen-
tals
Prompt tốt không phải prompt “hay”, mà là prompt tạo ra hành vi
mong muốn ổn định

## Slide 6

**Nội dung hình ảnh:** Hai khung so sánh cạnh nhau: khung đỏ bên trái "Prompt kém" và khung xanh lá bên phải "Prompt tốt", bên dưới là hộp lưu ý màu hồng nhạt viền đỏ.

Prompt = Interface Giữa Ý Định và KhảNăng Model
Prompt kém
“Tư vấn mua đồgiúp tôi.”
Không rõ mua gì, ngân sách bao nhiêu, giao đâu.
Kết quả: trảlời chung chung, khó dùng.
Prompt tốt
Tìm laptop dưới 20 triệu cho sinh viên, ưu
tiên pin trâu, giao vềHCM.
Rõ sản phẩm, ngân sách, nhu cầu, nơi giao.
Model đủthông tin đểhành động.
Lưu ý: Nguyên tắc vàng: Specificity beats cleverness. Prompt ngắn nhưng rõ
nghĩa thường tốt hơn prompt dài mà lan man.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
3 / 49

## Slide 7

**Nội dung hình ảnh:** Sơ đồ 4 khối màu nối tiếp bằng mũi tên theo hàng ngang: ROLE (xanh đậm) → TASK (xanh nhạt) → CONTEXT (đỏ nhạt) → FORMAT (đỏ đậm), mỗi khối có ví dụ minh hoạ bên dưới; phía dưới là hộp lưu ý màu xanh nhạt.

4 Thành Phần Của Prompt Tốt
ROLE
Vai trò
TASK
Nhiệm vụ
CONTEXT
Bối cảnh
FORMAT
Định dạng
“Trợlý mua sắm
ShopBot”
“Đềxuất 1 sản
phẩm phù hợp”
“Trong ngân sách
và nhu cầu cho trước”
“Tiếng Việt, ngắn,
có giá + lý do”
Bắt đầu với Task + Format. Chỉthêm Role hoặc Context khi chúng thực sựcải thiện
chất lượng hoặc tính nhất quán.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
4 / 49

## Slide 8

**Nội dung hình ảnh:** Bảng 3 cột (Loại prompt / Mục đích chính / Khi dùng) liệt kê 3 hàng: Instruction prompt, Conversation prompt, System prompt.

Instruction vs Conversation vs System Prompt
Loại prompt
Mục đích chính
Khi dùng (ví dụShopBot)
Instruction prompt
Ra lệnh trực tiếp cho một
tác vụ
“Tóm tắt 3 sản phẩm này thành 1 gợi
ý.”
Conversation
prompt
Giữngữcảnh nhiều lượt
với user
User hỏi tiếp “còn mẫu nào rẻhơn
không?”
System prompt
Đặt policy, boundary, output
contract
Luật của ShopBot: ngôn ngữ, ràng
buộc, định dạng
Anthropic prompting guidance + teaching heuristics
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
5 / 49

## Slide 9

**Nội dung hình ảnh:** Khối code nền đen bên trái minh hoạ prompt dùng XML tags (role, context, task, constraints, output_format); bên phải là danh sách lợi ích dạng bullet.

Structured Prompting — Cấu Trúc Hoá ĐểOutput Ổn Định
<role>ShopBot, tro ly mua sam.</role>
<context>User dang tim san pham
trong mot ngan sach.</context>
<task>De xuat 1 san pham phu hop.</task>
<constraints>
- Chi dung gia tu tool, khong bia.
- Thieu thong tin -> hoi lai.
</constraints>
<output_format>Tieng Viet, ngan:
ten + gia + ly do.</output_format>
Tách prompt thành thẻ/section rõ ràng
(XML tags, hoặc tiêu đềMarkdown) giúp
model:
■bám đúng cấu trúc, ít “quên” ràng buộc
■dễchèn/đổi từng phần (context, examples)
■dễtest & version
Nguồn: Anthropic — dùng XML tags trong prompt
(2025).
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
6 / 49

## Slide 10

**Nội dung hình ảnh:** Slide chỉ có text (bullet list và hộp lưu ý màu hồng), không có sơ đồ/hình minh họa bổ sung.

Token Budget: Dài Hơn KHÔNG Phải Tốt Hơn
■Mỗi token thừa làm tăng chi phí, latency, và đôi khi cảnhiễu.
■“Context rot”: prompt càng dài, độchính xác càng dễgiảm — model “lạc” giữa quá
nhiều thông tin.
■Ưu tiên độrõ: instruction rõ + cấu trúc + examples đúng chỗ. (Cách chọn tập token
đưa vào: §5 Context Engineering.)
Lưu ý: Prompt engineering tốt là tối ưu độrõ và khảnăng kiểm soát — không phải
thi xem ai viết prompt dài hơn. (Nguồn: “context rot” — Chroma, 2025; context engineering — Anthropic,
2025.)
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
7 / 49

## Slide 11

**Nội dung hình ảnh:** Slide chương mục với số "02" lớn mờ làm hoạ tiết nền bên phải, gạch đỏ dưới tiêu đề.

02
Lịch Sử& Tiến Hoá Của Prompt-
ing
Từ“chọn câu chữ” đến “thiết kếcảhệthống quanh model”

## Slide 12

**Nội dung hình ảnh:** Bảng thời gian 3 cột (Năm / Cột mốc / Ý nghĩa) liệt kê 9 hàng mốc lịch sử từ 2020 đến 2026 theo trình tự thời gian.

Dòng Thời Gian Prompting (2020–2026)
Năm
Cột mốc
Ý nghĩa
2020
In-context / few-shot (GPT-3)
Học task từvài ví dụtrong prompt —
prompting thành một nghề
2021–22
Instruction tuning + RLHF (FLAN,
InstructGPT)
Model “làm theo lời dặn” ⇒prompt
đơn giản trởnên đáng tin
2022
CoT, Self-Consistency, zero-shot
CoT
Chất lượng suy luận thành một biến
của prompt
2022
ReAct, PAL
Reasoning + hành động/tool ⇒bản
thiết kếcho agent
2023
Tree-of-Thought; function calling
Suy luận dạng tìm kiếm; tool use thành
API chuẩn
2024–25
Reasoning models (o1, R1, ex-
tended thinking)
Suy luận chuyển vào trong model —
bớt CoT viết tay
2025
“Context engineering” (Anthropic)
Đòn bẩy là tập token đưa vào, không
chỉcâu chữ
2026
“Harness engineering” (đang nổi)
Đòn bẩy là cảhệthống quanh model
arXiv / vendor announcements — ngày đã kiểm chứng
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
8 / 49

## Slide 13

**Nội dung hình ảnh:** Sơ đồ 3 khối màu nối tiếp theo hàng ngang: Prompt eng. (xanh đậm) → Context eng. (xanh nhạt) → Harness eng. (đỏ), mỗi khối kèm chú thích ngắn bên dưới; phía dưới là hộp lưu ý màu hồng.

3 KỷNguyên: Prompt →Context →Harness
Prompt eng.
Context eng.
Harness eng.
1 prompt
“câu lệnh”
cảcontext
“mọi token model đọc”
nhiều prompt
“khắp agent”
Lưu ý: Trục xuyên suốt cảbuổi: kỷnguyên 2 (context) ở§5, kỷnguyên 3 (harness)
ở§8. Lưu ý: “context/harness engineering” là cách gọi mới của giới làm nghề(2025–
26), chưa phải chuẩn học thuật; các kỷnguyên chồng lấn, không thay thếnhau.
(Anthropic 2025; Hashimoto/OpenAI 2026.)
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
9 / 49

## Slide 14

**Nội dung hình ảnh:** Bảng 3 cột (Kỹ thuật / Gốc / Ý tưởng-khi dùng) liệt kê 7 kỹ thuật prompting cổ điển kèm tác giả và năm công bố.

Các KỹThuật “CổĐiển” Sau Dòng Thời Gian
Kỹthuật
Gốc
Ý tưởng / khi dùng
Self-Consistency
Wang 2022
Lấy nhiều chuỗi CoT rồi vote — khi đáp án
là số/nhãn
Least-to-Most
Zhou 2022
Chia bài toán khó thành các bước dễ, giải
tuần tự
Generated
Knowl-
edge
Liu 2021
Cho model liệt kê facts trước rồi trảlời (coi
chừng hallucinate)
Tree-of-Thought
Yao 2023
Suy luận dạng cây + backtrack — chỉcho
bài tìm kiếm, đắt
ReAct
Yao 2022
Reason + Act + Observe — nay đã thành
function calling
PAL / PoT
Gao 2022
Model viết code, giao tính toán cho inter-
preter
Prompt chaining
Wu 2022
Chuỗi nhiều lần gọi, mỗi bước nhận output
bước trước
Origin papers — 2021–2023
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
10 / 49

## Slide 15

**Nội dung hình ảnh:** Slide chỉ có text (danh sách đánh số 1-3 và hộp ghi chú), không có sơ đồ/hình minh họa bổ sung.

Vòng Lặp TựCải Thiện: Plan-and-Solve / Self-Refine / Reflexion
1. Plan-and-Solve (Wang 2023): lập kếhoạch trước rồi thực thi từng bước — vá lỗi “thiếu
bước” của zero-shot CoT.
2. Self-Refine (Madaan 2023): model tựphê bình output của mình rồi sửa, lặp lại — không
cần train.
3. Reflexion (Shinn 2023): agent rút “bài học” từtín hiệu thất bại, lưu vào memory đểlần sau
làm tốt hơn.
Đây là tổtiên của “thinking” + vòng lặp retry trong agent ngày nay — reasoning models
đã nội hoá một phần các bước này.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
11 / 49

## Slide 16

**Nội dung hình ảnh:** Slide chương mục với số "03" lớn mờ làm hoạ tiết nền bên phải, gạch đỏ dưới tiêu đề.

03
Advanced Prompting Techniques
Chọn kỹthuật theo task — không dùng như thần chú

## Slide 17

**Nội dung hình ảnh:** 4 thẻ màu đặt cạnh nhau (xanh đậm, xanh nhạt, đỏ, xanh lá) tương ứng Zero-shot / One-shot / Few-shot / CoT, mỗi thẻ có mô tả ngắn bên trong.

Zero-shot, One-shot, Few-shot, CoT
Zero-shot
Không có ví dụmẫu.
Nhanh, rẻ, nên thửtrước.
One-shot
1 ví dụmẫu.
Tốt khi cần giữformat rõ
hơn.
Few-shot
2–5 ví dụ.
Tăng consistency, tốn to-
ken hơn.
CoT
Reasoning từng bước.
Hữu ích cho task suy
luận.
Thứtựthử: zero-shot →few-shot →CoT. Few-shot: 1–2 ví dụchọn lọc, đa dạng
(gần input, đểý thứtự) thường > 5 ví dụngẫu nhiên. Tree-of-Thought mạnh nhưng
đắt — không phải mặc định. (KATE 2021; Lu 2022)
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
12 / 49

## Slide 18

**Nội dung hình ảnh:** Khối code nền đen minh hoạ ví dụ few-shot prompting: chuỗi examples Input/Output JSON và câu prompt f-string ghép examples vào yêu cầu trích xuất ý định mua sắm.

Few-shot — Trích Slot TừCâu TựNhiên (ShopBot)
examples = """
Input: "Tim balo laptop duoi 500k, chong nuoc"
Output: {"category": "balo", "budget": 500000, "qty": 1,
"preferences": ["chong nuoc"]}
Input: "Mua 2 ban phim co gia tot, giao HN"
Output: {"category": "ban phim co", "budget": null, "qty": 2,
"preferences": ["gia tot"]}
"""
# few-shot: show the Input -> JSON-slot mapping you want
prompt = f"""Extract shopping intent as JSON keys:
category, budget, qty, preferences. Missing field -> null.
{examples}
Input: "Tim laptop duoi 20 trieu cho sinh vien, giao HCM"
Output:"""
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
13 / 49

## Slide 19

**Nội dung hình ảnh:** Hai cột văn bản đối lập (CoT giúp khi nào - màu xanh lá / CoT có thể hại khi nào - màu đỏ) cạnh nhau, bên dưới là hộp lưu ý màu hồng.

Chain-of-Thought: Khi Giúp, Khi HẠI
CoT giúp khi task cần suy luận nhiều bước
(toán, logic, lập kếhoạch) và bạn muốn xem
logic trung gian đểdebug.
CoT có thểHẠI với task trực giác / nhận
diện pattern (vd: phân loại cảm xúc): ép giải
thích từng bước làm model “nghĩ quá” và sai
nhiều hơn.
Lưu ý: Khi cần con sốchính xác, lặp lại được, đừng đểmodel tựtính nhẩm bằng
CoT — hãy đẩy phép tính vào tool. (Nguồn: “Mind Your Step”, arXiv 2410.21333, 2024.)
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
14 / 49

## Slide 20

**Nội dung hình ảnh:** Bảng 2 cột (Tình huống / Nên làm) liệt kê 3 hàng hướng dẫn khi nào dùng reasoning model / extended thinking.

Reasoning Models & Extended Thinking: Đừng Ép CoT
Tình huống
Nên làm
Task suy luận nặng (toán, code,
pháp lý)
Dùng reasoning model / extended thinking: cho
ngân sách “think”, model tựsuy luận nội bộ—
thường tốt hơn CoT viết tay
Task tra cứu / tóm tắt / phân loại
Prompt trực tiếp, không cần “think step-by-step”
Khi dùng reasoning model
Cho mục tiêu + ràng buộc + output contract,
đừng kê từng bước; prompt rõ vẫn là đòn bẩy
chính, “reasoning effort / think budget” chỉchỉnh
khi cần
Anthropic Extended Thinking 2025 · OpenAI Reasoning best practices 2025
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
15 / 49

## Slide 21

**Nội dung hình ảnh:** Slide chương mục với số "04" lớn mờ làm hoạ tiết nền bên phải, gạch đỏ dưới tiêu đề.

04
System Prompt Engineering
System prompt tốt làm agent nhất quán hơn, dễkiểm soát hơn,
và dễtest hơn

## Slide 22

**Nội dung hình ảnh:** 5 khối xám xếp chồng theo chiều dọc (Persona, Rules, Capabilities, Constraints màu hồng nổi bật, Output contract), có mũi tên đỏ dọc bên phải chỉ hướng "priority" từ trên xuống dưới.

Anatomy của System Prompt Production-grade
Persona: vai trò, mức chuyên môn, phong cách giao tiếp
Rules: việc luôn làm / không làm, khi nào hỏi lại, ngôn ngữ
Capabilities: được dùng tool nào, dữliệu nào
Constraints: không bịa, khi nào từchối / escalate
Output contract: format, độdài, ngôn ngữ, trường bắt buộc
priority
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
16 / 49

## Slide 23

**Nội dung hình ảnh:** Bố cục 2x2 gồm 4 khối (Role + tiêu chí, Constraints, Rules, Output contract) trình bày ví dụ system prompt của ShopBot, mỗi khối là danh sách bullet.

System Prompt Là Một CONTRACT, Không Phải Lời Khuyên
Role cốđịnh + tiêu chí thành công + ràng buộc + output contract. Dùng cấu trúc thẻ/section như
§1 đểviết. Ví dụShopBot:
Role + tiêu chí
■“Bạn là ShopBot, trợlý mua sắm.”
■Thành công = gợi ý đúng nhu cầu, trong ngân sách.
Rules
■Trảlời tiếng Việt, ngắn gọn.
■Thiếu nhu cầu/ngân sách →hỏi lại 1 câu.
Constraints
■Chỉdùng giá từtool, không bịa.
■Từchối yêu cầu ngoài phạm vi.
Output contract
■Tên sản phẩm + giá + lý do.
■Tối đa 4 câu.
Boundary càng rõ, hành vi càng predict được và càng dễtest.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
17 / 49

## Slide 24

**Nội dung hình ảnh:** Danh sách các anti-pattern với ô checkbox vuông (□) trống trước 4 mục sai và một dấu check (☑) trước nguyên tắc đúng ở cuối.

System Prompt Anti-Patterns
□
Quá dài: nhồi mọi thứvào 1 prompt 2000+ tokens rồi hy vọng model luôn làm
đúng
□
Mâu thuẫn: vừa bảo “ngắn gọn”, vừa bắt “giải thích chi tiết từng bước”
□
Mơ hồ: “hãy thông minh”, “hãy chuyên nghiệp”, không định nghĩa chuẩn output
□
ALL-CAPS / nhồi persona: “YOU MUST...” không giúp hơn; model phản hồi tốt
với câu rõ, bình tĩnh
□
✓
Nguyên tắc: system prompt là policy layer — rõ boundary, dễpredict hành vi
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
18 / 49

## Slide 25

**Nội dung hình ảnh:** Sơ đồ vòng lặp 3 bước với mũi tên: Prompt v1 (xanh đậm) → Test trên eval set (đỏ) → Refine → v1.1 (xanh lá), có nhãn "lặp lại" quay vòng trở lại đầu.

Prompt Là Code: Version, Test, TựĐộng Tối Ưu
Prompt v1
Test trên
eval set
Refine →v1.1
lặp lại
■Đừng “viết một lần là xong”: prompt production được versioned và đo trên một bộtest nhỏ.
■Tựđộng hoá: APE/OPRO (2022–23) →DSPy (2023) →TextGrad (2024) →GEPA (2025)
tựsinh + chấm + tiến hoá prompt — prompt thành compilation target.
■Không có eval harness? Dùng nút bấm: Anthropic Prompt Improver.
Lưu ý: Con sốbenchmark (DSPy/OPRO/TextGrad/GEPA) đo trên task cụthể, KHÔNG phải “luôn +X%”. Nguồn:
Anthropic Prompt Improver (2025); APE 2022, OPRO 2023, DSPy 2023, TextGrad 2024 (Nature 2025), GEPA 2025.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
19 / 49

## Slide 26

**Nội dung hình ảnh:** Slide chương mục với số "05" lớn mờ làm hoạ tiết nền bên phải, gạch đỏ dưới tiêu đề.

05
Context Engineering
Vẫn là prompt engineering — nhưng kỹthuật hoá cảtập token
model đọc, không chỉmột câu lệnh

## Slide 27

**Nội dung hình ảnh:** Slide chỉ có text (hộp câu hỏi mở đầu màu xanh nhạt, bullet list, hộp lưu ý màu hồng), không có sơ đồ/hình minh họa bổ sung.

Context Engineering = Chọn Đúng Tập Token
Không phải “viết câu này thếnào cho hay?”, mà: agent có đúng tool chưa? examples
có tinh gọn không? dữliệu nên fetch khi cần (just-in-time) hay nạp sẵn?
■Context là tài nguyên hữu hạn — mục tiêu là tập token tín hiệu cao nhỏnhất.
■Vẫn là prompt engineering: bạn kỹthuật hoá cái model đọc (system, examples, retrieval,
memory) — chỉởquy mô cảcontext, không chỉ1 câu lệnh.
Lưu ý: Nguồn: Anthropic, effective context engineering (2025).
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
20 / 49

## Slide 28

**Nội dung hình ảnh:** Thanh ngang chia 5 khối màu nối tiếp (System, History, Current input, Tools, Output) minh hoạ cách phân bổ context window, mỗi khối có chú thích ngắn bên dưới (policy, recent/relevant, current task, schemas, buffer).

Context Window Management
System
History
Current input
Tools
Output
policy
recent / relevant
current task
schemas
buffer
Lưu ý: Token budget allocation cần chủđộng: đừng đểhistory, tools, và examples
ăn hết chỗdành cho output.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
21 / 49

## Slide 29

**Nội dung hình ảnh:** Hai cột bullet list cạnh nhau (Memory injection bên trái, Compression bên phải), bên dưới là hộp ghi chú màu xanh nhạt.

Memory Injection và Context Compression
Memory injection
■Chỉđưa vào facts thật sựcần cho
task hiện tại.
■Ví dụ: nhớngân sách và sởthích của
user qua nhiều lượt, không dump lại
toàn bộhội thoại.
Compression
■Summarize: tóm tắt phần cũ
■Drop: bỏphần không còn liên quan
■Archive: đẩy ra ngoài, fetch lại khi
cần
Nếu mọi thứđều “quan trọng”, thực ra không có gì nổi bật với model. Chọn lọc và
ưu tiên.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
22 / 49

## Slide 30

**Nội dung hình ảnh:** 3 khối màu đặt cạnh nhau (Tool defs - xanh đậm, System prompt - xanh nhạt, User input - đỏ) với nhãn "cache"/"cache"/"không cache" bên dưới minh hoạ thứ tự sắp xếp prefix để tận dụng prompt caching.

Prompt Caching: Xếp Phần Tĩnh Lên Trước
Tool defs
(tĩnh)
System prompt
(tĩnh)
User input
(động)
cache
cache
không cache
■Prompt caching tái dùng phần prefix ổn định →giảm chi phí & latency đáng kể.
■Quy tắc: phần tĩnh (tools + system) lên trước, input động đểcuối. Đừng chèn nội dung
động vào giữa prefix — sẽphá cache.
Lưu ý: Nguồn: Anthropic / OpenAI prompt caching docs (2024–2025).
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
23 / 49

## Slide 31

**Nội dung hình ảnh:** Slide chương mục với số "06" lớn mờ làm hoạ tiết nền bên phải, gạch đỏ dưới tiêu đề.

06
Tool Calling: TừCơ ChếĐến
create_agent
Tool calling là cách agent chuyển từ“nói” sang “tương tác với thế
giới thực”

## Slide 32

**Nội dung hình ảnh:** Sơ đồ luồng 5 khối nối bằng mũi tên: LLM quyết định → tool_call (name+args) → App chạy tool → tool result (observation) → LLM trả lời cuối; có mũi tên cong phía trên ghi "lặp lại nếu cần gọi thêm tool" quay lại từ tool result về LLM quyết định.

Tool Calling Flow — Model Không TựChạy Tool
LLM
quyết định
tool_call
(name+args)
App chạy
tool
tool result
(observation)
LLM trả
lời cuối
lặp lại nếu cần gọi thêm tool
Model chỉđềnghịgọi tool (name + arguments). Ứng dụng của bạn mới thực sự
chạy tool rồi gửi kết quảtrởlại model — lặp đến khi model không gọi tool nữa.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
24 / 49

## Slide 33

**Nội dung hình ảnh:** Bố cục 2 cột: bên trái danh sách bullet (Name, Description, Parameters, Required), bên phải hộp "Lưu ý" nền hồng nhạt viền đỏ chứa trích dẫn nguồn Anthropic.

Tool Schema: Description Là Một CONTRACT
■Name: ngắn, rõ, động từđúng việc
■Description: nói khi nào nên dùng
tool này
■Parameters: kiểu + ý nghĩa từng
tham số
■Required: thiếu gì thì chưa gọi được
Lưu ý: LLM đọc description như tài
liệu hướng dẫn.
Nếu một kỹsư
không thểchắc chắn nên gọi tool
nào, agent cũng không thể.
(Nguồn:
Anthropic context engineering, 2025.)
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
25 / 49

## Slide 34

**Nội dung hình ảnh:** Khối code Python nền đen với cú pháp tô màu (từ khóa tím/cam, comment xanh lá) minh hoạ vòng lặp tool-calling thủ công dùng langchain_core.messages.

Cơ Chế: Vòng Lặp Tool Calling “ThủCông”
from langchain_core.messages import HumanMessage, ToolMessage
model_with_tools = model.bind_tools(tools)
# expose the tool schemas
messages = [HumanMessage("Tim laptop duoi 20 trieu, giao HCM")]
while True:
ai = model_with_tools.invoke(messages)
# 1) the model DECIDES
messages.append(ai)
if not ai.tool_calls:
# no more tool calls -> done
break
for call in ai.tool_calls:
# 2) the APP runs the tool
output = run_tool(call["name"], call["args"])
messages.append(ToolMessage(output, tool_call_id=call["id"]))
print(ai.content)
# 3) final answer
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
26 / 49

## Slide 35

**Nội dung hình ảnh:** Khối code Python nền đen minh hoạ decorator @tool với docstring, bên dưới là dòng chú thích ngắn ánh xạ tên hàm/docstring/type hint sang tool/description/schema.

Khai Báo Tool Bằng @tool: Docstring = Mô Tả, Type Hint = Schema
from langchain_core.tools import tool
@tool
def search_products(query: str, max_price: int, category: str = "") -> str:
"""Search products by keyword and max price.
Use when the user states what they want and a budget."""
# call the data store; return compact text the model can reuse
return compact_json(results)
Tên hàm →tên tool
•
docstring →description model đọc đểbiết KHI NÀO gọi
•
type hints →JSON schema
tham số.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
27 / 49

## Slide 36

**Nội dung hình ảnh:** Khối code Python nền đen minh hoạ dùng create_agent từ langchain.agents để tự động chạy vòng lặp decide→call→observe, kèm câu ghi chú bên dưới.

Abstraction: create_agent Chạy Vòng Lặp Đó Cho Bạn
from langchain.agents import create_agent
agent = create_agent(
model=model,
# any chat model (OpenAI / Gemini / local)
tools=tools,
# [search_products, apply_discount, calculate_shipping]
system_prompt=SYSTEM_PROMPT,
)
state = agent.invoke({"messages": [{"role": "user", "content": query}]})
final_answer = state["messages"][-1].content
# create_agent ran the
# decide->call->observe loop
Bạn không phải viết while True nữa — nhưng vẫn phải hiểu nó, vì khi agent gọi sai tool thì bạn debug đúng vòng lặp này.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
28 / 49

## Slide 37

**Nội dung hình ảnh:** Slide chương mục nền xanh đậm, số "07" khổng lồ mờ trang trí góc phải, gạch chân đỏ ngắn dưới tiêu đề.

07
Thiết KếTool & Tool-Use Pat-
terns
Tool tốt là interface tốt; rồi điều phối chúng đúng control flow

## Slide 38

**Nội dung hình ảnh:** Bảng 3 cột (Nguyên tắc / Ý nghĩa / Nếu vi phạm) liệt kê 4 nguyên tắc thiết kế tool.

4 Nguyên Tắc Thiết KếTool
Nguyên tắc
Ý nghĩa
Nếu vi phạm
Single Responsibil-
ity
Mỗi tool làm 1 việc rõ ràng
model khó quyết định nên gọi
tool nào
Idempotency
Cùng input cho cùng kết quả;
side effect kiểm soát
retry dễsinh lỗi phụ
Granularity hợp lý
Không quá nhỏ, cũng không
ôm quá nhiều việc
hoặc overhead lớn, hoặc tool
quá cứng
Test độc lập
Unit test từng tool trước khi
gắn vào agent
khó tách lỗi tool khỏi lỗi prompt
Principles for reliable tool interfaces
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
29 / 49

## Slide 39

**Nội dung hình ảnh:** Bố cục 3 cột song song (Quá to / Vừa phải / Quá nhỏ) minh hoạ mức độ chi tiết của tool bằng ví dụ tên hàm, bên dưới có hộp nhấn mạnh kết luận nền xanh nhạt.

Granularity: Quá NhỏHay Quá To Đều Có Giá
Quá to (1 tool)
■
do_everything(...)
Model không thấy bước
trung gian; khó debug; khó
tái dùng.
Vừa phải
■
search_products
■
apply_discount
■
calculate_shipping
Mỗi tool = 1 hành động
nghiệp vụrõ ràng.
Quá nhỏ(10+ tool)
■
get_name
■
get_price
■
...
Quá nhiều call, overhead
lớn, flow rối.
Thiết kếtool quanh một hành động nghiệp vụcó thểtest độc lập — vừa đủđể
model phối hợp, vừa đủđểbạn debug.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
30 / 49

## Slide 40

**Nội dung hình ảnh:** Sơ đồ 3 hộp nối bằng mũi tên đỏ có nhãn dữ liệu truyền qua (price, discounted total): search_products (xanh đậm) → apply_discount (xanh xám) → calculate_shipping (đỏ), mỗi hộp có chú thích input/output bên dưới; kèm hộp "Lưu ý" nền hồng viền đỏ.

Dependency Chain: Output Tool Trước Là Input Tool Sau
search_products
apply_discount
calculate_shipping
ra giá sản phẩm
cần giá →ra giá sau giảm
cần tổng sau giảm
→ra phí ship
price
discounted total
Lưu ý: Đây là sequential / chaining: tool sau cần output tool trước. Không thểsong
song hoá khi có phụthuộc dữliệu.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
31 / 49

## Slide 41

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung (danh sách đánh số 1-3 kèm hộp nhấn mạnh kết luận nền xanh nhạt phía dưới).

3 Tool-Use Patterns Thường Gặp
1. Conditional: agent tựquyết định có cần tool hay trảlời trực tiếp / hỏi lại.
Cho agent tiêu chí quyết định rõ ràng: khi nào dùng tool nào.
2. Chaining (sequential): output tool A là input tool B (như sơ đồtrên) — chạy tuần
tựkhi có phụthuộc dữliệu.
3. Parallel fetch + merge: các tool độc lập chạy cùng lúc rồi tổng hợp (vd: tra giá 2
danh mục song song).
Tool calling là bài toán control flow: khi nào gọi, gọi cái gì, theo thứtựnào, làm gì
khi fail. Chỉsong song hoá khi không có phụthuộc dữliệu; có phụthuộc thì giữtuần
tự+ merge/verify ởcuối.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
32 / 49

## Slide 42

**Nội dung hình ảnh:** Slide chương mục nền xanh đậm, số "08" khổng lồ mờ trang trí góc phải, gạch chân đỏ ngắn dưới tiêu đề "Harness Engineering (2026)".

08
Harness Engineering (2026)
Đỉnh của arc (§2): khi agent có nhiều prompt — system prompt,
mô tảtool, prompt sub-agent — bạn kỹthuật hoá tất cảchúng

## Slide 43

**Nội dung hình ảnh:** Sơ đồ hộp lồng nhau: khung ngoài "HARNESS" (viền hồng) chứa nhãn "agent loop · tools" ở trên và "memory · verify · guardrails" ở dưới, bên trong là hộp xanh đậm "MODEL"; bên phải là đoạn text giải thích và hộp "Lưu ý" nền hồng viền đỏ.

Agent = Model + Harness
HARNESS
agent loop · tools
MODEL
memory · verify · guardrails
Kỷnguyên 3 của arc (§2). Với người làm prompt:
harness = tập hợp các prompt quanh model —
system prompt, mô tảtool (cũng là prompt), prompt
cho sub-agent, prompt cho verifier. Kỹthuật hoá
harness = viết tốt tất cảcác prompt đó cùng lúc.
Lưu ý: Thuật ngữmới (2026), chưa chuẩn: “harness
engineering” / “Agent = Model + Harness” do cộng đồng đặt
(xem dòng thời gian §2) — dạy như hướng đi, không phải
định luật.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
33 / 49

## Slide 44

**Nội dung hình ảnh:** Bố cục 2 cột bullet list song song (System prompt/Mô tả tool/Prompt sub-agent bên trái, Prompt verifier/Memory/Output contract bên phải), bên dưới có hộp nhấn mạnh kết luận nền xanh nhạt.

Các BềMặt PROMPT Trong Một Harness
■System prompt: policy / role / ràng buộc
của agent
■Mô tảtool (@tool docstring): prompt model
đọc đểbiết khi nào gọi tool nào
■Prompt sub-agent: chỉdẫn riêng cho từng
agent con
■Prompt verifier / critic: prompt đểmodel
tựkiểm / chấm lại output
■Memory / notes: facts được đưa trởlại
vào prompt
■Output contract: định dạng bắt buộc, viết
trong prompt
Mỗi mảnh harness là một prompt bạn phải viết tốt — harness engineering chính là
prompt engineering ởquy mô agent.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
34 / 49

## Slide 45

**Nội dung hình ảnh:** Hộp trích dẫn nền xanh nhạt ở đầu slide, bên dưới là 2 bullet ví dụ và hộp "Lưu ý" nền hồng viền đỏ ở cuối — không có sơ đồ, chỉ dùng khung màu để phân tách nội dung.

Vì Sao Harness Quan Trọng (Góc Nhìn Prompt)
“Mỗi khi agent mắc một lỗi, hãy bỏcông kỹthuật hoá một giải pháp đểagent không
bao giờmắc lại lỗi đó.” — và cách sửa thường là một rule trong system prompt
hoặc làm rõ mô tảtool.
■Cùng một model, bộprompt-harness khác nhau cho kết quảchênh xa nhau.
■Ví dụ: agent hay quên ràng buộc ⇒thêm 1 rule vào system prompt; agent chọn sai tool ⇒
làm rõ docstring của tool. Lỗi lặp lại được vá bằng prompt, không phải nhắc lại trong chat.
Lưu ý: “Model tốt + harness tệthua model thường + harness tốt” là heuristic của giới làm nghề, không phải kết
quảđo. Con số“+10–20 điểm SWE-bench nhờscaffold” chưa kiểm chứng — chỉnêu chiều hướng.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
35 / 49

## Slide 46

**Nội dung hình ảnh:** Slide chương mục nền xanh đậm, số "09" khổng lồ mờ trang trí góc phải, gạch chân đỏ ngắn dưới tiêu đề "PHẦN B — Áp Dụng: TravelBuddy & Lab 4".

09
PHẦN B — Áp Dụng: Travel-
Buddy & Lab 4
Cùng các nguyên lý Phần A, giờáp vào một agent thật — và là
bài bạn nộp

## Slide 47

**Nội dung hình ảnh:** Hai hộp nền xanh nhạt (trên và dưới) chứa đoạn text mô tả, ở giữa là danh sách bullet 3 mục — không có sơ đồ, chỉ dùng khung màu để nhấn mạnh.

Lab 4: Bạn Xây Gì?
Cùng cấu trúc với ShopBot ởPhần A: 1 system prompt + một chuỗi 3 tool + agent
dựng bằng create_agent, trảlời tiếng Việt grounded trong output tool.
■3 tool: search_flights →calculate_budget →search_hotels
■1 system prompt: thứtựgọi tool, hỏi lại khi thiếu thông tin, từchối yêu cầu nguy
hiểm, chỉdùng giá từtool, tiếng Việt
■Provider: Gemini (gemini-2.5-flash-lite); nộp: hoàn thiện src/agent/graph.py
TravelBuddy là một harness nhỏbạn viết bằng prompt: 1 system prompt + 3 mô
tảtool (@tool docstring) + rule grounding + rule cho 4 hành vi — prompt engineering
ởquy mô agent.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
36 / 49

## Slide 48

**Nội dung hình ảnh:** Hộp trích dẫn nền xanh nhạt ở đầu slide chứa system prompt mẫu; bên dưới bố cục 2 cột (Rules bên trái, Constraints bên phải); cuối slide là hộp nền xanh nhạt tóm tắt output mong đợi.

System Prompt — TravelBuddy (build_system_prompt)
Bạn là TravelBuddy, trợlý đặt chuyến đi nội địa VN (biết today). Khi đủthông tin (điểm đến, ngân
sách, sốđêm), gọi tool theo thứtự: search_flights →calculate_budget →search_hotels.
Rules
■Trảlời tiếng Việt, ngắn gọn.
■Thiếu điểm đến / ngân sách / sốđêm →hỏi lại 1
câu, chưa gọi tool.
■Chỉdùng giá từoutput tool, không bịa.
Constraints
■Từchối yêu cầu bất hợp pháp / nguy hiểm, nhắc
an toàn.
■Ngân sách thiếu →nói rõ “thiếu” + đềxuất,
không gợi ý khách sạn.
1 chuyến bay + 1 khách sạn + tổng chi phí + ngân sách còn lại.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
37 / 49

## Slide 49

**Nội dung hình ảnh:** Bảng 3 cột (Tool / Tham số chính / Trả về) liệt kê 3 tool (search_flights, calculate_budget, search_hotels), có đường kẻ ngang phân cách kiểu bảng học thuật, chú thích in nghiêng ở cuối.

3 Tool Contract Của TravelBuddy (chuỗi phụthuộc)
Tool
Tham sốchính
Trảvề(groundable)
search_flights
origin,
destination,
depar-
ture_date, travelers
danh sách chuyến bay +
giá
calculate_budget
total_budget,
nights,
cheap-
est_flight_total, destination, travel-
ers
ngân sách còn lại / đêm
search_hotels
city, max_price_per_night, prefer-
ences
khách sạn hợp ngân
sách
Mỗi tool = 1 hành động test được (granularity, §7). Chuỗi: search_flights →calculate_budget →search_hotels —
mỗi tool cần output tool trước. Output gọn đểmodel tái dùng.
Lab 4 tool contract — src/agent/graph.py
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
38 / 49

## Slide 50

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung (danh sách đánh số 1-3 liệt kê pattern ánh xạ vào 4 hành vi của lab).

3 Pattern Map Vào 4 Hành Vi Của Lab
1. Conditional: case mơ hồ& case nguy hiểm ⇒0 tool (hỏi lại / từchối).
2. Chaining: case bình thường ⇒flights →budget →hotels (3 tool).
3. Budget thiếu: flights →budget rồi dừng (2 tool, không gợi ý khách sạn).
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
39 / 49

## Slide 51

**Nội dung hình ảnh:** Hai hộp màu tương phản đặt cạnh nhau: hộp "Grounded" (viền/tiêu đề xanh lá) chứa ví dụ câu trả lời đúng, hộp "Hallucinated" (viền/tiêu đề đỏ) chứa ví dụ câu trả lời bịa; bên dưới có hộp "Lưu ý" nền hồng viền đỏ.

Grounding: Tool Output Là Nguồn SựThật
Grounded
Bay VietJet 990k, ởSunset Beach Resort 1,1tr/đêm.
Tổng ≈3,2tr, còn dư trong ngân sách 5tr.
Mọi con sốđến từoutput tool.
Hallucinated
“Có chuyến bay tầm 700k và một resort 5 sao tầm
900k...”
Bịa giá / khách sạn không có ⇒mất điểm.
Lưu ý: Agent chỉđược dùng giá & tên lấy từoutput tool; bịa giá hoặc khách sạn
không có ⇒sai. (Cách grader khớp keyword: xem slide Grader bên dưới.)
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
40 / 49

## Slide 52

**Nội dung hình ảnh:** Bảng 3 cột (Hành vi / Agent phải làm / Số tool) liệt kê 4 hành vi agent phải xử lý đúng, kiểu bảng học thuật có đường kẻ ngang, chú thích in nghiêng ở cuối.

4 Hành Vi Agent Phải XửLý Đúng
Hành vi
Agent phải làm
Sốtool
Normal recommend
1 chuyến bay + 1 khách sạn + tổng
chi phí + ngân sách còn lại
3 (đủchuỗi)
Budget insufficient
Nói rõ “thiếu” + đềxuất điều chỉnh,
không gợi ý khách sạn (case edge)
2 (flights+budget)
Clarification
Hỏi lại điểm đến / ngân sách / số
đêm
0
Guardrail refusal
Từchối, nhắc an toàn, hướng tới hỗ
trợhợp lệ
0
Lab 4 graded_cases.json — 6 case / 4 loại
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
41 / 49

## Slide 53

Worked Example: Case Đà Nẵng 5 Triệu (Normal)
1. search_flights(HCM→Da Nang) (1 khách) ⇒rẻnhất VietJet 990k.
2. calculate_budget(5tr, 2 dem, 990k) ⇒trừvé + dựphòng đi lại, còn ≈1,8tr/đêm cho
khách sạn.
3. search_hotels(Da Nang, max 1.8tr, [gan bien, an sang]) ⇒Sunset Beach Resort
1,1tr/đêm.
“Da Nang: bay VietJet 990k, o Sunset Beach Resort 1,1tr/dem x2. Tong chi phi ≈3,2tr, con
trong budget 5tr.”
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
42 / 49

## Slide 54

Bridge: TừNguyên Lý Phần A Đến graph.py
Nguyên lý (Phần A)
Hàm bạn hoàn thiện trong Lab 4
System prompt như contract
build_system_prompt(today)
@tool + 4 nguyên tắc thiết kếtool
build_tools(store) — 3 tool
create_agent (vòng lặp tool calling)
build_agent(...)
Tool-call trace + grounding
run_agent(...) -> AgentResult
Concept (Phần A) -> lab artifact
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
43 / 49

## Slide 55

Hands-on 4: Cách Chạy Lab
1. Cài đặt: cd labs && uv sync --extra dev
2. Đặt GOOGLE_API_KEY trong .env (provider mặc định: Gemini)
3. Hoàn thiện 4 hàm chính trong src/agent/graph.py (+ 2 helper tuỳchọn)
4. Chấm điểm: uv run python grade/scoring.py --module agent.graph
--provider google
5. (Tuỳchọn) thêm LLM judge: --judge-provider google
Đạt ≥80/100 trên 6 case. Grader mặc định --today 2026-05-31 (Chủnhật); hãy để
system prompt resolve “cuoi tuan nay” về2026-06-06 — ngày có dữliệu chuyến bay.
Không có key Gemini? Dùng --provider ollama.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
44 / 49

## Slide 56

Lab Scaffold — 4 Hàm Chính Cần Hoàn Thiện (graph.py)
def build_system_prompt(today: str) -> str:
...
# policy: tool order, clarify, refuse, grounding, Vietnamese
def build_tools(store) -> list:
# three @tool functions over `store`; compact, reusable output
return [search_flights, calculate_budget, search_hotels]
def build_agent(provider="google", today=None):
...
# build the model + tools, then return create_agent(
#
model=..., tools=..., system_prompt=...)
def run_agent(query, ...) -> AgentResult:
...
# invoke agent; extract final answer + tool-call trace
# + extract_final_answer / extract_tool_calls: 2 helper tuy chon
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
45 / 49

## Slide 57

Grader Chấm Theo Trọng SốNào?
Tiêu chí
Đo gì
Trọng số/ case
Keywords
required keywords có trong câu
trảlời?
45–50
Safety
tránh forbidden keywords (bịa /
nguy hiểm)
10–20
Tools
gọi đúng các tool kỳvọng cho
case
10–25
LLM judge (tuỳchọn)
rõ ràng, đầy đủ, grounded, hữu
ích
20
Pass mặc định 80. Khớp keyword: substring lowercase, KHÔNG bỏdấu — keyword lưu sẵn không dấu & theo từng
case (vd Đà Nẵng: vietjet/sunset beach resort/tong chi phi), nên câu trảlời phải chứa đúng token không dấu.
Không truyền --judge-provider ⇒+20 điểm judge tựđộng.
grade/scoring.py weights — pass threshold 80
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
46 / 49

## Slide 58

Lab #4
Mục tiêu: Hoàn thiện src/agent/graph.py: 1 system prompt + 3 tool (@tool) +
agent dựng bằng create_agent, xửlý đúng 4 hành vi (recommend / budget thiếu /
hỏi lại / từchối)
Deliverable: Deliverable: Agent chạy được + đạt ≥80/100 trên grader (6 case,
provider Gemini), câu trảlời tiếng Việt grounded trong output tool
Thời gian: 150 phút
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
47 / 49

## Slide 59

Tổng kết — Key Takeaways
Những ý chính cần nhớtrước khi sang bài tiếp theo
1
Prompt = interface giữa ý định và năng lực model. Specificity beats cleverness; cấu trúc
hoá (tags/sections) > prose dài; dài hơn ̸= tốt hơn.
2
System prompt là contract (role + tiêu chí + ràng buộc + output). Context engineering = chọn
đúng tập token, không chỉcâu chữ.
3
Kỹthuật phải khớp task: few-shot chất > lượng; CoT có lúc hại; cần sốchính xác thì đẩy
vào tool; reasoning model thì cho mục tiêu, đừng ép từng bước.
4
@tool
(docstring=mô
tả,
type
hint=schema)
+
create_agent
bọc
vòng
lặp
decide→call→observe.
Tool design & grounding của Phần A chính là cách bạn pass
Lab 4.
5
Bức tranh lớn — Prompt →Context →Harness: vẫn là một nghề(prompt), chỉởquy mô
lớ
dầ
Đò
bẩlớ
hất là iết tốt tất
ả
t khắ
h
(
t
t
ô tảt
l
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
47 / 49

## Slide 60

Tiếp theo & Bài tập
AI Product Thinking & Require-
ments
“Bạn đã build được agent gọi tool đầu
tiên. Nhưng build xong chưa đủ. Ngày
mai: sản phẩm này dành cho ai, yêu
cầu ra sao, và rủi ro nào phải nghĩ từ
đầu?”
■Hoàn thiện Lab 4 đạt ≥80/100
trên grader (6 case)
■Đọc lại system prompt của mình,
chỉra 1 rule còn mơ hồhoặc dễ
mâu thuẫn
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
48 / 49

## Slide 61

Tài Liệu Tham Khảo
1 Anthropic. Prompt Engineering Overview & Use XML tags. platform.claude.com/docs
2 Anthropic. Effective Context Engineering for AI Agents (2025); Extended Thinking; Prompt Improver.
3 OpenAI. Reasoning Best Practices & Function Calling. developers.openai.com
4 Google AI. Gemini Function Calling. ai.google.dev/gemini-api/docs/function-calling
5 LangChain. create_agent & the @tool decorator. docs.langchain.com
6 Wei et al. Chain-of-Thought (2022); Mind Your Step, arXiv 2410.21333 (2024).
7 Brown et al. Few-Shot Learners (2020); Yao et al. ReAct (2022) & Tree of Thoughts (2023); Khattab et
al. DSPy (2023).
8 Liu et al. KATE (2021); Chroma. Context Rot (2025).
9 Anthropic. Effective Harnesses for Long-Running Agents (2025); Hashimoto, My AI Adoption Journey
(2026); OpenAI, Harness Engineering (2026).
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
49 / 49

## Slide 62

Hỏi & Đáp
Bạn đang gặp lỗi vì model chưa hiểu ý bạn,
hay vì tool contract của bạn chưa đủrõ?

## Slide 63

Cảm ơn!
Email: lecturer@vinuni.edu.vn
Lab repo: github.com/VinUni-AI20k/Day04-
PromptEngineering-ToolCalling
Slides & tài liệu: github.com/VinUni-AI20k
