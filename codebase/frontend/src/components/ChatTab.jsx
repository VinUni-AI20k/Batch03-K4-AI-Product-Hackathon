import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileText, Send, ShieldCheck, Sparkles } from 'lucide-react';

const guardrailLabels = {
  layer1_ground_truth: { label: 'Nguồn sự thật', tone: 'badge-danger' },
  layer2_ambiguity: { label: 'Cần làm rõ', tone: 'badge-warn' },
  layer3_authority: { label: 'Ngoài thẩm quyền', tone: 'badge-danger' },
  layer4_domain: { label: 'Đặc thù domain', tone: 'badge-info' }
};

export default function ChatTab({
  messages,
  onSendMessage,
  isTyping,
  citations,
  onSelectCitation
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const hintQueries = [
    'Lỗi pip install trên Windows thì sửa thế nào?',
    'Hạn nộp spec.md Batch 03 là mấy giờ?',
    'HAX và PAIR áp dụng vào AI Spec thế nào?',
    'Vibe-coding rule quy định ra sao?'
  ];

  return (
    <div className="chat-layout chat-layout-single">
      <section className="chat-main-card glass-panel">
        <div className="chat-topbar">
          <div>
            <p className="eyebrow">Facebook Group + Sổ tay chương trình</p>
            <h2>Trợ lý hỏi đáp AI Thực Chiến</h2>
          </div>
          <div className="topbar-badges">
            <span><ShieldCheck size={14} /> Guardrails</span>
            <span><FileText size={14} /> Citations</span>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, idx) => {
            const isLatestAgent = msg.sender === 'agent' && idx === messages.length - 1;
            return (
              <div key={idx} className={`message ${msg.sender}-message`}>
                <div className={`avatar ${msg.sender}-avatar`}>
                  {msg.sender === 'agent' ? <Sparkles size={20} /> : 'U'}
                </div>

                <div className="msg-content">
                  <div className="msg-sender">
                    {msg.sender === 'agent' ? 'AI Agent QA' : 'Bạn'}
                  </div>

                  <div className="msg-bubble">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line || '\u00A0'}</p>
                    ))}
                  </div>

                  {msg.meta && (
                    <div className="msg-meta">
                      {(msg.meta.guardrails || []).map((g, gi) => {
                        const info = guardrailLabels[g] || { label: g, tone: 'badge-warn' };
                        return (
                          <span key={gi} className={`badge ${info.tone}`}>
                            {info.label}
                          </span>
                        );
                      })}

                      {msg.meta.confidence && (
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} />
                          {Math.round(msg.meta.confidence * 100)}% tin cậy
                        </span>
                      )}
                    </div>
                  )}

                  {isLatestAgent && citations.length > 0 && (
                    <div className="inline-citations">
                      {citations.slice(0, 4).map((cit, citIdx) => (
                        <a 
                          key={citIdx} 
                          href={cit.url || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <FileText size={14} />
                          <span>{cit.title || `Nguồn ${citIdx + 1}`}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="typing-indicator">
              <div className="avatar agent-avatar">
                <Sparkles size={20} />
              </div>
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
              <span>Đang tra cứu nguồn và tổng hợp câu trả lời...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-wrapper">
          <form onSubmit={handleSubmit} className="chat-input-box">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi về bài học, deadline, rubric, lỗi cài đặt hoặc dữ liệu Facebook..."
              rows={2}
            />
            <button type="submit" className="send-button" disabled={!input.trim() || isTyping}>
              <span>Gửi</span>
              <Send size={18} />
            </button>
          </form>

          <div className="input-hints">
            <span>Gợi ý:</span>
            {hintQueries.map((q, i) => (
              <button key={i} type="button" className="hint-chip" onClick={() => onSendMessage(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
