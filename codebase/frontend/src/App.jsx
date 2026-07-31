import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import ChatTab from './components/ChatTab';
import CourseScheduleSidebar from './components/CourseScheduleSidebar';
import CitationModal from './components/CitationModal';
import GoogleLoginModal from './components/GoogleLoginModal';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import AdminTickets from './components/AdminTickets';
import MyTickets from './components/MyTickets';

const API_BASE = import.meta.env.VITE_API_URL || '';

const WELCOME_MSG = {
  sender: 'agent',
  text: 'Xin chào! Mình là Trợ lý AI Khóa học AI Thực Chiến (Vingroup - VinUni). Mình có thể giúp gì cho bạn hôm nay?',
  meta: null,
};

const STORAGE_KEY = (userEmail) => `ai_hackathon_sessions_${userEmail || 'guest'}`;

function createSession() {
  return {
    id: Date.now().toString(),
    title: 'Đoạn chat mới',
    messages: [WELCOME_MSG],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function loadSessions(userEmail) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(userEmail));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(userEmail, sessions) {
  localStorage.setItem(STORAGE_KEY(userEmail), JSON.stringify(sessions));
}

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [citations, setCitations] = useState([]);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [kbStatusText, setKbStatusText] = useState('Đang kết nối KB...');

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ai_hackathon_google_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Load sessions khi user thay đổi
  useEffect(() => {
    const loaded = loadSessions(user?.email);
    if (loaded.length === 0) {
      const fresh = createSession();
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
      saveSessions(user?.email, [fresh]);
    } else {
      setSessions(loaded);
      setActiveSessionId(loaded[0].id);
    }
  }, [user?.email]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [WELCOME_MSG];

  const updateSession = useCallback((sessionId, updater) => {
    setSessions((prev) => {
      const next = prev.map((s) => s.id === sessionId ? { ...updater(s), updatedAt: Date.now() } : s);
      // Sắp xếp mới nhất lên đầu
      next.sort((a, b) => b.updatedAt - a.updatedAt);
      saveSessions(user?.email, next);
      return next;
    });
  }, [user?.email]);

  useEffect(() => {
    fetch(`${API_BASE}/api/kb/stats`)
      .then((r) => r.json())
      .then((data) => {
        const model = data.llm_enabled ? data.model : 'local-rag';
        setKbStatusText(`Knowledge Base: ${data.fb_posts_scraped} bài FB · ${data.vlearn_snippets} VLearn · ${model}`);
      })
      .catch(() => {
        setKbStatusText('Knowledge Base: Chế độ offline');
      });
  }, []);

  const handleGoogleLogin = async (account) => {
    try {
      await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });
    } catch (e) {
      console.warn('Backend sync failed, storing user locally:', e);
    }
    localStorage.setItem('ai_hackathon_google_user', JSON.stringify(account));
    setUser(account);
  };

  const handleLogout = () => {
    localStorage.removeItem('ai_hackathon_google_user');
    setUser(null);
    setSessions([]);
    setActiveSessionId(null);
  };

  const handleNewChat = () => {
    const fresh = createSession();
    setSessions((prev) => {
      const next = [fresh, ...prev];
      saveSessions(user?.email, next);
      return next;
    });
    setActiveSessionId(fresh.id);
    setCitations([]);
  };

  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    setCitations([]);
  };

  const handleDeleteSession = (sessionId) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== sessionId);
      saveSessions(user?.email, next);
      // Nếu xóa session đang active thì chuyển sang session đầu tiên còn lại
      if (sessionId === activeSessionId) {
        if (next.length > 0) {
          setActiveSessionId(next[0].id);
        } else {
          const fresh = createSession();
          next.push(fresh);
          saveSessions(user?.email, [fresh]);
          setActiveSessionId(fresh.id);
        }
      }
      return next;
    });
  };

  const sendMessage = async (text) => {
    const userMsg = { sender: 'user', text, meta: null };

    // Append user message và cập nhật title
    updateSession(activeSessionId, (s) => {
      const newMsgs = [...s.messages, userMsg];
      const firstUserMsg = newMsgs.find((m) => m.sender === 'user');
      const title = firstUserMsg
        ? firstUserMsg.text.slice(0, 40) + (firstUserMsg.text.length > 40 ? '...' : '')
        : s.title;
      return { ...s, messages: newMsgs, title };
    });

    setIsTyping(true);
    setCitations([]);

    try {
      const payload = {
        message: text,
        user_email: user?.email || 'guest',
        user_role: user?.role || 'student'
      };
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const newCitations = data.citations || [];
      setCitations(newCitations);

      const agentMsg = {
        sender: 'agent',
        text: data.answer || 'Xin lỗi, mình chưa tìm được câu trả lời phù hợp.',
        meta: {
          guardrails: data.guardrails_triggered || [],
          confidence: data.confidence_score || 0,
          citations: newCitations,
          tool_calls: data.tool_calls || [],
        },
      };

      // Chỉ append agentMsg — userMsg đã được thêm ở trên
      updateSession(activeSessionId, (s) => ({ ...s, messages: [...s.messages, agentMsg] }));
    } catch (err) {
      const errMsg = {
        sender: 'agent',
        text: `Lỗi kết nối backend: ${err.message}. Vui lòng kiểm tra server.`,
        meta: { guardrails: [], confidence: 0 },
      };
      updateSession(activeSessionId, (s) => ({ ...s, messages: [...s.messages, errMsg] }));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="bg-glow glow-cyan" />
      <div className="bg-glow glow-violet" />

      {!user && <GoogleLoginModal onLogin={handleGoogleLogin} />}

      <div className="app-container app-container-mockup">
        <Header
          kbStatusText={kbStatusText}
          user={user}
          onLogout={handleLogout}
        />

        <div style={{ display: 'flex', gap: '12px', padding: '0 28px', marginBottom: '16px' }}>
          <button onClick={() => setActiveTab('chat')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'chat' ? 'var(--primary-indigo)' : '#e2e8f0', color: activeTab === 'chat' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer' }}>Chat Assistant</button>
          {user && (
            <button onClick={() => setActiveTab('tickets')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'tickets' ? 'var(--primary-indigo)' : '#e2e8f0', color: activeTab === 'tickets' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer' }}>Ticket Của Tôi</button>
          )}
          {user?.role === 'admin' && (
            <button onClick={() => setActiveTab('admin')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'admin' ? '#7c3aed' : '#e2e8f0', color: activeTab === 'admin' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer' }}>Admin Dashboard</button>
          )}
        </div>

        {activeTab === 'chat' && (
          <div className="mockup-3col-layout">
            <div className="mockup-history-col">
              <ChatHistorySidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
                onDeleteSession={handleDeleteSession}
              />
            </div>
            <div className="mockup-left-col">
              <ChatTab
                key={activeSessionId}
                messages={messages}
                onSendMessage={sendMessage}
                isTyping={isTyping}
                citations={citations}
                onSelectCitation={setSelectedCitation}
                userEmail={user?.email}
              />
            </div>
            <div className="mockup-right-col">
              <CourseScheduleSidebar />
            </div>
          </div>
        )}
        
        {activeTab === 'tickets' && (
          <div style={{ padding: '0 28px', display: 'flex' }}>
            <MyTickets userEmail={user?.email} />
          </div>
        )}
        
        {activeTab === 'admin' && (
          <div style={{ padding: '0 28px', display: 'flex' }}>
            <AdminTickets />
          </div>
        )}
      </div>

      {selectedCitation && (
        <CitationModal
          citation={selectedCitation}
          onClose={() => setSelectedCitation(null)}
        />
      )}
    </>
  );
}
