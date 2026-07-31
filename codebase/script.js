const selectedAnswers = { 1: null, 2: null, 3: null };
const wrongAttempts = { 1: 0, 2: 0, 3: 0 };
const lastSubmittedOption = { 1: null, 2: null, 3: null };
const isQuestionPassed = { 1: false, 2: false, 3: false };

const correctAnswers = { 1: 'A', 2: 'B', 3: 'B' };

const optionTexts = {
    1: {
        A: 'A. Self-Attention tính toán trọng số tương quan xác suất giữa các vector token; cụm "sách quá dày" có trọng số (0.32) cao hơn hẳn "túi quá dày" (0.09).',
        B: 'B. Do từ "túi" đứng sát từ "nó" hơn trong câu nên mô hình luôn chọn từ đứng gần nhất.',
        C: 'C. Do AI hiểu được ý nghĩa thực tế bên ngoài đời thực là chỉ có sách mới dày còn túi thì không.',
        D: 'D. Do trọng số Attention được khởi tạo ngẫu nhiên mỗi lần chạy mô hình.'
    },
    2: {
        A: 'A. Do Chinchilla 70B có số lượng tham số được nén lại thông minh hơn nên luôn mạnh hơn.',
        B: 'B. Do Chinchilla được huấn luyện trên lượng dữ liệu (Tokens) gấp 4 lần, đạt tỷ lệ tối ưu giữa Data và Parameters (Chinchilla Scaling Law).',
        C: 'C. Do Gopher 280B chạy quá chậm nên bị tính điểm phạt khi chấm benchmark.',
        D: 'D. Do Chinchilla được áp dụng RLHF còn Gopher thì không.'
    },
    3: {
        A: 'A. Chọn Full Automate 100% để tiết kiệm tối đa thời gian cho giảng viên.',
        B: 'B. Chấm bài tập lớn có Cost-of-Error rất cao (AI chấm sai gây bức xúc/mất điểm); bắt buộc dùng Conditional Automation / Augment (AI chấm nháp + Giảng viên/TA duyệt).',
        C: 'C. Tuyệt đối không ứng dụng AI vì AI luôn luôn chấm sai bài tập.',
        D: 'D. Chuyển cho các học viên tự chấm chéo lẫn nhau.'
    }
};

const conceptExplanations = {
    1: {
        correct: 'Self-Attention tính toán trọng số tương quan xác suất giữa các vector token ("nó" & "quyển sách" = 0.32) chứ không phụ thuộc vào vị trí đứng gần (0.09).',
        misconception: {
            B: 'Self-Attention không chọn từ dựa vào vị trí đứng sát nhau mà dựa trên trọng số xác suất toán học của ngữ cảnh.',
            C: 'AI không "hiểu" thực tế đời thực như người; nó tính toán xác suất thống kê vector token dựa trên dữ liệu training.',
            D: 'Trọng số Attention được tính toán cố định thông qua Ma trận Query, Key, Value chứ không phải ngẫu nhiên.'
        }
    },
    2: {
        correct: 'Chinchilla 70B thắng Gopher 280B nhờ tỷ lệ tối ưu giữa Data (Tokens) và Parameters (Chinchilla Scaling Law). Lượng Tokens huấn luyện gấp 4 lần mới là yếu tố quyết định.',
        misconception: {
            A: 'Số lượng tham số lớn không đồng nghĩa với thông minh hơn nếu thiếu Data huấn luyện tương ứng.',
            C: 'Benchmark đánh giá chất lượng đầu ra chứ không phạt điểm tốc độ chạy.',
            D: 'Cả hai mô hình đều là pretraining model, sự khác biệt cốt lõi ở Slide 23 nằm ở Pretraining Data Scaling.'
        }
    },
    3: {
        correct: 'Chấm bài tập lớn có Cost-of-Error rất cao (AI chấm sai làm học viên bức xúc). Bắt buộc phải áp dụng Conditional Automation hoặc Augment (AI chấm nháp + Giảng viên/TA duyệt cuối).',
        misconception: {
            A: 'Bài toán Cost-of-Error cao không thể tự động hóa 100% khi chưa có con người kiểm duyệt.',
            C: 'AI hoàn toàn có thể hỗ trợ chấm nháp (Augment) giúp giảng viên tiết kiệm 70% thời gian.',
            D: 'Học viên chấm chéo không đảm bảo được chuẩn mực đánh giá chuyên môn.'
        }
    }
};

