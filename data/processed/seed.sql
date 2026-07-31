-- Seed data sinh tu scripts/extract_slides.py + build_concept_map.py

-- ============ lectures ============
INSERT INTO lectures (lecture_id, title, n_slides, summary) VALUES ('d1-ai-llm-foundation', 'Day 1 - AI & LLM Foundation', 29, 'Bài giảng mở ra bức tranh AI dạng tầng: AI bao trùm ML, Deep Learning, Generative AI, với LLM là tầng nền. Điểm qua lịch sử 70 năm AI (expert system 1980, ImageNet 2009, Transformer 2017, ChatGPT 2022) rồi đi sâu vào cơ chế LLM: token hóa, context window, attention, tham số và scaling law (dense vs MoE), quy trình huấn luyện pretraining → SFT → RLHF/DPO → reasoning. Nêu rõ giới hạn bẩm sinh của LLM (knowledge cutoff, hallucination, học vẹt đường tắt) và cách Chain-of-Thought cải thiện suy luận. Kết bài bằng bước từ LLM lên Agent (4 cấp độ tự chủ), cách chọn model theo tầng chi phí, và kỹ thuật prompt cơ bản (4 lớp prompt, temperature/top_p).');
INSERT INTO lectures (lecture_id, title, n_slides, summary) VALUES ('d2-xac-dinh-bai-toan', 'Day 2 - Xác định bài toán cho AI', 29, 'Bài giảng dạy quy trình biến một yêu cầu AI mơ hồ thành Problem Statement rõ ràng, dùng khung Double Diamond (Discover/Define/Develop/Deliver) và Google PAIR. Học viên học cách tìm đúng bài toán (4 lens, tránh anti-pattern solution-first), định lượng hóa điểm đau (baseline/target/measurement), rồi đi qua 3 bước PAIR: (1) AI có thật sự cần thiết không, (2) Automate hay Augment và chọn cấp độ giải pháp Rule/Workflow/Agent, (3) thiết kế reward function và đánh đổi precision/recall. Kết thúc bằng cách viết Problem Statement đầy đủ 9 trường và ra quyết định Go / Not Yet / No-Go dựa trên lập luận chứ không phải thiên kiến công nghệ.');

