// ============================================
// VPlay - AI Slideshow Presentation Player
// Uses Web Speech API (Free TTS) & MediaRecorder (Free Screen Recording)
// ============================================

// State
let slidesData = [];
let currentIndex = 0;
let isPlaying = false;
let isSubtitlesEnabled = true;
let currentSpeed = 1.0;
let currentUtterance = null;
let currentSlideFile = "";
let currentSentences = [];
let currentSentenceIndex = 0;


// Recording state
let mediaRecorder = null;
let recordedChunks = [];
let recordingStream = null;

// DOM Cache
let modal = null;
let slidesContainer = null;
let progressBar = null;
let subtitlesDiv = null;
let playBtn = null;
let playIcon = null;
let speedSelect = null;
let btnSubtitles = null;
let loadingOverlay = null;
let btnRecord = null;
let recordingIndicator = null;

// Initialize on window load or script injection
document.addEventListener("DOMContentLoaded", () => {
  initVPlayDOM();
});

// Fallback in case DOMContentLoaded already fired
if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(initVPlayDOM, 100);
}

function initVPlayDOM() {
  modal = document.getElementById("vplay-modal");
  slidesContainer = document.getElementById("vplay-slides-container");
  progressBar = document.getElementById("vplay-progress-bar");
  subtitlesDiv = document.getElementById("vplay-subtitles");
  playBtn = document.getElementById("vplay-btn-play");
  playIcon = document.getElementById("vplay-play-icon");
  speedSelect = document.getElementById("vplay-speed-select");
  btnSubtitles = document.getElementById("vplay-btn-subtitles");
  loadingOverlay = document.getElementById("vplay-loading-overlay");
  btnRecord = document.getElementById("vplay-btn-record");
  recordingIndicator = document.getElementById("vplay-recording-indicator");

  // Keep subtitles active style sync
  if (btnSubtitles) {
    if (isSubtitlesEnabled) {
      btnSubtitles.classList.add("active");
    } else {
      btnSubtitles.classList.remove("active");
    }
  }

  // Pre-load voices so they are ready
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }
}

// --------------------------------------------
// Core Navigation Actions (Exposed to window)
// --------------------------------------------

async function startVPlayPresentation() {
  if (!modal) initVPlayDOM();
  
  // Mở modal trình chiếu
  modal.classList.add("active");
  
  // Xác định file slide hiện tại đang học
  const activeSlideFile = window.currentPdfPath || "../data/vlearn-pack/slides/d1-slide-hackathon.pdf";
  
  // Nếu đổi file slide hoặc chưa load data lần nào
  if (slidesData.length === 0 || currentSlideFile !== activeSlideFile) {
    currentSlideFile = activeSlideFile;
    await fetchSlideshowData(activeSlideFile);
  } else {
    // Phát từ đầu nếu đã có dữ liệu sẵn
    currentIndex = 0;
    playSlide(currentIndex);
  }
}

function closeVPlayPresentation() {
  stopSpeech();
  isPlaying = false;
  updatePlayButtonUI();
  
  if (modal) {
    modal.classList.remove("active");
  }

  // Stop recording if active
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    stopRecording(false); // Cancel recording quietly
  }
}

