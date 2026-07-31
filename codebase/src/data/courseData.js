// Dữ liệu đóng gói sẵn các buổi học từ data/vlearn-pack phục vụ cho prototype (Chỉ giữ Day01 & Day02 có slide & transcript thực tế)
export const DAY01_SLIDES = [
  { page: 1, title: 'AI & LLM Foundation', content: 'Bạn đang dùng AI mỗi ngày — nhưng thực sự bên trong nó đang làm gì?', subtitle: 'AI IN ACTION · DAY 01' },
  { page: 2, title: 'Agenda Buổi 1', content: '• Bức tranh AI & các tầng của AI\n• Lịch sử AI 70 năm\n• Bên trong LLM: cơ chế vận hành\n• Từ LLM đến AI Agent\n• Landscape: model hôm nay & cuộc đua hiện tại\n• Chọn model & chi phí token\n• Gọi API lần đầu', subtitle: 'Từ "nghe AI" đến "gọi AI" trong một ngày' },
  { page: 3, title: 'Hệ sinh thái AI: AI, ML, DL, GenAI, LLM', content: '• AI — chiếc ô lớn nhất: mọi hệ thống thông minh.\n• Machine Learning — học từ dữ liệu.\n• Deep Learning — mạng nơ-ron nhiều tầng.\n• Generative AI — sinh nội dung mới (văn bản, ảnh, code).\n• LLM — model nền chuyên ngôn ngữ, tim của làn sóng hiện nay.', subtitle: 'LLM không phải toàn bộ AI — nhưng là tầng nền chính' },
  { page: 4, title: 'Phân loại: Discriminative vs Generative vs Agentic', content: '• Discriminative AI: Phân loại, dự đoán (Input -> Nhãn/Con số)\n• Generative AI: Sinh ra thứ mới (Prompt -> Văn bản/Ảnh/Code)\n• Agentic AI: Nhận mục tiêu rồi tự lập kế hoạch, dùng tool, thực thi nhiều bước.', subtitle: 'Tất cả nằm trong hệ thống học tập AI' },
  { page: 5, title: 'Lịch sử 70 năm trí tuệ nhân tạo', content: '1950: Alan Turing Test -> 1997: Deep Blue thắng Cờ vua -> 2012: AlexNet Deep Learning -> 2017: Transformer (Attention Is All You Need) -> 2022: ChatGPT & Bùng nổ LLM.', subtitle: 'Kỷ nguyên LLM hiện đại bùng nổ từ Transformer' },
  { page: 6, title: 'Bên trong LLM: Kiến trúc Transformer', content: '• Transformer giải quyết bài toán xử lý chuỗi song song nhờ cơ chế Self-Attention.\n• Self-Attention giúp mô hình hiểu mối liên hệ giữa các từ dù ở xa nhau trong đoạn văn.', subtitle: 'Cơ chế cốt lõi của GPT, Claude, Gemini' },
  { page: 7, title: 'Cơ chế Next Token Prediction', content: 'LLM vận hành bằng cách liên tục dự đoán từ/token tiếp theo dựa trên xác suất thống kê từ dữ liệu huấn luyện khổng lồ.\nFormula: P(token_n | token_1, ..., token_n-1)', subtitle: 'Bản chất của việc tạo ra văn bản tự nhiên' },
  { page: 8, title: 'Token & Đơn vị đo lường', content: '• Token không hẳn là 1 từ. 1 Token ≈ 0.75 từ tiếng Anh hoặc ~1 ký tự tiếng Việt.\n• Token quyết định độ dài Context Window và chi phí gọi API.', subtitle: '1.000 token ≈ 750 từ' },
  { page: 9, title: 'Tokenomics: Tại sao Output đắt hơn Input 3-5 lần?', content: '• Input Token được tính song song 1 lần (Parallel processing).\n• Output Token phải sinh tuần tự từng từ một (Autoregressive step-by-step), tiêu tốn năng lượng tính toán gấp nhiều lần.', subtitle: 'Slide 13, 27 · Tối ưu chi phí sản phẩm AI' },
  { page: 10, title: 'LLM không phải là Chatbot!', content: '• Chatbot chỉ là 1 giao diện người dùng (UI).\n• LLM là Bộ não xử lý ngôn ngữ tự nhiên nền tảng (Reasoning Engine).\n• Bạn có thể dùng LLM để trích xuất dữ liệu, dịch thuật, lập trình, lập kế hoạch.', subtitle: 'Slide 10 · Nhận thức nền tảng' },
  { page: 11, title: '4 Level Agent: Từ LLM trần đến Multi-Agent', content: '• Level 1: Naked LLM (Chỉ chat đơn thuần)\n• Level 2: Tool-using Agent (Gắn Google Search, Python REPL, SQL)\n• Level 3: Workflow Agent (Prompt Chaining & Routing)\n• Level 4: Multi-Agent System (Hệ thống nhiều agent phối hợp)', subtitle: 'Slide 23-24 · Tiến trình phát triển AI Agent' },
  { page: 12, title: 'Giới hạn 1: Cut-off Knowledge & Bong bóng thời gian', content: '• LLM chỉ biết dữ liệu đến thời điểm cutoff date khi huấn luyện.\n• Để khắc phục: Cần dùng RAG (Retrieval-Augmented Generation) hoặc Search Tool.', subtitle: 'Slide 20 · Giới hạn bẩm sinh của LLM' },
  { page: 13, title: 'Giới hạn 2: Hallucination (Tự tin bịa tin)', content: '• LLM tạo ra câu từ mượt mà nhưng nội dung có thể hoàn toàn sai sự thật (hallucination).\n• Không bao giờ tin tưởng tuyệt đối vào câu trả lời của LLM mà không có bằng chứng trích dẫn (citation).', subtitle: 'Slide 20 · Giới hạn bẩm sinh của LLM' },
  { page: 14, title: 'Giới hạn 3: Context Window & Lost in the Middle', content: '• Mặc dù Context Window lên tới 1M-2M token, thông tin ở giữa văn bản dài dễ bị mô hình bỏ qua (Lost in the middle / Needle in a haystack).', subtitle: 'Slide 20 · Giới hạn bẩm sinh của LLM' },
  { page: 15, title: 'Prompt 4 Lớp chuẩn hóa', content: '1. System Instruction (Vai trò & Quy tắc)\n2. User Input (Yêu cầu cụ thể)\n3. Context / Grounding Data (Dữ liệu đầu vào)\n4. Output Format (Định dạng JSON/Markdown mong muốn)', subtitle: 'Slide 28 · Kỹ thuật Prompt Engineering' },
  { page: 16, title: 'Thực hành gọi API Gemini đầu tiên', content: '• Thiết lập API Key trong file .env\n• Gửi request với systemInstruction và temperature=0.2\n• Nhận kết quả phản hồi có định dạng structured data', subtitle: 'Thực hành Lab' },
  { page: 17, title: 'Nguồn sự thật (Source of Truth)', content: 'Hệ thống AI đáng tin cậy phải luôn trích dẫn nguồn sự thật rõ ràng (File PDF, Slide, Trang số) để người dùng dễ dàng kiểm chứng.', subtitle: 'Nguyên tắc thiết kế sản phẩm AI' },
  { page: 18, title: 'Phân biệt Task Automation vs Task Augmentation', content: '• Automation: AI tự động hóa 100% không cần người duyệt.\n• Augmentation: AI hỗ trợ gợi ý, con người là người ra quyết định cuối cùng (Human-in-the-loop).', subtitle: 'Nguyên tắc PAIR' },
  { page: 19, title: 'Tối ưu hóa Temperature & Top-P', content: '• Temperature = 0.0: Câu trả lời chính xác, nhất quán, dùng cho trích xuất dữ liệu & code.\n• Temperature = 0.7 - 1.0: Câu trả lời sáng tạo, dùng cho viết lách & brainstorm.', subtitle: 'Tham số điều khiển LLM' },
  { page: 20, title: 'Kiểm soát Hallucination bằng Grounding', content: 'Cung cấp dữ liệu gốc trực tiếp vào prompt và yêu cầu AI: "Nếu thông tin không có trong tài liệu, hãy trả lời không biết, tuyệt đối không tự bịa thông tin."', subtitle: 'Quy tắc G10 - Tránh bịa tin' },
  { page: 21, title: 'Structured Output với JSON Schema', content: 'Ép buộc LLM trả về đúng định dạng JSON tuân thủ Schema để phần mềm backend có thể parse và xử lý trực tiếp.', subtitle: 'JSON Mode & Tool Calling' },
  { page: 22, title: 'Cấu trúc bài giảng Day 01 recap', content: 'Tổng hợp 5 điểm cốt lõi đã học trong Day 01 làm tiền đề chuyển tiếp sang Day 02.', subtitle: 'Tóm tắt bài học' },
  { page: 23, title: 'Chi phí triển khai LLM thực tế', content: 'Tính toán chi phí token theo tháng cho 1.000 người dùng dựa trên Input Token và Output Token trung bình.', subtitle: 'Bài toán kinh tế AI' },
  { page: 24, title: 'Các dòng mô hình phổ biến năm 2026', content: '• Gemini 1.5 Pro / Flash\n• GPT-4o / Claude 3.5 Sonnet\n• Open-source: Llama 3 / DeepSeek V3', subtitle: 'Landscape LLM' },
  { page: 25, title: 'An toàn dữ liệu & Quyền riêng tư', content: '• Không đưa dữ liệu cá nhân nhạy cảm (PII) lên mô hình công khai.\n• Sử dụng API trả phí để đảm bảo dữ liệu không bị dùng cho huấn luyện.', subtitle: 'Bảo mật dữ liệu' },
  { page: 26, title: 'Chuẩn bị cho Day 02', content: 'Từ nền tảng LLM hôm nay, ngày mai chúng ta sẽ học cách xác định đúng bài toán kinh doanh để áp dụng AI hiệu quả.', subtitle: 'Chuyển tiếp bài học' },
  { page: 27, title: 'Tổng kết & Bài tập về nhà', content: '1. Đọc lại slide Day 01\n2. Thực hành viết Prompt 4 Lớp\n3. Tìm 3 bài toán tại doanh nghiệp của bạn.', subtitle: 'Bài tập cuối buổi' },
  { page: 28, title: 'Hỏi đáp với Giảng viên (Q&A)', content: 'Giải đáp các thắc mắc về Token, API Key và cấu trúc Agent.', subtitle: 'Q&A' },
  { page: 29, title: 'Kết thúc Day 01', content: 'Cảm ơn các bạn! Hẹn gặp lại trong Day 02: Xác định bài toán cho AI.', subtitle: 'VinUniversity · AICB Phase 1' }
];

