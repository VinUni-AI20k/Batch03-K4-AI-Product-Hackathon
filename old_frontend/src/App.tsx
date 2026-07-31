import { useState, useEffect } from "react";
import { SessionProvider } from "./context/SessionContext";
import type {
  McqQuestion,
  OutlineSection,
  Section,
  StudyContent,
  SelfCheckGrade,
  SlideRange,
  LearningUnit,
} from "./api/client";
import {
  MASTERY_THRESHOLD,
  generateQuiz,
  generateRetest,
  gradeSelfCheck,
  getStudyContent,
  gradeQuiz,
  uploadSlide,
  enrichKnowledge,
  checkEnrichmentStatus,
} from "./api/client";
import UploadStep from "./components/UploadStep";
import QuizView from "./components/QuizView";
import RetestResultView from "./components/RetestResultView";
import StyleTimeSelect from "./components/StyleTimeSelect";
import RoadmapView from "./components/RoadmapView";
import ReviewList from "./components/ReviewList";
import ReportView from "./components/ReportView";
import ChatPanel from "./components/ChatPanel";
import type { Stage } from "./components/ChatPanel";
import "./styles.css";

type WrongItem = { question: McqQuestion; userAnswer: string };
type RetestSource = "verify" | "reteach";

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem("vlearn_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed[key] !== undefined) {
        return parsed[key];
      }
    }
  } catch (e) {
    console.error("Failed to load state from localStorage:", e);
  }
  return defaultValue;
};