async function fetchSlideshowData(slideFile) {
  showLoading(true, "Đang trích xuất nội dung và biên soạn slide thuyết trình AI...");
  
  try {
    const response = await fetch("/api/generate-slideshow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slide_file: slideFile }),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const result = await response.json();
    slidesData = result.slides || [];
    
    if (slidesData.length === 0) {
      throw new Error("Không nhận được dữ liệu slide từ AI");
    }
    
    renderSlides();
    showLoading(false);
    
    currentIndex = 0;
    playSlide(currentIndex);
    
  } catch (error) {
    console.error("Lỗi khi tải slideshow:", error);
    showLoading(true, `⚠️ Thất bại: ${error.message}. Đang tải lại dữ liệu mẫu dự phòng...`);
    
    // Fallback data
    slidesData = [
      {
        slide_number: 1,
        title: "Giới thiệu Bài học",
        bullets: [
          "Mục tiêu: Ôn tập nhanh kiến thức cốt lõi.",
          "Chức năng: Trình chiếu tự động đồng bộ giọng nói AI.",
          "Giải pháp: Tận dụng Google Text-To-Speech miễn phí trên trình duyệt."
        ],
        narration: "Xin chào bạn học viên. Đây là chế độ trình chiếu tóm tắt bài giảng tự động. Hệ thống sẽ phát slide tóm tắt kết hợp thuyết trình bằng giọng nói trợ lý ảo VLearn."
      },
      {
        slide_number: 2,
        title: "Hướng dẫn Điều khiển",
        bullets: [
          "Dùng phím Next/Prev để chuyển nhanh giữa các slide.",
          "Điều chỉnh Tốc độ giọng đọc thuyết trình ở góc phải.",
          "Nút Ghi Video hỗ trợ ghi hình bài thuyết trình để lưu ngoại tuyến."
        ],
        narration: "Bạn có thể điều khiển trình phát bằng các nút bấm ở thanh phía dưới. Chúc bạn có một trải nghiệm ôn tập tuyệt vời."
      }
    ];
    
    setTimeout(() => {
      renderSlides();
      showLoading(false);
      currentIndex = 0;
      playSlide(currentIndex);
    }, 1500);
  }
}

function showLoading(show, text = "") {
  if (!loadingOverlay) return;
  const textEl = document.getElementById("vplay-loading-text");
  if (textEl && text) textEl.textContent = text;
  loadingOverlay.style.display = show ? "flex" : "none";
}

function renderSlides() {
  if (!slidesContainer) return;
  slidesContainer.innerHTML = "";
  
  const total = slidesData.length;
  slidesData.forEach((slide, idx) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = "vplay-slide";
    slideDiv.id = `vplay-slide-${idx}`;
    
    slideDiv.innerHTML = `
      <div class="vplay-slide-bg"></div>
      <div class="vplay-slide-content">
        <div>
          <div class="vplay-slide-num">Slide ${slide.slide_number} / ${total}</div>
          <h2 class="vplay-slide-title">${slide.title}</h2>
        </div>
        <ul class="vplay-bullets-list">
          ${slide.bullets.map((bullet, bIdx) => `
            <li class="vplay-bullet-item" style="animation-delay: ${bIdx * 0.2}s">
              ${bullet}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    
    slidesContainer.appendChild(slideDiv);
  });
}

// --------------------------------------------
// Slide Player Controls
// --------------------------------------------

function playSlide(index) {
  if (index < 0 || index >= slidesData.length) return;
  
  stopSpeech();
  
  // Transition slides
  const currentActive = slidesContainer.querySelector(".vplay-slide.active");
  if (currentActive) {
    currentActive.classList.remove("active");
    currentActive.classList.add("exit");
    setTimeout(() => {
      currentActive.classList.remove("exit");
    }, 500);
  }
  
  const targetSlide = document.getElementById(`vplay-slide-${index}`);
  if (targetSlide) {
    targetSlide.classList.add("active");
  }
  
  currentIndex = index;
  updateProgressUI();
  
  isPlaying = true;
  updatePlayButtonUI();
  
  // Start speaking the narration
  const slide = slidesData[index];
  speakText(slide.narration);
}

function vplayTogglePlay() {
  if (slidesData.length === 0) return;
  
  if (isPlaying) {
    // Tạm dừng
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
    isPlaying = false;
  } else {
    // Phát tiếp
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else {
      playSlide(currentIndex);
    }
    isPlaying = true;
  }
  updatePlayButtonUI();
}

function vplayPrevSlide() {
  if (currentIndex > 0) {
    playSlide(currentIndex - 1);
  }
}

function vplayNextSlide() {
  if (currentIndex < slidesData.length - 1) {
    playSlide(currentIndex + 1);
  } else {
    // Slideshow finished!
    stopSpeech();
    isPlaying = false;
    updatePlayButtonUI();
    showSubtitles("🎉 Đã kết thúc buổi thuyết trình tóm tắt bài giảng!", 3000);
    
    // Stop recording if active
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      setTimeout(() => {
        stopRecording(true);
      }, 1000);
    }
  }
}

function vplayChangeSpeed(val) {
  currentSpeed = parseFloat(val);
  if (isPlaying && window.speechSynthesis.speaking) {
    // Web Speech API không hỗ trợ thay đổi speed động khi đang đọc, 
    // cần phát lại từ đầu câu ở speed mới
    playSlide(currentIndex);
  }
}

function vplayToggleSubtitles() {
  isSubtitlesEnabled = !isSubtitlesEnabled;
  if (btnSubtitles) {
    if (isSubtitlesEnabled) {
      btnSubtitles.classList.add("active");
      subtitlesDiv.style.opacity = "1";
    } else {
      btnSubtitles.classList.remove("active");
      subtitlesDiv.style.opacity = "0";
    }
  }
}