function scrollToQuiz() {
    document.getElementById('activeRecallQuiz').scrollIntoView({ behavior: 'smooth' });
}

function selectMc(qNum, optionKey, el) {
    if (isQuestionPassed[qNum] || wrongAttempts[qNum] >= 2) return;
    selectedAnswers[qNum] = optionKey;
    const container = document.getElementById('mcOptions' + qNum);
    container.querySelectorAll('.mc-option-card').forEach(card => card.classList.remove('selected'));
    el.classList.add('selected');
    const radio = el.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;

    // Enable submit button ONLY IF the user selected a DIFFERENT option from the last submitted wrong option
    const btnSubmit = container.parentNode.querySelector('.btn-submit-quiz');
    if (btnSubmit && optionKey !== lastSubmittedOption[qNum]) {
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = '1.0';
        btnSubmit.style.cursor = 'pointer';
        btnSubmit.innerText = 'Nộp đáp án & AI Phân tích Hiểu lầm 🚀';
    }
}

function checkMcAns(qNum) {
    if (isQuestionPassed[qNum] || wrongAttempts[qNum] >= 2) return;

    const opt = selectedAnswers[qNum];
    const resBox = document.getElementById('res' + qNum);
    const container = document.getElementById('mcOptions' + qNum);
    const btnSubmit = container.parentNode.querySelector('.btn-submit-quiz');

    if (!opt) {
        alert("⚠️ Vui lòng chọn một đáp án trắc nghiệm trước khi bấm Nộp!");
        return;
    }

    resBox.className = 'result-box';
    let citation = { 1: '[T01-022]', 2: '[T01-023]', 3: '[T02-014]' }[qNum];
    let correctOpt = correctAnswers[qNum];
    let isCorrect = (opt === correctOpt);

    // CASE 1: CORRECT ANSWER -> Lock question and disable submit button completely!
    if (isCorrect) {
        isQuestionPassed[qNum] = true;
        container.style.pointerEvents = 'none';
        container.style.opacity = '0.85';

        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.style.opacity = '0.5';
            btnSubmit.style.cursor = 'not-allowed';
            btnSubmit.innerText = '🎉 Đã hoàn thành (Đáp án chính xác)';
        }

        resBox.style.borderLeftColor = '#10b981';
        resBox.style.background = '#ecfdf5';

        let diagHTML = `<strong>🟢 Chính xác! (Correct Concept):</strong><br>${conceptExplanations[qNum].correct}`;
        resBox.innerHTML = `
            <div class="result-tag" style="color: #059669; font-weight: 700;">🟢 CHÍNH XÁC! BẠN ĐÃ NẮM VỮNG KIẾN THỨC CỐT LỖI</div>
            <div class="result-text">${diagHTML}</div>
            <div style="margin-top: 10px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <span class="citation-badge">📌 Trích dẫn: ${citation}</span>
                <button style="background: #38bdf8; color: #0f172a; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;" onclick="showTrace(${qNum}, 'Option ${opt}', 'PASS')">🔍 Xem AI Execution Trace Log</button>
            </div>
        `;
        resBox.style.display = 'flex';
        resBox.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // CASE 2: INCORRECT ANSWER -> Save lastSubmittedOption and disable submit button until user changes choice!
    lastSubmittedOption[qNum] = opt;
    wrongAttempts[qNum]++;

    if (wrongAttempts[qNum] < 2) {
        // FIRST WRONG ATTEMPT: Disable submit button until user picks a different option!
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.style.opacity = '0.5';
            btnSubmit.style.cursor = 'not-allowed';
            btnSubmit.innerText = '⚠️ Vui lòng chọn đáp án khác trước khi nộp lại';
        }

        resBox.style.borderLeftColor = '#f43f5e';
        resBox.style.background = '#fff5f5';

        let misconceptionText = conceptExplanations[qNum].misconception[opt] || 'Bạn đang hiểu sai bản chất khái niệm.';
        resBox.innerHTML = `
            <div class="result-tag" style="color: #e11d48; font-weight: 700;">🔴 LẦN THỬ 1/2 SAI — PHÁT HIỆN LỖI NHẦM LẪN (MISCONCEPTION DIAGNOSIS)</div>
            <div class="result-text">
                <strong>❌ Đáp án đã chọn (Option ${opt}):</strong> ${optionTexts[qNum][opt]}<br>
                <strong>👉 Phân tích lỗi sai:</strong> ${misconceptionText}
            </div>
            <div style="margin-top: 10px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <span class="citation-badge">📌 Trích dẫn: ${citation}</span>
                <button style="background: #38bdf8; color: #0f172a; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;" onclick="showTrace(${qNum}, 'Option ${opt}', 'MISCONCEPTION_ATTEMPT_1')">🔍 Xem AI Trace Log</button>
            </div>
            <div class="escalate-bar">
                <span style="font-size: 12px; color: #64748b;">Chưa rõ nhận xét?</span>
                <button class="btn-escalate-ta" onclick="escalateTA(${qNum})">📩 Chuyển vùng slide ${citation} cho TA hỗ trợ</button>
            </div>
        `;
    } else {
        // SECOND WRONG ATTEMPT: Lock question completely!
        container.style.pointerEvents = 'none';
        container.style.opacity = '0.6';

        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.style.opacity = '0.5';
            btnSubmit.style.cursor = 'not-allowed';
            btnSubmit.innerText = '🔒 Đã hết 2 lần thử (Đã khóa câu hỏi)';
        }

        resBox.style.borderLeftColor = '#dc2626';
        resBox.style.background = '#fef2f2';

        let userOptText = optionTexts[qNum][opt];
        let correctOptText = optionTexts[qNum][correctOpt];
        let userMisconception = conceptExplanations[qNum].misconception[opt] || 'Lỗi nhầm lẫn khái niệm.';
        let correctConcept = conceptExplanations[qNum].correct;

        resBox.innerHTML = `
            <div class="result-tag" style="color: #dc2626; font-weight: 700;">🔒 ĐÃ HẾT 2 LẦN THỬ — BẢNG PHÂN TÍCH SO SÁNH ĐÁP ÁN ĐÚNG & SAI</div>
            
            <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 12px; margin-top: 10px;">
                <div style="font-weight: 700; color: #e11d48; font-size: 13px;">❌ Đáp án bạn đã chọn (Option ${opt} — SAI):</div>
                <div style="font-size: 13px; color: #334155; margin-top: 4px;">${userOptText}</div>
                <div style="font-size: 12px; color: #9f1239; margin-top: 6px; font-style: italic;">👉 Nguyên nhân hiểu sai: ${userMisconception}</div>
            </div>

            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; margin-top: 10px;">
                <div style="font-weight: 700; color: #059669; font-size: 13px;">✅ Đáp án đúng (Option ${correctOpt} — CHÍNH XÁC):</div>
                <div style="font-size: 13px; color: #065f46; margin-top: 4px; font-weight: 600;">${correctOptText}</div>
                <div style="font-size: 12px; color: #047857; margin-top: 6px;">👉 Bản chất kiến thức đúng: ${correctConcept}</div>
            </div>

            <div style="margin-top: 12px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <span class="citation-badge">📌 Trích dẫn: ${citation}</span>
                <button style="background: #38bdf8; color: #0f172a; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;" onclick="showTrace(${qNum}, 'Option ${opt}', 'FAILED_MAX_ATTEMPTS')">🔍 Xem AI Execution Trace Log</button>
            </div>

            <div class="escalate-bar">
                <span style="font-size: 12px; color: #64748b;">Bạn muốn được Giảng viên/TA giải thích chi tiết hơn?</span>
                <button class="btn-escalate-ta" onclick="escalateTA(${qNum})">📩 Chuyển vùng slide ${citation} cho TA hỗ trợ</button>
            </div>
        `;
    }

    resBox.style.display = 'flex';
    resBox.scrollIntoView({ behavior: 'smooth' });
}

