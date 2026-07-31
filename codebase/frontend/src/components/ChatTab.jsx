import React, { useEffect, useRef, useState } from 'react';
import { Send, ThumbsUp, AlertTriangle, UserCheck, FileText, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MAP_KEYWORDS = [
  'bản đồ', 'sơ đồ', 'campus', 'trường', 'tòa', 'toà', 'địa điểm', 'vị trí',
  'đường đi', 'cổng', 'khu vực', 'phòng', 'tầng', 'building', 'map',
  'vinuni', 'vin uni', 'cơ sở', 'campus tour', 'bãi gửi xe', 'gửi xe',
  'căng tin', 'canteen', 'lab', 'thư viện', 'hội trường', 'trung tâm',
];

function shouldShowMap(text) {
  const lower = text.toLowerCase();
  return MAP_KEYWORDS.some(kw => lower.includes(kw));
}

const TOOL_META = {
  search_knowledge_base: { icon: '🗄️', label: 'Tìm KB nội bộ', color: '#6366F1' },
  search_internet:       { icon: '🌐', label: 'Tìm Internet',   color: '#0EA5E9' },
  calculate:             { icon: '🧮', label: 'Tính toán',      color: '#10B981' },
  get_current_time:      { icon: '🕐', label: 'Lấy thời gian',  color: '#F59E0B' },
};

function ToolCallsPanel({ toolCalls }) {
  const [open, setOpen] = useState(false);
  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="tool-calls-panel">
      <button className="tool-calls-toggle" onClick={() => setOpen(o => !o)}>
        <span className="tool-calls-badge">{toolCalls.length}</span>
        <span className="tool-calls-toggle-label">Tool calls</span>
        <span className="tool-calls-tools-used">
          {[...new Set(toolCalls.map(t => TOOL_META[t.tool]?.icon || '🔧'))].join(' ')}
        </span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {open && (
        <div className="tool-calls-list">
          {toolCalls.map((tc, i) => {
            const meta = TOOL_META[tc.tool] || { icon: '🔧', label: tc.tool, color: '#94A3B8' };
            return (
              <div key={i} className="tool-call-item">
                <div className="tool-call-header" style={{ borderLeftColor: meta.color }}>
                  <span className="tool-call-icon">{meta.icon}</span>
                  <span className="tool-call-name" style={{ color: meta.color }}>{meta.label}</span>
                  <code className="tool-call-fn">{tc.tool}()</code>
                </div>
                {tc.args && Object.keys(tc.args).length > 0 && (
                  <div className="tool-call-args">
                    {Object.entries(tc.args).map(([k, v]) => (
                      <div key={k} className="tool-call-arg-row">
                        <span className="tool-call-arg-key">{k}:</span>
                        <span className="tool-call-arg-val">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {tc.result_preview && (
                  <div className="tool-call-result">
                    <span className="tool-call-result-label">Kết quả:</span>
                    <span className="tool-call-result-text">{tc.result_preview}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CampusMap() {
  const [enlarged, setEnlarged] = useState(false);
  return (
    <div className="campus-map-wrapper">
      <div className="campus-map-label">🗺️ Sơ đồ khuôn viên VinUni</div>
      <img
        src="/campus-map.jpg"
        alt="Sơ đồ khuôn viên VinUni"
        className={`campus-map-img ${enlarged ? 'enlarged' : ''}`}
        onClick={() => setEnlarged(e => !e)}
        title={enlarged ? 'Thu nhỏ' : 'Phóng to'}
      />
      <div className="campus-map-hint">
        {enlarged ? 'Nhấp để thu nhỏ' : 'Nhấp để phóng to · C401 = Tòa C, Tầng 4, Phòng 01'}
      </div>
      {enlarged && (
        <div className="campus-map-overlay" onClick={() => setEnlarged(false)}>
          <img src="/campus-map.jpg" alt="Sơ đồ khuôn viên VinUni phóng to" className="campus-map-full" />
        </div>
      )}
    </div>
  );
}

// Component hiển thị nguồn tài liệu thông minh — chỉ khi thực sự có giá trị
function CitationList({ citations }) {
  const [expanded, setExpanded] = useState(false);
  const SHOW_MAX = 2;
  const visible = expanded ? citations : citations.slice(0, SHOW_MAX);
  const hasMore = citations.length > SHOW_MAX;

  return (
    <div className="inline-chat-citations">
      <div className="citations-header">📚 Nguồn tham khảo:</div>
      {visible.map((cit, citIdx) => {
        const cleanTitle = (cit.title || `Nguồn ${citIdx + 1}`)
          .replace(/^Sổ tay chương trình -\s*/i, '')
          .replace(/^VLearn\s+[\w-]+\s+-\s*/i, '')
          .slice(0, 70);
        const isExternal = cit.url?.startsWith('http');
        return (
          <div key={citIdx} className="citation-inline-card">
            <div className="cit-title-row">
              <span className="cit-title">• {cleanTitle}</span>
              {isExternal && (
                <a href={cit.url} target="_blank" rel="noopener noreferrer" className="cit-link">
                  🔗 Nguồn
                </a>
              )}
            </div>
          </div>
        );
      })}
      {hasMore && (
        <button
          className="cit-expand-btn"
          onClick={() => setExpanded(e => !e)}
        >
          {expanded
            ? <><ChevronUp size={12} /> Ẩn bớt</>
            : <><ChevronDown size={12} /> Xem thêm {citations.length - SHOW_MAX} nguồn...</>}
        </button>
      )}
    </div>
  );
}

export default function ChatTab({
  messages,
  onSendMessage,
  isTyping,
  citations = [],
  onSelectCitation
}) {
  const [input, setInput] = useState('');
  const [activeDemo, setActiveDemo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
    setActiveDemo(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Kịch bản demo giống trong mockup UI của USER
  const demoScripts = [
    {
      id: 'happy',
      label: '1. Tuyển sinh & Lộ trình',
      text: 'Khóa học AI Thực Chiến kéo dài trong bao lâu và yêu cầu đầu vào khóa học ra sao?'
    },
    {
      id: 'low_conf',
      label: '2. Học bổng & Học phí',
      text: 'Học phí của khóa học AI Thực Chiến là bao nhiêu và chính sách học bổng 100% từ Vingroup như thế nào?'
    },
    {
      id: 'out_of_scope',
      label: '3. Ngoài phạm vi',
      text: 'Xe VinFast VF8 bản Plus bây giờ giá lăn bánh bao nhiêu?'
    },
    {
      id: 'correction',
      label: '4. Cơ sở vật chất',
      text: 'Căng tin VinUni mở cửa lúc mấy giờ và khu vực phục vụ sinh hoạt cá nhân của học viên ra sao?'
    }
  ];

  const handleSelectDemo = (demo) => {
    setActiveDemo(demo.id);
    onSendMessage(demo.text);
  };

  return (
    <section className="chat-main-card">
      {/* Header UI giống mockup */}
      <div className="chat-header-mockup">
        <div className="agent-avatar-circle">
          <span>AI</span>
        </div>
        <div className="chat-header-info">
          <h2 className="chat-title-mockup">Khóa AI Thực Chiến - Vin</h2>
          <div className="chat-status-mockup">
            <span className="online-dot"></span>
            <span>Đang trực tuyến · Tư vấn Khóa học & Hỏi đáp từ Facebook QA / VLearn</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages-mockup">
        {messages.map((msg, idx) => {
          const isAgent = msg.sender === 'agent';
          const isLatestAgent = isAgent && idx === messages.length - 1;
          const isOutOfScope =
            msg.meta?.guardrails?.includes('layer3_authority') ||
            msg.text.includes('Rất xin lỗi bạn') ||
            msg.text.includes('không có thông tin về sản phẩm');

          const msgCitations = msg.meta?.citations || (isLatestAgent ? citations : []);

          return (
            <div
              key={idx}
              className={`message-row-mockup ${isAgent ? 'agent-row' : 'user-row'}`}
            >
              {isAgent && (
                <div className="agent-avatar-circle small-avatar">
                  <span>AI</span>
                </div>
              )}

              <div className="message-content-wrapper">
                <div className={`message-bubble-mockup ${isAgent ? 'agent-bubble' : 'user-bubble'}`}>
                  {isAgent ? (
                    <div className="markdown-body">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                          ),
                          code: ({ inline, children }) =>
                            inline
                              ? <code className="inline-code">{children}</code>
                              : <pre className="code-block"><code>{children}</code></pre>,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}

                  {/* Bản đồ campus: hiển thị khi người dùng hỏi về địa điểm */}
                  {isAgent && (() => {
                    const prevMsg = messages[idx - 1];
                    const userAsked = prevMsg?.sender === 'user' && shouldShowMap(prevMsg.text);
                    return userAsked ? <CampusMap /> : null;
                  })()}

                  {/* Nguồn trích dẫn */}
                  {(() => {
                    // Lọc chỉ citations có URL thực sự
                    const validCits = (msgCitations || []).filter(
                      c => c.url && c.url.trim() && c.url !== '#' && c.title
                    );
                    // Không hiện citations nếu câu trả lời quá ngắn (chat chào hỏi)
                    const answerIsSubstantive = msg.text.length > 80;
                    if (!validCits.length || isOutOfScope || !answerIsSubstantive) return null;

                    return (
                      <CitationList citations={validCits} />
                    );
                  })()}
                </div>

                {/* Tool calls panel — hiển thị bên dưới bubble */}
                {isAgent && msg.meta?.tool_calls?.length > 0 && (
                  <ToolCallsPanel toolCalls={msg.meta.tool_calls} />
                )}

                {/* Nút hành động phía dưới bubble Agent */}
                {isAgent && (
                  <div className="bubble-actions-mockup">
                    {!isOutOfScope ? (
                      <>
                        <button
                          type="button"
                          className="action-pill-btn useful-btn"
                          onClick={() => alert('Cảm ơn phản hồi hữu ích của bạn!')}
                        >
                          <ThumbsUp size={12} className="text-yellow-600" />
                          <span>Hữu ích</span>
                        </button>
                        <button
                          type="button"
                          className="action-pill-btn report-btn"
                          onClick={async () => {
                            try {
                              const prevUserMsg = messages[idx - 1]?.text || '';
                              await fetch((import.meta.env.VITE_API_URL || '') + '/api/reports', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ user_email: userEmail || 'guest', question: prevUserMsg, answer: msg.text })
                              });
                              alert('Đã ghi nhận báo cáo lỗi để cải thiện!');
                            } catch(e) {
                              alert('Ghi nhận thất bại, vui lòng thử lại.');
                            }
                          }}
                        >
                          <AlertTriangle size={12} className="text-orange-500" />
                          <span>Báo sai / Sửa lỗi</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="transfer-agent-btn"
                        onClick={async () => {
                          try {
                            const prevUserMsg = messages[idx - 1]?.text || 'Cần hỗ trợ từ tư vấn viên';
                            await fetch((import.meta.env.VITE_API_URL || '') + '/api/tickets', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ user_email: userEmail || 'guest', question: prevUserMsg, reason: 'Chuyển tư vấn viên' })
                            });
                            alert('Đã tạo Ticket gửi tư vấn viên thành công!');
                          } catch(e) {
                            alert('Tạo ticket thất bại, vui lòng thử lại.');
                          }
                        }}
                      >
                        <UserCheck size={14} />
                        <span>Chuyển cho tư vấn viên để được giải đáp đúng nhu cầu</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="message-row-mockup agent-row">
            <div className="agent-avatar-circle small-avatar">
              <span>AI</span>
            </div>
            <div className="message-bubble-mockup agent-bubble typing-bubble">
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Đang tra cứu Knowledge Base...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Demo Script Bar (Kịch bản demo:) */}
      <div className="demo-scripts-bar">
        <span className="demo-label">Kịch bản demo:</span>
        <div className="demo-pills-list">
          {demoScripts.map((demo) => (
            <button
              key={demo.id}
              type="button"
              className={`demo-pill-btn ${activeDemo === demo.id ? 'active-demo' : ''}`}
              onClick={() => handleSelectDemo(demo)}
            >
              {demo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box Bottom Bar */}
      <div className="chat-input-bottom">
        <form onSubmit={handleSubmit} className="chat-input-form-mockup">
          <input
            type="text"
            className="chat-input-field-mockup"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi của bạn..."
          />
          <button
            type="submit"
            className="send-circle-btn"
            disabled={!input.trim() || isTyping}
            title="Gửi câu hỏi"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}