-- ============ slides ============
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 1, 'AI & LLM Foundation', 'AI IN ACTION - Day 1
AI & LLM Foundation
Bạn đang dùng AI mỗi ngày — nhưng thực sự bên trong nó đang làm gì?', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 2, 'Agenda', 'AI IN ACTION - Day 1
Agenda
• Bức tranh AI & các tầng của AI
• Lịch sử AI 70 năm
• Bên trong LLM: cơ chế vận hành
• Từ LLM đến AI Agent
• Landscape: model hôm nay & cuộc đua hiện tại
• Chọn model & chi phí token
• Gọi API lần đầu
• Tổng kết — những ý để mang về
AI & LLM Foundation
Từ "nghe AI" đến "gọi AI" trong một ngày', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 3, 'AI, ML, Deep Learning, GenAI, LLM — nằm ở đâu trong cùng một hệ?', 'AI, ML, Deep Learning, GenAI, LLM — nằm ở đâu trong cùng một hệ?
AI — chiếc ô lớn nhất: mọi hệ thống có yếu tố
“thông minh”.
Machine learning — học từ dữ liệu thay vì viết
luật tay.
Deep learning — mạng nơ-ron nhiều tầng tự học
đặc trưng.
Generative AI — sinh nội dung mới: văn bản,
ảnh, code.
LLM — model nền chuyên ngôn ngữ, tim của làn
sóng hiện nay.
ARTIFICIAL INTELLIGENCE
MACHINE LEARNING
DEEP LEARNING
GENERATIVE AI
LLM
GPT · Claude · Kimi
kể cả hệ luật tay, robot…
lọc spam · gợi ý phim
nhận diện ảnh · giọng nói
văn bản · ảnh · code
từ rộng đến hẹp
LLM không phải toàn bộ AI — nhưng nó là tầng
nền của gần hết trải nghiệm AI bạn dùng hôm nay', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 4, 'Ba nhóm AI chính: phân loại · sinh nội dung · hành động', 'Discriminative AI
Giỏi phân loại, dự đoán: lọc spam, phát
hiện gian lận, nhận diện ảnh.
Input → một nhãn, một con số
Generative AI
Sinh ra thứ mới: văn bản, ảnh, code.
ChatGPT, Claude, Midjourney.
Prompt → nội dung mới
Agentic AI
Nhận mục tiêu rồi tự làm nhiều bước:
lập kế hoạch, dùng công cụ, hành động.
Goal → Plan → Action
Ba nhóm AI chính: phân loại · sinh nội dung · hành động
LLM là engine chung của cả Generative lẫn Agentic — cuối buổi sáng mình sẽ thấy agent khác LLM ở
đâu
Hành trình khóa học: LLM Foundation → Agent → Multi-Agent → Deploy → Evaluate', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 5, 'Lịch sử AI 70 năm', 'Lịch sử AI 70 năm
Khai sinh, lời hứa đầu
tiên
2 lần mùa đông, cách tiếp cận chạm trần
Từ model đơn lẻ sang system
có khả năng hành động như
agent', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 6, '1980: Hệ chuyên gia (expert system)', '1980: Hệ chuyên gia (expert system)
Đặt lại vấn đề: "Nếu AI chỉ giải thật tốt một loại bài toán chuyên môn hẹp thì sao?"
→ Sự ra đời của expert systems
AI đổi chiến lược: thôi theo đuổi trí tuệ tổng quát và tập trung giải thật tốt một miền hẹp bằng
cách mã hóa tri thức chuyên gia thành luật', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 7, '2009: Fei-Fei Li và ImageNet — cuộc cách mạng của dữ liệu', '2009: Fei-Fei Li và ImageNet — cuộc cách mạng của dữ liệu
Trong khi cả ngành chạy theo thuật toán thông minh hơn, Fei-Fei Li chọn con đường khác: xây bộ
dữ liệu lớn hơn — 14 triệu ảnh được gán nhãn tay, hơn 20.000 loại vật.
Ba năm sau, chính bộ dữ liệu đó là sân khấu cho cú nổ AlexNet 2012 → bài học định hình cả kỷ
nguyên: đôi khi dữ liệu tốt hơn đánh bại thuật toán khôn hơn.
Deng, J. et al. (2009), “ImageNet: A Large-Scale Hierarchical Image Database”, CVPR — doi.org/10.1109/CVPR.2009.5206848 · Fei-Fei Li, TED 2015 — ted.com', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 8, '2017: Transformer', '2017: Transformer
Transformer là bước ngoặt vì nó cho mô hình hiểu ngôn ngữ theo
cách linh hoạt hơn: mỗi từ có thể nhìn sang những từ quan trọng
khác trong cả câu, thay vì chỉ đi tuần tự từng bước → trở thành nền
móng kỹ thuật cho GPT, BERT và toàn bộ làn sóng LLM sau đó.', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 9, '2022: ChatGPT', '2022: ChatGPT
ChatGPT xuất hiện như một trải nghiệm đại chúng
Lần đầu tiên rất đông người dùng phổ thông có thể trực tiếp
chạm vào một mô hình ngôn ngữ mạnh, thông qua một giao
diện đơn giản đến mức ai cũng hiểu cách dùng', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 10, 'LLM là gì? — một bộ não nền, không phải một chatbot', '1 model nền
(LLM)
💬 Chatbot
📝 Tóm tắt tài liệu
💻 Viết code
🌐 Dịch & phân tích
⟵
LLM là gì? — một bộ não nền, không phải một chatbot
LLM (Large Language Model) là một mô hình ngôn ngữ rất lớn,
thường dựa trên kiến trúc Transformer, được luyện trên hàng
nghìn tỷ mảnh chữ để học cách đoán mảnh chữ tiếp theo trong
ngữ cảnh.
Nhờ được luyện đủ rộng, nó trở thành một nền chung: thay vì
mỗi việc train một model riêng, cùng một model làm được rất
nhiều việc.
Chatbot chỉ là một dạng sản phẩm đóng gói quanh bộ não đó —
lớp áo bên ngoài.
LLM = bộ não ngôn ngữ dùng chung cho mọi việc — sản phẩm bạn thấy chỉ là lớp áo bên ngoài
Model hiện nay chủ yếu là kiến trúc decoder-only (GPT, Claude, Gemini, Kimi), nhiều model dùng MoE; sau pre-training còn các bước căn chỉnh (SFT, RLHF/DPO) và
luyện suy luận (reasoning training, từ ~2025).', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 11, 'Bên trong Transformer: đầu ra luôn là một phân bố xác suất', 'Bên trong Transformer: đầu ra luôn là một phân bố xác suất
Với mọi ngữ cảnh, model chấm điểm MỌI từ trong từ vựng — “land” 22%, “forest” 9%… — rồi chọn theo xác suất đó
Transformers, the tech behind LLMs - 3Blue1Brown', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 12, 'Sinh văn bản = đoán → nối vào câu → đoán tiếp', 'Sinh văn bản = đoán → nối vào câu → đoán tiếp
Mỗi token mới được nối vào ngữ cảnh, rồi model chạy lại từ đầu — vòng lặp predict → append → rerun
Transformers, the tech behind LLMs - 3Blue1Brown', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 13, 'Token: model không đọc "từ", model đọc mảnh chữ', 'Token: model không đọc "từ", model đọc mảnh chữ
Model không nhìn từ nguyên vẹn. Nó cắt văn bản
thành các mảnh nhỏ gọi là token: có từ là một mảnh,
có từ vỡ ba bốn mảnh, cả dấu câu và khoảng trắng
cũng là mảnh.
Ví dụ: "Hello world" ≈ 2 token, nhưng "Xin chào" có
thể tới 3–4 token.
Tiếng Việt, code, JSON tốn token hơn tiếng Anh
thường — vì dấu thanh, ký tự đặc biệt và cấu trúc bị
cắt nhỏ ra.
Mọi thứ model làm đều quy ra token — và mỗi token đều có giá. Nhớ điều này khi sang phần chi phí.
Thử trực tiếp: platform.openai.com/tokenizer · Số token chính xác phụ thuộc tokenizer của từng model.', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 14, 'Context: bàn làm việc có hạn của model', 'Context: bàn làm việc có hạn của model
Mỗi lần trả lời, model chỉ nhìn được một lượng chữ có
hạn — gọi là context. Hãy hình dung một bàn làm việc:
mọi thứ muốn model "thấy" phải bày lên bàn.
Quy đổi: 128K token ≈ một cuốn sách 300 trang; 1M
token ≈ 4–5 cuốn sách trên bàn cùng lúc.
Bàn đầy quá thì đồ ở giữa bàn dễ bị bỏ sót — đặt điều
quan trọng ở giữa một prompt rất dài, model có thể
"quên" mất.
Context càng dài càng tốn tiền và càng chậm — bàn rộng không có nghĩa là dùng tốt
Hiện tượng “quên phần giữa”: Liu et al. (2023), “Lost in the Middle” — arxiv.org/abs/2307.03172. Model thế hệ mới đã cải thiện đáng kể nhưng chưa hết hẳn.', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 15, 'Attention: mỗi từ được “nhìn sang” những từ quan trọng khác', 'Attention: mỗi từ được “nhìn sang” những từ quan trọng khác
Thay vì đọc tuần tự từng chữ, cơ chế attention cho phép mỗi token:
Chủ động “quay đầu” nhìn lại các token trước đó trong câu
Chấm điểm mức độ liên quan của từng token đối với nghĩa của mình
Khóa nghĩa theo ngữ cảnh — “nó” là quyển sách hay cái túi, tùy theo nó chú ý vào từ nào
Đây chính là chữ T trong GPT — và là lý do model hiểu ngữ cảnh tốt hơn hẳn các thế hệ trước
Video minh họa: Attention in transformers, step-by-step - 3Blue1Brown', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 16, 'Hiểu attention để dùng AI hiệu quả: quản context = quản sự chú ý', '1
Đặt điều quan trọng đầu – cuối
Đầu và cuối prompt được chú ý nhiều
nhất; đồ ở giữa dễ bị bỏ sót — yêu cầu
quan trọng đừng chôn giữa.
2
Giữ bàn làm việc sạch
Context rác = attention rác. Khi chat dài,
tóm tắt lại thay vì kéo theo mọi thứ; khi
vibe code, đưa đúng file liên quan, không
dán cả repo.
3
Cho tra sổ thay vì bắt nhớ
Tài liệu dài: lấy đoạn liên quan nhét vào
context (RAG) thay vì trông chờ model
nhớ hết hoặc nhét cả cuốn.
Hiểu attention để dùng AI hiệu quả: quản context = quản sự chú ý
Attention có hạn và có "điểm mù". Vì vậy, cách bạn bày context quyết định model chú ý vào đâu:
Agent mạnh không phải vì context khổng lồ — mà vì nó có tools để lấy đúng thứ vào bàn làm việc
đúng lúc', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 17, '175 tỷ', '2020 — GPT-3
175 tỷ
một "bác sĩ đa năng" — mọi token đều đi qua toàn bộ khớp nối
(dense)
2026 — Kimi K3
2.800 tỷ
một "bệnh viện đa khoa" — mỗi token chỉ gọi vài chuyên gia
(MoE)
compute / dữ liệu (thang log) →
test loss ↓
Luật chơi 2020–2024: cứ thêm compute + dữ liệu là model khôn lên
một cách dự đoán được (scaling law, Kaplan et al. 2020)
Tham số (parameter): những "khớp nối" model học được
Sau khi luyện xong, những gì model "biết" nằm trong các con số cố định bên trong gọi là tham số — hãy hình dung
như khớp nối thần kinh: luyện càng kỹ, các khớp nối càng được siết đúng.
Tham số không phải thứ bạn chỉnh khi dùng model — nó được đóng gói sẵn trong "bộ não" (file weights). Bạn chỉ
chỉnh được context và các núm vặn lúc gọi (như temperature).
Nhiều tham số ≠ tốn hơn tuyến tính — nhờ MoE, bệnh viện lớn gấp 16 lần
mà chi phí mỗi ca khám gần như không đổi
MoE: Shazeer et al. (2017) — arxiv.org/abs/1701.06538 · Kimi K3 (16/7/2026): ~2.8 nghìn tỷ tham số MoE — k3-kimi.com', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 18, 'LLM được tạo ra như thế nào? — đọc nhiều, được chỉ, được uốn nắn, luyện đề', 'LLM được tạo ra như thế nào? — đọc nhiều, được chỉ, được uốn nắn, luyện đề
① Pre-training — "đọc cả thư viện": học tiếng nói và kiến thức từ hàng nghìn tỷ token. ② SFT — "được chỉ cách trả
lời": học theo ví dụ mẫu để ra dáng trợ lý. ③ RLHF/DPO — "được uốn nắn": học theo phản hồi con người, an toàn và
dễ chịu hơn. ④ Luyện suy luận — "giải đề tự chấm" (từ ~2025): luyện toán/code có đáp án kiểm chứng được →
model biết làm nháp trước khi trả lời.
Đọc vạn cuốn sách chưa chắc biết trả lời phỏng vấn — đó là lý do cần bước ②, ③, ④
Ouyang et al. (2022), InstructGPT — arxiv.org/abs/2203.02155 · Rafailov et al. (2023), DPO — arxiv.org/abs/2305.18290 · RLVR: RL with verifiable rewards.', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 19, 'RLHF: ba bước uốn cỗ máy đoán token thành trợ lý biết nghe lời', 'RLHF: ba bước uốn cỗ máy đoán token thành trợ lý biết nghe lời
① Model viết nhiều câu trả lời
«Cùng một câu hỏi»
↓
LLM
Trả lời A
Trả lời B
Trả lời C
Trả lời D
② Người chấm xếp hạng
Trả lời B
1
Trả lời D
2
Trả lời A
3
Trả lời C
4
↓
REWARD MODEL
máy chấm điểm thay người
③ Huấn luyện theo điểm
LLM
↓
câu trả lời vừa viết
↓
điểm: 9.2 / 10
tăng xác suất
câu ghi điểm
cao
lặp lại hàng nghìn lần → model dần “biết nghe lời”
Cỗ máy đoán token + điểm xếp hạng của con người → trợ lý helpful · harmless · honest
Ouyang et al. (2022), “Training language models to follow instructions with human feedback” (InstructGPT) — arxiv.org/abs/2203.02155 · DPO (cách đơn giản hơn,
2023) — arxiv.org/abs/2305.18290', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 20, 'Giới hạn bẩm sinh: học giả trong bong bóng', 'Bong bóng thời gian
Model bị "đóng băng" tại ngày ngừng đọc.
Chuyện sau đó nó không biết — trừ khi
bạn cung cấp thêm (knowledge cutoff).
Nói chắc như đúng rồi
Model tối ưu cho câu nghe hợp lý, không
phải tra sự thật — nên có thể tự tin mà sai
(hallucination).
Bàn làm việc có hạn
Context có trần; quá dài vừa tốn tiền vừa
dễ bỏ sót thông tin ở giữa.
"Why does it work? We don''t know — a lot here are intuitions, not theorems or truths." — Łukasz Kaiser, đồng tác giả
"Attention Is All You Need" (OpenAI)
Giới hạn bẩm sinh: học giả trong bong bóng
Đây không phải lỗi tạm thời — đó là bản chất của cỗ máy đoán token. Vì vậy ta cần prompt tốt, context sạch, tra
sổ (RAG), tools, và luôn kiểm chứng.
“Biết nhiều” khác “làm được”: dữ liệu mới và hành động thật cần tools/retrieval/workflow — nền của các ngày sau.', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 21, 'Vì sao model vẫn sai: nó rất giỏi học vẹt đường tắt', '1
Phân loại spam
Model thực chất đã học:
“đếm số hyperlink trong email”
Email sạch nhưng nhiều link → vẫn bị gán
spam
2 Câu chủ quan vs khách quan
Model thực chất đã học:
“có phải câu trích từ film review
không”
Ăn gian bằng nguồn gốc câu, không phải
nội dung câu
3 Suy luận ngôn ngữ (MNLI)
Model thực chất đã học:
“câu có động từ phủ định”
Đổi cấu trúc dữ liệu test là điểm tụt ngay
Ba “đường tắt” (spurious cues) trên do chính LLM tự động phát hiện và mô tả bằng ngôn ngữ tự nhiên — trên quy mô 675 bài toán
thật của benchmark OpenD5.
Vì sao model vẫn sai: nó rất giỏi học vẹt đường tắt
Benchmark cao ≠ model hiểu đúng thứ bạn tưởng — luôn test trên dữ liệu của chính
mình
Zhong, Snell, Klein & Steinhardt (2022), “Describing Differences between Text Distributions with Natural Language”, ICML 2022 · Zhong et al. (2023), “Goal Driven
Discovery of Distributional Differences via Language Descriptions” (OpenD5), NeurIPS 2023', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 22, 'Chain-of-Thought: chỉ thêm "giấy nháp", từ sai thành đúng', 'Bài toán: "Có 5 quả bóng tennis. Mua thêm 2 hộp, mỗi hộp 3 quả. Hỏi tổng cộng có bao nhiêu quả?"
Không có nháp — trả lời ngay
Model đọc câu hỏi → bật ra đáp án ngay:
"Đáp án là 27 quả."
✗ SAI
Có giấy nháp — "hãy nghĩ từng bước"
"Bắt đầu có 5 quả.
Mỗi hộp 3 quả × 2 hộp = 6 quả.
5 + 6 = 11.
Đáp án là 11 quả."
✓ ĐÚNG
Chain-of-Thought: chỉ thêm "giấy nháp", từ sai thành đúng
Cùng một model, cùng một câu hỏi — cho nó được viết nháp từng bước, bản chất suy luận lộ ra
Wei et al. (2022), “Chain-of-Thought Prompting Elicits Reasoning in Large Language Models” — arxiv.org/abs/2201.11903 · Đây là mầm của các reasoning model (o1,
R1...) và của test-time compute ở các slide sau.', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 23, 'Từ LLM đến agent: bốn mức độ — mỗi bậc thêm một năng lực', 'Từ LLM đến agent: bốn mức độ — mỗi bậc thêm một năng lực
LEVEL 0
Bộ não suy luận
LLM trần — không công cụ,
không dữ liệu mới
LEVEL 1
Có kết nối
+ tools: search web, đọc
database, gọi API — vượt khỏi
bong bóng thời gian
LEVEL 2
Biết lập kế hoạch
+ tự chia mục tiêu thành nhiều
bước, dùng nhiều tool nối tiếp, tự
kiểm tra kết quả từng bước
LEVEL 3
Đội agent phối hợp
+ nhiều agent chuyên biệt chia
việc như một đội ngũ (multi-
agent)
mức tự chủ & tác động thật tăng dần →
Agent không phải “một loại model khác” — đó là LLM được đặt vào vòng làm việc có mục tiêu
và hành động', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 24, 'Giải phẫu một agent: 5 bộ phận là một vòng lặp', 'Giải phẫu một agent: 5 bộ phận là một vòng lặp
vòng lặp
agent
① Goal
mục tiêu cần đạt
② Reasoning
bộ não LLM chia bước
③ Tools
search · API · database ·
code
④ Action
hành động ra đời thật
Memory
sổ tay ghi nhớ các bước
Agent = Goal + Reasoning + Tools + Memory + Action — chạy thành vòng lặp cho tới khi
xong việc
quan sát kết quả → lặp lại
ghi / đọc', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 25, 'Cùng một mức năng lực, giá rơi khoảng 10 lần mỗi năm', 'Cùng một mức năng lực, giá rơi khoảng 10 lần mỗi năm
Việc năm ngoái phải dùng model đắt nhất — năm nay model rẻ đã làm được
Tổng hợp từ bảng giá các nhà cung cấp, 2023–2026.', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 26, 'Chọn model theo TẦNG, không chọn theo tên', 'Chọn model theo TẦNG, không chọn theo tên
VIỆC CỦA BẠN
TẦNG MODEL
Hai lỗi đối xứng:
✗ việc đơn giản mà gọi frontier → phí tiền
✗ việc khó mà cố dùng rẻ → kết quả tệ
Việc đơn giản, khối lượng lớn
phân loại · trích xuất · tóm tắt ngắn
Việc hàng ngày
viết · code · phân tích công việc · automation
Việc khó nhất
suy luận nhiều bước · code phức tạp · tài liệu dài · độ
tin cậy cao
Việc cần kiểm soát
dữ liệu nhạy cảm · chi phí ở quy mô lớn
TẦNG 1 — FRONTIER ĐÓNG
Fable 5 · GPT-5.6 Sol · Opus 4.8
đắt nhất — chỉ trả cho việc thật sự khó
TẦNG 2 — RẺ MÀ MẠNH
Sonnet 4.6 · Terra · Gemini 3.1 Pro · Kimi K3 · Haiku ·
Flash
giải quyết đa số việc hằng ngày
★ MẶC ĐỊNH THỬ TẦNG NÀY TRƯỚC
TẦNG 3 — SELF-HOST / SIÊU RẺ
Kimi K3 open-weight · DeepSeek · Qwen
khi cần kiểm soát dữ liệu hoặc chi phí quy mô lớn
Bắt đầu từ model đủ tốt và đủ rẻ — chỉ nâng tầng khi kết quả thực sự
chặn use case', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 27, '×1', 'Token có giá: vé vào rẻ, vé ra đắt gấp 3–5 lần
VÉ VÀO — INPUT
×1
chữ BẠN gửi đi:
prompt · system instruction ·
context · lịch sử chat
rẻ — model chỉ cần đọc
VÉ RA — OUTPUT
×3–5
chữ MODEL viết ra — nó phải
tự sinh từng mảnh một, vừa
chậm vừa tốn
đắt — model phải “vắt óc”
HÓA ĐƠN — 1 LẦN GỌI API
input  1.150 tok × $3 / 1M
$0.00345
output   200 tok × $15 / 1M
$0.00300
TỔNG
≈ $0.0065
số liệu ví dụ — giá thật tùy model & nhà cung cấp
Đọc mục usage trong mỗi response — đó là hóa đơn chi tiết
giúp bạn kiểm soát chi phí từ ngày đầu.
Input tokens + Output tokens = Chi phí mỗi lần gọi — kiểm soát output là núm vặn lớn
nhất', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 28, 'Giải phẫu một prompt: bốn lớp xếp chồng', 'Giải phẫu một prompt: bốn lớp xếp chồng
LỚP 1
System
instruction
“Lời dặn đầu ca”: model là ai, cư xử thế
nào, không được làm gì
«Bạn là trợ lý y khoa, trả lời
ngắn gọn, không chẩn đoán…»
LỚP 2
User input
Câu hỏi / yêu cầu của người dùng trong
lượt này
«Tóm tắt báo cáo Q1 giúp mình»
LỚP 3
Context bổ
sung
Tài liệu, lịch sử chat, dữ liệu tra sổ — phần
bày lên “bàn làm việc”
«[đính kèm: bao_cao_q1.pdf — 3
đoạn liên quan]»
LỚP 4
Output mong
muốn
Dạng kết quả: gạch đầu dòng? bảng?
JSON? dài bao nhiêu?
«3 bullet + 1 rủi ro chính, tiếng
Việt»
1 PROMPT = 4 PHẦN
Viết rõ cả 4 lớp = đã làm tốt một nửa “prompt engineering” — phần còn lại là các ngày sau', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d1-ai-llm-foundation', 29, 'Hai núm vặn chọn từ: temperature & top_p', 'Hai núm vặn chọn từ: temperature & top_p
temperature — “núm vặn độ liều”
Cùng một câu: “Một tách ___” — bảng xác suất đổi theo T
T = 0
cà phê
trà
mưa
sao
luôn chọn từ chắc nhất
→ ổn định, lặp lại, hợp
code & phân tích
T = 1
cà phê
trà
mưa
sao
cân bằng tự nhiên —
vẫn ưu tiên từ hợp lý
T = 2
cà phê
trà
mưa
sao
phân bố phẳng ra →
đa dạng, “phiêu”, dễ
lạc đề
top_p — “chỉ xem top đầu bảng” (p = 0.9)
① Bảng xác suất gốc
cà phê
trà
mưa
sao
giữ nhóm cộng dồn ≥ 90%
cắt &
chuẩn hóa lại
→
② Bảng mới
cà phê
trà
mưa
“sao” (đuôi dài xác suất thấp) bị loại khỏi lựa chọn — model chỉ còn chọn
trong nhóm đáng tin. Thường chỉ vặn một trong hai: temperature hoặc top_p.
Lưu ý quan trọng: hai núm này không làm model thông minh hơn — chỉ đổi
cách chọn từ, không thêm tri thức.
Mặc định an toàn: temperature = 0 cho việc cần ổn định — chỉ tăng khi thật sự cần đa
dạng', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 1, 'Xác định bài toán cho AI.', 'AI IN ACTION · DAY 02
Xác định bài toán cho AI.
Từ yêu cầu mơ hồ đến Problem Statement rõ ràng.', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 2, 'Agenda', 'S Á N G
KHUNG LÝ THUYẾT (4H)
· Problem Discovery (Double Diamond, HCD)
· Problem Statement & định lượng hóa
· PAIR ① AI có thêm giá trị?
· PAIR ② Automate/Augment →
Rule/Workflow/Agent
· PAIR ③ Reward function & success criteria
· Khi AI sai & UX/HITL
· PS hoàn chỉnh → Go/Not Yet/No-Go
C H I ỀU
THỰC HÀNH LAB (4H)
· Cá nhân: Tìm 5 bài toán & điền 3 Problem
Cards
· Nhóm: Phản biện chéo, chốt 1 bài toán
· Nhóm: Xác thực dữ liệu & vẽ quy trình
· Nhóm: Xác định giải pháp & ra quyết định
· Cá nhân: Viết nhật ký phản tư (Reflection Log)
B À I N ỘP
CUỐI BUỔI
· Nhật ký tìm và lọc bài toán (Cá nhân)
· Problem Statement hoàn chỉnh (Nhóm)
· Nhật ký phản tư (Cá nhân)
Agenda
— Mục tiêu: Biến yêu cầu mơ hồ thành Problem Statement rõ ràng để ra quyết định
MỞ ĐẦU · AGENDA
DAY 02 · 04 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 3, 'Tìm đúng', 'D I A M O N D 1 — T Ì M Đ Ú N G VẤN Đ Ề
Discover: Mở rộng — khảo sát vấn đề căn bản.
Define: Thu hẹp — xác định đúng bài toán gốc.
D I A M O N D 2 — T Ì M Đ Ú N G G I ẢI P H Á P
Develop: Mở rộng — nhiều giải pháp tiềm năng.
Deliver: Thu hẹp — chọn và triển khai.
"Kỹ sư và doanh nhân được đào tạo để giải vấn đề. Nhà thiết kế được đào
tạo để khám phá vấn đề thật."
Giải pháp xuất sắc cho sai vấn đề có thể còn tệ hơn không có giải pháp.
Tìm đúng vấn đề trước khi tìm giải pháp
— Mô hình Double Diamond — Don Norman / British Design Council (2005)
NGUỒN  Don Norman — jnd.org · Design Council — The Double Diamond
BÀI TOÁN · DOUBLE DIAMOND
DAY 02 · 16 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 4, 'Diamond 1 —', 'D I S C OV E R · P H Â N K Ỳ
Khám phá / mở rộng góc nhìn
· Quan sát thực tế (Observation)
· Phỏng vấn người dùng (User Interview)
· Khảo sát (Survey)
· Nhật ký hành vi (Diary Study)
· Phân tích dữ liệu / Nhật ký hệ thống
· Bản đồ các bên liên quan (Stakeholder Mapping)
D E F I N E · H ỘI T Ụ
Định nghĩa / chọn lọc dựa vào dữ liệu
· Sơ đồ đồng cảm / Gom nhóm (Affinity Mapping)
· Kỹ thuật đặt câu hỏi 5 Whys
· Ma trận Tác động – Nỗ lực (Impact-Effort)
· Biểu quyết bằng chấm tròn (Dot Voting)
· Câu hỏi mở hướng giải quyết (How Might We)
· Phát biểu bài toán (Problem Statement)
Diamond 1 — Tìm đúng vấn đề
— Phân kỳ để thấu hiểu sâu sắc, hội tụ để lựa chọn chính xác
BÀI TOÁN · DIAMOND 1
DAY 02 · 17 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 5, 'Khởi nguồn từ', 'C U R S O R
"Lệch năng lực cốt lõi"
Từ bỏ mảng AI thiết kế cơ khí (CAD) để
tập trung vào AI code editor — nơi đội
ngũ am hiểu sâu sắc quy trình nghiệp vụ.
A R T I FAC T
"Sản phẩm tốt ≠ Thị trường lớn"
Ứng dụng đọc tin tích hợp AI xuất sắc,
nhưng quy mô thị trường quá hẹp để
thương mại hóa thành công (đóng cửa
1/2024).
N OT E B O O K L M
"Định vị đúng điểm đau"
Tập trung giải quyết nhu cầu hỏi đáp, tóm
tắt trên tài liệu cá nhân và đối chiếu
nguồn gốc bằng trích dẫn.
Khởi nguồn từ bài toán, không bắt đầu từ AI
— Ba bài học thực tế về am hiểu lĩnh vực, quy mô thị trường và định vị giải pháp
Lộ trình: Bài toán → Quy trình vận hành → Chỉ số đo lường → Giải pháp AI
NGUỒN  Lenny''s Podcast — The rise of Cursor · The Verge — Artifact · Google Blog — NotebookLM
BÀI TOÁN · CASE STUDY
DAY 02 · 22 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 6, 'Tìm bài toán AI', 'R E P E T I T I V E
Tác vụ lặp lại
Việc diễn ra thường xuyên;
công đoạn nào cần chuẩn hóa
để hướng tới tự động hóa?
T I M E - C O N S U M I N G
Tiêu tốn thời gian
Khối lượng xử lý lớn; thời gian
hao phí ở bước nào (tìm kiếm,
đọc hiểu, chờ đợi, định dạng)?
A I A DVA N TAG E
Lợi thế của AI
Tác vụ đòi hỏi phân tích ngữ
cảnh, xử lý ngôn ngữ tự nhiên,
tổng hợp đa nguồn.
U S E R PA I N P O I N T S
Điểm đau người dùng
Ai đang gặp khó khăn, phàn
nàn hoặc bị tắc nghẽn liên tục?
Tập trung nhận diện vấn đề; chưa vội đề xuất giải pháp.
Sàng lọc bài toán sẽ diễn ra vào buổi chiều.
Tìm bài toán AI ở đâu?
— Bắt đầu từ việc quan sát các hoạt động thực tế xung quanh
BÀI TOÁN · 4 LENSES
DAY 02 · 23 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 7, 'Sai lầm thường gặp —', 'Ưu tiên giải pháp (Solution-first)
Xây dựng chatbot/agent trước khi làm rõ quy trình vận hành và điểm
nghẽn thực tế.
Mơ hồ hiện trạng (No baseline)
Không lượng hóa tổn thất hiện tại, dẫn đến mất căn cứ đánh giá hiệu
quả cải tiến.
Bỏ qua đánh giá (No evaluation)
Không thiết lập kịch bản kiểm thử, chỉ số đo lường hoặc phương án đối
chứng.
Mập mờ ranh giới (No boundary)
Không rõ phạm vi tự chủ của AI và thời điểm cần con người phê duyệt
(Human-in-the-loop).
Nếu phát hiện mắc các sai lầm trên, hãy quay lại làm rõ Problem Statement trước khi chọn công nghệ.
Sai lầm thường gặp — Anti-patterns
— Dấu hiệu cảnh báo bài toán chưa được định hình rõ hoặc giải pháp AI được lựa chọn quá sớm
BÀI TOÁN · ANTI-PATTERNS
DAY 02 · 24 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 8, '"Can we use AI to ______?"', 'P A I R · C H Ư Ơ N G 1 — R E F R A M E C Â U H ỎI
"Can we use AI to ______?"
↓  thay bằng hai câu hỏi:  ↓
"How might we
solve ______?"
"Can AI solve this problem
in a unique way?"
Hỏi về bài toán trước, về AI sau — AI chỉ là một phương án trong nhiều phương án khả dĩ.
Câu hỏi đúng quyết định bài toán bạn giải — và giải pháp bạn chọn.
NGUỒN  Google PAIR — Ch.1 User Needs + Defining Success
BÀI TOÁN · PAIR REFRAME
DAY 02 · 26 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 9, 'Quick', 'Bài toán (1 câu)  problem
Vấn đề cụ thể cần giải quyết (không bao gồm giải pháp).
Đối tượng ảnh hưởng  actor
Cá nhân hoặc bộ phận chịu tác động trực tiếp từ vấn đề.
Quy trình hiện tại  workflow
Các bước vận hành thủ công hoặc tự động hiện tại (gồm 3–7 bước).
Nút thắt & Tác động  bottleneck + impact
Khâu gây chậm trễ, sai sót hoặc lặp lại; hệ quả hay tổn thất cụ thể.
Chỉ số đo thành công  success metric
Chỉ số định lượng cụ thể dùng để chứng minh hiệu quả cải tiến.
Định hướng giải pháp  direction
No AI / Rule / Workflow / Agent / Chưa xác định.
Quick Problem Card
— Khung định hình bài toán
PROBLEM STATEMENT · QUICK CARD
DAY 02 · 28 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 10, 'Câu hỏi', '0 1
Quy trình hiện tại như thế nào?
Công cụ, các bước, cơ chế bàn giao thông tin?
0 2
Nút thắt nằm ở đâu?
Bước nào chậm, dễ sai sót, lặp lại?
0 3
Hao phí hiện tại là bao nhiêu?
Thời gian, chi phí nhân sự, SLA, cơ hội bỏ lỡ?
0 4
Tiêu chí thành công đo bằng gì?
Hiệu quả cải tiến định lượng cụ thể?
0 5
Hậu quả khi xảy ra sai sót?
Phạm vi tự quyết của AI; điểm cần con người phê duyệt?
0 6
Có giải pháp phi AI đơn giản hơn?
Quy tắc, checklist, quy trình hay tài liệu hướng dẫn?
Câu hỏi khai thác bài toán
— Bộ câu hỏi định hình vấn đề dành cho các bên liên quan hoặc chính mình
BỘ THẺ CÂU HỎI #3 — CẤU TRÚC PS
PROBLEM STATEMENT · 6 CÂU HỎI
DAY 02 · 30 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 11, 'Định lượng hóa', '0 1 · B A S E L I N E
Hiện trạng / where we are
Mức hao phí hiện tại là bao nhiêu? Bằng con
số cụ thể.
0 2 · TA R G E T
Mục tiêu / where to go
Kỳ vọng cải thiện ở mức độ nào? Ngưỡng cụ
thể là gì?
0 3 · M E A S U R E M E N T
Đo lường / how we know
Chỉ số nào chứng minh tính hiệu quả? Cách
thu thập?
V Í D Ụ
T H ỜI G I A N H OÀ N T H À N H
Rút ngắn từ 90 phút xuống dưới 30 phút.
C H ẤT L Ư ỢN G C Ô N G V I ỆC
Giảm tỷ lệ lỗi phân loại từ 20% xuống dưới
5%.
TẢI T R ỌN G VẬN H À N H
Cắt giảm 40% câu hỏi trùng lặp cần Trợ
giảng xử lý.
Định lượng hóa bài toán
— Điểm đau chưa được định lượng thì không thể xác định giá trị thực tế của AI
PROBLEM STATEMENT · ĐỊNH LƯỢNG
DAY 02 · 31 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 12, 'Thiết lập chỉ số:', 'O U T P U T M E T R I C
Kết quả cuối cùng / what we optimize
· Thời lượng hoàn tất quy trình giảm bao nhiêu?
· Tỷ lệ sai sót / chất lượng đầu ra thay đổi thế nào?
· Giá trị thực tế người dùng nhận được rõ nét hơn?
I N P U T M E T R I C S
Các đòn bẩy / what we can move
· Tỷ lệ câu hỏi được phân loại chính xác.
· Tỷ lệ yêu cầu được chuyển tiếp hỗ trợ kịp thời.
· Thời gian Trợ giảng hiệu chỉnh bản nháp phản hồi.
tăng cái này
→ đo cái kia
Thiết lập chỉ số: Output & Input
— Chỉ số đo lường cần phản ánh kết quả cuối và các đòn bẩy có thể tác động
"Nâng cao hiệu suất" không phải chỉ số — cần gắn với hiện trạng, mục tiêu và phương pháp đo.
NGUỒN  Amplitude — North Star Playbook · Lenny Rachitsky — Choosing Your North Star Metric
PROBLEM STATEMENT · METRICS
DAY 02 · 32 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 13, 'Ba bước quyết định AI theo', 'B Ư ỚC ①
Giao điểm: nhu cầu × thế mạnh
AI
Bài toán của bạn có nằm trong nhóm việc
AI làm tốt hơn hẳn rule/heuristic không?
VD: câu hỏi trùng lặp của 1000 học viên K3 &
K4 có nằm trong thế mạnh của AI?
→ trả lời câu hỏi 1: có thực sự cần AI?
B Ư ỚC ②
Automate hay Augment?
AI thay thế hay hỗ trợ con người? Mức tự
động hóa tăng dần theo độ tin cậy và rủi
ro.
VD: AI trả lời thay TA luôn, hay chỉ soạn nháp để
TA duyệt?
→ trả lời câu hỏi 2: giải pháp ở cấp độ nào?
B Ư ỚC ③
Reward function & tiêu chí
thành công
Định nghĩa "đúng/sai" của hệ thống
(precision ↔ recall) và ngưỡng thành
công đo được.
VD: đo bằng gì — thời gian phản hồi? tỷ lệ định
hướng sai?
→ trả lời câu hỏi 3: PS đã đủ rõ để đo?
Ánh xạ về 4 câu hỏi trọng tâm của ngày: ① Có cần AI?  ·  ② Cấp độ nào?  ·  ③ Đủ rõ để đo?  ·  Tổng hợp ①②③ → ④ Go / Not Yet / No-Go
Ba bước quyết định AI theo PAIR
— Google People + AI Guidebook · Chương 1: User Needs + Defining Success
Đi hết 3 bước này, bạn trả lời được cả 4 câu hỏi của ngày hôm nay — từ "có thực sự cần AI?" đến "Go, Not Yet hay No-
Go".
NGUỒN  Google PAIR — People + AI Guidebook · PAIR — Ch.1 User Needs + Defining Success
CÓ NÊN ỨNG DỤNG AI · PAIR 3 BƯỚC
DAY 02 · 35 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 14, 'Khi nào', 'Gợi ý theo từng người · recommendation
Mỗi người dùng nhận một nội dung gợi ý khác nhau.
Dự đoán tương lai · prediction
Đoán trước sự kiện sắp xảy ra để chuẩn bị phản ứng.
Cá nhân hóa · personalization
Trải nghiệm tự điều chỉnh theo từng người, ngày càng hợp hơn.
Hiểu ngôn ngữ tự nhiên · natural language
Hiểu câu hỏi viết tự do bằng lời nói hằng ngày.
Nhận diện cả một lớp thực thể
Nhận ra mọi đối tượng cùng loại — VD mọi khuôn mặt.
Phát hiện cái hiếm & biến đổi
Bắt sự kiện hiếm, thay đổi theo thời gian — VD gian lận.
Agent/bot cho một lĩnh vực cụ thể
Trợ lý ảo xử lý trọn một phạm vi việc chuyên biệt.
Nội dung động thay giao diện tĩnh
Nội dung linh hoạt hiệu quả hơn layout cố định, dễ đoán.
Khi nào AI có lợi thế?
— Tám trường hợp PAIR gọi là "AI probably better" · Chương 1
PAIR
①
②
③
AI chỉ đáng làm khi bài toán nằm trong nhóm này.
NGUỒN  PAIR — Ch.1 User Needs + Defining Success
CÓ NÊN ỨNG DỤNG AI · AI PROBABLY BETTER
DAY 02 · 36 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 15, 'Khi nào AI', 'Cần duy trì tính dự đoán được
Nút Home / Cancel phải luôn nằm ở một chỗ quen thuộc — người dùng
không phải đoán mỗi lần.
Thông tin tĩnh, ít thay đổi
Nội dung cố định thì cứ hiển thị trực tiếp — không cần AI sinh lại mỗi lần.
Lỗi quá tốn kém
Chi phí của một lần sai lớn hơn lợi ích của nhiều lần đúng.
Yêu cầu minh bạch tuyệt đối
Mọi quyết định phải giải thích được từng bước, truy vết được.
Tối ưu tốc độ & chi phí thấp
Cần ra thị trường nhanh (time-to-market), vận hành rẻ — AI chỉ thêm độ trễ
và chi phí.
Việc giá trị cao người dùng muốn tự làm
Tác vụ mang ý nghĩa cá nhân mà người dùng KHÔNG muốn bị tự động hóa.
Khi nào AI KHÔNG tốt hơn?
— Sáu trường hợp PAIR gọi là "AI probably NOT better" · Chương 1
PAIR
①
②
③
Rule/heuristic dễ build, dễ giải thích, dễ debug và bảo trì hơn — nếu nó giải quyết được, đó là lựa chọn tối ưu.
NGUỒN  PAIR — Ch.1 User Needs + Defining Success
CÓ NÊN ỨNG DỤNG AI · KHI NÀO KHÔNG CẦN AI
DAY 02 · 37 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 16, 'Hệ thống AI =', 'M O D E L
Tư duy & Sáng tạo
Xử lý đọc hiểu, soạn thảo, tổng hợp, phân loại và đưa ra gợi ý.
C O N T E XT
Tri thức chuyên biệt
Cơ sở dữ liệu, tài liệu nghiệp vụ, hồ sơ lịch sử giúp AI phản hồi chính xác theo
bối cảnh.
P L A N N I N G
Điều phối quy trình
Tự động phân rã tác vụ phức tạp và linh hoạt điều chỉnh.
TO O L S
Liên kết hệ thống
Tích hợp CRM, database, lịch làm việc hoặc API bên thứ ba.
Hệ thống AI = Model + Context + Planning + Tools
— Một giải pháp AI thực tế là một hệ thống nhiều thành phần, không chỉ dừng lại ở mô hình ngôn ngữ
Giải pháp AI là một HỆ THỐNG — model chỉ là một thành phần.
NGUỒN  Anthropic — Building effective agents · Chip Huyen — AI Engineering
HỆ THỐNG AI · KIẾN TRÚC
DAY 02 · 42 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 17, 'Automation vs', 'A U TO M AT E
AI làm thay
Chọn khi:
· Việc khó, nhàm chán, nguy hiểm hoặc cần scale
· Người dùng thiếu kiến thức / khả năng tự làm
· Có "đáp án đúng" mà mọi người cùng đồng thuận
Đo thành công bằng: hiệu quả tăng · an toàn hơn · giảm việc tẻ nhạt.
quyết định theo
từng tác vụ
A U G M E N T
AI hỗ trợ con người
Chọn khi:
· Người dùng thích tự làm việc đó
· Stakes cao: tiền bạc, pháp lý, sức khỏe
· Kết quả cần trách nhiệm cá nhân / social capital
· Sở thích khó diễn đạt thành lời
Đo bằng: mức độ thích thú · cảm giác kiểm soát · sáng tạo tăng.
Automation vs Augmentation
— Bước ② của PAIR: với từng tác vụ, AI nên làm thay hay hỗ trợ con người?
①
②
③
Việc đã automate vẫn gần như luôn cần human oversight — preview, edit, undo.
NGUỒN  Google PAIR — Ch.1 User Needs + Defining Success
RWA · AUTOMATE VS AUGMENT
DAY 02 · 43 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 18, 'Ba mức giải pháp:', 'C ẤP Đ Ộ 1
Rule / Script
· Đầu vào ổn định, ít thay đổi
· Logic viết được thành if/else
· Cần kết quả luôn đúng 100%
· Quy định pháp lý / tuân thủ chặt
Ví dụ: Tính thuế · chặn email spam theo từ khóa ·
auto-reply theo template.
C ẤP Đ Ộ 2
LLM Feature / Workflow
· Đầu vào đa dạng, không viết hết rule được
· Đầu ra cần linh hoạt (tóm tắt, dịch, phân
loại)
· Có cách đo chất lượng
· Người có thể kiểm tra trước khi gửi
Ví dụ: Tóm tắt email · chatbot FAQ · phân loại
ticket hỗ trợ.
C ẤP Đ Ộ 3
Agent
· Nhiều bước, dùng nhiều công cụ
· Tình huống thay đổi liên tục
· Cần tự ra quyết định giữa các bước
· Có kiểm soát rủi ro rõ ràng
Ví dụ: Agent nghiên cứu thị trường · coding agent
sửa nhiều file.
Thứ tự ưu tiên thực dụng: bắt đầu từ bên trái, chỉ đi sang bên phải khi giá trị tăng hơn độ phức tạp.
Ba mức giải pháp: Rule / Workflow / Agent
— Rule/Workflow/Agent là cấp độ KỸ THUẬT — còn Automate/Augment (PAIR) là cấp độ VAI TRÒ của con người trong hệ thống
RWA · TỔNG QUAN
DAY 02 · 45 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 19, 'Một tình huống,', 'C ẤP Đ Ộ 1 — R U L E ( L U ẬT T Ĩ N H )
Trả lời tự động
· Tự động trả lời FAQ, gửi link thời khóa biểu
· Gửi tài liệu sửa lỗi cài đặt cơ bản
· Nhắc nhở checklist nộp bài
Khi nào? Logic tường minh, kết quả cố định.
C ẤP Đ Ộ 2 — W O R K F L O W ( Q U Y T R Ì N H )
Duyệt Problem Card
· AI kiểm tra độ đầy đủ của Problem Card
· Yêu cầu bổ sung nếu thiếu thông tin
· Chuyển cho Trợ giảng giải quyết
Khi nào? Có quy trình rõ, AI hỗ trợ từng bước.
C ẤP Đ Ộ 3 — AG E N T ( TÁC N H Â N )
Đề xuất can thiệp chủ động
· Tự động theo dõi tiến độ nộp bài
· Phát hiện nhóm học viên bị kẹt lâu
· Chuẩn bị câu trả lời, đề xuất TA duyệt
Khi nào? Tình huống động, đa công cụ.
Không bắt buộc nâng cấp tuần tự từ Rule lên Agent → dừng ở cấp tối giản nhất nếu đã đáp ứng mục tiêu đề ra.
Một tình huống, ba cấp độ giải pháp
— Ưu tiên giải pháp đơn giản nhất có thể giải quyết bài toán và mang lại cải tiến đo lường được
RWA · SO SÁNH
DAY 02 · 50 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 20, 'Workflow patterns —', '1. Prompt Chaining
In
→
LLM Call 1
→
Gate
→
LLM Call 2
→
LLM Call 3
→
Out
┖ - - Gate fail → Exit
Chia task thành chuỗi bước tuần tự, có gate kiểm tra giữa các bước. VD: Viết outline
→ check → viết bài.
Ý nghĩa quyết định: đổi độ trễ lấy độ chính xác.
2. Routing
In
→
Router
→
LLM Call 1
LLM Call 2
LLM Call 3
→
Out
Phân loại input → đưa vào nhánh chuyên biệt, tối ưu từng loại riêng. VD: CS query →
FAQ / refund / kỹ thuật.
Ý nghĩa quyết định: câu dễ đi model rẻ, câu khó đi model mạnh.
3. Parallelization
In
→
LLM Call 1
LLM Call 2
LLM Call 3
→
Aggregator
→
Out
Chạy song song rồi tổng hợp (sectioning), hoặc chạy nhiều lần lấy vote. VD:
Guardrail + response đồng thời.
Ý nghĩa quyết định: vote để giảm rủi ro một đầu ra sai.
N G U Y Ê N TẮC A N T H R O P I C
→ Luôn ưu tiên giải pháp đơn giản nhất; chỉ tăng độ phức tạp khi
thực sự cần thiết.
3 mô hình cơ bản bên cạnh đã đủ đáp ứng hầu hết bài toán thực
tế.
Workflow patterns — đủ cho hầu hết bài toán
— Ba mô hình cơ bản theo Anthropic · Building Effective Agents (2024)
NGUỒN  Anthropic — Building effective agents
WORKFLOW PATTERNS · BASIC
DAY 02 · 52 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 21, 'Cây quyết định:', 'Cây quyết định: Lựa chọn cấp độ giải pháp
— Từ bài toán cốt lõi đến lựa chọn Rule, Workflow hay Agent
Đi từ trên xuống — mỗi nhánh "KHÔNG" là một lần tránh được độ phức tạp không cần thiết.
NGUỒN  Anthropic — Building effective agents · Google — Rules of ML
WORKFLOW · DECISION TREE
DAY 02 · 55 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 22, 'Reward function: hệ thống hiểu', 'Reward function là công thức quyết định đâu là dự đoán "đúng", đâu là "sai" — và chính nó định hình trải nghiệm người dùng cuối. Vì vậy
nó phải được thiết kế liên chức năng: tối thiểu UX × Product × Engineering cùng ngồi lại.
B ỐN K ẾT Q U Ả C Ó T H Ể X ẢY R A — C A S E A I G ỢI Ý C Â U T R Ả L ỜI
T P — T R U E P O S I T I V E · Đ Ú N G -T Í C H C ỰC
Câu hỏi nghẽn thật → AI gợi ý đúng câu trả lời. Học viên được giải tỏa,
TA đỡ tải.
T N — T R U E N E G AT I V E · Đ Ú N G -T I Ê U C ỰC
Câu hỏi đã có tài liệu sẵn → AI không can thiệp. Đúng — không cần
gợi ý gì thêm.
F P — FA L S E P O S I T I V E · B ÁO Đ ỘN G G I Ả
AI gợi ý câu trả lời SAI (hallucination) và gửi thẳng cho học viên → học
viên đi sai hướng thực hành.
F N — FA L S E N E G AT I V E · B Ỏ S ÓT
Học viên đang kẹt thật nhưng AI bỏ sót, không gợi ý → học viên vẫn
chờ lâu như cũ.
Reward function: hệ thống hiểu "đúng / sai" thế nào?
— PAIR Bước ③ · Case: AI gợi ý câu trả lời cho câu hỏi của 1000 học viên (khóa K3 & K4)
① Nhu cầu
② Auto / Augment
③ Reward function
Chi phí của FP và FN KHÔNG đối xứng — báo cháy giả ≠ bỏ sót đám cháy. Cân nhắc đánh đổi này là quyết định then chốt khi
thiết kế reward function.
NGUỒN  PAIR — Ch.1 User Needs + Defining Success
REWARD · HÀM THƯỞNG
DAY 02 · 57 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 23, '⇄', 'P R E C I S I O N C AO
TP / (TP + FP)
Ít gợi ý — nhưng gợi ý nào cũng chắc đúng. Người dùng
tin vào từng gợi ý nhận được.
H Ệ Q U Ả
Nhiều False Negative — bỏ sót học viên đang thực sự cần
giúp.
⇄
Đ Ò N B ẨY
Vặn nút bên này
lên, chất lượng
bên kia xấu đi.
R E C A L L C AO
TP / (TP + FN)
Bao trọn mọi trường hợp cần giúp — không học viên
nào bị bỏ lại phía sau.
H Ệ Q U Ả
Nhiều False Positive — gợi ý sai nhiều, TA phải lọc lại thủ
công.
Precision ↔ Recall: đánh đổi không tránh khỏi
— Cùng một hệ thống AI, hai hướng vặn nút ngược nhau
① Nhu cầu
② Auto / Augment
③ Reward function
Không có cấu hình đúng tuyệt đối — phải test điểm cân bằng với chính người dùng.
NGUỒN  PAIR — Ch.1 User Needs + Defining Success
REWARD · PRECISION ↔ RECALL
DAY 02 · 58 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 24, 'Viết', 'T E M P L AT E C ỦA PA I R
If {chỉ số cụ thể} for {tính năng AI} {drops below / goes above} {ngưỡng có nghĩa}, we will
{hành động cụ thể}.
V Í D Ụ Đ I ỀN S ẴN — C A S E TA 1 0 0 0 H ỌC V I Ê N
Nếu tỷ lệ câu trả lời AI gợi ý bị TA sửa > 30% trong 2 tuần, ta sẽ hạ mức tự động về pha 1 (chỉ gợi ý, không gửi thẳng cho học viên).
C H E C K L I S T T R Ư ỚC K H I C H ỐT M E T R I C
0 1
Metric có ý nghĩa với MỌI người dùng
không?
0 2
Có nhóm nào bị ảnh hưởng tiêu cực
không?
0 3
Đây là thành công của ngày 1 — còn
ngày 1000 thì sao?
→ Và đừng quên: lên lịch review metric định kỳ — tiêu chí thành công cũng cần được bảo trì theo thời gian.
Viết tiêu chí thành công mà hành động được
— PAIR Bước ③ · Metric tốt = chỉ số cụ thể + ngưỡng có nghĩa + hành động cụ thể
① Nhu cầu
② Auto / Augment
③ Reward function
NGUỒN  PAIR — Ch.1 User Needs + Defining Success · PAIR Worksheet — User Needs (PDF)
REWARD · SUCCESS CRITERIA
DAY 02 · 59 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 25, 'Khoảng cách giữa', '0 1 · B A S E L I N E
Thiết lập đối chứng
Đối chiếu hiệu quả với quy tắc
tĩnh, nhân sự hay quy trình hiện
tại?
0 2 · E VA L U AT I O N
Kiểm thử hệ thống
Bộ dữ liệu kiểm thử, kịch bản
biên (edge cases) và tiêu chí
nghiệm thu?
0 3 · C O N T R O L S
Cơ chế kiểm soát
Logging, fallback, rollback và
nhân sự chịu trách nhiệm?
0 4 · O P E R AT I O N S
Vận hành liên tục
Ai giám sát lỗi, cập nhật tri thức
nền và tối ưu hệ thống?
Khoảng cách giữa Demo và Production
— Phản hồi chính xác trong vài lần thử chưa đủ cơ sở để triển khai hệ thống thực tế
Mục tiêu Day 02 là xác định tính khả thi để tiếp tục nghiên cứu — chưa phải quyết định triển khai ngay.
NGUỒN  Google — Rules of ML · Chip Huyen — AI Engineering
QUYẾT ĐỊNH AI · DEMO TO PRODUCTION
DAY 02 · 61 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 26, 'Từ', '0 1 · I N P U T
Problem Statement
9 trường đã hoàn chỉnh — từ Actor,
Workflow, Bottleneck đến Boundary & HITL.
0 2 · T E S T C A S E S
Kịch bản kiểm thử
Dữ liệu thực tế và các trường hợp biên (edge
cases).
0 3 · S U C C E S S
Chỉ số hiệu năng
Đạt yêu cầu (pass) / Không đạt (fail) /
Chuyển tiếp kiểm duyệt thủ công (HITL).
TÁC V Ụ Đ Ơ N L Ẻ
Hệ thống có phân loại chính xác các
câu hỏi đầu vào không?
H I ỆU N Ă N G Q U Y T R Ì N H
Nhóm học viên có hoàn thành bài lab
nhanh hơn và ít kẹt hơn không?
R ỦI R O & S A I S Ố
Hệ thống có phản hồi sai lệch mà
không chuyển tiếp cho Lab Coach phê
duyệt không?
Từ Problem Statement đến Eval Plan
— Problem Statement rõ ràng giúp định hình cụ thể các tiêu chí kiểm thử
PROBLEM STATEMENT · EVAL PLAN
DAY 02 · 62 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 27, 'Problem Statement cho', '6 Y ẾU TỐ B À I TOÁ N C ỐT L Õ I
Actor
đối tượng ảnh hưởng
Đối tượng trực tiếp chịu ảnh hưởng bởi vấn đề.
Workflow
quy trình hiện tại
Quy trình vận hành hiện tại gồm các bước cụ thể nào?
Bottleneck
nút thắt
Khâu nào gặp tình trạng chậm trễ, sai sót, lặp lại?
Impact
tác động
Tổn thất lượng hóa bằng thời gian, chi phí, SLA hoặc chất lượng.
Success Metric
chỉ số thành công
Chỉ số đo lường cụ thể để xác định sự cải thiện.
Boundary
ranh giới
AI không được làm gì; khâu nào bắt buộc có con người.
3 Y ẾU TỐ Q U Y ẾT Đ ỊN H A I
Điểm AI can thiệp
decision · entry
AI hỗ trợ hoặc tự động hóa ở bước cụ thể nào?
Mức chọn
decision · level
Rule / Workflow / Agent?
Rủi ro & HITL
decision · safety
Phương án xử lý khi AI sai sót và quy trình phê duyệt thủ công.
Problem Statement cho hệ thống AI
— 6 yếu tố bài toán cốt lõi và 3 yếu tố quyết định AI
PROBLEM STATEMENT · 9 TRƯỜNG
DAY 02 · 67 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 28, 'Khung ra quyết định:', '✓ Go
thực hiện
Đ Ủ Đ I ỀU K I ỆN
— Bài toán rõ ràng
— Chỉ số đo lường khả thi
— Điểm can thiệp AI phù hợp
— Kiểm soát được rủi ro
⏸ Not Yet
tạm hoãn
C Ó T R I ỂN VỌN G
— Cần bổ sung dữ liệu thực tế
— Chuẩn hóa quy trình
— Thiết lập chỉ số
— Xác định ranh giới
✕ No-Go
không triển khai
K H Ô N G P H Ù H ỢP
— AI không mang giá trị vượt trội
— Rủi ro vận hành quá cao
— Giải pháp không dùng AI tối ưu hơn
Khung ra quyết định: Go / Not Yet / No-Go
— Lập luận dựa trên tính khả thi của Problem Statement, tránh thiên kiến công nghệ
Quyết định "Not Yet" thể hiện sự chín chắn trong tư duy thiết kế sản phẩm, không phải sự thất bại.
QUYẾT ĐỊNH · GO / NOT YET / NO-GO
DAY 02 · 70 / 83', NULL);
INSERT INTO slides (lecture_id, slide_no, title, body_text, image_url) VALUES ('d2-xac-dinh-bai-toan', 29, 'Sáu', '01
Brief mơ hồ không thay thế Problem Statement.
Một bản tóm tắt mơ hồ không thể thay thế cho một Problem Statement hoàn chỉnh.
02
Mô hình hóa workflow trước khi tích hợp AI.
Bắt buộc phải mô hình hóa quy trình trước khi xem xét tích hợp giải pháp AI.
03
Pain point phải được lượng hóa.
Mọi điểm đau cần được lượng hóa bằng baseline và chỉ số đo lường cụ thể.
04
Phức tạp không đồng nghĩa với hiệu quả.
Rule, Workflow và Agent là ba cấp độ khác nhau; độ phức tạp kỹ thuật không đồng nghĩa với hiệu quả tối ưu.
05
Quyết định dựa trên lập luận thực tế.
Quyết định Go / Not Yet / No-Go phải được thiết lập dựa trên lập luận thực tế và số liệu kiểm thử rõ ràng.
06
Đo reward function bằng trải nghiệm người dùng, không chỉ accuracy.
MỚI · PAIR
Thiết kế đánh đổi precision ↔ recall theo lợi ích người dùng và kiểm chứng với người dùng thật.
Sáu nguyên tắc cốt lõi sau Day 02
— Kim chỉ nam để thẩm định mọi đề xuất ứng dụng AI
NGUỒN  PAIR — Ch.1 User Needs + Defining Success
RECAP · 6 NGUYÊN TẮC
DAY 02 · 78 / 83', NULL);

-- ============ concepts ============
-- Insert theo thu tu topo (prereq truoc) de FK khong loi.
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c01', 'd1-ai-llm-foundation', 'Bức tranh AI: các tầng AI & ba nhóm AI (Discriminative/Generative/Agentic)', NULL);
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c02', 'd1-ai-llm-foundation', 'Lịch sử AI 70 năm: hệ chuyên gia, ImageNet, Transformer, ChatGPT', 'd1-c01');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c03', 'd1-ai-llm-foundation', 'LLM là gì & cơ chế sinh văn bản (next-token prediction)', 'd1-c02');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c04', 'd1-ai-llm-foundation', 'Token hóa (tokenization)', 'd1-c03');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c05', 'd1-ai-llm-foundation', 'Context window', 'd1-c04');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c06', 'd1-ai-llm-foundation', 'Cơ chế Attention', 'd1-c05');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c07', 'd1-ai-llm-foundation', 'Tham số mô hình & scaling law (dense vs MoE)', 'd1-c03');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c08', 'd1-ai-llm-foundation', 'Quy trình huấn luyện LLM: pretraining, SFT, RLHF/DPO', 'd1-c07');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c09', 'd1-ai-llm-foundation', 'Giới hạn của LLM: knowledge cutoff, hallucination, context có hạn', 'd1-c08');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c10', 'd1-ai-llm-foundation', 'Học vẹt đường tắt (spurious cues)', 'd1-c09');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c11', 'd1-ai-llm-foundation', 'Chain-of-Thought reasoning', 'd1-c09');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c12', 'd1-ai-llm-foundation', 'Từ LLM đến Agent: 4 cấp độ & giải phẫu agent', 'd1-c03');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c13', 'd1-ai-llm-foundation', 'Chi phí token & chọn model theo tầng', 'd1-c04');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d1-c14', 'd1-ai-llm-foundation', 'Kỹ thuật prompt: 4 lớp prompt & núm vặn temperature/top_p', 'd1-c06');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c01', 'd2-xac-dinh-bai-toan', 'Problem Discovery: mô hình Double Diamond', NULL);
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c02', 'd2-xac-dinh-bai-toan', 'Case study: khởi nguồn từ bài toán (Cursor, Artifact, NotebookLM)', 'd2-c01');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c03', 'd2-xac-dinh-bai-toan', 'Tìm bài toán AI: bốn lens & sai lầm thường gặp (anti-pattern)', 'd2-c02');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c04', 'd2-xac-dinh-bai-toan', 'Reframe câu hỏi PAIR & Quick Problem Card', 'd2-c03');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c05', 'd2-xac-dinh-bai-toan', 'Khai thác bài toán & định lượng hóa (baseline/target/measurement)', 'd2-c04');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c06', 'd2-xac-dinh-bai-toan', 'Thiết lập chỉ số: Output metric & Input metric', 'd2-c05');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c07', 'd2-xac-dinh-bai-toan', 'PAIR bước 1: AI có thật sự cần thiết? (AI probably better/not better)', 'd2-c06');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c08', 'd2-xac-dinh-bai-toan', 'Kiến trúc hệ thống AI (Model+Context+Planning+Tools) & Automate vs Augment', 'd2-c07');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c09', 'd2-xac-dinh-bai-toan', 'Ba mức giải pháp: Rule / Workflow / Agent', 'd2-c08');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c10', 'd2-xac-dinh-bai-toan', 'Workflow patterns & cây quyết định chọn cấp độ giải pháp', 'd2-c09');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c11', 'd2-xac-dinh-bai-toan', 'Reward function (TP/TN/FP/FN) & đánh đổi Precision-Recall', 'd2-c08');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c12', 'd2-xac-dinh-bai-toan', 'Viết tiêu chí thành công hành động được', 'd2-c11');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c13', 'd2-xac-dinh-bai-toan', 'Khoảng cách Demo đến Production & Eval Plan', 'd2-c12');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c14', 'd2-xac-dinh-bai-toan', 'Problem Statement đầy đủ 9 trường & quyết định Go/Not Yet/No-Go', 'd2-c13');
INSERT INTO concepts (concept_id, lecture_id, name, prereq_id) VALUES ('d2-c15', 'd2-xac-dinh-bai-toan', 'Recap: sáu nguyên tắc cốt lõi', 'd2-c14');

