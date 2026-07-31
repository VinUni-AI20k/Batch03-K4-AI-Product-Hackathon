/**
 * CODELAB AI CO-PILOT — App Logic (VLearn Theme - Day 1 AI & LLM Foundation)
 *
 * Flow:
 *  - 7 bước học tập được tạo từ nội dung slide d1-slide-hackathon.pdf
 *  - Chuyển bước mượt mà qua Sidebar hoặc nút Trước/Tiếp theo
 *  - Tự động cập nhật ngữ cảnh AI Co-Pilot & Quick Chips theo từng bước
 *  - OpenRouter Gemini call thật khi có key; fallback Mock từ KNOWLEDGE_BASE
 */

// ============================================================
// DATA FOR 7 STEPS (Dựa trên d1-slide-hackathon.pdf)
// ============================================================
const STEPS_DATA = [
  {
    id: 1,
    title: "1. Mở đúng repo và nhìn thấy đích đến",
    shortTitle: "Mở đúng repo",
    quickChips: [
      { text: "Lấy OpenAI API key ở đâu?", question: "Làm sao để tạo OpenAI API key?" },
      { text: "Lỗi cài đặt Python", question: "Tôi gặp lỗi khi cài đặt Python 3.10+" }
    ],
    htmlContent: `
      <div class="callout info" style="background:#f8f9fa; border:1px solid #e0e0e0; border-left:4px solid #1a73e8; border-radius:6px; padding:16px;">
        <span style="background:#e8f0fe; color:#1a73e8; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:600; margin-bottom:12px; display:inline-block;">Cơ bản</span><br/>
        <strong>Trước khi bắt đầu:</strong> Học viên hoàn thiện toàn bộ <code>TODO</code> trong <code>template.py</code>: API cơ bản, system prompt và token, streaming/retry, rồi ghép thành trợ lý CLI.
        <ul style="margin-top:12px; padding-left:20px; line-height:1.6; color:#3c4043;">
          <li><strong>Thời lượng dự kiến:</strong> 240 phút</li>
          <li><strong>Môi trường cần có:</strong> Windows, macOS, Linux · Python 3.10+ ... OpenAI API key.</li>
          <li><strong>Cần biết trước:</strong> Biết hàm Python, list và dict cơ bản.</li>
          <li><strong>Xong bài này bạn sẽ:</strong> Gọi được GPT-4o và GPT-4o-mini theo contract của template · Dùng system prompt, đếm token và ước tính chi phí · Viết chatbot streaming có history · Ghép thành trợ lý CLI.</li>
        </ul>
      </div>
      <div style="margin-top:24px;">
        <h3 style="font-size:16px; margin-bottom:12px;">Tips chuẩn bị (tùy chọn)</h3>
        <ul style="padding-left:20px; line-height:1.6; color:#1a73e8;">
          <li style="cursor:pointer; text-decoration:underline;">Hướng dẫn cài đặt Visual Studio Code và Git cho người mới</li>
          <li style="cursor:pointer; text-decoration:underline;">Hướng dẫn cài Python và cấu hình Python trong VS Code</li>
        </ul>
      </div>
    `
  },
  {
    id: 2,
    title: "2. Tạo môi trường và chạy test baseline",
    shortTitle: "Tạo môi trường",
    quickChips: [
      { text: "pip install lỗi", question: "Lỗi khi chạy pip install -r requirements.txt" },
      { text: "Virtual environment là gì?", question: "Tại sao phải dùng virtual environment .venv?" }
    ],
    htmlContent: `
      <div style="margin-bottom:20px;">
        <div style="background:#282c34; color:#abb2bf; padding:16px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:14px; margin-bottom:16px; position:relative;">
          python -m pip install -r requirements.txt<br/>
          python -m pytest tests -v
        </div>
        <p>Trên macOS/Linux, thay dòng activate bằng:</p>
        <div style="background:#282c34; color:#abb2bf; padding:16px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:14px; margin-bottom:16px; position:relative;">
          source .venv/bin/activate
        </div>
        <h3 style="font-size:16px; margin:24px 0 12px;">Cách uv – nếu bạn đã cài uv</h3>
        <div style="background:#282c34; color:#abb2bf; padding:16px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:14px; margin-bottom:16px;">
          uv venv<br/>
          uv pip install -r requirements.txt<br/>
          uv run pytest tests -v
        </div>
        <p style="line-height:1.6;"><code style="color:#e65100;background:#fff3e0;padding:2px 4px;border-radius:4px;font-size:13px;">requirements.txt</code> cài <code style="color:#e65100;background:#fff3e0;padding:2px 4px;border-radius:4px;font-size:13px;">openai</code>, <code style="color:#e65100;background:#fff3e0;padding:2px 4px;border-radius:4px;font-size:13px;">tiktoken</code>, <code style="color:#e65100;background:#fff3e0;padding:2px 4px;border-radius:4px;font-size:13px;">pytest</code> và <code style="color:#e65100;background:#fff3e0;padding:2px 4px;border-radius:4px;font-size:13px;">python-dotenv</code>. Lần chạy đầu sẽ fail vì các hàm còn <code style="color:#d32f2f;background:#fde0e0;padding:2px 4px;border-radius:4px;font-size:13px;">NotImplementedError</code>; đó là baseline bình thường, không phải lỗi cài đặt. <strong>Virtual environment</strong> giúp <code style="color:#e65100;background:#fff3e0;padding:2px 4px;border-radius:4px;font-size:13px;">pip</code> chỉ cài dependency vào <code style="color:#e65100;background:#fff3e0;padding:2px 4px;border-radius:4px;font-size:13px;">.venv</code>.</p>
        <p style="margin-top:16px;"><strong>Kết quả mong đợi:</strong> test bắt đầu chạy và lỗi chỉ còn liên quan các <code style="color:#d32f2f;background:#fde0e0;padding:2px 4px;border-radius:4px;font-size:13px;">TODO</code>, không còn <code style="color:#d32f2f;background:#fde0e0;padding:2px 4px;border-radius:4px;font-size:13px;">ModuleNotFoundError</code>.</p>
      </div>
    `
  },
  {
    id: 3,
    title: "3. Hoàn thành Task 1: gọi GPT-4o",
    shortTitle: "Task 1: GPT-4o",
    quickChips: [
      { text: "Lỗi API Key OpenAI", question: "Làm sao để cấu hình OpenAI API key trong file .env?" },
      { text: "ChatCompletion là gì?", question: "Giải thích hàm openai.chat.completions.create?" }
    ],
    htmlContent: `
      <p>Hoàn thành hàm <code>call_openai</code> trong <code>template.py</code> để gửi một prompt cơ bản đến mô hình <code>gpt-4o</code>.</p>
      <div style="background:#282c34; color:#abb2bf; padding:16px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:14px; margin:16px 0;">
<span style="color:#7f848e;"># Task 1 - Call GPT-4o</span>
<span style="color:#7f848e;"># ---------------------------------------------------------</span>
<span style="color:#c678dd;">def</span> <span style="color:#61afef;">call_openai</span>(prompt: <span style="color:#e5c07b;">str</span>) -> <span style="color:#e5c07b;">str</span>:
    <span style="color:#98c379;">"""
    Call the OpenAI Chat Completions API using gpt-4o and return the response text.
    """</span>
    <span style="color:#c678dd;">pass</span>
      </div>
      <p><strong>Kết quả mong đợi:</strong> <code>TestCallOpenAI</code> pass và trả về phản hồi hợp lệ từ mô hình.</p>
    `
  },
  {
    id: 4,
    title: "4. Task 2 — Gọi GPT-4o-mini bằng cách tái sử dụng Task 1",
    shortTitle: "Task 2: GPT-4o-mini",
    quickChips: [
      { text: "Nên dùng 4o-mini khi nào?", question: "Khi nào nên dùng GPT-4o-mini thay vì GPT-4o?" },
      { text: "Tái sử dụng code?", question: "Làm sao để truyền tham số model động vào hàm?" }
    ],
    htmlContent: `
      <div style="background:#282c34; color:#abb2bf; padding:16px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:14px; margin-bottom:16px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
<span style="color:#7f848e;"># Task 2 - Call GPT-4o-mini</span>
<span style="color:#7f848e;"># ---------------------------------------------------------</span>
<span style="color:#c678dd;">def</span> <span style="color:#61afef;">call_openai_mini</span>(
    prompt: <span style="color:#e5c07b;">str</span>,
    temperature: <span style="color:#e5c07b;">float</span> = <span style="color:#d19a66;">0.7</span>,
    top_p: <span style="color:#e5c07b;">float</span> = <span style="color:#d19a66;">0.9</span>,
    max_tokens: <span style="color:#e5c07b;">int</span> = <span style="color:#d19a66;">256</span>,
) -> <span style="color:#e5c07b;">tuple</span>[<span style="color:#e5c07b;">str</span>, <span style="color:#e5c07b;">float</span>]:
    <span style="color:#98c379;">"""
    Call the OpenAI Chat Completions API using gpt-4o-mini and return the
    response text + latency.

    Args:
        prompt:        The user message to send.
        ...
    """</span>
    <span style="color:#c678dd;">pass</span>
      </div>
      <p>Hãy cập nhật hàm để chấp nhận tham số model và cấu hình, đồng thời trả về cả thời gian phản hồi (latency).</p>
    `
  },
  {
    id: 5,
    title: "5. Task 3 — So sánh hai model trên cùng một prompt",
    shortTitle: "Task 3: So sánh",
    quickChips: [
      { text: "Cách tính cost estimate?", question: "Làm sao để tính cost estimate dựa trên token?" },
      { text: "Dict trong Python", question: "Cách tạo dictionary trả về đúng 5 keys?" }
    ],
    htmlContent: `
      <div style="background:#282c34; color:#abb2bf; padding:16px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:14px; margin-bottom:16px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
<span style="color:#7f848e;"># Task 3 - Compare GPT-4o vs GPT-4o-mini</span>
<span style="color:#7f848e;"># ---------------------------------------------------------</span>
<span style="color:#c678dd;">def</span> <span style="color:#61afef;">compare_models</span>(prompt: <span style="color:#e5c07b;">str</span>) -> <span style="color:#e5c07b;">dict</span>:
    <span style="color:#98c379;">"""
    Call both gpt-4o and gpt-4o-mini with the same prompt and return a
    comparison dictionary.

    Args:
        prompt: The user message to send to both models.

    Returns:
        A dict with keys:
            - "gpt4o_response":     str
            - "mini_response":      str
            - "gpt4o_latency":      float
            - "mini_latency":       float
            - "gpt4o_cost_estimate": float   (estimated USD for the response)

    Hint:
    """</span>
    <span style="color:#c678dd;">pass</span>
      </div>
      
      <p style="margin-bottom:16px;line-height:1.6;">4. Trả về dict có <strong>đúng</strong> năm key mà template liệt kê. Tên key phải khớp từng ký tự vì test đọc theo tên.</p>
      
      <div style="background:#fff3e0; border:1px solid #ffe0b2; padding:12px 16px; border-radius:6px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
        <strong style="color:#e65100;">Hint code – thử tự làm trước, rồi bấm để xem</strong>
        <button style="background:transparent; border:none; color:#e65100; font-weight:600; cursor:pointer;">Xem hint</button>
      </div>

      <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px; border:1px solid #e0e0e0; border-radius:8px; overflow:hidden;">
        <tr style="border-bottom:1px solid #e0e0e0; background:#f8f9fa;">
          <th style="text-align:left; padding:12px; width:120px;">Khái niệm</th>
          <th style="text-align:left; padding:12px;">Hiểu như học viên</th>
        </tr>
        <tr style="border-bottom:1px solid #e0e0e0;">
          <td style="padding:12px; color:#1a73e8; font-family:monospace; background:#f8f9fa; border-right:1px solid #e0e0e0;">token</td>
          <td style="padding:12px;">Đơn vị model dùng để đọc và tạo text; ở đây số từ chỉ được dùng để ước lượng token.</td>
        </tr>
        <tr style="border-bottom:1px solid #e0e0e0;">
          <td style="padding:12px; color:#1a73e8; font-family:monospace; background:#f8f9fa; border-right:1px solid #e0e0e0;">cost estimate</td>
          <td style="padding:12px;">Con số gần đúng giúp bạn hình dung output dài hơn sẽ tốn nhiều hơn.</td>
        </tr>
        <tr style="border-bottom:1px solid #e0e0e0;">
          <td style="padding:12px; color:#1a73e8; font-family:monospace; background:#f8f9fa; border-right:1px solid #e0e0e0;">key</td>
          <td style="padding:12px;">Nhãn trong dict, ví dụ <code style="color:#d32f2f;background:#fde0e0;padding:2px 4px;border-radius:4px;font-size:13px;">mini_latency</code>; dùng sai nhãn thì test không tìm thấy dữ liệu.</td>
        </tr>
      </table>

      <p>Kết quả mong đợi: <code style="color:#d32f2f;background:#fde0e0;padding:2px 4px;border-radius:4px;font-size:13px;">TestCompareModels</code> pass, bao gồm cả kiểm tra dict có đủ key, latency dương và chi phí không âm.</p>
    `
  },
  {
    id: 6,
    title: "6. Part 2 — System prompt, token và chi phí",
    shortTitle: "Part 2: System prompt & Token",
    quickChips: [
      { text: "System prompt là gì?", question: "Vai trò của system prompt so với user prompt?" },
      { text: "Thư viện tiktoken", question: "Sử dụng tiktoken để đếm số lượng token như thế nào?" }
    ],
    htmlContent: `
      <p>Cấu hình <strong>System Prompt</strong> để định hình hành vi của AI và tính toán chi phí chính xác bằng cách đếm token.</p>
      <ul style="line-height:1.6; margin-top:12px; padding-left:20px;">
        <li>Thêm message có role là <code>system</code>.</li>
        <li>Sử dụng thư viện <code>tiktoken</code> để đếm chính xác số token của chuỗi input.</li>
        <li>Nhân số token với đơn giá của model <code>gpt-4o-mini</code> để ra chi phí thực tế.</li>
      </ul>
    `
  },
  {
    id: 7,
    title: "7. Part 3 — Streaming, history và retry",
    shortTitle: "Part 3: Streaming & History",
    quickChips: [
      { text: "Streaming là gì?", question: "Làm sao để stream kết quả trả về từ OpenAI API?" },
      { text: "Quản lý History chat", question: "Cách lưu trữ context (history) để model nhớ ngữ cảnh trước đó?" }
    ],
    htmlContent: `
      <p>Nâng cấp trải nghiệm người dùng với <strong>Streaming</strong> (chữ hiện ra từ từ giống ChatGPT) và <strong>History</strong> (ghi nhớ ngữ cảnh).</p>
      <ul style="line-height:1.6; margin-top:12px; padding-left:20px;">
        <li>Truyền <code>stream=True</code> vào <code>chat.completions.create</code>.</li>
        <li>Lặp qua generator trả về để yield từng chunk text.</li>
        <li>Sử dụng một list để lưu các message (user và assistant) nhằm duy trì hội thoại.</li>
        <li>Cài đặt logic Retry khi gặp lỗi mạng (ví dụ dùng <code>tenacity</code> hoặc vòng lặp <code>try/except</code>).</li>
      </ul>
    `
  },
  {
    id: 8,
    title: "8. Part 4 — Ghép thành trợ lý CLI",
    shortTitle: "Part 4: CLI Assistant",
    quickChips: [
      { text: "Vòng lặp while", question: "Cách tạo vòng lặp while True để chat liên tục trong CLI?" },
      { text: "In màu console", question: "Làm sao để in text có màu trong Python terminal?" }
    ],
    htmlContent: `
      <p>Lắp ghép các hàm đã tạo thành một chương trình trợ lý ảo hoàn chỉnh chạy trên Command Line (CLI).</p>
      <div style="background:#282c34; color:#abb2bf; padding:16px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:14px; margin:16px 0;">
> python cli_app.py
Trợ lý AI đã sẵn sàng. Gõ 'exit' để thoát.

Bạn: Xin chào!
AI: Chào bạn, tôi có thể giúp gì cho bạn hôm nay?
      </div>
    `
  },
  {
    id: 9,
    title: "9. Bonus — So sánh nhiều prompt và in bảng kết quả",
    shortTitle: "Bonus: So sánh Prompt",
    quickChips: [
      { text: "So sánh prompt", question: "Làm sao để đánh giá prompt nào tốt hơn?" },
      { text: "Thư viện Rich", question: "Làm sao dùng thư viện rich để in bảng kết quả trong console?" }
    ],
    htmlContent: `
      <p>Chạy các biến thể prompt khác nhau cho cùng một bài toán (ví dụ: zero-shot vs few-shot vs chain-of-thought) và so sánh chất lượng, thời gian, chi phí.</p>
    `
  },
  {
    id: 10,
    title: "10. Kiểm tra, phản ánh và nộp bài",
    shortTitle: "Kiểm tra, phản ánh và nộp bài",
    quickChips: [
      { text: "Lỗi pytest cuối cùng", question: "Tôi còn 1 test case chưa pass, làm sao để debug?" }
    ],
    htmlContent: `
      <div style="background:#f8f9fa; border:1px solid #e0e0e0; border-radius:8px; overflow:hidden; margin-top:16px;">
        <div style="background:#f1f3f4; padding:16px 20px; border-bottom:1px solid #e0e0e0; display:flex; align-items:center; gap:12px;">
          <div style="background:#0b57d0; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          </div>
          <div>
            <h3 style="margin:0; font-size:16px;">Nộp bài và đánh giá Lab</h3>
            <p style="margin:4px 0 0; font-size:13px; color:#5f6368;">Dán link GitHub, Drive hoặc LMS của bài đã nộp. Điểm và nhận xét sẽ không hiển thị tại đây.</p>
          </div>
        </div>
        
        <div style="padding:20px;">
          <p style="font-weight:600; margin-bottom:16px; font-size:14px;">Lớp: Khoá 4 (K4)</p>
          
          <div style="background:#f8f9fa; border:1px solid #e0e0e0; border-radius:6px; padding:16px; margin-bottom:20px;">
            <p style="font-weight:600; margin:0 0 8px; font-size:14px;">Đã dùng 1/3 lần nộp</p>
            <p style="margin:0; font-size:13px; color:#5f6368; display:flex; align-items:center; gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Lần 1 · 17:34:32 24/7/2026 · Đã gửi
            </p>
          </div>

          <div style="margin-bottom:20px;">
            <label style="display:block; font-weight:600; margin-bottom:8px; font-size:14px;">Đánh giá Lab này <span style="color:#d32f2f;">*</span></label>
            <div style="color:#fbbc04; font-size:24px; cursor:pointer;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
          </div>

          <div style="margin-bottom:24px;">
            <label style="display:block; font-weight:600; margin-bottom:8px; font-size:14px;">Link bài đã nộp <span style="color:#d32f2f;">*</span></label>
            <input type="text" placeholder="https://github.com/your-account/Day01-lab-assignment" style="width:100%; padding:10px 12px; border:1px solid #dcdcdc; border-radius:6px; font-size:14px; box-sizing:border-box; color:#333;">
          </div>

          <button style="background:#0b57d0; color:white; border:none; padding:10px 24px; border-radius:6px; font-weight:600; font-size:14px; cursor:pointer; display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Xác nhận đã nộp bài
          </button>
        </div>
      </div>
    `
  }
];


