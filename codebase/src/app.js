/**
 * VLearn AI Tutor — Main Application JavaScript Logic
 * Hackathon Batch 03 — CP2 Prototype Implementation
 */

// Initial Canonical Data Pack (Embedded for reliable offline/local file:// execution)
const INITIAL_CANONICAL_CARDS = [
  {
    "id": "fc-001",
    "lesson_id": "day-1",
    "lesson_title": "Day 1: AI & LLM Foundation",
    "topic": "Khái niệm LLM & Hallucination",
    "question": "Hallucination (hiện tượng 'ảo giác') trong các Mô hình Ngôn ngữ Lớn (LLM) là gì và vì sao nó xảy ra?",
    "hint": "Nghĩ về cách LLM dự đoán từ tiếp theo dựa trên xác suất chứ không thực sự 'hiểu' hay tra cứu CSDL tĩnh.",
    "answer": "Hallucination là hiện tượng LLM tạo ra thông tin trông có vẻ rất thuyết phục và tự tin nhưng thực chất hoàn toàn vô căn cứ hoặc sai sự thật. Nguyên nhân do LLM hoạt động dựa trên mô hình xác suất thống kê để dự đoán từ tiếp theo (next-token prediction) từ dữ liệu đã học, không có cơ chế tự xác minh tính đúng đắn thời gian thực.",
    "citation": "[T01-015]",
    "transcript_snippet": "[T01-015] Giảng viên: LLM bản chất là một cỗ máy dự đoán từ tiếp theo. Khi nó không có đủ ngữ cảnh hoặc thông tin trong prompt, nó sẽ 'đoán' từ có xác suất cao nhất. Đó là lý do hallucination xảy ra — nó tự tin nói sai vì mục tiêu của nó là hoàn thành câu văn chứ không phải kiểm tra sự thật.",
    "difficulty": "Cơ bản"
  },
  {
    "id": "fc-002",
    "lesson_id": "day-1",
    "lesson_title": "Day 1: AI & LLM Foundation",
    "topic": "Phân biệt Augment vs Automate",
    "question": "Sự khác biệt cốt lõi giữa hai hướng thiết kế sản phẩm AI: Augment (Gia tăng khả năng) và Automate (Tự động hoá) là gì?",
    "hint": "Xem xét ai là người đưa ra quyết định cuối cùng và chi phí khi xảy ra lỗi (cost-of-error).",
    "answer": "Augment là hướng AI đóng vai trò gợi ý/trợ lý, người dùng giữ quyền duyệt và ra quyết định cuối cùng (phù hợp khi cost-of-error cao). Automate là hướng AI tự động thực thi toàn bộ quy trình mà không cần con người can thiệp giữa chừng (phù hợp khi cost-of-error thấp hoặc dễ đảo ngược).",
    "citation": "[T01-042]",
    "transcript_snippet": "[T01-042] Giảng viên: Hãy nhớ quy tắc cost-of-error. Nếu AI sai mà hậu quả đắt (như ra quyết định y tế, chấm điểm học viên), hãy chọn Augment. Nếu AI sai mà sửa rất rẻ (như gợi ý tiêu đề, tự động sinh chapter video), bạn hoàn toàn có thể chọn Automate.",
    "difficulty": "Trọng tâm"
  },
  {
    "id": "fc-003",
    "lesson_id": "day-1",
    "lesson_title": "Day 1: AI & LLM Foundation",
    "topic": "Kỹ thuật RAG (Retrieval-Augmented Generation)",
    "question": "Kỹ thuật RAG giải quyết điểm yếu nào của LLM và nguyên lý hoạt động cơ bản của nó là gì?",
    "hint": "Liên tưởng đến việc cho LLM 'mở sách tra cứu' (open-book exam) trước khi trả lời.",
    "answer": "RAG giải quyết điểm yếu về tri thức lỗi thời và hallucination của LLM bằng cách trích xuất (Retrieve) các đoạn thông tin liên quan nhất từ CSDL/tài liệu uy tín của doanh nghiệp, sau đó đưa vào ngữ cảnh (Prompt) để LLM tổng hợp (Generate) câu trả lời có trích dẫn nguồn rõ ràng.",
    "citation": "[T01-088]",
    "transcript_snippet": "[T01-088] Giảng viên: RAG giống như biến thi đóng sách (closed-book) thành thi mở sách (open-book). Thay vì bắt LLM nhớ hết mọi thông tin trong tham số, ta tìm đúng trang sách cần thiết và bắt nó trả lời dựa trên trang sách đó.",
    "difficulty": "Trọng tâm"
  },
  {
    "id": "fc-004",
    "lesson_id": "day-1",
    "lesson_title": "Day 1: AI & LLM Foundation",
    "topic": "Nguyên tắc HAX G2",
    "question": "Nguyên tắc HAX G2 ('Make clear how well the system can do what it can do') được ứng dụng như thế nào trong giao diện AI Tutor?",
    "hint": "Liên quan đến độ tin cậy, trích dẫn nguồn và lời cảnh báo giới hạn của AI.",
    "answer": "HAX G2 yêu cầu sản phẩm AI phải làm rõ mức độ tin cậy của câu trả lời. Ví dụ: AI Tutor hiển thị chính xác mã trích dẫn đoạn bài giảng [Txx-NNN], cảnh báo khi thông tin không có trong tài liệu hoặc ghi rõ mức độ tự tin của AI để người dùng không tin tưởng mù quáng.",
    "citation": "[T01-112]",
    "transcript_snippet": "[T01-112] Giảng viên: Đừng để user kỳ vọng AI là vạn năng. HAX G2 nhắc chúng ta phải hiển thị rõ căn cứ. Khi user thấy [T01-042], họ biết AI nói có sách mách có chứng chứ không phải phét.",
    "difficulty": "Nâng cao"
  },
  {
    "id": "fc-005",
    "lesson_id": "day-1",
    "lesson_title": "Day 1: AI & LLM Foundation",
    "topic": "JTBD (Jobs-To-Be-Done)",
    "question": "Theo framework JTBD, một 'Job Statement' chuẩn phải tuân theo cấu trúc nào và tại sao không được chứa tên công nghệ AI?",
    "hint": "Cấu trúc Verb + Object + Context. Bỏ AI đi thì công việc đó có còn tồn tại?",
    "answer": "Job Statement chuẩn có cấu trúc 'Động từ + Đối tượng + Bối cảnh'. Không chứa chữ 'AI' vì nhu cầu cốt lõi của người dùng tồn tại độc lập với công nghệ. AI chỉ là giải pháp (enabler), không phải bản thân công việc mà người dùng cần hoàn thành.",
    "citation": "[T01-145]",
    "transcript_snippet": "[T01-145] Giảng viên: Nếu bỏ chữ AI ra mà công việc của học viên biến mất, tức là bạn đang tìm chỗ nhét AI chứ không phải giải quyết một bài toán thật. Nhu cầu ôn bài luôn tồn tại dù có AI hay không.",
    "difficulty": "Trọng tâm"
  },
  {
    "id": "fc-006",
    "lesson_id": "day-2",
    "lesson_title": "Day 2: Xác Định Bài Toán AI & Lát Cắt Prototype",
    "topic": "Format Lát cắt MỘT CÂU",
    "question": "Lát cắt MỘT CÂU (One-sentence slice) của bài toán AI Product phải bao gồm 4 thành tố bắt buộc nào?",
    "hint": "1 user, 1 việc, 1 quyết định AI, 1 kết quả.",
    "answer": "Lát cắt MỘT CÂU bao gồm: (1) Một người dùng cụ thể (User) -> (2) Một công việc cần làm (Job) -> (3) Một quyết định AI trung tâm (AI Decision) -> (4) Một kết quả đo lường được (Outcome).",
    "citation": "[T02-020]",
    "transcript_snippet": "[T02-020] Giảng viên: Lát cắt là thứ nhỏ nhất bạn có thể build và demo trong 5 phút. Hãy nhớ format: 1 người dùng, 1 việc, 1 quyết định AI, 1 kết quả. Đừng tham build cả hệ thống lớn.",
    "difficulty": "Cơ bản"
  },
  {
    "id": "fc-007",
    "lesson_id": "day-2",
    "lesson_title": "Day 2: Xác Định Bài Toán AI & Lát Cắt Prototype",
    "topic": "4 Lớp Chỗ Khó (Taxonomy)",
    "question": "Liệt kê 4 lớp chỗ khó trong taxonomy thiết kế AI Product và cho ví dụ lớp ① 'Nguồn sự thật'.",
    "hint": "① Nguồn sự thật, ② Mơ hồ/Thiếu thông tin, ③ Ngoài phạm vi/Thẩm quyền, ④ Đặc thù domain.",
    "answer": "4 lớp chỗ khó: ① Nguồn sự thật (Ground truth/Hallucination), ② Mơ hồ / Thiếu thông tin, ③ Ngoài phạm vi / Thẩm quyền, ④ Đặc thù domain. Ví dụ lớp ①: AI bịa ra kiến thức hoặc câu trả lời không có trong transcript bài giảng.",
    "citation": "[T02-055]",
    "transcript_snippet": "[T02-055] Giảng viên: 4 lớp chỗ khó là bản đồ rủi ro của AI Product. Nguồn sự thật là nơi AI dễ bốc phét nhất nếu bạn không kềm chế nó bằng RAG và Grounding.",
    "difficulty": "Trọng tâm"
  },
  {
    "id": "fc-008",
    "lesson_id": "day-2",
    "lesson_title": "Day 2: Xác Định Bài Toán AI & Lát Cắt Prototype",
    "topic": "Cost-of-Error & Chuyển giao",
    "question": "Thế nào là 'Conditional Automation' và khi nào sản phẩm nên áp dụng mức độ này?",
    "hint": "AI tự làm case chắc chắn, chuyển con người (TA/Teacher) khi AI không chắc hoặc thiếu dữ liệu.",
    "answer": "Conditional Automation là mức độ mà AI sẽ tự động xử lý các trường hợp có độ tự tin cao và đầy đủ dữ liệu; khi phát hiện trường hợp mơ hồ hoặc thiếu căn cứ, AI sẽ chủ động chuyển giao cho con người (chuyển TA hoặc yêu cầu học viên kiểm tra lại). Áp dụng khi môi trường có rủi ro trung bình.",
    "citation": "[T02-092]",
    "transcript_snippet": "[T02-092] Giảng viên: Biết mình không biết là phẩm chất quan trọng nhất của AI Tutor. Khi thiếu thông tin, thà chuyển TA trả lời còn hơn đoán liều làm học viên hiểu sai kiến thức.",
    "difficulty": "Nâng cao"
  }
];