-- ============ slide_concept ============
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c01', 3, 4);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c02', 5, 9);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c03', 10, 12);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c04', 13, 13);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c05', 14, 14);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c06', 15, 16);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c07', 17, 17);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c08', 18, 19);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c09', 20, 20);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c10', 21, 21);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c11', 22, 22);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c12', 23, 24);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c13', 25, 27);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d1-ai-llm-foundation', 'd1-c14', 28, 29);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c01', 3, 4);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c02', 5, 5);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c03', 6, 7);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c04', 8, 9);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c05', 10, 11);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c06', 12, 12);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c07', 13, 15);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c08', 16, 17);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c09', 18, 19);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c10', 20, 21);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c11', 22, 23);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c12', 24, 24);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c13', 25, 26);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c14', 27, 28);
INSERT INTO slide_concept (lecture_id, concept_id, slide_start, slide_end) VALUES ('d2-xac-dinh-bai-toan', 'd2-c15', 29, 29);

-- ============ questions ============
-- reviewed=FALSE mac dinh: cho nguoi duyet tay truoc khi dua vao quiz that.
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c01', 'Trong bức tranh "AI ⊃ ML ⊃ Deep Learning ⊃ ... ⊃ LLM", mối quan hệ đúng giữa các tầng là gì?', '["LLM là một tầng hẹp nằm trong Generative AI, còn AI là tầng rộng nhất bao trùm tất cả.", "LLM và AI là hai khái niệm ngang hàng, không lồng nhau.", "Deep Learning là tầng rộng nhất, bao trùm cả AI.", "Machine Learning là tầng hẹp nhất, nằm bên trong LLM."]', 0, 'Slide 3 vẽ rõ thứ tự từ rộng đến hẹp: AI → ML → Deep Learning → Generative AI → LLM.', 1500, 3, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c01', 'Discriminative AI khác Generative AI ở điểm nào?', '["Discriminative AI luôn cần nhiều dữ liệu huấn luyện hơn Generative AI.", "Discriminative AI cho ra một nhãn/một con số (VD lọc spam); Generative AI sinh ra nội dung mới (văn bản, ảnh, code).", "Generative AI chỉ được dùng để phân loại ảnh.", "Discriminative AI là một dạng con của Agentic AI."]', 1, 'Slide 4: Discriminative AI = Input → một nhãn/con số; Generative AI = Prompt → nội dung mới.', 1500, 4, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c01', 'Agentic AI khác gì so với Generative AI thuần túy?', '["Agentic AI không sử dụng LLM làm nền.", "Agentic AI chỉ khác ở việc dùng model có nhiều tham số hơn.", "Agentic AI nhận mục tiêu rồi tự làm nhiều bước (Goal → Plan → Action), không chỉ sinh nội dung một lần.", "Generative AI luôn tự lập kế hoạch nhiều bước như Agentic AI."]', 2, 'Slide 4: Agentic AI = Goal → Plan → Action, còn Generative AI chỉ là Prompt → nội dung mới.', 1500, 4, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c01', 'Ví dụ nào sau đây thuộc nhóm Discriminative AI theo bài giảng?', '["ChatGPT viết một bài luận hoàn chỉnh.", "Agent tự đặt vé máy bay qua nhiều bước.", "Midjourney vẽ một bức tranh theo mô tả.", "Hệ thống phát hiện email gian lận / lọc spam."]', 3, 'Slide 4 liệt kê lọc spam, phát hiện gian lận, nhận diện ảnh là ví dụ Discriminative AI.', 1500, 4, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c01', 'Câu "LLM là engine chung của cả Generative lẫn Agentic AI" nghĩa là gì?', '["Cùng một LLM có thể vừa sinh nội dung vừa làm nền cho agent hành động nhiều bước, tùy cách nó được đặt vào hệ thống.", "Mỗi loại AI (Generative, Agentic) cần huấn luyện một LLM hoàn toàn riêng biệt.", "LLM chỉ có thể dùng cho Agentic AI, không dùng được cho Generative AI.", "Agentic AI không cần LLM, chỉ cần rule cứng do con người viết."]', 0, 'Slide 4 nêu rõ LLM là engine chung của Generative lẫn Agentic AI.', 1500, 4, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c01', 'Theo bài giảng, việc "lọc spam" và "gợi ý phim" là ví dụ minh họa cho tầng nào trong bức tranh AI?', '["Generative AI — vì đây là các tác vụ sinh nội dung mới.", "Machine Learning — học từ dữ liệu thay vì viết luật tay.", "LLM — vì mọi tác vụ AI hiện nay đều dùng LLM.", "Agentic AI — vì hệ thống tự quyết định gợi ý."]', 1, 'Slide 3 đặt "lọc spam · gợi ý phim" làm ví dụ minh họa cho tầng Machine Learning.', 1500, 3, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c01', 'Phát biểu nào sau đây là SAI về bức tranh AI theo bài giảng?', '["AI là chiếc ô lớn nhất, bao gồm cả những hệ thống luật tay viết cứng.", "LLM là tầng nền của gần hết trải nghiệm AI hiện nay.", "Generative AI là tầng rộng nhất, bao trùm cả AI nói chung.", "Deep learning là mạng nơ-ron nhiều tầng tự học đặc trưng."]', 2, 'Slide 3: AI mới là "chiếc ô lớn nhất", Generative AI chỉ là một tầng con hẹp hơn.', 1500, 3, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c01', 'Ba nhóm AI chính được bài giảng phân loại là gì?', '["Supervised, Unsupervised, Reinforcement.", "Narrow AI, General AI, Super AI.", "Rule-based, Statistical, Neural.", "Discriminative, Generative, Agentic."]', 3, 'Slide 4: "Ba nhóm AI chính: phân loại · sinh nội dung · hành động" = Discriminative, Generative, Agentic.', 1500, 4, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c02', 'Hệ chuyên gia (expert system, 1980) ra đời vì lý do gì theo bài giảng?', '["AI đổi chiến lược: thôi theo đuổi trí tuệ tổng quát, tập trung giải thật tốt một miền hẹp bằng cách mã hóa tri thức chuyên gia thành luật.", "Vì đã có kiến trúc Transformer để xử lý ngôn ngữ tốt hơn.", "Vì đã có bộ dữ liệu lớn như ImageNet để huấn luyện.", "Vì máy tính lúc đó đã đủ mạnh để huấn luyện mạng nơ-ron sâu."]', 0, 'Slide 6: expert system ra đời khi AI "đặt lại vấn đề" — giải hẹp bằng luật, các mốc kia đến sau (2009, 2017).', 1500, 6, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c02', 'Đóng góp chính của Fei-Fei Li và ImageNet (2009) là gì?', '["Phát minh ra kiến trúc Transformer.", "Xây một bộ dữ liệu lớn hơn (14 triệu ảnh gán nhãn tay) thay vì chỉ chạy theo thuật toán thông minh hơn.", "Tạo ra ChatGPT — giao diện chat đại chúng đầu tiên.", "Xây dựng hệ chuyên gia đầu tiên trong lịch sử AI."]', 1, 'Slide 7: bài học "đôi khi dữ liệu tốt hơn đánh bại thuật toán khôn hơn", ba năm sau là cú nổ AlexNet 2012.', 1500, 7, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c02', 'Vì sao Transformer (2017) được xem là bước ngoặt theo bài giảng?', '["Vì nó là mô hình đầu tiên được huấn luyện trên dữ liệu lớn.", "Vì nó loại bỏ hoàn toàn nhu cầu dữ liệu huấn luyện.", "Nó cho phép mỗi từ \"nhìn sang\" những từ quan trọng khác trong câu, thay vì xử lý tuần tự từng bước.", "Vì nó là giao diện chat đầu tiên cho người dùng phổ thông."]', 2, 'Slide 8: Transformer trở thành nền móng kỹ thuật cho GPT, BERT và làn sóng LLM sau đó.', 1500, 8, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c02', 'ChatGPT (2022) đánh dấu cột mốc gì theo bài giảng?', '["Là mô hình LLM đầu tiên từng được huấn luyện.", "Là thời điểm kiến trúc Transformer ra đời.", "Là lúc AI chính thức vượt qua bài kiểm tra Turing.", "Lần đầu tiên đông đảo người dùng phổ thông trực tiếp chạm vào một LLM mạnh, qua giao diện đơn giản dễ hiểu."]', 3, 'Slide 9: ChatGPT là "trải nghiệm đại chúng" đầu tiên, không phải cột mốc kỹ thuật nền tảng.', 1500, 9, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c02', 'Cột mốc nào trong lịch sử AI 70 năm xảy ra SỚM NHẤT theo bài giảng?', '["Hệ chuyên gia (expert system, 1980).", "ImageNet (2009).", "Transformer (2017).", "ChatGPT (2022)."]', 0, 'Thứ tự thời gian: 1980 (expert system) → 2009 (ImageNet) → 2017 (Transformer) → 2022 (ChatGPT).', 1500, 6, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c02', 'Bài học "đôi khi dữ liệu tốt hơn đánh bại thuật toán khôn hơn" được rút ra từ sự kiện nào?', '["Sự ra đời của hệ chuyên gia (1980).", "ImageNet (2009) và cú nổ AlexNet ba năm sau (2012).", "Sự ra đời của Transformer (2017).", "Sự phổ biến của ChatGPT (2022)."]', 1, 'Slide 7 gắn trực tiếp bài học này với câu chuyện Fei-Fei Li xây ImageNet.', 1500, 7, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c02', 'Trước khi có Transformer, hạn chế gì khiến các mô hình ngôn ngữ trước đó xử lý ngữ cảnh kém linh hoạt hơn?', '["Chúng hoàn toàn không có dữ liệu huấn luyện.", "Chúng không thể chạy trên phần cứng GPU.", "Chúng xử lý tuần tự từng bước, chưa cho phép mỗi từ chủ động \"nhìn sang\" các từ quan trọng khác trong câu.", "Chúng chưa có khái niệm token."]', 2, 'Slide 8: Transformer là bước ngoặt đúng vì thay đổi cách xử lý từ tuần tự sang "nhìn sang" linh hoạt.', 1500, 8, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c02', 'Hệ chuyên gia (1980) mã hóa tri thức theo cách nào?', '["Học từ một bộ dữ liệu lớn có gán nhãn tay (cách của ImageNet).", "Dùng cơ chế attention để hiểu ngữ cảnh (cách của Transformer).", "Huấn luyện qua phản hồi xếp hạng của con người (RLHF, một khái niệm sau này).", "Mã hóa tri thức chuyên gia thành các luật (rule) tường minh để giải một miền hẹp."]', 3, 'Slide 6: expert system dùng luật mã hóa tri thức, khác hẳn cách tiếp cận dữ liệu lớn hay attention sau này.', 1500, 6, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c03', 'Theo bài giảng, "chatbot" là gì so với LLM?', '["Chatbot chỉ là một dạng sản phẩm đóng gói quanh LLM — \"lớp áo bên ngoài\", không phải bản thân bộ não.", "Chatbot và LLM là một, không có gì khác biệt.", "LLM là một loại chatbot chuyên biệt.", "Chatbot là mô hình nền, LLM chỉ là một ứng dụng của nó."]', 0, 'Slide 10: "LLM = bộ não ngôn ngữ dùng chung cho mọi việc — sản phẩm bạn thấy chỉ là lớp áo bên ngoài".', 1500, 10, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c03', 'Khi sinh văn bản, ở mỗi bước model thực chất làm gì?', '["Chọn ngẫu nhiên hoàn toàn, không liên quan đến xác suất.", "Chấm điểm xác suất cho MỌI từ trong từ vựng, rồi chọn từ tiếp theo theo phân bố xác suất đó.", "Tra cứu trong một bảng luật cố định để chọn từ tiếp theo.", "Chỉ xem xét đúng một từ ngay trước đó, bỏ qua toàn bộ phần còn lại của câu."]', 1, 'Slide 11: model chấm điểm MỌI từ trong từ vựng (VD "land" 22%, "forest" 9%…) rồi chọn theo xác suất.', 1500, 11, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c03', 'Cơ chế "predict → append → rerun" khi sinh văn bản nghĩa là gì?', '["Model sinh toàn bộ câu trả lời cùng lúc trong một lần chạy duy nhất.", "Model chỉ chạy một lần rồi cache sẵn toàn bộ câu trả lời.", "Mỗi token mới sinh ra được nối vào ngữ cảnh, rồi model chạy lại từ đầu để đoán token tiếp theo.", "Model chọn ngẫu nhiên một đoạn văn bản có sẵn từ cơ sở dữ liệu."]', 2, 'Slide 12: "Mỗi token mới được nối vào ngữ cảnh, rồi model chạy lại từ đầu — vòng lặp predict → append → rerun".', 1500, 12, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c03', 'LLM học cách hoạt động dựa trên nguyên lý gì trong giai đoạn pre-training?', '["Học phân loại ảnh đã được gán nhãn tay.", "Học theo phần thưởng do con người chấm điểm (đó là RLHF, một bước sau).", "Học các quy tắc if-else do chuyên gia viết sẵn (expert system).", "Học đoán mảnh chữ (token) tiếp theo trong ngữ cảnh, từ hàng nghìn tỷ mảnh chữ."]', 3, 'Slide 10: LLM "được luyện trên hàng nghìn tỷ mảnh chữ để học cách đoán mảnh chữ tiếp theo trong ngữ cảnh".', 1500, 10, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c03', 'Vì sao bài giảng gọi LLM là "một nền chung" (foundation model)?', '["Vì cùng một model có thể làm được rất nhiều việc (chat, tóm tắt, code, dịch) thay vì train riêng mỗi việc một model.", "Vì nó chạy được trên mọi loại phần cứng không cần GPU.", "Vì nó hoàn toàn miễn phí sử dụng cho mọi người.", "Vì nó không cần bất kỳ dữ liệu huấn luyện nào."]', 0, 'Slide 10: "nhờ được luyện đủ rộng, nó trở thành một nền chung… cùng một model làm được rất nhiều việc".', 1500, 10, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c03', 'Kiến trúc phổ biến của các LLM hiện nay (GPT, Claude, Gemini, Kimi) là gì?', '["Encoder-only, không dùng decoder.", "Chủ yếu là decoder-only, nhiều model còn dùng thêm MoE.", "Mạng nơ-ron tích chập (CNN).", "Mạng hồi quy tuần hoàn (RNN) đơn thuần, không dùng Transformer."]', 1, 'Slide 10: "Model hiện nay chủ yếu là kiến trúc decoder-only… nhiều model dùng MoE".', 1500, 10, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c03', 'LLM được huấn luyện (pre-training) trên nguồn dữ liệu nào theo bài giảng?', '["Chỉ trên các cuộc hội thoại đã được con người gán nhãn.", "Chỉ trên mã nguồn phần mềm mã nguồn mở.", "Hàng nghìn tỷ mảnh chữ (token), để học đoán mảnh chữ tiếp theo trong ngữ cảnh.", "Chỉ trên văn bản đã được chuyên gia kiểm duyệt kỹ (gần với SFT/RLHF hơn)."]', 2, 'Slide 10 nêu rõ LLM "luyện trên hàng nghìn tỷ mảnh chữ" ở bước pre-training.', 1500, 10, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c03', 'Output của Transformer tại mỗi bước sinh một "chữ" có dạng gì?', '["Một câu trả lời hoàn chỉnh đã được xếp hạng sẵn.", "Một tập hợp các quy tắc ngữ pháp cố định.", "Một con số duy nhất biểu thị độ dài câu trả lời.", "Một phân bố xác suất trên toàn bộ từ vựng (VD \"land\" 22%, \"forest\" 9%...)."]', 3, 'Slide 11: "đầu ra luôn là một phân bố xác suất" trên mọi từ trong từ vựng.', 1500, 11, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c04', 'Token là gì theo bài giảng?', '["Mảnh chữ mà model dùng để đọc văn bản — có thể là một từ, một phần từ, dấu câu hay khoảng trắng.", "Luôn luôn là một từ hoàn chỉnh, không thể nhỏ hơn.", "Là một câu hoàn chỉnh trong văn bản.", "Là một byte trong bảng mã UTF-8."]', 0, 'Slide 13: model "đọc mảnh chữ", có từ là một mảnh, có từ vỡ ba bốn mảnh, cả dấu câu/khoảng trắng cũng là mảnh.', 1500, 13, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c04', 'Theo ví dụ trong bài, "Xin chào" tốn khoảng bao nhiêu token so với "Hello world" (≈2 token)?', '["Cả hai đều tốn đúng 1 token.", "\"Xin chào\" có thể tới 3–4 token — tiếng Việt thường tốn token hơn tiếng Anh.", "\"Xin chào\" luôn tốn ít token hơn \"Hello world\".", "Số token là cố định, không phụ thuộc ngôn ngữ."]', 1, 'Slide 13: "Hello world" ≈ 2 token, nhưng "Xin chào" có thể tới 3–4 token.', 1500, 13, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c04', 'Vì sao tiếng Việt, code, JSON thường tốn token hơn tiếng Anh thường?', '["Vì model không được huấn luyện với các ngôn ngữ/định dạng đó.", "Vì chúng luôn dài hơn về số ký tự hiển thị.", "Vì dấu thanh, ký tự đặc biệt và cấu trúc của chúng bị cắt nhỏ ra thành nhiều mảnh hơn.", "Vì chúng yêu cầu nhiều lượt gọi API hơn."]', 2, 'Slide 13 nêu rõ lý do: dấu thanh, ký tự đặc biệt, cấu trúc bị cắt nhỏ ra.', 1500, 13, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c04', 'Vì sao "mọi thứ model làm đều quy ra token" lại quan trọng cần nhớ?', '["Vì token quyết định giá trị temperature của model.", "Vì token là đơn vị đo độ chính xác của model.", "Vì token chỉ ảnh hưởng tốc độ, không ảnh hưởng chi phí.", "Vì mỗi token đều có giá — ảnh hưởng trực tiếp đến chi phí (hóa đơn) mỗi lần gọi API."]', 3, 'Slide 13: "Mọi thứ model làm đều quy ra token — và mỗi token đều có giá. Nhớ điều này khi sang phần chi phí."', 1500, 13, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c04', 'Số token chính xác của một đoạn văn bản phụ thuộc vào điều gì?', '["Tokenizer riêng của từng model — khác nhau giữa các model.", "Luôn cố định giống nhau ở mọi model.", "Chỉ phụ thuộc độ dài ký tự, không phụ thuộc model.", "Phụ thuộc vào temperature được cài đặt khi gọi API."]', 0, 'Slide 13: "Số token chính xác phụ thuộc tokenizer của từng model."', 1500, 13, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c04', 'Model "đọc" văn bản theo cách nào?', '["Đọc từng chữ cái một, không gộp thành mảnh.", "Cắt văn bản thành các mảnh nhỏ gọi là token, không đọc nguyên từ.", "Đọc nguyên cả câu như một khối duy nhất.", "Đọc theo âm tiết cố định 2 ký tự mỗi lần."]', 1, 'Slide 13: "Model không đọc ''từ'', model đọc mảnh chữ" — cắt văn bản thành token.', 1500, 13, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c04', 'Dấu câu và khoảng trắng được xử lý ra sao trong tokenization?', '["Luôn bị loại bỏ trước khi đưa vào model.", "Được gộp chung vào từ đứng trước, không tính token riêng.", "Chúng cũng được tính là các mảnh (token) riêng.", "Không tồn tại trong khái niệm token của model."]', 2, 'Slide 13: "cả dấu câu và khoảng trắng cũng là mảnh".', 1500, 13, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c04', 'Công cụ nào được bài giảng gợi ý dùng để thử đếm token trực tiếp?', '["Google Translate.", "Kho ứng dụng plugin của ChatGPT.", "Github Copilot.", "platform.openai.com/tokenizer."]', 3, 'Slide 13: "Thử trực tiếp: platform.openai.com/tokenizer".', 1500, 13, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c05', 'Context trong bài giảng được ví như hình ảnh gì?', '["Một \"bàn làm việc\" có hạn — mọi thứ muốn model thấy phải bày lên bàn.", "Một cuốn từ điển vô hạn không bao giờ đầy.", "Một ổ cứng lưu trữ vĩnh viễn mọi cuộc trò chuyện.", "Một danh sách quy tắc cố định không đổi."]', 0, 'Slide 14: "Hãy hình dung một bàn làm việc: mọi thứ muốn model ''thấy'' phải bày lên bàn."', 1500, 14, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c05', '128K token tương đương khoảng bao nhiêu theo ví dụ trong bài?', '["Một cuốn sách khoảng 300.000 trang.", "Một cuốn sách khoảng 300 trang.", "Một tin nhắn ngắn khoảng 300 từ.", "Toàn bộ nội dung của một thư viện quốc gia."]', 1, 'Slide 14: "128K token ≈ một cuốn sách 300 trang".', 1500, 14, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c05', 'Điều gì xảy ra khi "bàn làm việc" (context) bị đầy quá mức?', '["Model sẽ tự động dừng hoạt động hoàn toàn.", "Model sẽ tăng tốc độ xử lý lên đáng kể.", "Đồ ở giữa bàn — thông tin ở giữa một prompt dài — dễ bị model bỏ sót.", "Toàn bộ nội dung được ưu tiên xử lý như nhau, không phần nào bị bỏ sót."]', 2, 'Slide 14: "Bàn đầy quá thì đồ ở giữa bàn dễ bị bỏ sót".', 1500, 14, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c05', 'Hiện tượng "Lost in the Middle" được trích dẫn trong bài giảng nói về điều gì?', '["Model quên toàn bộ system instruction ngay từ đầu.", "Model chỉ nhớ được câu hỏi đầu tiên trong cả cuộc trò chuyện.", "Model luôn ưu tiên xử lý thông tin nằm ở giữa nhất.", "Model có xu hướng \"quên\" hoặc bỏ sót thông tin quan trọng nằm ở giữa một prompt rất dài."]', 3, 'Slide 14 trích Liu et al. (2023), "Lost in the Middle", đúng như mô tả về việc bỏ sót thông tin giữa prompt.', 1500, 14, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c05', 'Context càng dài thì đánh đổi ra sao theo bài giảng?', '["Càng tốn tiền và càng chậm — không đồng nghĩa với việc dùng tốt hơn.", "Luôn giúp model trả lời chính xác hơn một cách tuyệt đối.", "Không ảnh hưởng gì đến chi phí gọi API.", "Giúp giảm số token cần dùng ở output."]', 0, 'Slide 14: "Context càng dài càng tốn tiền và càng chậm — bàn rộng không có nghĩa là dùng tốt".', 1500, 14, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c05', '1M token tương đương khoảng bao nhiêu cuốn sách 300 trang theo bài giảng?', '["Khoảng 1 cuốn.", "Khoảng 4–5 cuốn.", "Khoảng 50 cuốn.", "Khoảng 500 cuốn."]', 1, 'Slide 14: "1M token ≈ 4–5 cuốn sách trên bàn cùng lúc".', 1500, 14, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c05', 'Hiện tượng "quên phần giữa" ở các model thế hệ mới hiện nay thì sao theo bài giảng?', '["Đã được giải quyết hoàn toàn, không còn xảy ra nữa.", "Ngày càng trầm trọng hơn theo thời gian.", "Đã cải thiện đáng kể nhưng chưa hết hẳn.", "Chỉ xảy ra riêng với văn bản tiếng Việt."]', 2, 'Slide 14: "Model thế hệ mới đã cải thiện đáng kể nhưng chưa hết hẳn."', 1500, 14, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c05', 'Vì sao bài giảng nói "bàn rộng không có nghĩa là dùng tốt" về context?', '["Vì context dài luôn làm giảm số token đầu ra.", "Vì model không thể xử lý context vượt quá 10K token.", "Vì context dài khiến model ngừng hoạt động ngay lập tức.", "Vì context dài hơn không tự động đảm bảo câu trả lời tốt hơn, còn tốn phí và dễ bỏ sót thông tin."]', 3, 'Slide 14 nối trực tiếp ý "context càng dài càng tốn tiền, càng chậm" với câu kết "bàn rộng không có nghĩa là dùng tốt".', 1500, 14, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c06', 'Cơ chế Attention cho phép mỗi token làm gì?', '["Chủ động \"quay đầu\" nhìn lại các token trước đó, chấm điểm mức độ liên quan để hiểu nghĩa theo ngữ cảnh.", "Chỉ nhìn đúng token liền trước, không nhìn xa hơn.", "Xử lý hoàn toàn độc lập, không liên quan gì đến token khác.", "Luôn ưu tiên token đầu tiên của toàn bộ văn bản."]', 0, 'Slide 15: attention cho phép mỗi token "quay đầu nhìn lại các token trước đó… chấm điểm mức độ liên quan".', 1500, 15, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c06', 'Chữ "T" trong GPT (Generative Pre-trained Transformer) gắn liền với cơ chế nào theo bài giảng?', '["Token hóa (tokenization).", "Attention (nằm trong kiến trúc Transformer).", "Temperature khi sinh văn bản.", "Quá trình huấn luyện (Training) nói chung."]', 1, 'Slide 15: "Đây chính là chữ T trong GPT" — nhắc tới Transformer, nền tảng của cơ chế attention.', 1500, 15, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c06', 'Vị trí nào trong một prompt thường được attention chú ý nhiều nhất theo bài giảng?', '["Chính giữa prompt.", "Chỉ dòng cuối cùng của prompt.", "Đầu và cuối prompt.", "Toàn bộ prompt được chú ý đều nhau tuyệt đối, không có vùng nào nổi bật hơn."]', 2, 'Slide 16: "Đầu và cuối prompt được chú ý nhiều nhất; đồ ở giữa dễ bị bỏ sót".', 1500, 16, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c06', 'Lời khuyên "giữ bàn làm việc sạch" nghĩa là gì khi dùng AI?', '["Xóa toàn bộ lịch sử chat sau mỗi câu hỏi.", "Luôn đưa toàn bộ tài liệu có thể liên quan vào context cho chắc ăn.", "Tắt hẳn cơ chế attention khi không cần thiết.", "Tóm tắt lại khi chat dài, chỉ đưa đúng file liên quan thay vì dán cả repo — tránh context rác."]', 3, 'Slide 16: "tóm tắt lại thay vì kéo theo mọi thứ… đưa đúng file liên quan, không dán cả repo".', 1500, 16, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c06', 'Nguyên tắc "cho tra sổ thay vì bắt nhớ" ám chỉ kỹ thuật nào?', '["RAG — lấy đoạn liên quan nhét vào context thay vì trông chờ model nhớ hết hoặc nhét cả cuốn tài liệu.", "Fine-tuning lại toàn bộ model từ đầu.", "Tăng temperature lên mức tối đa.", "Giảm kích thước context window xuống mức tối thiểu."]', 0, 'Slide 16: "Tài liệu dài: lấy đoạn liên quan nhét vào context (RAG) thay vì trông chờ model nhớ hết".', 1500, 16, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c06', 'Vì sao bài giảng nói "agent mạnh không phải vì context khổng lồ"?', '["Vì context không hề ảnh hưởng đến hiệu năng của agent.", "Mà vì nó có tools để lấy đúng thứ vào bàn làm việc đúng lúc.", "Vì agent hoàn toàn không sử dụng context.", "Vì agent luôn dùng context nhỏ hơn LLM thông thường."]', 1, 'Slide 16: "Agent mạnh không phải vì context khổng lồ — mà vì nó có tools để lấy đúng thứ vào bàn làm việc đúng lúc".', 1500, 16, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c06', 'Câu "Context rác = attention rác" nghĩa là gì?', '["Context rác sẽ tự động bị model lọc bỏ hoàn toàn, không ảnh hưởng gì.", "Context rác chỉ ảnh hưởng đến chi phí, không ảnh hưởng đến chất lượng.", "Nếu nhồi thông tin không liên quan vào context, attention sẽ bị phân tán/chú ý sai chỗ, làm giảm chất lượng trả lời.", "Attention hoàn toàn không bị ảnh hưởng bởi nội dung của context."]', 2, 'Slide 16: "Context rác = attention rác" — dẫn ý cho lời khuyên giữ bàn làm việc sạch.', 1500, 16, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c06', 'Vì sao yêu cầu quan trọng không nên bị "chôn giữa" một prompt dài?', '["Vì model đọc prompt theo thứ tự hoàn toàn ngẫu nhiên.", "Vì phần giữa prompt luôn bị hệ thống tự động xóa bỏ.", "Vì độ dài prompt không liên quan gì đến việc này.", "Vì đầu và cuối prompt được attention chú ý nhiều nhất, phần giữa dễ bị bỏ sót."]', 3, 'Slide 16: "Đặt điều quan trọng đầu – cuối… yêu cầu quan trọng đừng chôn giữa".', 1500, 16, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c07', 'Tham số (parameter) của một LLM là gì theo bài giảng?', '["Những con số cố định bên trong được học sau khi luyện xong — như các \"khớp nối thần kinh\" quyết định model \"biết\" gì.", "Là các núm vặn người dùng chỉnh khi gọi API (đó là context/temperature).", "Là số lượng token trong context window tối đa.", "Là số lượng câu hỏi model đã từng trả lời."]', 0, 'Slide 17: "những gì model ''biết'' nằm trong các con số cố định bên trong gọi là tham số".', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c07', 'Người dùng có thể trực tiếp chỉnh tham số (parameter) của model khi gọi API không?', '["Có, chỉnh trực tiếp qua một tham số tên \"params\" trong request.", "Không — tham số được đóng gói sẵn trong file weights; người dùng chỉ chỉnh được context và các núm vặn như temperature.", "Có, nhưng chỉ khi trả phí ở gói cao cấp nhất.", "Có, thông qua việc viết system instruction chi tiết hơn."]', 1, 'Slide 17: "Tham số không phải thứ bạn chỉnh khi dùng model… Bạn chỉ chỉnh được context và các núm vặn lúc gọi".', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c07', 'Theo ví dụ "bệnh viện" trong bài, MoE khác dense model như thế nào?', '["MoE luôn dùng ít tham số hơn dense model ở cùng năng lực.", "MoE không thể scale lên số tham số lớn như dense model.", "Dense giống \"bác sĩ đa năng\" — mọi token đều đi qua toàn bộ khớp nối; MoE giống \"bệnh viện đa khoa\" — mỗi token chỉ gọi vài chuyên gia.", "Dense model luôn rẻ hơn MoE ở cùng mức năng lực."]', 2, 'Slide 17 dùng đúng ẩn dụ "bác sĩ đa năng" (dense, GPT-3) và "bệnh viện đa khoa" (MoE, Kimi K3).', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c07', 'Scaling law (Kaplan et al. 2020) mô tả điều gì trong giai đoạn 2020–2024?', '["Thêm compute không ảnh hưởng gì đến năng lực model.", "Chỉ dữ liệu mới quan trọng, compute không liên quan.", "Năng lực model giảm dần khi tăng compute.", "Cứ thêm compute + dữ liệu là model khôn lên một cách dự đoán được."]', 3, 'Slide 17: "Luật chơi 2020–2024: cứ thêm compute + dữ liệu là model khôn lên một cách dự đoán được".', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c07', 'Lợi ích chính của kiến trúc MoE là gì theo bài giảng?', '["Tăng số tham số lên nhiều lần (VD gấp 16 lần) mà chi phí mỗi lần dùng gần như không đổi.", "Giúp model không cần bước pre-training nữa.", "Loại bỏ hoàn toàn nhu cầu về context window.", "Giúp model luôn trả lời chính xác 100%."]', 0, 'Slide 17: "Nhiều tham số ≠ tốn hơn tuyến tính — nhờ MoE, bệnh viện lớn gấp 16 lần mà chi phí mỗi ca khám gần như không đổi".', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c07', 'GPT-3 (2020, 175 tỷ tham số) và Kimi K3 (2026, ~2.800 tỷ tham số) khác biệt chính về kiến trúc là gì?', '["Cả hai đều dùng kiến trúc dense.", "GPT-3 là dense, còn Kimi K3 dùng kiến trúc MoE.", "GPT-3 dùng MoE còn Kimi K3 dùng dense.", "Cả hai đều không công khai thông tin kiến trúc."]', 1, 'Slide 17 ghi rõ GPT-3 là dense ("bác sĩ đa năng"), Kimi K3 là MoE ("bệnh viện đa khoa").', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c07', '"Nhiều tham số không đồng nghĩa tốn kém hơn tuyến tính" là nhờ đâu theo bài giảng?', '["Nhờ giảm kích thước context window xuống mức tối thiểu.", "Nhờ tăng temperature khi sinh văn bản.", "Nhờ kiến trúc MoE, mỗi token chỉ cần \"vài chuyên gia\" xử lý thay vì toàn bộ mạng.", "Nhờ nén dữ liệu huấn luyện trước khi train."]', 2, 'Slide 17 giải thích rõ cơ chế MoE giúp chi phí mỗi lần dùng gần như không đổi dù tham số tăng vọt.', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c07', 'Trục hoành trong biểu đồ scaling law (test loss giảm dần theo thang log) đại diện cho điều gì?', '["Số lượng người dùng đồng thời gọi API.", "Giá tiền của mỗi token đầu ra.", "Số vòng RLHF đã được thực hiện.", "Compute và dữ liệu, theo thang log."]', 3, 'Slide 17: "compute / dữ liệu (thang log) → test loss ↓".', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c08', 'Thứ tự đúng của quy trình tạo ra một LLM theo bài giảng là gì?', '["Pre-training → SFT → RLHF/DPO → Luyện suy luận (reasoning).", "SFT → Pre-training → RLHF/DPO → Luyện suy luận.", "RLHF/DPO → SFT → Pre-training → Luyện suy luận.", "Luyện suy luận → Pre-training → SFT → RLHF/DPO."]', 0, 'Slide 18 đánh số rõ: ① Pre-training ② SFT ③ RLHF/DPO ④ Luyện suy luận.', 1500, 18, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c08', 'SFT (Supervised Fine-Tuning) giúp model điều gì?', '["Học đọc toàn bộ thư viện kiến thức lần đầu tiên (đó là pre-training).", "Học theo ví dụ mẫu để \"ra dáng trợ lý\" — biết cách trả lời.", "Học giải toán/code có đáp án kiểm chứng được (đó là luyện suy luận).", "Học cách cắt văn bản thành token (tokenization)."]', 1, 'Slide 18: SFT — "được chỉ cách trả lời: học theo ví dụ mẫu để ra dáng trợ lý".', 1500, 18, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c08', 'RLHF/DPO trong quy trình huấn luyện đóng vai trò gì?', '["Dạy model đọc hàng nghìn tỷ token lần đầu tiên.", "Dạy model cách cắt văn bản thành token.", "\"Uốn nắn\" model học theo phản hồi con người, để an toàn và dễ chịu hơn.", "Tăng kích thước context window tối đa của model."]', 2, 'Slide 18: RLHF/DPO — "được uốn nắn: học theo phản hồi con người, an toàn và dễ chịu hơn".', 1500, 18, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c08', 'Vì sao bài giảng nói "đọc vạn cuốn sách chưa chắc biết trả lời phỏng vấn"?', '["Vì model về bản chất không thể xử lý được văn bản dạng sách.", "Vì pre-training không liên quan gì đến chất lượng câu trả lời.", "Vì cần tăng context window lên rất lớn mới trả lời tốt được.", "Vì pre-training (đọc nhiều) chưa đủ để model biết cách trả lời như trợ lý — cần thêm SFT, RLHF/DPO, luyện suy luận."]', 3, 'Slide 18: "Đọc vạn cuốn sách chưa chắc biết trả lời phỏng vấn — đó là lý do cần bước ②, ③, ④".', 1500, 18, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c08', 'Trong quy trình RLHF, "Reward Model" dùng để làm gì?', '["Chấm điểm câu trả lời thay cho con người, dựa trên xếp hạng con người đã cho trước đó.", "Sinh ra câu trả lời đầu tiên thay cho LLM chính.", "Thay thế hoàn toàn bước pre-training của model.", "Quyết định kích thước context window tối đa của model."]', 0, 'Slide 19: "REWARD MODEL — máy chấm điểm thay người", dùng để huấn luyện tiếp theo điểm số.', 1500, 19, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c08', 'Cụm "helpful · harmless · honest" mà RLHF hướng tới là kết quả của bước huấn luyện nào?', '["Pre-training.", "RLHF (Reinforcement Learning from Human Feedback).", "Tokenization.", "Scaling theo compute và dữ liệu."]', 1, 'Slide 19: "Cỗ máy đoán token + điểm xếp hạng của con người → trợ lý helpful · harmless · honest".', 1500, 19, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c08', '"Luyện suy luận" (reasoning training, từ ~2025) đặc trưng bởi điều gì?', '["Chỉ dựa vào phản hồi chủ quan của con người, không có đáp án kiểm chứng.", "Là bước đầu tiên, xảy ra trước cả pre-training.", "Luyện toán/code có đáp án kiểm chứng được, giúp model \"làm nháp\" trước khi trả lời.", "Là bước thay thế hoàn toàn cho SFT, không cần SFT nữa."]', 2, 'Slide 18: "Luyện suy luận — ''giải đề tự chấm'' (từ ~2025): luyện toán/code có đáp án kiểm chứng được".', 1500, 18, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c08', 'Trong quy trình RLHF ở slide 19, sau khi người chấm xếp hạng nhiều câu trả lời, bước tiếp theo là gì?', '["Model được huấn luyện lại từ đầu với một bộ dữ liệu hoàn toàn mới.", "Quá trình huấn luyện dừng lại ngay, không cần thêm bước nào.", "Chuyển thẳng sang bước tokenization lại toàn bộ dữ liệu.", "Huấn luyện Reward Model, rồi dùng nó để tăng xác suất model sinh ra câu trả lời ghi điểm cao, lặp lại hàng nghìn lần."]', 3, 'Slide 19: sau xếp hạng → Reward Model → "huấn luyện theo điểm… lặp lại hàng nghìn lần → model dần ''biết nghe lời''".', 1500, 19, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c09', '"Bong bóng thời gian" (knowledge cutoff) của LLM nghĩa là gì?', '["Model bị \"đóng băng\" tại ngày ngừng đọc dữ liệu huấn luyện, không biết chuyện xảy ra sau đó trừ khi được cung cấp thêm.", "Model quên toàn bộ kiến thức ngay sau mỗi phiên chat.", "Model không thể học bất kỳ điều gì trong toàn bộ vòng đời của nó.", "Model tự động cập nhật kiến thức theo thời gian thực qua internet."]', 0, 'Slide 20: "Model bị ''đóng băng'' tại ngày ngừng đọc. Chuyện sau đó nó không biết — trừ khi bạn cung cấp thêm".', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c09', 'Hallucination ("nói chắc như đúng rồi") xảy ra vì sao theo bài giảng?', '["Model cố tình lừa dối người dùng.", "Model tối ưu cho câu nghe hợp lý, không phải để tra sự thật, nên có thể tự tin mà sai.", "Model thiếu bộ nhớ RAM khi xử lý câu hỏi.", "Model chỉ hallucinate khi temperature bằng 0."]', 1, 'Slide 20: "Model tối ưu cho câu nghe hợp lý, không phải tra sự thật — nên có thể tự tin mà sai (hallucination)".', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c09', 'Ba giới hạn bẩm sinh của LLM được liệt kê trong bài giảng là gì?', '["Thiếu GPU, thiếu dữ liệu, thiếu điện năng.", "Chi phí cao, tốc độ chậm, không hỗ trợ đa ngôn ngữ.", "Bong bóng thời gian (knowledge cutoff), nói chắc như đúng rồi (hallucination), bàn làm việc có hạn (context có trần).", "Không có attention, không có token, không có tham số."]', 2, 'Slide 20 liệt kê đúng 3 mục: bong bóng thời gian, nói chắc như đúng rồi, bàn làm việc có hạn.', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c09', 'Theo trích dẫn của Łukasz Kaiser trong bài, phần lớn cơ chế hoạt động của LLM hiện nay được hiểu như thế nào?', '["Đã được chứng minh toán học đầy đủ, không còn gì chưa rõ.", "Hoàn toàn ngẫu nhiên, không thể giải thích bằng bất kỳ cách nào.", "Chỉ áp dụng cho model cũ; model mới đã hiểu rõ hết cơ chế.", "Phần lớn là trực giác (intuition), không phải định lý hay chân lý đã được chứng minh đầy đủ."]', 3, 'Slide 20 trích: "a lot here are intuitions, not theorems or truths" — Łukasz Kaiser.', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c09', 'Cách xử lý được đề xuất cho các giới hạn bẩm sinh của LLM là gì?', '["Prompt tốt, context sạch, tra sổ (RAG), dùng tools, và luôn kiểm chứng.", "Tăng temperature lên mức tối đa.", "Giảm số tham số của model xuống mức tối thiểu.", "Ngừng sử dụng LLM hoàn toàn cho mọi tác vụ."]', 0, 'Slide 20: "Vì vậy ta cần prompt tốt, context sạch, tra sổ (RAG), tools, và luôn kiểm chứng".', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c09', 'Câu "Biết nhiều khác làm được" trong bài giảng muốn nói gì?', '["LLM càng biết nhiều thì càng hành động tốt, không cần thêm gì khác.", "Dữ liệu mới và hành động thật cần thêm tools/retrieval/workflow, không chỉ dựa vào kiến thức có sẵn của LLM.", "Hành động của LLM hoàn toàn không liên quan đến kiến thức nó có.", "Chỉ cần tăng context window là đủ để LLM hành động được."]', 1, 'Slide 20: "''Biết nhiều'' khác ''làm được'': dữ liệu mới và hành động thật cần tools/retrieval/workflow".', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c09', 'Giới hạn "bàn làm việc có hạn" (context có trần) dẫn tới hệ quả gì?', '["Giúp model trả lời nhanh hơn không giới hạn.", "Không có hệ quả đáng kể nào trong thực tế.", "Context quá dài vừa tốn tiền vừa dễ bỏ sót thông tin ở giữa.", "Khiến model ngừng hoạt động hoàn toàn ngay khi vượt ngưỡng."]', 2, 'Slide 20: "Context có trần; quá dài vừa tốn tiền vừa dễ bỏ sót thông tin ở giữa".', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c09', 'Theo bài giảng, các giới hạn bẩm sinh của LLM (cutoff, hallucination, context) có phải lỗi tạm thời có thể vá hết được không?', '["Có, sẽ được vá hoàn toàn ở bản cập nhật kỹ thuật tiếp theo.", "Có, chỉ cần tăng số tham số của model là hết hoàn toàn.", "Không liên quan gì đến bản chất model, chỉ do thiếu dữ liệu huấn luyện.", "Không — đây là bản chất của cỗ máy đoán token, không phải lỗi tạm thời."]', 3, 'Slide 20: "Đây không phải lỗi tạm thời — đó là bản chất của cỗ máy đoán token".', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c10', 'Trong ví dụ phân loại spam, model thực chất đã "học vẹt" điều gì thay vì hiểu nội dung thật?', '["Đếm số hyperlink trong email — email sạch nhưng nhiều link vẫn bị gán spam.", "Học từ vựng đặc trưng thường gặp trong email lừa đảo.", "Học ngôn ngữ và văn phong của người gửi.", "Học thời gian trong ngày mà email được gửi đi."]', 0, 'Slide 21: model thực chất học "đếm số hyperlink… email sạch nhưng nhiều link → vẫn bị gán spam".', 1500, 21, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c10', 'Ở bài toán câu chủ quan vs khách quan, model đã "ăn gian" bằng cách nào?', '["Dựa vào độ dài của câu văn.", "Dựa vào nguồn gốc câu (có phải trích từ review phim hay không), không phải dựa vào nội dung câu thật sự.", "Dựa vào ngôn ngữ mà câu được viết ra.", "Dựa vào số lượng tính từ xuất hiện trong câu."]', 1, 'Slide 21: "có phải câu trích từ film review không — ăn gian bằng nguồn gốc câu, không phải nội dung câu".', 1500, 21, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c10', 'Trong bài toán suy luận ngôn ngữ (MNLI), model thực chất học được "đường tắt" nào?', '["Độ dài trung bình của câu trong tập dữ liệu.", "Số lượng danh từ riêng xuất hiện trong câu.", "Câu có động từ phủ định hay không — đổi cấu trúc dữ liệu test là điểm tụt ngay.", "Ngôn ngữ gốc mà văn bản được dịch từ đó."]', 2, 'Slide 21: "''câu có động từ phủ định không'' — đổi cấu trúc dữ liệu test là điểm tụt ngay".', 1500, 21, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c10', '"Spurious cues" (đường tắt/dấu hiệu giả) trong bài giảng được phát hiện bằng cách nào?', '["Do con người thủ công rà soát từng dòng dữ liệu.", "Do một thuật toán thống kê cổ điển không liên quan gì đến LLM.", "Không thể phát hiện được bằng bất kỳ phương pháp nào.", "Do chính LLM tự động phát hiện và mô tả bằng ngôn ngữ tự nhiên, trên quy mô 675 bài toán của benchmark OpenD5."]', 3, 'Slide 21: "do chính LLM tự động phát hiện và mô tả… trên quy mô 675 bài toán thật của benchmark OpenD5".', 1500, 21, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c10', 'Bài học chính rút ra từ hiện tượng "học vẹt đường tắt" là gì?', '["Benchmark cao không đồng nghĩa model hiểu đúng thứ bạn tưởng — luôn cần test trên dữ liệu của chính mình.", "Benchmark cao đồng nghĩa model đã hiểu hoàn toàn đúng bản chất bài toán.", "Model không bao giờ mắc lỗi này nếu đã trải qua RLHF.", "Chỉ các model nhỏ mới gặp hiện tượng này, model lớn thì không."]', 0, 'Slide 21: "Benchmark cao ≠ model hiểu đúng thứ bạn tưởng — luôn test trên dữ liệu của chính mình".', 1500, 21, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c10', 'Vì sao hiện tượng này được gọi là "học vẹt đường tắt" (shortcut learning)?', '["Vì model học thuộc lòng nguyên văn toàn bộ dữ liệu huấn luyện.", "Model tìm ra một tín hiệu tương quan giả (không phải bản chất bài toán) để đạt điểm cao, nhưng sai khi cấu trúc dữ liệu thay đổi.", "Vì model cố ý gian lận khi biết mình đang bị đánh giá.", "Vì model chạy chậm hơn bình thường khi gặp benchmark."]', 1, 'Cả 3 ví dụ ở slide 21 đều là model tìm tín hiệu tương quan giả thay vì hiểu bản chất bài toán.', 1500, 21, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c10', 'Ba ví dụ "đường tắt" trong bài giảng đến từ nghiên cứu nào?', '["Kaplan et al. (2020) về scaling law.", "Wei et al. (2022) về Chain-of-Thought.", "Zhong, Snell, Klein & Steinhardt (2022), trên benchmark OpenD5.", "Ouyang et al. (2022) về InstructGPT."]', 2, 'Slide 21 trích dẫn Zhong, Snell, Klein & Steinhardt (2022, ICML) và Zhong et al. (2023, OpenD5).', 1500, 21, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c10', 'Hệ quả thực tế của hiện tượng học vẹt đường tắt là gì?', '["Model sẽ luôn báo lỗi rõ ràng khi gặp trường hợp này.", "Model tự động chuyển sang chế độ suy luận chậm hơn nhưng chính xác hơn.", "Hiện tượng này chỉ xảy ra với dữ liệu hình ảnh, không xảy ra với văn bản.", "Model có thể đạt điểm benchmark cao nhưng vẫn sai nghiêm trọng khi gặp dữ liệu có cấu trúc khác một chút."]', 3, 'Cả 3 ví dụ ở slide 21 minh họa: điểm benchmark tốt nhưng sai ngay khi đổi cấu trúc dữ liệu test.', 1500, 21, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c11', 'Chain-of-Thought (CoT) cải thiện điều gì ở LLM?', '["Cho model được viết \"nháp\" từng bước trước khi trả lời, giúp bản chất suy luận lộ ra và tăng độ chính xác.", "Giảm số token cần dùng cho mỗi câu trả lời.", "Loại bỏ hoàn toàn hiện tượng hallucination.", "Tăng kích thước context window tối đa của model."]', 0, 'Slide 22: "cho nó được viết nháp từng bước, bản chất suy luận lộ ra".', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c11', 'Trong ví dụ bóng tennis (5 quả + mua thêm 2 hộp mỗi hộp 3 quả), vì sao model "không nháp" trả lời sai (27 quả)?', '["Vì đề bài không đủ dữ liệu để tính toán.", "Model đọc câu hỏi rồi bật đáp án ngay, không có bước tính toán trung gian rõ ràng.", "Vì model chưa từng được huấn luyện về phép cộng.", "Vì câu hỏi có lỗi chính tả nghiêm trọng."]', 1, 'Slide 22: "Không có nháp — trả lời ngay: Model đọc câu hỏi → bật ra đáp án ngay… ✗ SAI".', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c11', 'Khi được yêu cầu "hãy nghĩ từng bước", model trong ví dụ tính đúng kết quả là bao nhiêu?', '["27 quả.", "6 quả.", "11 quả (5 + 3×2 = 11).", "8 quả."]', 2, 'Slide 22: "Bắt đầu có 5 quả. Mỗi hộp 3 quả × 2 hộp = 6 quả. 5 + 6 = 11. Đáp án là 11 quả. ✓ ĐÚNG".', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c11', 'Chain-of-Thought là mầm mống của những kỹ thuật/mô hình nào sau này theo bài giảng?', '["Kỹ thuật tokenization.", "Kiến trúc MoE.", "RLHF.", "Các reasoning model (o1, R1...) và test-time compute."]', 3, 'Slide 22: "Đây là mầm của các reasoning model (o1, R1...) và của test-time compute ở các slide sau".', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c11', 'Nghiên cứu nào giới thiệu kỹ thuật Chain-of-Thought Prompting theo bài giảng?', '["Wei et al. (2022), \"Chain-of-Thought Prompting Elicits Reasoning in Large Language Models\".", "Ouyang et al. (2022), InstructGPT.", "Kaplan et al. (2020), Scaling laws.", "Deng et al. (2009), ImageNet."]', 0, 'Slide 22 trích rõ nguồn: Wei et al. (2022) — arxiv.org/abs/2201.11903.', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c11', 'Vì sao ví dụ tính nhẩm bóng tennis lại minh họa tốt cho Chain-of-Thought?', '["Vì bài toán quá khó nên cần một model lớn hơn hẳn.", "Vì cùng một model, cùng một câu hỏi, chỉ khác việc có được viết nháp từng bước hay không mà kết quả từ sai thành đúng.", "Vì bài toán yêu cầu kiến thức nằm ngoài phạm vi huấn luyện.", "Vì bài toán liên quan đến xử lý hình ảnh."]', 1, 'Slide 22: "Cùng một model, cùng một câu hỏi — cho nó được viết nháp từng bước, bản chất suy luận lộ ra".', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c11', 'Chain-of-Thought liên hệ thế nào với cơ chế "predict → append → rerun" đã học ở phần trước?', '["CoT thay thế hoàn toàn cơ chế predict-append-rerun bằng một thuật toán khác.", "CoT không liên quan gì đến cách LLM sinh token.", "Mỗi bước nháp được viết ra sẽ trở thành một phần context, giúp bước dự đoán tiếp theo có thêm thông tin đúng hướng.", "CoT chỉ hoạt động khi cơ chế attention bị tắt."]', 2, 'Vì mỗi token nháp được nối vào ngữ cảnh (slide 12) trước khi model đoán tiếp, nháp đúng hướng sẽ dẫn đến đáp án đúng hơn.', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c11', 'Phát biểu nào sau đây KHÔNG đúng về Chain-of-Thought?', '["CoT giúp lộ ra bản chất suy luận của model.", "CoT là mầm của reasoning model và test-time compute.", "Có nháp, model đổi từ đáp án sai (27) sang đúng (11) trong ví dụ bóng tennis.", "CoT luôn làm giảm chi phí token vì câu trả lời ngắn gọn hơn."]', 3, 'CoT thường làm TĂNG số token (vì có thêm bước nháp), không phải giảm — đây là phát biểu sai cần chọn.', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c12', '4 cấp độ từ LLM đến Agent theo bài giảng lần lượt là gì?', '["Level 0 (Bộ não suy luận, không tool) → Level 1 (Có kết nối, +tools) → Level 2 (Biết lập kế hoạch) → Level 3 (Đội agent phối hợp).", "Level 0 (Đội agent phối hợp) → Level 3 (Bộ não suy luận).", "Chỉ có 2 cấp độ: LLM trần và Agent hoàn chỉnh.", "Level 1 (Đội agent phối hợp) → Level 3 (Bộ não suy luận)."]', 0, 'Slide 23 liệt kê đúng thứ tự Level 0 → 1 → 2 → 3 với mức tự chủ tăng dần.', 1500, 23, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c12', 'Ở Level 1 ("Có kết nối"), agent có thêm năng lực gì?', '["Tự chia mục tiêu thành nhiều bước.", "+ tools: search web, đọc database, gọi API — vượt khỏi bong bóng thời gian.", "Phối hợp với nhiều agent chuyên biệt khác.", "Không có gì khác biệt so với Level 0."]', 1, 'Slide 23: Level 1 "Có kết nối — + tools: search web, đọc database, gọi API — vượt khỏi bong bóng thời gian".', 1500, 23, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c12', '5 bộ phận cấu thành một agent theo "giải phẫu agent" là gì?', '["Token, Context, Attention, Parameter, Prompt.", "Pretraining, SFT, RLHF, Reasoning training, Deployment.", "Goal, Reasoning, Tools, Memory, Action — chạy thành một vòng lặp.", "Input, Output, Model, API, Database."]', 2, 'Slide 24: "Agent = Goal + Reasoning + Tools + Memory + Action — chạy thành vòng lặp".', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c12', '"Memory" trong giải phẫu agent đóng vai trò gì?', '["Là nơi lưu tham số cố định của model (weights).", "Là bộ đếm số token đã sử dụng trong phiên làm việc.", "Là công cụ gọi API bên ngoài duy nhất của agent.", "Sổ tay ghi nhớ các bước, đọc/ghi trong vòng lặp để quan sát kết quả và lặp lại."]', 3, 'Slide 24: "Memory — sổ tay ghi nhớ các bước… ghi / đọc".', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c12', 'Câu "Agent không phải một loại model khác" trong bài giảng nghĩa là gì?', '["Agent = LLM được đặt vào vòng làm việc có mục tiêu và hành động, không phải một kiến trúc model hoàn toàn khác biệt.", "Agent luôn cần một model được huấn luyện riêng biệt hoàn toàn khác LLM thường.", "Agent không sử dụng LLM ở bất kỳ bước nào.", "Agent chỉ là tên gọi khác của chatbot thông thường."]', 0, 'Slide 23: "Agent không phải ''một loại model khác'' — đó là LLM được đặt vào vòng làm việc có mục tiêu và hành động".', 1500, 23, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c12', 'Ở Level 3 ("Đội agent phối hợp"), điểm khác biệt chính so với Level 2 là gì?', '["Không dùng tools nữa để tiết kiệm chi phí.", "Nhiều agent chuyên biệt chia việc như một đội ngũ (multi-agent), thay vì một agent tự làm hết.", "Quay lại dùng LLM trần, không lập kế hoạch.", "Loại bỏ hoàn toàn bước Reasoning khỏi vòng lặp."]', 1, 'Slide 23: Level 3 "+ nhiều agent chuyên biệt chia việc như một đội ngũ (multi-agent)".', 1500, 23, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c12', 'Mức tự chủ và tác động thật của agent thay đổi ra sao qua các cấp độ 0 → 3?', '["Giảm dần từ Level 0 đến Level 3.", "Không đổi ở mọi cấp độ.", "Tăng dần từ Level 0 đến Level 3.", "Tăng rồi giảm theo hình chữ U."]', 2, 'Slide 23: "mức tự chủ & tác động thật tăng dần →".', 1500, 23, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c12', 'Vòng lặp agent trong "giải phẫu" hoạt động theo trình tự nào?', '["Action → Goal → Memory → Reasoning → Tools.", "Chỉ có Reasoning và Action, không tồn tại vòng lặp.", "Tools → Goal → Action, rồi dừng lại sau đúng 1 lần chạy.", "Goal → Reasoning → Tools → Action → quan sát kết quả → lặp lại (Memory ghi/đọc xuyên suốt)."]', 3, 'Slide 24 mô tả vòng lặp: Goal → Reasoning → Tools → Action → "quan sát kết quả → lặp lại".', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c13', 'Theo bài giảng, giá của một mức năng lực AI nhất định thay đổi ra sao theo năm?', '["Rơi khoảng 10 lần mỗi năm — việc năm ngoái cần model đắt nhất, năm nay model rẻ đã làm được.", "Tăng đều khoảng 10 lần mỗi năm.", "Không đổi qua các năm.", "Giảm rồi tăng lại theo chu kỳ 2 năm một lần."]', 0, 'Slide 25: "Cùng một mức năng lực, giá rơi khoảng 10 lần mỗi năm".', 1500, 25, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c13', 'Nguyên tắc chọn model theo bài giảng là gì?', '["Luôn chọn model đắt nhất để đảm bảo chất lượng.", "Chọn theo TẦNG (việc cần làm gì), không chọn theo tên thương hiệu.", "Luôn chọn model rẻ nhất để tiết kiệm chi phí.", "Chọn theo model được nhắc đến nhiều nhất trên mạng xã hội."]', 1, 'Slide 26: "Chọn model theo TẦNG, không chọn theo tên".', 1500, 26, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c13', 'Hai lỗi đối xứng khi chọn model theo tầng là gì?', '["Chọn model tiếng Anh thay vì tiếng Việt.", "Chọn model có context window quá dài.", "Việc đơn giản mà gọi model frontier (phí tiền), và việc khó mà cố dùng model rẻ (kết quả tệ).", "Chọn model không hỗ trợ streaming."]', 2, 'Slide 26: "Hai lỗi đối xứng: ✗ việc đơn giản mà gọi frontier → phí tiền; ✗ việc khó mà cố dùng rẻ → kết quả tệ".', 1500, 26, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c13', 'Trong hóa đơn ví dụ ở bài giảng, output token có giá gấp bao nhiêu lần input token?', '["Bằng nhau, không có chênh lệch.", "Input đắt hơn output.", "Gấp khoảng 10 lần.", "Khoảng 3–5 lần."]', 3, 'Slide 27: "VÉ RA — OUTPUT ×3–5… đắt — model phải ''vắt óc''".', 1500, 27, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c13', 'Vì sao output token ("vé ra") đắt hơn input token ("vé vào")?', '["Model phải tự sinh từng mảnh một, vừa chậm vừa tốn (\"phải vắt óc\"), trong khi input model chỉ cần đọc.", "Vì output luôn dài hơn input về số ký tự hiển thị.", "Vì output cần dùng loại GPU khác với input.", "Vì output phải được dịch sang ngôn ngữ khác trước khi trả về."]', 0, 'Slide 27: "VÉ VÀO — rẻ, model chỉ cần đọc; VÉ RA — đắt, model phải ''vắt óc''".', 1500, 27, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c13', '"Núm vặn lớn nhất" để kiểm soát chi phí một lần gọi API là gì theo bài giảng?', '["Kiểm soát input — số token gửi đi.", "Kiểm soát output — số token model sinh ra.", "Kiểm soát temperature.", "Kiểm soát kích thước tối đa của context window."]', 1, 'Slide 27: "Input tokens + Output tokens = Chi phí mỗi lần gọi — kiểm soát output là núm vặn lớn nhất".', 1500, 27, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c13', 'Tầng 3 ("Self-host / siêu rẻ") trong bảng phân tầng model được dùng khi nào?', '["Khi cần độ chính xác cao nhất cho việc khó nhất.", "Khi mới bắt đầu thử nghiệm một use case nhỏ, khối lượng thấp.", "Khi cần kiểm soát dữ liệu hoặc chi phí ở quy mô lớn (VD Kimi K3 open-weight, DeepSeek, Qwen).", "Khi cần tốc độ phản hồi nhanh nhất thị trường bằng mọi giá."]', 2, 'Slide 26: "TẦNG 3 — SELF-HOST/SIÊU RẺ… khi cần kiểm soát dữ liệu hoặc chi phí quy mô lớn".', 1500, 26, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c13', 'Theo bài giảng, nên bắt đầu thử model ở tầng nào trước?', '["Tầng 1 (frontier đóng) luôn phải thử trước tiên.", "Tầng 3 (self-host) để tiết kiệm ngay từ đầu.", "Không có thứ tự khuyến nghị, chọn ngẫu nhiên tùy thích.", "Tầng 2 (\"rẻ mà mạnh\") — giải quyết đa số việc hằng ngày, mặc định thử trước."]', 3, 'Slide 26: "★ MẶC ĐỊNH THỬ TẦNG NÀY TRƯỚC" được gắn ngay dưới Tầng 2.', 1500, 26, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c14', '4 lớp của một prompt hoàn chỉnh theo bài giảng là gì?', '["System instruction, User input, Context bổ sung, Output mong muốn.", "Token, Context, Attention, Parameter.", "Input, Model, Output, Feedback.", "Goal, Reasoning, Tools, Action."]', 0, 'Slide 28: "1 PROMPT = 4 PHẦN" — System instruction, User input, Context bổ sung, Output mong muốn.', 1500, 28, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c14', '"System instruction" (Lớp 1) trong prompt có vai trò gì?', '["Là câu hỏi cụ thể của người dùng trong lượt hiện tại.", "\"Lời dặn đầu ca\" — model là ai, cư xử thế nào, không được làm gì.", "Là tài liệu hoặc lịch sử chat đính kèm bổ sung.", "Là định dạng kết quả mong muốn (bullet, JSON...)."]', 1, 'Slide 28: "LỚP 1 — System instruction: ''Lời dặn đầu ca'' — model là ai, cư xử thế nào, không được làm gì".', 1500, 28, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c14', 'temperature = 0 phù hợp với loại việc nào theo bài giảng?', '["Việc cần sự sáng tạo và đa dạng ở mức tối đa.", "Việc cần model \"phiêu\", cố ý dễ lạc đề.", "Việc cần ổn định, lặp lại, hợp với code và phân tích — luôn chọn từ chắc nhất.", "Việc cần model trả lời hoàn toàn ngẫu nhiên."]', 2, 'Slide 29: "T = 0 … luôn chọn từ chắc nhất → ổn định, lặp lại, hợp code & phân tích".', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c14', 'top_p (VD p = 0.9) hoạt động theo cơ chế nào?', '["Chọn ngẫu nhiên p% số từ trong từ vựng, không phân biệt xác suất.", "Tăng số lượng token tối đa được phép sinh ra.", "Giảm kích thước context window xuống còn p%.", "Chỉ giữ nhóm từ có xác suất cộng dồn ≥ ngưỡng p, cắt bỏ phần đuôi xác suất thấp rồi chuẩn hóa lại."]', 3, 'Slide 29: top_p — "giữ nhóm cộng dồn ≥ 90% → cắt & chuẩn hóa lại".', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c14', 'Theo bài giảng, nên vặn cả temperature và top_p cùng lúc không?', '["Thường chỉ vặn một trong hai, không phải cả hai cùng lúc.", "Luôn cần vặn cả hai đồng thời để đạt hiệu quả tối đa.", "Hai tham số này hoàn toàn độc lập, không liên quan gì đến nhau.", "Chỉ nên vặn top_p, không bao giờ dùng đến temperature."]', 0, 'Slide 29: "Thường chỉ vặn một trong hai: temperature hoặc top_p".', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c14', 'temperature và top_p có làm model "thông minh" hơn không theo bài giảng?', '["Có, tăng temperature giúp model biết thêm kiến thức mới.", "Không — chúng chỉ đổi cách chọn từ, không thêm tri thức cho model.", "Có, top_p giúp model truy cập internet để tra cứu thông tin.", "Có, cả hai đều giúp mở rộng context window của model."]', 1, 'Slide 29: "hai núm này không làm model thông minh hơn — chỉ đổi cách chọn từ, không thêm tri thức".', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c14', '"Context bổ sung" (Lớp 3 trong prompt) bao gồm những gì?', '["Định dạng đầu ra mong muốn (bullet, JSON...).", "Lời dặn về vai trò và giới hạn của model.", "Tài liệu, lịch sử chat, dữ liệu tra sổ (RAG) — phần bày lên \"bàn làm việc\".", "Giá trị temperature và top_p được cấu hình."]', 2, 'Slide 28: "LỚP 3 — Context bổ sung: Tài liệu, lịch sử chat, dữ liệu tra sổ — phần bày lên ''bàn làm việc''".', 1500, 28, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d1-c14', 'Ở temperature cao (VD T = 2) theo ví dụ "Một tách ___" trong bài, điều gì xảy ra với phân bố xác suất chọn từ?', '["Phân bố tập trung tuyệt đối vào một từ chắc chắn nhất.", "Phân bố không thay đổi gì so với khi T = 0.", "Model sẽ ngừng chọn từ và trả về lỗi.", "Phân bố phẳng ra, đa dạng hơn nhưng dễ \"phiêu\"/lạc đề."]', 3, 'Slide 29: "T = 2 … phân bố phẳng ra → đa dạng, ''phiêu'', dễ lạc đề".', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c01', 'Mô hình Double Diamond gồm mấy giai đoạn, tên là gì?', '["4 giai đoạn: Discover, Define, Develop, Deliver (2 kim cương: tìm đúng vấn đề, tìm đúng giải pháp).", "3 giai đoạn: Discover, Design, Deliver.", "2 giai đoạn: Problem, Solution.", "5 giai đoạn, bao gồm cả Evaluate ở cuối."]', 0, 'Slide 3: Diamond 1 (Discover/Define) — tìm đúng vấn đề; Diamond 2 (Develop/Deliver) — tìm đúng giải pháp.', 1500, 3, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c01', '"Diamond 1" trong Double Diamond tập trung vào điều gì?', '["Tìm đúng giải pháp và triển khai.", "Tìm đúng vấn đề (Discover: mở rộng khảo sát; Define: thu hẹp, xác định đúng bài toán gốc).", "Chọn công nghệ AI phù hợp nhất.", "Viết Problem Statement hoàn chỉnh."]', 1, 'Slide 3: "DIAMOND 1 — TÌM ĐÚNG VẤN ĐỀ: Discover… Define…".', 1500, 3, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c01', 'Theo trích dẫn trong bài, sự khác biệt giữa kỹ sư/doanh nhân và nhà thiết kế là gì?', '["Kỹ sư luôn giỏi thiết kế hơn nhà thiết kế chuyên nghiệp.", "Nhà thiết kế không cần hiểu vấn đề, chỉ cần tạo ra giải pháp đẹp.", "Kỹ sư/doanh nhân được đào tạo để giải vấn đề; nhà thiết kế được đào tạo để khám phá vấn đề thật.", "Cả hai đều được đào tạo giống hệt nhau về tư duy giải quyết vấn đề."]', 2, 'Slide 3: "Kỹ sư và doanh nhân được đào tạo để giải vấn đề. Nhà thiết kế được đào tạo để khám phá vấn đề thật."', 1500, 3, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c01', 'Công cụ nào thuộc giai đoạn "Discover" (phân kỳ, khám phá) theo bài giảng?', '["Affinity Mapping, 5 Whys, Dot Voting.", "Problem Statement, Impact-Effort Matrix.", "Reward function, Precision/Recall.", "Phỏng vấn người dùng (User Interview), Quan sát thực tế, Khảo sát, Diary Study."]', 3, 'Slide 4: "DISCOVER · PHÂN KỲ" liệt kê Observation, User Interview, Survey, Diary Study...', 1500, 4, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c01', 'Công cụ nào thuộc giai đoạn "Define" (hội tụ) theo bài giảng?', '["Affinity Mapping, kỹ thuật 5 Whys, Impact-Effort Matrix, Dot Voting, How Might We, Problem Statement.", "User Interview, Observation, Survey, Diary Study.", "Reward function và Precision/Recall.", "Rule, Workflow, Agent."]', 0, 'Slide 4: "DEFINE · HỘI TỤ" liệt kê Affinity Mapping, 5 Whys, Impact-Effort, Dot Voting, HMW, Problem Statement.', 1500, 4, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c01', '"Giải pháp xuất sắc cho sai vấn đề" theo bài giảng có hệ quả gì?', '["Vẫn luôn mang lại giá trị tích cực cho người dùng.", "Có thể còn tệ hơn không có giải pháp.", "Không có hệ quả gì đáng kể.", "Giúp tiết kiệm chi phí phát triển hơn giải pháp đúng vấn đề."]', 1, 'Slide 3: "Giải pháp xuất sắc cho sai vấn đề có thể còn tệ hơn không có giải pháp."', 1500, 3, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c01', 'Double Diamond do ai/tổ chức nào đề xuất theo bài giảng?', '["Google PAIR.", "Anthropic.", "Don Norman / British Design Council (2005).", "OpenAI."]', 2, 'Slide 3: "Mô hình Double Diamond — Don Norman / British Design Council (2005)".', 1500, 3, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c01', 'Trình tự đúng của 4 giai đoạn Double Diamond là gì?', '["Define → Discover → Deliver → Develop.", "Develop → Deliver → Discover → Define.", "Deliver → Develop → Define → Discover.", "Discover → Define → Develop → Deliver."]', 3, 'Slide 3: Diamond 1 = Discover → Define; Diamond 2 = Develop → Deliver.', 1500, 3, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c02', 'Bài học từ Cursor theo bài giảng là gì?', '["\"Lệch năng lực cốt lõi\" — từ bỏ mảng AI thiết kế cơ khí (CAD) để tập trung vào AI code editor, nơi đội ngũ am hiểu sâu.", "\"Sản phẩm tốt nhưng thị trường quá hẹp\".", "\"Định vị đúng điểm đau\" bằng trích dẫn nguồn.", "Cursor thất bại vì thiếu vốn đầu tư."]', 0, 'Slide 5: "CURSOR — ''Lệch năng lực cốt lõi'': Từ bỏ mảng AI thiết kế cơ khí (CAD)…".', 1500, 5, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c02', 'Bài học từ Artifact theo bài giảng là gì?', '["\"Lệch năng lực cốt lõi\" giống Cursor.", "\"Sản phẩm tốt ≠ Thị trường lớn\" — ứng dụng đọc tin tích hợp AI xuất sắc nhưng thị trường quá hẹp, phải đóng cửa.", "Thành công nhờ định vị đúng điểm đau.", "Thất bại vì không sử dụng LLM."]', 1, 'Slide 5: "ARTIFACT — ''Sản phẩm tốt ≠ Thị trường lớn''… đóng cửa 1/2024".', 1500, 5, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c02', 'NotebookLM được nêu ra như một ví dụ về điều gì?', '["\"Lệch năng lực cốt lõi\" như Cursor.", "\"Sản phẩm tốt nhưng thị trường hẹp\" như Artifact.", "\"Định vị đúng điểm đau\" — tập trung giải quyết nhu cầu hỏi đáp, tóm tắt tài liệu cá nhân và đối chiếu nguồn bằng trích dẫn.", "Một sản phẩm đã đóng cửa vì thất bại thương mại."]', 2, 'Slide 5: "NOTEBOOKLM — ''Định vị đúng điểm đau''".', 1500, 5, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c02', 'Lộ trình chung được rút ra từ 3 case study Cursor/Artifact/NotebookLM là gì?', '["Giải pháp AI → Bài toán → Chỉ số đo lường → Quy trình.", "AI → Model → Deploy → User.", "Ý tưởng → Gọi vốn → Xây sản phẩm → Ra mắt.", "Bài toán → Quy trình vận hành → Chỉ số đo lường → Giải pháp AI."]', 3, 'Slide 5: "Lộ trình: Bài toán → Quy trình vận hành → Chỉ số đo lường → Giải pháp AI".', 1500, 5, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c02', 'Thông điệp chung ("Khởi nguồn từ...") của cả 3 case study là gì?', '["Khởi nguồn từ bài toán, không bắt đầu từ AI.", "Khởi nguồn từ công nghệ mới nhất trên thị trường.", "Khởi nguồn từ đối thủ cạnh tranh.", "Khởi nguồn từ nguồn vốn đầu tư có sẵn."]', 0, 'Slide 5: "Khởi nguồn từ bài toán, không bắt đầu từ AI".', 1500, 5, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c02', 'Artifact đóng cửa vào thời gian nào theo bài giảng?', '["1/2022.", "1/2024.", "1/2026.", "Chưa đóng cửa, vẫn đang hoạt động."]', 1, 'Slide 5: "(đóng cửa 1/2024)".', 1500, 5, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c02', 'Case study nào minh họa rủi ro "quy mô thị trường quá hẹp"?', '["Cursor.", "NotebookLM.", "Artifact.", "Cả ba case study đều gặp vấn đề này như nhau."]', 2, 'Slide 5 gắn trực tiếp Artifact với "Sản phẩm tốt ≠ Thị trường lớn".', 1500, 5, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c02', 'Vì sao Cursor được xem là bài học về "lệch năng lực cốt lõi" chứ không phải thất bại sản phẩm?', '["Vì họ thiếu tiền để duy trì mảng CAD.", "Vì thị trường CAD đã bão hòa hoàn toàn.", "Vì đối thủ cạnh tranh sao chép ý tưởng của họ.", "Vì họ chủ động từ bỏ một mảng (CAD) mà đội ngũ không am hiểu sâu, để tập trung vào mảng họ mạnh (code editor)."]', 3, 'Slide 5: "nơi đội ngũ am hiểu sâu sắc quy trình nghiệp vụ" — nhấn mạnh việc chọn đúng mảng thế mạnh.', 1500, 5, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c03', '4 lăng kính (lens) để tìm bài toán AI theo bài giảng là gì?', '["Repetitive (tác vụ lặp lại), Time-consuming (tiêu tốn thời gian), AI Advantage (lợi thế của AI), User Pain Points (điểm đau người dùng).", "Automate, Augment, Rule, Agent.", "Discover, Define, Develop, Deliver.", "Precision, Recall, F1, Accuracy."]', 0, 'Slide 6: bốn lăng kính REPETITIVE, TIME-CONSUMING, AI ADVANTAGE, USER PAIN POINTS.', 1500, 6, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c03', 'Anti-pattern "Solution-first" là gì?', '["Không lượng hóa tổn thất hiện tại.", "Xây chatbot/agent trước khi làm rõ quy trình vận hành và điểm nghẽn thực tế.", "Không thiết lập kịch bản kiểm thử.", "Không rõ ranh giới tự chủ của AI."]', 1, 'Slide 7: "Ưu tiên giải pháp (Solution-first)… trước khi làm rõ quy trình vận hành và điểm nghẽn thực tế".', 1500, 7, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c03', 'Anti-pattern "No baseline" gây ra hậu quả gì?', '["Xây giải pháp trước khi hiểu vấn đề.", "Không có kịch bản kiểm thử.", "Mất căn cứ đánh giá hiệu quả cải tiến vì không lượng hóa tổn thất hiện tại.", "Không rõ khi nào cần con người phê duyệt."]', 2, 'Slide 7: "Mơ hồ hiện trạng (No baseline)… dẫn đến mất căn cứ đánh giá hiệu quả cải tiến".', 1500, 7, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c03', 'Anti-pattern "No boundary" liên quan đến vấn đề gì?', '["Không đo lường được chỉ số thành công.", "Xây giải pháp trước khi hiểu vấn đề.", "Thiếu dữ liệu huấn luyện chất lượng cao.", "Không rõ phạm vi tự chủ của AI và thời điểm cần con người phê duyệt (Human-in-the-loop)."]', 3, 'Slide 7: "Mập mờ ranh giới (No boundary)… thời điểm cần con người phê duyệt".', 1500, 7, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c03', 'Lăng kính "AI Advantage" tập trung vào loại tác vụ nào?', '["Tác vụ đòi hỏi phân tích ngữ cảnh, xử lý ngôn ngữ tự nhiên, tổng hợp đa nguồn.", "Tác vụ đơn giản, lặp đi lặp lại giống hệt nhau.", "Tác vụ chỉ cần tính toán số học cơ bản.", "Tác vụ không cần bất kỳ dữ liệu đầu vào nào."]', 0, 'Slide 6: "AI ADVANTAGE — Tác vụ đòi hỏi phân tích ngữ cảnh, xử lý ngôn ngữ tự nhiên, tổng hợp đa nguồn".', 1500, 6, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c03', 'Khi phát hiện đang mắc các anti-pattern, bài giảng khuyên nên làm gì?', '["Tiếp tục triển khai và sửa lỗi sau khi ra mắt.", "Quay lại làm rõ Problem Statement trước khi chọn công nghệ.", "Chuyển ngay sang dùng Agent thay vì Rule.", "Tăng ngân sách cho dự án."]', 1, 'Slide 7: "Nếu phát hiện mắc các sai lầm trên, hãy quay lại làm rõ Problem Statement trước khi chọn công nghệ".', 1500, 7, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c03', '"No evaluation" (bỏ qua đánh giá) là anti-pattern như thế nào?', '["Xây giải pháp trước khi hiểu vấn đề.", "Không lượng hóa tổn thất hiện tại.", "Không thiết lập kịch bản kiểm thử, chỉ số đo lường hoặc phương án đối chứng.", "Không rõ ranh giới tự chủ của AI."]', 2, 'Slide 7: "Bỏ qua đánh giá (No evaluation)… Không thiết lập kịch bản kiểm thử, chỉ số đo lường hoặc phương án đối chứng".', 1500, 7, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c03', 'Việc tìm bài toán AI (4 lăng kính) nên xảy ra ở giai đoạn nào so với việc chọn giải pháp?', '["Chọn giải pháp trước rồi mới đi tìm bài toán phù hợp.", "Làm đồng thời cả hai, không phân biệt thứ tự.", "Không cần tìm bài toán nếu đã có sẵn giải pháp AI.", "Tập trung nhận diện vấn đề trước; sàng lọc và chọn giải pháp diễn ra sau."]', 3, 'Slide 6: "Tập trung nhận diện vấn đề; chưa vội đề xuất giải pháp. Sàng lọc bài toán sẽ diễn ra vào buổi chiều."', 1500, 6, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c04', 'Theo PAIR, câu hỏi "Can we use AI to ______?" nên được đổi thành câu hỏi nào?', '["\"How might we solve ______?\" và \"Can AI solve this problem in a unique way?\"", "\"Which AI model is the best for us?\"", "\"How much does AI cost per month?\"", "\"Can AI replace all our staff eventually?\""]', 0, 'Slide 8: "''Can we use AI to ______?'' ↓ thay bằng hai câu hỏi ↓ ''How might we solve ______?'' ''Can AI solve this problem in a unique way?''"', 1500, 8, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c04', 'Vì sao cần reframe câu hỏi trước khi nghĩ đến AI?', '["Vì AI luôn là giải pháp tốt nhất nên không cần hỏi gì thêm.", "Vì hỏi về bài toán trước, về AI sau — AI chỉ là một phương án trong nhiều phương án khả dĩ.", "Vì câu hỏi ban đầu \"Can we use AI\" đã đủ rõ ràng.", "Vì việc reframe giúp giảm chi phí token khi gọi API."]', 1, 'Slide 8: "Hỏi về bài toán trước, về AI sau — AI chỉ là một phương án trong nhiều phương án khả dĩ".', 1500, 8, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c04', '6 trường của Quick Problem Card là gì?', '["Model, Context, Planning, Tools.", "Discover, Define, Develop, Deliver.", "Bài toán (problem), Đối tượng ảnh hưởng (actor), Quy trình hiện tại (workflow), Nút thắt & Tác động, Chỉ số đo thành công, Định hướng giải pháp.", "Precision, Recall, TP, FP."]', 2, 'Slide 9 liệt kê đủ 6 trường của Quick Problem Card.', 1500, 9, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c04', 'Trường "Định hướng giải pháp" trong Quick Problem Card có các lựa chọn nào?', '["Cao / Trung bình / Thấp.", "Go / Not Yet / No-Go.", "Automate / Augment.", "No AI / Rule / Workflow / Agent / Chưa xác định."]', 3, 'Slide 9: "Định hướng giải pháp — direction: No AI / Rule / Workflow / Agent / Chưa xác định".', 1500, 9, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c04', 'Trường "Quy trình hiện tại" (workflow) trong Quick Problem Card mô tả gì?', '["Các bước vận hành thủ công hoặc tự động hiện tại, gồm 3–7 bước.", "Chỉ số đo lường thành công của giải pháp.", "Đối tượng chịu tác động trực tiếp từ vấn đề.", "Danh sách công nghệ AI có thể áp dụng."]', 0, 'Slide 9: "Quy trình hiện tại — workflow: Các bước vận hành thủ công hoặc tự động hiện tại (gồm 3–7 bước)".', 1500, 9, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c04', '"Bài toán" (problem) trong Quick Problem Card được định nghĩa thế nào?', '["Mô tả chi tiết giải pháp AI dự kiến triển khai.", "Vấn đề cụ thể cần giải quyết, KHÔNG bao gồm giải pháp.", "Tên gọi chính thức của dự án.", "Ngân sách dự kiến dành cho dự án."]', 1, 'Slide 9: "Bài toán (1 câu) — problem: Vấn đề cụ thể cần giải quyết (không bao gồm giải pháp)".', 1500, 9, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c04', 'Câu hỏi đúng theo PAIR quyết định điều gì?', '["Quyết định chi phí token của mô hình.", "Quyết định model cụ thể nào sẽ được dùng.", "Quyết định bài toán bạn giải và giải pháp bạn chọn.", "Không ảnh hưởng gì đến kết quả cuối cùng."]', 2, 'Slide 8: "Câu hỏi đúng quyết định bài toán bạn giải — và giải pháp bạn chọn".', 1500, 8, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c04', 'Trường "Nút thắt & Tác động" trong Quick Problem Card mô tả điều gì?', '["Định hướng công nghệ sẽ được áp dụng.", "Đối tượng ảnh hưởng trực tiếp từ vấn đề.", "Chỉ số đo lường thành công của giải pháp.", "Khâu gây chậm trễ, sai sót hoặc lặp lại; hệ quả hay tổn thất cụ thể."]', 3, 'Slide 9: "Nút thắt & Tác động — bottleneck + impact: Khâu gây chậm trễ, sai sót hoặc lặp lại; hệ quả hay tổn thất cụ thể".', 1500, 9, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c05', '6 câu hỏi khai thác bài toán theo bài giảng bao gồm những gì?', '["Quy trình hiện tại thế nào? Nút thắt ở đâu? Hao phí bao nhiêu? Tiêu chí thành công đo bằng gì? Hậu quả khi sai sót? Có giải pháp phi AI đơn giản hơn?", "Model nào tốt nhất? Chi phí bao nhiêu? Ai sẽ code? Khi nào ra mắt?", "Actor, Workflow, Bottleneck, Impact, Metric, Boundary.", "Discover, Define, Develop, Deliver, Evaluate, Launch."]', 0, 'Slide 10 liệt kê đủ 6 câu hỏi từ 01 đến 06.', 1500, 10, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c05', 'Ba yếu tố của việc "định lượng hóa" bài toán là gì?', '["Actor, Workflow, Boundary.", "Baseline (hiện trạng), Target (mục tiêu), Measurement (đo lường).", "Precision, Recall, F1.", "Automate, Augment, Rule."]', 1, 'Slide 11: "01 · BASELINE, 02 · TARGET, 03 · MEASUREMENT".', 1500, 11, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c05', '"Baseline" trong định lượng hóa bài toán trả lời câu hỏi nào?', '["Kỳ vọng cải thiện ở mức độ nào (đó là Target).", "Chỉ số nào chứng minh hiệu quả (đó là Measurement).", "Mức hao phí hiện tại là bao nhiêu, bằng con số cụ thể (where we are).", "AI có nên được sử dụng cho bài toán này hay không."]', 2, 'Slide 11: "01 · BASELINE — Hiện trạng / where we are: Mức hao phí hiện tại là bao nhiêu?".', 1500, 11, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c05', 'Ví dụ "rút ngắn từ 90 phút xuống dưới 30 phút" thuộc loại chỉ số nào?', '["Chất lượng công việc.", "Tải trọng vận hành.", "Chi phí đầu tư ban đầu.", "Thời gian hoàn thành."]', 3, 'Slide 11: "THỜI GIAN HOÀN THÀNH — Rút ngắn từ 90 phút xuống dưới 30 phút".', 1500, 11, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c05', 'Vì sao "điểm đau chưa được định lượng thì không thể xác định giá trị thực tế của AI"?', '["Vì không có con số baseline/target để so sánh trước-sau, không chứng minh được cải tiến.", "Vì AI luôn cần dữ liệu định lượng để huấn luyện mô hình.", "Vì định lượng giúp giảm chi phí gọi API.", "Vì đây là yêu cầu pháp lý bắt buộc với mọi dự án AI."]', 0, 'Slide 11: "Điểm đau chưa được định lượng thì không thể xác định giá trị thực tế của AI".', 1500, 11, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c05', 'Câu hỏi "Có giải pháp phi AI đơn giản hơn?" trong bộ 6 câu hỏi gợi ý điều gì?', '["Luôn phải dùng AI dù có giải pháp đơn giản hơn.", "Xem xét quy tắc, checklist, quy trình hay tài liệu hướng dẫn trước khi nhảy vào AI.", "Bỏ qua câu hỏi này nếu đã quyết định dùng AI từ trước.", "Chỉ áp dụng cho các bài toán không quan trọng."]', 1, 'Slide 10: "Có giải pháp phi AI đơn giản hơn? Quy tắc, checklist, quy trình hay tài liệu hướng dẫn?".', 1500, 10, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c05', '"Giảm tỷ lệ lỗi phân loại từ 20% xuống dưới 5%" là ví dụ cho loại chỉ số nào?', '["Thời gian hoàn thành.", "Tải trọng vận hành.", "Chất lượng công việc.", "Chi phí nhân sự."]', 2, 'Slide 11: "CHẤT LƯỢNG CÔNG VIỆC — Giảm tỷ lệ lỗi phân loại từ 20% xuống dưới 5%".', 1500, 11, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c05', 'Câu hỏi "Hậu quả khi xảy ra sai sót?" trong bộ 6 câu hỏi liên quan trực tiếp đến yếu tố nào của Problem Statement sau này?', '["Actor (đối tượng ảnh hưởng).", "Workflow (quy trình hiện tại).", "Success Metric (chỉ số thành công).", "Boundary (ranh giới) và Human-in-the-loop."]', 3, 'Slide 10: "Hậu quả khi xảy ra sai sót? Phạm vi tự quyết của AI; điểm cần con người phê duyệt?" — chính là Boundary/HITL.', 1500, 10, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c06', 'Output metric là gì theo bài giảng?', '["Kết quả cuối cùng (what we optimize) — VD thời lượng hoàn tất quy trình, tỷ lệ sai sót, giá trị người dùng nhận được.", "Các đòn bẩy có thể tác động trực tiếp (đó là input metric).", "Chi phí phát triển ban đầu của dự án.", "Số lượng nhân sự tham gia dự án."]', 0, 'Slide 12: "OUTPUT METRIC — Kết quả cuối cùng / what we optimize".', 1500, 12, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c06', 'Input metric là gì theo bài giảng?', '["Kết quả cuối cùng cần tối ưu.", "Các đòn bẩy có thể tác động (what we can move) — VD tỷ lệ câu hỏi phân loại chính xác, thời gian TA hiệu chỉnh bản nháp.", "Ngân sách tổng của dự án.", "Số lượng người dùng cuối sử dụng hệ thống."]', 1, 'Slide 12: "INPUT METRICS — Các đòn bẩy / what we can move".', 1500, 12, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c06', 'Mối quan hệ giữa input metric và output metric là gì?', '["Hai chỉ số này độc lập hoàn toàn, không liên quan gì đến nhau.", "Input metric luôn quan trọng hơn output metric.", "Tăng input metric (đòn bẩy) để đo được sự thay đổi ở output metric (kết quả cuối).", "Output metric quyết định input metric phải bằng 100%."]', 2, 'Slide 12: "tăng cái này → đo cái kia".', 1500, 12, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c06', 'Vì sao "Nâng cao hiệu suất" không được xem là một chỉ số tốt theo bài giảng?', '["Vì \"hiệu suất\" không thể đo lường được trong bất kỳ hệ thống nào.", "Vì cụm từ này chỉ dùng cho hệ thống non-AI.", "Vì đây là thuật ngữ độc quyền của một công ty cụ thể.", "Vì nó không phải chỉ số — cần gắn với hiện trạng (baseline), mục tiêu (target) và phương pháp đo (measurement) cụ thể."]', 3, 'Slide 12: "''Nâng cao hiệu suất'' không phải chỉ số — cần gắn với hiện trạng, mục tiêu và phương pháp đo".', 1500, 12, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c06', 'Ví dụ "Tỷ lệ yêu cầu được chuyển tiếp hỗ trợ kịp thời" thuộc loại chỉ số nào?', '["Input metric (đòn bẩy có thể tác động).", "Output metric (kết quả cuối cùng).", "Baseline.", "Boundary."]', 0, 'Slide 12: đây là một trong các ví dụ liệt kê dưới mục "INPUT METRICS".', 1500, 12, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c06', 'Nguồn tham khảo nào được trích dẫn cho phần thiết lập chỉ số Output/Input?', '["Anthropic — Building effective agents.", "Amplitude — North Star Playbook, Lenny Rachitsky — Choosing Your North Star Metric.", "Google — Rules of ML.", "Chip Huyen — AI Engineering."]', 1, 'Slide 12: "NGUỒN — Amplitude — North Star Playbook · Lenny Rachitsky — Choosing Your North Star Metric".', 1500, 12, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c06', '"Giá trị thực tế người dùng nhận được rõ nét hơn" là câu hỏi thuộc loại chỉ số nào?', '["Input metric.", "Baseline.", "Output metric.", "Boundary."]', 2, 'Slide 12: câu hỏi này nằm dưới mục "OUTPUT METRIC".', 1500, 12, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c06', 'Vì sao cần tách riêng Output metric và Input metric thay vì gộp chung một chỉ số duy nhất?', '["Vì quy định pháp lý yêu cầu tách riêng hai loại chỉ số.", "Vì input và output metric luôn phải có giá trị bằng nhau.", "Vì output metric không thể đo lường được nếu không tách input riêng.", "Để biết đòn bẩy nào (input) cần tác động nhằm cải thiện kết quả cuối (output)."]', 3, 'Slide 12: "tăng cái này → đo cái kia" — tách để biết đòn bẩy nào cần tác động.', 1500, 12, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c07', 'Bước 1 trong 3 bước quyết định AI theo PAIR là gì?', '["Giao điểm nhu cầu × thế mạnh AI — bài toán có nằm trong nhóm việc AI làm tốt hơn hẳn rule/heuristic không.", "Automate hay Augment.", "Reward function & tiêu chí thành công.", "Go / Not Yet / No-Go."]', 0, 'Slide 13: "BƯỚC ① — Giao điểm: nhu cầu × thế mạnh AI".', 1500, 13, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c07', 'Trường hợp nào sau đây được liệt kê là "AI probably better"?', '["Cần duy trì tính dự đoán được (predictability).", "Cá nhân hóa (personalization) — trải nghiệm tự điều chỉnh theo từng người.", "Thông tin tĩnh, ít thay đổi.", "Lỗi quá tốn kém."]', 1, 'Slide 14: "Cá nhân hóa · personalization — Trải nghiệm tự điều chỉnh theo từng người" nằm trong 8 trường hợp AI probably better.', 1500, 14, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c07', 'Trường hợp nào sau đây được liệt kê là "AI probably NOT better"?', '["Dự đoán tương lai (prediction).", "Hiểu ngôn ngữ tự nhiên (natural language).", "Yêu cầu minh bạch tuyệt đối — mọi quyết định phải giải thích và truy vết được từng bước.", "Cá nhân hóa (personalization)."]', 2, 'Slide 15: "Yêu cầu minh bạch tuyệt đối — Mọi quyết định phải giải thích được từng bước, truy vết được".', 1500, 15, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c07', 'Vì sao "Cần duy trì tính dự đoán được" lại thuộc nhóm AI KHÔNG tốt hơn?', '["Vì AI không thể xử lý các yếu tố cố định trong giao diện.", "Vì AI luôn tốn chi phí cao hơn giải pháp tĩnh trong mọi trường hợp.", "Vì AI không hoạt động được với bất kỳ giao diện người dùng nào.", "Vì nút Home/Cancel phải luôn nằm ở chỗ quen thuộc, người dùng không phải đoán mỗi lần — AI sinh nội dung động có thể phá vỡ sự nhất quán đó."]', 3, 'Slide 15: "Cần duy trì tính dự đoán được — Nút Home / Cancel phải luôn nằm ở một chỗ quen thuộc".', 1500, 15, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c07', '"Nhận diện cả một lớp thực thể" (VD mọi khuôn mặt) là ví dụ cho lợi thế nào của AI?', '["AI probably better — nhận diện cả một lớp thực thể cùng loại.", "AI probably NOT better.", "Automate (bước 2 của PAIR).", "Reward function (bước 3 của PAIR)."]', 0, 'Slide 14: "Nhận diện cả một lớp thực thể — Nhận ra mọi đối tượng cùng loại — VD mọi khuôn mặt".', 1500, 14, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c07', 'Bước 1 của PAIR trả lời câu hỏi trọng tâm nào trong 4 câu hỏi của ngày?', '["\"Cấp độ nào (Automate/Augment)?\"", "\"Có thực sự cần AI?\"", "\"PS đã đủ rõ để đo?\"", "\"Go, Not Yet hay No-Go?\""]', 1, 'Slide 13: "→ trả lời câu hỏi 1: có thực sự cần AI?" gắn với Bước ①.', 1500, 13, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c07', 'Rule/heuristic được ưu tiên hơn AI khi nào theo bài giảng?', '["Khi công ty không đủ ngân sách để mua AI.", "Khi AI vẫn chưa được phát minh ra.", "Khi rule/heuristic dễ build, dễ giải thích, dễ debug và bảo trì hơn mà vẫn giải quyết được bài toán.", "Luôn luôn ưu tiên rule hơn AI trong mọi trường hợp, không có ngoại lệ."]', 2, 'Slide 15: "Rule/heuristic dễ build, dễ giải thích, dễ debug và bảo trì hơn — nếu nó giải quyết được, đó là lựa chọn tối ưu".', 1500, 15, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c07', '"Tối ưu tốc độ & chi phí thấp" (time-to-market nhanh) thuộc nhóm nào?', '["AI probably better.", "Automate (bước 2 của PAIR).", "Reward function (bước 3 của PAIR).", "AI probably NOT better — AI chỉ thêm độ trễ và chi phí trong trường hợp này."]', 3, 'Slide 15: "Tối ưu tốc độ & chi phí thấp — Cần ra thị trường nhanh… AI chỉ thêm độ trễ và chi phí".', 1500, 15, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c08', 'Hệ thống AI theo bài giảng gồm 4 thành phần nào?', '["Model, Context, Planning, Tools.", "Actor, Workflow, Bottleneck, Impact.", "Discover, Define, Develop, Deliver.", "Baseline, Target, Measurement, Metric."]', 0, 'Slide 16: "Hệ thống AI = Model + Context + Planning + Tools".', 1500, 16, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c08', '"Context" trong kiến trúc hệ thống AI (Model+Context+Planning+Tools) đóng vai trò gì?', '["Xử lý đọc hiểu, soạn thảo, tổng hợp (đó là Model).", "Tri thức chuyên biệt — cơ sở dữ liệu, tài liệu nghiệp vụ, hồ sơ lịch sử giúp AI phản hồi chính xác theo bối cảnh.", "Tự động phân rã tác vụ phức tạp (đó là Planning).", "Tích hợp CRM, database, API bên thứ ba (đó là Tools)."]', 1, 'Slide 16: "CONTEXT — Tri thức chuyên biệt: Cơ sở dữ liệu, tài liệu nghiệp vụ, hồ sơ lịch sử…".', 1500, 16, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c08', 'Câu "Giải pháp AI là một HỆ THỐNG — model chỉ là một thành phần" nghĩa là gì?', '["Model là thành phần duy nhất quan trọng, các thành phần khác chỉ là phụ trợ.", "Hệ thống AI không cần context nếu model đủ mạnh.", "Một giải pháp AI thực tế cần nhiều thành phần phối hợp (Model, Context, Planning, Tools), không chỉ dừng ở việc chọn LLM nào.", "Planning và Tools chỉ cần thiết cho Agent, không cần cho giải pháp AI khác."]', 2, 'Slide 16: "Giải pháp AI là một HỆ THỐNG — model chỉ là một thành phần".', 1500, 16, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c08', 'Automate (AI làm thay) nên được chọn khi nào?', '["Người dùng thích tự làm việc đó.", "Stakes cao về tiền bạc/pháp lý/sức khỏe.", "Sở thích khó diễn đạt thành lời.", "Việc khó/nhàm chán/nguy hiểm hoặc cần scale, người dùng thiếu kiến thức, có \"đáp án đúng\" mọi người đồng thuận."]', 3, 'Slide 17: "AUTOMATE — Chọn khi: Việc khó, nhàm chán, nguy hiểm hoặc cần scale…".', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c08', 'Augment (AI hỗ trợ con người) nên được chọn khi nào?', '["Khi stakes cao (tiền bạc, pháp lý, sức khỏe) hoặc kết quả cần trách nhiệm cá nhân/social capital.", "Việc nhàm chán cần scale lớn.", "Có đáp án đúng mà mọi người đồng thuận.", "Người dùng thiếu kiến thức để tự làm việc đó."]', 0, 'Slide 17: "AUGMENT — Chọn khi: … Stakes cao: tiền bạc, pháp lý, sức khỏe…".', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c08', 'Đo thành công của Automate khác Augment như thế nào?', '["Cả hai đo giống hệt nhau bằng độ chính xác (accuracy).", "Automate đo bằng hiệu quả tăng/an toàn hơn/giảm việc tẻ nhạt; Augment đo bằng mức độ thích thú/cảm giác kiểm soát/sáng tạo tăng.", "Automate đo bằng cảm xúc, Augment đo bằng tốc độ.", "Chỉ Automate có thể đo lường được, Augment thì không."]', 1, 'Slide 17: Automate "Đo thành công bằng: hiệu quả tăng · an toàn hơn · giảm việc tẻ nhạt"; Augment "Đo bằng: mức độ thích thú · cảm giác kiểm soát · sáng tạo tăng".', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c08', '"Việc đã automate vẫn gần như luôn cần human oversight" nghĩa là gì?', '["Automate nghĩa là loại bỏ hoàn toàn sự tham gia của con người.", "Oversight chỉ cần thiết cho Augment, không cần cho Automate.", "Ngay cả khi đã tự động hóa, vẫn cần preview, edit, undo — con người vẫn giám sát được.", "Human oversight chỉ áp dụng trong giai đoạn thử nghiệm ban đầu."]', 2, 'Slide 17: "Việc đã automate vẫn gần như luôn cần human oversight — preview, edit, undo".', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c08', 'Bước 2 của PAIR (Automate/Augment) trả lời câu hỏi trọng tâm nào?', '["\"Có thực sự cần AI?\"", "\"PS đã đủ rõ để đo?\"", "\"Go, Not Yet hay No-Go?\"", "\"Giải pháp ở cấp độ nào?\" — AI thay thế hay hỗ trợ con người."]', 3, 'Slide 13: "→ trả lời câu hỏi 2: giải pháp ở cấp độ nào?" gắn với bước Automate/Augment.', 1500, 17, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c09', '3 cấp độ giải pháp kỹ thuật theo bài giảng là gì?', '["Rule/Script, LLM Feature/Workflow, Agent.", "Automate, Augment, Hybrid.", "Discover, Develop, Deliver.", "Baseline, Target, Measurement."]', 0, 'Slide 18: "CẤP ĐỘ 1 — Rule/Script; CẤP ĐỘ 2 — LLM Feature/Workflow; CẤP ĐỘ 3 — Agent".', 1500, 18, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c09', 'Cấp độ "Rule/Script" phù hợp khi nào?', '["Đầu vào đa dạng, không viết hết rule được.", "Đầu vào ổn định ít thay đổi, logic viết được thành if/else, cần kết quả luôn đúng 100%, quy định pháp lý chặt.", "Tình huống thay đổi liên tục, cần nhiều bước.", "Cần tự ra quyết định giữa các bước."]', 1, 'Slide 18: "CẤP ĐỘ 1 — Rule/Script: Đầu vào ổn định, ít thay đổi · Logic viết được thành if/else · Cần kết quả luôn đúng 100%".', 1500, 18, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c09', 'Cấp độ "Agent" phù hợp khi nào?', '["Đầu vào ổn định, logic if/else đơn giản.", "Chỉ cần tóm tắt hoặc phân loại đơn lẻ.", "Nhiều bước, dùng nhiều công cụ, tình huống thay đổi liên tục, cần tự ra quyết định giữa các bước, có kiểm soát rủi ro rõ ràng.", "Cần kết quả luôn đúng 100% tuyệt đối."]', 2, 'Slide 18: "CẤP ĐỘ 3 — Agent: Nhiều bước, dùng nhiều công cụ · Tình huống thay đổi liên tục…".', 1500, 18, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c09', 'Nguyên tắc ưu tiên khi chọn cấp độ giải pháp là gì?', '["Luôn bắt đầu từ Agent vì đây là giải pháp linh hoạt nhất.", "Luôn chọn Workflow làm mặc định cho mọi bài toán.", "Chọn ngẫu nhiên tùy sở thích của đội ngũ phát triển.", "Bắt đầu từ bên trái (Rule), chỉ đi sang bên phải (Workflow, Agent) khi giá trị tăng hơn độ phức tạp."]', 3, 'Slide 18: "Thứ tự ưu tiên thực dụng: bắt đầu từ bên trái, chỉ đi sang bên phải khi giá trị tăng hơn độ phức tạp".', 1500, 18, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c09', 'Trong ví dụ minh họa (trả lời tự động FAQ, gửi link thời khóa biểu), cấp độ nào được áp dụng?', '["Rule (luật tĩnh) — logic tường minh, kết quả cố định.", "Workflow (quy trình).", "Agent (tác nhân).", "Không thuộc cấp độ kỹ thuật nào trong 3 cấp độ."]', 0, 'Slide 19: "CẤP ĐỘ 1 — RULE: Tự động trả lời FAQ, gửi link thời khóa biểu… Khi nào? Logic tường minh, kết quả cố định".', 1500, 19, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c09', 'Ví dụ "AI kiểm tra độ đầy đủ của Problem Card, yêu cầu bổ sung nếu thiếu" thuộc cấp độ nào?', '["Rule (luật tĩnh).", "Workflow (quy trình) — có quy trình rõ, AI hỗ trợ từng bước.", "Agent (tác nhân).", "Không cần công nghệ AI nào để làm việc này."]', 1, 'Slide 19: "CẤP ĐỘ 2 — WORKFLOW: Duyệt Problem Card… Khi nào? Có quy trình rõ, AI hỗ trợ từng bước".', 1500, 19, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c09', 'Ví dụ "tự động theo dõi tiến độ, phát hiện nhóm học viên bị kẹt lâu, chủ động đề xuất can thiệp" thuộc cấp độ nào?', '["Rule (luật tĩnh).", "Workflow (quy trình).", "Agent (tác nhân) — tình huống động, đa công cụ.", "Không cần công nghệ AI nào để làm việc này."]', 2, 'Slide 19: "CẤP ĐỘ 3 — AGENT: Đề xuất can thiệp chủ động… Khi nào? Tình huống động, đa công cụ".', 1500, 19, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c09', 'Có bắt buộc phải nâng cấp tuần tự từ Rule lên Agent không?', '["Có, mọi giải pháp AI đều phải đi qua đủ 3 cấp độ.", "Có, đây là quy định bắt buộc của khung PAIR.", "Không liên quan, thứ tự cấp độ chỉ mang tính tham khảo lý thuyết, không áp dụng thực tế.", "Không — dừng ở cấp tối giản nhất nếu đã đáp ứng mục tiêu đề ra."]', 3, 'Slide 19: "Không bắt buộc nâng cấp tuần tự từ Rule lên Agent → dừng ở cấp tối giản nhất nếu đã đáp ứng mục tiêu đề ra".', 1500, 19, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c10', '3 workflow pattern cơ bản theo Anthropic là gì?', '["Prompt Chaining, Routing, Parallelization.", "Automate, Augment, Hybrid.", "Rule, Workflow, Agent.", "Discover, Define, Develop."]', 0, 'Slide 20 liệt kê đúng 3 mô hình: Prompt Chaining, Routing, Parallelization.', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c10', 'Prompt Chaining hoạt động theo cơ chế nào?', '["Phân loại input rồi đưa vào nhánh chuyên biệt.", "Chia task thành chuỗi bước tuần tự, có gate kiểm tra giữa các bước (VD viết outline → check → viết bài).", "Chạy song song nhiều lời gọi rồi tổng hợp.", "Chạy độc lập không có bất kỳ gate kiểm tra nào."]', 1, 'Slide 20: "1. Prompt Chaining — Chia task thành chuỗi bước tuần tự, có gate kiểm tra giữa các bước".', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c10', 'Routing hoạt động theo cơ chế nào?', '["Chia thành chuỗi bước tuần tự có gate kiểm tra.", "Chạy song song rồi tổng hợp hoặc vote.", "Phân loại input rồi đưa vào nhánh chuyên biệt, tối ưu từng loại riêng (VD câu dễ đi model rẻ, câu khó đi model mạnh).", "Luôn dùng một model duy nhất cho mọi loại input."]', 2, 'Slide 20: "2. Routing — Phân loại input → đưa vào nhánh chuyên biệt, tối ưu từng loại riêng".', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c10', 'Parallelization mang lại ý nghĩa quyết định gì?', '["Đổi độ trễ lấy độ chính xác (đó là Prompt Chaining).", "Câu dễ đi model rẻ, câu khó đi model mạnh (đó là Routing).", "Giảm chi phí bằng cách chỉ gọi model đúng một lần duy nhất.", "Vote để giảm rủi ro một đầu ra sai (chạy song song rồi tổng hợp)."]', 3, 'Slide 20: "3. Parallelization… Ý nghĩa quyết định: vote để giảm rủi ro một đầu ra sai".', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c10', 'Nguyên tắc Anthropic được nhắc lại ở phần workflow patterns là gì?', '["Luôn ưu tiên giải pháp đơn giản nhất; chỉ tăng độ phức tạp khi thực sự cần thiết.", "Luôn dùng cả 3 pattern cùng lúc trong mọi hệ thống.", "Ưu tiên pattern phức tạp nhất để đảm bảo độ chính xác.", "Bỏ qua workflow pattern nếu đã chọn cấp độ Agent."]', 0, 'Slide 20: "NGUYÊN TẮC ANTHROPIC → Luôn ưu tiên giải pháp đơn giản nhất; chỉ tăng độ phức tạp khi thực sự cần thiết".', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c10', 'Cây quyết định chọn cấp độ giải pháp (Rule/Workflow/Agent) đi theo hướng nào?', '["Từ dưới lên, ưu tiên Agent trước tiên.", "Từ trên xuống, mỗi nhánh \"KHÔNG\" là một lần tránh được độ phức tạp không cần thiết.", "Ngẫu nhiên, không theo thứ tự cụ thể.", "Luôn dẫn đến Agent bất kể câu trả lời ở mỗi nhánh."]', 1, 'Slide 21: "Đi từ trên xuống — mỗi nhánh ''KHÔNG'' là một lần tránh được độ phức tạp không cần thiết".', 1500, 21, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c10', 'Ý nghĩa quyết định của Prompt Chaining là gì?', '["Đổi độ chính xác lấy tốc độ xử lý.", "Giảm chi phí bằng cách bỏ qua mọi bước kiểm tra.", "Đổi độ trễ (latency) lấy độ chính xác, nhờ có bước gate kiểm tra giữa chừng.", "Luôn chạy nhanh hơn Routing trong mọi trường hợp."]', 2, 'Slide 20: "Ý nghĩa quyết định: đổi độ trễ lấy độ chính xác" (Prompt Chaining).', 1500, 20, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c10', 'Nguồn tham khảo cho phần workflow patterns và cây quyết định là gì?', '["Google PAIR — Ch.1 User Needs.", "Don Norman — Double Diamond.", "Chip Huyen — AI Engineering.", "Anthropic — Building Effective Agents (2024) và Google — Rules of ML."]', 3, 'Slide 20-21: "NGUỒN — Anthropic — Building effective agents · Google — Rules of ML".', 1500, 21, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c11', 'True Positive (TP) trong ví dụ "AI gợi ý câu trả lời cho học viên" nghĩa là gì?', '["Câu hỏi nghẽn thật → AI gợi ý đúng câu trả lời, học viên được giải tỏa, TA đỡ tải.", "Câu hỏi đã có tài liệu sẵn → AI không can thiệp.", "AI gợi ý câu trả lời sai và gửi thẳng cho học viên.", "AI bỏ sót học viên đang kẹt thật, không gợi ý gì."]', 0, 'Slide 22: "TP — TRUE POSITIVE · ĐÚNG-TÍCH CỰC: Câu hỏi nghẽn thật → AI gợi ý đúng câu trả lời".', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c11', 'False Positive (FP) trong ví dụ này là gì?', '["AI gợi ý đúng câu trả lời cho câu hỏi nghẽn thật.", "AI gợi ý câu trả lời SAI (hallucination) và gửi thẳng cho học viên → học viên đi sai hướng.", "AI không can thiệp khi câu hỏi đã có tài liệu.", "AI bỏ sót học viên đang kẹt thật, không gợi ý gì."]', 1, 'Slide 22: "FP — FALSE POSITIVE · BÁO ĐỘNG GIẢ: AI gợi ý câu trả lời SAI (hallucination)…".', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c11', 'False Negative (FN) trong ví dụ này là gì?', '["AI gợi ý sai và gây hiểu lầm cho học viên.", "AI gợi ý đúng và giải tỏa cho học viên.", "Học viên đang kẹt thật nhưng AI bỏ sót, không gợi ý → học viên vẫn chờ lâu như cũ.", "AI không can thiệp đúng vì câu hỏi đã có sẵn tài liệu."]', 2, 'Slide 22: "FN — FALSE NEGATIVE · BỎ SÓT: Học viên đang kẹt thật nhưng AI bỏ sót, không gợi ý".', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c11', 'Vì sao "chi phí của FP và FN không đối xứng" theo bài giảng?', '["Vì FP và FN luôn có xác suất xảy ra bằng nhau trong thực tế.", "Vì FP chỉ xảy ra với model nhỏ, FN chỉ xảy ra với model lớn.", "Vì FP và FN không liên quan gì đến thiết kế hệ thống.", "Vì báo động giả (FP) khác bản chất với bỏ sót thật (FN) — như ví dụ \"báo cháy giả ≠ bỏ sót đám cháy\"."]', 3, 'Slide 22: "Chi phí của FP và FN KHÔNG đối xứng — báo cháy giả ≠ bỏ sót đám cháy".', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c11', 'Precision cao dẫn đến hệ quả gì?', '["Ít gợi ý nhưng chắc đúng — hệ quả là nhiều False Negative (bỏ sót học viên cần giúp).", "Bao trọn mọi trường hợp cần giúp, không ai bị bỏ sót.", "Nhiều False Positive hơn.", "Không có bất kỳ đánh đổi nào xảy ra."]', 0, 'Slide 23: "PRECISION CAO… Ít gợi ý — nhưng gợi ý nào cũng chắc đúng… Hệ quả: Nhiều False Negative".', 1500, 23, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c11', 'Recall cao dẫn đến hệ quả gì?', '["Ít gợi ý nhưng chắc đúng, không có False Positive nào.", "Bao trọn mọi trường hợp cần giúp nhưng hệ quả là nhiều False Positive (gợi ý sai, TA phải lọc lại thủ công).", "Nhiều False Negative hơn.", "Loại bỏ hoàn toàn nhu cầu TA can thiệp."]', 1, 'Slide 23: "RECALL CAO… Bao trọn mọi trường hợp cần giúp… Hệ quả: Nhiều False Positive".', 1500, 23, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c11', 'Công thức tính Precision là gì?', '["TP / (TP + FN).", "(TP + TN) / (TP + TN + FP + FN).", "TP / (TP + FP).", "FP / (FP + TN)."]', 2, 'Slide 23: "PRECISION CAO — TP / (TP + FP)".', 1500, 23, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c11', 'Ai nên tham gia thiết kế reward function theo bài giảng?', '["Chỉ đội Engineering vì đây là vấn đề kỹ thuật thuần túy.", "Chỉ đội UX vì đây là vấn đề trải nghiệm người dùng.", "Chỉ cấp quản lý cấp cao quyết định, không cần đội ngũ kỹ thuật.", "Tối thiểu UX × Product × Engineering cùng ngồi lại, vì reward function định hình trải nghiệm người dùng cuối."]', 3, 'Slide 22: "nó phải được thiết kế liên chức năng: tối thiểu UX × Product × Engineering cùng ngồi lại".', 1500, 22, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c12', 'Template viết tiêu chí thành công của PAIR có dạng gì?', '["\"If {chỉ số cụ thể} for {tính năng AI} {drops below/goes above} {ngưỡng có nghĩa}, we will {hành động cụ thể}.\"", "\"AI sẽ luôn đúng 100% trong mọi trường hợp.\"", "\"Model tốt nhất sẽ tự động được chọn.\"", "\"Success = người dùng cảm thấy hài lòng.\""]', 0, 'Slide 24: "TEMPLATE CỦA PAIR — If {chỉ số cụ thể} for {tính năng AI} {drops below / goes above} {ngưỡng có nghĩa}, we will {hành động cụ thể}".', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c12', 'Trong ví dụ "nếu tỷ lệ câu trả lời AI bị TA sửa > 30% trong 2 tuần", hành động cụ thể được đề xuất là gì?', '["Tăng mức tự động hóa lên pha cao hơn ngay lập tức.", "Hạ mức tự động về pha 1 (chỉ gợi ý, không gửi thẳng cho học viên).", "Dừng hoàn toàn dự án ngay lập tức.", "Không làm gì cả, tiếp tục theo dõi thêm vô thời hạn."]', 1, 'Slide 24: "Nếu tỷ lệ câu trả lời AI gợi ý bị TA sửa > 30% trong 2 tuần, ta sẽ hạ mức tự động về pha 1".', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c12', 'Checklist trước khi chốt metric gồm những câu hỏi nào?', '["Model nào rẻ nhất? Ai sẽ code tính năng? Ngân sách còn lại bao nhiêu?", "Actor là ai? Workflow gồm mấy bước? Boundary là gì?", "Metric có ý nghĩa với MỌI người dùng không? Có nhóm nào bị ảnh hưởng tiêu cực không? Đây là thành công ngày 1, còn ngày 1000 thì sao?", "Precision hay Recall quan trọng hơn trong mọi trường hợp?"]', 2, 'Slide 24 liệt kê đúng 3 câu hỏi trong "CHECKLIST TRƯỚC KHI CHỐT METRIC".', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c12', 'Vì sao cần "lên lịch review metric định kỳ"?', '["Vì metric luôn sai ngay từ đầu và cần sửa gấp.", "Vì quy định pháp lý yêu cầu review metric hàng tuần.", "Vì model sẽ tự động thay đổi metric theo thời gian.", "Vì tiêu chí thành công cũng cần được bảo trì theo thời gian, không phải thiết lập một lần là xong mãi mãi."]', 3, 'Slide 24: "đừng quên: lên lịch review metric định kỳ — tiêu chí thành công cũng cần được bảo trì theo thời gian".', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c12', 'Metric tốt theo PAIR cần có những thành phần nào?', '["Chỉ số cụ thể + ngưỡng có nghĩa + hành động cụ thể.", "Chỉ cần một con số duy nhất, không cần hành động kèm theo.", "Chỉ cần mô tả định tính, không cần con số cụ thể.", "Chỉ cần được phê duyệt bởi cấp quản lý cao nhất."]', 0, 'Slide 24: "Metric tốt = chỉ số cụ thể + ngưỡng có nghĩa + hành động cụ thể".', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c12', 'Câu hỏi "Đây là thành công của ngày 1 — còn ngày 1000 thì sao?" trong checklist nhằm mục đích gì?', '["Tính số lượng người dùng dự kiến sau 1000 ngày.", "Kiểm tra tính bền vững lâu dài của metric, tránh chỉ tối ưu cho giai đoạn ra mắt ban đầu.", "Ước tính chi phí vận hành sau 1000 ngày.", "Đây chỉ là câu hỏi tu từ, không có mục đích cụ thể."]', 1, 'Câu hỏi này nằm trong checklist ở slide 24, kiểm tra tính bền vững dài hạn của metric.', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c12', '"Có nhóm nào bị ảnh hưởng tiêu cực không?" trong checklist kiểm tra điều gì?', '["Kiểm tra chi phí vận hành có tăng lên không.", "Kiểm tra tốc độ phản hồi của hệ thống.", "Đảm bảo metric không gây bất công hoặc gây hại cho một nhóm người dùng cụ thể nào đó.", "Kiểm tra số lượng token tiêu thụ mỗi ngày."]', 2, 'Slide 24: một trong ba mục checklist trước khi chốt metric.', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c12', 'Việc viết tiêu chí thành công thuộc bước nào trong 3 bước PAIR?', '["Bước 1 — Có cần AI?", "Bước 2 — Automate hay Augment?", "Không thuộc bước nào trong 3 bước PAIR.", "Bước 3 — Reward function & tiêu chí thành công."]', 3, 'Slide 24 đánh dấu breadcrumb "① Nhu cầu ② Auto/Augment ③ Reward function" với bước 3 được tô đậm.', 1500, 24, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c13', '4 yếu tố trong "khoảng cách Demo đến Production" là gì?', '["Baseline (đối chứng), Evaluation (kiểm thử), Controls (kiểm soát), Operations (vận hành liên tục).", "Model, Context, Planning, Tools.", "Actor, Workflow, Bottleneck, Impact.", "Precision, Recall, F1, Accuracy."]', 0, 'Slide 25: "01 · BASELINE, 02 · EVALUATION, 03 · CONTROLS, 04 · OPERATIONS".', 1500, 25, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c13', '"Controls" trong khoảng cách Demo-Production bao gồm điều gì?', '["Bộ dữ liệu kiểm thử và kịch bản biên.", "Logging, fallback, rollback và nhân sự chịu trách nhiệm.", "Đối chiếu hiệu quả với quy trình hiện tại.", "Ai giám sát lỗi và tối ưu hệ thống liên tục."]', 1, 'Slide 25: "03 · CONTROLS — Cơ chế kiểm soát: Logging, fallback, rollback và nhân sự chịu trách nhiệm?".', 1500, 25, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c13', 'Vì sao "phản hồi chính xác trong vài lần thử chưa đủ cơ sở để triển khai" theo bài giảng?', '["Vì demo luôn dùng model khác hẳn với production.", "Vì demo không sử dụng dữ liệu thật.", "Vì demo chưa kiểm chứng được độ ổn định, kiểm soát rủi ro và vận hành liên tục như một hệ thống production thật.", "Vì demo luôn chạy chậm hơn production."]', 2, 'Slide 25: "Phản hồi chính xác trong vài lần thử chưa đủ cơ sở để triển khai hệ thống thực tế".', 1500, 25, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c13', 'Mục tiêu của Day 02 theo bài giảng là gì (liên quan đến khoảng cách Demo/Production)?', '["Triển khai sản phẩm AI hoàn chỉnh ngay trong ngày học.", "Chọn model cụ thể để dùng cho production.", "Viết code hoàn chỉnh cho hệ thống production.", "Xác định tính khả thi để tiếp tục nghiên cứu — chưa phải quyết định triển khai ngay."]', 3, 'Slide 25: "Mục tiêu Day 02 là xác định tính khả thi để tiếp tục nghiên cứu — chưa phải quyết định triển khai ngay".', 1500, 25, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c13', '3 phần input của Eval Plan bắt nguồn từ đâu?', '["Từ Problem Statement (9 trường đã hoàn chỉnh: Actor, Workflow, Bottleneck… đến Boundary & HITL).", "Từ báo cáo tài chính của dự án.", "Từ phản hồi trên mạng xã hội.", "Từ benchmark công khai của các model AI."]', 0, 'Slide 26: "01 · INPUT — Problem Statement: 9 trường đã hoàn chỉnh — từ Actor, Workflow, Bottleneck đến Boundary & HITL".', 1500, 26, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c13', '"Rủi ro & sai số" trong Eval Plan kiểm tra điều gì?', '["Tốc độ phản hồi trung bình của hệ thống.", "Hệ thống có phản hồi sai lệch mà không chuyển tiếp cho người phụ trách (VD Lab Coach) phê duyệt hay không.", "Chi phí token tiêu thụ mỗi ngày.", "Số lượng người dùng đăng ký mới."]', 1, 'Slide 26: "RỦI RO & SAI SỐ — Hệ thống có phản hồi sai lệch mà không chuyển tiếp cho Lab Coach phê duyệt không?".', 1500, 26, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c13', '"Hiệu năng quy trình" trong Eval Plan đo lường điều gì?', '["Tốc độ inference của model tính bằng mili-giây.", "Số lượng tham số của model đang dùng.", "Nhóm học viên có hoàn thành bài lab nhanh hơn và ít bị kẹt hơn không.", "Độ dài trung bình của context window."]', 2, 'Slide 26: "HIỆU NĂNG QUY TRÌNH — Nhóm học viên có hoàn thành bài lab nhanh hơn và ít kẹt hơn không?".', 1500, 26, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c13', 'Test case (kịch bản kiểm thử) trong Eval Plan nên bao gồm gì?', '["Chỉ dữ liệu lý tưởng, không có trường hợp biên.", "Chỉ dữ liệu do chính model AI tự sinh ra.", "Chỉ các câu hỏi đã có sẵn đáp án đúng 100%.", "Dữ liệu thực tế và các trường hợp biên (edge cases)."]', 3, 'Slide 26: "02 · TEST CASES — Kịch bản kiểm thử: Dữ liệu thực tế và các trường hợp biên (edge cases)".', 1500, 26, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c14', '6 yếu tố bài toán cốt lõi trong Problem Statement là gì?', '["Actor, Workflow, Bottleneck, Impact, Success Metric, Boundary.", "Model, Context, Planning, Tools, Baseline, Target.", "Discover, Define, Develop, Deliver, Evaluate, Launch.", "TP, TN, FP, FN, Precision, Recall."]', 0, 'Slide 27: "6 YẾU TỐ BÀI TOÁN CỐT LÕI — Actor, Workflow, Bottleneck, Impact, Success Metric, Boundary".', 1500, 27, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c14', '3 yếu tố quyết định AI trong Problem Statement là gì?', '["Actor, Workflow, Bottleneck.", "Điểm AI can thiệp (entry), Mức chọn (level: Rule/Workflow/Agent), Rủi ro & HITL (safety).", "Baseline, Target, Measurement.", "Discover, Define, Develop."]', 1, 'Slide 27: "3 YẾU TỐ QUYẾT ĐỊNH AI — Điểm AI can thiệp, Mức chọn, Rủi ro & HITL".', 1500, 27, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c14', '"Go" trong khung ra quyết định nghĩa là gì?', '["Tạm hoãn, cần bổ sung thêm dữ liệu thực tế.", "Không triển khai vì AI không mang giá trị vượt trội.", "Đủ điều kiện thực hiện — bài toán rõ ràng, chỉ số đo lường khả thi, điểm can thiệp AI phù hợp, kiểm soát được rủi ro.", "Chưa xác định, cần thêm thời gian nghiên cứu."]', 2, 'Slide 28: "✓ Go — thực hiện — ĐỦ ĐIỀU KIỆN: Bài toán rõ ràng — Chỉ số đo lường khả thi…".', 1500, 28, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c14', '"Not Yet" trong khung ra quyết định nghĩa là gì?', '["Đủ điều kiện để triển khai ngay lập tức.", "Hoàn toàn không phù hợp, dừng dự án ngay.", "Không có ý nghĩa cụ thể, chỉ là một placeholder tạm thời.", "Có triển vọng nhưng cần bổ sung dữ liệu thực tế, chuẩn hóa quy trình, thiết lập chỉ số, xác định ranh giới."]', 3, 'Slide 28: "⏸ Not Yet — tạm hoãn — CÓ TRIỂN VỌNG: Cần bổ sung dữ liệu thực tế…".', 1500, 28, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c14', 'Vì sao bài giảng nói "Not Yet thể hiện sự chín chắn, không phải thất bại"?', '["Vì quyết định hoãn có căn cứ (cần thêm dữ liệu/chuẩn hóa) là lập luận thiết kế sản phẩm cẩn trọng, không phải dấu hiệu yếu kém.", "Vì Not Yet luôn tự động chuyển thành Go trong tương lai gần.", "Vì Not Yet có ý nghĩa hoàn toàn giống với No-Go.", "Vì Not Yet chỉ được chọn khi dự án thiếu ngân sách."]', 0, 'Slide 28: "Quyết định ''Not Yet'' thể hiện sự chín chắn trong tư duy thiết kế sản phẩm, không phải sự thất bại".', 1500, 28, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c14', '"Boundary" (ranh giới) trong 6 yếu tố cốt lõi mô tả điều gì?', '["Chỉ số đo lường cụ thể để xác định cải thiện.", "AI không được làm gì; khâu nào bắt buộc phải có con người.", "Đối tượng trực tiếp chịu ảnh hưởng bởi vấn đề.", "Tổn thất được lượng hóa bằng thời gian/chi phí."]', 1, 'Slide 27: "Boundary — ranh giới: AI không được làm gì; khâu nào bắt buộc có con người".', 1500, 27, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c14', 'Khung Go/Not Yet/No-Go nên dựa trên cơ sở nào để quyết định?', '["Xu hướng công nghệ đang được truyền thông nhắc đến nhiều nhất.", "Sở thích cá nhân của người ra quyết định.", "Lập luận dựa trên tính khả thi của Problem Statement, tránh thiên kiến công nghệ.", "Model AI nào đang rẻ nhất tại thời điểm quyết định."]', 2, 'Slide 28: "Lập luận dựa trên tính khả thi của Problem Statement, tránh thiên kiến công nghệ".', 1500, 28, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c14', '"No-Go" xảy ra khi nào theo bài giảng?', '["Khi chỉ số đo lường khả thi và rủi ro đã kiểm soát được (đó là Go).", "Khi cần bổ sung thêm dữ liệu thực tế (đó là Not Yet).", "Khi ngân sách công ty vẫn còn dư dả.", "AI không mang giá trị vượt trội, rủi ro vận hành quá cao, hoặc có giải pháp không dùng AI tối ưu hơn."]', 3, 'Slide 28: "✕ No-Go — không triển khai — KHÔNG PHÙ HỢP: AI không mang giá trị vượt trội…".', 1500, 28, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c15', 'Nguyên tắc đầu tiên trong 6 nguyên tắc recap Day 02 là gì?', '["Brief mơ hồ không thay thế Problem Statement hoàn chỉnh.", "Phức tạp luôn đồng nghĩa với hiệu quả.", "AI luôn tốt hơn Rule/Workflow trong mọi trường hợp.", "Reward function chỉ cần đo bằng accuracy."]', 0, 'Slide 29: "01 — Brief mơ hồ không thay thế Problem Statement".', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c15', 'Nguyên tắc nào nói về việc mô hình hóa quy trình?', '["Pain point không cần lượng hóa nếu đội ngũ đủ kinh nghiệm.", "Bắt buộc phải mô hình hóa workflow trước khi xem xét tích hợp AI.", "AI nên được tích hợp ngay từ đầu quy trình thiết kế.", "Chỉ cần mô hình hóa workflow sau khi đã triển khai AI."]', 1, 'Slide 29: "02 — Mô hình hóa workflow trước khi tích hợp AI. Bắt buộc phải mô hình hóa quy trình trước khi xem xét tích hợp giải pháp AI."', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c15', 'Nguyên tắc "Phức tạp không đồng nghĩa với hiệu quả" liên quan đến điều gì?', '["Chỉ Agent mới được xem là giải pháp thật sự hiệu quả.", "Độ phức tạp luôn tỷ lệ thuận với chất lượng đầu ra.", "Rule, Workflow và Agent là ba cấp độ khác nhau; độ phức tạp kỹ thuật không đồng nghĩa với hiệu quả tối ưu.", "Rule luôn kém hiệu quả hơn Agent trong mọi trường hợp."]', 2, 'Slide 29: "04 — Phức tạp không đồng nghĩa với hiệu quả. Rule, Workflow và Agent là ba cấp độ khác nhau…"', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c15', 'Nguyên tắc thứ 6 (mới, liên quan PAIR) nói về điều gì?', '["Chỉ cần đo bằng độ chính xác kỹ thuật (accuracy) là đủ.", "Không cần kiểm chứng với người dùng thật nếu accuracy đã cao.", "Reward function chỉ áp dụng cho hệ thống Rule-based.", "Đo reward function bằng trải nghiệm người dùng, không chỉ accuracy — thiết kế đánh đổi precision/recall theo lợi ích và kiểm chứng với người dùng thật."]', 3, 'Slide 29: "06 — Đo reward function bằng trải nghiệm người dùng, không chỉ accuracy… Thiết kế đánh đổi precision ↔ recall theo lợi ích người dùng".', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c15', 'Nguyên tắc "Pain point phải được lượng hóa" yêu cầu điều gì?', '["Mọi điểm đau cần được lượng hóa bằng baseline và chỉ số đo lường cụ thể.", "Chỉ cần mô tả định tính về điểm đau, không cần con số.", "Pain point chỉ cần được xác nhận bởi một người dùng duy nhất.", "Pain point không cần đo lường nếu dự án có deadline gấp."]', 0, 'Slide 29: "03 — Pain point phải được lượng hóa. Mọi điểm đau cần được lượng hóa bằng baseline và chỉ số đo lường cụ thể."', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c15', 'Nguyên tắc "Quyết định dựa trên lập luận thực tế" áp dụng cho quyết định nào?', '["Chỉ áp dụng cho việc chọn model AI cụ thể để sử dụng.", "Quyết định Go/Not Yet/No-Go phải dựa trên lập luận thực tế và số liệu kiểm thử rõ ràng.", "Chỉ áp dụng cho việc phân bổ ngân sách dự án.", "Không áp dụng cho quyết định Go/Not Yet/No-Go mà cho quyết định khác."]', 1, 'Slide 29: "05 — Quyết định dựa trên lập luận thực tế. Quyết định Go / Not Yet / No-Go phải được thiết lập dựa trên lập luận thực tế và số liệu kiểm thử rõ ràng."', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c15', '6 nguyên tắc recap Day 02 được mô tả với vai trò gì?', '["Quy định pháp lý bắt buộc cho mọi dự án AI.", "Checklist kỹ thuật để triển khai production.", "Kim chỉ nam để thẩm định mọi đề xuất ứng dụng AI.", "Tiêu chí chấm điểm bài thi cuối khóa."]', 2, 'Slide 29: "Sáu nguyên tắc cốt lõi sau Day 02 — Kim chỉ nam để thẩm định mọi đề xuất ứng dụng AI".', 1500, 29, FALSE);
INSERT INTO questions (concept_id, stem, options, answer_idx, explanation, item_elo, source_slide, reviewed) VALUES ('d2-c15', 'Theo nguyên tắc "Brief mơ hồ không thay thế Problem Statement", một bản tóm tắt yêu cầu ngắn gọn có đủ để bắt đầu triển khai AI không?', '["Có, miễn là được lãnh đạo phê duyệt nhanh.", "Có, nếu đội ngũ kỹ thuật đủ kinh nghiệm.", "Có, nếu deadline gấp thì có thể bỏ qua Problem Statement.", "Không — một bản tóm tắt mơ hồ không thể thay thế cho một Problem Statement hoàn chỉnh."]', 3, 'Slide 29: "01 — Brief mơ hồ không thay thế Problem Statement. Một bản tóm tắt mơ hồ không thể thay thế cho một Problem Statement hoàn chỉnh."', 1500, 29, FALSE);