export const DAY02_SLIDES = [
  { page: 1, title: 'Xác định bài toán cho AI (Problem Statement)', content: 'Từ yêu cầu mơ hồ đến Problem Statement rõ ràng và khả thi', subtitle: 'AI IN ACTION · DAY 02' },
  { page: 2, title: 'Agenda Buổi 2', content: '• Problem Discovery (Double Diamond)\n• Problem Statement 9 Trường\n• PAIR ① AI có thêm giá trị không?\n• PAIR ② Automate/Augment -> Rule/Workflow/Agent\n• PAIR ③ Reward function & success criteria\n• Khi AI sai & UX/HITL', subtitle: 'Khung lý thuyết & Thực hành Lab' },
  { page: 3, title: 'Mô hình Double Diamond (Don Norman / Design Council)', content: '• Diamond 1: Discovery (Mở rộng) -> Define (Hội tụ tìm đúng bài toán gốc).\n• Diamond 2: Develop (Mở rộng) -> Deliver (Hội tụ chọn giải pháp tốt nhất).', subtitle: 'Slide 16 · Tìm đúng bài toán trước khi làm' },
  { page: 4, title: 'Discover: Khám phá vấn đề thực tế', content: '• Quan sát thực tế công việc (Observation)\n• Phỏng vấn người dùng sâu (User Interview)\n• Nhật ký hành vi (Diary Study)', subtitle: 'Giai đoạn phân kỳ 1' },
  { page: 5, title: 'Define: Xác định bài toán cốt lõi', content: 'Cô đọng toàn bộ thông tin thu thập được thành câu phát biểu bài toán rõ ràng, tránh giải quyết sai vấn đề.', subtitle: 'Giai đoạn hội tụ 1' },
  { page: 6, title: 'Khung PAIR: 3 Câu hỏi bắt buộc', content: '• Bước 1: AI có tạo ra giá trị khác biệt so với phần mềm truyền thống không?\n• Bước 2: Chọn Automate hay Augment? Dùng Rule, Workflow hay Agent?\n• Bước 3: Hàm thưởng (Reward function) & Tiêu chí thành công là gì?', subtitle: 'Slide 13 · PAIR Framework' },
  { page: 7, title: 'PAIR Bước 1: Có cần AI không?', content: 'Nếu bài toán có thể giải quyết bằng 1 thuật toán if/else hoặc phần mềm thông thường với độ chính xác 100%, ĐỪNG DÙNG AI!', subtitle: 'Nguyên tắc tiết kiệm & đơn giản' },
  { page: 8, title: 'PAIR Bước 2: 3 Cấp giải pháp (Rule / Workflow / Agent)', content: '• Cấp 1: Rule-based (Hệ luật tay, Regex, If/Else)\n• Cấp 2: Workflow (Prompt Chaining có bước cố định)\n• Cấp 3: Agent (AI tự quyết định bước đi tiếp theo)', subtitle: 'Slide 18-19 · Nguyên tắc luôn bắt đầu từ Cấp 1' },
  { page: 9, title: 'PAIR Bước 3: Reward Function & Success Criteria', content: 'Định nghĩa rõ ràng: Thế nào là một câu trả lời ĐÚNG và THÀNH CÔNG của sản phẩm AI?', subtitle: 'Slide 22 · Tiêu chuẩn đánh giá' },
  { page: 10, title: 'Phân tích Cost-of-Error (Chi phí khi AI đoán sai)', content: '• Cost-of-error THẤP (gợi ý nhạc, viết nháp): AI sai không gây hậu quả lớn.\n• Cost-of-error CAO (y tế, tài chính, pháp lý): AI sai gây thiệt hại nặng nề.', subtitle: 'Slide 22-23 · Quyết định UX sản phẩm' },
  { page: 11, title: 'Thiết kế Human-in-the-loop (HITL)', content: 'Khi Cost-of-Error cao, thiết kế giao diện dạng AUGMENTATION: AI đề xuất nháp -> Con người kiểm tra và bấm chấp nhận/chỉnh sửa.', subtitle: 'Slide 24 · An toàn sản phẩm AI' },
  { page: 12, title: 'Precision vs Recall trong sản phẩm AI', content: '• High Precision: Thà bỏ sót chứ không trả lời sai (Dùng cho pháp lý, y tế).\n• High Recall: Thà bắt nhầm còn hơn bỏ sót (Dùng cho tìm kiếm bài viết, gợi ý).', subtitle: 'Slide 24 · Cân bằng Trade-off' },
  { page: 13, title: 'Bản Problem Statement 9 Trường hoàn chỉnh', content: '1. Bối cảnh & Người dùng\n2. Vấn đề hiện tại\n3. Hậu quả & Chi phí\n4. Giá trị kỳ vọng\n5. Cấp giải pháp (Rule/Workflow/Agent)\n6. Phương án UX (Augment/Automate)\n7. Risk & Cost-of-error\n8. Dữ liệu sẵn có\n9. Tiêu chí Go/No-Go', subtitle: 'Slide 27 · Deliverable chuẩn VLearn' },
  { page: 14, title: 'Đánh giá Feasibility & Khả thi về Dữ liệu', content: 'Kiểm tra xem bạn có đủ dữ liệu chất lượng (clean data) để AI học và trích xuất thông tin hay không.', subtitle: 'Thẩm định dữ liệu' },
  { page: 15, title: 'Quy trình Lab chiều: Tìm & chốt bài toán nhóm', content: '• Cá nhân chọn 5 bài toán -> Nhóm phản biện chéo chọn 1 bài toán tốt nhất -> Viết Problem Statement.', subtitle: 'Thực hành nhóm' },
  { page: 16, title: 'Case Study 1: Tự động hóa hỗ trợ khách hàng', content: 'Phân tích chi phí khi dùng Chatbot tự động 100% vs Trợ lý soạn sẵn phản hồi cho CSKH duyệt.', subtitle: 'Phân tích thực tế' },
  { page: 17, title: 'Case Study 2: Trích xuất hợp đồng pháp lý', content: 'Tại sao bài toán trích xuất hợp đồng bắt buộc phải dùng Precision cao và thiết kế HITL.', subtitle: 'Phân tích thực tế' },
  { page: 18, title: 'Nhật ký phản tư (Reflection Log)', content: 'Viết nhật ký cá nhân ghi nhận lại những bài học kinh nghiệm và tư duy mới thu hoạch được sau buổi học.', subtitle: 'Phản tư cá nhân' },
  { page: 19, title: 'Tránh cái bẫy "Búa tìm đinh"', content: 'Đừng xuất phát từ công cụ AI mới ra mắt rồi đi tìm bài toán ứng dụng. Hãy bắt đầu từ nỗi đau thật của người dùng!', subtitle: 'Tư duy làm sản phẩm' },
  { page: 20, title: 'Ma trận đánh giá Go / Not Yet / No-Go', content: '• Go: Đủ dữ liệu, bài toán rõ ràng, giá trị cao.\n• Not Yet: Cần thu thập thêm dữ liệu.\n• No-Go: AI không tạo giá trị thêm hoặc chi phí quá đắt.', subtitle: 'Quyết định đầu tư' },
  { page: 21, title: 'Kỹ thuật Phỏng vấn người dùng (User Interview)', content: 'Đặt câu hỏi mở về hành vi trong quá khứ thay vì hỏi câu hỏi giả định tương lai.', subtitle: 'Phương pháp luận' },
  { page: 22, title: 'Tổng kết nội dung Day 02', content: 'Hoàn thành bản Problem Statement 9 Trường là chìa khóa để bước sang Buổi 3: Thiết kế Workflow & Prompt Chaining.', subtitle: 'Tóm tắt bài học' },
  { page: 23, title: 'Liên kết giữa Day 01 và Day 02', content: 'Hiểu giới hạn LLM (Day 01) -> Giúp phân tích Cost-of-error và chọn giải pháp phù hợp (Day 02).', subtitle: 'Learning Bridge' },
  { page: 24, title: 'Bài tập nộp cuối buổi', content: '1. Bản Problem Statement của nhóm\n2. Nhật ký phản tư cá nhân', subtitle: 'Bài nộp Hackathon' },
  { page: 25, title: 'Checklist kiểm tra chất lượng Problem Statement', content: 'Đã định lượng hậu quả chưa? Đã chọn đúng cấp Rule/Workflow/Agent chưa?', subtitle: 'Quality Bar' },
  { page: 26, title: 'Hỏi đáp Q&A về PAIR Framework', content: 'Giải đáp thắc mắc của học viên về cách tính Cost-of-error.', subtitle: 'Q&A' },
  { page: 27, title: 'Chuẩn bị cho Day 03', content: 'Day 03: Xây dựng Workflow & Prompt Chaining với LangChain / LlamaIndex.', subtitle: 'Xem trước bài tiếp' },
  { page: 28, title: 'Cảm ơn & Gợi ý đọc thêm', content: 'Đọc tài liệu PAIR Guide của Google và tài liệu VLearn Pack.', subtitle: 'Tài liệu tham khảo' },
  { page: 29, title: 'Kết thúc Day 02', content: 'Chúc mừng bạn đã hoàn thành Day 02!', subtitle: 'VinUniversity · AICB Phase 1' }
];