// ============================================================
// STATE
// ============================================================
const state = {
  currentStep: 1,
  apiKey: null,
  useMock: false,
  isLoading: false,
  history: [],
  panelOpen: false,
  checkboxState: {}
};

// ============================================================
// DOM ELEMENTS
// ============================================================
const $ = id => document.getElementById(id);
const dom = {
  headerStepBadge:     $('headerStepBadge'),
  stepNav:             $('stepNav'),
  contentInner:        $('contentInner'),
  aiPanel:             $('aiPanel'),
  aiMessages:          $('aiMessages'),
  aiInput:             $('aiInput'),
  btnAiSend:           $('btnAiSend'),
  btnAiHeader:         $('btnAiHeader'),
  btnClosePanel:       $('btnClosePanel'),
  fabAi:               $('fabAi'),
  modalBackdrop:       $('modalBackdrop'),
  apiKeyInput:         $('apiKeyInput'),
  btnSaveKey:          $('btnSaveKey'),
  btnMock:             $('btnMock'),
  toast:               $('toast'),
  countdown:           $('countdownDisplay'),
  contextBarText:      $('contextBarText'),
  quickChipsContainer: $('quickChipsContainer'),
  aiIntroContent:      $('aiIntroContent')
};

// ============================================================
// INIT APP
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initStepNav();
  initPanelToggle();
  initInput();
  initChips();
  initModal();
  initCountdown();

  // Panel starts closed — only FAB visible
  togglePanel(false);

  // Render Step 1 initial
  renderStep(1);

  // Restore API key if saved
  const savedKey = sessionStorage.getItem('vlearn_openrouter_key');
  if (savedKey) {
    state.apiKey = savedKey;
    dom.modalBackdrop.classList.add('hidden');
    setSourceTag(true);
  }
});

