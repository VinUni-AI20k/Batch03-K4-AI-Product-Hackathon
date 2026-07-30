import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import ChatTab from './components/ChatTab';
import CitationModal from './components/CitationModal';
import { FALLBACK_STATS } from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || '';

const WELCOME_MSG = {
  sender: 'agent',
  text: 'Xin chào! Mình là AI Agent QA của khóa AI Thực Chiến Vingroup - VinUni.\n\nMình có thể giúp bạn giải đáp các vấn đề từ cài đặt, lỗi code, đến tìm hiểu quy trình Hackathon. Hãy đặt câu hỏi nhé!',
  meta: null,
};

export default function App() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [isTyping, setIsTyping] = useState(false);
  const [citations, setCitations] = useState([]);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [kbStatusText, setKbStatusText] = useState('Đang kết nối KB...');

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

  const sendMessage = async (text) => {
    setMessages((prev) => [...prev, { sender: 'user', text, meta: null }]);
    setIsTyping(true);
    setCitations([]);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const newCitations = data.citations || [];
      setCitations(newCitations);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: data.answer || 'Xin lỗi, mình chưa tìm được câu trả lời phù hợp.',
          meta: {
            guardrails: data.guardrails_triggered || [],
            confidence: data.confidence_score || 0,
          },
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `Lỗi kết nối backend: ${err.message}. Vui lòng kiểm tra server.`,
          meta: { guardrails: [], confidence: 0 },
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="bg-glow glow-cyan" />
      <div className="bg-glow glow-violet" />

      <div className="app-container">
        <Header kbStatusText={kbStatusText} />
        
        <div className="chat-layout">
          <ChatTab
            messages={messages}
            onSendMessage={sendMessage}
            isTyping={isTyping}
            citations={citations}
            onSelectCitation={setSelectedCitation}
          />
        </div>
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
