'use client';

import React, { useState, useEffect, useRef } from 'react';
import MindmapTree from '@/app/components/MindmapTree';

// Interfaces for structured data
interface Scene {
  id: string;
  type: 'slide' | 'code' | 'dashboard' | 'mindmap' | 'quiz' | 'game' | 'animation';
  title: string;
  sessionIndex?: number;
}

interface Message {
  id: string;
  role: 'user' | 'ai' | 'peer';
  text: string;
  avatar: string;
  name: string;
  showPlay?: boolean;
  // id nhân vật debate (vd 'curious_mind', 'note_taker'...) - dùng để tô màu
  // riêng cho từng agent trong UI, giúp người dùng dễ phân biệt ai đang nói.
  agentId?: string;
}

interface OutlineItem {
  index: number;
  type: 'slide' | 'quiz' | 'animation' | 'mindmap' | string;
  content: string;
  // Grounding vào slide gốc (chỉ có ở item type="slide") - do backend gắn lúc upload PDF,
  // giữ nguyên ở đây để có thể gửi lại cho /api/generate/slide[/stream].
  page_no?: number | null;
  page_width?: number | null;
  page_height?: number | null;
  bg_image?: string | null;
  elements?: SlideElement[] | null;
}

// Shapes returned by POST /api/generate/{type}, mirroring backend app/schemas.py
interface QuizOption {
  key: string;
  text: string;
}

interface QuizOutput {
  index: number;
  type: 'quiz';
  question: string;
  question_format: 'multiple_choice';
  options: QuizOption[];
  correct_answer: string;
  explanation: string;
}

// Phần tử văn bản thực tế trên ĐÚNG trang slide gốc người dùng đã upload (toạ độ PDF gốc)
interface SlideElement {
  id: string;
  text: string;
  bbox: number[]; // [left, top, right, bottom]
  label: string;
}

interface NarrationSegment {
  text: string;
  focus_element_id?: string | null;
  focus_bbox?: number[] | null;
}

// Slide hiển thị đúng ảnh gốc (bg_image) đã upload; narration chỉ dùng để đọc + khoanh vị trí
interface SlideOutput {
  index: number;
  type: 'slide';
  title: string;
  summary: string;
  narration: NarrationSegment[];
  page_no?: number | null;
  page_width?: number | null;
  page_height?: number | null;
  bg_image?: string | null;
  elements: SlideElement[];
}

interface AnimationStep {
  order: number;
  label: string;
  description: string;
  duration_ms?: number;
}

interface AnimationOutput {
  index: number;
  type: 'animation';
  animation_type: 'timeline' | 'flow' | 'comparison';
  title: string;
  steps: AnimationStep[];
  html?: string | null;
}

interface MindmapNode {
  id: string;
  label: string;
  parent_id?: string | null;
}

interface MindmapOutput {
  index: number;
  type: 'mindmap';
  root_label: string;
  nodes: MindmapNode[];
}

type SessionContent = QuizOutput | SlideOutput | AnimationOutput | MindmapOutput;

const API_BASE = 'http://localhost:8000';

const GENERATE_ENDPOINTS: Record<string, string> = {
  quiz: `${API_BASE}/api/generate/quiz`,
  slide: `${API_BASE}/api/generate/slide`,
  animation: `${API_BASE}/api/generate/animation`,
  mindmap: `${API_BASE}/api/generate/mindmap`,
};

const DEBATE_TURN_ENDPOINT = `${API_BASE}/api/debate/turn`;

const OUTLINE_TYPE_ICONS: Record<string, string> = {
  slide: '📑',
  quiz: '📝',
  animation: '🎬',
  mindmap: '🧠',
};

const SCENE_TYPES = {
  slide: { label: 'Slide', icon: '📑' },
  code: { label: 'Code', icon: '💻' },
  dashboard: { label: 'Tương tác', icon: '🎛️' },
  mindmap: { label: 'Sơ đồ tư duy', icon: '🧠' },
  quiz: { label: 'Bài tập', icon: '📝' },
  game: { label: 'Trò chơi', icon: '🎮' },
  animation: { label: 'Minh hoạ', icon: '🎬' },
};

const INITIAL_SCENES: Scene[] = [
  { id: 's0', type: 'slide', title: 'Welcome to Python' },
  { id: 's1', type: 'code', title: 'Your First Line of Code' },
  { id: 's2', type: 'dashboard', title: 'Variables as Containers' },
  { id: 's3', type: 'slide', title: 'Control Flow Basics' },
  { id: 's4', type: 'mindmap', title: 'The Logic Flowchart' },
  { id: 's5', type: 'quiz', title: 'Conditional Coding Challenge' },
  { id: 's6', type: 'game', title: 'Looping Logic Lab' },
];

const NARRATIONS: Record<string, string> = {
  s0: 'Xin chào! Chào mừng đến với khóa học Python. Mình rất hào hứng được đồng hành cùng bạn trong hành trình này!',
  s1: 'Bây giờ hãy viết dòng lệnh Python đầu tiên của bạn. Nhấn Run Code để xem kết quả nhé.',
  s2: 'Hãy hình dung một biến giống như một chiếc hộp có nhãn. Thử kéo thanh trượt bên dưới để xem giá trị thay đổi thế nào nhé.',
  s3: 'Control flow quyết định thứ tự thực thi các câu lệnh — hãy cùng xem qua if/else, for và while.',
  s4: 'Đây là sơ đồ tư duy tổng hợp toàn bộ logic điều khiển chương trình mà chúng ta vừa học.',
  s5: 'Đến lúc kiểm tra nhanh kiến thức rồi! Trả lời lần lượt các câu hỏi bên dưới nhé.',
  s6: 'Hãy kéo thả các khối lệnh đúng thứ tự để hoàn thành vòng lặp for nhé!',
};

const QUIZ_BANK = [
  { q: 'Lệnh nào dùng để in ra màn hình trong Python?', opts: ['console.log()', 'print()', 'echo()', 'System.out.println()'], correct: 1 },
  { q: 'Cấu trúc nào dùng để rẽ nhánh theo điều kiện?', opts: ['for', 'while', 'if / else', 'def'], correct: 2 },
  { q: 'range(5) sinh ra dãy số nào?', opts: ['1,2,3,4,5', '0,1,2,3,4', '0,1,2,3,4,5', '5,4,3,2,1'], correct: 1 },
];

const GAME_CHIPS = ['for', 'i', 'in', 'range(5):', 'print(i)'];

interface DebateAgent {
  id: string;
  initial: string;
  name: string;
  role: string;
  desc: string;
}

// Danh sách "nhân vật" tham gia debate mode - id phải khớp đúng với Literal
// next_speaker trong DebateTurnRequest (backend: app/agents/debate_agent.py).
const DEBATE_AGENTS: DebateAgent[] = [
  { id: 'curious_mind', initial: '🙂', name: 'Curious Mind', role: 'Student', desc: 'Always curious, loves asking why and how' },
  { id: 'logic_master', initial: '🤓', name: 'Logic Master', role: 'Student', desc: 'Thinks in patterns, enjoys solving step by step' },
  { id: 'bright_spark', initial: '✨', name: 'Bright Spark', role: 'Student', desc: 'Quick to try things out, learns by experimenting' },
  { id: 'note_taker', initial: '📝', name: 'Note Taker', role: 'Assistant', desc: 'Tóm tắt lại các ý chính trong buổi thảo luận' },
];

const AI_TEACHER = { id: 'ai_teacher', initial: '🧑‍🏫', name: 'AI Teacher' };

// Màu riêng cho từng nhân vật debate, giúp người dùng phân biệt nhanh ai đang
// nói trong lúc nhiều agent liên tục trao đổi (áp dụng cho avatar + tên +
// viền trái bong bóng chat, xem .fmsg-row trong globals.css).
const AGENT_COLORS: Record<string, string> = {
  curious_mind: '#f5a623',
  logic_master: '#22c55e',
  bright_spark: '#ec4899',
  note_taker: '#06b6d4',
  ai_teacher: '#8a5cf6',
  user: '#5b7cfa',
};

// Chu kỳ lặp lại vô hạn của các nhân vật phát biểu trong 1 buổi debate: 3 bạn
// học lần lượt, cứ hết 1 vòng thì Note Taker tóm tắt lại 1 lần. Buổi thảo
// luận cứ lặp lại chu kỳ này MÃI MÃI (không có điểm dừng cố định) cho tới khi
// người dùng bấm "Kết thúc thảo luận" - lúc đó AI Teacher mới vào tổng kết.
const DEBATE_CYCLE = ['curious_mind', 'logic_master', 'bright_spark', 'note_taker'];

interface DebateTranscriptEntry {
  speaker_id: string;
  speaker_name: string;
  role: 'user' | 'agent';
  text: string;
}