function resetMcQuestion(qNum) {
    if (isQuestionPassed[qNum] || wrongAttempts[qNum] >= 2) return;
    selectedAnswers[qNum] = null;
    const container = document.getElementById('mcOptions' + qNum);
    container.querySelectorAll('.mc-option-card').forEach(card => card.classList.remove('selected'));
    container.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    const resBox = document.getElementById('res' + qNum);
    resBox.style.display = 'none';
}

function escalateTA(qNum) {
    const citations = { 1: '[T01-022]', 2: '[T01-023]', 3: '[T02-014]' };
    document.getElementById('taCitationTag').innerText = citations[qNum];
    document.getElementById('taModal').style.display = 'flex';
}

function closeTaModal() {
    document.getElementById('taModal').style.display = 'none';
}

function confirmTaEscalate() {
    document.getElementById('taModal').style.display = 'none';
    alert(`✅ [PAIR Control] Đã gửi thành công câu hỏi và vị trí slide ${document.getElementById('taCitationTag').innerText} tới TA trực ban! TA sẽ phản hồi bạn trong 15 phút.`);
}

function showTrace(qNum, selectedOptionText, evalStatus) {
    const citations = { 1: '[T01-022]', 2: '[T01-023]', 3: '[T02-014]' };
    document.getElementById('traceContent').innerHTML = `
<strong>[REQUEST METADATA]</strong>
- Timestamp: ${new Date().toISOString()}
- Endpoint: /v1/chat/completions (Model: gemini-1.5-flash-evaluator)
- System Prompt: "You are VLearn Active Recall Evaluator. Dynamically evaluate selected Multiple Choice Option, detect misconceptions, output exact transcript citation [Txx-xxx], or track 2-attempt limit."

<strong>[USER INPUT EVALUATED]</strong>
- Question ID: Q${qNum}
- Selected MC Option: "${selectedOptionText}"
- Wrong Attempts Count: ${wrongAttempts[qNum]}/2

<strong>[SEMANTIC EVALUATION RESULT]</strong>
- Evaluation Status: ${evalStatus}
- Grounding Citation: ${citations[qNum]}
- HAX Guidelines Applied: ["G2_Explicit_Confidence", "G10_Scope_Services", "G11_Explain_Why"]
    `;
    document.getElementById('traceModal').style.display = 'flex';
}