function handleVPlayProgressClick(event) {
  if (!progressBar || slidesData.length === 0) return;
  
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percent = clickX / rect.width;
  const targetIndex = Math.floor(percent * slidesData.length);
  
  playSlide(Math.min(Math.max(targetIndex, 0), slidesData.length - 1));
}

// --------------------------------------------
// UI Updates
// --------------------------------------------

function updatePlayButtonUI() {
  if (!playIcon) return;
  if (isPlaying) {
    // Hiện nút Pause
    playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
  } else {
    // Hiện nút Play
    playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
  }
}

function updateProgressUI() {
  if (!progressBar || slidesData.length === 0) return;
  const percent = ((currentIndex + 1) / slidesData.length) * 100;
  progressBar.style.width = `${percent}%`;
}

function showSubtitles(text, duration = null) {
  if (!subtitlesDiv) return;
  
  subtitlesDiv.innerHTML = text;
  
  if (isSubtitlesEnabled) {
    subtitlesDiv.classList.add("active");
  }
  
  if (duration) {
    setTimeout(() => {
      if (subtitlesDiv.innerHTML === text) {
        subtitlesDiv.classList.remove("active");
      }
    }, duration);
  }
}

// --------------------------------------------
// Speech Synthesis Engine (TTS)
// --------------------------------------------

// --------------------------------------------
// Pronunciation Dictionary for English AI Terms
// --------------------------------------------
const PRONUNCIATION_DICT = {
  "RAG Agent": "rác ây-giơnt",
  "RAG": "rác",
  "LLM": "eo eo em",
  "Double Diamond": "đắp-bồ đai-mơn",
  "Problem Statement": "próp-lơm xtết-mơnt",
  "Problem": "próp-lơm",
  "Statement": "xtết-mơnt",
  "Agentic": "ây-giên-tích",
  "Agent": "ây-giơnt",
  "Fine-tuning": "phai tun-ning",
  "Fine-tune": "phai tun",
  "Precision": "pri-xí-giưn",
  "Recall": "ri-côn",
  "False Positive": "phôn pó-gi-típ",
  "False Negative": "phôn ne-gơ-típ",
  "Model": "mô-đen",
  "Production": "prờ-đắc-sơn",
  "Heuristic": "hưu-rít-tích",
  "Rule": "run",
  "Workflow": "uốc-phơ-lô",
  "Prompt chaining": "próm-chên-ninh",
  "Prompt": "próm",
  "Routing": "rau-tinh",
  "Parallelization": "pa-ra-le-lai-zê-sơn",
  "Human-in-the-loop": "hưu-mơn in dơ lúp",
  "Reward function": "ri-uốc phăng-sơn",
  "Reward": "ri-uốc",
  "Function": "phăng-sơn",
  "Success criteria": "sấc-sét crai-ti-ri-a",
  "Criteria": "crai-ti-ri-a",
  "Not Yet": "nót-ét",
  "No-Go": "nô-gô",
  "Baseline": "bết-lai",
  "Target": "ta-gét",
  "Measurement": "me-giơ-mơnt",
  "Metric": "mét-trích",
  "Metrics": "mét-trích",
  "Output": "ao-pút",
  "Input": "in-pút",
  "Token": "tô-kừn",
  "Tokens": "tô-kừn",
  "Affinity Mapping": "a-phi-ni-ti máp-pinh",
  "Affinity": "a-phi-ni-ti",
  "Mapping": "máp-pinh",
  "5 Whys": "phai uai",
  "Impact-Effort": "im-pắc ép-phớt",
  "Impact": "im-pắc",
  "Effort": "ép-phớt",
  "How Might We": "hao mai ui",
  "Boundary": "baun-đa-ri",
  "Fallback": "phôn-bắc",
  "Demo": "đê-mô",
  "Dataset": "đê-ta-sét",
  "AI": "ây ai",
  "Go": "gô"
};

function getPhoneticText(text) {
  if (!text) return "";
  let phoneticText = text;
  
  const sortedKeys = Object.keys(PRONUNCIATION_DICT).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    const value = PRONUNCIATION_DICT[key];
    const regex = new RegExp(`\\b${key}\\b`, "gi");
    phoneticText = phoneticText.replace(regex, value);
  }
  
  return phoneticText;
}

function getWords(text) {
  if (!text) return [];
  return text.split(/\s+/).filter(w => w.length > 0);
}

