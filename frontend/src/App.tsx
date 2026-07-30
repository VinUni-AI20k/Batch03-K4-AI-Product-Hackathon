import { useState } from "react";
import { SessionProvider } from "./context/SessionContext";
import type { McqQuestion } from "./api/client";
import { uploadSlide, generateQuiz, summarizeResults, generateReviewTopics, buildFollowupQuiz } from "./api/client";
import UploadStep from "./components/UploadStep";
import QuizView from "./components/QuizView";
import RetestResultView from "./components/RetestResultView";
import StyleTimeSelect from "./components/StyleTimeSelect";
import ChatPanel from "./components/ChatPanel";
import "./styles.css";

function App() {
  const [slideText, setSlideText] = useState<string>("");
  const [stage, setStage] = useState<"upload" | "ready" | "quiz" | "results" | "review">("upload");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [summary, setSummary] = useState({ good: "", improve: "" });
  const [reviewTopics, setReviewTopics] = useState<{ title: string; content: string }[]>([]);
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [reviewPrompt, setReviewPrompt] = useState("Tôi muốn học lại những vấn đề này trong thời gian 30 phút một cách dễ hiểu.");

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    const result = await uploadSlide(file);
    setSlideText(result.textContent);
    setStage("ready");
    setIsLoading(false);
  };

  const handleCreateQuiz = async () => {
    setIsLoading(true);
    const quiz = await generateQuiz(slideText);
    setQuestions(quiz);
    setAnswers([]);
    setCurrentIndex(0);
    setStage("quiz");
    setIsLoading(false);
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = answer;
      return next;
    });
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((value) => value + 1);
      return;
    }

    setIsLoading(true);
    const result = await summarizeResults(questions, answers);
    const topics = await generateReviewTopics(slideText);
    setSummary(result);
    setReviewTopics(topics);
    setSelectedTopic(0);
    setStage("results");
    setIsLoading(false);
  };

  const handleRelearn = async (timeframe: string, topic: string) => {
    setReviewPrompt(`Tôi muốn học lại những vấn đề ${topic} trong thời gian ${timeframe} một cách dễ hiểu.`);
    setStage("review");
  };

  const handleRefreshQuiz = async () => {
    setIsLoading(true);
    const followup = await buildFollowupQuiz(slideText, questions, answers);
    setQuestions(followup);
    setAnswers([]);
    setCurrentIndex(0);
    setStage("quiz");
    setIsLoading(false);
  };

  return (
    <SessionProvider>
      <div className="app-shell">
        <div className="hero-panel">
          <div>
            <p className="eyebrow">Vlearn AI Agent</p>
            <h1>Học nhanh với slide, luyện MCQ, và ôn lại kiến thức</h1>
            <p className="hero-copy">
              Tải lên slide/PDF, để AI tóm tắt nội dung rồi tạo 20 câu hỏi trắc nghiệm. Sau đó nhận phản hồi
              học tập và ôn lại theo tab từ khóa.
            </p>
          </div>
          <ChatPanel stage={stage} />
        </div>

        <div className="flow-grid">
          <section className="card upload-card">
            <h2>1. Upload slide / PDF</h2>
            <p>AI sẽ chuyển nội dung slide thành file text.md để làm nguồn tạo quiz.</p>
            <UploadStep onUpload={handleUpload} disabled={isLoading} />
            {slideText && stage !== "upload" && (
              <div className="preview-box">
                <h3>Nội dung slide</h3>
                <p>{slideText}</p>
              </div>
            )}
          </section>

          <section className="card action-card">
            <h2>2. Tạo MCQ</h2>
            <p>Nhấn tạo để bắt đầu bài quiz trắc nghiệm 20 câu. AI sẽ hiện câu hỏi lần lượt.</p>
            <button className="primary-button" onClick={handleCreateQuiz} disabled={!slideText || isLoading}>
              Tạo MCQ
            </button>
            {stage === "ready" && !isLoading && <p className="hint">Sẵn sàng tạo bộ đề MCQ mới.</p>}
            {isLoading && <p className="hint">Đang xử lý nội dung...</p>}
          </section>
        </div>

        {stage === "quiz" && questions.length > 0 && (
          <section className="card quiz-card">
            <QuizView
              question={questions[currentIndex]}
              index={currentIndex + 1}
              total={questions.length}
              selected={answers[currentIndex] || ""}
              onSelectAnswer={handleAnswer}
              onNext={handleNextQuestion}
            />
          </section>
        )}

        {(stage === "results" || stage === "review") && (
          <section className="card result-card">
            <RetestResultView
              good={summary.good}
              improve={summary.improve}
              onContinue={() => setStage("review")}
              onRetry={handleRefreshQuiz}
            />
            <StyleTimeSelect onSubmit={handleRelearn} />
          </section>
        )}

        {stage === "review" && reviewTopics.length > 0 && (
          <section className="card review-card">
            <div className="review-header">
              <div>
                <h2>3. Ôn lại theo chủ đề</h2>
                <p>{reviewPrompt}</p>
              </div>
              <button className="secondary-button" onClick={handleRefreshQuiz}>
                Tạo MCQ khác
              </button>
            </div>
            <div className="tab-list">
              {reviewTopics.map((topic, index) => (
                <button
                  key={topic.title}
                  className={index === selectedTopic ? "tab active" : "tab"}
                  onClick={() => setSelectedTopic(index)}
                >
                  {topic.title}
                </button>
              ))}
            </div>
            <div className="review-content">
              <h3>{reviewTopics[selectedTopic]?.title}</h3>
              <p>{reviewTopics[selectedTopic]?.content}</p>
            </div>
          </section>
        )}
      </div>
    </SessionProvider>
  );
}

export default App;
