import { useEffect, useRef, useState } from 'react';
import { Scene, Message } from '@/lib/types';
import { NARRATIONS, PEERS, DISCUSSION_TEMPLATES } from '@/lib/constants';
import { PeerStack } from '@/components/PeerStack';
import { FloatingChatBox } from '@/components/FloatingChatBox';

export function AgentRow({ scene }: { scene: Scene }) {
  // Narration (TTS) state
  const [narrationSpeaking, setNarrationSpeaking] = useState(false);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Chat and discussion state
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const [msgBadge, setMsgBadge] = useState<number | null>(null);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [discussionActive, setDiscussionActive] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState<{ name: string; avatar: string } | null>(null);
  const chatLogEndRef = useRef<HTMLDivElement>(null);

  const stopNarration = () => {
    setNarrationSpeaking(false);
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }
  };

  const startNarration = () => {
    setNarrationSpeaking(true);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    const text = NARRATIONS[scene.id] || '';
    const duration = Math.min(6000, 1500 + text.length * 40);
    speechTimerRef.current = setTimeout(stopNarration, duration);
  };

  const toggleNarration = () => (narrationSpeaking ? stopNarration() : startNarration());

  // Reset narration whenever the active scene changes
  useEffect(() => {
    stopNarration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  // Auto-scroll chat log
  useEffect(() => {
    chatLogEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, typingIndicator]);

  const toggleChatBox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setChatBoxOpen((prev) => !prev);
    if (!chatBoxOpen) setMsgBadge(null);
  };

  const speakFloating = (e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLDivElement;
    btn.textContent = '⏸';
    btn.classList.add('speaking');
    setTimeout(() => {
      btn.textContent = '▶';
      btn.classList.remove('speaking');
    }, 1300);
  };

  const sendChat = () => {
    if (discussionActive || !chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');

    const userMsgObj: Message = {
      id: 'chat_' + Date.now() + '_user',
      role: 'user',
      text: userMsg,
      avatar: '🧑',
      name: 'Bạn',
    };
    setChatLog((prev) => [...prev, userMsgObj]);
    setDiscussionActive(true);

    let round = 0;
    const nextTurn = () => {
      if (round >= PEERS.length) {
        setTypingIndicator({ name: 'AI Teacher', avatar: '🧑‍🏫' });
        setTimeout(() => {
          setTypingIndicator(null);
          const aiMsgObj: Message = {
            id: 'chat_' + Date.now() + '_ai_wrap',
            role: 'ai',
            text: `Cảm ơn cả lớp đã thảo luận sôi nổi về "${userMsg}"! Đây là một điểm quan trọng của bài học — các bạn hãy thử áp dụng vào bài tập tiếp theo nhé.`,
            avatar: '🧑‍🏫',
            name: 'AI Teacher',
            showPlay: true,
          };
          setChatLog((prev) => [...prev, aiMsgObj]);
          setDiscussionActive(false);
          setMsgBadge((prev) => (chatBoxOpen ? prev : (prev ?? 0) + 1));
        }, 1000 + Math.random() * 400);
        return;
      }

      const peer = PEERS[round];
      setTypingIndicator({ name: peer.name, avatar: peer.initial });

      setTimeout(() => {
        setTypingIndicator(null);
        const templates = DISCUSSION_TEMPLATES[peer.name];
        const lines = templates ? templates(userMsg) : [`Mình thấy "${userMsg}" khá thú vị.`];
        const peerLine = lines[round % lines.length];

        const peerMsgObj: Message = {
          id: 'chat_' + Date.now() + '_peer_' + round,
          role: 'peer',
          text: peerLine,
          avatar: peer.initial,
          name: peer.name,
          showPlay: true,
        };
        setChatLog((prev) => [...prev, peerMsgObj]);
        round++;
        setTimeout(nextTurn, 700);
      }, 900 + Math.random() * 500);
    };

    setTimeout(nextTurn, 400);
  };

  return (
    <div id="agentrow">
      <div className="rail-left">
        <div className="rail-icon" title="Mục lục bài học">
          📖
        </div>
        <div className="rail-teacher" title="AI Teacher">
          <div className="ai-avatar">🧑‍🏫</div>
          <div className="rail-label">AI Teacher</div>
        </div>
      </div>

      <div id="chatpanel">
        <div className="msg-row ai">
          <div className="msg-avatar">🧑‍🏫</div>
          <div className="msg-bubble">
            <div className="msg-who">AI Teacher</div>
            <div className="msg-text-wrap">
              <div id="narrationText">{NARRATIONS[scene.id] || '…'}</div>
              <div
                className={`msg-play ${narrationSpeaking ? 'speaking' : ''}`}
                onClick={toggleNarration}
                title="Nghe đọc (TTS)"
              >
                {narrationSpeaking ? '⏸' : '▶'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rail-right">
        <PeerStack />
        <div className="rail-actions">
          <div className="rail-round mic" title="Bật/tắt micro">
            🎙
          </div>
          <div
            className={`rail-round ${discussionActive ? 'discussing' : ''}`}
            title="Nhắn tin cho AI Teacher"
            onClick={(e) => toggleChatBox(e)}
          >
            💬
            {msgBadge !== null && <span className="badge">{msgBadge}</span>}
          </div>
          <div className="rail-user-avatar" title="Bạn">
            🧑
          </div>
        </div>
      </div>

      <FloatingChatBox
        open={chatBoxOpen}
        chatLog={chatLog}
        typingIndicator={typingIndicator}
        discussionActive={discussionActive}
        chatInput={chatInput}
        onChatInputChange={setChatInput}
        onSendChat={sendChat}
        onSpeak={speakFloating}
        logEndRef={chatLogEndRef}
      />
    </div>
  );
}
