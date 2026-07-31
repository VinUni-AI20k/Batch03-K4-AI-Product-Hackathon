import { RefObject } from 'react';
import { Message } from '@/lib/types';

interface FloatingChatBoxProps {
  open: boolean;
  chatLog: Message[];
  typingIndicator: { name: string; avatar: string } | null;
  discussionActive: boolean;
  chatInput: string;
  onChatInputChange: (v: string) => void;
  onSendChat: () => void;
  onSpeak: (e: React.MouseEvent) => void;
  logEndRef: RefObject<HTMLDivElement | null>;
}

export function FloatingChatBox({
  open,
  chatLog,
  typingIndicator,
  discussionActive,
  chatInput,
  onChatInputChange,
  onSendChat,
  onSpeak,
  logEndRef,
}: FloatingChatBoxProps) {
  const lastMsg = chatLog[chatLog.length - 1];

  return (
    <div id="floatingChatBox" className={open ? 'open' : ''} onClick={(e) => e.stopPropagation()}>
      <div id="floating-chat-log">
        {chatLog.map((msg) => (
          <div key={msg.id} className={`fmsg-row ${msg.role === 'user' ? 'user' : 'agent'}`}>
            <div className="fmsg-avatar">{msg.avatar}</div>
            <div className="fmsg-content">
              {msg.role !== 'user' && <div className="fmsg-who">{msg.name}</div>}
              <div className="fmsg-text-wrap">
                <div className="fmsg-bubble">{msg.text}</div>
                {msg.showPlay && (
                  <div className="fmsg-play" onClick={onSpeak} title="Nghe đọc">
                    ▶
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {discussionActive && lastMsg?.role === 'user' && (
          <div className="discussion-banner">🗣️ Chế độ thảo luận: &quot;{lastMsg.text}&quot;</div>
        )}

        {typingIndicator && (
          <div className="fmsg-row agent">
            <div className="fmsg-avatar">{typingIndicator.avatar}</div>
            <div className="fmsg-content">
              <div className="fmsg-who">{typingIndicator.name}</div>
              <div className="fmsg-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={logEndRef} />
      </div>
      <div id="floating-input-row" className={discussionActive ? 'disabled' : ''}>
        <input
          id="chat-input"
          type="text"
          placeholder="Nhắn tin cho AI Teacher..."
          value={chatInput}
          onChange={(e) => onChatInputChange(e.target.value)}
          disabled={discussionActive}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSendChat();
          }}
        />
        <button id="send-btn" onClick={onSendChat} disabled={discussionActive}>
          ➤
        </button>
      </div>
    </div>
  );
}
