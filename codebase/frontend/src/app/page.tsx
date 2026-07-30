'use client';

import React, { useState, useEffect, useRef } from 'react';

// Interfaces for structured data
interface Scene {
  id: string;
  type: 'slide' | 'code' | 'dashboard' | 'mindmap' | 'quiz' | 'game';
  title: string;
}

interface Peer {
  initial: string;
  name: string;
  role: string;
  desc: string;
}

interface Message {
  id: string;
  role: 'user' | 'ai' | 'peer';
  text: string;
  avatar: string;
  name: string;
  showPlay?: boolean;
}

const SCENE_TYPES = {
  slide: { label: 'Slide', icon: '📑' },
  code: { label: 'Code', icon: '💻' },
  dashboard: { label: 'Tương tác', icon: '🎛️' },
  mindmap: { label: 'Sơ đồ tư duy', icon: '🧠' },
  quiz: { label: 'Bài tập', icon: '📝' },
  game: { label: 'Trò chơi', icon: '🎮' },
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

const PEERS: Peer[] = [
  { initial: '🙂', name: 'Curious Mind', role: 'Student', desc: 'Always curious, loves asking why and how' },
  { initial: '🤓', name: 'Logic Master', role: 'Student', desc: 'Thinks in patterns, enjoys solving step by step' },
  { initial: '✨', name: 'Bright Spark', role: 'Student', desc: 'Quick to try things out, learns by experimenting' },
];

const DISCUSSION_TEMPLATES: Record<string, (t: string) => string[]> = {
  'Curious Mind': (t: string) => [
    `Mình tò mò là tại sao "${t}" lại quan trọng trong bài học này nhỉ?`,
    `Cho hỏi thêm, "${t}" có liên quan gì tới biến hay vòng lặp không?`,
    `Có ví dụ thực tế nào cho "${t}" không, mình muốn thử ngay!`
  ],
  'Logic Master': (t: string) => [
    `Theo mình hiểu, "${t}" hoạt động rất logic nếu chia nhỏ từng bước.`,
    `Nếu áp dụng "${t}" vào bài tập trước thì kết quả sẽ khác đấy.`,
    `Mình nghĩ nên viết ra sơ đồ để dễ hình dung "${t}" hơn.`
  ],
  'Bright Spark': (t: string) => [
    `Để mình thử code nhanh với "${t}" xem sao!`,
    `Mình vừa thử nghiệm liên quan tới "${t}" và thấy khá hay ho.`,
    `"${t}" làm mình nhớ tới một bài tập mình từng làm trước đây.`
  ]
};

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

  // Loading animation state
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [loadingPct, setLoadingPct] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<('pending' | 'active' | 'done')[]>(
    new Array(LOADING_STEPS.length).fill('pending')
  );
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

  // Chat and Discussion state
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const [msgBadge, setMsgBadge] = useState<number | null>(null);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [discussionActive, setDiscussionActive] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState<{ name: string; avatar: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatLogEndRef = useRef<HTMLDivElement>(null);
  const mindmapCanvasRef = useRef<HTMLDivElement>(null);

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

  // Handle automatic slide playing
  useEffect(() => {
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    if (playing) {
      playTimerRef.current = setInterval(() => {
        nextSlide();
      }, 3000 / playSpeed);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [playing, current, playSpeed, scenes.length]);

  // Update narration when slide changes
  useEffect(() => {
    stopNarration();
  }, [current]);

  // Scroll chat to bottom
  useEffect(() => {
    chatLogEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, typingIndicator]);

  // Trigger mindmap build
  useEffect(() => {
    if (scenes[current]?.type === 'mindmap') {
      // Small timeout to wait for react container mounting
      const timer = setTimeout(buildMindmap, 50);
      return () => clearTimeout(timer);
    }
  }, [current, scenes]);

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

  const processFile = (file: File) => {
    setSelectedFile(file);
    setUploadProgressVisible(true);
    setUploadProgress(0);
    setStartBtnReady(false);

    let pct = 0;
    const timer = setInterval(() => {
      pct += Math.random() * 22 + 8;
      if (pct >= 100) {
        pct = 100;
        clearInterval(timer);
        setStartBtnReady(true);
      }
      setUploadProgress(pct);
    }, 180);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadProgressVisible(false);
    setUploadProgress(0);
    setStartBtnReady(false);
  };

  const startCourse = (skip = false) => {
    if (!skip && !startBtnReady) return;
    setStartScreenHidden(true);
    setTimeout(() => {
      setStartScreenVisible(false);
      runGeneratingSequence();
    }, 350);
  };

  const runGeneratingSequence = () => {
    setLoadingScreenVisible(true);
    setTimeout(() => setLoadingScreenOpacity(true), 50);

    let stepIdx = 0;
    let pct = 0;

    const runStep = () => {
      if (stepIdx >= LOADING_STEPS.length) {
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

  const togglePlay = (force?: boolean) => {
    const nextPlay = force !== undefined ? force : !playing;
    setPlaying(nextPlay);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const currentSpeedIdx = speeds.indexOf(playSpeed);
    const nextIdx = (currentSpeedIdx + 1) % speeds.length;
    setPlaySpeed(speeds[nextIdx]);
  };

  const toggleMute = () => {
    setMuted(!muted);
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
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Narration (TTS) Toggle
  const toggleNarration = () => {
    narrationSpeaking ? stopNarration() : startNarration();
  };

  const startNarration = () => {
    setNarrationSpeaking(true);
    if (speechTimer) clearTimeout(speechTimer);

    const activeScene = scenes[current];
    const text = NARRATIONS[activeScene.id] || '';
    const duration = Math.min(6000, 1500 + text.length * 40);

    const timer = setTimeout(stopNarration, duration);
    setSpeechTimer(timer);
  };

  const stopNarration = () => {
    setNarrationSpeaking(false);
    if (speechTimer) {
      clearTimeout(speechTimer);
      setSpeechTimer(null);
    }
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

  // Mindmap generation helper
  const buildMindmap = () => {
    const canvas = mindmapCanvasRef.current;
    if (!canvas) return;
    canvas.innerHTML = '';
    const w = canvas.clientWidth || 880;
    const h = canvas.clientHeight || 380;
    const cx = w / 2;
    const cy = h / 2;

    // Helper functions inside useEffect to paint directly to DOM ref
    const addMMNode = (text: string, x: number, y: number, cls: string) => {
      const el = document.createElement('div');
      el.className = 'mm-node ' + cls;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.textContent = text;
      canvas.appendChild(el);
    };

    const addMMLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const el = document.createElement('div');
      el.className = 'mm-line';
      el.style.left = x1 + 'px';
      el.style.top = y1 + 'px';
      el.style.width = len + 'px';
      el.style.background = color;
      el.style.transform = `rotate(${angle}deg)`;
      canvas.appendChild(el);
    };

    addMMNode(mindmapData.root, cx, cy, 'root');

    const branchR = Math.min(w, h) * 0.32;
    mindmapData.branches.forEach((b) => {
      const rad = (b.angle * Math.PI) / 180;
      const bx = cx + Math.cos(rad) * branchR * 1.3;
      const by = cy + Math.sin(rad) * branchR * 0.62 + 40;
      addMMLine(cx, cy, bx, by, '#a9b8ea');
      addMMNode(b.name, bx, by, 'branch');

      const leafR = 130;
      b.leaves.forEach((leaf, li) => {
        const leafAngle = rad + (li === 0 ? -0.42 : 0.42);
        const lx = bx + Math.cos(leafAngle) * leafR;
        const ly = by + Math.sin(leafAngle) * leafR * 0.75 + 46;
        addMMLine(bx, by, lx, ly, '#dbe0f2');
        addMMNode(leaf, lx, ly, 'leaf');
      });
    });
  };

  // Mindmap data structure
  const mindmapData = {
    root: 'Control Flow',
    branches: [
      { name: 'if / else', angle: -55, leaves: ['Điều kiện đúng/sai', 'Rẽ nhánh chương trình'] },
      { name: 'for loop', angle: 5, leaves: ['Lặp qua tập hợp', 'range(), list, string'] },
      { name: 'while loop', angle: 65, leaves: ['Lặp khi còn đúng', 'Cẩn thận vòng lặp vô hạn'] },
    ],
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

  // Chat message send and peer discussion simulation
  const sendChat = () => {
    if (discussionActive || !chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');

    // Append user message
    const userMsgObj: Message = {
      id: 'chat_' + Date.now() + '_user',
      role: 'user',
      text: userMsg,
      avatar: '🧑',
      name: 'Bạn',
    };
    setChatLog((prev) => [...prev, userMsgObj]);

    // Start class discussion sequence
    setDiscussionActive(true);

    let round = 0;

    const nextTurn = () => {
      if (round >= PEERS.length) {
        // AI teacher final wrap-up
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

    // First timeout to start class conversation after user prints
    setTimeout(nextTurn, 400);
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
              {mindmapData.root} Map
            </h1>
            <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
              {mindmapData.branches.map((b, bi) => (
                <div key={bi} className="mm-node branch" style={{ position: 'static', transform: 'none', fontSize: '11px', padding: '6px 10px' }}>
                  {b.name}
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
      case 'mindmap':
        return (
          <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)', overflow: 'hidden' }}>
            <div className="mindmap-slide" style={{ position: 'absolute', inset: 0, padding: '36px 44px' }}>
              <h1 style={{ fontSize: '26px' }}>The Logic Flowchart</h1>
              <div className="slide-underline" style={{ margin: '10px 0 6px' }}></div>
              <div className="mindmap-canvas" ref={mindmapCanvasRef}></div>
            </div>
          </div>
        );
      case 'quiz':
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
              <span className="name">OpenMAIC</span>
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

            <button
              className={`start-btn ${startBtnReady ? 'ready' : ''}`}
              id="startBtn"
              onClick={() => startCourse()}
              style={{ pointerEvents: startBtnReady ? 'auto' : 'none' }}
            >
              Bắt đầu học →
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
              {LOADING_STEPS.map((st, i) => {
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
                    <span className="lstep-label">{st.label}</span>
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
              <span className="logo">◆</span> OpenMAIC
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
                          {NARRATIONS[scenes[current].id] || '…'}
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
                    {PEERS.map((p, pi) => (
                      <div key={pi} className="peer-wrap">
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
                  <div id="floating-chat-log">
                    {chatLog.map((msg) => (
                      <div
                        key={msg.id}
                        className={`fmsg-row ${msg.role === 'user' ? 'user' : 'agent'}`}
                      >
                        <div className="fmsg-avatar">{msg.avatar}</div>
                        <div className="fmsg-content">
                          {msg.role !== 'user' && <div className="fmsg-who">{msg.name}</div>}
                          <div className="fmsg-text-wrap">
                            <div className={msg.role === 'user' ? 'fmsg-bubble' : 'fmsg-bubble'}>
                              {msg.text}
                            </div>
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

                    {/* Class discussion banner */}
                    {discussionActive && chatLog.length > 0 && chatLog[chatLog.length - 1].role === 'user' && (
                      <div className="discussion-banner">
                        🗣️ Chế độ thảo luận: "{chatLog[chatLog.length - 1].text}"
                      </div>
                    )}

                    {/* Typing Indicator */}
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

                    <div ref={chatLogEndRef} />
                  </div>
                  <div id="floating-input-row" className={discussionActive ? 'disabled' : ''}>
                    <input
                      id="chat-input"
                      type="text"
                      placeholder="Nhắn tin cho AI Teacher..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={discussionActive}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') sendChat();
                      }}
                    />
                    <button id="send-btn" onClick={sendChat} disabled={discussionActive}>
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