// ============================================================
// STEP RENDERER & NAV
// ============================================================
function initStepNav() {
  dom.stepNav.addEventListener('click', e => {
    const item = e.target.closest('.step-item');
    if (!item) return;
    e.preventDefault();
    const stepId = parseInt(item.dataset.step, 10);
    if (stepId && stepId !== state.currentStep) {
      renderStep(stepId);
    }
  });
}

function renderStep(stepId) {
  state.currentStep = stepId;
  const step = STEPS_DATA.find(s => s.id === stepId) || STEPS_DATA[0];

  // Update Header Badge
  if (dom.headerStepBadge) {
    dom.headerStepBadge.textContent = stepId;
  }

  // Update Sidebar Items
  document.querySelectorAll('.step-item').forEach(item => {
    const sId = parseInt(item.dataset.step, 10);
    const dot = item.querySelector('.step-dot');

    item.classList.remove('active', 'done');
    dot.classList.remove('active', 'done');

    if (sId === stepId) {
      item.classList.add('active');
      dot.classList.add('active');
      dot.innerHTML = `${sId}`;
    } else if (sId < stepId) {
      item.classList.add('done');
      dot.classList.add('done');
      dot.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5l2.5 2.5 4.5-4.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    } else {
      dot.innerHTML = `${sId}`;
    }
  });

  // Render Content Area
  const isFirst = stepId === 1;
  const isLast = stepId === STEPS_DATA.length;

  let html = `<h1 class="page-title">${step.title}</h1>`;
  if (step.htmlContent) {
    html += step.htmlContent;
  } else {
    if (step.intro) html += `<p class="intro-text">${step.intro}</p>`;
    if (step.stepList) {
        const stepListHtml = step.stepList.map(item => `<li>${item}</li>`).join('');
        html += `<ol class="step-list">${stepListHtml}</ol>`;
    }
  }

  // Page Nav
  html += `
    <div class="page-nav">
      <button class="btn-nav prev" id="btnPrevStep" ${isFirst ? 'disabled style="opacity:0.4;cursor:not-allowed"' : ''}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        Trước
      </button>
      <button class="btn-nav next primary" id="btnNextStep">
        ${isLast ? 'Hoàn thành' : 'Tiếp theo'}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>
  `;

  dom.contentInner.innerHTML = html;

  // Scroll main content to top
  $('contentArea').scrollTop = 0;

  // Bind checkbox events
  dom.contentInner.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', e => {
      state.checkboxState[e.target.dataset.chkKey] = e.target.checked;
    });
  });

  // Bind prev / next buttons
  const btnPrev = $('btnPrevStep');
  const btnNext = $('btnNextStep');

  if (btnPrev && !isFirst) {
    btnPrev.addEventListener('click', () => renderStep(stepId - 1));
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (isLast) {
        showToast('🎉 Chúc mừng bạn đã hoàn thành bài Lab 01 — AI & LLM Foundation!');
      } else {
        renderStep(stepId + 1);
      }
    });
  }

  // Update AI Co-Pilot Context & Quick Chips
  updateAiContext(step);
}