function getWordIndexAtChar(words, charIndex) {
  let currentCharIndex = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordStart = currentCharIndex;
    const wordEnd = currentCharIndex + word.length;
    
    if (charIndex >= wordStart && charIndex <= wordEnd) {
      return i;
    }
    currentCharIndex += word.length + 1; // +1 for whitespace
  }
  return words.length - 1;
}

function speakText(text) {
  if (!window.speechSynthesis) {
    showSubtitles("⚠️ Trình duyệt của bạn không hỗ trợ đọc giọng nói (SpeechSynthesis).");
    return;
  }
  
  currentSentences = splitIntoSentences(text);
  currentSentenceIndex = 0;
  
  if (currentSentences.length === 0) {
    if (isPlaying) {
      setTimeout(vplayNextSlide, 1000);
    }
    return;
  }
  
  speakCurrentSentence();
}

function splitIntoSentences(text) {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function speakCurrentSentence() {
  if (currentSentenceIndex < 0 || currentSentenceIndex >= currentSentences.length) {
    if (isPlaying) {
      setTimeout(vplayNextSlide, 800);
    }
    return;
  }
  
  const sentence = currentSentences[currentSentenceIndex];
  
  // Show clean subtitles initially
  showSubtitles(sentence);
  
  // Phonetic text for TTS voice
  const phoneticSentence = getPhoneticText(sentence);
  
  currentUtterance = new SpeechSynthesisUtterance(phoneticSentence);
  currentUtterance.rate = currentSpeed;
  
  const voices = window.speechSynthesis.getVoices();
  const googleViVoice = voices.find(
    voice => voice.lang.includes("vi") && voice.name.includes("Google")
  );
  
  const viVoice = googleViVoice || voices.find(voice => voice.lang.includes("vi"));
  if (viVoice) {
    currentUtterance.voice = viVoice;
    currentUtterance.lang = "vi-VN";
  } else {
    currentUtterance.lang = "vi-VN";
  }
  
  const originalWords = getWords(sentence);
  const phoneticWords = getWords(phoneticSentence);
  
  currentUtterance.onboundary = (event) => {
    if (event.name === "word") {
      const charIndex = event.charIndex;
      const wordIdx = getWordIndexAtChar(phoneticWords, charIndex);
      
      if (wordIdx >= 0 && wordIdx < originalWords.length) {
        const before = originalWords.slice(0, wordIdx).join(" ");
        const currentWord = originalWords[wordIdx];
        const after = originalWords.slice(wordIdx + 1).join(" ");
        
        if (isSubtitlesEnabled && subtitlesDiv) {
          const spokenText = before ? before + " " + currentWord : currentWord;
          const remainingText = after ? " " + after : "";
          
          subtitlesDiv.innerHTML = `<span style="color: #ffffff; font-weight: 600;">${before ? before + " " : ""}<span style="color: #3b82f6; font-weight: 700; text-decoration: underline;">${currentWord}</span></span><span style="color: rgba(255,255,255,0.4);">${remainingText}</span>`;
        }
      }
    }
  };
  
  currentUtterance.onend = (event) => {
    if (isPlaying) {
      currentSentenceIndex++;
      speakCurrentSentence();
    }
  };
  
  currentUtterance.onerror = (event) => {
    console.error("Speech Synthesis Error:", event);
    if (event.error !== "interrupted") {
      if (isPlaying) {
        currentSentenceIndex++;
        speakCurrentSentence();
      }
    }
  };
  
  window.speechSynthesis.speak(currentUtterance);
}

function stopSpeech() {
  if (currentUtterance) {
    currentUtterance.onend = null;
    currentUtterance.onerror = null;
    currentUtterance.onboundary = null;
  }
  currentSentences = [];
  currentSentenceIndex = 0;
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}


// --------------------------------------------
// Client-side Presentation Video Recording
// --------------------------------------------

async function toggleVPlayRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    // Đang ghi hình -> Stop và lưu file
    stopRecording(true);
  } else {
    // Bắt đầu ghi hình
    await startRecording();
  }
}