// Bọc đoạn HTML (Tailwind class + <style> @keyframes) do animation_agent sinh ra thành 1 tài
// liệu HTML đầy đủ để nạp vào <iframe srcDoc>: iframe là 1 document tách biệt nên cần tự nạp
// Tailwind CDN (JIT runtime) ở đây, không thể dùng lại CSS đã build sẵn của trang chính vì
// class Tailwind LLM sinh ra là động, Tailwind build-time của Next.js không quét thấy.
function buildAnimationSrcDoc(html: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<script src="https://cdn.tailwindcss.com"></script>
<style>html,body{margin:0;padding:12px;box-sizing:border-box;font-family:inherit;}</style>
</head>
<body>${html}</body>
</html>`;
}

const LOADING_STEPS = [
  { label: 'Đang phân tích nội dung slide bạn vừa tải lên', from: 0, to: 20 },
  { label: 'Đang tạo kịch bản bài giảng và giọng đọc (TTS)', from: 20, to: 42 },
  { label: 'Đang tạo slide tương tác (biến, dashboard)', from: 42, to: 60 },
  { label: 'Đang tạo sơ đồ tư duy tổng hợp bài học', from: 60, to: 78 },
  { label: 'Đang tạo bài tập và trò chơi tương tác', from: 78, to: 100 },
];

export default function Home() {
  // Screens state
  const [startScreenVisible, setStartScreenVisible] = useState(true);
  const [startScreenHidden, setStartScreenHidden] = useState(false);
  const [loadingScreenVisible, setLoadingScreenVisible] = useState(false);
  const [loadingScreenOpacity, setLoadingScreenOpacity] = useState(false);
  const [appVisible, setAppVisible] = useState(false);

  // File Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressVisible, setUploadProgressVisible] = useState(false);
  const [startBtnReady, setStartBtnReady] = useState(false);
  const [outline, setOutline] = useState<OutlineItem[]>([]);

  // Per-session generated content, keyed by outline item index
  const [sessionData, setSessionData] = useState<Record<number, SessionContent>>({});
  const [quizRuntime, setQuizRuntime] = useState<Record<number, { selected: string | null; answered: boolean }>>({});

  // Loading animation state
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [loadingPct, setLoadingPct] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<('pending' | 'active' | 'done')[]>(
    new Array(LOADING_STEPS.length).fill('pending')
  );
  const [loadingStepLabels, setLoadingStepLabels] = useState<string[]>(LOADING_STEPS.map((s) => s.label));
  const [loadingSub, setLoadingSub] = useState(LOADING_STEPS[0].label);

  // App & Slide State
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [annotating, setAnnotating] = useState(false);
  const [courseName, setCourseName] = useState('Khóa học: Nhập môn Python');

  // Sidebar dynamic thumbnails paint state
  const [thumbnailsPainted, setThumbnailsPainted] = useState<Record<string, boolean>>({});

  // Slide-specific states
  // Code slide
  const [consoleText, setConsoleText] = useState('Nhấn Run Code để chạy thử...');
  // Dashboard slide
  const [dashAge, setDashAge] = useState(25);
  const [dashScore, setDashScore] = useState(80);
  const [dashLevel, setDashLevel] = useState(3);
  // Quiz slide
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelection, setQuizSelection] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [quizFeedbackClass, setQuizFeedbackClass] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);
  // Game slide
  const [gameOrder, setGameOrder] = useState<number[]>([]);
  const [gameResult, setGameResult] = useState('');
  const [gameResultClass, setGameResultClass] = useState('');

  // Generation Loading states
  const [genMindmapLoading, setGenMindmapLoading] = useState(false);
  const [genQuizLoading, setGenQuizLoading] = useState(false);

  // Narration (TTS) state
  const [narrationSpeaking, setNarrationSpeaking] = useState(false);
  const [speechTimer, setSpeechTimer] = useState<NodeJS.Timeout | null>(null);
  const [narrationSegmentText, setNarrationSegmentText] = useState<string | null>(null);
  const [focusedBbox, setFocusedBbox] = useState<number[] | null>(null);

  // Chat and Discussion state
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const [msgBadge, setMsgBadge] = useState<number | null>(null);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [discussionActive, setDiscussionActive] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState<{ name: string; avatar: string; agentId: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // Transcript của buổi debate hiện tại, giữ ở ref (không phải state) vì
  // runDebateLoop là 1 async loop - đọc từ state React trong đó sẽ bị "stale
  // closure". Nhờ giữ ở ref, tin nhắn người dùng chen vào giữa chừng
  // (human-in-the-loop) được vòng lặp đọc thấy ngay ở lượt gọi API kế tiếp.
  const debateTranscriptRef = useRef<DebateTranscriptEntry[]>([]);
  const debateTopicRef = useRef<string>('');
  // true khi người dùng bấm "Kết thúc thảo luận" - runDebateLoop kiểm tra cờ
  // này trước mỗi vòng lặp để biết khi nào dừng và chuyển sang AI Teacher
  // tổng kết, thay vì có 1 số lượt cố định.
  const debateStopRef = useRef(false);
  const streamAbortRef = useRef<AbortController | null>(null);
  const ttsBufferRef = useRef('');
  // Giữ tham chiếu utterance đang phát + interval "đánh thức" định kỳ: Chrome/Edge có bug nổi
  // tiếng là garbage-collect SpeechSynthesisUtterance nếu không còn biến nào giữ tham chiếu tới
  // nó (utterance chỉ được speechSynthesis giữ tham chiếu YẾU), khiến audio im lặng dừng ngang
  // mà không có lỗi gì; và tự動 tạm dừng (auto-pause) sau ~15s không thao tác. Giữ ref +
  // resume() định kỳ để tránh cả 2.
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const ttsKeepAliveRef = useRef<NodeJS.Timeout | null>(null);
  // Cache giọng đọc tiếng Việt tìm được, vì Chrome nạp danh sách voices bất đồng bộ (sự kiện
  // onvoiceschanged) - lần gọi getVoices() đầu tiên ngay sau khi trang load thường trả về mảng
  // rỗng. Nếu chỉ set utterance.lang mà không gán utterance.voice, Chrome hay fallback về giọng
  // tiếng Anh mặc định và đọc tiếng Việt sai giọng/không dấu.
  const viVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const chatLogEndRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!appVisible) return;
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appVisible, current, scenes.length, loopEnabled, playing]);

  // Nạp danh sách giọng đọc của trình duyệt và ghim lại 1 giọng tiếng Việt (ưu tiên vi-VN) vào
  // viVoiceRef. Chrome nạp voices bất đồng bộ nên phải lắng nghe onvoiceschanged, không chỉ gọi
  // getVoices() 1 lần lúc mount.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const pickViVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const viVoice =
        voices.find((v) => v.lang?.toLowerCase() === 'vi-vn') ||
        voices.find((v) => v.lang?.toLowerCase().startsWith('vi')) ||
        null;
      if (viVoice) viVoiceRef.current = viVoice;
    };
    pickViVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickViVoice);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickViVoice);
  }, []);

  // playingRef: bản sao của state "playing" nhưng đọc được ngay trong callback bất đồng bộ
  // (utterance.onend, event NDJSON "done"...) mà không bị đóng băng theo closure cũ (stale).
  const playingRef = useRef(false);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Handle automatic slide playing: KHÔNG dùng timer cố định (3s) như trước — timer cố định
  // luôn cắt ngang giữa lúc agent đang đọc narration vì không biết audio đã đọc xong hay chưa.
  // Thay vào đó: khi playing=true, đọc narration của scene hiện tại; chỉ chuyển sang scene kế
  // tiếp SAU KHI audio thật sự đọc xong (xem onNarrationFinished / advanceIfAutoplay bên dưới).
  useEffect(() => {
    if (!playing || scenes.length === 0) return;
    startNarration();
  }, [playing, current, scenes.length]);

  // Update narration when slide changes
  useEffect(() => {
    stopNarration();
  }, [current]);

  // Scroll chat to bottom
  useEffect(() => {
    chatLogEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, typingIndicator]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setUploadProgressVisible(true);
    setUploadProgress(20); // Bắt đầu gửi
    setStartBtnReady(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Gọi API Backend
      const response = await fetch('http://localhost:8000/api/upload-slide', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80); // Đã nhận xong, chuẩn bị xử lý

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Markdown trích xuất từ Docling:', data.markdown);

      setOutline(Array.isArray(data.outline) ? data.outline : []);
      setUploadProgress(100);
      setStartBtnReady(true);
    } catch (error) {
      console.error('Lỗi khi xử lý file:', error);
      setOutline([]);
      setUploadProgress(100);
      setStartBtnReady(true); // Fallback để không bị kẹt UI
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadProgressVisible(false);
    setUploadProgress(0);
    setStartBtnReady(false);
    setOutline([]);
  };

  const startCourse = (skip = false) => {
    if (!skip && !startBtnReady) return;
    setStartScreenHidden(true);
    setTimeout(() => {
      setStartScreenVisible(false);
      runGeneratingSequence(skip ? [] : outline);
    }, 350);
  };

  // Gọi API generate tương ứng với type của 1 phần trong outline (quiz/slide/animation/mindmap)
  const fetchSessionContent = async (item: OutlineItem): Promise<SessionContent | null> => {
    const url = GENERATE_ENDPOINTS[item.type];
    if (!url) return null;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: item.index,
          type: item.type,
          content: item.content,
          page_no: item.page_no,
          page_width: item.page_width,
          page_height: item.page_height,
          bg_image: item.bg_image,
          elements: item.elements,
        }),
      });
      if (!res.ok) throw new Error(`Generate ${item.type} thất bại`);
      return await res.json();
    } catch (err) {
      console.error(`Lỗi khi tạo nội dung cho phần ${item.index} (${item.type}):`, err);
      return null;
    }
  };

  const sceneTitleFromContent = (item: OutlineItem, content: SessionContent): string => {
    switch (item.type) {
      case 'slide':
        return (content as SlideOutput).title;
      case 'quiz':
        return (content as QuizOutput).question;
      case 'animation':
        return (content as AnimationOutput).title;
      case 'mindmap':
        return (content as MindmapOutput).root_label;
      default:
        return `Phần ${item.index + 1}`;
    }
  };

  const finishGeneratingSequence = () => {
    setTimeout(() => {
      setLoadingScreenOpacity(false);
      setTimeout(() => {
        setLoadingScreenVisible(false);
        setAppVisible(true);
        if (selectedFile) {
          const displayName = selectedFile.name.replace(/\.[^/.]+$/, '');
          setCourseName('Khóa học: ' + displayName);
        }
      }, 400);
    }, 400);
  };

  // Lặp qua từng phần trong outline nhận từ API upload, gọi API generate tương ứng
  // để lấy nội dung chi tiết, rồi dựng danh sách scene thực tế từ kết quả trả về.
  const runGeneratingSequence = async (outlineItems: OutlineItem[]) => {
    setLoadingScreenVisible(true);
    setTimeout(() => setLoadingScreenOpacity(true), 50);

    if (outlineItems.length === 0) {
      // Không có outline (vd. dùng slide mẫu) -> giữ hoạt ảnh tải giả lập như cũ
      setLoadingStepLabels(LOADING_STEPS.map((s) => s.label));
      setStepStatuses(new Array(LOADING_STEPS.length).fill('pending'));
      let stepIdx = 0;
      let pct = 0;
      const runStep = () => {
        if (stepIdx >= LOADING_STEPS.length) {
          finishGeneratingSequence();
          return;
        }
        const step = LOADING_STEPS[stepIdx];
        setLoadingSub(step.label);
        setStepStatuses((prev) => {
          const next = [...prev];
          next[stepIdx] = 'active';
          return next;
        });
        const tick = setInterval(() => {
          pct += (step.to - step.from) / 14;
          if (pct >= step.to) {
            pct = step.to;
            clearInterval(tick);
            setStepStatuses((prev) => {
              const next = [...prev];
              next[stepIdx] = 'done';
              return next;
            });
            stepIdx++;
            setTimeout(runStep, 220);
          }
          setLoadingPct(Math.round(pct));
        }, 90);
      };
      runStep();
      return;
    }

    const total = outlineItems.length;
    setLoadingStepLabels(outlineItems.map((item) => `Đang tạo ${item.type} cho phần ${item.index + 1}`));
    setStepStatuses(new Array(total).fill('pending'));
    setLoadingPct(0);

    const newSessionData: Record<number, SessionContent> = {};
    const newScenes: Scene[] = [];

    for (let i = 0; i < total; i++) {
      const item = outlineItems[i];
      setLoadingSub(`Đang tạo ${OUTLINE_TYPE_ICONS[item.type] || ''} ${item.type} cho phần ${item.index + 1}...`);
      setStepStatuses((prev) => {
        const next = [...prev];
        next[i] = 'active';
        return next;
      });

      const content = await fetchSessionContent(item);
      if (content) {
        newSessionData[item.index] = content;
        newScenes.push({
          id: `session-${item.index}`,
          type: item.type as Scene['type'],
          title: sceneTitleFromContent(item, content),
          sessionIndex: item.index,
        });
      }

      setStepStatuses((prev) => {
        const next = [...prev];
        next[i] = 'done';
        return next;
      });
      setLoadingPct(Math.round(((i + 1) / total) * 100));
    }

    setSessionData(newSessionData);
    if (newScenes.length > 0) {
      setScenes(newScenes);
      setCurrent(0);
    }

    finishGeneratingSequence();
  };

  const goTo = (i: number) => {
    if (loopEnabled) {
      const idx = ((i % scenes.length) + scenes.length) % scenes.length;
      setCurrent(idx);
    } else {
      const idx = Math.max(0, Math.min(scenes.length - 1, i));
      setCurrent(idx);
      if (idx === scenes.length - 1 && i >= scenes.length && playing) {
        togglePlay(false);
      }
    }
  };

  const nextSlide = () => goTo(current + 1);
  const prevSlide = () => goTo(current - 1);

  // Gọi khi 1 scene đọc XONG HẲN (audio đã kết thúc, không phải lúc bắt đầu đọc) -> nếu đang ở
  // chế độ autoplay (playing=true) thì mới chuyển sang scene kế tiếp; nếu người dùng chỉ bấm
  // nghe thử 1 scene (không autoplay) thì không tự chuyển.
  const advanceIfAutoplay = () => {
    if (playingRef.current) {
      nextSlide();
    }
  };

  const onNarrationFinished = () => {
    setNarrationSpeaking(false);
    advanceIfAutoplay();
  };

  const togglePlay = (force?: boolean) => {
    const nextPlay = force !== undefined ? force : !playing;
    if (!nextPlay) {
      // Tắt autoplay -> dừng luôn narration đang đọc dở, tránh audio kêu tiếp trong lúc đã pause.
      stopNarration();
    }
    setPlaying(nextPlay);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const currentSpeedIdx = speeds.indexOf(playSpeed);
    const nextIdx = (currentSpeedIdx + 1) % speeds.length;
    setPlaySpeed(speeds[nextIdx]);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (next && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleLoop = () => {
    setLoopEnabled(!loopEnabled);
  };

  const toggleAnnotate = () => {
    setAnnotating(!annotating);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('stage-wrap');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => { });
    } else {
      document.exitFullscreen?.().catch(() => { });
    }
  };

  // Narration (TTS) Toggle
  const toggleNarration = () => {
    narrationSpeaking ? stopNarration() : startNarration();
  };

  // Đọc to 1 đoạn text bằng giọng đọc có sẵn của trình duyệt (Web Speech API). Không hỗ trợ
  // hoặc đang tắt tiếng (muted) -> gọi luôn onEnd để caller không bị treo timing.
  const stopTtsKeepAlive = () => {
    if (ttsKeepAliveRef.current) {
      clearInterval(ttsKeepAliveRef.current);
      ttsKeepAliveRef.current = null;
    }
  };

  const speakText = (text: string, onEnd?: () => void) => {
    const trimmed = text.trim();
    if (!trimmed || typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.();
      return;
    }
    if (muted) {
      onEnd?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.lang = 'vi-VN';
    // Gán voice tường minh: chỉ set lang không đủ, Chrome hay fallback về giọng tiếng Anh mặc
    // định nếu không có voice nào được chọn rõ ràng (xem viVoiceRef ở trên).
    if (viVoiceRef.current) utterance.voice = viVoiceRef.current;
    utterance.rate = playSpeed || 1;
    const cleanup = () => {
      stopTtsKeepAlive();
      currentUtteranceRef.current = null;
    };
    utterance.onend = () => {
      cleanup();
      onEnd?.();
    };
    utterance.onerror = () => {
      cleanup();
      onEnd?.();
    };
    // Giữ tham chiếu để tránh bị GC giữa chừng (xem giải thích ở khai báo currentUtteranceRef).
    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    // Né bug Chrome/Edge tự động pause speechSynthesis sau ~15s không thao tác.
    stopTtsKeepAlive();
    ttsKeepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);
  };

  const startNarration = () => {
    stopNarration();
    setNarrationSpeaking(true);

    const activeScene = scenes[current];

    // Slide: stream lời thuyết trình trực tiếp từ backend, gõ dần từng chữ + đọc to bằng TTS
    // của trình duyệt, khoanh sáng đúng phần nội dung trên ảnh slide gốc mà agent đang nhắc tới.
    if (activeScene.type === 'slide' && activeScene.sessionIndex !== undefined) {
      const outlineItem = outline.find((o) => o.index === activeScene.sessionIndex);
      if (outlineItem) {
        streamSlideNarration(outlineItem);
        return;
      }
    }

    const text = getNarrationText(activeScene);
    if (typeof window !== 'undefined' && window.speechSynthesis && !muted) {
      speakText(text, onNarrationFinished);
    } else {
      // Không hỗ trợ TTS hoặc đang tắt tiếng -> vẫn giữ hiệu ứng đang đọc theo thời lượng ước tính
      const duration = Math.min(6000, 1500 + text.length * 40);
      const timer = setTimeout(onNarrationFinished, duration);
      setSpeechTimer(timer);
    }
  };

  // Đọc NDJSON stream từ /api/generate/slide/stream: mỗi dòng là 1 event JSON
  // ({"type":"focus"|"text"|"meta"|"done", ...}) - gõ dần text, đổi vùng khoanh sáng theo focus,
  // và đọc to bằng TTS trình duyệt theo từng đoạn (flush lúc đổi vùng focus / kết thúc stream).
  const streamSlideNarration = async (item: OutlineItem) => {
    const controller = new AbortController();
    streamAbortRef.current = controller;
    setNarrationSegmentText('');
    setFocusedBbox(null);
    ttsBufferRef.current = '';

    try {
      const res = await fetch(`${API_BASE}/api/generate/slide/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: item.index,
          type: 'slide',
          content: item.content,
          page_no: item.page_no,
          page_width: item.page_width,
          page_height: item.page_height,
          bg_image: item.bg_image,
          elements: item.elements,
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error('Stream slide narration thất bại');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let lineBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        lineBuffer += decoder.decode(value, { stream: true });

        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop() || ''; // dòng cuối có thể chưa trọn vẹn, giữ lại chờ chunk sau

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);
          if (event.type === 'text') {
            setNarrationSegmentText((prev) => (prev || '') + event.text);
            ttsBufferRef.current += event.text;
          } else if (event.type === 'focus') {
            // Đọc to hết đoạn vừa gõ xong trước khi chuyển sang vùng focus mới
            speakText(ttsBufferRef.current);
            ttsBufferRef.current = '';
            setFocusedBbox(event.focus_bbox ?? null);
          } else if (event.type === 'done') {
            // Chỉ coi slide này là "đọc xong" (và chỉ lúc đó mới cho phép autoplay chuyển sang
            // scene kế tiếp) SAU KHI đoạn audio cuối cùng này thật sự phát xong - không phải
            // ngay khi nhận xong text từ stream.
            speakText(ttsBufferRef.current, onNarrationFinished);
            ttsBufferRef.current = '';
            setFocusedBbox(null);
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Lỗi khi stream narration slide:', err);
      }
    } finally {
      if (streamAbortRef.current === controller) {
        streamAbortRef.current = null;
      }
    }
  };

  const stopNarration = () => {
    setNarrationSpeaking(false);
    setNarrationSegmentText(null);
    setFocusedBbox(null);
    ttsBufferRef.current = '';
    if (speechTimer) {
      clearTimeout(speechTimer);
      setSpeechTimer(null);
    }
    if (streamAbortRef.current) {
      streamAbortRef.current.abort();
      streamAbortRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    stopTtsKeepAlive();
    currentUtteranceRef.current = null;
  };

  // Chat toggle
  const toggleChatBox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setChatBoxOpen(!chatBoxOpen);
    if (!chatBoxOpen) {
      setMsgBadge(null);
    }
  };

  // Interactive Code run
  const runCode = () => {
    setConsoleText('>>> Hello, World!');
  };

  // Interactive Quiz Actions
  const answerQuiz = (i: number) => {
    if (quizAnswered) return;
    setQuizAnswered(true);
    setQuizSelection(i);
    const item = QUIZ_BANK[quizIdx];
    if (i === item.correct) {
      setQuizScore((prev) => prev + 1);
      setQuizFeedback('✓ Chính xác! Làm tốt lắm.');
      setQuizFeedbackClass('quiz-feedback show ok');
    } else {
      setQuizFeedback('✗ Chưa đúng. Đáp án đúng đã được tô xanh.');
      setQuizFeedbackClass('quiz-feedback show no');
    }
  };

  const nextQuiz = () => {
    if (quizIdx < QUIZ_BANK.length - 1) {
      setQuizIdx((prev) => prev + 1);
      setQuizAnswered(false);
      setQuizSelection(null);
      setQuizFeedback('');
      setQuizFeedbackClass('');
    } else {
      setQuizCompleted(true);
    }
  };

  // Answer handler for quiz sessions generated from the uploaded outline: đáp án đúng đã được
  // sinh kèm ngay trong QuizOutput (correct_answer), nên chỉ cần so khớp trực tiếp ở FE, không
  // cần gọi thêm API/LLM nào sau khi người dùng chọn đáp án.
  const answerGeneratedQuiz = (sessionIndex: number, selectedKey: string) => {
    setQuizRuntime((prev) => {
      if (prev[sessionIndex]?.answered) return prev;
      return { ...prev, [sessionIndex]: { selected: selectedKey, answered: true } };
    });
  };

  // Narration text for the current scene: generated content summary/explanation when available,
  // otherwise the static demo narration.
  const getNarrationText = (s: Scene): string => {
    if (s.type === 'slide' && narrationSegmentText !== null) {
      return narrationSegmentText;
    }
    if (s.sessionIndex !== undefined) {
      const content = sessionData[s.sessionIndex];
      if (content) {
        switch (s.type) {
          case 'slide':
            return (content as SlideOutput).summary;
          case 'quiz':
            return (content as QuizOutput).explanation;
          case 'animation':
            return (content as AnimationOutput).steps[0]?.description || '';
          case 'mindmap':
            return `Đây là sơ đồ tư duy về ${(content as MindmapOutput).root_label}.`;
          default:
            break;
        }
      }
    }
    return NARRATIONS[s.id] || '…';
  };

  // Interactive Drag & Click Code Game Actions
  const pickChip = (i: number) => {
    if (gameOrder.includes(i)) return;
    setGameOrder((prev) => [...prev, i]);
  };

  const checkGame = () => {
    const correct =
      gameOrder.length === GAME_CHIPS.length && gameOrder.every((v, i) => v === i);
    if (correct) {
      setGameResult('✓ Chính xác! for i in range(5): print(i)');
      setGameResultClass('game-result ok');
    } else {
      setGameResult('✗ Chưa đúng thứ tự, thử lại nhé (bấm lại từ đầu).');
      setGameResultClass('game-result no');
      setGameOrder([]);
    }
  };

  // Gọi backend cho đúng 1 lượt phát biểu của 1 nhân vật debate, dựa trên
  // chủ đề + transcript hiện tại (đọc trực tiếp từ ref để luôn thấy tin nhắn
  // chen ngang mới nhất của người dùng).
  const fetchDebateTurn = async (speakerId: string): Promise<DebateTranscriptEntry> => {
    const res = await fetch(DEBATE_TURN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: debateTopicRef.current,
        history: debateTranscriptRef.current,
        next_speaker: speakerId,
      }),
    });
    if (!res.ok) throw new Error(`Lượt debate của ${speakerId} thất bại`);
    const data = await res.json();
    return { speaker_id: data.speaker_id, speaker_name: data.speaker_name, role: 'agent', text: data.text };
  };

  // Lặp lại DEBATE_CYCLE vô hạn (curious_mind -> logic_master -> bright_spark
  // -> note_taker -> lặp lại...) cho tới khi người dùng bấm "Kết thúc thảo
  // luận" (debateStopRef.current = true, xem endDebate). Người dùng có thể
  // gửi tin nhắn mới bất kỳ lúc nào trong lúc vòng lặp đang chạy (xem
  // sendChat) - tin nhắn đó được đẩy thẳng vào debateTranscriptRef nên lượt
  // gọi API kế tiếp sẽ tự động "thấy" và phản hồi theo hướng mới, không cần
  // dừng vòng lặp lại.
  const runDebateLoop = async () => {
    let cycleIdx = 0;
    while (!debateStopRef.current) {
      const speakerId = DEBATE_CYCLE[cycleIdx % DEBATE_CYCLE.length];
      cycleIdx++;
      const agent = DEBATE_AGENTS.find((a) => a.id === speakerId);
      if (!agent) continue;

      setTypingIndicator({ name: agent.name, avatar: agent.initial, agentId: agent.id });
      try {
        const entry = await fetchDebateTurn(speakerId);
        debateTranscriptRef.current = [...debateTranscriptRef.current, entry];
        setChatLog((prev) => [
          ...prev,
          {
            id: 'chat_' + Date.now() + '_' + speakerId,
            role: 'peer',
            text: entry.text,
            avatar: agent.initial,
            name: entry.speaker_name,
            showPlay: true,
            agentId: speakerId,
          },
        ]);
      } catch (err) {
        console.error('Lỗi khi lấy lượt debate:', err);
      } finally {
        setTypingIndicator(null);
      }

      if (debateStopRef.current) break;
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
    }

    // Người dùng đã bấm "Kết thúc thảo luận" -> AI Teacher tổng kết toàn bộ
    setTypingIndicator({ name: AI_TEACHER.name, avatar: AI_TEACHER.initial, agentId: 'ai_teacher' });
    try {
      const entry = await fetchDebateTurn('ai_teacher');
      setChatLog((prev) => [
        ...prev,
        {
          id: 'chat_' + Date.now() + '_ai_wrap',
          role: 'ai',
          text: entry.text,
          avatar: AI_TEACHER.initial,
          name: entry.speaker_name,
          showPlay: true,
          agentId: 'ai_teacher',
        },
      ]);
    } catch (err) {
      console.error('Lỗi khi lấy lời tổng kết của AI Teacher:', err);
    } finally {
      setTypingIndicator(null);
    }

    setDiscussionActive(false);
    debateTranscriptRef.current = [];
    debateTopicRef.current = '';
  };

  // Gửi tin nhắn chat: nếu chưa có buổi debate nào đang chạy, tin nhắn này
  // trở thành CHỦ ĐỀ và khởi động runDebateLoop. Nếu debate đang chạy, đây là
  // 1 lượt CHEN NGANG của người dùng (human-in-the-loop) - chỉ cần đẩy vào
  // transcript, vòng lặp đang chạy sẽ tự đọc thấy ở lượt gọi kế tiếp.
  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');

    const userMsgObj: Message = {
      id: 'chat_' + Date.now() + '_user',
      role: 'user',
      text: userMsg,
      avatar: '🧑',
      name: 'Bạn',
      agentId: 'user',
    };
    setChatLog((prev) => [...prev, userMsgObj]);
    debateTranscriptRef.current = [
      ...debateTranscriptRef.current,
      { speaker_id: 'user', speaker_name: 'Bạn', role: 'user', text: userMsg },
    ];

    if (discussionActive) {
      // Chen ngang giữa buổi thảo luận - vòng lặp runDebateLoop đang chạy sẽ
      // tự thấy tin nhắn này ở lượt gọi API kế tiếp, không cần làm gì thêm.
      return;
    }

    debateTopicRef.current = userMsg;
    debateStopRef.current = false;
    setDiscussionActive(true);
    runDebateLoop();
  };

  // Người dùng chủ động đóng buổi thảo luận: đặt cờ dừng, vòng lặp
  // runDebateLoop sẽ thoát ngay sau lượt agent đang chạy dở (nếu có) rồi
  // chuyển sang để AI Teacher tổng kết.
  const endDebate = () => {
    debateStopRef.current = true;
  };

  const speakFloating = (e: React.MouseEvent, text: string) => {
    const btn = e.currentTarget as HTMLDivElement;
    btn.textContent = '⏸';
    btn.classList.add('speaking');
    setTimeout(() => {
      btn.textContent = '▶';
      btn.classList.remove('speaking');
    }, 1300);
  };

  // AI request generation (Mindmap or Quiz)
  const requestGenerate = (kind: 'mindmap' | 'quiz') => {
    if (kind === 'mindmap') {
      setGenMindmapLoading(true);
      setTimeout(() => {
        setGenMindmapLoading(false);
        const n = scenes.filter((s) => s.type === 'mindmap').length + 1;
        const newSceneId = 'mm_extra_' + Date.now();
        const newScenes: Scene[] = [
          ...scenes,
          { id: newSceneId, type: 'mindmap', title: `Sơ đồ tư duy bổ sung #${n}` },
        ];
        NARRATIONS[newSceneId] = 'Đây là sơ đồ tư duy bổ sung do AI Teacher vừa tạo thêm cho bạn.';
        setScenes(newScenes);
        setCurrent(newScenes.length - 1);
      }, 1400);
    } else {
      setGenQuizLoading(true);
      setTimeout(() => {
        setGenQuizLoading(false);
        const n = scenes.filter((s) => s.type === 'quiz').length + 1;
        const newSceneId = 'quiz_extra_' + Date.now();
        const newScenes: Scene[] = [
          ...scenes,
          { id: newSceneId, type: 'quiz', title: `Bài tập bổ sung #${n}` },
        ];
        NARRATIONS[newSceneId] = 'AI Teacher vừa tạo thêm một bộ bài tập mới để bạn luyện tập thêm.';
        setScenes(newScenes);
        setCurrent(newScenes.length - 1);
      }, 1400);
    }
  };

  // Static thumbnail generator
  const getMiniSceneBody = (s: Scene) => {
    switch (s.type) {
      case 'slide':
        return (
          <div style={{ padding: '34px 40px' }}>
            <div className="slide-index" style={{ fontSize: '40px', color: '#eef0f6' }}>
              {s.id === 's0' ? '01' : '04'}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#181b2e' }}>
              {s.id === 's0' ? 'Welcome to Python' : 'Control Flow Basics'}
            </h1>
            <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
            <div className="card-row" style={{ gap: '10px' }}>
              <div className="info-card" style={{ padding: '10px 8px' }}>
                <h3 style={{ fontSize: '12px', margin: '0 0 4px' }}>
                  {s.id === 's0' ? 'What is Python?' : 'if / else'}
                </h3>
                <p style={{ fontSize: '10px', lineHeight: '1.3' }}>
                  {s.id === 's0' ? 'High-level, general-purpose language' : 'Rẽ nhánh dựa trên điều kiện đúng/sai'}
                </p>
              </div>
              <div className="info-card" style={{ padding: '10px 8px' }}>
                <h3 style={{ fontSize: '12px', margin: '0 0 4px' }}>
                  {s.id === 's0' ? 'Why Learn It?' : 'for loop'}
                </h3>
                <p style={{ fontSize: '10px', lineHeight: '1.3' }}>
                  {s.id === 's0' ? 'Simple syntax, huge library' : 'Lặp qua từng phần tử của một tập hợp'}
                </p>
              </div>
              <div className="info-card" style={{ padding: '10px 8px' }}>
                <h3 style={{ fontSize: '12px', margin: '0 0 4px' }}>
                  {s.id === 's0' ? 'How It Works' : 'while loop'}
                </h3>
                <p style={{ fontSize: '10px', lineHeight: '1.3' }}>
                  {s.id === 's0' ? 'Interpreted language line-by-line' : 'Lặp lại khi điều kiện còn đúng'}
                </p>
              </div>
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="code-slide" style={{ position: 'absolute', inset: 0, padding: '34px 40px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#fff' }}>
              Your First Line of Code
            </h1>
            <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
            <div className="code-editor" style={{ padding: '10px 14px', fontSize: '12px' }}>
              <span className="f">print</span>(<span className="s">"Hello, World!"</span>)
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div style={{ padding: '34px 40px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#181b2e' }}>
              Variables as Containers
            </h1>
            <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
            <div className="dash-grid" style={{ gap: '10px' }}>
              <div className="dash-panel" style={{ padding: '10px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '11px' }}>Điều chỉnh biến</h4>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>age = 25<br />score = 80<br />level = 3</div>
              </div>
              <div className="dash-panel" style={{ padding: '10px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '11px' }}>Trực quan hoá</h4>
                <div className="dash-bars" style={{ height: '50px', gap: '6px' }}>
                  <div className="dash-bar" style={{ height: '25%' }}></div>
                  <div className="dash-bar" style={{ height: '80%' }}></div>
                  <div className="dash-bar" style={{ height: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'mindmap':
        return (
          <div style={{ padding: '28px 34px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#181b2e' }}>
              Control Flow Map
            </h1>
            <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
              {['if / else', 'for loop', 'while loop'].map((name) => (
                <div key={name} className="mmtree-node depth-1" style={{ position: 'static', fontSize: '11px', padding: '6px 10px' }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        );
      case 'quiz':
        return (
          <div className="quiz-slide" style={{ padding: '34px 40px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#181b2e' }}>
              {s.title}
            </h1>
            <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
            <p style={{ fontSize: '12px', color: '#42465a', margin: 0 }}>{QUIZ_BANK[0].q}</p>
            <div className="quiz-opt" style={{ pointerEvents: 'none', padding: '6px 10px', fontSize: '11px', margin: '6px 0 0' }}>
              {QUIZ_BANK[0].opts[1]}
            </div>
          </div>
        );
      case 'game':
        return (
          <div className="game-slide" style={{ padding: '34px 40px', position: 'absolute', inset: 0 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#fff' }}>
              {s.title}
            </h1>
            <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
            <div className="game-area" style={{ padding: '10px', minHeight: '60px' }}>
              <div className="chip-pool" style={{ gap: '6px' }}>
                {GAME_CHIPS.map((c, ci) => (
                  <div key={ci} className="drag-chip" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <h1>{s.title}</h1>;
    }
  };

  // Thumbnail scaling effect
  useEffect(() => {
    if (!appVisible) return;
    const newPainted: Record<string, boolean> = {};
    scenes.forEach((s) => {
      const holder = document.getElementById('thumb-' + s.id);
      if (!holder) return;
      newPainted[s.id] = true;
      holder.style.width = '1000px';
      holder.style.height = '625px';
      holder.style.transformOrigin = 'top left';
      const parent = holder.parentElement;
      if (parent) {
        const scale = parent.clientWidth / 1000;
        holder.style.transform = `scale(${scale})`;
      }
    });
    setThumbnailsPainted(newPainted);
  }, [appVisible, scenes, current]);

  // Master render dispatch for stage view
  const renderSceneBody = (s: Scene) => {
    switch (s.type) {
      case 'slide':
        if (s.sessionIndex !== undefined && sessionData[s.sessionIndex]) {
          const data = sessionData[s.sessionIndex] as SlideOutput;

          // Slide gốc người dùng đã upload: hiển thị ĐÚNG ảnh gốc, không vẽ lại nội dung.
          // focusedBbox (toạ độ gốc theo trang PDF) được quy đổi sang % để khoanh đúng vị trí
          // agent đang thuyết trình tới, bất kể ảnh được scale theo kích thước màn hình nào.
          if (data.bg_image && data.page_width && data.page_height) {
            const [fl, ft, fr, fb] = focusedBbox || [0, 0, 0, 0];
            return (
              <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: `${data.page_width} / ${data.page_height}`,
                    borderRadius: 10,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    background: '#fff',
                  }}
                >
                  <img
                    src={`data:image/png;base64,${data.bg_image}`}
                    alt={data.title}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />
                  {narrationSpeaking && focusedBbox && (
                    // box-shadow lan rộng ra ngoài chính khung này tạo hiệu ứng "spotlight":
                    // toàn bộ phần còn lại của slide bị tối màu (overlay), chỉ riêng vùng agent
                    // đang nhắc tới được giữ sáng nguyên vẹn.
                    <div
                      className="slide-spotlight-box"
                      style={{
                        left: `${(fl / data.page_width) * 100}%`,
                        top: `${(ft / data.page_height) * 100}%`,
                        width: `${((fr - fl) / data.page_width) * 100}%`,
                        height: `${((fb - ft) / data.page_height) * 100}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          }

          // Fallback: block được sinh riêng lẻ (không qua pipeline upload PDF) nên không có
          // ảnh slide gốc để hiển thị -> hiện tạm tiêu đề/summary.
          return (
            <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
              <h1>{data.title}</h1>
              <div className="slide-underline"></div>
              <p style={{ fontSize: '14px', color: '#42465a' }}>{data.summary}</p>
            </div>
          );
        }
        if (s.id === 's0') {
          return (
            <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
              <div className="slide-index">01</div>
              <h1>Welcome to Python</h1>
              <div className="slide-underline"></div>
              <div className="card-row">
                <div className="info-card">
                  <h3>What is Python?</h3>
                  <p>High-level, general-purpose language focused on readability</p>
                </div>
                <div className="info-card">
                  <h3>Why Learn It?</h3>
                  <p>Simple syntax, huge library, used in AI and Data Science</p>
                </div>
                <div className="info-card">
                  <h3>How It Works</h3>
                  <p>Interpreted language: executes code line-by-line</p>
                </div>
              </div>
              <div className="exec-label">Execution Logic:</div>
              <div className="exec-row">
                <div className="exec-box gray">Compiled (Source → Machine)</div>
                <div className="exec-arrow"></div>
                <div className="exec-box green">Interpreted (Line by Line)</div>
              </div>
            </div>
          );
        }
        return (
          <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
            <div className="slide-index">04</div>
            <h1>Control Flow Basics</h1>
            <div className="slide-underline"></div>
            <div className="card-row">
              <div className="info-card">
                <h3>if / else</h3>
                <p>Rẽ nhánh dựa trên điều kiện đúng/sai</p>
              </div>
              <div className="info-card">
                <h3>for loop</h3>
                <p>Lặp qua từng phần tử của một tập hợp</p>
              </div>
              <div className="info-card">
                <h3>while loop</h3>
                <p>Lặp lại khi điều kiện còn đúng</p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#42465a' }}>
              Control flow quyết định thứ tự thực thi của các câu lệnh trong chương trình.
            </p>
          </div>
        );
      case 'code':
        return (
          <div className="code-slide active" style={{ position: 'absolute', inset: 0, padding: '44px 56px', pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
            <div className="slide-index" style={{ color: '#eef0f6' }}>02</div>
            <h1>Your First Line of Code</h1>
            <div className="slide-underline" style={{ background: 'linear-gradient(90deg,#5b7cfa,#8a5cf6)' }}></div>
            <div className="code-editor">
              <span className="f">print</span>(<span className="s">"Hello, World!"</span>)
            </div>
            <button className="try-btn" onClick={runCode}>
              ▶ Run Code
            </button>
            <div className="console" id="consoleOut">
              {consoleText}
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
            <div className="slide-index">03</div>
            <div className="dash-slide">
              <h1>Variables as Containers</h1>
              <div className="slide-underline"></div>
              <p style={{ fontSize: '13.5px', color: '#42465a', maxWidth: '640px', lineHeight: 1.6, marginBottom: '14px' }}>
                Một biến giống như một chiếc hộp có nhãn dùng để lưu dữ liệu. Thử chỉnh các giá trị bên dưới và xem kết quả thay đổi trực tiếp.
              </p>
              <div className="dash-grid">
                <div className="dash-panel">
                  <h4>Điều chỉnh biến</h4>
                  <div className="dash-row">
                    <label>age =</label>
                    <input
                      type="range"
                      className="dash-slider"
                      min="1"
                      max="100"
                      value={dashAge}
                      onChange={(e) => setDashAge(Number(e.target.value))}
                    />
                    <span className="dash-val">{dashAge}</span>
                  </div>
                  <div className="dash-row">
                    <label>score =</label>
                    <input
                      type="range"
                      className="dash-slider"
                      min="0"
                      max="100"
                      value={dashScore}
                      onChange={(e) => setDashScore(Number(e.target.value))}
                    />
                    <span className="dash-val">{dashScore}</span>
                  </div>
                  <div className="dash-row">
                    <label>level =</label>
                    <input
                      type="range"
                      className="dash-slider"
                      min="1"
                      max="10"
                      value={dashLevel}
                      onChange={(e) => setDashLevel(Number(e.target.value))}
                    />
                    <span className="dash-val">{dashLevel}</span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: '#2b2f3d',
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '10px',
                      marginTop: '8px',
                    }}
                  >
                    age = {dashAge}
                    <br />
                    score = {dashScore}
                    <br />
                    level = {dashLevel}
                  </p>
                </div>
                <div className="dash-panel">
                  <h4>Trực quan hoá</h4>
                  <div className="dash-bars">
                    <div className="dash-bar" style={{ height: `${dashAge}%` }}>
                      <span>age</span>
                    </div>
                    <div className="dash-bar" style={{ height: `${dashScore}%` }}>
                      <span>score</span>
                    </div>
                    <div className="dash-bar" style={{ height: `${dashLevel * 10}%` }}>
                      <span>level</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'mindmap': {
        const mmData =
          s.sessionIndex !== undefined && sessionData[s.sessionIndex]
            ? sessionData[s.sessionIndex] as MindmapOutput
            : null;
        return (
          <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)', overflow: 'hidden' }}>
            <div className="mindmap-slide" style={{ position: 'absolute', inset: 0, padding: '36px 44px' }}>
              <h1 style={{ fontSize: '26px' }}>{mmData ? `${mmData.root_label} Map` : 'The Logic Flowchart'}</h1>
              <div className="slide-underline" style={{ margin: '10px 0 6px' }}></div>
              <MindmapTree rootLabel={mmData?.root_label || 'Control Flow'} nodes={mmData?.nodes || []} />
            </div>
          </div>
        );
      }
      case 'animation': {
        if (s.sessionIndex !== undefined && sessionData[s.sessionIndex]) {
          const data = sessionData[s.sessionIndex] as AnimationOutput;
          return (
            <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
              <h1>{data.title}</h1>
              <div className="slide-underline"></div>
              {data.html ? (
                <iframe
                  title={`animation-${data.index}`}
                  srcDoc={buildAnimationSrcDoc(data.html)}
                  sandbox="allow-scripts"
                  style={{ width: '100%', height: '420px', border: 'none', marginTop: '14px', borderRadius: '12px', background: '#fff' }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                  {[...data.steps]
                    .sort((a, b) => a.order - b.order)
                    .map((step) => (
                      <div key={step.order} className="info-card" style={{ padding: '12px 16px' }}>
                        <h3>
                          {step.order}. {step.label}
                        </h3>
                        <p>{step.description}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        }
        return <h1>{s.title}</h1>;
      }
      case 'quiz': {
        const genData = s.sessionIndex !== undefined ? (sessionData[s.sessionIndex] as QuizOutput | undefined) : undefined;
        if (genData) {
          const runtime = quizRuntime[s.sessionIndex!] || { selected: null, answered: false };
          return (
            <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
              <div className="slide-index">Q</div>
              <div className="quiz-slide">
                <h1>{genData.question}</h1>
                <div className="slide-underline"></div>
                {genData.options.map((opt) => {
                  let optClass = 'quiz-opt';
                  if (runtime.answered) {
                    if (opt.key === genData.correct_answer) optClass += ' correct';
                    else if (opt.key === runtime.selected) optClass += ' wrong';
                  }
                  return (
                    <button
                      key={opt.key}
                      className={optClass}
                      onClick={() => answerGeneratedQuiz(s.sessionIndex!, opt.key)}
                      style={{ pointerEvents: runtime.answered ? 'none' : 'auto' }}
                    >
                      {opt.key}. {opt.text}
                    </button>
                  );
                })}
                {runtime.answered && (
                  <div className={runtime.selected === genData.correct_answer ? 'quiz-feedback show ok' : 'quiz-feedback show no'}>
                    {runtime.selected === genData.correct_answer ? '✓ Chính xác! ' : '✗ Chưa đúng. '}
                    {genData.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        }
        return (
          <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
            <div className="slide-index">Q</div>
            <div className="quiz-slide">
              <h1>Conditional Coding Challenge</h1>
              <div className="slide-underline"></div>
              <div className="quiz-progress">
                {QUIZ_BANK.map((_, i) => {
                  let cls = 'qp-dot';
                  if (i === quizIdx) cls += ' qp-current';
                  else if (i < quizIdx) cls += ' qp-answered';
                  return <div key={i} className={cls}></div>;
                })}
              </div>

              {!quizCompleted ? (
                <div>
                  <p style={{ fontSize: '15px', color: '#42465a', marginBottom: '16px' }}>
                    Câu {quizIdx + 1}/{QUIZ_BANK.length}: {QUIZ_BANK[quizIdx].q}
                  </p>
                  {QUIZ_BANK[quizIdx].opts.map((o, i) => {
                    let optClass = 'quiz-opt';
                    if (quizAnswered) {
                      if (i === QUIZ_BANK[quizIdx].correct) optClass += ' correct';
                      else if (i === quizSelection) optClass += ' wrong';
                    }
                    return (
                      <button
                        key={i}
                        className={optClass}
                        onClick={() => answerQuiz(i)}
                        style={{ pointerEvents: quizAnswered ? 'none' : 'auto' }}
                      >
                        {o}
                      </button>
                    );
                  })}
                  {quizFeedback && <div className={quizFeedbackClass}>{quizFeedback}</div>}
                  {quizAnswered && (
                    <button className="quiz-next-btn show" onClick={nextQuiz}>
                      {quizIdx < QUIZ_BANK.length - 1
                        ? 'Câu tiếp theo →'
                        : `Xem kết quả (${quizScore}/${QUIZ_BANK.length}) ✓`}
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎉</div>
                  <h3 style={{ margin: '0 0 6px' }}>Hoàn thành!</h3>
                  <p style={{ color: '#42465a' }}>
                    Bạn trả lời đúng {quizScore}/{QUIZ_BANK.length} câu.
                  </p>
                  <button
                    className="try-btn"
                    onClick={() => {
                      setQuizIdx(0);
                      setQuizAnswered(false);
                      setQuizScore(0);
                      setQuizSelection(null);
                      setQuizFeedback('');
                      setQuizCompleted(false);
                    }}
                  >
                    Làm lại
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      }
      case 'game':
        return (
          <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
            <div className="slide-index" style={{ color: '#3a4152' }}>G</div>
            <div className="game-slide" style={{ position: 'absolute', inset: 0, padding: '36px 48px' }}>
              <h1>Looping Logic Lab</h1>
              <div className="slide-underline" style={{ background: 'linear-gradient(90deg,#5b7cfa,#8a5cf6)' }}></div>
              <p style={{ fontSize: '13px', color: '#8b96b5', marginBottom: '6px' }}>
                Bấm các khối lệnh vào đúng thứ tự để tạo một vòng lặp for hợp lệ:
              </p>
              <div className="game-area">
                <div className={`drop-zone ${gameOrder.length > 0 ? 'filled' : ''}`}>
                  {gameOrder.length > 0 ? (
                    gameOrder.map((i) => <span key={i}>{GAME_CHIPS[i]}</span>)
                  ) : (
                    <span style={{ color: '#5a6588' }}>
                      Bấm vào các khối bên dưới để thêm vào đây theo thứ tự…
                    </span>
                  )}
                </div>
                <div className="chip-pool">
                  {GAME_CHIPS.map((c, i) => {
                    const used = gameOrder.includes(i);
                    return (
                      <div
                        key={i}
                        className={`drag-chip ${used ? 'used' : ''}`}
                        onClick={() => pickChip(i)}
                        style={{ pointerEvents: used ? 'none' : 'auto' }}
                      >
                        {c}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button className="game-check-btn" onClick={checkGame}>
                Kiểm tra
              </button>
              {gameResult && <div className={gameResultClass}>{gameResult}</div>}
            </div>
          </div>
        );
      default:
        return <h1>{s.title}</h1>;
    }
  };

  const progressPct = Math.round(((current + 1) / scenes.length) * 100);

  return (
    <>
      {/* ===== START SCREEN ===== */}
      {startScreenVisible && (
        <div id="startScreen" className={startScreenHidden ? 'hidden' : ''}>
          <div className="start-card">
            <div className="start-brand">
              <span className="logo">◆</span>
              <span className="name">50s</span>
            </div>
            <h1 className="start-title">Tải lên slide bài học</h1>
            <p className="start-sub">
              Chọn file slide (PowerPoint, PDF hoặc hình ảnh) để AI Teacher chuyển thành bài giảng tương tác kèm giọng đọc, sơ đồ tư duy và bài tập.
            </p>

            <div
              id="dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dz-icon">📤</div>
              <div className="dz-title">Kéo thả file vào đây, hoặc bấm để chọn</div>
              <div className="dz-sub">Tối đa 50MB</div>
              <div className="dz-formats">
                <span className="dz-tag">.pptx</span>
                <span className="dz-tag">.pdf</span>
                <span className="dz-tag">.png / .jpg</span>
              </div>
            </div>
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef}
              accept=".pptx,.ppt,.pdf,.png,.jpg,.jpeg"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {selectedFile && (
              <div id="fileCard" className="show">
                <div className="fc-icon">📄</div>
                <div className="fc-info">
                  <div className="fc-name" id="fcName">
                    {selectedFile.name}
                  </div>
                  <div className="fc-size" id="fcSize">
                    {selectedFile.size < 1024
                      ? selectedFile.size + ' B'
                      : selectedFile.size < 1024 * 1024
                        ? (selectedFile.size / 1024).toFixed(1) + ' KB'
                        : (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB'}
                  </div>
                </div>
                <button className="fc-remove" onClick={removeFile}>
                  ✕
                </button>
              </div>
            )}

            {uploadProgressVisible && (
              <div id="uploadProgress" className="show">
                <div id="uploadProgressFill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}

            {startBtnReady && outline.length > 0 && (
              <div className="outline-preview">
                <div className="outline-preview-title">
                  Dàn ý bài học được tạo ra ({outline.length} phần)
                </div>
                <div className="outline-preview-list">
                  {outline.map((item) => (
                    <div key={item.index} className="outline-preview-item">
                      <span className="outline-item-icon">
                        {OUTLINE_TYPE_ICONS[item.type] || '•'}
                      </span>
                      <div className="outline-item-body">
                        <div className="outline-item-meta">
                          Phần {item.index + 1} · {item.type}
                        </div>
                        <div className="outline-item-content">{item.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className={`start-btn ${startBtnReady ? 'ready' : ''}`}
              id="startBtn"
              onClick={() => startCourse()}
              style={{ pointerEvents: startBtnReady ? 'auto' : 'none' }}
            >
              {startBtnReady && outline.length > 0 ? 'Xác nhận dàn ý →' : 'Bắt đầu học →'}
            </button>

            <div className="start-skip">
              <a onClick={() => startCourse(true)}>Dùng slide mẫu, bỏ qua tải lên</a>
            </div>
          </div>
        </div>
      )}

      {/* ===== LOADING SCREEN ===== */}
      {loadingScreenVisible && (
        <div id="loadingScreen" className={`visible ${loadingScreenOpacity ? 'show-opacity' : ''}`}>
          <div className="loading-card">
            <div className="loading-spinner">
              <div className="spin-ring"></div>
              <span className="spin-icon">🤖</span>
            </div>
            <h2 className="loading-title">AI Teacher đang chuẩn bị bài học...</h2>
            <p className="loading-sub" id="loadingSub">
              {loadingSub}
            </p>

            <div className="loading-steps" id="loadingSteps">
              {loadingStepLabels.map((label, i) => {
                let stepClass = 'lstep';
                let statusText = '○';
                if (stepStatuses[i] === 'active') {
                  stepClass += ' active';
                } else if (stepStatuses[i] === 'done') {
                  stepClass += ' done';
                  statusText = '✓';
                }
                return (
                  <div key={i} className={stepClass}>
                    <span className="lstep-icon">•</span>
                    <span className="lstep-label">{label}</span>
                    <span className="lstep-status">{statusText}</span>
                  </div>
                );
              })}
            </div>

            <div className="loading-progress">
              <div className="loading-progress-fill" id="loadingProgressFill" style={{ width: `${loadingPct}%` }}></div>
            </div>
            <div className="loading-pct" id="loadingPct">
              {loadingPct}%
            </div>
          </div>
        </div>
      )}

      {/* ===== APP INTERFACE ===== */}
      {appVisible && (
        <div id="app" className="visible">
          {/* SIDEBAR */}
          <div id="sidebar">
            <div className="brand">
              <span className="logo">◆</span> 50s
              <span className="collapse-btn" title="Thu gọn">
                ⟨⟩
              </span>
            </div>
            <div className="scene-list" id="sceneList">
              <div className="course-meta">
                <div className="name">{courseName}</div>
                <div className="course-progress-bar">
                  <div className="course-progress-fill" style={{ width: `${progressPct}%` }}></div>
                </div>
                <div className="pct">{progressPct}% hoàn thành</div>
              </div>
              <div id="sceneEntries">
                {scenes.map((s, i) => {
                  const meta = SCENE_TYPES[s.type] || { label: 'Scene', icon: '•' };
                  const isActive = i === current;
                  const isDone = i < current;
                  return (
                    <div
                      key={s.id}
                      className={`scene-entry ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                      onClick={() => goTo(i)}
                    >
                      <div className="scene-entry-head">
                        <div className="scene-num">{i + 1}</div>
                        <span className="scene-type-icon">{meta.icon}</span>
                        <div className="scene-name">{s.title}</div>
                      </div>
                      <div className="scene-thumb">
                        <div className="scene-thumb-inner" id={`thumb-${s.id}`}>
                          <div style={{ width: '100%', height: '100%', position: 'relative', background: '#fff' }}>
                            {getMiniSceneBody(s)}
                          </div>
                        </div>
                        <div className="scene-thumb-badge">{meta.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="sidebar-actions">
              <button
                className={`gen-more-btn ${genMindmapLoading ? 'loading' : ''}`}
                id="genMindmapBtn"
                onClick={() => requestGenerate('mindmap')}
              >
                <span className="gm-icon">🧠</span>
                <span className="spin-mini"></span>
                <span>AI tạo thêm sơ đồ tư duy</span>
              </button>
              <button
                className={`gen-more-btn ${genQuizLoading ? 'loading' : ''}`}
                id="genQuizBtn"
                onClick={() => requestGenerate('quiz')}
              >
                <span className="gm-icon">📝</span>
                <span className="spin-mini"></span>
                <span>AI tạo thêm bài tập</span>
              </button>
            </div>
          </div>

          {/* MAIN VIEW */}
          <div id="main">
            <div id="topbar">
              <div className="left">
                <div className="back-btn" onClick={() => goTo(0)}>
                  ←
                </div>
                <div>
                  <div className="scene-label">
                    {SCENE_TYPES[scenes[current].type]?.label || 'Scene'}
                  </div>
                  <div className="scene-title">{scenes[current].title}</div>
                </div>
              </div>
              <div className="right">
                <div className="lang-pill">EN</div>
                <div className="icon-btn">🌙</div>
                <div className="icon-btn">⚙</div>
                <div className="icon-btn">⬇</div>
              </div>
            </div>

            <div id="stage-wrap">
              <div className="stage-side-arrow left" onClick={prevSlide}>
                ‹
              </div>
              <div id="stage">{renderSceneBody(scenes[current])}</div>
              <div className="stage-side-arrow right" onClick={nextSlide}>
                ›
              </div>
            </div>

            {/* BOTTOM BAR */}
            <div id="bottombar">
              <div id="transport">
                <div className="t-left">
                  <button className="t-btn" title="Danh sách slide">
                    ☰
                  </button>
                  <span id="slideCounter">
                    {current + 1} / {scenes.length}
                  </span>
                </div>
                <div className="t-center">
                  <button className="t-btn" title="Âm thanh" onClick={toggleMute}>
                    {muted ? '🔇' : '🔊'}
                  </button>
                  <span
                    id="speedLabel"
                    onClick={cycleSpeed}
                    style={{ cursor: 'pointer', fontWeight: 600 }}
                  >
                    {playSpeed}x
                  </span>
                  <div className="divider"></div>
                  <button className="t-btn" onClick={prevSlide}>
                    ◀
                  </button>
                  <button className="t-btn play-main" onClick={() => togglePlay()}>
                    {playing ? '⏸' : '▶'}
                  </button>
                  <button className="t-btn" onClick={nextSlide}>
                    ▶
                  </button>
                  <div className="divider"></div>
                  <button
                    className="t-btn"
                    title="Lặp lại"
                    onClick={toggleLoop}
                    style={{ color: loopEnabled ? 'var(--accent)' : 'var(--ink-dim)' }}
                  >
                    🔁
                  </button>
                  <button
                    className="t-btn"
                    title="Ghi chú / vẽ"
                    onClick={toggleAnnotate}
                    style={{
                      background: annotating ? 'var(--accent)' : 'transparent',
                      color: annotating ? '#fff' : 'var(--ink-dim)',
                    }}
                  >
                    ✏️
                  </button>
                </div>
                <div className="t-right">
                  <button className="t-btn" title="Toàn màn hình" onClick={toggleFullscreen}>
                    ⛶
                  </button>
                  <button className="t-btn" title="Ẩn/hiện chat" onClick={() => toggleChatBox()}>
                    💬
                  </button>
                </div>
              </div>

              {/* AGENT ROW */}
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
                        <div id="narrationText">
                          {getNarrationText(scenes[current])}
                        </div>
                        <div
                          className={`msg-play ${narrationSpeaking ? 'speaking' : ''}`}
                          id="narrationPlayBtn"
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
                  <div className="peer-stack" title="Bạn học cùng lớp">
                    {DEBATE_AGENTS.map((p, pi) => (
                      <div
                        key={pi}
                        className="peer-wrap"
                        style={{ '--msg-color': AGENT_COLORS[p.id] } as React.CSSProperties}
                      >
                        <div className="peer">{p.initial}</div>
                        <div className="peer-card">
                          <div className="pc-head">
                            <div className="pc-avatar">{p.initial}</div>
                            <div>
                              <div className="pc-name">{p.name}</div>
                              <span className="pc-role">{p.role}</span>
                            </div>
                          </div>
                          <div className="pc-desc">{p.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rail-actions">
                    <div className="rail-round mic" title="Bật/tắt micro">
                      🎙
                    </div>
                    <div
                      className={`rail-round ${discussionActive ? 'discussing' : ''}`}
                      id="chatToggleBtn"
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

                {/* FLOATING CHAT BOX */}
                <div id="floatingChatBox" className={chatBoxOpen ? 'open' : ''} onClick={(e) => e.stopPropagation()}>
                  <div id="floating-chat-header">
                    <span className="fc-header-title">
                      {discussionActive ? '🗣️ Thảo luận nhóm' : '💬 Nhắn tin với AI Teacher'}
                    </span>
                    <button
                      type="button"
                      className="fc-close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatBoxOpen(false);
                      }}
                      title="Đóng"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Debate mode banner - đặt NGOÀI vùng log có thể cuộn, luôn hiển thị cố
                      định phía trên suốt buổi thảo luận (không bị trôi mất khi có tin nhắn
                      mới), vì người dùng có thể chen tin nhắn mới vào bất kỳ lúc nào
                      (human-in-the-loop). Buổi thảo luận lặp lại liên tục cho tới khi người
                      dùng chủ động bấm "Kết thúc thảo luận". */}
                  {discussionActive && (
                    <div className="discussion-banner">
                      <span>
                        🗣️ Đang thảo luận: "{debateTopicRef.current}" — gõ để chen vào bất kỳ lúc nào
                      </span>
                      <button
                        type="button"
                        className="discussion-end-btn"
                        onClick={endDebate}
                        title="Kết thúc buổi thảo luận"
                      >
                        ⏹ Kết thúc
                      </button>
                    </div>
                  )}

                  <div id="floating-chat-log">
                    {chatLog.map((msg) => (
                      <div
                        key={msg.id}
                        className={`fmsg-row ${msg.role === 'user' ? 'user' : 'agent'}`}
                        style={{ '--msg-color': AGENT_COLORS[msg.agentId || ''] || 'var(--accent)' } as React.CSSProperties}
                      >
                        <div className="fmsg-avatar">{msg.avatar}</div>
                        <div className="fmsg-content">
                          {msg.role !== 'user' && <div className="fmsg-who">{msg.name}</div>}
                          <div className="fmsg-text-wrap">
                            {msg.agentId === 'note_taker' ? (
                              <ul className="fmsg-bubble fmsg-notes">
                                {msg.text
                                  .split('\n')
                                  .map((line) => line.replace(/^[-•]\s*/, '').trim())
                                  .filter(Boolean)
                                  .map((line, i) => (
                                    <li key={i}>{line}</li>
                                  ))}
                              </ul>
                            ) : (
                              <div className="fmsg-bubble">{msg.text}</div>
                            )}
                            {msg.showPlay && (
                              <div
                                className="fmsg-play"
                                onClick={(e) => speakFloating(e, msg.text)}
                                title="Nghe đọc"
                              >
                                ▶
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {typingIndicator && (
                      <div
                        className="fmsg-row agent"
                        style={{ '--msg-color': AGENT_COLORS[typingIndicator.agentId] || 'var(--accent)' } as React.CSSProperties}
                      >
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

                    <div ref={chatLogEndRef} />
                  </div>
                  {/* Input KHÔNG bị khoá khi discussionActive - người dùng có thể chen tin
                      nhắn vào bất kỳ lúc nào trong buổi thảo luận (human-in-the-loop). */}
                  <div id="floating-input-row">
                    <input
                      id="chat-input"
                      type="text"
                      placeholder={discussionActive ? 'Chen vào cuộc thảo luận...' : 'Nhắn tin cho AI Teacher...'}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') sendChat();
                      }}
                    />
                    <button id="send-btn" onClick={sendChat}>
                      ➤
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}