import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Dumbbell, BookMarked, ExternalLink, Moon, Bell, ChevronRight, ChevronDown, ChevronUp,
  Sparkles, Sliders, Play, CheckCircle2, FileText, ChevronLeft, ArrowRight, ThumbsUp, ThumbsDown,
  Send, RotateCcw, Award, Zap, MessageSquare, Search, Edit3, Plus, Minus, Download, Printer, Trash2, Key, ShieldCheck, PlayCircle, Bot, History,
  Highlighter, MoreHorizontal, Circle, Type, Image as ImageIcon, Eraser, CornerUpLeft, ArrowLeft, GripVertical
} from 'lucide-react';
import { COURSE_DAYS } from './data/courseData';
import { llmService } from './services/llmService';
import LearningBridge from './components/LearningBridge';
import VLearnTutor from './components/VLearnTutor';
import PdfSlideCanvas from './components/PdfSlideCanvas';

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState('study'); // 'home' | 'courses' | 'study'
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Default to Day 02
  const [pathMode, setPathMode] = useState('happy'); // 'happy' | 'lowConfidence' | 'failure' | 'boundary'
  const [showBridgeWidget, setShowBridgeWidget] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState('tutor'); // Default to 'tutor'
  const [targetPdfPage, setTargetPdfPage] = useState({ page: 1, timestamp: Date.now() });
  const [currentSlidePage, setCurrentSlidePage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100); // 50% - 200%
  const [loading, setLoading] = useState(false);
  const [bridgeData, setBridgeData] = useState(null);

  // VLearn Sidebar & Accordion States
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(360); // Resizable width (280px - 680px)
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [expandedDays, setExpandedDays] = useState({ 1: true });

  const currentDay = COURSE_DAYS[Math.min(selectedDayIndex, COURSE_DAYS.length - 1)];
  const previousDay = COURSE_DAYS[Math.max(0, selectedDayIndex - 1)];

  const toggleDayAccordion = (idx) => {
    setExpandedDays(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Reset when day changes
  const handleSelectDay = (idx) => {
    setSelectedDayIndex(idx);
    setTargetPdfPage({ page: 1, timestamp: Date.now() });
    setCurrentSlidePage(1);
    setZoomLevel(100);
    toggleDayAccordion(idx);
    setShowBridgeWidget(true);
  };

  // Jump to specific slide page in PDF viewer (Hỗ trợ chuyển đổi bài học Cross-Day nếu trích dẫn từ bài khác)
  const handleJumpToSlide = (page, targetDayCode = null) => {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum <= 0) return;

    if (targetDayCode) {
      const targetIdx = COURSE_DAYS.findIndex(d => 
        d.code.toLowerCase() === targetDayCode.toLowerCase() || 
        d.id.toLowerCase() === targetDayCode.toLowerCase()
      );

      if (targetIdx !== -1 && targetIdx !== selectedDayIndex) {
        setSelectedDayIndex(targetIdx);
      }
    }

    setTargetPdfPage({ page: pageNum, timestamp: Date.now() });
    setCurrentSlidePage(pageNum);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(50, prev - 25));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  // Drag Resizer Handler for Right Sidebar
  const handleMouseDownResize = (e) => {
    e.preventDefault();
    setIsResizingRight(true);
    const startX = e.clientX;
    const startWidth = rightSidebarWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const newWidth = Math.min(680, Math.max(280, startWidth + deltaX));
      setRightSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingRight(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Fetch / Generate bridge data whenever day or pathMode changes
  const fetchBridgeData = async (mode = pathMode) => {
    setLoading(true);
    try {
      const data = await llmService.generateLearningBridge({
        fromDay: previousDay,
        toDay: currentDay,
        pathMode: mode,
        forceMock: mode !== 'happy' || !import.meta.env.VITE_GEMINI_API_KEY
      });
      setBridgeData(data);
    } catch (err) {
      console.error('Lỗi sinh data bridge:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBridgeData(pathMode);
  }, [selectedDayIndex, pathMode]);

  return (
    <div className={`h-screen max-h-screen w-screen max-w-screen overflow-hidden flex flex-col font-sans ${isResizingRight ? 'select-none' : ''}`} style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      
      {/* 🔴 SLIM DEMO CONTROLLER BAR */}
      <div className="bg-slate-900 border-b border-indigo-500/30 px-3 py-1 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2 shrink-0 z-50">
        <div className="flex items-center gap-1.5 font-bold text-indigo-400">
          <Sliders size={14} />
          <span>DEMO CONTROLLER (4 Path Demo):</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button 
            onClick={() => { setPathMode('happy'); fetchBridgeData('happy'); }}
            className={`px-2.5 py-0.5 rounded font-semibold text-xs transition-all ${pathMode === 'happy' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            1. Happy Path
          </button>
          <button 
            onClick={() => { setPathMode('lowConfidence'); fetchBridgeData('lowConfidence'); }}
            className={`px-2.5 py-0.5 rounded font-semibold text-xs transition-all ${pathMode === 'lowConfidence' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            2. Low-Confidence
          </button>
          <button 
            onClick={() => { setPathMode('failure'); fetchBridgeData('failure'); }}
            className={`px-2.5 py-0.5 rounded font-semibold text-xs transition-all ${pathMode === 'failure' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            3. Failure
          </button>
          <button 
            onClick={() => { setPathMode('boundary'); fetchBridgeData('boundary'); }}
            className={`px-2.5 py-0.5 rounded font-semibold text-xs transition-all ${pathMode === 'boundary' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            4. Out-of-Scope
          </button>
        </div>
      </div>

      {/* ⚪ HEADER BAR */}
      <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-xs shrink-0 z-40">
        
        {activeMainTab === 'study' ? (
          /* Reader Header Mode */
          <div className="flex items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-3">
              {/* Back Button */}
              <button 
                onClick={() => setActiveMainTab('home')}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                title="Quay lại trang chủ"
              >
                <ArrowLeft size={16} />
              </button>

              {/* VLearn Logo */}
              <div 
                onClick={() => setActiveMainTab('home')}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <div className="w-6 h-6 flex items-center justify-center relative">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L12 18L20 4" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 4L12 13L17 4" stroke="#0f2b5c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  VLearn
                </span>
              </div>

              {/* Book Icon & Document Title */}
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-900 shrink-0">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-900 leading-tight">
                    {currentDay.slideFile}
                  </h1>
                  <p className="text-xs font-semibold text-slate-400 uppercase">COMP2010 • VINUNIVERSITY</p>
                </div>
              </div>
            </div>

            {/* Right Utilities */}
            <div className="flex items-center gap-3">
              <a 
                href={currentDay.pdfPath} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1 rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center gap-1 hover:bg-indigo-100"
              >
                <ExternalLink size={13} /> Tải PDF Slide Gốc
              </a>
              <span className="text-xs font-bold text-slate-600 border border-slate-200 px-2.5 py-1 rounded cursor-pointer hover:bg-slate-50">
                VI
              </span>
              <button className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100">
                <Moon size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* General Global Header Mode */
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <div 
                onClick={() => setActiveMainTab('home')}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-7 h-7 flex items-center justify-center relative">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L12 18L20 4" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 4L12 13L17 4" stroke="#0f2b5c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  VLearn
                </span>
              </div>

              <nav className="flex items-center gap-2 text-xs font-semibold">
                <button 
                  onClick={() => setActiveMainTab('home')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeMainTab === 'home' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Home size={15} /> Trang chủ
                </button>

                <button 
                  onClick={() => setActiveMainTab('courses')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeMainTab === 'courses' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen size={15} /> Khóa học
                </button>

                <button 
                  onClick={() => setActiveMainTab('study')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeMainTab === 'study' ? 'text-slate-900 font-bold' : 'text-slate-[#0f172a] hover:text-slate-900'
                  }`}
                >
                  <Dumbbell size={15} /> Phòng học
                </button>
              </nav>
            </div>
          </div>
        )}

      </header>

      {/* 📌 TAB 1: TRANG CHỦ (Home Dashboard View) */}
      {activeMainTab === 'home' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-6xl mx-auto w-full animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="vlearn-card p-6 relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">TIẾP TỤC HỌC</div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Khoá 3 + 4 Phase 1</h2>
                <p className="text-xs text-slate-500 mb-5">0% đã đọc • 0/2 ngày</p>
                <button onClick={() => setActiveMainTab('study')} className="btn btn-navy text-xs px-5 py-2 font-bold flex items-center gap-2">Vào học ➔</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📌 TAB 3: PHÒNG HỌC SLIDE READER & VLEARN TUTOR */}
      {activeMainTab === 'study' && (
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* LEFT SIDEBAR (Học liệu môn học - w-[270px]) */}
          {isLeftSidebarOpen && (
            <aside className="w-[270px] bg-white border-r border-slate-200 p-3 space-y-3 shrink-0 overflow-y-auto h-full z-10">
              
              {/* Sidebar Header */}
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-900 shrink-0">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">Học liệu môn học</h3>
                  <p className="text-[10px] text-slate-400">Chương & tài liệu đã upload</p>
                </div>
              </div>

              {/* Collapsible Accordion Days List */}
              <div className="space-y-2.5">
                {COURSE_DAYS.map((day, idx) => {
                  const isSelected = idx === selectedDayIndex;
                  const isExpanded = !!expandedDays[idx];

                  return (
                    <div key={day.id} className="space-y-2">
                      <div 
                        onClick={() => handleSelectDay(idx)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col space-y-2 ${
                          isExpanded ? 'bg-[#f8fafc] border-indigo-300 shadow-2xs' : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-indigo-900 text-indigo-900 flex items-center justify-center shrink-0">
                              <Play size={8} className="ml-0.5 fill-indigo-900 text-indigo-900" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 leading-tight">{day.code}</div>
                              <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight whitespace-nowrap">
                                {day.documentCount || 2} TÀI LIỆU • PUBLISHED
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#e0f2fe] text-[#0369a1] whitespace-nowrap">
                                STUDYING
                              </span>
                            )}
                            {isExpanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
                          </div>
                        </div>

                        {/* Sub-documents */}
                        {isExpanded && (
                          <div className="space-y-1.5 pt-0.5 animate-fade-in w-full">
                            <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 flex items-center justify-between hover:border-slate-300 cursor-pointer">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-4 h-4 rounded-full border border-slate-700 text-slate-700 flex items-center justify-center shrink-0">
                                  <Play size={7} className="ml-0.5 fill-slate-700" />
                                </div>
                                <div className="truncate">
                                  <div className="text-xs font-bold truncate text-slate-800">{day.transcriptFile}</div>
                                  <div className="text-[9px] font-normal text-slate-400">Audio / Transcript</div>
                                </div>
                              </div>
                            </div>

                            <div className={`p-2 rounded-lg bg-white border-2 text-xs font-bold flex items-center justify-between shadow-2xs cursor-pointer ${
                              isSelected ? 'border-[#0f2b5c] text-[#0f2b5c]' : 'border-slate-200 text-slate-800'
                            }`}>
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-[#0f2b5c] text-[#0f2b5c]' : 'border-slate-700 text-slate-700'
                                }`}>
                                  <Play size={7} className={`ml-0.5 ${isSelected ? 'fill-[#0f2b5c]' : 'fill-slate-700'}`} />
                                </div>
                                <div className="truncate">
                                  <div className="text-xs font-bold truncate">{day.slideFile}</div>
                                  <div className="text-[9px] font-medium text-slate-500">PDF Slide Hackathon</div>
                                </div>
                              </div>
                              {isSelected && <CheckCircle2 size={15} className="text-[#0f2b5c] shrink-0 ml-1" />}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          {/* LEFT SIDEBAR TOGGLE BUTTON */}
          <button 
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className={`absolute top-1/2 -translate-y-1/2 ${
              isLeftSidebarOpen ? 'left-[270px]' : 'left-0'
            } z-30 w-7 h-11 bg-white border border-slate-300 border-l-0 rounded-r-xl shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all cursor-pointer`}
            title={isLeftSidebarOpen ? "Thu gọn danh sách bài học" : "Mở rộng danh sách bài học"}
          >
            {isLeftSidebarOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>

          {/* CENTER PANEL: SLIDE READER & READER TOOLBAR */}
          <main className="flex-1 bg-slate-100 overflow-y-auto p-3 flex flex-col space-y-2.5 h-full relative">
            
            {/* Top Reader Toolbar */}
            <div className="bg-white rounded-xl px-3 py-1.5 border border-slate-200 flex items-center justify-between shadow-2xs text-xs shrink-0">
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-full bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] font-bold flex items-center gap-1 text-xs">
                  <Search size={13} /> Đọc
                </button>
                <button className="px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200 font-medium hover:bg-slate-50 flex items-center gap-1 text-xs">
                  <Edit3 size={13} /> Bút
                </button>
                <button className="px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200 font-medium hover:bg-slate-50 flex items-center gap-1 text-xs">
                  <Highlighter size={13} /> Highlight
                </button>
                
                <div className="h-4 w-px bg-slate-200 mx-0.5" />

                <span className="px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs">
                  Trang {currentSlidePage} / {currentDay.pageCount}
                </span>

                {/* Working Zoom Pill Badge */}
                <div className="px-2.5 py-0.5 rounded-full border border-slate-200 bg-white text-slate-700 font-medium text-xs flex items-center gap-2 shadow-2xs">
                  <button 
                    onClick={handleZoomOut}
                    className="hover:text-indigo-600 font-bold px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors text-sm"
                    title="Thu nhỏ tỷ lệ (-25%)"
                  >
                    -
                  </button>
                  <span 
                    onClick={handleZoomReset}
                    className="cursor-pointer hover:text-indigo-600 font-bold px-1 rounded transition-colors"
                    title="Bấm để đặt lại 100%"
                  >
                    {zoomLevel}%
                  </span>
                  <button 
                    onClick={handleZoomIn}
                    className="hover:text-indigo-600 font-bold px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors text-sm"
                    title="Phóng to tỷ lệ (+25%)"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Utility Icon Buttons */}
              <div className="flex items-center gap-1.5 text-slate-500">
                <button 
                  onClick={handleZoomIn}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors" 
                  title="Phóng to tỷ lệ (+25%)"
                >
                  <Plus size={14} />
                </button>
                <button 
                  onClick={handleZoomOut}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors" 
                  title="Thu nhỏ tỷ lệ (-25%)"
                >
                  <Minus size={14} />
                </button>
                <a 
                  href={currentDay.pdfPath} 
                  download 
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600" 
                  title="Tải xuống PDF"
                >
                  <Download size={14} />
                </a>
                <button 
                  onClick={() => window.print()} 
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50" 
                  title="In slide"
                >
                  <Printer size={14} />
                </button>
              </div>
            </div>

            {/* PURE WHITE BACKGROUND SLIDE CANVAS (CONTINUOUS VERTICAL SCROLL) */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-2xs relative overflow-hidden flex flex-col p-0" style={{ backgroundColor: '#ffffff' }}>
              <PdfSlideCanvas 
                pdfPath={currentDay.pdfPath}
                targetPageNum={targetPdfPage}
                zoomLevel={zoomLevel}
              />
            </div>

          </main>

          {/* ↔️ RESIZABLE DRAG HANDLE DIVIDER FOR RIGHT SIDEBAR */}
          {isRightSidebarOpen && (
            <div
              onMouseDown={handleMouseDownResize}
              className="w-2.5 hover:w-3 bg-slate-200/60 hover:bg-indigo-500/80 cursor-col-resize z-20 transition-all flex items-center justify-center group shrink-0 relative"
              title="Kéo thả con trỏ chuột sang Trái/Phải để phóng to/thu nhỏ khung VLearn Tutor AI"
            >
              <div className="w-1 h-10 bg-slate-400/70 group-hover:bg-white rounded-full transition-colors flex items-center justify-center">
                <GripVertical size={10} className="text-slate-600 group-hover:text-white" />
              </div>
            </div>
          )}

          {/* RIGHT SIDEBAR (VLEARN TUTOR & AI BRIDGE - DYNAMICALLY RESIZABLE 280px - 680px) */}
          {isRightSidebarOpen && (
            <aside 
              style={{ width: `${rightSidebarWidth}px` }}
              className="bg-white border-l border-slate-200 p-3.5 space-y-3.5 shrink-0 overflow-y-auto h-full z-10 flex flex-col transition-width duration-75"
            >
              
              {/* Header Switcher */}
              <div className="space-y-2 border-b border-slate-200 pb-2.5 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                      <Bot size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {rightPanelTab === 'bridge' ? 'AI Learning Bridge' : 'VLearn Tutor AI'}
                      </h3>
                      <p className="text-[10px] font-semibold text-[#00a884] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00a884]" />
                        Trợ lý học theo ngữ cảnh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full border border-indigo-200 text-[10px] text-indigo-800 font-bold bg-indigo-50">
                      {currentDay.code}
                    </span>
                  </div>
                </div>

                {/* Tab Switcher Bar */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full">
                  <button 
                    onClick={() => setRightPanelTab('bridge')}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                      rightPanelTab === 'bridge' ? 'bg-white text-[#0f2b5c] shadow-3xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Sparkles size={13} className="text-indigo-600" /> Bridge Agent
                  </button>

                  <button 
                    onClick={() => setRightPanelTab('tutor')}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                      rightPanelTab === 'tutor' ? 'bg-white text-[#0f2b5c] shadow-3xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <MessageSquare size={13} className="text-rose-600" /> VLearn Tutor
                  </button>
                </div>
              </div>

              {/* TAB 1: OUR AI LEARNING BRIDGE AGENT */}
              {rightPanelTab === 'bridge' && (
                <div className="space-y-4 flex-1">
                  <LearningBridge 
                    bridgeData={bridgeData}
                    fromDay={previousDay}
                    toDay={currentDay}
                    onRefreshLLM={() => fetchBridgeData(pathMode)}
                    loading={loading}
                    onSkipBridge={() => setShowBridgeWidget(false)}
                    onJumpToSlide={handleJumpToSlide}
                  />
                </div>
              )}

              {/* TAB 2: INTERACTIVE VLEARN TUTOR AGENT */}
              {rightPanelTab === 'tutor' && (
                <div className="flex-1 overflow-hidden">
                  <VLearnTutor 
                    currentDay={currentDay} 
                    onJumpToSlide={handleJumpToSlide}
                  />
                </div>
              )}

            </aside>
          )}

          {/* RIGHT SIDEBAR ROBOT TOGGLE BUTTON */}
          <button 
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            style={{ right: isRightSidebarOpen ? `${rightSidebarWidth - 16}px` : '0' }}
            className="absolute top-1/2 -translate-y-1/2 z-30 w-9 h-12 bg-white border border-slate-300 border-r-0 rounded-l-xl shadow-md flex items-center justify-center text-indigo-700 hover:text-indigo-900 transition-all cursor-pointer"
            title={isRightSidebarOpen ? "Thu gọn bảng trợ lý VLearn Tutor" : "Mở rộng bảng trợ lý VLearn Tutor"}
          >
            <Bot size={22} className="text-indigo-600" />
          </button>

        </div>
      )}

      {/* FOOTER (Cố định shrink-0) */}
      <footer className="bg-white border-t border-slate-200 px-5 py-2 text-xs text-slate-500 flex items-center justify-between shrink-0">
        <div>VLearn AI Learning Bridge Prototype • Nhóm BrainStormers (K4)</div>
        <div className="flex items-center gap-4">
          <span>Gemini API Real Call Working Prototype</span>
          <span>Rubric R5: 8 điểm</span>
        </div>
      </footer>
    </div>
  );
}