async function startRecording() {
  recordedChunks = [];
  
  try {
    // 1. Yêu cầu quyền quay màn hình / tab hiện tại
    // Chụp luồng hình ảnh của frame trình chiếu
    const options = {
      video: {
        width: 1280,
        height: 720,
        frameRate: 30
      },
      audio: true // Thử thu âm thanh hệ thống (tiếng thuyết trình TTS)
    };
    
    // Nhắc nhở người dùng chọn "Chia sẻ thẻ này" + tích chọn "Chia sẻ âm thanh hệ thống" để có cả tiếng
    showSubtitles("💡 **MẸO**: Để quay video có cả tiếng thuyết trình, vui lòng chọn **'Chia sẻ thẻ này' (Share this tab)** và bấm tích chọn **'Chia sẻ cả âm thanh' (Share audio)**.", 8000);
    
    // Đợi 2s để người dùng đọc gợi ý trước khi mở hộp thoại browser
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    recordingStream = await navigator.mediaDevices.getDisplayMedia(options);
    
    // Lắng nghe sự kiện người dùng bấm "Stop sharing" trên thanh công cụ của Browser
    recordingStream.getVideoTracks()[0].onended = () => {
      stopRecording(true);
    };
    
    // 2. Thiết lập MediaRecorder
    // Thử sử dụng các định dạng phổ biến, ưu tiên mp4 sau đó là webm
    let mimeType = "video/webm;codecs=vp9,opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm;codecs=vp8,opus";
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }
    
    mediaRecorder = new MediaRecorder(recordingStream, { mimeType });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      saveVideoFile();
      cleanupRecordingTracks();
    };
    
    // 3. Bắt đầu ghi hình và reset slideshow về trang 1
    mediaRecorder.start();
    
    // Cập nhật UI ghi hình
    if (btnRecord) {
      btnRecord.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="currentColor"/></svg>
        <span>Dừng Ghi</span>
      `;
      btnRecord.classList.add("vplay-btn-export-record");
    }
    
    if (recordingIndicator) {
      recordingIndicator.style.display = "flex";
    }
    
    // Khởi chạy slideshow từ đầu để ghi lại toàn bộ
    currentIndex = 0;
    playSlide(currentIndex);
    
  } catch (err) {
    console.error("Lỗi khi kích hoạt ghi hình:", err);
    showSubtitles("⚠️ Không thể bắt đầu ghi hình. Vui lòng cấp quyền quay màn hình.");
  }
}

function stopRecording(shouldSave = true) {
  if (!mediaRecorder || mediaRecorder.state === "inactive") return;
  
  if (shouldSave) {
    mediaRecorder.stop();
  } else {
    // Stop without saving
    cleanupRecordingTracks();
    resetRecordingUI();
  }
}

function cleanupRecordingTracks() {
  if (recordingStream) {
    recordingStream.getTracks().forEach(track => track.stop());
    recordingStream = null;
  }
}

function resetRecordingUI() {
  if (btnRecord) {
    btnRecord.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
      <span>Ghi Video</span>
    `;
    btnRecord.classList.remove("vplay-btn-export-record");
  }
  
  if (recordingIndicator) {
    recordingIndicator.style.display = "none";
  }
}

function saveVideoFile() {
  if (recordedChunks.length === 0) return;
  
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  
  const docName = document.getElementById("current-doc-title")?.textContent || "presentation";
  const safeDocName = docName.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_");
  a.download = `VPlay_Tóm_Tắt_${safeDocName}.webm`;
  
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
  
  resetRecordingUI();
  showSubtitles("💾 Đã lưu và tải xuống video thuyết trình thành công!", 4000);
}

// --------------------------------------------
// Expose functions globally to window object
// --------------------------------------------
window.startVPlayPresentation = startVPlayPresentation;
window.closeVPlayPresentation = closeVPlayPresentation;
window.vplayTogglePlay = vplayTogglePlay;
window.vplayPrevSlide = vplayPrevSlide;
window.vplayNextSlide = vplayNextSlide;
window.vplayChangeSpeed = vplayChangeSpeed;
window.vplayToggleSubtitles = vplayToggleSubtitles;
window.toggleVPlayRecording = toggleVPlayRecording;
window.handleVPlayProgressClick = handleVPlayProgressClick;

// --------------------------------------------
// Keyboard Shortcuts for Premium UX
// --------------------------------------------
document.addEventListener("keydown", (e) => {
  const modalEl = document.getElementById("vplay-modal");
  if (!modalEl || !modalEl.classList.contains("active")) return;

  // Ignore keyboard shortcuts if the user is typing in an input or textarea
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
    return;
  }

  if (e.code === "Space") {
    e.preventDefault();
    vplayTogglePlay();
  } else if (e.code === "ArrowRight" || e.code === "ArrowDown") {
    e.preventDefault();
    vplayNextSlide();
  } else if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
    e.preventDefault();
    vplayPrevSlide();
  } else if (e.code === "Escape") {
    e.preventDefault();
    closeVPlayPresentation();
  }
});

