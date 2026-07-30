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

    // Empty State & Stage Elements
    this.reviewEmptyState = document.getElementById('reviewEmptyState');
    this.emptyGenBtn = document.getElementById('emptyGenBtn');
    this.emptyLoadCanonicalBtn = document.getElementById('emptyLoadCanonicalBtn');
    this.ratingSection = document.querySelector('.rating-section');

    // 3D Card Elements
    this.flashcard3D = document.getElementById('flashcard3D');
    this.cardTopicTag = document.getElementById('cardTopicTag');
    this.cardDifficultyTag = document.getElementById('cardDifficultyTag');
    this.cardQuestionText = document.getElementById('cardQuestionText');
    this.toggleHintBtn = document.getElementById('toggleHintBtn');
    this.hintContainer = document.getElementById('hintContainer');
    this.hintText = document.getElementById('hintText');
    this.cardAnswerText = document.getElementById('cardAnswerText');
    this.cardCitationBadge = document.getElementById('cardCitationBadge');
    this.cardCitationText = document.getElementById('cardCitationText');
    this.cardTranscriptSnippet = document.getElementById('cardTranscriptSnippet');
    this.currentCardIndexText = document.getElementById('currentCardIndex');
    this.totalCardCountDisplayText = document.getElementById('totalCardCountDisplay');

    // Navigation & Rating
    this.autoGenHeaderBtn = document.getElementById('autoGenHeaderBtn');
    this.prevCardBtn = document.getElementById('prevCardBtn');
    this.nextCardBtn = document.getElementById('nextCardBtn');
    this.shuffleBtn = document.getElementById('shuffleBtn');
    this.rateHardBtn = document.getElementById('rateHardBtn');
    this.rateReviewBtn = document.getElementById('rateReviewBtn');
    this.rateMasterBtn = document.getElementById('rateMasterBtn');

    this.genLessonSelect = document.getElementById('genLessonSelect');
    this.genTopicSelect = document.getElementById('genTopicSelect');
    this.genDifficulty = document.getElementById('genDifficulty');
    this.genCountSelect = document.getElementById('genCountSelect');
    this.genCustomPrompt = document.getElementById('genCustomPrompt');
    this.generateCardsBtn = document.getElementById('generateCardsBtn');
    this.genLoadingState = document.getElementById('genLoadingState');
    this.generatedCardsList = document.getElementById('generatedCardsList');
    this.genStatusBadge = document.getElementById('genStatusBadge');
    this.applyGeneratedBtnWrapper = document.getElementById('applyGeneratedBtnWrapper');
    this.applyGeneratedCardsBtn = document.getElementById('applyGeneratedCardsBtn');

    this.askTutorBtn = document.getElementById('askTutorBtn');
    this.tutorDrawer = document.getElementById('tutorDrawer');
    this.tutorDrawerOverlay = document.getElementById('tutorDrawerOverlay');
    this.closeDrawerBtn = document.getElementById('closeDrawerBtn');
    this.drawerCardQuestion = document.getElementById('drawerCardQuestion');
    this.drawerCitation = document.getElementById('drawerCitation');
    this.chatMessages = document.getElementById('chatMessages');
    this.tutorChatForm = document.getElementById('tutorChatForm');
    this.tutorInput = document.getElementById('tutorInput');

    this.apiKeyModal = document.getElementById('apiKeyModal');
    this.closeModalBtn = document.getElementById('closeModalBtn');
    this.saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
    this.apiKeyInput = document.getElementById('apiKeyInput');

    this.runEvalBtn = document.getElementById('runEvalBtn');
    this.evalTableBody = document.getElementById('evalTableBody');
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

    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.tabBtns.forEach(b => b.classList.remove('active'));
        this.tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const targetTab = document.getElementById(btn.dataset.tab);
        if (targetTab) targetTab.classList.add('active');
      });
    });

    if (this.emptyGenBtn) {
      this.emptyGenBtn.addEventListener('click', () => {
        const genTabBtn = document.getElementById('tabBtnGenerate');
        if (genTabBtn) genTabBtn.click();
      });
    }
    if (this.emptyLoadCanonicalBtn) {
      this.emptyLoadCanonicalBtn.addEventListener('click', () => {
        this.allCards = [...INITIAL_CANONICAL_CARDS];
        this.saveUserCards();
        this.filterCardsByLesson(this.lessonSelect ? this.lessonSelect.value : 'day-1');
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
        this.generateFlashcards();
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

    if (this.generateCardsBtn) this.generateCardsBtn.addEventListener('click', () => this.generateFlashcards());
    if (this.applyGeneratedCardsBtn) this.applyGeneratedCardsBtn.addEventListener('click', () => this.applyGeneratedCards());

    if (this.askTutorBtn) {
      this.askTutorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openTutorDrawer();
      });
    }
    if (this.closeDrawerBtn) this.closeDrawerBtn.addEventListener('click', () => this.closeTutorDrawer());
    if (this.tutorDrawerOverlay) this.tutorDrawerOverlay.addEventListener('click', () => this.closeTutorDrawer());
    if (this.tutorChatForm) {
      this.tutorChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendTutorMessage();
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

  async generateFlashcards() {
    const lessonId = this.genLessonSelect.value;
    const topic = this.genTopicSelect.value;
    const difficulty = this.genDifficulty.value;
    const count = parseInt(this.genCountSelect?.value || '10');
    const customPrompt = this.genCustomPrompt.value.trim();

    this.genLoadingState.classList.remove('hidden');
    this.generatedCardsList.innerHTML = '';
    this.genStatusBadge.classList.add('hidden');
    this.applyGeneratedBtnWrapper.classList.add('hidden');

    if (this.apiKey) {
      try {
        const model = this.model || 'gemini-3.6-flash';
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Bạn là AI Tutor cho khoá học AI Thực Chiến. Hãy trích xuất và tạo đúng ${count} thẻ Flashcards ôn tập cho bài học [${lessonId}] chủ đề [${topic}] độ khó [${difficulty}]. Yêu cầu bổ sung: ${customPrompt}.\nTrả về dữ liệu định dạng JSON Array chứa ${count} object có cấu trúc: {"question": "...", "hint": "...", "answer": "...", "citation": "[T01-XXX]", "transcript_snippet": "[T01-XXX] ...", "topic": "${topic}", "difficulty": "${difficulty}"}.`
              }]
            }]
          })
        });
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\[.*\]/s);
        if (jsonMatch) {
          this.generatedCardsTemp = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('AI output structure invalid');
        }
      } catch (err) {
        console.warn('Gemini API call failed or fallback required:', err);
        this.runFallbackGenerator(lessonId, difficulty, count);
      }
    } else {
      await new Promise(r => setTimeout(r, 1200));
      this.runFallbackGenerator(lessonId, difficulty, count);
    }

    this.genLoadingState.classList.add('hidden');
    this.renderGeneratedCards();
  }

  runFallbackGenerator(lessonId, difficulty, count = 10) {
    const lessonTitle = lessonId === 'day-1' ? 'Day 1: AI & LLM Foundation' : 'Day 2: Xác Định Bài Toán AI';
    const baseTopics = [
      { t: "Khái niệm Core", q: "Điểm cốt lõi nhất khi ứng dụng RAG là gì?", a: "RAG loại bỏ ảo giác và trích xuất nguồn bài giảng chuẩn.", c: "[T01-015]" },
      { t: "HAX Guidelines", q: "Nguyên tắc HAX G9 cho phép gì?", a: "Cho phép học viên chỉnh sửa hoặc yêu cầu AI tạo lại thẻ.", c: "[T01-042]" },
      { t: "Cost of Error", q: "Chi phí sửa lỗi ảnh hưởng thế nào đến Augment/Automate?", a: "Cost of Error cao -> Augment, Low -> Automate.", c: "[T01-088]" },
      { t: "JTBD Framework", q: "Cấu trúc Job Statement chuẩn là gì?", a: "Động từ + Đối tượng + Bối cảnh, không chứa tên công nghệ.", c: "[T01-145]" },
      { t: "Lát cắt 1 câu", q: "Lát cắt 1 câu gồm 4 thành tố nào?", a: "1 user, 1 việc, 1 quyết định AI, 1 kết quả.", c: "[T02-020]" },
      { t: "4 Lớp Chỗ Khó", q: "Ví dụ lớp ① Nguồn sự thật?", a: "AI bịa ra thông tin không có trong transcript bài giảng.", c: "[T02-055]" },
      { t: "Conditional Automation", q: "Khi nào áp dụng Conditional Automation?", a: "AI xử lý case chắc chắn, chuyển con người case mơ hồ.", c: "[T02-092]" },
      { t: "Hallucination Cause", q: "Vì sao Hallucination xảy ra ở LLM?", a: "Do LLM dự đoán token theo xác suất thay vì tra cứu CSDL tĩnh.", c: "[T01-112]" }
    ];

    this.generatedCardsTemp = [];
    for (let i = 0; i < count; i++) {
      const sample = baseTopics[i % baseTopics.length];
      this.generatedCardsTemp.push({
        id: `gen-${Date.now()}-${i + 1}`,
        lesson_id: lessonId,
        lesson_title: lessonTitle,
        topic: `${sample.t} (#${i + 1})`,
        question: `[AI Generated #${i + 1}] ${sample.q} (${lessonTitle})`,
        hint: `Gợi ý: Tham khảo bài giảng tại đoạn ${sample.c}`,
        answer: sample.a,
        citation: sample.c,
        transcript_snippet: `${sample.c} Giảng viên: ${sample.a}`,
        difficulty: difficulty
      });
    }
  }

  renderGeneratedCards() {
    this.genStatusBadge.textContent = `Đã sinh ${this.generatedCardsTemp.length} thẻ`;
    this.genStatusBadge.classList.remove('hidden');
    this.applyGeneratedBtnWrapper.classList.remove('hidden');

    this.generatedCardsList.innerHTML = this.generatedCardsTemp.map((c, i) => `
      <div class="gen-card-item">
        <div class="gen-card-header">
          <span class="badge badge-topic">Thẻ ${i + 1} • ${c.topic}</span>
          <span class="badge badge-citation">${c.citation}</span>
        </div>
        <div class="gen-card-question">${c.question}</div>
        <div class="gen-card-answer"><b>Đáp án:</b> ${c.answer}</div>
      </div>
    `).join('');
  }

  applyGeneratedCards() {
    this.allCards.unshift(...this.generatedCardsTemp);
    this.saveUserCards();
    this.filterCardsByLesson(this.lessonSelect.value);
    document.getElementById('tabBtnReview').click();
    alert(`Đã thêm ${this.generatedCardsTemp.length} thẻ mới vào bộ thẻ cá nhân của bạn và tự động lưu lại!`);
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
}

// Initialize App on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new VLearnApp();
});
