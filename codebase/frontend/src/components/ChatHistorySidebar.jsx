import React from 'react';

export default function ChatHistorySidebar({ sessions, activeSessionId, onSelectSession, onNewChat, onDeleteSession }) {
  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="chat-history-sidebar">
      <div className="chat-history-header">
        <span className="chat-history-title">Lịch sử chat</span>
        <button className="new-chat-btn" onClick={onNewChat} title="Tạo đoạn chat mới">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Mới</span>
        </button>
      </div>

      <div className="chat-history-list">
        {sessions.length === 0 && (
          <div className="chat-history-empty">Chưa có đoạn chat nào</div>
        )}
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`chat-history-item ${session.id === activeSessionId ? 'active' : ''}`}
            onClick={() => onSelectSession(session.id)}
          >
            <div className="chat-history-item-content">
              <div className="chat-history-item-title">{session.title}</div>
              <div className="chat-history-item-meta">
                <span className="chat-history-item-count">{session.messages.filter(m => m.sender === 'user').length} tin</span>
                <span className="chat-history-item-time">{formatTime(session.updatedAt)}</span>
              </div>
            </div>
            <button
              className="chat-history-delete-btn"
              onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
              title="Xóa đoạn chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