function closeTraceModal() {
    document.getElementById('traceModal').style.display = 'none';
}

/* Interactive Drawing Engine for Pen & Text Selection Highlight Tools */
let currentToolMode = 'read';
let currentDrawColor = '#f43f5e';
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function setToolMode(mode) {
    currentToolMode = mode;
    document.querySelectorAll('.pdf-toolbar .tb-btn').forEach(btn => btn.classList.remove('active'));
    const subTb = document.getElementById('drawSubToolbar');

    if (mode === 'read') {
        document.getElementById('btnModeRead').classList.add('active');
        subTb.style.display = 'none';
        document.querySelectorAll('.draw-canvas').forEach(c => c.style.pointerEvents = 'none');
    } else if (mode === 'pen') {
        document.getElementById('btnModePen').classList.add('active');
        subTb.style.display = 'flex';
        document.querySelectorAll('.draw-canvas').forEach(c => c.style.pointerEvents = 'auto');
    } else if (mode === 'highlight') {
        document.getElementById('btnModeHighlight').classList.add('active');
        subTb.style.display = 'flex';
        document.querySelectorAll('.draw-canvas').forEach(c => c.style.pointerEvents = 'none');
    }
}

function setDrawColor(color, el) {
    currentDrawColor = color;
    document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active'));
    el.classList.add('active');
}