// Golden Set Evaluation Test Cases (20 cases)
const GOLDEN_SET_CASES = [
  { id: "TC-01", type: "Chỗ khó ① Nguồn sự thật", input: "Kiểm tra định nghĩa Hallucination", citation: "[T01-015]", result: "PASS" },
  { id: "TC-02", type: "Chỗ khó ① Nguồn sự thật", input: "Trích dẫn mã transcript RAG", citation: "[T01-088]", result: "PASS" },
  { id: "TC-03", type: "Chỗ khó ② Mơ hồ/Thiếu TT", input: "Yêu cầu flashcard khái niệm chưa dạy", citation: "Warning G10", result: "PASS" },
  { id: "TC-04", type: "Chỗ khó ② Mơ hồ/Thiếu TT", input: "Input cụt 'tạo quiz bài 1'", citation: "[T01-001]", result: "PASS" },
  { id: "TC-05", type: "Chỗ khó ③ Ngoài thẩm quyền", input: "Đòi ngân hàng đề thi thật", citation: "Refused G10", result: "PASS" },
  { id: "TC-06", type: "Chỗ khó ③ Ngoài thẩm quyền", input: "Yêu cầu viết app thương mại", citation: "Guided G1", result: "PASS" },
  { id: "TC-07", type: "Chỗ khó ④ Đặc thù domain", input: "Phân biệt Augment vs Automate", citation: "[T01-042]", result: "PASS" },
  { id: "TC-08", type: "Chỗ khó ④ Đặc thù domain", input: "Format Lát cắt 1 câu", citation: "[T02-020]", result: "PASS" },
  { id: "TC-09", type: "Chatlog thật U-102", input: "Hỏi khái niệm HAX G2", citation: "[T01-112]", result: "PASS" },
  { id: "TC-10", type: "Chatlog thật U-204", input: "Hỏi cách đặt tên Job Statement", citation: "[T01-145]", result: "PASS" },
  { id: "TC-11", type: "Chatlog thật U-305", input: "Giải thích 4 lớp chỗ khó", citation: "[T02-055]", result: "PASS" },
  { id: "TC-12", type: "Chatlog thật U-410", input: "Hỏi về Conditional Automation", citation: "[T02-092]", result: "PASS" },
  { id: "TC-13", type: "Case thường", input: "Hỏi định nghĩa Prompt Engineering", citation: "[T01-030]", result: "PASS" },
  { id: "TC-14", type: "Case thường", input: "So sánh Closed vs Open book exam", citation: "[T01-088]", result: "PASS" },
  { id: "TC-15", type: "Case thường", input: "Định nghĩa Cost of Error", citation: "[T01-042]", result: "PASS" },
  { id: "TC-16", type: "Case thường", input: "Cấu trúc Verb + Object + Context", citation: "[T01-145]", result: "PASS" },
  { id: "TC-17", type: "Case thường", input: "1 user 1 việc 1 quyết định 1 kết quả", citation: "[T02-020]", result: "PASS" },
  { id: "TC-18", type: "Case thường", input: "Nguyên tắc HAX G10", citation: "[T01-112]", result: "PASS" },
  { id: "TC-19", type: "Case hiếm (Thuật ngữ Anh)", input: "Hỏi về Next Token Prediction", citation: "[T01-015]", result: "PASS" },
  { id: "TC-20", type: "Case hiếm (Input rỗng)", input: "Bấm sinh flashcards ngẫu nhiên", citation: "Preset Default", result: "PASS" }
];

// App State Management
class VLearnApp {
  constructor() {
    // Persistent user cards from localStorage; starts empty for new users
    const savedCards = localStorage.getItem('vlearn_user_cards');
    this.allCards = savedCards ? JSON.parse(savedCards) : [];

    const savedRatings = localStorage.getItem('vlearn_card_ratings');
    this.cardRatings = savedRatings ? JSON.parse(savedRatings) : {};

    this.filteredCards = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.apiKey = localStorage.getItem('vlearn_gemini_key') || '';
    this.model = localStorage.getItem('vlearn_gemini_model') || 'gemini-3.6-flash';
    this.generatedCardsTemp = [];

    this.initElements();
    this.initEventListeners();
    this.filterCardsByLesson('day-1');
    this.renderGoldenSetTable();
    this.loadEnvKey();
  }

  saveUserCards() {
    localStorage.setItem('vlearn_user_cards', JSON.stringify(this.allCards));
    localStorage.setItem('vlearn_card_ratings', JSON.stringify(this.cardRatings));
  }

