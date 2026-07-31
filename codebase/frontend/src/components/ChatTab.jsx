import React, { useEffect, useRef, useState } from 'react';
import { Send, ThumbsUp, AlertTriangle, UserCheck, FileText, CheckCircle2 } from 'lucide-react';

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
      label: '1. Happy Path',
      text: 'Khóa học AI Thực Chiến kéo dài trong bao lâu và lộ trình đào tạo 3 tháng ra sao?'
    },
    {
      id: 'low_conf',
      label: '2. Low Confidence',
      text: 'Lỗi pip install trên Windows báo Visual C++ 14.0 là fix thế nào?'
    },
    {
      id: 'out_of_scope',
      label: '3. Out of Scope (Failure)',
      text: 'Xe VinFast VF8 bản Plus bây giờ giá lăn bánh bao nhiêu?'
    },
    {
      id: 'correction',
      label: '4. Correction',
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
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i}>{line || '\u00A0'}</p>
                  ))}

                  {/* Nguồn trích dẫn hiển thị trực tiếp bên trong đoạn chat */}
                  {msgCitations && msgCitations.length > 0 && !isOutOfScope && (
                    <div className="inline-chat-citations">
                      <div className="citations-header">📚 Nguồn tài liệu tham khảo:</div>
                      {msgCitations.map((cit, citIdx) => (
                        <div key={citIdx} className="citation-inline-card">
                          <div className="cit-title-row">
                            <span className="cit-title">
                              • {cit.title ? cit.title.replace(/^Sổ tay chương trình -\s*/i, '') : `Nguồn ${citIdx + 1}`}
                            </span>
                            {cit.url && (
                              <a
                                href={cit.url.startsWith('http') ? cit.url : `file:///${cit.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cit-link"
                              >
                                🔗 Xem link nguồn
                              </a>
                            )}
                          </div>
                          {cit.content && (
                            <div className="cit-snippet">
                              "{cit.content.slice(0, 220)}..."
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

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
                          onClick={() => alert('Đã ghi nhận báo cáo lỗi để cải thiện!')}
                        >
                          <AlertTriangle size={12} className="text-orange-500" />
                          <span>Báo sai / Sửa lỗi</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="transfer-agent-btn"
                        onClick={() => alert('Đã chuyển yêu cầu đến tư vấn viên BTC AI Thực Chiến!')}
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