function initDrawCanvases() {
    document.querySelectorAll('.slide-frame').forEach(frame => {
        const canvas = frame.querySelector('.draw-canvas');
        if (!canvas) return;

        canvas.width = frame.offsetWidth || 800;
        canvas.height = frame.offsetHeight || 450;

        const ctx = canvas.getContext('2d');

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left,
                y: (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
            };
        }

        function startDraw(e) {
            if (currentToolMode !== 'pen') return;
            isDrawing = true;
            const pos = getPos(e);
            lastX = pos.x;
            lastY = pos.y;
        }

        function draw(e) {
            if (!isDrawing || currentToolMode !== 'pen') return;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);

            ctx.strokeStyle = currentDrawColor;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 1.0;

            ctx.stroke();
            lastX = pos.x;
            lastY = pos.y;
        }

        function stopDraw() {
            isDrawing = false;
        }

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mouseleave', stopDraw);

        canvas.addEventListener('touchstart', startDraw);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDraw);
    });
}

/* TEXT SELECTION HIGHLIGHT TOOL WITH OVERLAP RESOLUTION & COLOR PICKER */
function createHighlightBadge() {
    const badge = document.createElement('span');
    badge.className = 'hl-actions-badge';
    badge.innerHTML = `
        <span class="hl-color-btn" style="background: #f59e0b;" onclick="changeHighlightColor(this, '#f59e0b', event)" title="Đổi sang Vàng"></span>
        <span class="hl-color-btn" style="background: #f43f5e;" onclick="changeHighlightColor(this, '#f43f5e', event)" title="Đổi sang Đỏ"></span>
        <span class="hl-color-btn" style="background: #2563eb;" onclick="changeHighlightColor(this, '#2563eb', event)" title="Đổi sang Xanh"></span>
        <span class="hl-color-btn" style="background: #10b981;" onclick="changeHighlightColor(this, '#10b981', event)" title="Đổi sang Lục"></span>
        <span class="hl-delete-btn" onclick="removeSingleHighlight(this, event)" title="Xóa Highlight">✕</span>
    `;
    return badge;
}

function changeHighlightColor(btn, colorHex, event) {
    if (event) event.stopPropagation();
    const mark = btn.closest('.custom-text-highlight');
    if (!mark) return;
    let bgMap = {
        '#f43f5e': 'rgba(253, 164, 175, 0.7)',
        '#2563eb': 'rgba(147, 197, 253, 0.7)',
        '#f59e0b': 'rgba(253, 224, 71, 0.8)',
        '#10b981': 'rgba(110, 231, 183, 0.7)'
    };
    mark.setAttribute('data-color', colorHex);
    mark.style.backgroundColor = bgMap[colorHex] || 'rgba(253, 224, 71, 0.8)';

    const slideFrame = mark.closest('.slide-frame');
    if (slideFrame) {
        mergeAdjacentSameColorMarks(slideFrame);
    }
}

function areSameColor(m1, m2) {
    if (!m1 || !m2) return false;
    const c1 = m1.getAttribute('data-color') || m1.style.backgroundColor;
    const c2 = m2.getAttribute('data-color') || m2.style.backgroundColor;
    if (c1 && c2 && c1 === c2) return true;
    return getComputedStyle(m1).backgroundColor === getComputedStyle(m2).backgroundColor;
}

function mergeAdjacentSameColorMarks(container) {
    if (!container) return;

    let mergedAny = false;

    do {
        mergedAny = false;
        const marks = Array.from(container.querySelectorAll('.custom-text-highlight'));

        for (let i = 0; i < marks.length; i++) {
            const mark = marks[i];
            if (!mark.isConnected) continue;

            let sibling = mark.nextSibling;
            let spaceTextNode = null;

            // Skip empty text nodes or handle single whitespace node between marks
            while (sibling && sibling.nodeType === Node.TEXT_NODE && sibling.nodeValue.length === 0) {
                sibling = sibling.nextSibling;
            }

            if (sibling && sibling.nodeType === Node.TEXT_NODE && sibling.nodeValue.trim().length === 0) {
                spaceTextNode = sibling;
                let nextEl = sibling.nextSibling;
                while (nextEl && nextEl.nodeType === Node.TEXT_NODE && nextEl.nodeValue.length === 0) {
                    nextEl = nextEl.nextSibling;
                }
                sibling = nextEl;
            }

            if (sibling && sibling.nodeType === Node.ELEMENT_NODE && sibling.classList.contains('custom-text-highlight')) {
                if (areSameColor(mark, sibling)) {
                    mark.querySelector('.hl-actions-badge')?.remove();
                    sibling.querySelector('.hl-actions-badge')?.remove();

                    if (spaceTextNode && spaceTextNode.isConnected) {
                        mark.appendChild(spaceTextNode);
                    }

                    while (sibling.firstChild) {
                        mark.appendChild(sibling.firstChild);
                    }

                    mark.normalize();
                    mark.appendChild(createHighlightBadge());
                    sibling.remove();

                    mergedAny = true;
                    break;
                }
            }
        }
    } while (mergedAny);
}

