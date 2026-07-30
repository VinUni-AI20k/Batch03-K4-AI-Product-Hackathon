// VLearn Mini Codelab Application - Human-in-the-Loop & Mini Project Architecture

const state = {
  currentRole: 'student', // 'student' | 'coach'
  theme: 'light',
  activeCodelabId: null,
  activeFileIndex: 0,
  apiKey: '',
  serverStatus: null,
  pendingCoachLab: null, // Holds the current draft Mini Project being reviewed by Lab Coach
  coachFeedbackHistory: [], // Stores revision feedback logs
  
  // Data Pack Mini Projects
  codelabs: [
    {
      id: 'proj-react-01',
      title: 'Mini Project 01: ReAct Agent Architecture & Tool Calling',
      morningTopic: 'Buổi 4 - ReAct Agent Architecture & Function Calling',
      morningSlideRef: 'Slide 03: ReAct Loop [T04-032]',
      afternoonLabTarget: 'github.com/vlearn/day4-research-agent-lab (4 tiếng)',
      duration: '15 phút',
      status: 'Đã phát hành',
      description: 'Dự án nhỏ gồm 3 file Python minh họa luồng Thought-Action-Observation của ReAct Agent trước giờ lab chiều.',
      projectOverview: 'Dự án này chia nhỏ cấu trúc của 1 ReAct Agent hoàn chỉnh thành 3 file mô-đun: `tools.py` (chứa công cụ tra cứu), `agent.py` (chứa lớp ReAct Agent), và `main.py` (chạy thử nghiệm luồng hỏi đáp).',
      files: [
        {
          filename: 'tools.py',
          language: 'python',
          purpose: 'Định nghĩa các tool mà ReAct Agent có thể sử dụng (ví dụ: lookup_paper tra cứu tài liệu học tập).',
          code: `# File: tools.py\n# Định nghĩa các tool tra cứu tài liệu cho ReAct Agent\n\ndef lookup_paper(query: str) -> str:\n    """Tool tìm kiếm bài báo/tài liệu trong cơ sở dữ liệu học tập."""\n    db = {\n        "react": "ReAct: Synergizing Reasoning and Acting in LLMs (Yao et al., 2022)",\n        "transformer": "Attention Is All You Need (Vaswani et al., 2017)",\n        "hax": "Human-AI Interaction Guidelines (Microsoft Research, 2019)"\n    }\n    return db.get(query.lower(), "Không tìm thấy tài liệu phù hợp trong bộ nhớ.")\n`
        },
        {
          filename: 'agent.py',
          language: 'python',
          purpose: 'Chứa lớp ReActAgent thực thi vòng lặp Thought -> Action -> Observation -> Final Answer.',
          code: `# File: agent.py\n# Lớp ReAct Agent điều phối việc gọi tool và xử lý lý do\nfrom tools import lookup_paper\n\nclass ReActAgent:\n    def __init__(self, name="VLearn ReAct Agent"):\n        self.name = name\n    \n    def run(self, user_query: str):\n        print(f"🤖 [{self.name}] Nhận câu hỏi: '{user_query}'")\n        \n        # 1. Thought\n        print("[THOUGHT] Người dùng đang hỏi về tài liệu ReAct. Tôi sẽ sử dụng tool lookup_paper với từ khóa 'react'.")\n        \n        # 2. Action\n        print("[ACTION] Calling tool: lookup_paper('react')...")
        observation = lookup_paper("react")\n        \n        # 3. Observation\n        print(f"[OBSERVATION] Kết quả nhận được từ tool: {observation}")\n        \n        # 4. Final Answer\n        final_ans = f"Tài liệu nghiên cứu bạn cần tham khảo là: {observation}"\n        print(f"[FINAL ANSWER] {final_ans}")\n        return final_ans\n`
        },
        {
          filename: 'main.py',
          language: 'python',
          purpose: 'File chính khởi tạo Agent và thực thi dự án thử nghiệm.',
          code: `# File: main.py\n# Entry point của Mini Project\nfrom agent import ReActAgent\n\nif __name__ == "__main__":
    print("=== VLEARN MINI PROJECT: REACT AGENT RUNNER ===")
    agent = ReActAgent()
    agent.run("Hãy cho tôi bài báo về ReAct Agent")
`
        }
      ],
      runInstructions: 'Chạy lệnh: python main.py',
      expectedOutput: '=== VLEARN MINI PROJECT: REACT AGENT RUNNER ===\n🤖 [VLearn ReAct Agent] Nhận câu hỏi: \'Hãy cho tôi bài báo về ReAct Agent\'\n[THOUGHT] Người dùng đang hỏi về tài liệu ReAct. Tôi sẽ sử dụng tool lookup_paper với từ khóa \'react\'.\n[ACTION] Calling tool: lookup_paper(\'react\')...\n[OBSERVATION] Kết quả nhận được từ tool: ReAct: Synergizing Reasoning and Acting in LLMs (Yao et al., 2022)\n[FINAL ANSWER] Tài liệu nghiên cứu bạn cần tham khảo là: ReAct: Synergizing Reasoning and Acting in LLMs (Yao et al., 2022)'
    }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  checkServerStatus();
  renderApp();
});

