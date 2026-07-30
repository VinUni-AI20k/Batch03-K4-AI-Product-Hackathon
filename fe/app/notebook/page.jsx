'use client';
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'
import { getCourseInfo, getCourseDays, sendChatMessage } from '../../utils/api'

const STORAGE_KEY_CHAT = 'vlearn_notebook_chat'
const STORAGE_KEY_NOTES = 'vlearn_notebook_notes'

export default function NotebookPage() {
  const [lang, setLang] = useState('VI')
  const [info, setInfo] = useState(null)
  const [days, setDays] = useState([])
  const [activeTab, setActiveTab] = useState('progress') // 'progress' | 'chat' | 'notes'
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [notes, setNotes] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatError, setChatError] = useState('')
  const chatEndRef = useRef(null)

  // Load data
  useEffect(() => {
    getCourseInfo().then(setInfo).catch(() => {})
    getCourseDays().then(setDays).catch(() => {})
  }, [])

  // Load persisted data from localStorage
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem(STORAGE_KEY_CHAT)
      if (savedChat) setChatMessages(JSON.parse(savedChat))
      const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES)
      if (savedNotes) setNotes(savedNotes)
    } catch {}
  }, [])

  // Persist chat
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(chatMessages))
    }
  }, [chatMessages])

  // Persist notes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTES, notes)
  }, [notes])

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isTyping])

  async function handleSendMessage(e) {
    e?.preventDefault()
    if (!chatInput.trim()) return

    const message = chatInput.trim()
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: message,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setIsTyping(true)
    setChatError('')

    try {
      const response = await sendChatMessage({
        message,
        context: { course_id: 'comp2010-phase-1' }
      })
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: response.answer,
        status: response.status,
        scope: response.scope,
        citations: response.citations || [],
        suggestedQuestions: response.suggested_questions || [],
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, aiMsg])
    } catch {
      setChatError('Không kết nối được VLearn Tutor. Hãy kiểm tra backend và thử lại.')
    } finally {
      setIsTyping(false)
    }
  }

  function clearChat() {
    setChatMessages([])
    localStorage.removeItem(STORAGE_KEY_CHAT)
  }

  const completedDays = days.filter(d => d.is_completed).length
  const totalDays = days.length || 4
  const progressPercent = Math.round((completedDays / totalDays) * 100)

  const tabs = [
    { key: 'progress', label: 'Tiến trình học', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )},
    { key: 'chat', label: 'Chat với AI Tutor', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )},
    { key: 'notes', label: 'Ghi chú cá nhân', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    )},
  ]

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header lang={lang} setLang={setLang} info={info} />

      {/* Page header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-centered py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B3B60] to-[#1565A8] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Sổ tay học tập</h1>
              <p className="text-sm text-[#64748B]">Theo dõi tiến trình, lịch sử chat AI và ghi chú cá nhân</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container-centered">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'border-[#0B3B60] text-[#0B3B60]'
                    : 'border-transparent text-[#64748B] hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.key === 'chat' && chatMessages.length > 0 && (
                  <span className="ml-1 bg-[#0B3B60] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {chatMessages.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container-centered py-6">
        {/* PROGRESS TAB */}
        {activeTab === 'progress' && (
          <div className="space-y-5">
            {/* Overview card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 mb-4">Tổng quan tiến trình</h2>
              <div className="flex items-center gap-6">
                {/* Circular progress */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="url(#progressGrad)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${progressPercent * 2.64} 264`}
                      className="transition-all duration-700"
                    />
                    <defs>
                      <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0B3B60"/>
                        <stop offset="100%" stopColor="#1565A8"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-extrabold text-slate-900">{progressPercent}%</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-sm text-[#64748B]">Khóa học: <strong className="text-slate-900">{info?.title || 'COMP2010'}</strong></div>
                  <div className="text-sm text-[#64748B]">Đã hoàn thành: <strong className="text-emerald-600">{completedDays}/{totalDays} ngày</strong></div>
                  <div className="text-sm text-[#64748B]">Tổng câu hỏi AI: <strong className="text-slate-900">{chatMessages.filter(m => m.role === 'user').length}</strong></div>
                </div>
              </div>
            </div>

            {/* Day-by-day progress */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 mb-4">Chi tiết từng ngày</h2>
              <div className="space-y-3">
                {(days.length > 0 ? days : [
                  {id:1, seq:'01', title:'Day01', slides:2, is_completed:false},
                  {id:2, seq:'02', title:'Day02', slides:1, is_completed:false},
                  {id:3, seq:'03', title:'Day03', slides:2, is_completed:false},
                  {id:4, seq:'04', title:'Day04', slides:3, is_completed:false},
                ]).map(day => (
                  <div key={day.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      day.is_completed
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {day.is_completed ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900">{day.title}</div>
                      <div className="text-xs text-[#64748B]">{day.slides} slide</div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      day.is_completed
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {day.is_completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
            {/* Chat header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B3B60] to-[#1565A8] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2a5 5 0 0 1 5 5c0 2.76-2.24 5-5 5s-5-2.24-5-5a5 5 0 0 1 5-5z"/>
                    <path d="M20 21v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">VLearn AI Tutor</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    <span className="text-xs text-[#64748B]">Online</span>
                  </div>
                </div>
              </div>
              {chatMessages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Xóa lịch sử
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Bắt đầu trò chuyện với AI Tutor</p>
                  <p className="text-xs text-[#64748B] mt-1">Hỏi bất kì điều gì về bài học, khái niệm hoặc bài tập</p>
                </div>
              )}

              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#0B3B60] to-[#1565A8] text-white'
                      : 'bg-slate-50 border border-slate-100 text-slate-800'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    {msg.role !== 'user' && msg.citations?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-600">Nguồn từ slide</div>
                        {msg.citations.map(citation => (
                          <div key={citation.source_id} className="text-xs text-[#1565A8]">
                            {citation.lecture_title} · trang {citation.page ?? '?'}
                            {citation.excerpt && (
                              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                                {citation.excerpt}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.role !== 'user' && msg.status && (
                      <div className="mt-2 text-[10px] uppercase tracking-wide text-slate-400">
                        {msg.status} · {msg.scope}
                      </div>
                    )}
                    <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-blue-200' : 'text-[#94A3B8]'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay:'0ms'}}></span>
                      <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay:'150ms'}}></span>
                      <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay:'300ms'}}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {chatError && (
              <div className="mx-6 mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {chatError}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-slate-100 px-6 py-4 flex items-center gap-3"
            >
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Nhập câu hỏi cho AI Tutor..."
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B60]/20 focus:border-[#0B3B60] transition-all"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-[#0B3B60] to-[#1565A8] text-white
                           hover:from-[#0a3050] hover:to-[#1255a0] disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all duration-200 shadow-sm hover:shadow"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Ghi chú cá nhân</h2>
              <span className="text-xs text-[#64748B]">Tự động lưu</span>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Viết ghi chú của bạn tại đây... ✍️

Ví dụ:
- Kiến thức cần ôn lại
- Câu hỏi muốn hỏi giảng viên
- Ý tưởng cho dự án
- Ghi nhớ quan trọng từ bài học"
              className="w-full min-h-[400px] p-4 border border-slate-200 rounded-xl text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-[#0B3B60]/20 focus:border-[#0B3B60]
                         transition-all resize-y leading-relaxed placeholder:text-slate-300"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-[#94A3B8]">{notes.length} ký tự</div>
              <button
                onClick={() => { setNotes(''); localStorage.removeItem(STORAGE_KEY_NOTES) }}
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Xóa ghi chú
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