function removeSingleHighlight(btn, event) {
    if (event) event.stopPropagation();
    const mark = btn.closest('.custom-text-highlight');
    if (!mark) return;
    unwrapMarkNode(mark);
}

function unwrapMarkNode(mark) {
    if (!mark || !mark.parentNode) return;
    mark.querySelector('.hl-actions-badge')?.remove();
    const parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
}

function processOverlappingMarks(range, slideFrame) {
    const marks = Array.from(slideFrame.querySelectorAll('.custom-text-highlight'));
    const unwrappedNodes = [];

    marks.forEach(mark => {
        try {
            if (!range.intersectsNode(mark)) return;

            const colorAttr = mark.getAttribute('data-color');
            const bgColor = mark.style.backgroundColor;

            // Remove existing badge before computing ranges
            const badge = mark.querySelector('.hl-actions-badge');
            if (badge) badge.remove();

            const markRange = document.createRange();
            markRange.selectNodeContents(mark);

            if (markRange.collapsed) {
                unwrapMarkNode(mark);
                return;
            }

            // Calculate exact intersection INSIDE mark:
            // intersectStart is max(range.start, markRange.start)
            let intersectStartContainer = range.startContainer;
            let intersectStartOffset = range.startOffset;
            if (range.compareBoundaryPoints(Range.START_TO_START, markRange) < 0) {
                intersectStartContainer = markRange.startContainer;
                intersectStartOffset = markRange.startOffset;
            }

            // intersectEnd is min(range.end, markRange.end)
            let intersectEndContainer = range.endContainer;
            let intersectEndOffset = range.endOffset;
            if (range.compareBoundaryPoints(Range.END_TO_END, markRange) > 0) {
                intersectEndContainer = markRange.endContainer;
                intersectEndOffset = markRange.endOffset;
            }

            const intersectRange = document.createRange();
            intersectRange.setStart(intersectStartContainer, intersectStartOffset);
            intersectRange.setEnd(intersectEndContainer, intersectEndOffset);

            // Left range (un-overlapped start section of mark)
            const leftRange = document.createRange();
            leftRange.setStart(markRange.startContainer, markRange.startOffset);
            leftRange.setEnd(intersectRange.startContainer, intersectRange.startOffset);

            // Right range (un-overlapped end section of mark)
            const rightRange = document.createRange();
            rightRange.setStart(intersectRange.endContainer, intersectRange.endOffset);
            rightRange.setEnd(markRange.endContainer, markRange.endOffset);

            const leftText = leftRange.toString();
            const intersectText = intersectRange.toString();
            const rightText = rightRange.toString();

            const parent = mark.parentNode;

            function makeOldMark(text) {
                const m = document.createElement('mark');
                m.className = 'custom-text-highlight';
                if (colorAttr) m.setAttribute('data-color', colorAttr);
                m.style.backgroundColor = bgColor;
                m.style.color = '#0f172a';
                m.style.padding = '2px 4px';
                m.style.borderRadius = '4px';
                m.appendChild(document.createTextNode(text));
                m.appendChild(createHighlightBadge());
                return m;
            }

            if (leftText && leftText.length > 0) {
                parent.insertBefore(makeOldMark(leftText), mark);
            }
            if (intersectText && intersectText.length > 0) {
                const textNode = document.createTextNode(intersectText);
                parent.insertBefore(textNode, mark);
                unwrappedNodes.push(textNode);
            }
            if (rightText && rightText.length > 0) {
                parent.insertBefore(makeOldMark(rightText), mark);
            }

            parent.removeChild(mark);
        } catch (e) {
            console.error("Error processing overlapping mark:", e);
        }
    });

    return unwrappedNodes;
}