export const COURSE_DAYS = [
  {
    id: 'day01',
    code: 'Day01',
    title: 'AI & LLM Foundation',
    subtitle: 'Nền tảng về LLM, Token, 4 Level Agent và Prompt 4 Lớp',
    transcriptFile: 'transcript-01-clean.md',
    pdfPath: '/slides/d1-slide-hackathon.pdf',
    slideFile: 'd1-slide-hackathon.pdf',
    documentCount: 2,
    pageCount: 29,
    slides: DAY01_SLIDES,
    keyConcepts: [
      { id: 'c1_1', name: 'LLM không phải Chatbot', citation: 'slide 10' },
      { id: 'c1_2', name: 'Token & Tốc độ/Chi phí', citation: 'slide 13, 27' },
      { id: 'c1_3', name: '3 Giới hạn Bẩm sinh (Hallucination, Context)', citation: 'slide 20' },
      { id: 'c1_4', name: '4 Level Agent (LLM trần -> Multi-Agent)', citation: 'slide 23-24' },
      { id: 'c1_5', name: 'Prompt 4 Lớp', citation: 'slide 28' }
    ],
    summaryContent: `Buổi 1 tập trung vào nền tảng cốt lõi của Large Language Model (LLM). Học viên tìm hiểu rằng LLM là bộ não ngôn ngữ chứ không chỉ là giao diện chatbot [slide 10]. Khái niệm Token giải thích tại sao output đắt gấp 3-5x input [slide 13, 27]. Khóa học làm rõ 3 giới hạn bẩm sinh của LLM: hallucination, bong bóng thời gian và giới hạn context [slide 20]. Cuối cùng là phân loại 4 level agent [slide 23] và kỹ thuật cấu trúc prompt 4 lớp [slide 28].`
  },
  {
    id: 'day02',
    code: 'Day02',
    title: 'Xác định bài toán cho AI (Problem Statement)',
    subtitle: 'PAIR Framework, 3 Cấp Giải pháp (Rule/Workflow/Agent), Cost-of-error',
    transcriptFile: 'transcript-02-clean.md',
    pdfPath: '/slides/d2-slide-hackathon.pdf',
    slideFile: 'd2-slide-hackathon.pdf',
    documentCount: 2,
    pageCount: 29,
    slides: DAY02_SLIDES,
    keyConcepts: [
      { id: 'c2_1', name: 'Problem Statement 9 Trường', citation: 'slide 27' },
      { id: 'c2_2', name: 'PAIR Framework 3 Bước', citation: 'slide 13' },
      { id: 'c2_3', name: '3 Cấp giải pháp: Rule / Workflow / Agent', citation: 'slide 18-19' },
      { id: 'c2_4', name: 'Reward Function & Cost-of-error', citation: 'slide 22-23' },
      { id: 'c2_5', name: 'Precision vs Recall & Human-in-the-loop', citation: 'slide 24' }
    ],
    summaryContent: `Buổi 2 đi sâu vào phương pháp luận xác định bài toán kinh doanh/sản phẩm phù hợp với AI. Áp dụng PAIR 3 bước để trả lời "Có cần AI không?" [slide 13]. Định nghĩa 3 cấp giải pháp Rule/Workflow/Agent để luôn bắt đầu từ giải pháp đơn giản nhất [slide 18-19]. Phân tích cost-of-error để chọn giữa Augment hay Automate và thiết kế Human-in-the-loop [slide 22-24].`
  }
];