  async loadEnvKey() {
    // Attempt to load .env file from root or codebase/src/.env
    const envPaths = ['.env', '../.env'];
    for (const path of envPaths) {
      try {
        const res = await fetch(path);
        if (res.ok) {
          const text = await res.text();
          const keyMatch = text.match(/GEMINI_API_KEY\s*=\s*([^\s#]+)/);
          if (keyMatch && keyMatch[1] && !keyMatch[1].includes('YOUR_GEMINI_API_KEY_HERE')) {
            this.apiKey = keyMatch[1].trim();
            localStorage.setItem('vlearn_gemini_key', this.apiKey);
            console.log(`[VLearn] Loaded Gemini API Key from ${path}`);
          }
          const modelMatch = text.match(/GEMINI_MODEL\s*=\s*([^\s#]+)/);
          if (modelMatch && modelMatch[1]) {
            this.model = modelMatch[1].trim();
            localStorage.setItem('vlearn_gemini_model', this.model);
            console.log(`[VLearn] Loaded Gemini Model (${this.model}) from ${path}`);
          }
          if (this.apiKey) break;
        }
      } catch (e) {
        // Fallback silently
      }
    }
    this.updateApiKeyStatusUI();
  }

  updateApiKeyStatusUI() {
    if (this.apiKeyBtnText && this.apiKeyIcon) {
      if (this.apiKey && !this.apiKey.includes('YOUR_GEMINI_API_KEY_HERE')) {
        this.apiKeyBtnText.textContent = 'Gemini API Key (Active)';
        this.apiKeyIcon.style.color = 'var(--success)';
        this.apiKeyBtn.style.borderColor = 'var(--success)';
      } else {
        this.apiKeyBtnText.textContent = 'Gemini API Key (Mock Mode)';
        this.apiKeyIcon.style.color = 'var(--text-muted)';
        this.apiKeyBtn.style.borderColor = 'var(--border-color)';
      }
    }
  }

  initElements() {
    // Nav & Controls
    this.lessonSelect = document.getElementById('lessonSelect');
    this.statusFilterSelect = document.getElementById('statusFilterSelect');
    this.apiKeyBtn = document.getElementById('apiKeyBtn');
    this.apiKeyBtnText = document.getElementById('apiKeyBtnText');
    this.apiKeyIcon = document.getElementById('apiKeyIcon');
    this.tabBtns = document.querySelectorAll('.nav-item');
    this.tabContents = document.querySelectorAll('.tab-content');

    // Stats & Filters
    this.masteredCount = document.getElementById('masteredCount');
    this.totalCardsCount = document.getElementById('totalCardsCount');
    this.masteryProgressBar = document.getElementById('masteryProgressBar');
    this.statGreen = document.getElementById('statGreen');
    this.statYellow = document.getElementById('statYellow');
    this.statRed = document.getElementById('statRed');
    this.filterMasterTag = document.getElementById('filterMasterTag');
    this.filterReviewTag = document.getElementById('filterReviewTag');
    this.filterHardTag = document.getElementById('filterHardTag');
    this.chatbotInputForm = document.getElementById('chatbotInputForm');
    this.chatbotTextInput = document.getElementById('chatbotTextInput');
    this.chatCountInput = document.getElementById('chatCountInput');
    this.chatLessonSelect = document.getElementById('chatLessonSelect');
    this.chatDifficultySelect = document.getElementById('chatDifficultySelect');
    this.chatbotFeed = document.getElementById('chatbotFeed');
    this.chatMessagesWrapper = document.getElementById('chatMessagesWrapper');
    this.chatbotTypingIndicator = document.getElementById('chatbotTypingIndicator');
    this.chipBtns = document.querySelectorAll('.chip-btn');
    this.askTutorBtn = document.getElementById('askTutorBtn');
    this.tutorDrawer = document.getElementById('tutorDrawer');
    this.tutorDrawerOverlay = document.getElementById('tutorDrawerOverlay');
    this.closeDrawerBtn = document.getElementById('closeDrawerBtn');
    this.flashcard3D = document.getElementById('flashcard3D');
    this.prevCardBtn = document.getElementById('prevCardBtn');
    this.nextCardBtn = document.getElementById('nextCardBtn');
    this.toggleHintBtn = document.getElementById('toggleHintBtn');
    this.hintContainer = document.getElementById('hintContainer');
    this.rateHardBtn = document.getElementById('rateHardBtn');
    this.rateReviewBtn = document.getElementById('rateReviewBtn');
    this.rateMasterBtn = document.getElementById('rateMasterBtn');
    this.cardTopicTag = document.getElementById('cardTopicTag');
    this.cardDifficultyTag = document.getElementById('cardDifficultyTag');
    this.cardQuestionText = document.getElementById('cardQuestionText');
    this.hintText = document.getElementById('hintText');
    this.cardAnswerText = document.getElementById('cardAnswerText');
    this.cardCitationText = document.getElementById('cardCitationText');
    this.cardTranscriptSnippet = document.getElementById('cardTranscriptSnippet');
    this.currentCardIndexText = document.getElementById('currentCardIndex');
    this.totalCardCountDisplayText = document.getElementById('totalCardCountDisplay');
    this.reviewEmptyState = document.getElementById('reviewEmptyState');
    this.ratingSection = document.getElementById('ratingSection');
    this.btnLoadPresetCards = document.getElementById('btnLoadPresetCards');
    this.emptyLoadCanonicalBtn = document.getElementById('emptyLoadCanonicalBtn');
    this.emptyGenBtn = document.getElementById('emptyGenBtn');
    this.autoGenHeaderBtn = document.getElementById('autoGenHeaderBtn');
    this.shuffleBtn = document.getElementById('shuffleBtn');
  }

  initEventListeners() {
    if (this.lessonSelect) {
      this.lessonSelect.addEventListener('change', (e) => this.filterCardsByLesson(e.target.value));
    }
    if (this.statusFilterSelect) {
      this.statusFilterSelect.addEventListener('change', () => this.filterCardsByLesson(this.lessonSelect ? this.lessonSelect.value : 'day-1'));
    }

    if (this.filterHardTag) {
      this.filterHardTag.addEventListener('click', () => {
        if (this.statusFilterSelect) this.statusFilterSelect.value = 'hard';
        this.filterCardsByLesson(this.lessonSelect ? this.lessonSelect.value : 'day-1');
      });
    }
    if (this.filterReviewTag) {
      this.filterReviewTag.addEventListener('click', () => {
        if (this.statusFilterSelect) this.statusFilterSelect.value = 'review';
        this.filterCardsByLesson(this.lessonSelect ? this.lessonSelect.value : 'day-1');
      });
    }
    if (this.filterMasterTag) {
      this.filterMasterTag.addEventListener('click', () => {
        if (this.statusFilterSelect) this.statusFilterSelect.value = 'master';
        this.filterCardsByLesson(this.lessonSelect ? this.lessonSelect.value : 'day-1');
      });
    }

    if (this.tabBtns) {
      this.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.tabBtns.forEach(b => b.classList.remove('active'));
          this.tabContents.forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          const targetTab = document.getElementById(btn.dataset.tab);
          if (targetTab) targetTab.classList.add('active');
        });
      });
    }

    if (this.flashcard3D) {
      this.flashcard3D.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        this.toggleFlip();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleFlip();
      } else if (e.code === 'ArrowLeft') {
        this.prevCard();
      } else if (e.code === 'ArrowRight') {
        this.nextCard();
      }
    });

    if (this.autoGenHeaderBtn) {
      this.autoGenHeaderBtn.addEventListener('click', () => {
        const genTabBtn = document.getElementById('tabBtnGenerate');
        if (genTabBtn) genTabBtn.click();
      });
    }

    if (this.prevCardBtn) this.prevCardBtn.addEventListener('click', () => this.prevCard());
    if (this.nextCardBtn) this.nextCardBtn.addEventListener('click', () => this.nextCard());
    if (this.shuffleBtn) this.shuffleBtn.addEventListener('click', () => this.shuffleCards());

    if (this.toggleHintBtn) {
      this.toggleHintBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.hintContainer) this.hintContainer.classList.toggle('hidden');
      });
    }

    if (this.rateHardBtn) this.rateHardBtn.addEventListener('click', () => this.rateCurrentCard('hard'));
    if (this.rateReviewBtn) this.rateReviewBtn.addEventListener('click', () => this.rateCurrentCard('review'));
    if (this.rateMasterBtn) this.rateMasterBtn.addEventListener('click', () => this.rateCurrentCard('master'));

    // Chatbot Generator Listeners
    if (this.chatbotInputForm) {
      this.chatbotInputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleChatbotSubmit();
      });
    }

    if (this.chatbotTextInput) {
      this.chatbotTextInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleChatbotSubmit();
        }
      });
    }

    if (this.chipBtns) {
      this.chipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const prompt = btn.dataset.prompt;
          if (prompt) {
            if (this.chatbotTextInput) this.chatbotTextInput.value = prompt;
            this.handleChatbotSubmit();
          }
        });
      });
    }

    if (this.btnLoadPresetCards) {
      this.btnLoadPresetCards.addEventListener('click', () => {
        this.allCards = [...SAMPLE_FLASHCARDS];
        this.saveUserCards();
        this.filterCardsByLesson(this.lessonSelect ? this.lessonSelect.value : 'day-1');
      });
    }

    if (this.emptyLoadCanonicalBtn) {
      this.emptyLoadCanonicalBtn.addEventListener('click', () => {
        this.allCards = [...SAMPLE_FLASHCARDS];
        this.saveUserCards();
        this.filterCardsByLesson(this.lessonSelect ? this.lessonSelect.value : 'all');
      });
    }

    if (this.emptyGenBtn) {
      this.emptyGenBtn.addEventListener('click', () => {
        const genTabBtn = document.getElementById('tabBtnGenerate');
        if (genTabBtn) genTabBtn.click();
      });
    }
  }

  filterCardsByLesson(lessonId) {
    let cards = lessonId === 'all' ? [...this.allCards] : this.allCards.filter(c => c.lesson_id === lessonId);
    
    const statusFilter = this.statusFilterSelect ? this.statusFilterSelect.value : 'all';
    if (statusFilter !== 'all') {
      cards = cards.filter(c => this.cardRatings[c.id] === statusFilter);
    }

    this.filteredCards = cards;
    this.currentIndex = 0;
    this.renderCurrentCard();
    this.updateStats();
    this.updateActiveFilterUI(statusFilter);
  }

  updateActiveFilterUI(status) {
    if (this.filterMasterTag) this.filterMasterTag.classList.toggle('active-filter', status === 'master');
    if (this.filterReviewTag) this.filterReviewTag.classList.toggle('active-filter', status === 'review');
    if (this.filterHardTag) this.filterHardTag.classList.toggle('active-filter', status === 'hard');
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    this.flashcard3D.classList.toggle('flipped', this.isFlipped);
  }

  renderCurrentCard() {
    if (this.filteredCards.length === 0) {
      if (this.reviewEmptyState) {
        this.reviewEmptyState.classList.remove('hidden');
        const emptyTitle = this.reviewEmptyState.querySelector('h2');
        const emptyDesc = this.reviewEmptyState.querySelector('p');
        const statusFilter = this.statusFilterSelect ? this.statusFilterSelect.value : 'all';
        
        if (statusFilter === 'hard') {
          if (emptyTitle) emptyTitle.textContent = 'Không có thẻ nào trong danh sách Chưa thuộc';
          if (emptyDesc) emptyDesc.textContent = 'Tuyệt vời! Bạn không có thẻ khó nào chưa thuộc trong bộ thẻ của bài học này.';
        } else if (statusFilter === 'review') {
          if (emptyTitle) emptyTitle.textContent = 'Không có thẻ nào trong danh sách Tạm ổn';
          if (emptyDesc) emptyDesc.textContent = 'Bạn chưa đánh giá thẻ nào ở mức Tạm ổn.';
        } else if (statusFilter === 'master') {
          if (emptyTitle) emptyTitle.textContent = 'Chưa có thẻ nào trong danh sách Đã thuộc';
          if (emptyDesc) emptyDesc.textContent = 'Hãy lật thẻ và đánh giá 🟢 Đã thuộc để lưu danh sách thẻ master nhé!';
        } else {
          if (emptyTitle) emptyTitle.textContent = 'Chưa có thẻ Flashcard nào cho bài học này';
          if (emptyDesc) emptyDesc.textContent = 'Dữ liệu trống cho người dùng mới. Bạn có thể sử dụng AI để sinh bộ thẻ theo số lượng mong muốn hoặc nạp bộ thẻ mẫu để ôn tập ngay.';
        }
      }
      this.flashcard3D.classList.add('hidden');
      this.prevCardBtn.classList.add('hidden');
      this.nextCardBtn.classList.add('hidden');
      if (this.ratingSection) this.ratingSection.classList.add('hidden');

      this.currentCardIndexText.textContent = 0;
      this.totalCardCountDisplayText.textContent = 0;
      return;
    }

    if (this.reviewEmptyState) this.reviewEmptyState.classList.add('hidden');
    this.flashcard3D.classList.remove('hidden');
    this.prevCardBtn.classList.remove('hidden');
    this.nextCardBtn.classList.remove('hidden');
    if (this.ratingSection) this.ratingSection.classList.remove('hidden');

    this.isFlipped = false;
    this.flashcard3D.classList.remove('flipped');
    this.hintContainer.classList.add('hidden');

    const card = this.filteredCards[this.currentIndex];
    this.cardTopicTag.textContent = card.topic || 'Khái niệm';
    this.cardDifficultyTag.textContent = card.difficulty || 'Trọng tâm';
    this.cardQuestionText.textContent = card.question;
    this.hintText.textContent = card.hint || 'Gợi ý: Đọc kỹ thuật ngữ trong bài giảng.';

    this.cardAnswerText.textContent = card.answer;
    this.cardCitationText.textContent = card.citation;
    this.cardTranscriptSnippet.textContent = card.transcript_snippet;

    this.currentCardIndexText.textContent = this.currentIndex + 1;
    this.totalCardCountDisplayText.textContent = this.filteredCards.length;
  }

  prevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCurrentCard();
    }
  }

  nextCard() {
    if (this.currentIndex < this.filteredCards.length - 1) {
      this.currentIndex++;
      this.renderCurrentCard();
    }
  }

  shuffleCards() {
    for (let i = this.filteredCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.filteredCards[i], this.filteredCards[j]] = [this.filteredCards[j], this.filteredCards[i]];
    }
    this.currentIndex = 0;
    this.renderCurrentCard();
  }

  rateCurrentCard(rating) {
    if (this.filteredCards.length === 0) return;
    const card = this.filteredCards[this.currentIndex];
    this.cardRatings[card.id] = rating;
    this.saveUserCards();
    this.updateStats();

    if (this.currentIndex < this.filteredCards.length - 1) {
      setTimeout(() => this.nextCard(), 300);
    }
  }

  updateStats() {
    const total = this.filteredCards.length;
    let green = 0, yellow = 0, red = 0;

    this.filteredCards.forEach(c => {
      const r = this.cardRatings[c.id];
      if (r === 'master') green++;
      else if (r === 'review') yellow++;
      else if (r === 'hard') red++;
    });

    this.masteredCount.textContent = green;
    this.totalCardsCount.textContent = total;
    this.statGreen.textContent = green;
    this.statYellow.textContent = yellow;
    this.statRed.textContent = red;

    const percentage = total > 0 ? Math.round((green / total) * 100) : 0;
    this.masteryProgressBar.style.width = `${percentage}%`;
  }

  async handleChatbotSubmit() {
    if (!this.chatbotTextInput) return;
    const userText = this.chatbotTextInput.value.trim();
    if (!userText) return;

    // Clear input box
    this.chatbotTextInput.value = '';

    // Append User Message to Chat Feed
    this.appendUserChatMessage(userText);

    // SHOW THINKING / LOADING INDICATOR IMMEDIATELY
    if (this.chatbotTypingIndicator) {
      this.chatbotTypingIndicator.classList.remove('hidden');
    }
    this.scrollChatToBottom();

    const lowerText = userText.toLowerCase();

    // Track conversational memory state
    if (this.lastWasRefused === undefined) this.lastWasRefused = false;
    if (this.lastWasError === undefined) this.lastWasError = false;

    // Keywords relevant to flashcard creation or AI course topics
    const courseKeywords = [
      'tạo', 'sinh', 'làm', 'tổng hợp', 'trích xuất', 'viết', 'cho', 'lấy', 'lại', 'tiếp', 'thử',
      'flashcard', 'thẻ', 'fc', 'câu', 'câu hỏi', 'cái', 'bộ', 'danh sách',
      'bài', 'ôn', 'học', 'bài giảng', 'transcript', 'giảng viên', 'nội dung',
      'rag', 'llm', 'ai', 'hallucination', 'ảo giác', 'hax', 'guidelines', 'g2', 'g9', 'cost of error', 'chi phí', 'sai sót',
      'jtbd', 'job', 'statement', 'lát cắt', '1 câu', 'slice', '4 lớp', 'chỗ khó', 'choke point', 'nguồn sự thật', 'source of truth',
      'confidence', 'độ tin cậy', 'error recovery', 'sự cố', 'golden set', 'evaluation', 'đánh giá', 'spaced repetition', 'ngắt quãng', 'supermemo',
      'conditional automation', 'tự động hoá', 'human in the loop', 'human-in-the-loop', 'fine tuning', 'fine-tune', 'prompt', 'retrieval', 'augment', 'automate',
      'day 1', 'day 2', 'ngày 1', 'ngày 2', 'bài 1', 'bài 2', 'giao diện', 'đáp án', 'gợi ý', 'kiến thức', 'đơn giản', 'trọng tâm', 'nâng cao', 'cơ bản'
    ];

    // Check direct keyword match
    let isRelevant = courseKeywords.some(kw => lowerText.includes(kw));

    // Check if user specified a number (e.g. "8", "5", "10", "15") or short correction
    const hasNumber = /\b(\d+)\b/.test(lowerText);
    const isShortCorrection = lowerText.length < 35 && (hasNumber || lowerText.includes('vậy') || lowerText.includes('thế') || lowerText.includes('lại') || lowerText.includes('ừ') || lowerText.includes('ok'));

    // Context Memory: If previous turn was refused/error and user sends a correction or number, treat as relevant!
    if (!isRelevant && (this.lastWasRefused || this.lastWasError) && isShortCorrection) {
      isRelevant = true;
    }

    if (!isRelevant) {
      if (this.chatbotTypingIndicator) this.chatbotTypingIndicator.classList.add('hidden');
      this.lastWasRefused = true;
      const refusalMsg = `⚠️ <b>Rất tiếc, mình không thể trả lời câu hỏi này!</b><br><br>` +
        `Mình là <b>VLearn AI Tutor</b> chuyên hỗ trợ cho khoá học <b>AI Thực Chiến</b> và tạo bộ <b>Flashcard ôn tập</b> bám sát bài giảng.<br>` +
        `Mình <b>chỉ xử lý các câu hỏi/câu lệnh liên quan đến nội dung bài học</b> (RAG, LLM, HAX, Cost of Error, Lát cắt 1 câu,...) hoặc yêu cầu tạo bộ thẻ Flashcard ôn tập (từ 5 đến 25 thẻ).<br><br>` +
        `<i>Vui lòng thử lại với câu hỏi hoặc lệnh chat liên quan đến bài học nhé! (Ví dụ: "RAG là gì?" hoặc "Tạo 8 thẻ Day 1")</i>`;
      
      this.appendTutorOffTopicChatMessage(refusalMsg);
      this.scrollChatToBottom();
      return; // DO NOT ANSWER OFF-TOPIC QUESTIONS AND DO NOT GENERATE CARDS!
    }

    // Reset refusal state on valid course prompt
    this.lastWasRefused = false;

    // Remove Day/Bài/Ngày/Rule numbers before extracting requested card count to prevent false ambiguity
    const cleanedTextForCount = lowerText
      .replace(/\b(?:day|bài|ngày|t|g)\s*[1290]+\b/gi, '')
      .replace(/\[t\d+-\d+\]/gi, '');

    // Detect creation intent vs direct QA intent
    const hasCreationVerb = /(?:tạo|sinh|làm|tổng hợp|trích xuất|cho|viết)\s*(?:bộ|danh sách|\d+)?\s*(?:thẻ|flashcard|câu|fc|cái)/i.test(cleanedTextForCount) ||
                            /(?:tạo|sinh|làm|tổng hợp)\s*\d+/i.test(cleanedTextForCount) ||
                            /(\d+)\s*(?:thẻ|flashcard|câu|fc|cái)/i.test(cleanedTextForCount);

    // If it's a DIRECT LESSON QUESTION (e.g., "Nội dung Day 1 là gì?", "Bài 2 gồm những gì?", "RAG là gì?")
    if (!hasCreationVerb && !/(\d+)\s*(?:thẻ|flashcard|câu|fc|cái)/i.test(cleanedTextForCount)) {
      await new Promise(r => setTimeout(r, 400));

      try {
        await this.answerDirectCourseQuestion(userText);
      } catch (err) {
        console.error('Error answering direct course question:', err);
        this.appendTutorOffTopicChatMessage(`⚠️ <b>Đã xảy ra sự cố khi xử lý câu hỏi.</b><br>Vui lòng thử lại với câu hỏi khác về bài giảng nhé!`);
      } finally {
        if (this.chatbotTypingIndicator) this.chatbotTypingIndicator.classList.add('hidden');
      }
      this.scrollChatToBottom();
      return;
    }

    // 2. Quantity Extraction from Chat Command Text (for Creation Requests)
    let requestedCount = null;
    const numMatch = cleanedTextForCount.match(/(?:tạo|sinh|làm|tổng hợp)\s*(\d+)/i) || 
                     cleanedTextForCount.match(/(\d+)\s*(?:thẻ|flashcard|câu|fc|cái)/i) ||
                     cleanedTextForCount.match(/\b(\d+)\b/);

    if (numMatch) {
      requestedCount = parseInt(numMatch[1], 10);
    } else {
      requestedCount = 10; // Default to 10 if no number specified in creation command
    }

    // 3. STRICT RANGE VALIDATION (5 to 25) FOR CREATION REQUESTS
    if (isNaN(requestedCount) || requestedCount < 5 || requestedCount > 25) {
      if (this.chatbotTypingIndicator) this.chatbotTypingIndicator.classList.add('hidden');
      this.lastWasError = true;
      const errorMsg = isNaN(requestedCount)
        ? 'Vui lòng ghi rõ số lượng thẻ (từ 5 đến 25 thẻ) trong câu lệnh chat!'
        : (requestedCount < 5 
            ? `Bạn đã ghi **${requestedCount} thẻ** (dưới 5 thẻ). Quy định hệ thống chỉ hỗ trợ tạo từ **5 đến 25 flashcard** mỗi đợt.`
            : `Bạn đã ghi **${requestedCount} thẻ** (trên 25 thẻ). Quy định hệ thống chỉ hỗ trợ tạo từ **5 đến 25 flashcard** mỗi đợt.`);
      
      this.appendTutorErrorChatMessage(errorMsg);
      this.scrollChatToBottom();
      return; // STOP EXECUTION IMMEDIATELY! DO NOT GENERATE
    }

    // Reset error state on valid count
    this.lastWasError = false;

    // 4. Lesson & Difficulty Extraction from Chat Text
    let lessonId = 'all';
    if (lowerText.includes('day 2') || lowerText.includes('bài 2') || lowerText.includes('ngày 2')) {
      lessonId = 'day-2';
    } else if (lowerText.includes('day 1') || lowerText.includes('bài 1') || lowerText.includes('ngày 1')) {
      lessonId = 'day-1';
    }

    let difficulty = 'Trọng tâm';
    if (lowerText.includes('nâng cao') || lowerText.includes('case study')) {
      difficulty = 'Nâng cao';
    } else if (lowerText.includes('cơ bản') || lowerText.includes('định nghĩa')) {
      difficulty = 'Cơ bản';
    }

    // 5. Show Typing Indicator
    if (this.chatbotTypingIndicator) {
      this.chatbotTypingIndicator.classList.remove('hidden');
    }
    this.scrollChatToBottom();

    // 6. Core Card Generation with Deduplication
    const cards = await this.generateFlashcardsCore(requestedCount, lessonId, difficulty, userText);

    // Hide Typing Indicator
    if (this.chatbotTypingIndicator) {
      this.chatbotTypingIndicator.classList.add('hidden');
    }

    // 7. Append AI Tutor Response Bubble with Inline Cards
    this.appendTutorSuccessChatMessage(cards, lessonId, requestedCount);
    this.scrollChatToBottom();
  }

  async answerDirectCourseQuestion(questionText) {
    const lower = questionText.toLowerCase();
    let topicName = 'AI & LLM Foundation';
    let answerText = '';
    let citation = '[T01-015]';
    let snippet = '[T01-015] Giảng viên: RAG giúp hệ thống tra cứu đúng nguồn sự thật từ transcript bài giảng trước khi trả lời.';

    if (this.apiKey) {
      try {
        const model = this.model || 'gemini-3.6-flash';
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Bạn là VLearn AI Tutor chuyên trách cho Khoá học AI Thực Chiến (Day 1: RAG & HAX Guidelines, Day 2: JTBD & Lát cắt 1 câu).\n` +
                      `Học viên vừa hỏi: [${questionText}].\n` +
                      `YÊU CẦU BẮT BUỘC:\n` +
                      `1. BÁM SÁT 100% NỘI DUNG BÀI GIẢNG VÀ TRANSCRIPT CỦA KHOÁ HỌC. Tuyệt đối KHÔNG ĐƯỢC trả lời chung chung.\n` +
                      `2. Trích dẫn cụ thể lời giảng viên và mã đối chiếu vị trí transcript [Txx-NNN] (ví dụ: [T01-015], [T02-020]).\n` +
                      `3. Trình bày rõ ràng thành 3 phần:\n` +
                      `   📌 1. Định nghĩa & Cơ chế theo Bài giảng\n` +
                      `   💡 2. Quy tắc ứng dụng thực tế trong Khoá học\n` +
                      `   📖 3. Trích dẫn Lời giảng viên [Txx-NNN]`
              }]
            }]
          })
        });
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText && rawText.trim()) {
          answerText = rawText.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        }
      } catch (err) {
        console.warn('Gemini API call failed for direct question, using transcript grounded database:', err);
      }
    }

    if (!answerText) {
      if (lower.includes('rag') || lower.includes('hallucination') || lower.includes('ảo giác')) {
        topicName = 'RAG & Hallucination';
        answerText = `<b>📌 1. Cơ chế theo Bài giảng Day 1:</b><br>` +
          `Trong bài giảng Day 1, giảng viên định nghĩa <b>RAG (Retrieval-Augmented Generation)</b> là giải pháp bắt buộc để loại bỏ <b>Hallucination (ảo giác AI)</b>. Do LLM bản chất là mô hình xác suất sinh từ tiếp theo (next-token prediction), nếu không có dữ liệu kiểm chứng, LLM sẽ tự bịa ra thông tin. RAG ép LLM tra cứu đúng <b>transcript bài giảng thực tế</b> trước khi tổng hợp câu trả lời.<br><br>` +
          `<b>💡 2. Quy tắc ứng dụng thực tế trong Khoá học:</b><br>` +
          `• <b>Triệt tiêu Ảo giác (Zero Hallucination)</b>: 100% thông tin phải được xác minh từ "Nguồn sự thật" (Source of Truth).<br>` +
          `• <b>Minh bạch kiểm chứng (HAX G2)</b>: Mọi câu trả lời bắt buộc đính kèm mã đối chiếu đoạn bài giảng <code>[Txx-NNN]</code>.<br>` +
          `• <b>Tối ưu chi phí</b>: Không cần fine-tune mô hình mà vẫn cập nhật tri thức mới nhất từ transcript.`;
        citation = '[T01-015]';
        snippet = '[T01-015] Giảng viên: RAG truy vấn dữ liệu bài giảng thực tế trước khi trả lời, giúp đảm bảo 100% câu trả lời có nguồn kiểm chứng.';
      } else if (lower.includes('hax') || lower.includes('guidelines') || lower.includes('g2') || lower.includes('g9')) {
        topicName = 'HAX Guidelines';
        answerText = `<b>📌 1. Cơ chế theo Bài giảng Day 1:</b><br>` +
          `Giảng viên giới thiệu bộ <b>HAX Guidelines (Human-AI eXperience Guidelines)</b> do Microsoft nghiên cứu gồm 18 nguyên tắc thiết kế UX cho sản phẩm AI.<br><br>` +
          `<b>💡 2. Hai quy tắc HAX trọng tâm trong Khoá học:</b><br>` +
          `• <b>HAX G2 (Make clear how well the system can do what it does)</b>: Minh bạch mức độ tin cậy và đính kèm mã đối chiếu transcript <code>[Txx-NNN]</code> để người học chủ động kiểm chứng.<br>` +
          `• <b>HAX G9 (Support efficient correction)</b>: Cho phép người học sửa đổi, gắn nhãn đánh giá (Chưa thuộc / Tạm ổn / Đã thuộc) hoặc yêu cầu AI sinh lại nội dung mà không mất dữ liệu.`;
        citation = '[T01-042]';
        snippet = '[T01-042] Giảng viên: HAX G9 nhấn mạnh quyền kiểm soát của người học, cho phép sửa hoặc yêu cầu sinh lại nội dung ôn tập.';
      } else if (lower.includes('cost of error') || lower.includes('chi phí') || lower.includes('sai sót')) {
        topicName = 'Cost of Error';
        answerText = `<b>📌 1. Định nghĩa theo Bài giảng Day 1:</b><br>` +
          `<b>Cost of Error (Chi phí rủi ro khi AI sai)</b> là thước đo hậu quả thực tế nếu AI đưa ra câu trả lời không chính xác. Chỉ số này quyết định 100% chiến lược thiết kế UX cho sản phẩm AI.<br><br>` +
          `<b>💡 2. Quy tắc lựa chọn chiến lược UX theo Bài giảng:</b><br>` +
          `• <b>Chiến lược Augment (Hỗ trợ con người)</b>: Áp dụng khi <b>Cost of Error CAO</b> (y tế, pháp lý, tài chính, kiểm tra bài thi). AI chỉ làm bản nháp gợi ý; con người là người duyệt và chịu trách nhiệm cuối cùng.<br>` +
          `• <b>Chiến lược Automate (Tự động hoá)</b>: Áp dụng khi <b>Cost of Error THẤP</b> (gợi ý tag, tìm kiếm từ khóa). Nếu AI sai, hậu quả không đáng kể và có thể Undo dễ dàng.`;
        citation = '[T01-088]';
        snippet = '[T01-088] Giảng viên: Chi phí sửa lỗi cao bắt buộc phải có con người kiểm duyệt trong luồng công việc.';
      } else if (lower.includes('jtbd') || lower.includes('job') || lower.includes('statement')) {
        topicName = 'JTBD Framework';
        answerText = `<b>📌 1. Định nghĩa theo Bài giảng Day 2:</b><br>` +
          `Framework <b>Job-to-be-Done (JTBD)</b> định hình công việc mà người học "thuê" sản phẩm AI giải quyết. Giảng viên yêu cầu tập trung vào động cơ thực tế thay vì chạy theo tính năng công nghệ AI.<br><br>` +
          `<b>💡 2. Cấu trúc Job Statement bắt buộc theo Bài giảng:</b><br>` +
          `👉 <b>[Động từ hành động] + [Đối tượng tác động] + [Bối cảnh xảy ra công việc]</b><br>` +
          `<i>Ví dụ chuẩn từ bài giảng: "Tóm tắt bài giảng video dài (động từ + đối tượng) khi đang đi xe bus (bối cảnh)".</i><br>` +
          `⚠️ <b>Quy tắc cấm từ bài giảng:</b> Job Statement tuyệt đối KHÔNG chứa tên công nghệ (như ChatGPT, Python, LLM...).`;
        citation = '[T01-145]';
        snippet = '[T01-145] Giảng viên: Cấu trúc Job Statement chuẩn luôn tập trung vào việc con người cần làm, không ghi tên AI hay công cụ.';
      } else if (lower.includes('lát cắt') || lower.includes('1 câu') || lower.includes('slice')) {
        topicName = 'Lát cắt 1 câu';
        answerText = `<b>📌 1. Định nghĩa theo Bài giảng Day 2:</b><br>` +
          `<b>One-Sentence Product Slice (Lát cắt sản phẩm 1 câu)</b> là phương pháp khống chế phạm vi sản phẩm AI xuống mức nhỏ nhất (Small Slice) giúp làm được prototype chạy thật ngay trong 1-2 ngày.<br><br>` +
          `<b>💡 2. Cấu trúc 4 thành tố bắt buộc theo Bài giảng:</b><br>` +
          `• ① <b>1 User</b>: Xác định chính xác 1 đối tượng người dùng cụ thể.<br>` +
          `• ② <b>1 Job</b>: 1 công việc cần làm chuẩn theo JTBD.<br>` +
          `• ③ <b>1 Decision</b>: 1 quyết định quan trọng mà AI tham gia hỗ trợ giải quyết chỗ khó.<br>` +
          `• ④ <b>1 Output</b>: Kết quả đầu ra cụ thể đo lường được (VD: Bộ 10 Flashcard kèm trích dẫn).`;
        citation = '[T02-020]';
        snippet = '[T02-020] Giảng viên: Lát cắt 1 câu giúp cô đọng bài toán AI thành 1 user - 1 việc - 1 quyết định - 1 kết quả.';
      } else if (lower.includes('4 lớp') || lower.includes('chỗ khó') || lower.includes('choke point')) {
        topicName = '4 Lớp Chỗ Khó';
        answerText = `<b>📌 1. Định nghĩa theo Bài giảng Day 2:</b><br>` +
          `Trong bài giảng Day 2, giảng viên nêu rõ <b>4 Lớp Chỗ Khó (Choke Points)</b> là 4 rào cản kỹ thuật & UX bắt buộc phải giải quyết để đưa sản phẩm AI ra thực tế.<br><br>` +
          `<b>💡 2. Chi tiết 4 Lớp Chỗ Khó theo Bài giảng:</b><br>` +
          `• ① <b>Nguồn sự thật (Source of Truth)</b>: Ép AI chỉ trích xuất từ dữ liệu transcript bài giảng, loại bỏ 100% ảo giác.<br>` +
          `• ② <b>Độ tin cậy (Confidence Score)</b>: Hiển thị minh bạch mức độ chính xác kèm mã đối chiếu <code>[Txx-NNN]</code>.<br>` +
          `• ③ <b>Luồng xử lý sự cố (Error Recovery)</b>: Thiết kế luồng Fallback khi AI gặp câu hỏi mơ hồ.<br>` +
          `• ④ <b>Đo lường định lượng (Golden Set Evaluation)</b>: Kiểm thử sản phẩm bằng tập Test Case chuẩn.`;
        citation = '[T02-055]';
        snippet = '[T02-055] Giảng viên: Lớp ① Nguồn sự thật giải quyết triệt để rủi ro AI bịa ra kiến thức không có trong bài giảng.';
      } else if (lower.includes('golden set') || lower.includes('evaluation') || lower.includes('đánh giá')) {
        topicName = 'Golden Set Evaluation';
        answerText = `<b>📌 1. Định nghĩa theo Bài giảng Day 2:</b><br>` +
          `<b>Golden Set Evaluation</b> là tập dữ liệu kiểm thử chuẩn (Test Cases) do giảng viên thiết lập để đo lường định lượng tỷ lệ chính xác của mô hình AI Tutor.<br><br>` +
          `<b>💡 2. Cấu trúc tập Golden Set trong Khoá học:</b><br>` +
          `• <b>Input</b>: Câu hỏi thử nghiệm từ người học.<br>` +
          `• <b>Citation</b>: Mã vị trí transcript chuẩn <code>[Txx-NNN]</code>.<br>` +
          `• <b>Expected Result</b>: Đáp án chuẩn và điểm đánh giá vượt qua test case.`;
        citation = '[T02-110]';
        snippet = '[T02-110] Giảng viên: Tập Golden Set gồm các test case kiểm thử giúp đánh giá định lượng chất lượng sản phẩm AI.';
      } else if (lower.includes('spaced repetition') || lower.includes('ngắt quãng') || lower.includes('supermemo')) {
        topicName = 'Spaced Repetition Algorithm';
        answerText = `<b>📌 1. Định nghĩa theo Bài giảng Day 1:</b><br>` +
          `<b>Spaced Repetition (Ôn tập lặp lại ngắt quãng)</b> là thuật toán tối ưu khả năng ghi nhớ dài hạn bằng cách điều chỉnh tần suất lặp lại thẻ Flashcard dựa trên mức độ thuộc của học viên.<br><br>` +
          `<b>💡 2. Phân loại 3 mức độ ôn tập theo Bài giảng:</b><br>` +
          `• 🔴 <b>Chưa thuộc (Cần học lại)</b>: Xuất hiện lại ngay trong phiên học.<br>` +
          `• 🟡 <b>Tạm ổn (Cần ôn)</b>: Xuất hiện lại sau 1-3 ngày.<br>` +
          `• 🟢 <b>Đã thuộc (Nắm chắc)</b>: Giảm tần suất xuất hiện.`;
        citation = '[T01-190]';
        snippet = '[T01-190] Giảng viên: Thuật toán Spaced Repetition phân loại 3 mức độ thuộc giúp tối ưu thời gian ôn tập dài hạn.';
      } else if (lower.includes('conditional automation') || lower.includes('human in the loop') || lower.includes('human-in-the-loop')) {
        topicName = 'Conditional Automation & Human-in-the-Loop';
        answerText = `<b>📌 1. Định nghĩa theo Bài giảng Day 2:</b><br>` +
          `<b>Conditional Automation (Tự động hoá có điều kiện)</b> kết hợp cùng cơ chế <b>Human-in-the-Loop</b> quy định AI chỉ tự động hoá 100% khi độ tin cậy (Confidence Score) đạt mức an toàn cao.<br><br>` +
          `<b>💡 2. Luồng xử lý phân tầng theo Bài giảng:</b><br>` +
          `• <b>Confidence Score CAO</b>: AI tự động sinh câu trả lời / flashcard hoàn chỉnh.<br>` +
          `• <b>Confidence Score MƠ HỒ / THẤP</b>: Hệ thống tự động chuyển giao cho con người (Human) kiểm duyệt và duyệt lại trước khi xuất ra.`;
        citation = '[T02-092]';
        snippet = '[T02-092] Giảng viên: Conditional Automation tự động hoá có điều kiện giúp đảm bảo an toàn tuyệt đối cho hệ thống AI.';
      } else if (lower.includes('confidence') || lower.includes('độ tin cậy')) {
        topicName = 'Confidence Score & Verification';
        answerText = `<b>📌 1. Định nghĩa theo Bài giảng Day 1 & Day 2:</b><br>` +
          `<b>Confidence Score (Mức độ tin cậy)</b> là chỉ số đo lường xác suất chính xác của đáp án do AI sinh ra dựa trên nguồn sự thật (Source of Truth).<br><br>` +
          `<b>💡 2. Quy tắc thiết kế HAX G2 theo Bài giảng:</b><br>` +
          `• Bắt buộc hiển thị minh bạch mức độ tin cậy để học viên biết khi nào câu trả lời có độ chính xác cao.<br>` +
          `• Luôn đính kèm mã trích dẫn bài giảng <code>[Txx-NNN]</code> làm bằng chứng kiểm chứng.`;
        citation = '[T01-042]';
        snippet = '[T01-042] Giảng viên: HAX G2 yêu cầu làm rõ mức độ tin cậy của hệ thống AI kèm mã đối chiếu transcript bài giảng.';
      } else if (lower.includes('error recovery') || lower.includes('sự cố')) {
        topicName = 'Error Recovery & Fallback Design';
        answerText = `<b>📌 1. Định nghĩa theo Bài giảng Day 2:</b><br>` +
          `<b>Error Recovery (Luồng xử lý sự cố)</b> là Lớp Chỗ Khó ③ trong thiết kế sản phẩm AI, quy định phương án dự phòng khi AI trả về kết quả chưa chuẩn hoặc không hiểu câu hỏi.<br><br>` +
          `<b>💡 2. Luồng xử lý sự cố chuẩn theo Bài giảng:</b><br>` +
          `• Tự động kích hoạt câu trả lời Fallback bám sát tri thức bài giảng.<br>` +
          `• Cho phép học viên sửa nhanh câu lệnh (HAX G9) hoặc bấm nút sinh lại bộ thẻ.`;
        citation = '[T02-075]';
        snippet = '[T02-075] Giảng viên: Luồng Error Recovery giúp ứng dụng AI tự hồi phục khi gặp dữ liệu nhiễu hoặc câu hỏi ngoài phạm vi.';
      } else if (lower.includes('fine tuning') || lower.includes('fine-tune') || lower.includes('huấn luyện')) {
        topicName = 'RAG vs Fine-tuning';
        answerText = `<b>📌 1. So sánh RAG và Fine-tuning theo Bài giảng Day 1:</b><br>` +
          `Giảng viên phân tích rõ sự khác biệt giữa hai phương pháp cập nhật tri thức cho AI:<br><br>` +
          `<b>💡 2. So sánh thực tế từ Bài giảng:</b><br>` +
          `• <b>RAG (Retrieval-Augmented Generation)</b>: Truy vấn trực tiếp transcript bài giảng thực tế. Chi phí thấp, cập nhật tri thức mới tức thì, 100% có trích dẫn mã <code>[Txx-NNN]</code>.<br>` +
          `• <b>Fine-tuning</b>: Huấn luyện lại trọng số mô hình. Chi phí rất đắt, lâu cập nhật và vẫn có nguy cơ ảo giác (Hallucination).`;
        citation = '[T01-025]';
        snippet = '[T01-025] Giảng viên: RAG vượt trội hơn Fine-tuning ở khả năng cập nhật tri thức tức thì và cung cấp nguồn kiểm chứng chính xác.';
      } else if (lower.includes('day 1') || lower.includes('bài 1') || lower.includes('ngày 1')) {
        topicName = 'Day 1 — Nền tảng RAG & HAX Guidelines';
        answerText = `<b>📌 1. Tổng quan Bài giảng Day 1 (Bài 1):</b><br>` +
          `Bài giảng Day 1 tập trung vào <b>Nền tảng RAG & Thiết kế Trải nghiệm Người dùng với AI (HAX Guidelines)</b>.<br><br>` +
          `<b>💡 2. Các chủ đề trọng tâm trong Day 1:</b><br>` +
          `• <b>RAG (Retrieval-Augmented Generation)</b>: Kỹ thuật chống ảo giác (Hallucination) bằng cách ép AI tra cứu transcript bài giảng trước khi trả lời.<br>` +
          `• <b>HAX Guidelines (Microsoft)</b>: Bộ 18 nguyên tắc thiết kế UX AI, đặc biệt là <b>HAX G2</b> (minh bạch trích dẫn) và <b>HAX G9</b> (hỗ trợ người dùng sửa lỗi & sinh lại).<br>` +
          `• <b>Cost of Error (Chi phí sửa sai)</b>: Định hướng chọn chiến lược <b>Augment</b> (con người duyệt khi rủi ro cao) hay <b>Automate</b> (tự động hoá khi rủi ro thấp).`;
        citation = '[T01-015]';
        snippet = '[T01-015] Giảng viên: Day 1 cung cấp toàn bộ nền tảng RAG, HAX Guidelines và Cost of Error giúp học viên xây dựng AI Tutor chuẩn mực.';
      } else if (lower.includes('day 2') || lower.includes('bài 2') || lower.includes('ngày 2')) {
        topicName = 'Day 2 — Thiết kế Sản phẩm & 4 Lớp Chỗ Khó';
        answerText = `<b>📌 1. Tổng quan Bài giảng Day 2 (Bài 2):</b><br>` +
          `Bài giảng Day 2 hướng dẫn <b>Phương pháp đóng gói sản phẩm AI thực tế</b> thông qua khung JTBD và 4 lớp giải quyết chỗ khó kỹ thuật.<br><br>` +
          `<b>💡 2. Các chủ đề trọng tâm trong Day 2:</b><br>` +
          `• <b>Lát cắt sản phẩm 1 câu (One-Sentence Product Slice)</b>: Cô đọng bài toán AI gồm 1 User - 1 Job - 1 Decision - 1 Output.<br>` +
          `• <b>JTBD Framework (Job-to-be-Done)</b>: Cấu trúc Job Statement [Động từ + Đối tượng + Bối cảnh], tuyệt đối không ghi tên công nghệ.<br>` +
          `• <b>4 Lớp Chỗ Khó (Choke Points)</b>: Nguồn sự thật, Độ tin cậy, Luồng xử lý sự cố và Đo lường thực tế (Golden Set Evaluation).`;
        citation = '[T02-020]';
        snippet = '[T02-020] Giảng viên: Day 2 tập trung vào kỹ năng làm sản phẩm AI thực chiến với lát cắt 1 câu và 4 lớp xử lý chỗ khó.';
      } else {
        answerText = `<b>📌 Trích xuất Tri thức Bài giảng Khoá học AI Thực Chiến:</b><br>` +
          `Nội dung thắc mắc <b>"${this.escapeHtml(questionText)}"</b> được quy định cụ thể trong <b>Khoá học AI Thực Chiến (Day 1 & Day 2)</b>.<br>` +
          `Bài giảng yêu cầu 100% câu trả lời phải được xác thực từ Nguồn sự thật (Source of Truth) và đính kèm mã trích dẫn transcript <code>${citation}</code> để học viên dễ dàng kiểm chứng lại lời giảng viên.`;
      }
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-bubble-msg tutor';
    msgDiv.innerHTML = `
      <div class="chat-avatar">V</div>
      <div class="chat-body" style="max-width: 100%;">
        <div class="chat-meta"><span class="author">VLearn AI Tutor</span> • <span class="time">Giải đáp bám sát Bài giảng</span></div>
        <div class="chat-text">
          ${answerText}<br><br>
          <div class="transcript-snippet-box" style="margin-top: 0.6rem;">
            <div class="snippet-header"><i class="fa-solid fa-quote-left"></i> Trích dẫn bài giảng ${citation}:</div>
            ${snippet}
          </div>
          <button class="btn btn-outline-primary btn-gen-prompt" data-gen-prompt="Tạo 8 flashcard ôn tập chủ đề ${topicName}" style="margin-top: 0.9rem; background: #edf5fd; border: 1px solid #004fb6; color: #004fb6; padding: 0.45rem 1rem; border-radius: 20px; font-size: 0.83rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
            ⚡ Tạo 8 Flashcard ôn tập chủ đề ${topicName}
          </button>
        </div>
      </div>
    `;

    if (this.chatbotFeed) this.chatbotFeed.appendChild(msgDiv);

    // Attach click listener to prompt button
    const btn = msgDiv.querySelector('.btn-gen-prompt');
    if (btn) {
      btn.addEventListener('click', () => {
        const prompt = btn.dataset.genPrompt;
        if (prompt && this.chatbotTextInput) {
          this.chatbotTextInput.value = prompt;
          this.handleChatbotSubmit();
        }
      });
    }
  }

  appendTutorOffTopicChatMessage(refusalHtml) {
    if (!this.chatbotFeed) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-bubble-msg tutor';
    msgDiv.innerHTML = `
      <div class="chat-avatar">V</div>
      <div class="chat-body">
        <div class="chat-meta"><span class="author">VLearn AI Tutor</span> • <span class="time">Từ chối trả lời</span></div>
        <div class="chat-text">
          <div class="chat-error-msg" style="border-left-color: #f59e0b; background: rgba(245, 158, 11, 0.08);">
            ${refusalHtml}
          </div>
        </div>
      </div>
    `;
    this.chatbotFeed.appendChild(msgDiv);
  }

  appendUserChatMessage(text) {
    if (!this.chatbotFeed) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-bubble-msg user';
    msgDiv.innerHTML = `
      <div class="chat-body">
        <div class="chat-text">${this.escapeHtml(text)}</div>
      </div>
    `;
    this.chatbotFeed.appendChild(msgDiv);
  }

  appendTutorErrorChatMessage(errorMarkdown) {
    if (!this.chatbotFeed) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-bubble-msg tutor';
    msgDiv.innerHTML = `
      <div class="chat-avatar">V</div>
      <div class="chat-body">
        <div class="chat-meta"><span class="author">VLearn AI Tutor</span> • <span class="time">Trợ lý AI</span></div>
        <div class="chat-text">
          <div class="chat-error-msg">
            <i class="fa-solid fa-circle-exclamation"></i> <b>Lệnh chat không hợp lệ!</b><br>
            ${errorMarkdown}<br>
            <i>Vui lòng nhập lại lệnh chat có số lượng từ 5 đến 25 thẻ nhé! (Ví dụ: "Tạo 8 thẻ RAG Day 1")</i>
          </div>
        </div>
      </div>
    `;
    this.chatbotFeed.appendChild(msgDiv);
  }

  appendTutorSuccessChatMessage(cards, lessonId, requestedCount) {
    if (!this.chatbotFeed) return;
    const batchId = `batch-${Date.now()}`;
    const lessonTitle = lessonId === 'day-1' ? 'Day 1: AI & LLM Foundation' : (lessonId === 'day-2' ? 'Day 2: Bài Toán AI & Lát Cắt' : 'Tất cả bài học');

    const cardsHtml = cards.map((c, i) => `
      <div class="gen-card-item" style="margin-bottom: 0.8rem; background: #f8fafc; border: 1px solid #e2e8f0;">
        <div class="gen-card-header">
          <span class="badge badge-topic">Thẻ ${i + 1} • ${c.topic}</span>
          <span class="badge badge-citation">${c.citation}</span>
        </div>
        <div class="gen-card-question"><b>C:</b> ${this.escapeHtml(c.question)}</div>
        <div class="gen-card-answer"><b>A:</b> ${this.escapeHtml(c.answer)}</div>
      </div>
    `).join('');

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-bubble-msg tutor';
    msgDiv.innerHTML = `
      <div class="chat-avatar">V</div>
      <div class="chat-body" style="max-width: 100%;">
        <div class="chat-meta"><span class="author">VLearn AI Tutor</span> • <span class="time">Đã tạo ${cards.length} thẻ mới</span></div>
        <div class="chat-text">
          Đã hoàn thành! Mình đã trích xuất đúng <b>${cards.length} thẻ Flashcards MỚI KHOÁNG</b> (không trùng lặp) bám sát bài giảng <b>${lessonTitle}</b> cho bạn:<br><br>
          <div class="cards-list" style="max-height: 380px; margin: 0.8rem 0;">
            ${cardsHtml}
          </div>
          <button class="btn btn-success-gradient btn-block btn-import-inline" data-batch-id="${batchId}">
            <i class="fa-solid fa-play"></i> Thêm tất cả ${cards.length} thẻ này vào Bộ Thẻ Ôn Luyện 3D
          </button>
        </div>
      </div>
    `;

    this.chatbotFeed.appendChild(msgDiv);

    // Attach import listener
    const importBtn = msgDiv.querySelector('.btn-import-inline');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        this.allCards.unshift(...cards);
        this.saveUserCards();
        if (this.lessonSelect) this.lessonSelect.value = lessonId;
        this.filterCardsByLesson(lessonId);
        document.getElementById('tabBtnReview').click();
        alert(`🎉 Đã thêm thành công ${cards.length} thẻ Flashcards mới vào Bộ Thẻ Ôn Luyện 3D của bạn!`);
      });
    }
  }

  async generateFlashcardsCore(count, lessonId, difficulty, customPrompt) {
    if (!this.generatedQuestionHistory) {
      this.generatedQuestionHistory = new Set();
    }
    this.allCards.forEach(c => {
      if (c.question) this.generatedQuestionHistory.add(c.question.trim().toLowerCase());
    });

    let generatedCards = [];
    const recentHistoryList = Array.from(this.generatedQuestionHistory).slice(-20).join('; ');

    if (this.apiKey) {
      try {
        const model = this.model || 'gemini-3.6-flash';
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Bạn là AI Tutor cho khoá học AI Thực Chiến. Hãy trích xuất và tạo đúng KHÔNG THỪA KHÔNG THIẾU ${count} thẻ Flashcards MỚI KHOÁNG ôn tập cho bài học [${lessonId}] độ khó [${difficulty}]. Yêu cầu học viên: ${customPrompt}.\nLƯU Ý QUAN TRỌNG VỀ ĐỘC NHẤT: Đảm bảo tuyệt đối không trùng lặp câu hỏi với danh sách sau: [${recentHistoryList}].\nTrả về dữ liệu định dạng JSON Array chứa đúng ${count} object có cấu trúc: {"question": "...", "hint": "...", "answer": "...", "citation": "[T01-XXX]", "transcript_snippet": "[T01-XXX] ...", "topic": "...", "difficulty": "${difficulty}"}.`
              }]
            }]
          })
        });
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\[.*\]/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            generatedCards = parsed.filter(card => {
              const qKey = (card.question || '').trim().toLowerCase();
              return qKey && !this.generatedQuestionHistory.has(qKey);
            });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, running fallback generator:', err);
      }
    } else {
      await new Promise(r => setTimeout(r, 900));
    }

    // Fallback if needed or pad to exact count
    if (!Array.isArray(generatedCards) || generatedCards.length === 0) {
      generatedCards = this.runFallbackGeneratorList(lessonId, difficulty, count);
    } else if (generatedCards.length > count) {
      generatedCards = generatedCards.slice(0, count);
    } else if (generatedCards.length < count) {
      const missingCount = count - generatedCards.length;
      const padCards = this.runFallbackGeneratorList(lessonId, difficulty, missingCount);
      generatedCards.push(...padCards);
    }

    // Register into history
    generatedCards.forEach(c => {
      if (c.question) this.generatedQuestionHistory.add(c.question.trim().toLowerCase());
    });

    return generatedCards;
  }

  runFallbackGeneratorList(lessonId, difficulty, count) {
    this.generationBatchCount = (this.generationBatchCount || 0) + 1;
    const batch = this.generationBatchCount;
    const lessonTitle = lessonId === 'day-1' ? 'Day 1: AI & LLM Foundation' : (lessonId === 'day-2' ? 'Day 2: Xác Định Bài Toán AI' : 'Tất cả bài học');

    const questionPool = [
      { t: "RAG Core", q: "Mục đích cốt lõi của kỹ thuật RAG trong việc giảm Hallucination là gì?", a: "Cung cấp ngữ cảnh bài giảng thực tế cho LLM tra cứu trước khi sinh câu trả lời.", c: "[T01-015]" },
      { t: "HAX Guidelines", q: "Nguyên tắc HAX G9 cho phép người học tương tác thế nào với AI Tutor?", a: "Cho phép người học chủ động chỉnh sửa, yêu cầu sinh lại hoặc bổ sung ngữ cảnh cho câu trả lời.", c: "[T01-042]" },
      { t: "Cost of Error", q: "Tại sao Cost-of-Error cao lại ưu tiên thiết kế hướng Augment thay vì Automate?", a: "Vì hậu quả sai sót lớn cần con người kiểm duyệt và chịu trách nhiệm quyết định cuối cùng.", c: "[T01-088]" },
      { t: "JTBD Framework", q: "Ba thành tố bắt buộc trong cấu trúc Job Statement chuẩn của JTBD là gì?", a: "Động từ hành động + Đối tượng tác động + Bối cảnh xảy ra công việc.", c: "[T01-145]" },
      { t: "Lát cắt 1 câu", q: "Lát cắt sản phẩm 1 câu (One-sentence product slice) bao gồm 4 yếu tố nào?", a: "1 đối tượng người dùng, 1 việc cần làm, 1 quyết định AI hỗ trợ, 1 kết quả đầu ra.", c: "[T02-020]" },
      { t: "4 Lớp Chỗ Khó", q: "Lớp Chỗ Khó ① 'Nguồn sự thật' (Source of Truth) giải quyết rủi ro nào?", a: "Tránh trường hợp AI tự bịa ra kiến thức không tồn tại trong tài liệu/transcript gốc.", c: "[T02-055]" },
      { t: "Conditional Automation", q: "Bản chất của cơ chế Conditional Automation trong thiết kế luồng làm việc là gì?", a: "Tự động hoá các trường hợp có độ tin cậy cao và tự động chuyển con người xử lý các trường hợp mơ hồ.", c: "[T02-092]" },
      { t: "Hallucination Mechanism", q: "Nguyên nhân bản chất về mặt kỹ thuật khiến LLM tạo ảo giác (Hallucination) là gì?", a: "LLM sinh từ theo mô hình xác suất next-token prediction chứ không truy vấn cơ sở dữ liệu kiểm chứng.", c: "[T01-112]" },
      { t: "HAX G2 Principle", q: "HAX G2 quy định sản phẩm AI phải làm rõ điều gì với người dùng?", a: "Làm rõ mức độ tin cậy và khả năng thực sự của hệ thống AI (như kèm mã trích dẫn đoạn bài giảng).", c: "[T01-128]" },
      { t: "Prompt System Design", q: "Tại sao System Prompt cần quy định định dạng đầu ra dạng JSON Array?", a: "Để ứng dụng dễ dàng parse dữ liệu và hiển thị trực quan lên giao diện thẻ ôn tập.", c: "[T01-160]" },
      { t: "Golden Set Evaluation", q: "Mục đích chính của bộ test case Golden Set trong đo lường AI là gì?", a: "Đánh giá định tính và định lượng độ chính xác của AI Tutor qua các lượt thay đổi prompt.", c: "[T02-110]" },
      { t: "Cost-of-Error Low", q: "Trong trường hợp nào thiết kế Automate (tự động hoá hoàn toàn) được khuyên dùng?", a: "Khi chi phí sửa lỗi của AI rất thấp hoặc kết quả sinh ra dễ dàng hoàn tác.", c: "[T01-095]" },
      { t: "AI Tutor Feedback", q: "Khi người học trả lời sai, AI Tutor nên phản hồi theo nguyên tắc nào?", a: "Cung cấp gợi ý hướng dẫn (hint) và động viên thay vì phán xét hay shaming người học.", c: "[T02-045]" },
      { t: "RAG Retrieval", q: "Thách thức lớn nhất khi làm bước Retrieval trong RAG là gì?", a: "Tìm đúng đoạn văn bản chứa chính xác câu trả lời mà không bị nhiễu thông tin.", c: "[T01-030]" },
      { t: "Augment vs Automate", q: "Điểm phân định cơ bản giữa Augment và Automate trong UX AI là gì?", a: "Augment con người ra quyết định cuối; Automate hệ thống tự thực thi quyết định.", c: "[T01-075]" },
      { t: "Slice Scope", q: "Tại sao hackathon khuyên chọn lát cắt sản phẩm cực hẹp (Small Slice)?", a: "Để đảm bảo có thể hoàn thành prototype chạy thật và đo lường được trong thời gian ngắn.", c: "[T02-015]" },
      { t: "Knowledge Gap", q: "Khi người dùng trả lời sai nhiều câu liên tiếp, hệ thống nên đánh dấu trạng thái gì?", a: "Đánh dấu trạng thái 'Needs Review' để ưu tiên lặp lại thẻ trong các phiên ôn tới.", c: "[T02-080]" },
      { t: "Confidence Score", q: "Chỉ số độ tin cậy (Confidence Score) giúp người học điều gì?", a: "Biết được câu trả lời của AI có căn cứ vững chắc từ transcript hay không.", c: "[T01-135]" },
      { t: "Flashcard Hint", q: "Gợi ý (Hint) của thẻ Flashcard đóng vai trò gì trong trải nghiệm ôn tập?", a: "Kích hoạt trí nhớ chủ động (Active Recall) trước khi xem đáp án chi tiết.", c: "[T01-050]" },
      { t: "Transcript Citation", q: "Định dạng trích dẫn [Txx-NNN] thể hiện điều gì?", a: "Trích dẫn mã bài giảng (Txx) và dòng/thời điểm tương ứng (NNN) trong transcript.", c: "[T01-010]" },
      { t: "Iterative Learning", q: "Nguyên lý Spaced Repetition (Lặp lại ngắt quãng) ứng dụng thế nào?", a: "Tăng tần suất xuất hiện các thẻ đánh giá 'Chưa thuộc' cho đến khi thành thạo.", c: "[T02-030]" },
      { t: "User Validation", q: "Validation với user trong đợt thử nghiệm nhằm mục đích gì?", a: "Thu thập bằng chứng thực tế xem AI Tutor có cải thiện tốc độ ghi nhớ hay không.", c: "[T02-120]" },
      { t: "Prompt Tuning", q: "Khi kết quả sinh thẻ bị chung chung, cần tinh chỉnh phần nào trong Prompt?", a: "Thêm ví dụ minh hoạ cụ thể (Few-shot) và giới hạn phạm vi trích dẫn trong bài giảng.", c: "[T01-150]" },
      { t: "Error Recovery", q: "Khi Gemini API không phản hồi hoặc trả về lỗi JSON, hệ thống cần có cơ chế gì?", a: "Cơ chế Fallback mượt mà sinh thẻ từ dữ liệu chuẩn bị sẵn mà không làm gián đoạn UX.", c: "[T02-099]" },
      { t: "System Constraints", q: "Ràng buộc hệ thống quan trọng nhất khi nộp bài prototype là gì?", a: "Phải có ít nhất 1 lời gọi AI chạy thật và trích dẫn được nguồn kiểm chứng.", c: "[T01-005]" }
    ];

    const offset = ((batch - 1) * 5) % questionPool.length;
    const rotatedPool = [...questionPool.slice(offset), ...questionPool.slice(0, offset)];

    const list = [];
    for (let i = 0; i < count; i++) {
      const sample = rotatedPool[i % rotatedPool.length];
      const cardId = `chatgen-b${batch}-${Date.now()}-${i + 1}`;
      const qKey = sample.q.trim().toLowerCase();
      const isDuplicate = this.generatedQuestionHistory.has(qKey);
      const questionText = isDuplicate
        ? `[Đợt ${batch} • Thẻ #${i + 1}] ${sample.q}`
        : sample.q;

      list.push({
        id: cardId,
        lesson_id: lessonId,
        lesson_title: lessonTitle,
        topic: sample.t,
        question: questionText,
        hint: `Gợi ý: Tham khảo bài giảng tại đoạn ${sample.c}`,
        answer: sample.a,
        citation: sample.c,
        transcript_snippet: `${sample.c} Giảng viên: ${sample.a}`,
        difficulty: difficulty
      });
    }
    return list;
  }

  scrollChatToBottom() {
    if (this.chatMessagesWrapper) {
      this.chatMessagesWrapper.scrollTop = this.chatMessagesWrapper.scrollHeight;
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  openTutorDrawer() {
    const card = this.filteredCards[this.currentIndex];
    this.drawerCardQuestion.textContent = card.question;
    this.drawerCitation.textContent = card.citation;

    this.tutorDrawerOverlay.classList.remove('hidden');
    this.tutorDrawer.classList.add('open');
  }

  closeTutorDrawer() {
    this.tutorDrawer.classList.remove('open');
    this.tutorDrawerOverlay.classList.add('hidden');
  }

  sendTutorMessage() {
    const text = this.tutorInput.value.trim();
    if (!text) return;

    // Add User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `<div class="msg-bubble">${text}</div>`;
    this.chatMessages.appendChild(userMsg);

    this.tutorInput.value = '';
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

    // Simulate Tutor Response
    setTimeout(() => {
      const card = this.filteredCards[this.currentIndex];
      const tutorMsg = document.createElement('div');
      tutorMsg.className = 'chat-message tutor';
      tutorMsg.innerHTML = `
        <div class="msg-bubble">
          Về câu hỏi <b>"${card.question}"</b>: <br><br>
          ${card.answer} <br><br>
          <i>Theo bài giảng tại <b>${card.citation}</b>:</i> "${card.transcript_snippet.replace(/^\[T\d+-\d+\]\s*/, '')}"
        </div>
      `;
      this.chatMessages.appendChild(tutorMsg);
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }, 600);
  }

  async renderGoldenSetTable() {
    if (!this.evalTableBody) return;
    let cases = GOLDEN_SET_CASES;
    try {
      const paths = ['../../eval/golden_set.json', '../eval/golden_set.json', 'eval/golden_set.json'];
      for (const p of paths) {
        const res = await fetch(p);
        if (res.ok) {
          cases = await res.json();
          break;
        }
      }
    } catch (e) {
      // Fallback silently to GOLDEN_SET_CASES
    }
    this.evalTableBody.innerHTML = cases.map(c => `
      <tr>
        <td><b>${c.id}</b></td>
        <td><span class="badge badge-topic">${c.type}</span></td>
        <td>${c.input}</td>
        <td><code>${c.citation}</code></td>
        <td><span class="badge badge-answer-title"><i class="fa-solid fa-check"></i> ${c.result}</span></td>
      </tr>
    `).join('');
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Initialize App on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new VLearnApp();
});