async function checkServerStatus() {
  try {
    const res = await fetch('/api/status');
    state.serverStatus = await res.json();
    console.log('OpenAI Backend Status:', state.serverStatus);
  } catch (err) {
    console.warn('Backend status check offline:', err);
  }
}

// Render Main App
function renderApp() {
  const root = document.getElementById('app');
  root.innerHTML = `
    <!-- Top Role Switching Bar -->
    <div class="role-bar">
      <div class="role-info">
        <span>K4 HACKATHON • REAL OPENAI API + HUMAN-IN-THE-LOOP</span>
        <span class="role-badge" id="role-display-text">Giao diện: ${state.currentRole === 'student' ? '👨‍🎓 Học viên' : '👨‍🏫 Lab Coach Studio'}</span>
      </div>
      <div class="role-switcher">
        <button class="role-btn ${state.currentRole === 'student' ? 'active' : ''}" onclick="switchRole('student')">
          👨‍🎓 Học viên
        </button>
        <button class="role-btn ${state.currentRole === 'coach' ? 'active' : ''}" onclick="switchRole('coach')">
          👨‍🏫 Lab Coach Studio
        </button>
      </div>
    </div>

    <!-- VLearn Header -->
    <header class="vlearn-header">
      <div class="header-left">
        <a href="#" class="brand-logo" onclick="event.preventDefault()">
          <svg class="brand-icon" viewBox="0 0 32 32" fill="none">
            <path d="M6 8L16 26L26 8" stroke="#C8102E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 8L16 16L20 8" stroke="#0C2340" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>VLearn</span>
        </a>
        <nav class="nav-links">
          <a class="nav-item active" onclick="event.preventDefault()">Trang chủ</a>
          <a class="nav-item" onclick="openAiLogsModal()">📊 Log AI Engine</a>
        </nav>
      </div>

      <div class="header-right">
        <button class="btn-codelabs-link" onclick="scrollToCodelabs()">
          Mở Mini Projects
        </button>
        <span class="lang-badge">VI</span>
        <button class="theme-toggle-btn" onclick="toggleTheme()" title="Đổi giao diện">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        </button>
        <div class="user-profile-badge">
          <div class="user-avatar-num">2</div>
          <span class="user-email">hocvien.ai@vlearn.edu.vn</span>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="page-container">
      ${state.currentRole === 'student' ? renderStudentDashboard() : renderCoachStudio()}
    </main>

    <!-- Modal Workspace Container -->
    <div id="modal-container"></div>

    <footer class="vlearn-footer">
      <p>© 2026 VLearn - Nền tảng học tập VinUni AI Thực Chiến • OpenAI API Real Integration Baseline</p>
    </footer>
  `;
}

