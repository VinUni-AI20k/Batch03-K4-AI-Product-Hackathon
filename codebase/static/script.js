document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = window.location.origin.includes('5173') ? 'http://localhost:8000' : '';

    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const typingIndicator = document.getElementById('typing-indicator');
    const citationsContainer = document.getElementById('citations-container');
    const kbStatusText = document.getElementById('kb-status-text');
    const kbItemsContainer = document.getElementById('kb-items-container');
    const kbSearchInput = document.getElementById('kb-search-input');
    const kbSearchBtn = document.getElementById('kb-search-btn');
    const citationModal = document.getElementById('citation-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Navigation Tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Load initial KB stats and items
    loadKBData();

    async function loadKBData() {
        try {
            const statsRes = await fetch(`${API_BASE}/api/kb/stats`);
            if (statsRes.ok) {
                const stats = await statsRes.json();
                document.getElementById('stat-posts').textContent = stats.fb_posts_scraped || 8;
                document.getElementById('stat-verified').textContent = stats.total_verified_answers || 8;
                document.getElementById('stat-likes').textContent = stats.total_community_likes || 285;
                document.getElementById('stat-vlearn').textContent = stats.vlearn_snippets || 3;
                
                const model = stats.llm_enabled ? stats.model : 'local-rag';
                kbStatusText.textContent = `Đã đồng bộ ${stats.fb_posts_scraped} bài Q&A FB & VLearn (${model})`;
            }

            const kbRes = await fetch(`${API_BASE}/api/kb/search`);
            if (kbRes.ok) {
                const data = await kbRes.json();
                renderKBItems(data.results);
            }
        } catch (err) {
            console.error("Error loading KB:", err);
            kbStatusText.textContent = "Chế độ Local Demo KB (Offline ready)";
            // Mock render if offline
            renderKBItems([
                {
                    post_id: "1001",
                    author_name: "TA Nguyễn Minh",
                    question: "Lỗi pip install -r requirements.txt trên Windows báo C++ Build Tools",
                    verified_answer: { content: "Ưu tiên dùng wheel hoặc pycryptodome thay thế. Khoá hackathon chỉ cần Python 3.10-3.12 và package thuần Python." }
                },
                {
                    post_id: "1002",
                    author_name: "TA Trần Thu Hà",
                    question: "Hạn nộp bài spec.md cho Mini Hackathon Batch 03 chính xác là mấy giờ?",
                    verified_answer: { content: "17:30 Ngày 1 là mốc CP4 trên lớp. HẠN CỨNG nộp spec.md là 23:59 Ngày 1." }
                }
            ]);
        }
    }

    function renderKBItems(items) {
        if (!kbItemsContainer) return;
        kbItemsContainer.innerHTML = "";
        items.forEach(item => {
            const q = item.question || "";
            const a = item.verified_answer ? item.verified_answer.content : (item.content || "");
            const author = item.verified_answer ? item.verified_answer.author_name : "TA Mentor";
            const pid = item.post_id || item.id || "FB_Q&A";

            const card = document.createElement('div');
            card.className = "kb-item-card";
            card.innerHTML = `
                <div class="kb-item-header">
                    <span class="kb-item-id">#${pid} • ${author}</span>
                    <span class="badge badge-success">✓ Verified by TA</span>
                </div>
                <div class="kb-item-q">${q}</div>
                <div class="kb-item-a">${a}</div>
            `;
            kbItemsContainer.appendChild(card);
        });
    }

    if (kbSearchBtn) {
        kbSearchBtn.addEventListener('click', async () => {
            const query = kbSearchInput.value.trim();
            const res = await fetch(`${API_BASE}/api/kb/search?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                renderKBItems(data.results);
            }
        });
    }

    // Chat Handling
    async function handleSendMessage(text) {
        const message = text || userInput.value.trim();
        if (!message) return;

        appendMessage('user', message);
        if (!text) userInput.value = "";

        typingIndicator.classList.remove('hidden');
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            typingIndicator.classList.add('hidden');

            if (res.ok) {
                const data = await res.json();
                appendAgentMessage(data);
                updateSidebarCitations(data.citations);
                updateGuardrailStatus(data.guardrails_triggered);
            } else {
                appendMessage('agent', '❌ Có lỗi xảy ra khi kết nối tới Agent QA backend.');
            }
        } catch (err) {
            typingIndicator.classList.add('hidden');
            appendMessage('agent', '❌ Lỗi kết nối mạng: Vui lòng kiểm tra Server FastAPI đang chạy tại http://localhost:8000.');
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        
        const avatarText = sender === 'agent' ? '⚡' : '👤';
        const senderName = sender === 'agent' ? 'AI Agent QA — VinUni AI Thực Chiến' : 'Bạn (Học viên AI Thực Chiến)';

        msgDiv.innerHTML = `
            <div class="avatar ${sender}-avatar">${avatarText}</div>
            <div class="msg-content">
                <div class="msg-sender">${senderName}</div>
                <div class="msg-bubble">
                    <p>${text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendAgentMessage(data) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message agent-message`;

        let badgesHtml = "";
        if (data.guardrails_triggered && data.guardrails_triggered.length > 0) {
            data.guardrails_triggered.forEach(layer => {
                let label = layer;
                let badgeClass = "badge-warn";
                if (layer === "layer1_ground_truth") { label = "① Nguồn sự thật Guard"; badgeClass = "badge-danger"; }
                if (layer === "layer2_ambiguity") { label = "② Mơ hồ / Thiếu TT Guard"; badgeClass = "badge-warn"; }
                if (layer === "layer3_authority") { label = "③ Ngoài thẩm quyền Guard"; badgeClass = "badge-danger"; }
                if (layer === "layer4_domain") { label = "④ Đặc thù Domain Guard"; badgeClass = "badge-info"; }
                badgesHtml += `<span class="badge ${badgeClass}">${label}</span>`;
            });
        }
        badgesHtml += `<span class="badge badge-success">Độ tin cậy: ${Math.round(data.confidence_score * 100)}%</span>`;

        msgDiv.innerHTML = `
            <div class="avatar agent-avatar">⚡</div>
            <div class="msg-content">
                <div class="msg-sender">AI Agent QA — VinUni AI Thực Chiến</div>
                <div class="msg-bubble">
                    <p>${data.answer.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>
                </div>
                <div class="msg-meta">
                    ${badgesHtml}
                </div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateSidebarCitations(citations) {
        if (!citationsContainer) return;
        citationsContainer.innerHTML = "";

        if (!citations || citations.length === 0) {
            citationsContainer.innerHTML = `
                <div class="empty-state">
                    <span>📑</span>
                    <p>Không có trích dẫn cụ thể cho câu hỏi này.</p>
                </div>
            `;
            return;
        }

        citations.forEach((cit, idx) => {
            const card = document.createElement('div');
            card.className = "citation-card";
            card.innerHTML = `
                <div class="cit-title">#${idx+1}. ${cit.title}</div>
                <div class="cit-snippet">${cit.snippet}</div>
            `;
            card.addEventListener('click', () => openModal(cit));
            citationsContainer.appendChild(card);
        });
    }

    function updateGuardrailStatus(triggered) {
        const pills = [
            { id: 'gp-1', key: 'layer1_ground_truth' },
            { id: 'gp-2', key: 'layer2_ambiguity' },
            { id: 'gp-3', key: 'layer3_authority' },
            { id: 'gp-4', key: 'layer4_domain' }
        ];

        pills.forEach(p => {
            const el = document.getElementById(p.id);
            if (!el) return;
            const statusSpan = el.querySelector('.g-status');
            if (triggered && triggered.includes(p.key)) {
                el.classList.add('triggered');
                statusSpan.className = "g-status status-active";
                statusSpan.textContent = "Đã kích hoạt!";
            } else {
                el.classList.remove('triggered');
                statusSpan.className = "g-status status-idle";
                statusSpan.textContent = "Sẵn sàng";
            }
        });
    }

    function openModal(cit) {
        if (!citationModal) return;
        document.getElementById('modal-title').textContent = `📄 Trích dẫn: ${cit.title}`;
        document.getElementById('modal-content').innerHTML = `
            <p><strong>Nguồn:</strong> <a href="${cit.url || '#'}" target="_blank" style="color:var(--primary-cyan);">${cit.url || 'Internal KB Reference'}</a></p>
            <p><strong>Loại tài liệu:</strong> ${cit.type === 'fb_group' ? 'Facebook Group Scraped Q&A (verified by TA)' : 'VLearn Lecture Transcript / Slide'}</p>
            <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:12px 0;">
            <p style="white-space: pre-line; background: rgba(0,0,0,0.3); padding:14px; border-radius:8px;">${cit.snippet}</p>
        `;
        citationModal.classList.remove('hidden');
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            citationModal.classList.add('hidden');
        });
    }

    // Event Listeners
    sendBtn.addEventListener('click', () => handleSendMessage());
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Hint chips
    document.querySelectorAll('.hint-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query');
            handleSendMessage(query);
        });
    });

    // Try Preset Buttons (from Tab 3 Guardrail Demo)
    document.querySelectorAll('.try-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-preset');
            // Switch back to Chat Tab
            document.querySelector('[data-tab="chat-tab"]').click();
            handleSendMessage(query);
        });
    });
});