// ============================================================
// UPDATE AI CO-PILOT CONTEXT & CHIPS
// ============================================================
function updateAiContext(step) {
  if (dom.contextBarText) {
    dom.contextBarText.innerHTML = `Đang xem: <strong>Bước ${step.id} — ${step.shortTitle}</strong>`;
  }

  if (dom.quickChipsContainer) {
    dom.quickChipsContainer.innerHTML = step.quickChips.map(chip => `
      <button class="chip" data-q="${escAttr(chip.question)}">${chip.text}</button>
    `).join('');
  }
}

function escAttr(s) {
  return s.replace(/"/g, '&quot;');
}

// ============================================================
// PANEL TOGGLE
// ============================================================
function initPanelToggle() {
  dom.btnAiHeader.addEventListener('click', () => togglePanel(true));
  dom.btnClosePanel.addEventListener('click', () => togglePanel(false));
  dom.fabAi.addEventListener('click', () => togglePanel(true));
}

function togglePanel(open) {
  state.panelOpen = open;
  if (open) {
    dom.aiPanel.classList.remove('collapsed');
    dom.fabAi.classList.add('hidden');
  } else {
    dom.aiPanel.classList.add('collapsed');
    dom.fabAi.classList.remove('hidden');
  }
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function initCountdown() {
  let secs = 10 * 3600 + 37 * 60 + 47;
  setInterval(() => {
    if (secs <= 0) return;
    secs--;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    dom.countdown.textContent =
      `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }, 1000);
}

// ============================================================
// MODAL & KEY MANAGEMENT
// ============================================================
function initModal() {
  dom.btnSaveKey.addEventListener('click', () => {
    const key = dom.apiKeyInput.value.trim();
    if (!key.startsWith('sk-or-v1-')) {
      showToast('⚠️ Key không hợp lệ (phải bắt đầu bằng "sk-or-v1-")');
      return;
    }
    state.apiKey = key;
    sessionStorage.setItem('vlearn_openrouter_key', key);
    dom.modalBackdrop.classList.add('hidden');
    setSourceTag(true);
    showToast('✅ Đã kết nối OpenRouter Gemini — AI Co-Pilot đã sẵn sàng!');
  });

  dom.btnMock.addEventListener('click', () => {
    state.useMock = true;
    dom.modalBackdrop.classList.add('hidden');
    setSourceTag(false);
    showToast('🎭 Mock mode — Trả lời từ dữ liệu slide & transcript khoá học');
  });
}

function setSourceTag(real) {
  const el = document.querySelector('.ai-source-tag');
  if (!el) return;
  el.innerHTML = real
    ? `<span style="color:var(--success)">●</span>&nbsp;Gemini 2.5 Flash · OpenRouter`
    : `<span style="color:var(--warning)">●</span>&nbsp;Mock mode`;
}

// ============================================================
// INPUT & QUICK CHIPS
// ============================================================
function initInput() {
  dom.aiInput.addEventListener('input', () => {
    dom.aiInput.style.height = 'auto';
    dom.aiInput.style.height = Math.min(dom.aiInput.scrollHeight, 100) + 'px';
  });
  dom.aiInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });
  dom.btnAiSend.addEventListener('click', handleSend);
}

function initChips() {
  document.addEventListener('click', e => {
    const chip = e.target.closest('[data-q]');
    if (!chip) return;
    dom.aiInput.value = chip.dataset.q;
    handleSend();
  });
}

// ============================================================
// SEND MESSAGE & AI CO-PILOT RESPONSE
// ============================================================
async function handleSend() {
  const text = dom.aiInput.value.trim();
  if (!text || state.isLoading) return;

  appendUserMsg(text);
  dom.aiInput.value = '';
  dom.aiInput.style.height = 'auto';

  state.history.push({ role: 'user', content: text });

  const typingEl = appendTyping();
  state.isLoading = true;
  dom.btnAiSend.disabled = true;

  try {
    let resp;
    if (state.useMock || !state.apiKey) {
      resp = await mockResponse(text);
    } else {
      resp = await openrouterGeminiCall(text);
    }
    typingEl.remove();
    appendAssistantMsg(resp);
    state.history.push({ role: 'model', content: resp.raw });
  } catch (err) {
    typingEl.remove();
    appendErrorMsg(err.message);
  } finally {
    state.isLoading = false;
    dom.btnAiSend.disabled = false;
    scrollBottom();
  }
}

// ============================================================
// OPENROUTER GEMINI CALL
// ============================================================
async function openrouterGeminiCall(query) {
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  const messages = [
    { role: 'system', content: buildSystemPrompt(query, KNOWLEDGE_BASE) },
    ...state.history.slice(-6).map(h => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.content }))
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.apiKey}`,
      'HTTP-Referer': location.origin,
      'X-Title': 'K4-hackathon-HiHi-E403'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages,
      temperature: 0.4,
      max_tokens: 600,
      top_p: 0.9
    })
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.error?.message || `API ${res.status}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '(Không có phản hồi)';
  return parseResp(raw);
}

function parseResp(raw) {
  const codes = [...new Set((raw.match(/\[T\d{2}-\d{3}\]/g) || []).map(r => r.slice(1, -1)))];
  const citations = [];
  const unverified = [];
  for (const code of codes) {
    const hit = KNOWLEDGE_BASE.find(k => k.ref === code);
    if (hit) citations.push(hit);
    else unverified.push(code);
  }
  return { raw, answer: raw, citations, unverified };
}

// ============================================================
// MOCK RESPONSE — synthesize meaningful answer from KB
// ============================================================
async function mockResponse(text) {
  await delay(700 + Math.random() * 500);
  const citations = retrieveContext(text, KNOWLEDGE_BASE, 4);

  if (!citations.length) {
    const answer = `Mình chưa tìm thấy nội dung liên quan trong transcript bài giảng cho câu hỏi này.\n\nBạn thử hỏi cụ thể hơn về một khái niệm trong bài Lab (ví dụ: *token*, *system prompt*, *streaming*, *OpenAI API*...) để mình tìm đúng hơn nhé! Nếu vẫn không ra thì bạn hỏi TA trên Discord khoá học.`;
    return { raw: answer, answer, citations: [], unverified: [] };
  }

  // Synthesize a meaningful answer from the top retrieved excerpts
  const answer = synthesizeAnswer(text, citations);
  return { raw: answer, answer, citations, unverified: [] };
}

/**
 * Tổng hợp câu trả lời có ý nghĩa từ các đoạn transcript được retrieve.
 * Không dùng câu mẫu chung — trích điểm chính từ nội dung thực tế.
 */
function synthesizeAnswer(query, citations) {
  const q = query.toLowerCase();
  const top = citations[0];

  // Trích những câu/cụm từ nổi bật từ excerpt
  const keyPoints = citations.slice(0, 3).map(c => {
    // Lấy 1-2 câu đầu tiên của excerpt để làm điểm chính
    const sentences = c.excerpt.split(/[.!?]/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 2).join('. ').trim();
  }).filter(Boolean);

  // Xác định loại câu hỏi để tuỳ chỉnh phần dẫn đầu
  let lead = '';
  if (q.includes('là gì') || q.includes('la gi') || q.includes('nghĩa là') || q.includes('giải thích')) {
    lead = `**${top.topic}** được giảng trong **${top.day}**:\n\n`;
  } else if (q.includes('tại sao') || q.includes('vì sao') || q.includes('why')) {
    lead = `Lý do được giải thích trong bài giảng **${top.day}** — *${top.topic}*:\n\n`;
  } else if (q.includes('cách') || q.includes('như thế nào') || q.includes('làm sao') || q.includes('how')) {
    lead = `Trong phần **${top.topic}** (*${top.day}*), giảng viên hướng dẫn:\n\n`;
  } else if (q.includes('ví dụ') || q.includes('example')) {
    lead = `Ví dụ từ bài giảng **${top.day}** — *${top.topic}*:\n\n`;
  } else if (q.includes('khác nhau') || q.includes('so sánh') || q.includes('difference')) {
    lead = `Bài giảng **${top.day}** phân biệt **${top.topic}** như sau:\n\n`;
  } else {
    lead = `Theo bài giảng **${top.day}** — *${top.topic}*:\n\n`;
  }

  // Ghép điểm chính thành bullet points
  const bulletPoints = keyPoints
    .map(pt => `- ${pt.charAt(0).toUpperCase() + pt.slice(1)}.`)
    .join('\n');

  const tail = citations.length > 1
    ? `\n\nMình tìm thấy **${citations.length} đoạn liên quan** trong bài giảng — bấm vào tài liệu tham khảo bên dưới để đọc trích dẫn đầy đủ.`
    : `\n\nBấm vào tài liệu tham khảo bên dưới để đọc đoạn trích đầy đủ từ bài giảng.`;

  return lead + bulletPoints + tail;
}

// ============================================================
// DOM HELPERS
// ============================================================
function appendUserMsg(text) {
  const el = document.createElement('div');
  el.className = 'ai-msg user';
  el.innerHTML = `
    <div class="ai-avatar">HV</div>
    <div class="ai-msg-content"><p>${esc(text)}</p></div>
  `;
  dom.aiMessages.appendChild(el);
  scrollBottom();
}

function appendAssistantMsg({ answer, citations, unverified = [] }) {
  const el = document.createElement('div');
  el.className = 'ai-msg assistant';

  // Build collapsed citation cards — click to expand
  const citHtml = citations.map((c, i) => {
    const cardId = `cit-${Date.now()}-${i}`;
    // Emoji icon based on day/topic
    const icon = c.day && c.day.toLowerCase().includes('day') ? '📚' : '📄';
    return `
    <div class="citation-card collapsed" data-cit-id="${cardId}">
      <button class="citation-header" onclick="toggleCitation('${cardId}')" aria-expanded="false">
        <span class="citation-ref">[${c.ref}]</span>
        <span class="citation-src">${icon} ${c.day} · ${c.topic}</span>
        <span class="citation-chevron">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </button>
      <div class="citation-body">
        <p class="citation-text">"${c.excerpt}"</p>
      </div>
    </div>`;
  }).join('')
    + (unverified.length ? `
    <div class="citation-warn">⚠️ Mã ${unverified.map(u => `[${u}]`).join(', ')} không đối chiếu được với transcript khoá học.</div>` : '')
    + (!citations.length && !unverified.length ? `
    <div class="citation-warn">Câu này mình trả lời từ tri thức slide Day 1 AI & LLM Foundation.</div>` : '');

  const uid = Date.now();
  el.innerHTML = `
    <div class="ai-avatar" style="background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12)">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="url(#am${uid})"/>
        <path d="M5 8l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <defs><linearGradient id="am${uid}" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4285f4"/><stop offset="1" stop-color="#8b5cf6"/>
        </linearGradient></defs>
      </svg>
    </div>
    <div class="ai-msg-content">
      <div>${mdToHtml(answer)}</div>
      ${citations.length > 0 ? `<p class="citation-hint">Bấm vào tài liệu tham khảo để xem chi tiết 👇</p>` : ''}
      ${citHtml}
    </div>`;
  dom.aiMessages.appendChild(el);
  scrollBottom();
}

function toggleCitation(cardId) {
  const card = document.querySelector(`[data-cit-id="${cardId}"]`);
  if (!card) return;
  const isCollapsed = card.classList.contains('collapsed');
  card.classList.toggle('collapsed', !isCollapsed);
  card.classList.toggle('expanded', isCollapsed);
  const btn = card.querySelector('.citation-header');
  if (btn) btn.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
  scrollBottom();
}

function appendTyping() {
  const el = document.createElement('div');
  el.className = 'ai-msg assistant';
  el.innerHTML = `
    <div class="ai-avatar" style="background:#f1f3f4">
      <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="#4285f4" opacity=".3"/></svg>
    </div>
    <div class="typing-wrap">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <span class="typing-label">Đang tra cứu bài giảng...</span>
    </div>`;
  dom.aiMessages.appendChild(el);
  scrollBottom();
  return el;
}

function appendErrorMsg(msg) {
  const el = document.createElement('div');
  el.className = 'ai-msg assistant';
  el.innerHTML = `
    <div class="ai-avatar" style="background:#fce8e6;font-size:12px">⚠</div>
    <div class="ai-msg-content">
      <p style="color:#d93025">Lỗi kết nối: <strong>${esc(msg)}</strong></p>
      <p>Bạn thử lại sau hoặc chuyển sang Mock mode.</p>
    </div>`;
  dom.aiMessages.appendChild(el);
}

function scrollBottom() {
  requestAnimationFrame(() => { dom.aiMessages.scrollTop = dom.aiMessages.scrollHeight; });
}

// ============================================================
// UTILITIES
// ============================================================
function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

function mdToHtml(md) {
  return md
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^(\d+)\. (.+)$/gm, '<li style="margin-left:16px;margin-bottom:4px">$2</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, s => `<ol style="margin:8px 0">${s}</ol>`)
    .replace(/^- (.+)$/gm, '<li style="margin-left:16px;margin-bottom:4px">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin-top:8px">')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function showToast(msg, ms = 3000) {
  dom.toast.textContent = msg;
  dom.toast.classList.add('show');
  setTimeout(() => dom.toast.classList.remove('show'), ms);
}