function App() {
  const [slideText, setSlideText] = useState<string>(() => getInitialState("slideText", ""));
  const [slideRanges, setSlideRanges] = useState<SlideRange[]>(() => getInitialState("slideRanges", []));
  const [slideLearningUnits, setSlideLearningUnits] = useState<LearningUnit[]>(() => getInitialState("slideLearningUnits", []));
  const [slideFilename, setSlideFilename] = useState<string>(() => getInitialState("slideFilename", ""));
  const [stage, setStage] = useState<Stage>(() => getInitialState("stage", "upload"));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [outline, setOutline] = useState<OutlineSection[]>(() => getInitialState("outline", []));
  const [round1Questions, setRound1Questions] = useState<McqQuestion[]>(() => getInitialState("round1Questions", []));

  const [quizMode, setQuizMode] = useState<"round1" | "retest">(() => getInitialState("quizMode", "round1"));
  const [questions, setQuestions] = useState<McqQuestion[]>(() => getInitialState("questions", []));
  const [currentIndex, setCurrentIndex] = useState<number>(() => getInitialState("currentIndex", 0));
  const [answers, setAnswers] = useState<string[]>(() => getInitialState("answers", []));

  const [round1Accuracy, setRound1Accuracy] = useState<number>(() => getInitialState("round1Accuracy", 0));
  const [weakSections, setWeakSections] = useState<Section[]>(() => getInitialState("weakSections", []));
  const [goodSections, setGoodSections] = useState<Section[]>(() => getInitialState("goodSections", []));
  const [retestSource, setRetestSource] = useState<RetestSource>(() => getInitialState("retestSource", "reteach"));
  const [finalAccuracy, setFinalAccuracy] = useState<number>(() => getInitialState("finalAccuracy", 0));
  const [masteredSections, setMasteredSections] = useState<Section[]>(() => getInitialState("masteredSections", []));

  const [studyContent, setStudyContent] = useState<StudyContent[]>(() => getInitialState("studyContent", []));
  const [activeMode, setActiveMode] = useState<boolean>(() => getInitialState("activeMode", true));
  const [wrongItems, setWrongItems] = useState<WrongItem[]>(() => getInitialState("wrongItems", []));

  // --- Persistence Effects ---
  useEffect(() => {
    const stateObj = {
      slideText,
      slideRanges,
      slideLearningUnits,
      slideFilename,
      stage,
      outline,
      round1Questions,
      quizMode,
      questions,
      currentIndex,
      answers,
      round1Accuracy,
      weakSections,
      goodSections,
      retestSource,
      finalAccuracy,
      masteredSections,
      studyContent,
      activeMode,
      wrongItems,
    };
    try {
      localStorage.setItem("vlearn_state", JSON.stringify(stateObj));
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }, [
    slideText,
    slideRanges,
    slideLearningUnits,
    slideFilename,
    stage,
    outline,
    round1Questions,
    quizMode,
    questions,
    currentIndex,
    answers,
    round1Accuracy,
    weakSections,
    goodSections,
    retestSource,
    finalAccuracy,
    masteredSections,
    studyContent,
    activeMode,
    wrongItems,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isR = e.key?.toLowerCase() === "r";
      const isF5 = e.key === "F5";
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;

      if ((isCtrlOrMeta && isShift && isR) || (isCtrlOrMeta && isShift && isF5)) {
        localStorage.removeItem("vlearn_state");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sectionTitle = (id: Section) =>
    outline.find((o) => o.section_id === id)?.title ?? id;

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    const result = await uploadSlide(file);
    setSlideText(result.textContent);
    setSlideRanges(result.ranges || []);
    setSlideLearningUnits(result.learningUnits || []);
    setSlideFilename(file.name);
    setStage("ready");
    setIsLoading(false);
  };

  const handleCreateQuiz = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { outline: newOutline, questions: newQuestions } =
        await generateQuiz();
      setOutline(newOutline);
      setRound1Questions(newQuestions);
      setQuizMode("round1");
      setQuestions(newQuestions);
      setAnswers([]);
      setCurrentIndex(0);
      setStage("quiz");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    }
    setIsLoading(false);
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = answer;
      return next;
    });
  };

  // ---- Phase 2: G1 grading + D1 diagnosis ----
  const finishRound1 = async (finalAnswers: string[]) => {
    setIsLoading(true);
    const result = await gradeQuiz(questions, finalAnswers);
    setRound1Accuracy(result.accuracy);
    setWeakSections(result.weakSections);
    setGoodSections(result.goodSections);

    if (result.weakSections.length > 0 && slideFilename) {
      // Start background enrichment of knowledge.md
      enrichKnowledge(result.weakSections, slideFilename).catch(console.error);
    }

    setStage("diagnosis");
    setIsLoading(false);
  };

  // ---- Phase 4: GRADE + DEC2 ----
  const finishRetest = async (finalAnswers: string[]) => {
    setIsLoading(true);
    const result = await gradeQuiz(questions, finalAnswers);
    setFinalAccuracy(result.accuracy);

    if (result.accuracy >= MASTERY_THRESHOLD) {
      const mastered =
        retestSource === "verify"
          ? outline.map((o) => o.section_id)
          : weakSections;
      setMasteredSections(mastered);
      setStage("report");
    } else {
      setWeakSections(result.weakSections);
      const wrong: WrongItem[] = questions
        .map((q, i) => ({ question: q, userAnswer: finalAnswers[i] }))
        .filter((_item, i) => finalAnswers[i] !== questions[i].answer);
      setWrongItems(wrong);
      setStage("review");
    }
    setIsLoading(false);
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((value) => value + 1);
      return;
    }
    if (quizMode === "round1") await finishRound1(answers);
    else await finishRetest(answers);
  };

  // ---- Phase 4 (RET): generate retest questions ----
  const startRetest = async (source: RetestSource, sections: Section[]) => {
    setIsLoading(true);
    setRetestSource(source);
    setQuizMode("retest");
    const perSection = source === "verify" ? 1 : 2;
    const qs = await generateRetest(sections, perSection, round1Questions);
    setQuestions(qs);
    setAnswers([]);
    setCurrentIndex(0);
    setStage("quiz");
    setIsLoading(false);
  };

  // ---- DEC1 branching ----
  const handleDec1 = () => {
    if (weakSections.length > 0) {
      setStage("style");
    } else {
      startRetest(
        "verify",
        outline.map((o) => o.section_id),
      );
    }
  };

  // ---- Phase 3: STYLE -> AL + RM -> Roadmap ----
  const handleStyleSubmit = async (
    _style: string,
    _timeframe: string,
    selectedActiveMode: boolean,
  ) => {
    setIsLoading(true);

    // Wait for enrichment process to finish if it's running
    try {
      let isRunning = true;
      let attempts = 0;
      const maxAttempts = 30; // Max 30 seconds wait (1s interval)

      while (isRunning && attempts < maxAttempts) {
        const status = await checkEnrichmentStatus();
        isRunning = status.is_running;
        if (isRunning) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          attempts++;
        }
      }
    } catch (err) {
      console.error("Error checking enrichment status, proceeding anyway:", err);
    }

    const content = await getStudyContent(
      weakSections,
      outline,
      round1Questions,
    );
    setStudyContent(content);
    setStage("roadmap");
    setIsLoading(false);
  };

  const handleGradeSelfCheck = (input: {
    section: Section;
    question: string;
    answer: string;
    sourceContext: string;
  }): Promise<SelfCheckGrade> =>
    gradeSelfCheck({
      section_id: input.section,
      question: input.question,
      learner_answer: input.answer,
      source_context: input.sourceContext,
    });

  // ---- FINISH -> RET ----
  const handleFinishLearning = () => {
    startRetest("reteach", weakSections);
  };

  // ---- REVIEW -> STYLE loop ----
  const handleLoopToStyle = () => {
    setStage("style");
  };

  const handleReset = () => {
    setSlideText("");
    setSlideRanges([]);
    setSlideLearningUnits([]);
    setStage("upload");
    setOutline([]);
    setRound1Questions([]);
    setQuizMode("round1");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setRound1Accuracy(0);
    setWeakSections([]);
    setGoodSections([]);
    setFinalAccuracy(0);
    setMasteredSections([]);
    setStudyContent([]);
    setActiveMode(true);
    setWrongItems([]);
    setErrorMessage("");
    try {
      localStorage.removeItem("vlearn_state");
    } catch (e) {
      console.error(e);
    }
  };

  const studyContentBySection = Object.fromEntries(
    studyContent.map((c) => [c.section, c]),
  ) as Record<string, StudyContent>;

  return (
    <SessionProvider>
      <div className="app-shell">
        <div className="hero-panel">
          <div>
            <p className="eyebrow">Vlearn AI Agent</p>
            <h1>Học nhanh với slide, luyện MCQ, và ôn lại kiến thức</h1>
            <p className="hero-copy">
              AI sinh 20 câu MCQ thật từ transcript bài giảng thật (không
              hardcode), chẩn đoán phần bạn yếu, và giúp bạn ôn lại đến khi đạt
              mức hiểu vững.
            </p>
          </div>
          <ChatPanel stage={stage} quizMode={quizMode} />
        </div>

        {errorMessage && (
          <section className="card">
            <p className="hint" style={{ color: "#dc2626" }}>
              Lỗi: {errorMessage} — kiểm tra backend đã chạy ở
              http://127.0.0.1:8000 chưa.
            </p>
          </section>
        )}

        {isLoading && (
          <section className="card">
            <p className="hint">AI đang xử lý...</p>
          </section>
        )}

        {(stage === "upload" || stage === "ready") && !isLoading && (
          <div className="flow-grid">
            <section className="card upload-card">
              <h2>1. Upload slide / PDF</h2>
              <p>
                Demo dùng transcript thật từ data pack (chưa nối bước PDF→text
                thật — xem docs).
              </p>
              <UploadStep onUpload={handleUpload} disabled={isLoading} />
              {slideText && (
                <div className="preview-box">
                  <h3>Nội dung slide (Knowledge Package)</h3>
                  <p className="upload-success-msg">{slideText}</p>
                  {slideLearningUnits.length > 0 ? (
                    <div className="learning-units-section">
                      <p className="metadata-title">Đơn vị học tập (Learning Units từ AI):</p>
                      <div className="learning-units-list">
                        {slideLearningUnits.map((lu, luIdx) => (
                          <div key={luIdx} className="learning-unit-card">
                            <h4 className="learning-unit-name">
                              <span className="unit-icon">📚</span> {lu.unit}
                            </h4>
                            <ul className="outline-list">
                              {lu.slides.map((slideNum) => {
                                const slide = slideRanges[slideNum - 1];
                                if (!slide) return null;
                                return (
                                  <li key={slideNum} className="outline-item">
                                    <span className="outline-item-title">
                                      <span className="outline-bullet">✦</span> {slide.title}
                                    </span>
                                    <span className="outline-item-pages">Trang {slide.start_page} - {slide.end_page}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    slideRanges.length > 0 && (
                      <div className="metadata-outline">
                        <p className="metadata-title">Khung nội dung trích xuất (Outline & Metadata):</p>
                        <ul className="outline-list">
                          {slideRanges.map((r, idx) => (
                            <li key={idx} className="outline-item">
                              <span className="outline-item-title">
                                <span className="outline-bullet">✦</span> {r.title}
                              </span>
                              <span className="outline-item-pages">Trang {r.start_page} - {r.end_page}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            <section className="card action-card">
              <h2>2. Tạo MCQ chẩn đoán (AI thật)</h2>
              <p>
                Gọi backend thật (OpenAI) để sinh MCQ trực tiếp từ transcript,
                có trích dẫn segment_id.
              </p>
              <button
                className="primary-button"
                onClick={handleCreateQuiz}
                disabled={!slideText || isLoading}
              >
                Tạo MCQ
              </button>
            </section>
          </div>
        )}

        {stage === "quiz" && questions.length > 0 && !isLoading && (
          <section className="card quiz-card">
            <QuizView
              question={questions[currentIndex]}
              index={currentIndex + 1}
              total={questions.length}
              selected={answers[currentIndex] || ""}
              modeLabel={
                quizMode === "round1"
                  ? "Phase 2 — Quiz chẩn đoán ban đầu"
                  : "Phase 4 — Kiểm tra lại (Retest)"
              }
              onSelectAnswer={handleAnswer}
              onNext={handleNextQuestion}
            />
          </section>
        )}

        {stage === "diagnosis" && !isLoading && (
          <section className="card result-card">
            <RetestResultView
              goodTitles={goodSections.map(sectionTitle)}
              weakTitles={weakSections.map(sectionTitle)}
              ctaLabel={
                weakSections.length > 0
                  ? "Chọn cách ôn tập →"
                  : "Làm bài kiểm tra xác nhận →"
              }
              onContinue={handleDec1}
            />
          </section>
        )}

        {stage === "style" && (
          <section className="card review-card">
            <p className="eyebrow">Phase 3 — Adaptive Re-teaching</p>
            <h2>Bạn muốn ôn theo cách nào?</h2>
            <StyleTimeSelect
              weakTitles={weakSections.map(sectionTitle)}
              onSubmit={handleStyleSubmit}
            />
            {isLoading && (
              <p className="hint">
                AI đang đối chiếu phần yếu với transcript và tạo lộ trình...
              </p>
            )}
          </section>
        )}

        {stage === "roadmap" && studyContent.length > 0 && (
          <section className="card review-card">
            <RoadmapView
              content={studyContent}
              activeMode={activeMode}
              onGradeSelfCheck={handleGradeSelfCheck}
              onFinish={handleFinishLearning}
            />
          </section>
        )}

        {stage === "review" && !isLoading && (
          <section className="card review-card">
            <ReviewList
              wrongItems={wrongItems}
              studyContentBySection={studyContentBySection}
              onLoop={handleLoopToStyle}
            />
          </section>
        )}

        {stage === "report" && (
          <section className="card review-card">
            <ReportView
              beforeAccuracy={round1Accuracy}
              afterAccuracy={finalAccuracy}
              masteredTitles={masteredSections.map(sectionTitle)}
              onReset={handleReset}
            />
          </section>
        )}
      </div>
    </SessionProvider>
  );
}

export default App;
