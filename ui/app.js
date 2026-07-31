const SLIDES_DATA = {"d1": [{"page": 1, "full_text": "AI IN ACTION  Day 1\nAI & LLM Foundation\nBạn đang dùng AI mỗi ngày — nhưng thực sự bên trong nó đang làm gì?\nAI IN ACTION - HACKATHON"}, {"page": 2, "full_text": "AI IN ACTION  Day 1\nAgenda\n• Bức tranh AI & các tầng của AI\n• Lịch sử AI 70 năm\n• Bên trong LLM: cơ chế vận hành\n• Từ LLM đến AI Agent\n• Landscape: model hôm nay & cuộc đua hiện tại\n• Chọn model & chi phí token\n• Gọi API lần đầu\n• Tổng kết — những ý để mang về\nAI & LLM Foundation\nTừ \"nghe AI\" đến \"gọi AI\" trong một ngày\nAI IN ACTION - HACKATHON"}, {"page": 3, "full_text": "AI, ML, Deep Learning, GenAI, LLM — nằm ở đâu trong cùng một hệ?\nAI — chiếc ô lớn nhất: mọi hệ thống có yếu tố\n“thông minhˮ.\nMachine learning — học từ dữ liệu thay vì viết\nluật tay.\nDeep learning — mạng nơ-ron nhiều tầng tự học\nđặc trưng.\nGenerative AI — sinh nội dung mới: văn bản,\nảnh, code.\nLLM — model nền chuyên ngôn ngữ, tim của làn\nsóng hiện nay.\nARTIFICIAL INTELLIGENCE\nMACHINE LEARNING\nDEEP LEARNING\nGENERATIVE AI\nLLM\nGPT · Claude · Kimi\nkể cả hệ luật tay, robot…\nlọc spam · gợi ý phim\nnhận diện ảnh · giọng nói\nvăn bản · ảnh · code\ntừ rộng đến hẹp\nLLM không phải toàn bộ AI — nhưng nó là tầng\nnền của gần hết trải nghiệm AI bạn dùng hôm nay\nAI IN ACTION - HACKATHON"}, {"page": 4, "full_text": "Discriminative AI\nGiỏi phân loại, dự đoán: lọc spam, phát\nhiện gian lận, nhận diện ảnh.\nInput → một nhãn, một con số\nGenerative AI\nSinh ra thứ mới: văn bản, ảnh, code.\nChatGPT, Claude, Midjourney.\nPrompt → nội dung mới\nAgentic AI\nNhận mục tiêu rồi tự làm nhiều bước:\nlập kế hoạch, dùng công cụ, hành động.\nGoal → Plan → Action\nBa nhóm AI chính: phân loại · sinh nội dung · hành động\nLLM là engine chung của cả Generative lẫn Agentic — cuối buổi sáng mình sẽ thấy agent khác LLM ở\nđâu\nHành trình khóa học: LLM Foundation → Agent → Multi-Agent → Deploy → Evaluate\nAI IN ACTION - HACKATHON"}, {"page": 5, "full_text": "Lịch sử AI 70 năm\nKhai sinh, lời hứa đầu\ntiên\n2 lần mùa đông, cách tiếp cận chạm trần Từ model đơn lẻ sang system\ncó khả năng hành động như\nagent\nAI IN ACTION - HACKATHON"}, {"page": 6, "full_text": "1980: Hệ chuyên gia (expert system)\nĐặt lại vấn đề: \"Nếu AI chỉ giải thật tốt một loại bài toán chuyên môn hẹp thì sao?\"\n→ Sự ra đời của expert systems\nAI đổi chiến lược: thôi theo đuổi trí tuệ tổng quát và tập trung giải thật tốt một miền hẹp bằng\ncách mã hóa tri thức chuyên gia thành luật\nAI IN ACTION - HACKATHON"}, {"page": 7, "full_text": "2009: Fei-Fei Li và ImageNet — cuộc cách mạng của dữ liệu\nTrong khi cả ngành chạy theo thuật toán thông minh hơn, Fei-Fei Li chọn con đường khác: xây bộ\ndữ liệu lớn hơn — 14 triệu ảnh được gán nhãn tay, hơn 20.000 loại vật.\nBa năm sau, chính bộ dữ liệu đó là sân khấu cho cú nổ AlexNet 2012 → bài học định hình cả kỷ\nnguyên: đôi khi dữ liệu tốt hơn đánh bại thuật toán khôn hơn.Deng, J. et al. 2009, “ImageNet: A Large-Scale Hierarchical Image Databaseˮ, CVPR — doi.org/10.1109/CVPR.2009.5206848 · Fei-Fei Li, TED 2015 — ted.com\nAI IN ACTION - HACKATHON"}, {"page": 8, "full_text": "2017: Transformer\nTransformer là bước ngoặt vì nó cho mô hình hiểu ngôn ngữ theo\ncách linh hoạt hơn: mỗi từ có thể nhìn sang những từ quan trọng\nkhác trong cả câu, thay vì chỉ đi tuần tự từng bước → trở thành nền\nmóng kỹ thuật cho GPT, BERT và toàn bộ làn sóng LLM sau đó.\nAI IN ACTION - HACKATHON"}, {"page": 9, "full_text": "2022: ChatGPT\nChatGPT xuất hiện như một trải nghiệm đại chúng\nLần đầu tiên rất đông người dùng phổ thông có thể trực tiếp\nchạm vào một mô hình ngôn ngữ mạnh, thông qua một giao\ndiện đơn giản đến mức ai cũng hiểu cách dùng\nAI IN ACTION - HACKATHON"}, {"page": 10, "full_text": "1 model nền\nLLM\n💬  Chatbot\n📝  Tóm tắt tài liệu\n💻  Viết code\n🌐  Dịch & phân tích\n⟵\nLLM là gì? — một bộ não nền, không phải một chatbot\nLLM Large Language Model) là một mô hình ngôn ngữ rất lớn,\nthường dựa trên kiến trúc Transformer, được luyện trên hàng\nnghìn tỷ mảnh chữ để học cách đoán mảnh chữ tiếp theo trong\nngữ cảnh.\nNhờ được luyện đủ rộng, nó trở thành một nền chung: thay vì\nmỗi việc train một model riêng, cùng một model làm được rất\nnhiều việc.\nChatbot chỉ là một dạng sản phẩm đóng gói quanh bộ não đó —\nlớp áo bên ngoài.\nLLM = bộ não ngôn ngữ dùng chung cho mọi việc — sản phẩm bạn thấy chỉ là lớp áo bên ngoài\nModel hiện nay chủ yếu là kiến trúc decoder-only GPT, Claude, Gemini, Kimi), nhiều model dùng MoE; sau pre-training còn các bước căn chỉnh SFT, RLHF/DPO) và\nluyện suy luận (reasoning training, từ 2025.\nAI IN ACTION - HACKATHON"}, {"page": 11, "full_text": "Bên trong Transformer: đầu ra luôn là một phân bố xác suất\nVới mọi ngữ cảnh, model chấm điểm MỌI từ trong từ vựng — “landˮ 22%, “forestˮ 9%… — rồi chọn theo xác suất đó\nTransformers, the tech behind LLMs - 3Blue1Brown\nAI IN ACTION - HACKATHON"}, {"page": 12, "full_text": "Sinh văn bản = đoán → nối vào câu → đoán tiếp\nMỗi token mới được nối vào ngữ cảnh, rồi model chạy lại từ đầu — vòng lặp predict → append → rerun\nTransformers, the tech behind LLMs - 3Blue1Brown\nAI IN ACTION - HACKATHON"}, {"page": 13, "full_text": "Token: model không đọc \"từ\", model đọc mảnh chữ\nModel không nhìn từ nguyên vẹn. Nó cắt văn bản\nthành các mảnh nhỏ gọi là token: có từ là một mảnh,\ncó từ vỡ ba bốn mảnh, cả dấu câu và khoảng trắng\ncũng là mảnh.\nVí dụ: \"Hello world\" ≈ 2 token, nhưng \"Xin chào\" có\nthể tới 34 token.\nTiếng Việt, code, JSON tốn token hơn tiếng Anh\nthường — vì dấu thanh, ký tự đặc biệt và cấu trúc bị\ncắt nhỏ ra.\nMọi thứ model làm đều quy ra token — và mỗi token đều có giá. Nhớ điều này khi sang phần chi phí.\nThử trực tiếp: platform.openai.com/tokenizer · Số token chính xác phụ thuộc tokenizer của từng model.\nAI IN ACTION - HACKATHON"}, {"page": 14, "full_text": "Context: bàn làm việc có hạn của model\nMỗi lần trả lời, model chỉ nhìn được một lượng chữ có\nhạn — gọi là context. Hãy hình dung một bàn làm việc:\nmọi thứ muốn model \"thấy\" phải bày lên bàn.\nQuy đổi: 128K token ≈ một cuốn sách 300 trang; 1M\ntoken ≈ 45 cuốn sách trên bàn cùng lúc.\nBàn đầy quá thì đồ ở giữa bàn dễ bị bỏ sót — đặt điều\nquan trọng ở giữa một prompt rất dài, model có thể\n\"quên\" mất.\nContext càng dài càng tốn tiền và càng chậm — bàn rộng không có nghĩa là dùng tốt\nHiện tượng “quên phần giữaˮ: Liu et al. 2023, “Lost in the Middleˮ — arxiv.org/abs/2307.03172. Model thế hệ mới đã cải thiện đáng kể nhưng chưa hết hẳn.\nAI IN ACTION - HACKATHON"}, {"page": 15, "full_text": "Attention: mỗi từ được “nhìn sangˮ những từ quan trọng khác\nThay vì đọc tuần tự từng chữ, cơ chế attention cho phép mỗi token:\nChủ động “quay đầuˮ nhìn lại các token trước đó trong câu\nChấm điểm mức độ liên quan của từng token đối với nghĩa của mình\nKhóa nghĩa theo ngữ cảnh — “nóˮ là quyển sách hay cái túi, tùy theo nó chú ý vào từ nào\nĐây chính là chữ T trong GPT — và là lý do model hiểu ngữ cảnh tốt hơn hẳn các thế hệ trước\nVideo minh họa: Attention in transformers, step-by-step - 3Blue1Brown\nAI IN ACTION - HACKATHON"}, {"page": 16, "full_text": "1 Đặt điều quan trọng đầu – cuối\nĐầu và cuối prompt được chú ý nhiều\nnhất; đồ ở giữa dễ bị bỏ sót — yêu cầu\nquan trọng đừng chôn giữa.\n2 Giữ bàn làm việc sạch\nContext rác = attention rác. Khi chat dài,\ntóm tắt lại thay vì kéo theo mọi thứ; khi\nvibe code, đưa đúng file liên quan, không\ndán cả repo.\n3 Cho tra sổ thay vì bắt nhớ\nTài liệu dài: lấy đoạn liên quan nhét vào\ncontext RAG) thay vì trông chờ model\nnhớ hết hoặc nhét cả cuốn.\nHiểu attention để dùng AI hiệu quả: quản context = quản sự chú ý\nAttention có hạn và có \"điểm mù\". Vì vậy, cách bạn bày context quyết định model chú ý vào đâu:\nAgent mạnh không phải vì context khổng lồ — mà vì nó có tools để lấy đúng thứ vào bàn làm việc\nđúng lúc\nAI IN ACTION - HACKATHON"}, {"page": 17, "full_text": "2020  GPT3\n175 tỷ\nmột \"bác sĩ đa năng\" — mọi token đều đi qua toàn bộ khớp nối\n(dense)\n2026  Kimi K3\n2.800 tỷ\nmột \"bệnh viện đa khoa\" — mỗi token chỉ gọi vài chuyên gia\nMoE\ncompute / dữ liệu (thang log) →\ntest loss ↓\nLuật chơi 20202024: cứ thêm compute + dữ liệu là model khôn lên\nmột cách dự đoán được (scaling law, Kaplan et al. 2020\nTham số (parameter): những \"khớp nối\" model học được\nSau khi luyện xong, những gì model \"biết\" nằm trong các con số cố định bên trong gọi là tham số — hãy hình dung\nnhư khớp nối thần kinh: luyện càng kỹ, các khớp nối càng được siết đúng.\nTham số không phải thứ bạn chỉnh khi dùng model — nó được đóng gói sẵn trong \"bộ não\" (file weights). Bạn chỉ\nchỉnh được context và các núm vặn lúc gọi (như temperature).\nNhiều tham số ≠ tốn hơn tuyến tính — nhờ MoE, bệnh viện lớn gấp 16 lần\nmà chi phí mỗi ca khám gần như không đổi\nMoE Shazeer et al. 2017 — arxiv.org/abs/1701.06538 · Kimi K3 16/7/2026 2.8 nghìn tỷ tham số MoE — k3-kimi.com\nAI IN ACTION - HACKATHON"}, {"page": 18, "full_text": "LLM được tạo ra như thế nào? — đọc nhiều, được chỉ, được uốn nắn, luyện đề\n① Pre-training — \"đọc cả thư viện\": học tiếng nói và kiến thức từ hàng nghìn tỷ token. ② SFT — \"được chỉ cách trả\nlời\": học theo ví dụ mẫu để ra dáng trợ lý. ③ RLHF/DPO — \"được uốn nắn\": học theo phản hồi con người, an toàn và\ndễ chịu hơn. ④ Luyện suy luận — \"giải đề tự chấm\" (từ 2025 luyện toán/code có đáp án kiểm chứng được →\nmodel biết làm nháp trước khi trả lời.\nĐọc vạn cuốn sách chưa chắc biết trả lời phỏng vấn — đó là lý do cần bước ②, ③, ④\nOuyang et al. 2022, InstructGPT — arxiv.org/abs/2203.02155 · Rafailov et al. 2023, DPO — arxiv.org/abs/2305.18290 · RLVR RL with verifiable rewards.\nAI IN ACTION - HACKATHON"}, {"page": 19, "full_text": "RLHF: ba bước uốn cỗ máy đoán token thành trợ lý biết nghe lời\n① Model viết nhiều câu trả lời\n«Cùng một câu hỏi»\n↓\nLLM\nTrả lời A Trả lời B\nTrả lời C Trả lời D\n② Người chấm xếp hạng\nTrả lời B 1\nTrả lời D 2\nTrả lời A 3\nTrả lời C 4\n↓\nREWARD MODEL\nmáy chấm điểm thay người\n③ Huấn luyện theo điểm\nLLM\n↓\ncâu trả lời vừa viết\n↓\nđiểm: 9.2 / 10tăng xác suất\ncâu ghi điểm\ncao\nlặp lại hàng nghìn lần → model dần “biết nghe lờiˮ\nCỗ máy đoán token + điểm xếp hạng của con người → trợ lý helpful · harmless · honest\nOuyang et al. 2022, “Training language models to follow instructions with human feedbackˮ InstructGPT — arxiv.org/abs/2203.02155 · DPO (cách đơn giản hơn,\n2023 — arxiv.org/abs/2305.18290\nAI IN ACTION - HACKATHON"}, {"page": 20, "full_text": "Bong bóng thời gian\nModel bị \"đóng băng\" tại ngày ngừng đọc.\nChuyện sau đó nó không biết — trừ khi\nbạn cung cấp thêm (knowledge cutoff).\nNói chắc như đúng rồi\nModel tối ưu cho câu nghe hợp lý, không\nphải tra sự thật — nên có thể tự tin mà sai\n(hallucination).\nBàn làm việc có hạn\nContext có trần; quá dài vừa tốn tiền vừa\ndễ bỏ sót thông tin ở giữa.\n\"Why does it work? We don't know — a lot here are intuitions, not theorems or truths.\" — Łukasz Kaiser, đồng tác giả\n\"Attention Is All You Need\" OpenAI\nGiới hạn bẩm sinh: học giả trong bong bóng\nĐây không phải lỗi tạm thời — đó là bản chất của cỗ máy đoán token. Vì vậy ta cần prompt tốt, context sạch, tra\nsổ RAG, tools, và luôn kiểm chứng.\n“Biết nhiềuˮ khác “làm đượcˮ: dữ liệu mới và hành động thật cần tools/retrieval/workflow — nền của các ngày sau.\nAI IN ACTION - HACKATHON"}, {"page": 21, "full_text": "1 Phân loại spam\nModel thực chất đã học:\n“đếm số hyperlink trong emailˮ\nEmail sạch nhưng nhiều link → vẫn bị gán\nspam\n2 Câu chủ quan vs khách quan\nModel thực chất đã học:\n“có phải câu trích từ film review\nkhôngˮ\nĂn gian bằng nguồn gốc câu, không phải\nnội dung câu\n3 Suy luận ngôn ngữ MNLI\nModel thực chất đã học:\n“câu có động từ phủ địnhˮ\nĐổi cấu trúc dữ liệu test là điểm tụt ngay\nBa “đường tắtˮ (spurious cues) trên do chính LLM tự động phát hiện và mô tả bằng ngôn ngữ tự nhiên — trên quy mô 675 bài toán\nthật của benchmark OpenD5.\nVì sao model vẫn sai: nó rất giỏi học vẹt đường tắt\nBenchmark cao ≠ model hiểu đúng thứ bạn tưởng — luôn test trên dữ liệu của chính\nmình\nZhong, Snell, Klein & Steinhardt 2022, “Describing Differences between Text Distributions with Natural Languageˮ, ICML 2022 · Zhong et al. 2023, “Goal Driven\nDiscovery of Distributional Differences via Language Descriptionsˮ OpenD5, NeurIPS 2023\nAI IN ACTION - HACKATHON"}, {"page": 22, "full_text": "Bài toán: \"Có 5 quả bóng tennis. Mua thêm 2 hộp, mỗi hộp 3 quả. Hỏi tổng cộng có bao nhiêu quả?\"\nKhông có nháp — trả lời ngay\nModel đọc câu hỏi → bật ra đáp án ngay:\n\"Đáp án là 27 quả.\"\n✗ SAI\nCó giấy nháp — \"hãy nghĩ từng bước\"\n\"Bắt đầu có 5 quả.\nMỗi hộp 3 quả × 2 hộp = 6 quả.\n5 + 6 = 11.\nĐáp án là 11 quả.\"\n✓ ĐÚNG\nChain-of-Thought: chỉ thêm \"giấy nháp\", từ sai thành đúng\nCùng một model, cùng một câu hỏi — cho nó được viết nháp từng bước, bản chất suy luận lộ ra\nWei et al. 2022, “Chain-of-Thought Prompting Elicits Reasoning in Large Language Modelsˮ — arxiv.org/abs/2201.11903 · Đây là mầm của các reasoning model (o1,\nR1...) và của test-time compute ở các slide sau.\nAI IN ACTION - HACKATHON"}, {"page": 23, "full_text": "Từ LLM đến agent: bốn mức độ — mỗi bậc thêm một năng lực\nLEVEL 0\nBộ não suy luận\nLLM trần — không công cụ,\nkhông dữ liệu mới\nLEVEL 1\nCó kết nối\n+ tools: search web, đọc\ndatabase, gọi API — vượt khỏi\nbong bóng thời gian\nLEVEL 2\nBiết lập kế hoạch\n+ tự chia mục tiêu thành nhiều\nbước, dùng nhiều tool nối tiếp, tự\nkiểm tra kết quả từng bước\nLEVEL 3\nĐội agent phối hợp\n+ nhiều agent chuyên biệt chia\nviệc như một đội ngũ (multi-\nagent)\nmức tự chủ & tác động thật tăng dần →\nAgent không phải “một loại model khácˮ — đó là LLM được đặt vào vòng làm việc có mục tiêu\nvà hành động\nAI IN ACTION - HACKATHON"}, {"page": 24, "full_text": "Giải phẫu một agent: 5 bộ phận là một vòng lặp\nvòng lặp\nagent\n① Goal\nmục tiêu cần đạt\n② Reasoning\nbộ não LLM chia bước\n③ Tools\nsearch · API · database ·\ncode\n④ Action\nhành động ra đời thật\nMemory\nsổ tay ghi nhớ các bước\nAgent = Goal + Reasoning + Tools + Memory + Action — chạy thành vòng lặp cho tới khi\nxong việc\nquan sát kết quả → lặp lại\nghi / đọc\nAI IN ACTION - HACKATHON"}, {"page": 25, "full_text": "Cùng một mức năng lực, giá rơi khoảng 10 lần mỗi năm\nViệc năm ngoái phải dùng model đắt nhất — năm nay model rẻ đã làm được\nTổng hợp từ bảng giá các nhà cung cấp, 20232026.\nAI IN ACTION - HACKATHON"}, {"page": 26, "full_text": "Chọn model theo TẦNG, không chọn theo tên\nVIỆC CỦA BẠN TẦNG MODEL\nHai lỗi đối xứng:\n✗ việc đơn giản mà gọi frontier → phí tiền\n✗ việc khó mà cố dùng rẻ → kết quả tệ\nViệc đơn giản, khối lượng lớn\nphân loại · trích xuất · tóm tắt ngắn\nViệc hàng ngày\nviết · code · phân tích công việc · automation\nViệc khó nhất\nsuy luận nhiều bước · code phức tạp · tài liệu dài · độ\ntin cậy cao\nViệc cần kiểm soát\ndữ liệu nhạy cảm · chi phí ở quy mô lớn\nTẦNG 1 — FRONTIER ĐÓNG\nFable 5 · GPT5.6 Sol · Opus 4.8\nđắt nhất — chỉ trả cho việc thật sự khó\nTẦNG 2 — RẺ MÀ MẠNH\nSonnet 4.6 · Terra · Gemini 3.1 Pro · Kimi K3 · Haiku ·\nFlash\ngiải quyết đa số việc hằng ngày\n★ MẶC ĐỊNH THỬ TẦNG NÀY TRƯỚC\nTẦNG 3 — SELF-HOST / SIÊU RẺ\nKimi K3 open-weight · DeepSeek · Qwen\nkhi cần kiểm soát dữ liệu hoặc chi phí quy mô lớn\nBắt đầu từ model đủ tốt và đủ rẻ — chỉ nâng tầng khi kết quả thực sự\nchặn use case\nAI IN ACTION - HACKATHON"}, {"page": 27, "full_text": "Token có giá: vé vào rẻ, vé ra đắt gấp 3–5 lần\nVÉ VÀO — INPUT\n1\nchữ BẠN gửi đi:\nprompt · system instruction ·\ncontext · lịch sử chat\nrẻ — model chỉ cần đọc\nVÉ RA — OUTPUT\n35\nchữ MODEL viết ra — nó phải\ntự sinh từng mảnh một, vừa\nchậm vừa tốn\nđắt — model phải “vắt ócˮ\nHÓA ĐƠN — 1 LẦN GỌI API\ninput  1.150 tok × $3 / 1M $0.00345\noutput   200 tok × $15 / 1M $0.00300\nTỔNG ≈ $0.0065\nsố liệu ví dụ — giá thật tùy model & nhà cung cấp\nĐọc mục usage trong mỗi response — đó là hóa đơn chi tiết\ngiúp bạn kiểm soát chi phí từ ngày đầu.\nInput tokens + Output tokens = Chi phí mỗi lần gọi — kiểm soát output là núm vặn lớn\nnhất\nAI IN ACTION - HACKATHON"}, {"page": 28, "full_text": "Giải phẫu một prompt: bốn lớp xếp chồng\nLỚP 1\nSystem\ninstruction\n“Lời dặn đầu caˮ: model là ai, cư xử thế\nnào, không được làm gì\n«Bạn là trợ lý y khoa, trả lời\nngắn gọn, không chẩn đoán…»\nLỚP 2\nUser input\nCâu hỏi / yêu cầu của người dùng trong\nlượt này\n «Tóm tắt báo cáo Q1 giúp mình»\nLỚP 3\nContext bổ\nsung\nTài liệu, lịch sử chat, dữ liệu tra sổ — phần\nbày lên “bàn làm việcˮ\n«[đính kèm: bao_cao_q1.pdf — 3\nđoạn liên quan]»\nLỚP 4\nOutput mong\nmuốn\nDạng kết quả: gạch đầu dòng? bảng?\nJSON? dài bao nhiêu?\n«3 bullet + 1 rủi ro chính, tiếng\nViệt»\n1 PROMPT  4 PHẦN\nViết rõ cả 4 lớp = đã làm tốt một nửa “prompt engineeringˮ — phần còn lại là các ngày sau\nAI IN ACTION - HACKATHON"}, {"page": 29, "full_text": "Hai núm vặn chọn từ: temperature & top_p\ntemperature — “núm vặn độ liềuˮ\nCùng một câu: “Một tách ___ˮ — bảng xác suất đổi theo T\nT  0\ncà phê trà mưa sao\nluôn chọn từ chắc nhất\n→ ổn định, lặp lại, hợp\ncode & phân tích\nT  1\ncà phê trà mưa sao\ncân bằng tự nhiên —\nvẫn ưu tiên từ hợp lý\nT  2\ncà phê trà mưa sao\nphân bố phẳng ra →\nđa dạng, “phiêuˮ, dễ\nlạc đề\ntop_p — “chỉ xem top đầu bảngˮ (p = 0.9\n① Bảng xác suất gốc\ncà phê trà mưa sao\ngiữ nhóm cộng dồn ≥ 90%\ncắt &\nchuẩn hóa lại\n→\n② Bảng mới\ncà phê trà mưa\n“saoˮ (đuôi dài xác suất thấp) bị loại khỏi lựa chọn — model chỉ còn chọn\ntrong nhóm đáng tin. Thường chỉ vặn một trong hai: temperature hoặc top_p.\nLưu ý quan trọng: hai núm này không làm model thông minh hơn — chỉ đổi\ncách chọn từ, không thêm tri thức.\nMặc định an toàn: temperature = 0 cho việc cần ổn định — chỉ tăng khi thật sự cần đa\ndạng\nAI IN ACTION - HACKATHON"}], "d2": [{"page": 1, "full_text": "AI IN ACTION · DAY 02\nXác định bài toán cho AI.\nTừ yêu cầu mơ hồ đến Problem Statement rõ ràng.\nAI IN ACTION - HACKATHON"}, {"page": 2, "full_text": "SÁNG\nKHUNG LÝ THUYẾT 4H\n· Problem Discovery Double Diamond, HCD\n· Problem Statement & định lượng hóa\n· PAIR ① AI có thêm giá trị?\n· PAIR ② Automate/Augment →\nRule/Workflow/Agent\n· PAIR ③ Reward function & success criteria\n· Khi AI sai & UX/HITL\n· PS hoàn chỉnh → Go/Not Yet/No-Go\nCHIỀU\nTHỰC HÀNH LAB 4H\n· Cá nhân: Tìm 5 bài toán & điền 3 Problem\nCards\n· Nhóm: Phản biện chéo, chốt 1 bài toán\n· Nhóm: Xác thực dữ liệu & vẽ quy trình\n· Nhóm: Xác định giải pháp & ra quyết định\n· Cá nhân: Viết nhật ký phản tư Reflection Log)\nBÀI NỘP\nCUỐI BUỔI\n· Nhật ký tìm và lọc bài toán Cá nhân)\n· Problem Statement hoàn chỉnh Nhóm\n· Nhật ký phản tư Cá nhân)\nAgenda\n— Mục tiêu: Biến yêu cầu mơ hồ thành Problem Statement rõ ràng để ra quyết định\nMỞ ĐẦU · AGENDA DAY 02 · 04 / 83\nAI IN ACTION - HACKATHON"}, {"page": 3, "full_text": "DIAMOND 1 — TÌM ĐÚNG VẤN ĐỀ\nDiscover: Mở rộng — khảo sát vấn đề căn bản.\nDefine: Thu hẹp — xác định đúng bài toán gốc.\nDIAMOND 2 — TÌM ĐÚNG GIẢI PHÁP\nDevelop: Mở rộng — nhiều giải pháp tiềm năng.\nDeliver: Thu hẹp — chọn và triển khai.\n\"Kỹ sư và doanh nhân được đào tạo để giải vấn đề. Nhà thiết kế được đào\ntạo để khám phá vấn đề thật.\"\nGiải pháp xuất sắc cho sai vấn đề có thể còn tệ hơn không có giải pháp.\nTìm đúng vấn đề trước khi tìm giải pháp\n— Mô hình Double Diamond — Don Norman / British Design Council 2005\nNGUỒN  Don Norman — jnd.org · Design Council — The Double Diamond\nBÀI TOÁN · DOUBLE DIAMOND DAY 02 · 16 / 83\nAI IN ACTION - HACKATHON"}, {"page": 4, "full_text": "DISCOVER · PHÂN KỲ\nKhám phá / mở rộng góc nhìn\n· Quan sát thực tế Observation)\n· Phỏng vấn người dùng User Interview)\n· Khảo sát Survey\n· Nhật ký hành vi Diary Study)\n· Phân tích dữ liệu / Nhật ký hệ thống\n· Bản đồ các bên liên quan Stakeholder Mapping)\nDEFINE · HỘI TỤ\nĐịnh nghĩa / chọn lọc dựa vào dữ liệu\n· Sơ đồ đồng cảm / Gom nhóm Affinity Mapping)\n· Kỹ thuật đặt câu hỏi 5 Whys\n· Ma trận Tác động – Nỗ lực Impact-Effort)\n· Biểu quyết bằng chấm tròn Dot Voting)\n· Câu hỏi mở hướng giải quyết How Might We)\n· Phát biểu bài toán Problem Statement)\nDiamond 1 — Tìm đúng vấn đề\n— Phân kỳ để thấu hiểu sâu sắc, hội tụ để lựa chọn chính xác\nBÀI TOÁN · DIAMOND 1 DAY 02 · 17 / 83\nAI IN ACTION - HACKATHON"}, {"page": 5, "full_text": "CURSOR\n\"Lệch năng lực cốt lõi\"\nTừ bỏ mảng AI thiết kế cơ khí CAD) để\ntập trung vào AI code editor — nơi đội\nngũ am hiểu sâu sắc quy trình nghiệp vụ.\nARTIFACT\n\"Sản phẩm tốt ≠ Thị trường lớn\"\nỨng dụng đọc tin tích hợp AI xuất sắc,\nnhưng quy mô thị trường quá hẹp để\nthương mại hóa thành công (đóng cửa\n1/2024.\nNOTEBOOKLM\n\"Định vị đúng điểm đau\"\nTập trung giải quyết nhu cầu hỏi đáp, tóm\ntắt trên tài liệu cá nhân và đối chiếu\nnguồn gốc bằng trích dẫn.\nKhởi nguồn từ bài toán, không bắt đầu từ AI\n— Ba bài học thực tế về am hiểu lĩnh vực, quy mô thị trường và định vị giải pháp\nLộ trình: Bài toán → Quy trình vận hành → Chỉ số đo lường → Giải pháp AI\nNGUỒN  Lenny's Podcast — The rise of Cursor · The Verge — Artifact · Google Blog — NotebookLM\nBÀI TOÁN · CASE STUDY DAY 02 · 22 / 83\nAI IN ACTION - HACKATHON"}, {"page": 6, "full_text": "REPETITIVE\nTác vụ lặp lại\nViệc diễn ra thường xuyên;\ncông đoạn nào cần chuẩn hóa\nđể hướng tới tự động hóa?\nTIME-CONSUMING\nTiêu tốn thời gian\nKhối lượng xử lý lớn; thời gian\nhao phí ở bước nào (tìm kiếm,\nđọc hiểu, chờ đợi, định dạng)?\nAI ADVANTAGE\nLợi thế của AI\nTác vụ đòi hỏi phân tích ngữ\ncảnh, xử lý ngôn ngữ tự nhiên,\ntổng hợp đa nguồn.\nUSER PAIN POINTS\nĐiểm đau người dùng\nAi đang gặp khó khăn, phàn\nnàn hoặc bị tắc nghẽn liên tục?\nTập trung nhận diện vấn đề; chưa vội đề xuất giải pháp.\nSàng lọc bài toán sẽ diễn ra vào buổi chiều.\nTìm bài toán AI ở đâu?\n— Bắt đầu từ việc quan sát các hoạt động thực tế xung quanh\nBÀI TOÁN · 4 LENSES DAY 02 · 23 / 83\nAI IN ACTION - HACKATHON"}, {"page": 7, "full_text": "Ưu tiên giải pháp Solution-first)\nXây dựng chatbot/agent trước khi làm rõ quy trình vận hành và điểm\nnghẽn thực tế.\nMơ hồ hiện trạng No baseline)\nKhông lượng hóa tổn thất hiện tại, dẫn đến mất căn cứ đánh giá hiệu\nquả cải tiến.\nBỏ qua đánh giá No evaluation)\nKhông thiết lập kịch bản kiểm thử, chỉ số đo lường hoặc phương án đối\nchứng.\nMập mờ ranh giới No boundary)\nKhông rõ phạm vi tự chủ của AI và thời điểm cần con người phê duyệt\nHuman-in-the-loop).\nNếu phát hiện mắc các sai lầm trên, hãy quay lại làm rõ Problem Statement trước khi chọn công nghệ.\nSai lầm thường gặp — Anti-patterns\n— Dấu hiệu cảnh báo bài toán chưa được định hình rõ hoặc giải pháp AI được lựa chọn quá sớm\nBÀI TOÁN · ANTI-PATTERNS DAY 02 · 24 / 83\nAI IN ACTION - HACKATHON"}, {"page": 8, "full_text": "PAIR · CHƯƠNG 1 — REFRAME CÂU HỎI\n\"Can we use AI to ______?\"\n↓  thay bằng hai câu hỏi:  ↓\n\"How might we\nsolve ______?\"\n\"Can AI solve this problem\nin a unique way?\"\nHỏi về bài toán trước, về AI sau — AI chỉ là một phương án trong nhiều phương án khả dĩ.\nCâu hỏi đúng quyết định bài toán bạn giải — và giải pháp bạn chọn.\nNGUỒN  Google PAIR  Ch.1 User Needs + Defining Success\nBÀI TOÁN · PAIR REFRAME DAY 02 · 26 / 83\nAI IN ACTION - HACKATHON"}, {"page": 9, "full_text": "Bài toán 1 câu  problem Vấn đề cụ thể cần giải quyết (không bao gồm giải pháp).\nĐối tượng ảnh hưởng  actor Cá nhân hoặc bộ phận chịu tác động trực tiếp từ vấn đề.\nQuy trình hiện tại  workflow Các bước vận hành thủ công hoặc tự động hiện tại (gồm 37 bước).\nNút thắt & Tác động  bottleneck + impact Khâu gây chậm trễ, sai sót hoặc lặp lại; hệ quả hay tổn thất cụ thể.\nChỉ số đo thành công  success metric Chỉ số định lượng cụ thể dùng để chứng minh hiệu quả cải tiến.\nĐịnh hướng giải pháp  direction No AI / Rule / Workflow / Agent / Chưa xác định.\nQuick Problem Card\n— Khung định hình bài toán\nPROBLEM STATEMENT · QUICK CARD DAY 02 · 28 / 83\nAI IN ACTION - HACKATHON"}, {"page": 10, "full_text": "01\nQuy trình hiện tại như thế nào?\nCông cụ, các bước, cơ chế bàn giao thông tin?\n02\nNút thắt nằm ở đâu?\nBước nào chậm, dễ sai sót, lặp lại?\n03\nHao phí hiện tại là bao nhiêu?\nThời gian, chi phí nhân sự, SLA, cơ hội bỏ lỡ?\n04\nTiêu chí thành công đo bằng gì?\nHiệu quả cải tiến định lượng cụ thể?\n05\nHậu quả khi xảy ra sai sót?\nPhạm vi tự quyết của AI; điểm cần con người phê duyệt?\n06\nCó giải pháp phi AI đơn giản hơn?\nQuy tắc, checklist, quy trình hay tài liệu hướng dẫn?\nCâu hỏi khai thác bài toán\n— Bộ câu hỏi định hình vấn đề dành cho các bên liên quan hoặc chính mình\nBỘ THẺ CÂU HỎI #3 — CẤU TRÚC PS\nPROBLEM STATEMENT · 6 CÂU HỎI DAY 02 · 30 / 83\nAI IN ACTION - HACKATHON"}, {"page": 11, "full_text": "01 · BASELINE\nHiện trạng / where we are\nMức hao phí hiện tại là bao nhiêu? Bằng con\nsố cụ thể.\n02 · TARGET\nMục tiêu / where to go\nKỳ vọng cải thiện ở mức độ nào? Ngưỡng cụ\nthể là gì?\n03 · MEASUREMENT\nĐo lường / how we know\nChỉ số nào chứng minh tính hiệu quả? Cách\nthu thập?\nVÍ DỤ\nTHỜI GIAN HOÀN THÀNH\nRút ngắn từ 90 phút xuống dưới 30 phút.\nCHẤT LƯỢNG CÔNG VIỆC\nGiảm tỷ lệ lỗi phân loại từ 20% xuống dưới\n5%.\nTẢI TRỌNG VẬN HÀNH\nCắt giảm 40% câu hỏi trùng lặp cần Trợ\ngiảng xử lý.\nĐịnh lượng hóa bài toán\n— Điểm đau chưa được định lượng thì không thể xác định giá trị thực tế của AI\nPROBLEM STATEMENT · ĐỊNH LƯỢNG DAY 02 · 31 / 83\nAI IN ACTION - HACKATHON"}, {"page": 12, "full_text": "OUTPUT METRIC\nKết quả cuối cùng / what we optimize\n· Thời lượng hoàn tất quy trình giảm bao nhiêu?\n· Tỷ lệ sai sót / chất lượng đầu ra thay đổi thế nào?\n· Giá trị thực tế người dùng nhận được rõ nét hơn?\nINPUT METRICS\nCác đòn bẩy / what we can move\n· Tỷ lệ câu hỏi được phân loại chính xác.\n· Tỷ lệ yêu cầu được chuyển tiếp hỗ trợ kịp thời.\n· Thời gian Trợ giảng hiệu chỉnh bản nháp phản hồi.tăng cái này\n→ đo cái kia\nThiết lập chỉ số: Output & Input\n— Chỉ số đo lường cần phản ánh kết quả cuối và các đòn bẩy có thể tác động\n\"Nâng cao hiệu suất\" không phải chỉ số — cần gắn với hiện trạng, mục tiêu và phương pháp đo.\nNGUỒN  Amplitude — North Star Playbook · Lenny Rachitsky — Choosing Your North Star Metric\nPROBLEM STATEMENT · METRICS DAY 02 · 32 / 83\nAI IN ACTION - HACKATHON"}, {"page": 13, "full_text": "BƯỚC ①\nGiao điểm: nhu cầu × thế mạnh\nAI\nBài toán của bạn có nằm trong nhóm việc\nAI làm tốt hơn hẳn rule/heuristic không?\nVD: câu hỏi trùng lặp của 1000 học viên K3 &\nK4 có nằm trong thế mạnh của AI?\n→ trả lời câu hỏi 1: có thực sự cần AI?\nBƯỚC ②\nAutomate hay Augment?\nAI thay thế hay hỗ trợ con người? Mức tự\nđộng hóa tăng dần theo độ tin cậy và rủi\nro.\nVD AI trả lời thay TA luôn, hay chỉ soạn nháp để\nTA duyệt?\n→ trả lời câu hỏi 2: giải pháp ở cấp độ nào?\nBƯỚC ③\nReward function & tiêu chí\nthành công\nĐịnh nghĩa \"đúng/sai\" của hệ thống\n(precision ↔ recall) và ngưỡng thành\ncông đo được.\nVD: đo bằng gì — thời gian phản hồi? tỷ lệ định\nhướng sai?\n→ trả lời câu hỏi 3 PS đã đủ rõ để đo?\nÁnh xạ về 4 câu hỏi trọng tâm của ngày: ① Có cần AI?  ·  ② Cấp độ nào?  ·  ③ Đủ rõ để đo?  ·  Tổng hợp ①②③ → ④ Go / Not Yet / No-Go\nBa bước quyết định AI theo PAIR\n— Google People + AI Guidebook · Chương 1 User Needs + Defining Success\nĐi hết 3 bước này, bạn trả lời được cả 4 câu hỏi của ngày hôm nay — từ \"có thực sự cần AI?\" đến \"Go, Not Yet hay No-\nGo\".\nNGUỒN  Google PAIR  People + AI Guidebook · PAIR  Ch.1 User Needs + Defining Success\nCÓ NÊN ỨNG DỤNG AI · PAIR 3 BƯỚC DAY 02 · 35 / 83\nAI IN ACTION - HACKATHON"}, {"page": 14, "full_text": "Gợi ý theo từng người · recommendation\nMỗi người dùng nhận một nội dung gợi ý khác nhau.\nDự đoán tương lai · prediction\nĐoán trước sự kiện sắp xảy ra để chuẩn bị phản ứng.\nCá nhân hóa · personalization\nTrải nghiệm tự điều chỉnh theo từng người, ngày càng hợp hơn.\nHiểu ngôn ngữ tự nhiên · natural language\nHiểu câu hỏi viết tự do bằng lời nói hằng ngày.\nNhận diện cả một lớp thực thể\nNhận ra mọi đối tượng cùng loại — VD mọi khuôn mặt.\nPhát hiện cái hiếm & biến đổi\nBắt sự kiện hiếm, thay đổi theo thời gian — VD gian lận.\nAgent/bot cho một lĩnh vực cụ thể\nTrợ lý ảo xử lý trọn một phạm vi việc chuyên biệt.\nNội dung động thay giao diện tĩnh\nNội dung linh hoạt hiệu quả hơn layout cố định, dễ đoán.\nKhi nào AI có lợi thế?\n— Tám trường hợp PAIR gọi là \"AI probably better\" · Chương 1\nPAIR ① ② ③\nAI chỉ đáng làm khi bài toán nằm trong nhóm này.\nNGUỒN  PAIR  Ch.1 User Needs + Defining Success\nCÓ NÊN ỨNG DỤNG AI · AI PROBABLY BETTER DAY 02 · 36 / 83\nAI IN ACTION - HACKATHON"}, {"page": 15, "full_text": "Cần duy trì tính dự đoán được\nNút Home / Cancel phải luôn nằm ở một chỗ quen thuộc — người dùng\nkhông phải đoán mỗi lần.\nThông tin tĩnh, ít thay đổi\nNội dung cố định thì cứ hiển thị trực tiếp — không cần AI sinh lại mỗi lần.\nLỗi quá tốn kém\nChi phí của một lần sai lớn hơn lợi ích của nhiều lần đúng.\nYêu cầu minh bạch tuyệt đối\nMọi quyết định phải giải thích được từng bước, truy vết được.\nTối ưu tốc độ & chi phí thấp\nCần ra thị trường nhanh (time-to-market), vận hành rẻ — AI chỉ thêm độ trễ\nvà chi phí.\nViệc giá trị cao người dùng muốn tự làm\nTác vụ mang ý nghĩa cá nhân mà người dùng KHÔNG muốn bị tự động hóa.\nKhi nào AI KHÔNG tốt hơn?\n— Sáu trường hợp PAIR gọi là \"AI probably NOT better\" · Chương 1\nPAIR ① ② ③\nRule/heuristic dễ build, dễ giải thích, dễ debug và bảo trì hơn — nếu nó giải quyết được, đó là lựa chọn tối ưu.\nNGUỒN  PAIR  Ch.1 User Needs + Defining Success\nCÓ NÊN ỨNG DỤNG AI · KHI NÀO KHÔNG CẦN AI DAY 02 · 37 / 83\nAI IN ACTION - HACKATHON"}, {"page": 16, "full_text": "MODEL\nTư duy & Sáng tạo\nXử lý đọc hiểu, soạn thảo, tổng hợp, phân loại và đưa ra gợi ý.\nCONTEXT\nTri thức chuyên biệt\nCơ sở dữ liệu, tài liệu nghiệp vụ, hồ sơ lịch sử giúp AI phản hồi chính xác theo\nbối cảnh.\nPLANNING\nĐiều phối quy trình\nTự động phân rã tác vụ phức tạp và linh hoạt điều chỉnh.\nTOOLS\nLiên kết hệ thống\nTích hợp CRM, database, lịch làm việc hoặc API bên thứ ba.\nHệ thống AI = Model + Context + Planning + Tools\n— Một giải pháp AI thực tế là một hệ thống nhiều thành phần, không chỉ dừng lại ở mô hình ngôn ngữ\nGiải pháp AI là một HỆ THỐNG — model chỉ là một thành phần.\nNGUỒN  Anthropic — Building effective agents · Chip Huyen — AI Engineering\nHỆ THỐNG AI · KIẾN TRÚC DAY 02 · 42 / 83\nAI IN ACTION - HACKATHON"}, {"page": 17, "full_text": "AUTOMATE\nAI làm thay\nChọn khi:\n· Việc khó, nhàm chán, nguy hiểm hoặc cần scale\n· Người dùng thiếu kiến thức / khả năng tự làm\n· Có \"đáp án đúng\" mà mọi người cùng đồng thuận\nĐo thành công bằng: hiệu quả tăng · an toàn hơn · giảm việc tẻ nhạt.\nquyết định theo\ntừng tác vụ\nAUGMENT\nAI hỗ trợ con người\nChọn khi:\n· Người dùng thích tự làm việc đó\n· Stakes cao: tiền bạc, pháp lý, sức khỏe\n· Kết quả cần trách nhiệm cá nhân / social capital\n· Sở thích khó diễn đạt thành lời\nĐo bằng: mức độ thích thú · cảm giác kiểm soát · sáng tạo tăng.\nAutomation vs Augmentation\n— Bước ② của PAIR: với từng tác vụ, AI nên làm thay hay hỗ trợ con người?\n① ② ③\nViệc đã automate vẫn gần như luôn cần human oversight — preview, edit, undo.\nNGUỒN  Google PAIR  Ch.1 User Needs + Defining Success\nRWA · AUTOMATE VS AUGMENT DAY 02 · 43 / 83\nAI IN ACTION - HACKATHON"}, {"page": 18, "full_text": "CẤP ĐỘ 1\nRule / Script\n· Đầu vào ổn định, ít thay đổi\n· Logic viết được thành if/else\n· Cần kết quả luôn đúng 100%\n· Quy định pháp lý / tuân thủ chặt\nVí dụ: Tính thuế · chặn email spam theo từ khóa ·\nauto-reply theo template.\nCẤP ĐỘ 2\nLLM Feature / Workflow\n· Đầu vào đa dạng, không viết hết rule được\n· Đầu ra cần linh hoạt (tóm tắt, dịch, phân\nloại)\n· Có cách đo chất lượng\n· Người có thể kiểm tra trước khi gửi\nVí dụ: Tóm tắt email · chatbot FAQ · phân loại\nticket hỗ trợ.\nCẤP ĐỘ 3\nAgent\n· Nhiều bước, dùng nhiều công cụ\n· Tình huống thay đổi liên tục\n· Cần tự ra quyết định giữa các bước\n· Có kiểm soát rủi ro rõ ràng\nVí dụ: Agent nghiên cứu thị trường · coding agent\nsửa nhiều file.\nThứ tự ưu tiên thực dụng: bắt đầu từ bên trái, chỉ đi sang bên phải khi giá trị tăng hơn độ phức tạp.\nBa mức giải pháp: Rule / Workflow / Agent\n— Rule/Workflow/Agent là cấp độ KỸ THUẬT — còn Automate/Augment PAIR) là cấp độ VAI TRÒ của con người trong hệ thống\nRWA · TỔNG QUAN DAY 02 · 45 / 83\nAI IN ACTION - HACKATHON"}, {"page": 19, "full_text": "CẤP ĐỘ 1 — RULE (LUẬT TĨNH)\nTrả lời tự động\n· Tự động trả lời FAQ, gửi link thời khóa biểu\n· Gửi tài liệu sửa lỗi cài đặt cơ bản\n· Nhắc nhở checklist nộp bài\nKhi nào? Logic tường minh, kết quả cố định.\nCẤP ĐỘ 2 — WORKFLOW (QUY TRÌNH)\nDuyệt Problem Card\n· AI kiểm tra độ đầy đủ của Problem Card\n· Yêu cầu bổ sung nếu thiếu thông tin\n· Chuyển cho Trợ giảng giải quyết\nKhi nào? Có quy trình rõ, AI hỗ trợ từng bước.\nCẤP ĐỘ 3 — AGENT (TÁC NHÂN)\nĐề xuất can thiệp chủ động\n· Tự động theo dõi tiến độ nộp bài\n· Phát hiện nhóm học viên bị kẹt lâu\n· Chuẩn bị câu trả lời, đề xuất TA duyệt\nKhi nào? Tình huống động, đa công cụ.\nKhông bắt buộc nâng cấp tuần tự từ Rule lên Agent → dừng ở cấp tối giản nhất nếu đã đáp ứng mục tiêu đề ra.\nMột tình huống, ba cấp độ giải pháp\n— Ưu tiên giải pháp đơn giản nhất có thể giải quyết bài toán và mang lại cải tiến đo lường được\nRWA · SO SÁNH DAY 02 · 50 / 83\nAI IN ACTION - HACKATHON"}, {"page": 20, "full_text": "1. Prompt Chaining\nIn → LLM Call 1→ Gate → LLM Call 2→ LLM Call 3→ Out\n┖  - - Gate fail → Exit\nChia task thành chuỗi bước tuần tự, có gate kiểm tra giữa các bước. VD Viết outline\n→ check → viết bài.\nÝ nghĩa quyết định: đổi độ trễ lấy độ chính xác.\n2. Routing\nIn → Router →\nLLM Call 1\nLLM Call 2\nLLM Call 3\n→ Out\n \nPhân loại input → đưa vào nhánh chuyên biệt, tối ưu từng loại riêng. VD CS query →\nFAQ / refund / kỹ thuật.\nÝ nghĩa quyết định: câu dễ đi model rẻ, câu khó đi model mạnh.\n3. Parallelization\nIn →\nLLM Call 1\nLLM Call 2\nLLM Call 3\n→ Aggregator → Out\n \nChạy song song rồi tổng hợp (sectioning), hoặc chạy nhiều lần lấy vote. VD\nGuardrail + response đồng thời.\nÝ nghĩa quyết định: vote để giảm rủi ro một đầu ra sai.\nNGUYÊN TẮC ANTHROPIC\n→ Luôn ưu tiên giải pháp đơn giản nhất; chỉ tăng độ phức tạp khi\nthực sự cần thiết.\n3 mô hình cơ bản bên cạnh đã đủ đáp ứng hầu hết bài toán thực\ntế.\nWorkflow patterns — đủ cho hầu hết bài toán\n— Ba mô hình cơ bản theo Anthropic · Building Effective Agents 2024\nNGUỒN  Anthropic — Building effective agents\nWORKFLOW PATTERNS · BASIC DAY 02 · 52 / 83\nAI IN ACTION - HACKATHON"}, {"page": 21, "full_text": "Cây quyết định: Lựa chọn cấp độ giải pháp\n— Từ bài toán cốt lõi đến lựa chọn Rule, Workflow hay Agent\nĐi từ trên xuống — mỗi nhánh \"KHÔNG\" là một lần tránh được độ phức tạp không cần thiết.\nNGUỒN  Anthropic — Building effective agents · Google — Rules of ML\nWORKFLOW · DECISION TREE DAY 02 · 55 / 83\nAI IN ACTION - HACKATHON"}, {"page": 22, "full_text": "Reward function là công thức quyết định đâu là dự đoán \"đúng\", đâu là \"sai\" — và chính nó định hình trải nghiệm người dùng cuối. Vì vậy\nnó phải được thiết kế liên chức năng: tối thiểu UX  Product × Engineering cùng ngồi lại.\nBỐN KẾT QUẢ CÓ THỂ XẢY RA — CASE AI GỢI Ý CÂU TRẢ LỜI\nTP — TRUE POSITIVE · ĐÚNG-TÍCH CỰC\nCâu hỏi nghẽn thật → AI gợi ý đúng câu trả lời. Học viên được giải tỏa,\nTA đỡ tải.\nTN — TRUE NEGATIVE · ĐÚNG-TIÊU CỰC\nCâu hỏi đã có tài liệu sẵn → AI không can thiệp. Đúng — không cần\ngợi ý gì thêm.\nFP — FALSE POSITIVE · BÁO ĐỘNG GIẢ\nAI gợi ý câu trả lời SAI (hallucination) và gửi thẳng cho học viên → học\nviên đi sai hướng thực hành.\nFN — FALSE NEGATIVE · BỎ SÓT\nHọc viên đang kẹt thật nhưng AI bỏ sót, không gợi ý → học viên vẫn\nchờ lâu như cũ.\nReward function: hệ thống hiểu \"đúng / sai\" thế nào?\n— PAIR Bước ③ · Case: AI gợi ý câu trả lời cho câu hỏi của 1000 học viên (khóa K3 & K4\n① Nhu cầu ② Auto / Augment ③ Reward function\nChi phí của FP và FN KHÔNG đối xứng — báo cháy giả ≠ bỏ sót đám cháy. Cân nhắc đánh đổi này là quyết định then chốt khi\nthiết kế reward function.\nNGUỒN  PAIR  Ch.1 User Needs + Defining Success\nREWARD · HÀM THƯỞNG DAY 02 · 57 / 83\nAI IN ACTION - HACKATHON"}, {"page": 23, "full_text": "PRECISION CAO\nTP / (TP + FP)\nÍt gợi ý — nhưng gợi ý nào cũng chắc đúng. Người dùng\ntin vào từng gợi ý nhận được.\nHỆ QUẢ\nNhiều False Negative — bỏ sót học viên đang thực sự cần\ngiúp.\n⇄\nĐÒN BẨY\nVặn nút bên này\nlên, chất lượng\nbên kia xấu đi.\nRECALL CAO\nTP / (TP + FN)\nBao trọn mọi trường hợp cần giúp — không học viên\nnào bị bỏ lại phía sau.\nHỆ QUẢ\nNhiều False Positive — gợi ý sai nhiều, TA phải lọc lại thủ\ncông.\nPrecision ↔ Recall: đánh đổi không tránh khỏi\n— Cùng một hệ thống AI, hai hướng vặn nút ngược nhau\n① Nhu cầu ② Auto / Augment ③ Reward function\nKhông có cấu hình đúng tuyệt đối — phải test điểm cân bằng với chính người dùng.\nNGUỒN  PAIR  Ch.1 User Needs + Defining Success\nREWARD · PRECISION ↔ RECALL DAY 02 · 58 / 83\nAI IN ACTION - HACKATHON"}, {"page": 24, "full_text": "TEMPLATE CỦA PAIR\nIf {chỉ số cụ thể} for {tính năng AI} {drops below / goes above} {ngưỡng có nghĩa}, we will\n{hành động cụ thể}.\nVÍ DỤ ĐIỀN SẴN — CASE TA 1000 HỌC VIÊN\nNếu tỷ lệ câu trả lời AI gợi ý bị TA sửa > 30% trong 2 tuần, ta sẽ hạ mức tự động về pha 1 (chỉ gợi ý, không gửi thẳng cho học viên).\nCHECKLIST TRƯỚC KHI CHỐT METRIC\n01\nMetric có ý nghĩa với MỌI người dùng\nkhông?\n02\nCó nhóm nào bị ảnh hưởng tiêu cực\nkhông?\n03\nĐây là thành công của ngày 1 — còn\nngày 1000 thì sao?\n→ Và đừng quên: lên lịch review metric định kỳ — tiêu chí thành công cũng cần được bảo trì theo thời gian.\nViết tiêu chí thành công mà hành động được\n— PAIR Bước ③ · Metric tốt = chỉ số cụ thể + ngưỡng có nghĩa + hành động cụ thể\n① Nhu cầu ② Auto / Augment ③ Reward function\nNGUỒN  PAIR  Ch.1 User Needs + Defining Success · PAIR Worksheet — User Needs PDF\nREWARD · SUCCESS CRITERIA DAY 02 · 59 / 83\nAI IN ACTION - HACKATHON"}, {"page": 25, "full_text": "01 · BASELINE\nThiết lập đối chứng\nĐối chiếu hiệu quả với quy tắc\ntĩnh, nhân sự hay quy trình hiện\ntại?\n02 · EVALUATION\nKiểm thử hệ thống\nBộ dữ liệu kiểm thử, kịch bản\nbiên (edge cases) và tiêu chí\nnghiệm thu?\n03 · CONTROLS\nCơ chế kiểm soát\nLogging, fallback, rollback và\nnhân sự chịu trách nhiệm?\n04 · OPERATIONS\nVận hành liên tục\nAi giám sát lỗi, cập nhật tri thức\nnền và tối ưu hệ thống?\nKhoảng cách giữa Demo và Production\n— Phản hồi chính xác trong vài lần thử chưa đủ cơ sở để triển khai hệ thống thực tế\nMục tiêu Day 02 là xác định tính khả thi để tiếp tục nghiên cứu — chưa phải quyết định triển khai ngay.\nNGUỒN  Google — Rules of ML · Chip Huyen — AI Engineering\nQUYẾT ĐỊNH AI · DEMO TO PRODUCTION DAY 02 · 61 / 83\nAI IN ACTION - HACKATHON"}, {"page": 26, "full_text": "01 · INPUT\nProblem Statement\n9 trường đã hoàn chỉnh — từ Actor,\nWorkflow, Bottleneck đến Boundary & HITL.\n02 · TEST CASES\nKịch bản kiểm thử\nDữ liệu thực tế và các trường hợp biên (edge\ncases).\n03 · SUCCESS\nChỉ số hiệu năng\nĐạt yêu cầu (pass) / Không đạt (fail) /\nChuyển tiếp kiểm duyệt thủ công HITL.\nTÁC VỤ ĐƠN LẺ\nHệ thống có phân loại chính xác các\ncâu hỏi đầu vào không?\nHIỆU NĂNG QUY TRÌNH\nNhóm học viên có hoàn thành bài lab\nnhanh hơn và ít kẹt hơn không?\nRỦI RO & SAI SỐ\nHệ thống có phản hồi sai lệch mà\nkhông chuyển tiếp cho Lab Coach phê\nduyệt không?\nTừ Problem Statement đến Eval Plan\n— Problem Statement rõ ràng giúp định hình cụ thể các tiêu chí kiểm thử\nPROBLEM STATEMENT · EVAL PLAN DAY 02 · 62 / 83\nAI IN ACTION - HACKATHON"}, {"page": 27, "full_text": "6 YẾU TỐ BÀI TOÁN CỐT LÕI\nActor đối tượng ảnh hưởng Đối tượng trực tiếp chịu ảnh hưởng bởi vấn đề.\nWorkflow quy trình hiện tại Quy trình vận hành hiện tại gồm các bước cụ thể nào?\nBottleneck nút thắt Khâu nào gặp tình trạng chậm trễ, sai sót, lặp lại?\nImpact tác động Tổn thất lượng hóa bằng thời gian, chi phí, SLA hoặc chất lượng.\nSuccess Metric chỉ số thành công Chỉ số đo lường cụ thể để xác định sự cải thiện.\nBoundary ranh giới AI không được làm gì; khâu nào bắt buộc có con người.\n3 YẾU TỐ QUYẾT ĐỊNH AI\nĐiểm AI can thiệp decision · entry AI hỗ trợ hoặc tự động hóa ở bước cụ thể nào?\nMức chọn decision · level Rule / Workflow / Agent?\nRủi ro & HITL decision · safety Phương án xử lý khi AI sai sót và quy trình phê duyệt thủ công.\nProblem Statement cho hệ thống AI\n— 6 yếu tố bài toán cốt lõi và 3 yếu tố quyết định AI\nPROBLEM STATEMENT · 9 TRƯỜNG DAY 02 · 67 / 83\nAI IN ACTION - HACKATHON"}, {"page": 28, "full_text": "✓ Go\nthực hiện\nĐỦ ĐIỀU KIỆN\n— Bài toán rõ ràng\n— Chỉ số đo lường khả thi\n— Điểm can thiệp AI phù hợp\n— Kiểm soát được rủi ro\n⏸  Not Yet\ntạm hoãn\nCÓ TRIỂN VỌNG\n— Cần bổ sung dữ liệu thực tế\n— Chuẩn hóa quy trình\n— Thiết lập chỉ số\n— Xác định ranh giới\n✕  No-Go\nkhông triển khai\nKHÔNG PHÙ HỢP\n— AI không mang giá trị vượt trội\n— Rủi ro vận hành quá cao\n— Giải pháp không dùng AI tối ưu hơn\nKhung ra quyết định: Go / Not Yet / No-Go\n— Lập luận dựa trên tính khả thi của Problem Statement, tránh thiên kiến công nghệ\nQuyết định \"Not Yet\" thể hiện sự chín chắn trong tư duy thiết kế sản phẩm, không phải sự thất bại.\nQUYẾT ĐỊNH · GO / NOT YET / NO-GO DAY 02 · 70 / 83\nAI IN ACTION - HACKATHON"}, {"page": 29, "full_text": "01 Brief mơ hồ không thay thế Problem Statement.\nMột bản tóm tắt mơ hồ không thể thay thế cho một Problem Statement hoàn chỉnh.\n02 Mô hình hóa workflow trước khi tích hợp AI.\nBắt buộc phải mô hình hóa quy trình trước khi xem xét tích hợp giải pháp AI.\n03 Pain point phải được lượng hóa.\nMọi điểm đau cần được lượng hóa bằng baseline và chỉ số đo lường cụ thể.\n04 Phức tạp không đồng nghĩa với hiệu quả.\nRule, Workflow và Agent là ba cấp độ khác nhau; độ phức tạp kỹ thuật không đồng nghĩa với hiệu quả tối ưu.\n05 Quyết định dựa trên lập luận thực tế.\nQuyết định Go / Not Yet / No-Go phải được thiết lập dựa trên lập luận thực tế và số liệu kiểm thử rõ ràng.\n06 Đo reward function bằng trải nghiệm người dùng, không chỉ accuracy. MỚI · PAIR\nThiết kế đánh đổi precision ↔ recall theo lợi ích người dùng và kiểm chứng với người dùng thật.\nSáu nguyên tắc cốt lõi sau Day 02\n— Kim chỉ nam để thẩm định mọi đề xuất ứng dụng AI\nNGUỒN  PAIR  Ch.1 User Needs + Defining Success\nRECAP · 6 NGUYÊN TẮC DAY 02 · 78 / 83\nAI IN ACTION - HACKATHON"}]};
/**
 * VLEARN AI TUTOR - DARK SLIDE VIEWER INTERACTIVE CONTROLLER
 * All Buttons & Controls 100% Clickable & Functional
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let currentSlide = 1;
    let totalSlides = 83;
    let currentDocFile = 'day01_302.pdf';
    let currentZoom = 100;
    let isDarkMode = true;

    // --- DOM ELEMENTS ---
    const themeBtn = document.getElementById('theme-btn');
    const langBtn = document.getElementById('lang-btn');
    const navBackBtn = document.getElementById('nav-back-btn');
    
    const currentDocName = document.getElementById('current-doc-name');
    const currentDocMeta = document.getElementById('current-doc-meta');
    
    const slidePageText = document.getElementById('slide-page-text');
    const slideFileText = document.getElementById('slide-file-text');
    const footPageText = document.getElementById('foot-page-text');
    const drawerContextText = document.getElementById('drawer-context-text');
    const noteCounterPill = document.getElementById('note-counter-pill');

    const slideMainH1 = document.getElementById('slide-main-h1');
    const slideSubP = document.getElementById('slide-sub-p');
    const slideInstructorText = document.getElementById('slide-instructor-text');

    // Navigation Buttons
    const sidePrevBtn = document.getElementById('side-prev-btn');
    const sideNextBtn = document.getElementById('side-next-btn');
    const footPrevBtn = document.getElementById('foot-prev-btn');
    const footNextBtn = document.getElementById('foot-next-btn');

    // Zoom Controls
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomValueText = document.getElementById('zoom-value-text');
    const slideInnerSage = document.querySelector('.slide-inner-sage');

    // Tool Buttons
    const toolRead = document.getElementById('tool-read');
    const toolPen = document.getElementById('tool-pen');
    const toolHighlight = document.getElementById('tool-highlight');
    const toolMore = document.getElementById('tool-more');

    // Action Icon Buttons
    const btnAddNote = document.getElementById('btn-add-note');
    const btnCollapseStage = document.getElementById('btn-collapse-stage');
    const btnDownloadPdf = document.getElementById('btn-download-pdf');
    const btnBookmark = document.getElementById('btn-bookmark');
    const btnUndo = document.getElementById('btn-undo');
    const btnDelete = document.getElementById('btn-delete');

    // Sidebar Elements & Controls
    const sidebarLeft = document.getElementById('sidebar-left');
    const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
    const sidebarExpandBtn = document.getElementById('sidebar-expand-btn');
    const appLayout = document.querySelector('.app-layout');

    // Robot Drawer Controls
    const robotToggleBtn = document.getElementById('robot-toggle-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const tutorDrawer = document.getElementById('tutor-drawer');

    // Chatbot Controls
    const drawerUserInput = document.getElementById('drawer-user-input');
    const drawerSendBtn = document.getElementById('drawer-send-btn');
    const drawerChatMessages = document.getElementById('drawer-chat-messages');

    // Accordion Groups & Document Cards
    const accordionItems = document.querySelectorAll('.accordion-item');
    const docCards = document.querySelectorAll('.doc-card');

    // ==========================================================================
    // 0. SIDEBAR COLLAPSE & EXPAND TOGGLE
    // ==========================================================================
    if (sidebarCollapseBtn && sidebarLeft) {
        sidebarCollapseBtn.addEventListener('click', () => {
            sidebarLeft.classList.add('collapsed');
            if (appLayout) appLayout.classList.add('sidebar-collapsed');
            if (sidebarExpandBtn) sidebarExpandBtn.classList.remove('hidden');
        });
    }

    if (sidebarExpandBtn && sidebarLeft) {
        sidebarExpandBtn.addEventListener('click', () => {
            sidebarLeft.classList.remove('collapsed');
            if (appLayout) appLayout.classList.remove('sidebar-collapsed');
            if (sidebarExpandBtn) sidebarExpandBtn.classList.add('hidden');
        });
    }

    // ==========================================================================
    // 1. ACCORDION EXPAND / COLLAPSE
    // ==========================================================================
    accordionItems.forEach(item => {
        const btn = item.querySelector('.accordion-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                item.classList.toggle('expanded');
            });
        }
    });

    // ==========================================================================
    // 2. DOCUMENT SWITCHING & STUDYING BADGE POSITIONING
    // ==========================================================================
    function updateStudyingBadge(activeCard) {
        const existingBadge = document.querySelector('.badge-studying');
        if (existingBadge) existingBadge.remove();

        const parentAcc = activeCard.closest('.accordion-item');
        if (parentAcc) {
            const accRight = parentAcc.querySelector('.acc-right');
            if (accRight) {
                const badge = document.createElement('span');
                badge.className = 'badge-studying';
                badge.textContent = 'STUDYING';
                
                const arrow = accRight.querySelector('.acc-arrow');
                if (arrow) {
                    accRight.insertBefore(badge, arrow);
                } else {
                    accRight.appendChild(badge);
                }
            }
        }
    }

    docCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            docCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Ensure checkmark icon is added to this card
            if (!card.querySelector('.check-circle')) {
                const checkDiv = document.createElement('div');
                checkDiv.className = 'check-circle';
                checkDiv.textContent = '✓';
                card.appendChild(checkDiv);
            }

            const fileName = card.getAttribute('data-file') || 'd1-slide-hackathon.pdf';
            currentDocFile = fileName;
            if (currentDocName) currentDocName.textContent = fileName;
            if (slideFileText) slideFileText.textContent = fileName;

            totalSlides = 29;
            if (fileName.includes('d1')) {
                if (currentDocMeta) currentDocMeta.textContent = 'COMP2010 · AI & LLM Foundation (Day 1)';
            } else {
                if (currentDocMeta) currentDocMeta.textContent = 'COMP2010 · AI Agents & Multi-Agent (Day 2)';
            }

            // Move the STUDYING badge to the active Day module header!
            updateStudyingBadge(card);

            updateSlidePage(1);
        });
    });

    // ==========================================================================
    // 3. REAL VISUAL PDF SLIDE CANVAS RENDERER
    // ==========================================================================
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    let pdfDocD1 = null;
    let pdfDocD2 = null;

    async function initPDFDocs() {
        if (typeof pdfjsLib === 'undefined') return;
        try {
            if (window.PDF_D1_BASE64) {
                const raw1 = atob(window.PDF_D1_BASE64);
                const u1 = new Uint8Array(raw1.length);
                for (let i = 0; i < raw1.length; i++) u1[i] = raw1.charCodeAt(i);
                pdfDocD1 = await pdfjsLib.getDocument({ data: u1 }).promise;
            }
            if (window.PDF_D2_BASE64) {
                const raw2 = atob(window.PDF_D2_BASE64);
                const u2 = new Uint8Array(raw2.length);
                for (let i = 0; i < raw2.length; i++) u2[i] = raw2.charCodeAt(i);
                pdfDocD2 = await pdfjsLib.getDocument({ data: u2 }).promise;
            }
            updateSlidePage(currentSlide);
        } catch (e) {
            console.log("PDF.js Base64 parsing:", e);
        }
    }
    initPDFDocs();

    async function renderPDFVisualPage(pageNum) {
        const dayKey = (currentDocFile.includes('d2') || currentDocFile.includes('material')) ? 'd2' : 'd1';
        const pdfDoc = (dayKey === 'd2') ? pdfDocD2 : pdfDocD1;
        const canvas = document.getElementById('pdf-render-canvas');

        if (!pdfDoc || !canvas) return false;

        try {
            const page = await pdfDoc.getPage(pageNum);
            const ctx = canvas.getContext('2d');

            const slideOuterBox = document.querySelector('.slide-outer-box');
            const targetWidth = slideOuterBox ? (slideOuterBox.clientWidth - 28) : 730;

            const viewportUnscaled = page.getViewport({ scale: 1.0 });
            const scale = targetWidth / viewportUnscaled.width;
            const viewport = page.getViewport({ scale: scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            await page.render(renderContext).promise;
            return true;
        } catch (err) {
            console.log("PDF page render error:", err);
            return false;
        }
    }

    function updateSlidePage(pageNum) {
        const dayKey = (currentDocFile.includes('d2') || currentDocFile.includes('material')) ? 'd2' : 'd1';
        totalSlides = 29;

        if (pageNum < 1) pageNum = 1;
        if (pageNum > totalSlides) pageNum = totalSlides;
        currentSlide = pageNum;

        const pageLabel = `Trang ${currentSlide} / ${totalSlides}`;
        if (slidePageText) slidePageText.textContent = pageLabel;
        if (footPageText) footPageText.textContent = pageLabel;
        if (drawerContextText) drawerContextText.textContent = `Ngữ cảnh: Slide trang ${currentSlide}`;
        updateNoteCounterPill();

        // Render PDF visual slide directly on canvas
        renderPDFVisualPage(currentSlide);
    }

    if (footPrevBtn) footPrevBtn.addEventListener('click', () => updateSlidePage(currentSlide - 1));
    if (footNextBtn) footNextBtn.addEventListener('click', () => updateSlidePage(currentSlide + 1));

    // Keyboard Arrow Key Navigation
    document.addEventListener('keydown', (e) => {
        if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
        if (e.key === 'ArrowLeft') {
            updateSlidePage(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
            updateSlidePage(currentSlide + 1);
        }
    });

    // ==========================================================================
    // 4. FLOATING TOOLBAR MODE SWITCHING
    // ==========================================================================
    const toolPills = [toolRead, toolMore];
    toolPills.forEach(pill => {
        if (pill) {
            pill.addEventListener('click', () => {
                toolPills.forEach(p => p && p.classList.remove('active'));
                pill.classList.add('active');
            });
        }
    });

    // ==========================================================================
    // 5. ZOOM CONTROLS (Scaling Entire Slide Frame & Content Together)
    // ==========================================================================
    function applyZoom(zoomLevel) {
        currentZoom = zoomLevel;
        if (zoomValueText) zoomValueText.textContent = `${currentZoom}%`;
        
        const slideStack = document.querySelector('.slide-stack');
        if (slideStack) {
            const ratio = currentZoom / 100;
            const baseWidth = 760;
            slideStack.style.maxWidth = `${baseWidth * ratio}px`;
            slideStack.style.transformOrigin = 'top center';
            slideStack.style.transform = `scale(${ratio})`;
            slideStack.style.transition = 'all 0.2s ease-out';
        }
        renderPDFVisualPage(currentSlide);
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (currentZoom < 160) {
                applyZoom(currentZoom + 10);
            }
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (currentZoom > 60) {
                applyZoom(currentZoom - 10);
            }
        });
    }

    // ==========================================================================
    // 6. ACTION ICON BUTTONS & POPUP NOTES SYSTEM
    // ==========================================================================
    let userNotes = [
        { id: 1, doc: 'd1-slide-hackathon.pdf', page: 1, text: 'Tổng quan về mô hình ngôn ngữ lớn (LLM)' },
        { id: 2, doc: 'd1-slide-hackathon.pdf', page: 3, text: 'Ghi chú về phân tầng AI, ML, Deep Learning' }
    ];

    const notesModal = document.getElementById('notes-modal');
    const closeNotesModalBtn = document.getElementById('close-notes-modal-btn');
    const notesListContainer = document.getElementById('notes-list-container');
    const newNoteInput = document.getElementById('new-note-input');
    const addNoteConfirmBtn = document.getElementById('add-note-confirm-btn');

    function updateNoteCounterPill() {
        if (!noteCounterPill) return;
        const filtered = userNotes.filter(n => n.doc === currentDocFile && n.page === currentSlide);
        noteCounterPill.textContent = `Trang ${currentSlide} · ${filtered.length} note${filtered.length === 1 ? '' : 's'}`;
    }

    function renderNotesModal() {
        const modalDocName = document.getElementById('modal-doc-name');
        if (modalDocName) modalDocName.textContent = currentDocFile;

        if (!notesListContainer) return;

        const filtered = userNotes.filter(n => n.doc === currentDocFile);

        if (filtered.length === 0) {
            notesListContainer.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:24px; font-size:0.85rem;">Chưa có ghi chú nào cho tài liệu này.</div>`;
            return;
        }

        notesListContainer.innerHTML = filtered.map(note => `
            <div class="note-item-card" data-id="${note.id}">
                <div>
                    <span class="note-item-slide-badge">Trang ${note.page}</span>
                    <div class="note-item-text">${escapeHtml(note.text)}</div>
                </div>
                <button class="note-item-delete" data-id="${note.id}" title="Xóa note">✕</button>
            </div>
        `).join('');

        notesListContainer.querySelectorAll('.note-item-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                userNotes = userNotes.filter(n => n.id !== id);
                renderNotesModal();
                updateNoteCounterPill();
            });
        });
    }

    function openNotesModal() {
        renderNotesModal();
        if (notesModal) notesModal.classList.remove('hidden');
    }

    function closeNotesModal() {
        if (notesModal) notesModal.classList.add('hidden');
    }

    if (closeNotesModalBtn) closeNotesModalBtn.addEventListener('click', closeNotesModal);
    if (notesModal) {
        notesModal.addEventListener('click', (e) => {
            if (e.target === notesModal) closeNotesModal();
        });
    }

    if (addNoteConfirmBtn && newNoteInput) {
        const handleAddNote = () => {
            const val = newNoteInput.value.trim();
            if (!val) return;
            userNotes.push({
                id: Date.now(),
                doc: currentDocFile,
                page: currentSlide,
                text: val
            });
            newNoteInput.value = '';
            renderNotesModal();
            updateNoteCounterPill();
        };

        addNoteConfirmBtn.addEventListener('click', handleAddNote);
        newNoteInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleAddNote();
        });
    }

    if (btnDownloadPdf) {
        btnDownloadPdf.addEventListener('click', () => {
            alert(`📥 Đang tải file tài liệu ${currentDocFile}...`);
        });
    }

    if (btnBookmark) {
        btnBookmark.addEventListener('click', () => {
            btnBookmark.style.color = '#0284c7';
            alert(`🔖 Đã lưu Bookmark trang ${currentSlide}!`);
        });
    }

    if (btnAddNote) btnAddNote.addEventListener('click', openNotesModal);
    const btnViewNotes = document.getElementById('btn-view-notes');
    if (btnViewNotes) btnViewNotes.addEventListener('click', openNotesModal);
    if (noteCounterPill) {
        noteCounterPill.style.cursor = 'pointer';
        noteCounterPill.addEventListener('click', openNotesModal);
    }

    // ==========================================================================
    // 7. ROBOT DRAWER TOGGLE & DRAGGABLE AI ASSISTANT BUTTON (🤖)
    // ==========================================================================
    function setDrawerState(open) {
        if (!tutorDrawer) return;
        const appLayout = document.getElementById('app-layout') || document.querySelector('.app-layout');
        if (open) {
            tutorDrawer.classList.remove('collapsed');
            if (appLayout) appLayout.classList.add('drawer-open');
        } else {
            tutorDrawer.classList.add('collapsed');
            if (appLayout) appLayout.classList.remove('drawer-open');
        }
        setTimeout(() => {
            renderPDFVisualPage(currentSlide);
        }, 150);
    }

    if (robotToggleBtn) {
        let isDragging = false;
        let hasMoved = false;
        let startX = 0, startY = 0;
        let initialLeft = 0, initialTop = 0;

        const onStart = (e) => {
            isDragging = true;
            hasMoved = false;
            const point = e.touches ? e.touches[0] : e;
            startX = point.clientX;
            startY = point.clientY;

            const rect = robotToggleBtn.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            robotToggleBtn.style.transform = 'none';
            robotToggleBtn.style.right = 'auto';
            robotToggleBtn.style.left = `${initialLeft}px`;
            robotToggleBtn.style.top = `${initialTop}px`;

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const point = e.touches ? e.touches[0] : e;
            const deltaX = point.clientX - startX;
            const deltaY = point.clientY - startY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                hasMoved = true;
            }

            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;

            // Screen boundary bounds
            const maxLeft = window.innerWidth - robotToggleBtn.offsetWidth;
            const maxTop = window.innerHeight - robotToggleBtn.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            robotToggleBtn.style.left = `${newLeft}px`;
            robotToggleBtn.style.top = `${newTop}px`;
        };

        const onEnd = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
        };

        robotToggleBtn.addEventListener('mousedown', onStart);
        robotToggleBtn.addEventListener('touchstart', onStart, { passive: false });

        robotToggleBtn.addEventListener('click', (e) => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (tutorDrawer) {
                const isCollapsed = tutorDrawer.classList.contains('collapsed');
                setDrawerState(isCollapsed);
            }
        });
    }

    if (closeDrawerBtn && tutorDrawer) {
        closeDrawerBtn.addEventListener('click', () => {
            setDrawerState(false);
        });
    }

    // ==========================================================================
    // 8. THEME & LANGUAGE TOGGLE
    // ==========================================================================
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            if (isDarkMode) {
                document.body.classList.remove('light-theme');
                themeBtn.textContent = '☀️';
            } else {
                document.body.classList.add('light-theme');
                themeBtn.textContent = '🌙';
            }
        });
    }

    if (langBtn) {
        let lang = 'VI';
        langBtn.addEventListener('click', () => {
            lang = lang === 'VI' ? 'EN' : 'VI';
            langBtn.textContent = lang;
        });
    }

    // ==========================================================================
    // 9. CHAT HISTORY OVERLAY MANAGEMENT
    // ==========================================================================
    const btnChatHistory = document.getElementById('btn-chat-history');
    const chatHistoryPanel = document.getElementById('chat-history-panel');
    const historyListContainer = document.getElementById('history-list-container');
    const btnNewChat = document.getElementById('btn-new-chat');

    let chatHistory = [
        {
            id: 1,
            title: 'Hỏi về AI & LLM Foundation',
            time: '10:42',
            messages: [
                { sender: 'user', text: 'Tóm tắt slide này giúp mình với' },
                { sender: 'bot', text: '📌 <strong>Tóm tắt Slide 1:</strong> Tổng quan về AI & LLM Foundation, cơ chế dự đoán token và Transformer.' }
            ]
        },
        {
            id: 2,
            title: 'Giải thích cơ chế Attention',
            time: 'Hôm qua',
            messages: [
                { sender: 'user', text: 'Cơ chế Attention hoạt động thế nào?' },
                { sender: 'bot', text: 'Cơ chế Self-Attention giúp mô hình tính toán trọng số liên quan giữa các token trong câu.' }
            ]
        }
    ];

    const btnClearHistory = document.getElementById('btn-clear-history');

    function renderHistoryList() {
        if (!historyListContainer) return;
        historyListContainer.innerHTML = '';
        if (chatHistory.length === 0) {
            historyListContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding: 20px;">Chưa có lịch sử chat nào.</div>';
            return;
        }

        chatHistory.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'history-item-card';
            card.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div class="history-item-title">${escapeHtml(item.title)}</div>
                    <button class="delete-single-history-btn" title="Xóa đoạn chat này" style="background: none; border: none; color: #f43f5e; cursor: pointer; font-size: 0.75rem; padding: 2px 4px;">🗑️</button>
                </div>
                <div class="history-item-time">🕒 ${item.time} · ${item.messages.length} tin nhắn</div>
            `;

            const deleteBtn = card.querySelector('.delete-single-history-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    chatHistory.splice(index, 1);
                    renderHistoryList();
                });
            }

            card.addEventListener('click', () => {
                loadHistorySession(item);
                if (chatHistoryPanel) chatHistoryPanel.classList.add('hidden');
            });
            historyListContainer.appendChild(card);
        });
    }

    function loadHistorySession(session) {
        if (!drawerChatMessages) return;
        drawerChatMessages.innerHTML = '';
        session.messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = msg.sender === 'user' ? 'user-card' : 'bot-card';
            div.innerHTML = msg.sender === 'user' ? escapeHtml(msg.text) : msg.text;
            drawerChatMessages.appendChild(div);
        });
        drawerChatMessages.scrollTop = drawerChatMessages.scrollHeight;
    }

    if (btnChatHistory && chatHistoryPanel) {
        btnChatHistory.addEventListener('click', () => {
            renderHistoryList();
            chatHistoryPanel.classList.toggle('hidden');
        });
    }

    if (btnClearHistory) {
        btnClearHistory.addEventListener('click', () => {
            chatHistory = [];
            renderHistoryList();
            if (drawerChatMessages) {
                drawerChatMessages.innerHTML = `
                    <div class="bot-card">
                        Xin chào! Mình là VLearn Tutor. Bạn có thể gửi câu hỏi trực tiếp để thảo luận về slide nhé!
                    </div>
                `;
            }
        });
    }

    if (btnNewChat) {
        btnNewChat.addEventListener('click', () => {
            if (drawerChatMessages) {
                drawerChatMessages.innerHTML = `
                    <div class="bot-card">
                        Xin chào! Mình là VLearn Tutor. Bạn có thể gửi câu hỏi trực tiếp để thảo luận về slide nhé!
                    </div>
                `;
            }
            if (chatHistoryPanel) chatHistoryPanel.classList.add('hidden');
        });
    }

    // ==========================================================================
    // 10. AI CHATBOT INTERACTION
    // ==========================================================================
    // ui/app.js (Tìm hàm sendChatMessage và cập nhật lại đoạn fetch như dưới đây)
    async function sendChatMessage(text) {
        if (!text.trim()) return;

        // Vẽ tin nhắn của học viên
        const userBubble = document.createElement('div');
        userBubble.className = 'user-card';
        userBubble.textContent = text;
        drawerChatMessages.appendChild(userBubble);
        drawerUserInput.value = '';
        drawerChatMessages.scrollTop = drawerChatMessages.scrollHeight;

        // Vẽ tin nhắn chờ của AI
        const botBubble = document.createElement('div');
        botBubble.className = 'bot-card';
        botBubble.innerHTML = '⏳ <em>VLearn Tutor đang suy luận từ slide...</em>';
        drawerChatMessages.appendChild(botBubble);
        drawerChatMessages.scrollTop = drawerChatMessages.scrollHeight;

        try {
            const dayCode = currentDocFile.includes('d2') ? 'd2' : 'd1';
            
            // --- THAY ĐỔI ĐƯỜNG DẪN GỌI ĐẾN CỔNG API 8000 ---
            const response = await fetch('http://localhost:8000/api/chat', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    day_code: dayCode,
                    current_slide: currentSlide
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Hiển thị câu trả lời thật từ Python Backend Agent
                botBubble.innerHTML = data.reply || data.response;
                drawerChatMessages.scrollTop = drawerChatMessages.scrollHeight;
                return;
            }
        } catch (err) {
            console.log('Backend API offline, using smart context fallback', err);
        }

        // Khung fallback dự phòng (chỉ chạy khi mất kết nối backend)
        setTimeout(() => {
            let replyText = `Cảm ơn bạn đã đặt câu hỏi: <strong>"${escapeHtml(text)}"</strong>.<br>Trong Slide ${currentSlide} của <em>${currentDocFile}</em>, nội dung này phân tích nguyên lý hoạt động của mô hình ngôn ngữ lớn (LLM).`;
            
            const q = text.toLowerCase();
            if (q.includes('tóm tắt')) {
                replyText = `📌 <strong>Tóm tắt Slide ${currentSlide}:</strong> Tổng quan về AI & LLM Foundation, cơ chế dự đoán token kế tiếp và kiến trúc Transformer.`;
            } else if (q.includes('attention')) {
                replyText = `⚡ <strong>Self-Attention:</strong> Trọng số tính toán ma trận Query, Key, Value kết nối các từ xa nhau trong câu văn (xem Slide 16).`;
            }

            botBubble.innerHTML = replyText;
            drawerChatMessages.scrollTop = drawerChatMessages.scrollHeight;
        }, 600);
    }

    if (drawerSendBtn) drawerSendBtn.addEventListener('click', () => sendChatMessage(drawerUserInput.value));
    if (drawerUserInput) {
        drawerUserInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendChatMessage(drawerUserInput.value);
        });
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Initial render for page 1
    updateSlidePage(1);
});