window.switchRole = function(role) {
  state.currentRole = role;
  renderApp();
};

window.toggleTheme = function() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  if (state.theme === 'dark') document.body.classList.add('dark-mode');
  else document.body.classList.remove('dark-mode');
};

window.scrollToCodelabs = function() {
  const el = document.getElementById('codelabs-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// Render Student Dashboard
function renderStudentDashboard() {
  const publishedLabs = state.codelabs.filter(c => c.status === 'Đã phát hành' || !c.status);

  return `
    <div class="section-header">
      <div>
        <div class="breadcrumb-tag">VLEARN • VINUNI AI THỰC CHIẾN</div>
        <h1 class="page-title">Không gian học tập VLearn</h1>
        <p class="page-subtitle">Xem các Mini Project Codelab đã được Lab Coach duyệt để củng cố kiến thức trước giờ Lab chiều.</p>
      </div>
      <div class="course-count-badge">
        1 khóa học đang theo học
      </div>
    </div>

    <!-- Welcome Banner Card -->
    <div class="welcome-banner">
      <div class="welcome-banner-bg-shape"></div>
      <div class="welcome-banner-content">
        <div class="banner-sublabel">VLEARN • VINUNI AI THỰC CHIẾN</div>
        <h2 class="banner-title">Chào mừng trở lại, HỌC VIÊN VLEARN!</h2>
        <p class="banner-desc">
          Các bài Mini Project Codelab được thiết kế thành các file code hoàn chỉnh (gồm giải thích và lệnh chạy), giúp bạn đọc hiểu bản chất dự án AI trước khi vào bài Lab chiều 4 tiếng.
        </p>
        <div class="banner-tags">
          <span class="status-pill active"><span class="dot"></span> ${publishedLabs.length} Mini Projects đã sẵn sàng</span>
          <span class="status-pill read-status">Human-in-the-Loop Verified</span>
        </div>
      </div>
    </div>

    <!-- CP2 CORE FEATURE: Mini Project Codelabs -->
    <div id="codelabs-section">
      <div class="codelab-section-title">
        <h2>
          <span>⚡ Mini Project Codelabs (AI Generated & Coach Approved)</span>
          <span class="codelab-section-badge">Cầu nối bài Lab Chiều</span>
        </h2>
      </div>

      <div class="codelabs-grid">
        ${publishedLabs.map(lab => `
          <div class="codelab-item-card">
            <div>
              <div class="codelab-card-tag">
                <span class="tag-morning">${lab.morningTopic || 'Chủ đề lý thuyết'}</span>
                <span class="tag-duration">⏱️ ${lab.duration || '15 phút'}</span>
              </div>
              <h3 class="codelab-card-h3">${lab.title}</h3>
              <p class="codelab-card-desc">${lab.description}</p>
              <div class="codelab-card-meta">
                <strong>📦 Số file code dự án:</strong> ${lab.files ? lab.files.length : 0} files<br>
                <strong>🔗 Trích dẫn Slide:</strong> ${lab.morningSlideRef || '[T04-032]'}<br>
                <strong>🎯 Chuẩn bị cho:</strong> ${lab.afternoonLabTarget || 'Lab chiều'}
              </div>
            </div>
            <button class="btn-primary" onclick="openProjectWorkspace('${lab.id}')">
              <span>🚀 Mở Dự án Mini & Xem Code</span>
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Render Lab Coach Studio View with Human-In-The-Loop Review Loop
function renderCoachStudio() {
  return `
    <div class="section-header">
      <div>
        <div class="breadcrumb-tag">LAB COACH STUDIO • HUMAN-IN-THE-LOOP ENGINE</div>
        <h1 class="page-title">Sinh & Duyệt Mini Project Codelab</h1>
        <p class="page-subtitle">Quy trình duyệt bài tập Human-in-the-loop: Tải lên Slide PPTX bài giảng & File README.md đề bài chiều -> AI sinh dự án code -> Lab Coach duyệt hoặc yêu cầu sửa đổi.</p>
      </div>
    </div>

    <!-- Input Form Card -->
    <div class="coach-studio-card">
      <form onsubmit="event.preventDefault(); handleCoachGenerate();">
        <!-- 1. Slide PPTX Selection / Upload -->
        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <label class="form-label" style="margin-bottom: 0;">1. Slide / File PPTX Bài giảng Buổi sáng</label>
            <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 10px; font-weight: 700;">⚡ PPTX -> Markdown Tool (Tiết kiệm Token)</span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Tải lên file .pptx / .pdf hoặc chọn slide bài giảng để AI chuyển đổi sang Markdown và phân tích.</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <select id="coach-morning-slide" class="form-control">
              <option value="d1-slide-hackathon.pptx - Day 4: ReAct Agent Architecture & Tool Calling">d1-slide-hackathon.pptx - Day 4: ReAct Agent Architecture</option>
              <option value="d1-slide-hackathon.pptx - Day 2: HAX Rules & Conditional Automation">d1-slide-hackathon.pptx - Day 2: HAX Rules & Automation</option>
              <option value="d2-slide-hackathon.pptx - Day 5: Eval Golden Set & Red Teaming">d2-slide-hackathon.pptx - Day 5: Eval Golden Set</option>
            </select>
            <input type="file" id="coach-slide-file-input" accept=".pptx,.pdf,.txt,.md" class="form-control" onchange="handleSlideFileUpload(event)">
          </div>
          <div id="slide-file-status" style="font-size: 12px; color: var(--accent-green); margin-top: 4px;"></div>
        </div>

        <!-- 2. Repo README.md Upload / Selection -->
        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <label class="form-label" style="margin-bottom: 0;">2. File README.md của Repo Codelab Buổi chiều (4 tiếng)</label>
            <span style="font-size: 11px; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 10px; font-weight: 700;">🛡️ Chỉ đọc README.md (Tránh tốn token toàn bộ repo)</span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Do Repo bài lab chiều rất lớn, hệ thống <strong>chỉ đọc file README.md</strong> để AI nắm rõ yêu cầu bài tập mà không cần quét toàn bộ codebase dự án.</p>
          <div style="display: flex; gap: 10px; margin-bottom: 8px;">
            <input type="file" id="coach-readme-file-input" accept=".md,.txt" class="form-control" style="flex: 1;" onchange="handleReadmeFileUpload(event)">
            <input type="text" id="coach-afternoon-repo-name" class="form-control" style="flex: 1;" placeholder="Tên Repo (VD: github.com/vlearn/day4-research-agent-lab)" value="github.com/vlearn/day4-research-agent-lab">
          </div>
          <textarea id="coach-readme-content" class="form-control" rows="4" placeholder="Nội dung file README.md (Hoặc chọn file .md ở trên để nạp tự động)..."># Day 04 Lab: Research Agent Tool Eval

## Overview
Xây dựng một ReAct Agent hoàn chỉnh tích hợp 6 tools chính (fetch, paper, lookup, format...).
Agent có khả năng lập luận qua các bước Thought-Action-Observation và tổng hợp kết quả nghiên cứu.

## Requirements
1. Triển khai ReAct Agent class với luồng xử lý tool calling.
2. Đánh giá agent với bộ Golden Set (10 test cases).
3. Đảm bảo tuân thủ nguyên tắc HAX Rule G10 (xử lý trường hợp không tìm thấy dữ liệu).</textarea>
        </div>

        <!-- 3. Ràng buộc Policy -->
        <div class="form-group">
          <label class="form-label">3. Ràng buộc Prompt & Thư viện (Constraint Policy)</label>
          <textarea id="coach-prompt-rules" class="form-control" rows="2">Tạo mini project gồm 3 file Python (tools.py, agent.py, main.py). Code có comment rõ ràng và trích dẫn mã Slide [T04-032].</textarea>
        </div>

        <button type="submit" id="btn-generate-submit" class="btn-primary" style="font-size: 15px; padding: 12px 24px;">
          <span>🤖 Sinh Mini Project Codelab bằng AI (Tối ưu Token)</span>
        </button>
      </form>

      <!-- Live Generation Status Container -->
      <div id="coach-generation-status" style="margin-top: 20px;"></div>
    </div>

    <!-- HUMAN-IN-THE-LOOP REVIEW CONTAINER -->
    <div id="coach-review-panel">
      ${state.pendingCoachLab ? renderCoachReviewPanel(state.pendingCoachLab) : ''}
    </div>
  `;
}


// Render Review Panel for Lab Coach
function renderCoachReviewPanel(lab) {
  return `
    <div class="review-box">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div>
          <span class="review-badge">⏳ Chờ Lab Coach duyệt (Human-In-The-Loop)</span>
          <h3 style="font-size: 20px; font-weight: 800; margin-top: 6px; color: var(--navy-dark);">${lab.title}</h3>
          <p style="font-size: 13px; color: var(--text-muted);">${lab.description}</p>
        </div>
      </div>

      <!-- Overview & Run Command -->
      <div style="background: var(--card-bg); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 16px;">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">💡 Tổng quan kiến trúc Mini Project:</h4>
        <p style="font-size: 13px; color: var(--text-main); margin-bottom: 10px;">${lab.projectOverview || ''}</p>
        <div style="font-size: 12px; font-family: monospace; background: #0f172a; color: #38bdf8; padding: 8px 12px; border-radius: 6px;">
          💻 Hướng dẫn chạy: ${lab.runInstructions || 'python main.py'}
        </div>
      </div>

      <!-- Preview Code Files -->
      <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 10px;">📦 Danh sách File Code AI đã sinh (${lab.files ? lab.files.length : 0} files):</h4>
      <div class="project-files-container" style="margin-bottom: 20px;">
        <div class="file-tree-sidebar">
          <div class="file-tree-title">Files trong Mini Project</div>
          ${lab.files ? lab.files.map((f, idx) => `
            <div class="file-tree-item ${idx === state.activeFileIndex ? 'active' : ''}" onclick="switchReviewFileIndex(${idx})">
              <span>📄 ${f.filename}</span>
            </div>
          `).join('') : ''}
        </div>
        <div class="file-code-display">
          ${lab.files && lab.files[state.activeFileIndex] ? `
            <div class="file-code-header">
              <span>📄 ${lab.files[state.activeFileIndex].filename}</span>
              <span style="color: #94a3b8; font-weight: normal;">${lab.files[state.activeFileIndex].purpose || ''}</span>
            </div>
            <div class="file-code-body">${escapeHtml(lab.files[state.activeFileIndex].code)}</div>
          ` : '<div class="file-code-body">Không có code</div>'}
        </div>
      </div>

      <!-- Human-in-the-loop Action Form -->
      <div style="background: var(--card-bg); padding: 20px; border-radius: 12px; border: 2px solid var(--primary-red);">
        <h4 style="font-size: 15px; font-weight: 800; color: var(--navy-dark); margin-bottom: 8px;">
          👨‍🏫 Quyết định của Lab Coach (Human-In-The-Loop):
        </h4>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
          Nếu hài lòng, bấm <strong>[✔ Chấp thuận & Phát hành]</strong> để đẩy bài lên Dashboard Học viên. Nếu cần chỉnh sửa, nhập lý do và bấm <strong>[🔄 Yêu cầu AI sửa lại]</strong>.
        </p>

        <div class="form-group" style="margin-bottom: 14px;">
          <textarea id="coach-feedback-input" class="form-control" rows="2" placeholder="Ví dụ: Thêm comment giải thích rõ hơn đoạn gọi lookup_paper trong agent.py và bổ sung file requirements.txt..."></textarea>
        </div>

        <div style="display: flex; gap: 12px;">
          <button type="button" class="btn-success" style="flex: 1; padding: 12px;" onclick="approveAndPublishLab()">
            <span>✔ Chấp thuận & Phát hành bài lên Dashboard Học viên</span>
          </button>
          <button type="button" class="btn-warning" style="flex: 1; padding: 12px;" onclick="rejectAndReviseLab()">
            <span>🔄 Yêu cầu AI sửa lại theo phản hồi (Loop)</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

window.switchReviewFileIndex = function(idx) {
  state.activeFileIndex = idx;
  renderApp();
};

// File Upload Handlers for Token Efficiency
window.handleSlideFileUpload = function(event) {
  const file = event.target.files[0];
  const statusEl = document.getElementById('slide-file-status');
  if (file) {
    statusEl.innerHTML = `📄 Đã chọn file slide: <strong>${file.name}</strong> (${Math.round(file.size/1024)} KB) - Sẵn sàng gửi tới tool pptx_to_md!`;
  }
};

window.handleReadmeFileUpload = function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('coach-readme-content').value = e.target.result;
    };
    reader.readAsText(file);
  }
};

// Handle Coach AI Generate (Token Efficient - Only PPTX + README.md)
window.handleCoachGenerate = async function() {
  const morningSlideSelect = document.getElementById('coach-morning-slide').value;
  const slideFileInput = document.getElementById('coach-slide-file-input');
  const slideFileName = (slideFileInput && slideFileInput.files.length > 0) ? slideFileInput.files[0].name : morningSlideSelect;

  const repoName = document.getElementById('coach-afternoon-repo-name').value;
  const readmeContent = document.getElementById('coach-readme-content').value;
  const rules = document.getElementById('coach-prompt-rules').value;

  const statusEl = document.getElementById('coach-generation-status');
  statusEl.innerHTML = `<div style="color: #f59e0b; font-size: 14px; font-weight: 700;">⏳ OpenAI API đang phân tích File PPTX & README.md để sinh Mini Project (JSON Schema)...</div>`;

  try {
    const res = await fetch('/api/generate_minicodelab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        morning_slide: slideFileName,
        afternoon_repo: repoName,
        readme_content: readmeContent,
        rules: rules
      })
    });

    const data = await res.json();
    if (data.success && data.lab) {
      statusEl.innerHTML = `<div style="color: #10b981; font-size: 14px; font-weight: 700;">✔ Đã sinh xong bản dự thảo! Hãy xem và duyệt ở bên dưới.</div>`;
      state.pendingCoachLab = data.lab;
      state.pendingCoachLab.id = `proj-${Date.now()}`;
      state.activeFileIndex = 0;
      renderApp();
    } else {
      statusEl.innerHTML = `<div style="color: #ef4444;">❌ Lỗi: ${data.error || 'Không sinh được dự án.'}</div>`;
    }
  } catch (err) {
    statusEl.innerHTML = `<div style="color: #ef4444;">❌ Lỗi kết nối: ${err.message}</div>`;
  }
};


// Approve and Publish Lab
window.approveAndPublishLab = function() {
  if (!state.pendingCoachLab) return;
  
  state.pendingCoachLab.status = 'Đã phát hành';
  state.codelabs.unshift(state.pendingCoachLab);
  const title = state.pendingCoachLab.title;
  state.pendingCoachLab = null;

  alert(`🎉 Đã chấp thuận và phát hành thành công Mini Project "${title}" lên Dashboard Học viên!`);
  switchRole('student');
};

// Reject and Request AI Revision (Human-in-the-loop Revision Loop)
window.rejectAndReviseLab = async function() {
  const feedbackInput = document.getElementById('coach-feedback-input').value.trim();
  if (!feedbackInput) {
    alert('Vui lòng nhập ý kiến / lý do cần sửa đổi để AI biết cách điều chỉnh!');
    return;
  }

  const statusEl = document.getElementById('coach-generation-status');
  statusEl.innerHTML = `<div style="color: #f59e0b; font-size: 14px; font-weight: 700;">🔄 AI đang tiếp thu phản hồi của Lab Coach và sửa lại Mini Project...</div>`;

  try {
    const res = await fetch('/api/revise_minicodelab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feedback: feedbackInput,
        current_lab: state.pendingCoachLab
      })
    });

    const data = await res.json();
    if (data.success && data.lab) {
      statusEl.innerHTML = `<div style="color: #10b981; font-size: 14px; font-weight: 700;">✔ AI đã cập nhật dự án theo góp ý! Vui lòng kiểm tra bản mới bên dưới.</div>`;
      state.pendingCoachLab = data.lab;
      state.activeFileIndex = 0;
      renderApp();
    } else {
      statusEl.innerHTML = `<div style="color: #ef4444;">❌ Lỗi sửa bài: ${data.error || 'Lỗi xử lý'}</div>`;
    }
  } catch (err) {
    statusEl.innerHTML = `<div style="color: #ef4444;">❌ Lỗi kết nối: ${err.message}</div>`;
  }
};

// Open Student Project Workspace Modal
window.openProjectWorkspace = function(labId) {
  const lab = state.codelabs.find(c => c.id === labId);
  if (!lab) return;

  state.activeCodelabId = labId;
  state.activeFileIndex = 0;

  renderProjectModal(lab);
};

window.closeModal = function() {
  document.getElementById('modal-container').innerHTML = '';
};

function renderProjectModal(lab) {
  const container = document.getElementById('modal-container');
  const activeFile = lab.files ? lab.files[state.activeFileIndex] : null;

  container.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
      <div class="workspace-modal">
        <div class="workspace-header">
          <div class="workspace-title-box">
            <h3>${lab.title}</h3>
            <span class="workspace-subtitle">⏱️ Thời lượng: ${lab.duration || '15 phút'} • ${lab.morningSlideRef || '[T04-032]'}</span>
          </div>
          <button class="modal-close-btn" onclick="closeModal()">✕</button>
        </div>

        <div class="workspace-body">
          <!-- Overview Box -->
          <div style="background: var(--bg-page); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 20px;">
            <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px; color: var(--navy-dark);">💡 Tổng quan Mini Project:</h4>
            <p style="font-size: 13px; color: var(--text-main); margin-bottom: 10px;">${lab.projectOverview || lab.description}</p>
            <div style="font-size: 12px; font-family: monospace; background: #0f172a; color: #38bdf8; padding: 8px 12px; border-radius: 6px;">
              💻 Hướng dẫn chạy: ${lab.runInstructions || 'python main.py'}
            </div>
          </div>

          <!-- Code Files Explorer -->
          <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--navy-dark);">📦 Danh sách File Code Dự án (${lab.files ? lab.files.length : 0} files):</h4>
          <div class="project-files-container" style="margin-bottom: 20px;">
            <div class="file-tree-sidebar">
              <div class="file-tree-title">Cấu trúc File</div>
              ${lab.files ? lab.files.map((f, idx) => `
                <div class="file-tree-item ${idx === state.activeFileIndex ? 'active' : ''}" onclick="switchModalFileIndex('${lab.id}', ${idx})">
                  <span>📄 ${f.filename}</span>
                </div>
              `).join('') : ''}
            </div>
            <div class="file-code-display">
              ${activeFile ? `
                <div class="file-code-header">
                  <span>📄 ${activeFile.filename}</span>
                  <span style="color: #94a3b8; font-weight: normal;">${activeFile.purpose || ''}</span>
                </div>
                <div class="file-code-body">${escapeHtml(activeFile.code)}</div>
              ` : '<div class="file-code-body">Không có code</div>'}
            </div>
          </div>

          <!-- Terminal Execution Sandbox -->
          <div style="background: #0f172a; border-radius: 10px; padding: 16px; color: #f8fafc;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 13px; font-weight: 700; color: #38bdf8;">🖥️ Terminal Sandbox - Output Thực Thi Dự Án</span>
              <button class="btn-primary" style="width: auto; padding: 6px 14px; font-size: 12px;" onclick="runInteractiveSandbox('${lab.id}')">
                ▶ Chạy thử Mini Agent với OpenAI API
              </button>
            </div>
            <div id="modal-terminal-output" style="font-family: monospace; font-size: 12.5px; background: #1e293b; padding: 14px; border-radius: 6px; min-height: 100px; white-space: pre-wrap; color: #cbd5e1;">
${lab.expectedOutput ? escapeHtml(lab.expectedOutput) : 'Click [ ▶ Chạy thử Mini Agent với OpenAI API ] để xem log thực thi dự án...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.switchModalFileIndex = function(labId, idx) {
  state.activeFileIndex = idx;
  const lab = state.codelabs.find(c => c.id === labId);
  if (lab) renderProjectModal(lab);
};

window.runInteractiveSandbox = async function(labId) {
  const outputEl = document.getElementById('modal-terminal-output');
  outputEl.innerHTML = `<span style="color: #facc15;">⏳ Đang thực thi Mini Agent qua OpenAI API...</span>`;

  try {
    const lab = state.codelabs.find(c => c.id === labId);
    const mainFile = lab.files ? lab.files.find(f => f.filename.includes('main') || f.filename.includes('agent')) : null;
    const codeSnippet = mainFile ? mainFile.code : 'Chạy thử ReAct Agent';

    const res = await fetch('/api/run_agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code_input: codeSnippet })
    });

    const data = await res.json();
    if (data.success) {
      outputEl.innerHTML = `<span style="color: #34d399;">✔ Output Thực Thi Real OpenAI API:</span>\n\n` + escapeHtml(data.output || JSON.stringify(data, null, 2));
    } else {
      outputEl.innerHTML = `<span style="color: #ef4444;">❌ Lỗi: ${escapeHtml(data.error)}</span>`;
    }
  } catch (err) {
    outputEl.innerHTML = `<span style="color: #ef4444;">❌ Lỗi server: ${err.message}</span>`;
  }
};

// Open AI Logs Drawer Modal
window.openAiLogsModal = async function() {
  const container = document.getElementById('modal-container');
  container.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
      <div class="workspace-modal" style="max-width: 900px;">
        <div class="workspace-header">
          <h3>📊 AI Log Manager (Lưu vết tương tác LLM)</h3>
          <button class="modal-close-btn" onclick="closeModal()">✕</button>
        </div>
        <div class="workspace-body" id="ai-logs-body">
          <div style="color: var(--text-muted);">⏳ Đang tải danh sách AI logs...</div>
        </div>
      </div>
    </div>
  `;

  try {
    const res = await fetch('/api/logs');
    const logs = await res.json();
    const bodyEl = document.getElementById('ai-logs-body');

    if (!logs || logs.length === 0) {
      bodyEl.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">Chưa có log tương tác AI nào được lưu.</div>`;
      return;
    }

    bodyEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${logs.map(log => `
          <div style="background: var(--bg-page); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
              <span style="font-weight: 700; color: var(--navy-dark);">⚡ Action: ${log.action_type}</span>
              <span style="color: var(--text-muted);">${log.timestamp} • Status: <strong style="color: ${log.status === 'SUCCESS' ? '#10b981' : '#ef4444'}">${log.status}</strong></span>
            </div>
            <div style="font-family: monospace; font-size: 11px; background: #0f172a; color: #38bdf8; padding: 10px; border-radius: 6px; overflow-x: auto; max-height: 150px;">
              <strong>Prompt:</strong> ${escapeHtml(JSON.stringify(log.prompt, null, 2))}<br><br>
              <strong>Response:</strong> ${escapeHtml(typeof log.response === 'string' ? log.response : JSON.stringify(log.response, null, 2))}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    document.getElementById('ai-logs-body').innerHTML = `<div style="color: #ef4444;">Không thể tải log: ${err.message}</div>`;
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