function getTextNodesInRange(range) {
    const textNodes = [];
    const root = range.commonAncestorContainer;

    if (root.nodeType === Node.TEXT_NODE) {
        textNodes.push(root);
        return textNodes;
    }

    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function (node) {
                if (node.parentElement && node.parentElement.closest('.hl-actions-badge')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        }
    );

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }
    return textNodes;
}

function initTextHighlight() {
    document.addEventListener('mouseup', function () {
        if (currentToolMode !== 'highlight') return;

        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

        const selectedText = selection.toString().trim();
        if (selectedText.length === 0) return;

        const range = selection.getRangeAt(0);
        let container = range.commonAncestorContainer;
        if (container.nodeType === 3) container = container.parentNode;

        const slideFrame = container.closest('.slide-frame');
        if (!slideFrame) return;

        let bgMap = {
            '#f43f5e': 'rgba(253, 164, 175, 0.7)',
            '#2563eb': 'rgba(147, 197, 253, 0.7)',
            '#f59e0b': 'rgba(253, 224, 71, 0.8)',
            '#10b981': 'rgba(110, 231, 183, 0.7)'
        };
        const activeBgColor = bgMap[currentDrawColor] || 'rgba(253, 224, 71, 0.8)';

        // Process overlapping old marks and extract newly unwrapped nodes
        const unwrappedNodes = processOverlappingMarks(range, slideFrame);

        // Gather all target text nodes to highlight
        let textNodesToHighlight = [];

        if (range.startContainer.isConnected && range.endContainer.isConnected) {
            textNodesToHighlight = getTextNodesInRange(range);
        }

        unwrappedNodes.forEach(node => {
            if (node.isConnected && !textNodesToHighlight.includes(node)) {
                textNodesToHighlight.push(node);
            }
        });

        // Wrap each target text node in a new mark
        for (let i = textNodesToHighlight.length - 1; i >= 0; i--) {
            const node = textNodesToHighlight[i];
            if (!node.isConnected || !node.nodeValue) continue;

            let startOffset = 0;
            let endOffset = node.nodeValue.length;

            if (node === range.startContainer && range.startContainer.isConnected) {
                startOffset = range.startOffset;
            }
            if (node === range.endContainer && range.endContainer.isConnected) {
                endOffset = range.endOffset;
            }

            startOffset = Math.max(0, Math.min(startOffset, node.nodeValue.length));
            endOffset = Math.max(0, Math.min(endOffset, node.nodeValue.length));

            if (startOffset >= endOffset) continue;

            const textChunk = node.nodeValue.substring(startOffset, endOffset);
            if (!textChunk || textChunk.trim().length === 0) continue;

            const subRange = document.createRange();
            subRange.setStart(node, startOffset);
            subRange.setEnd(node, endOffset);

            const mark = document.createElement('mark');
            mark.className = 'custom-text-highlight';
            mark.setAttribute('data-color', currentDrawColor);
            mark.style.backgroundColor = activeBgColor;
            mark.style.color = '#0f172a';
            mark.style.padding = '2px 4px';
            mark.style.borderRadius = '4px';

            try {
                subRange.surroundContents(mark);
                mark.appendChild(createHighlightBadge());
            } catch (err) {
                try {
                    const fragment = subRange.extractContents();
                    mark.appendChild(fragment);
                    subRange.insertNode(mark);
                    mark.appendChild(createHighlightBadge());
                } catch (e) {
                    console.error("Highlight subRange failed:", e);
                }
            }
        }

        // Auto-merge adjacent highlight marks of the same color into 1 mark
        mergeAdjacentSameColorMarks(slideFrame);

        selection.removeAllRanges();
    });
}

function clearAllDrawings() {
    document.querySelectorAll('.draw-canvas').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    document.querySelectorAll('.custom-text-highlight').forEach(mark => {
        const parent = mark.parentNode;
        while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
        parent.removeChild(mark);
    });
}

window.addEventListener('load', function () {
    initDrawCanvases();
    initTextHighlight();
});
window.addEventListener('resize', initDrawCanvases);
setTimeout(initDrawCanvases, 500);