export const PREBAKED_EXPERIENCE_PATHS = {
  happy: {
    pathName: 'Happy Path (Chuẩn)',
    status: 'success',
    badgeClass: 'badge-happy',
    confidenceScore: 0.95,
    recap: [
      {
        id: 1,
        text: 'LLM không phải là Chatbot giao tiếp đơn thuần, mà là bộ não xử lý ngôn ngữ tự nhiên nền tảng.',
        citation: 'Day 01 - slide 10',
        refId: 'slide-10'
      },
      {
        id: 2,
        text: 'Token quyết định tốc độ và chi phí: Chi phí output đắt gấp 3–5 lần input.',
        citation: 'Day 01 - slide 13, 27',
        refId: 'slide-13'
      },
      {
        id: 3,
        text: 'LLM có 3 giới hạn bẩm sinh: Hallucination (bịa tin), Bong bóng thời gian và Context hạn chế.',
        citation: 'Day 01 - slide 20',
        refId: 'slide-20'
      },
      {
        id: 4,
        text: 'Phân loại 4 Level Agent: Từ LLM trần, LLM có tools, Workflow planning đến Multi-Agent hệ thống.',
        citation: 'Day 01 - slide 23-24',
        refId: 'slide-23'
      },
      {
        id: 5,
        text: 'Prompt 4 lớp cấu trúc: System Instruction -> User Input -> Context -> Output Format.',
        citation: 'Day 01 - slide 28',
        refId: 'slide-28'
      }
    ],
    bridgeLinks: [
      {
        id: 'b1',
        sourceConcept: 'Giới hạn bẩm sinh LLM (Hallucination)',
        sourceRef: 'Day 01 - slide 20',
        targetConcept: 'PAIR Framework & Cost-of-error',
        targetRef: 'Day 02 - slide 13, 22',
        explanation: 'Day 01 nêu rõ LLM có thể hallucinate -> Day 02 dùng chính điều này để phân tích Cost-of-error và quyết định bài toán nào nên Augment thay vì Automate.'
      },
      {
        id: 'b2',
        sourceConcept: '4 Level Agent (Đơn giản -> Phức tạp)',
        sourceRef: 'Day 01 - slide 23-24',
        targetConcept: '3 Cấp giải pháp (Rule / Workflow / Agent)',
        targetRef: 'Day 02 - slide 18-19',
        explanation: 'Day 01 giới thiệu các cấp độ agent -> Day 02 phát triển thành nguyên tắc thiết kế: Luôn chọn cấp đơn giản nhất (Rule hoặc Workflow) trước khi nâng lên Agent.'
      },
      {
        id: 'b3',
        sourceConcept: 'Token & Chi phí tính toán',
        sourceRef: 'Day 01 - slide 27',
        targetConcept: 'Đánh giá Feasibility kinh tế trong Problem Statement',
        targetRef: 'Day 02 - slide 27',
        explanation: 'Khái niệm chi phí Token ở Day 01 là cơ sở để tính toán bài toán ở Day 02 có khả thi về mặt chi phí vận hành hay không.'
      }
    ],
    checklist: [
      { id: 'ck1', text: 'Ôn lại 3 giới hạn bẩm sinh của LLM (Hallucination, Bong bóng thời gian, Context)', done: false },
      { id: 'ck2', text: 'Nhớ lại sự khác biệt giữa Rule, Workflow và Agent', done: false },
      { id: 'ck3', text: 'Chuẩn bị 1 bài toán thực tế tại doanh nghiệp bạn để áp dụng PAIR Framework ở Day 02', done: false }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Tại sao giới hạn Hallucination của Day 01 lại dẫn đến việc chọn Augment ở Day 02 khi cost-of-error cao?',
        options: [
          'Vì Augment giúp AI tự động chạy 100% không cần người duyệt.',
          'Vì khi AI sai có thể gây hậu quả nghiêm trọng, cần con người kiểm tra (Human-in-the-loop).',
          'Vì Augment giảm chi phí Token hơn Automate.',
          'Vì Augment không cần dùng Prompt 4 lớp.'
        ],
        correctAnswer: 1,
        explanation: 'Chính xác! Khi cost-of-error cao (do nguy cơ hallucination), thiết kế Augment giữ con người trong vòng lặp để verify kết quả.'
      }
    ]
  },
  lowConfidence: {
    pathName: 'Low Confidence Path (Lớp ② - Mơ hồ / Thiếu data)',
    status: 'warning',
    badgeClass: 'badge-warning',
    confidenceScore: 0.45,
    warningMessage: '⚠️ Dữ liệu transcript bài giảng Day 01 hiện chưa đầy đủ hoặc có khoảng trống thông tin. Hệ thống đã chuyển sang chế độ fallback dùng Slide chính thức.',
    recap: [
      {
        id: 1,
        text: 'Nền tảng LLM & Tokenomics cơ bản (Tổng hợp từ Slide gốc).',
        citation: 'Day 01 - Slide Hackathon',
        refId: 'slide-pack'
      },
      {
        id: 2,
        text: 'Cấu trúc 4 Level Agent cơ bản.',
        citation: 'Day 01 - Slide Hackathon',
        refId: 'slide-pack'
      }
    ],
    bridgeLinks: [
      {
        id: 'b1',
        sourceConcept: 'Slide Nền tảng AI',
        sourceRef: 'Day 01 - slide 01-15',
        targetConcept: 'Slide Xác định bài toán',
        targetRef: 'Day 02 - slide 01-10',
        explanation: 'Mối liên kết giữa các khái niệm chưa đủ căn cứ chi tiết từ transcript nói. Khuyến nghị học viên mở trực tiếp Slide gốc để xem thêm.'
      }
    ],
    checklist: [
      { id: 'ck1', text: 'Xem file slide gốc d1-slide-hackathon.pdf', done: false },
      { id: 'ck2', text: 'Gửi câu hỏi cho TA nếu cần làm rõ đoạn transcript thiếu', done: false }
    ],
    quiz: []
  },
  failure: {
    pathName: 'Failure Path (Lớp ① - Không căn cứ / Ít overlap)',
    status: 'info',
    badgeClass: 'badge-info',
    confidenceScore: 0.1,
    infoMessage: 'ℹ️ AI nhận diện 2 buổi học này thuộc 2 chủ đề hoàn toàn độc lập và có ít overlap kiến thức trực tiếp. Hệ thống từ chối tự tạo liên kết giả (Tuân thủ Nguyên tắc G10 - Tránh Hallucination).',
    recap: [
      {
        id: 1,
        text: 'Nội dung Buổi học A và Buổi học B không chứa các khái niệm giao thoa trực tiếp.',
        citation: 'Hệ thống kiểm chứng Nguồn sự thật',
        refId: 'truth-source'
      }
    ],
    bridgeLinks: [],
    checklist: [
      { id: 'ck1', text: 'Bạn có thể bắt đầu bài học mới ngay mà không cần ôn lại buổi trước.', done: false }
    ],
    quiz: []
  },
  boundary: {
    pathName: 'Boundary / Out of Scope (Lớp ③ & ④ - Ngoài phạm vi / Đặc thù domain)',
    status: 'danger',
    badgeClass: 'badge-danger',
    confidenceScore: 0.0,
    errorMessage: '🚫 Từ chối xử lý: Yêu cầu nằm ngoài phạm vi hỗ trợ nội dung khóa học AI Thực Chiến hoặc cố tình yêu cầu AI làm bài tập hộ.',
    recap: [],
    bridgeLinks: [],
    checklist: [],
    quiz: []
  }
};
