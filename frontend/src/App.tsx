import { useEffect, useState } from "react";
import { SessionProvider } from "./context/SessionContext";
import type {
  AlignmentItem,
  McqQuestion,
  OutlineSection,
  Section,
  StudyContent,
  CheckJudgement,
  LLMStatus,
} from "./api/client";
import {
  MASTERY_THRESHOLD,
  createSession,
  askChat,
  generateQuiz,
  generateQuizFromPdf,
  generateRetestQuiz,
  saveRetestQuiz,
  judgeActiveModeAnswer,
  getStudyContent,
  gradeQuiz,
  getLLMStatus,
  uploadSlide,
} from "./api/client";
import UploadStep from "./components/UploadStep";
import QuizView from "./components/QuizView";
import RetestResultView from "./components/RetestResultView";
import RetestConfigView from "./components/RetestConfigView";
import type { RetestScope } from "./components/RetestConfigView";
import StyleTimeSelect from "./components/StyleTimeSelect";
import RoadmapView from "./components/RoadmapView";
import ReviewList from "./components/ReviewList";
import ReportView from "./components/ReportView";
import ChatPanel from "./components/ChatPanel";
import OpenAnswerView from "./components/OpenAnswerView";
import type { Stage } from "./components/ChatPanel";
import { analyzeWeakness } from "./weaknessAnalysis";
import "./styles.css";

type WrongItem = { question: McqQuestion; userAnswer: number };
type RetestSource = "verify" | "reteach";

function App() {
  const [slideText, setSlideText] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("upload");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [outline, setOutline] = useState<OutlineSection[]>([]);
  const [alignment, setAlignment] = useState<AlignmentItem[]>([]);
  const [round1Questions, setRound1Questions] = useState<McqQuestion[]>([]);

  const [quizMode, setQuizMode] = useState<"round1" | "retest">("round1");
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [openAnswer, setOpenAnswer] = useState("");

  const [round1Accuracy, setRound1Accuracy] = useState(0);
  const [weakSections, setWeakSections] = useState<Section[]>([]);
  const [goodSections, setGoodSections] = useState<Section[]>([]);
  const [retestSource, setRetestSource] = useState<RetestSource>("reteach");
  const [retestSections, setRetestSections] = useState<Section[]>([]);
  const [savedRetestId, setSavedRetestId] = useState<string | null>(null);
  const [finalAccuracy, setFinalAccuracy] = useState(0);
  const [masteredSections, setMasteredSections] = useState<Section[]>([]);

  const [studyContent, setStudyContent] = useState<StudyContent[]>([]);
  const [activeMode, setActiveMode] = useState(true);
  const [wrongItems, setWrongItems] = useState<WrongItem[]>([]);
  const [chatAnswer, setChatAnswer] = useState("");
  const [llmStatus, setLlmStatus] = useState<LLMStatus | null>(null);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    createSession().then((session) => setSessionId(session.session_id)).catch((error) => {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    });
    getLLMStatus().then(setLlmStatus).catch(() => setLlmStatus(null));
  }, []);

  const sectionTitle = (id: Section) =>
    outline.find((o) => o.section_id === id)?.title ?? id;

  const handleChatAsk = async (question: string) => {
    const chat = await askChat({
      question,
      session_id: sessionId,
    });
    setChatAnswer(chat.answer);
  };

  const handleUpload = async (file: File) => {
    if (!sessionId) {
      setErrorMessage("Learning session is not ready yet.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await uploadSlide(file, sessionId);
      setUploadedFile(file);
      setSlideText(result.textContent);
      setOutline(result.outline);
      setAlignment(result.alignment);
      setStage("ready");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { outline: newOutline, questions: newQuestions, alignment: newAlignment } = uploadedFile
        ? await generateQuizFromPdf(sessionId)
        : await generateQuiz(sessionId);
      setOutline(newOutline);
      if (newAlignment) setAlignment(newAlignment);
      setRound1Questions(newQuestions);
      setQuizMode("round1");
      setQuestions(newQuestions);
      setAnswers([]);
      setOpenAnswer("");
      setCurrentIndex(0);
      setStage("quiz");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    }
    setIsLoading(false);
  };

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = answerIndex;
      return next;
    });
  };

  // ---- Phase 2: G1 grading + D1 diagnosis ----
  const finishRound1 = async (finalAnswers: number[]) => {
    setIsLoading(true);
    const result = await gradeQuiz(questions, finalAnswers);
    setRound1Accuracy(result.accuracy);
    setWeakSections(result.weakSections);
    setGoodSections(result.goodSections);
    setStage("open-answer");
    setIsLoading(false);
  };

  const submitOpenAnswer = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const weaknesses = await analyzeWeakness(
        round1Questions,
        answers,
        { answer: openAnswer },
        outline,
      );
      const analyzedWeakSections = weaknesses.map((item) => item.outline_section_id);
      setWeakSections(analyzedWeakSections);
      setGoodSections((current) =>
        current.filter((section) => !analyzedWeakSections.includes(section)),
      );
      setStage("diagnosis");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Phase 4: GRADE + DEC2 ----
  const finishRetest = async (finalAnswers: number[]) => {
    setIsLoading(true);
    const result = await gradeQuiz(questions, finalAnswers);
    setFinalAccuracy(result.accuracy);

    if (result.accuracy >= MASTERY_THRESHOLD) {
      const mastered =
        retestSections;
      setMasteredSections(mastered);
      setStage("report");
    } else {
      setWeakSections(result.weakSections);
      const wrong: WrongItem[] = questions
        .map((q, i) => ({ question: q, userAnswer: finalAnswers[i] }))
        .filter((_item, i) => finalAnswers[i] !== questions[i].correct_index);
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
  const startRetest = async (
    source: RetestSource,
    questionCount: number,
    scope: RetestScope,
    sections: Section[],
    shouldSave: boolean,
  ) => {
    setIsLoading(true);
    try {
    setRetestSource(source);
    setQuizMode("retest");
    const selectedSections = scope === "whole"
      ? outline.map((section) => section.section_id)
      : sections;
    setRetestSections(selectedSections);
    const qs = await generateRetestQuiz(
      sessionId,
      scope === "whole"
        ? { mode: "whole" }
        : { mode: "selected", sectionIds: selectedSections },
      questionCount,
      [],
      round1Questions
        .filter((question) => selectedSections.includes(question.section_id))
        .map((question) => question.question),
    );
    if (qs.length === 0) {
      setErrorMessage("Không tìm thấy câu hỏi phù hợp trong quiz bank vòng 1.");
      setIsLoading(false);
      return;
    }
    if (shouldSave) {
      try {
        const saved = await saveRetestQuiz(qs, scope === "whole"
          ? { mode: "whole" }
          : { mode: "selected", sectionIds: selectedSections });
        setSavedRetestId(saved.saved_quiz_id);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : String(err));
        setIsLoading(false);
        return;
      }
    } else {
      setSavedRetestId(null);
    }
    setQuestions(qs);
    setAnswers([]);
    setOpenAnswer("");
    setCurrentIndex(0);
    setStage("quiz");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ---- DEC1 branching ----
  const handleDec1 = () => {
    if (weakSections.length > 0) {
      setStage("style");
    } else {
      setRetestSource("verify");
      setStage("retest-config");
    }
  };

  // ---- Phase 3: STYLE -> AL + RM -> Roadmap ----
  const handleStyleSubmit = async (
    level: string,
    style: string,
    timeframe: string,
  ) => {
    setIsLoading(true);
    const content = await getStudyContent(
      weakSections,
      outline,
      round1Questions,
      level,
      style,
      Number.parseInt(timeframe, 10) || 15,
      uploadedFile,
      activeMode,
      sessionId,
    );
    setStudyContent(content);
    try {
      const chat = await askChat({
        question: "Điểm này cần nhớ gì để làm bài retest?",
        session_id: sessionId,
      });
      setChatAnswer(chat.answer);
    } catch (err) {
      setChatAnswer(`# TODO-DEMO: chat unavailable (${String(err)})`);
    }
    setStage("roadmap");
    setIsLoading(false);
  };

  const handleJudgeSelfCheck = (input: { sectionId: string; answer: string }): Promise<CheckJudgement> =>
    judgeActiveModeAnswer({
      session_id: sessionId,
      section_id: input.sectionId,
      learner_answer: input.answer,
    });

  // ---- FINISH -> RET ----
  const handleFinishLearning = () => {
    setRetestSource("reteach");
    setStage("retest-config");
  };

  const initialRetestSections =
    retestSource === "verify" ? outline.map((section) => section.section_id) : weakSections;

  // ---- REVIEW -> STYLE loop ----
  const handleLoopToStyle = () => {
    setStage("style");
  };

  const handleReset = () => {
    setSlideText("");
    setUploadedFile(null);
    setStage("upload");
    setOutline([]);
    setAlignment([]);
    setRound1Questions([]);
    setQuizMode("round1");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setOpenAnswer("");
    setRound1Accuracy(0);
    setWeakSections([]);
    setGoodSections([]);
    setRetestSections([]);
    setSavedRetestId(null);
    setFinalAccuracy(0);
    setMasteredSections([]);
    setStudyContent([]);
    setActiveMode(true);
    setWrongItems([]);
    setErrorMessage("");
    setChatAnswer("");
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
          <ChatPanel
            stage={stage}
            quizMode={quizMode}
            answer={chatAnswer}
            providerStatus={llmStatus}
            onAsk={handleChatAsk}
          />
        </div>

        {errorMessage && (
          <section className="card">
            <p className="hint" style={{ color: "#dc2626" }}>
              Lỗi: {errorMessage} — kiểm tra backend đã chạy ở
              http://127.0.0.1:8001 chưa.
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
                   <p>{slideText}</p>
                   {alignment.length > 0 && (
                     <div className="alignment-preview">
                       <h4>Semantic alignment</h4>
                       {alignment.map((item) => (
                         <p key={item.section_id}>
                           <strong>{sectionTitle(item.section_id)}</strong>: {item.related_segment_ids.length} transcript segment(s)
                           {item.matches[0] ? ` · best score ${item.matches[0].score.toFixed(2)}` : " · unmatched"}
                         </p>
                       ))}
                     </div>
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
            {savedRetestId && quizMode === "retest" && (
              <p className="saved-retest-status">
                ✓ Bài retest đã được lưu (mã: {savedRetestId})
              </p>
            )}
            <QuizView
              question={questions[currentIndex]}
              index={currentIndex + 1}
              total={questions.length}
              selected={answers[currentIndex]}
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

        {stage === "open-answer" && !isLoading && (
          <section className="card result-card">
            <OpenAnswerView
              value={openAnswer}
              onChange={setOpenAnswer}
              onSubmit={submitOpenAnswer}
            />
          </section>
        )}

        {stage === "style" && (
          <section className="card review-card">
            <p className="eyebrow">Phase 3 — Adaptive Re-teaching</p>
            <h2>Bạn muốn ôn theo cách nào?</h2>
            <StyleTimeSelect
              weakTitles={weakSections.map(sectionTitle)}
              activeMode={activeMode}
              onActiveModeChange={setActiveMode}
              onSubmit={handleStyleSubmit}
            />
            {isLoading && (
              <p className="hint">
                AI đang đối chiếu phần yếu với transcript và tạo lộ trình...
              </p>
            )}
          </section>
        )}

        {stage === "retest-config" && !isLoading && (
          <section className="card review-card">
            <RetestConfigView
              outline={outline}
              questionPool={round1Questions}
              initialSections={initialRetestSections}
                onStart={(questionCount, scope, sections, shouldSave) =>
                startRetest(retestSource, questionCount, scope, sections, shouldSave)
              }
            />
          </section>
        )}

        {stage === "roadmap" && studyContent.length > 0 && (
          <section className="card review-card">
              <RoadmapView
              content={studyContent}
              activeMode={activeMode}
                sessionId={sessionId}
              onJudgeSelfCheck={handleJudgeSelfCheck}
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
