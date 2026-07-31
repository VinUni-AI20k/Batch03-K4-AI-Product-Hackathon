import { useEffect, useState } from 'react'

import { api } from '../api'
import type { QuizQuestion } from '../types'
import { Icon } from './Icon'

const LETTERS = ['A', 'B', 'C', 'D']

interface Props {
  documentId: string
  pageCount: number
  onJumpToPage: (page: number) => void
}

export function QuizPanel({ documentId, pageCount, onJumpToPage }: Props) {
  const [count, setCount] = useState(5)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(pageCount)

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [dropped, setDropped] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFrom(1)
    setTo(pageCount)
    setQuestions([])
    setAnswers({})
    setError(null)
  }, [documentId, pageCount])

  const generate = async () => {
    setLoading(true)
    setError(null)
    setQuestions([])
    setAnswers({})
    try {
      const result = await api.quiz({
        document_id: documentId,
        num_questions: count,
        page_from: from,
        page_to: to,
        difficulty,
      })
      setQuestions(result.questions)
      setDropped(result.dropped)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const answered = Object.keys(answers).length
  const correct = questions.reduce(
    (total, question, index) => total + (answers[index] === question.correct_index ? 1 : 0),
    0,
  )

  return (
    <>
      <div className="quiz-controls">
        <div className="field">
          <label htmlFor="quiz-count">Questions</label>
          <input
            id="quiz-count"
            type="number"
            min={1}
            max={15}
            value={count}
            onChange={(event) => setCount(Math.min(15, Math.max(1, Number(event.target.value) || 1)))}
          />
        </div>
        <div className="field">
          <label htmlFor="quiz-difficulty">Difficulty</label>
          <select
            id="quiz-difficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="quiz-from">From page</label>
          <input
            id="quiz-from"
            type="number"
            min={1}
            max={pageCount}
            value={from}
            onChange={(event) => setFrom(Math.min(pageCount, Math.max(1, Number(event.target.value) || 1)))}
          />
        </div>
        <div className="field">
          <label htmlFor="quiz-to">To page</label>
          <input
            id="quiz-to"
            type="number"
            min={1}
            max={pageCount}
            value={to}
            onChange={(event) => setTo(Math.min(pageCount, Math.max(1, Number(event.target.value) || 1)))}
          />
        </div>
        <button className="btn btn-primary" onClick={() => void generate()} disabled={loading}>
          {loading ? <div className="spinner" /> : <Icon name={questions.length ? 'refresh' : 'sparkle'} />}
          {loading ? 'Writing questions…' : questions.length ? 'Generate a new quiz' : 'Generate quiz'}
        </button>
      </div>

      <div className="panel-body">
        {error && <div className="banner banner-error">{error}</div>}

        {!questions.length && !loading && !error && (
          <div className="empty">
            <Icon name="check" size={22} />
            <h3>Test your understanding</h3>
            <p>
              Pick a page range and generate multiple-choice questions. Every question is checked
              against the page it came from before you see it.
            </p>
          </div>
        )}

        {questions.length > 0 && (
          <>
            <div className="quiz-score">
              <div>
                <strong>
                  {correct}/{questions.length}
                </strong>{' '}
                <span>correct</span>
              </div>
              <span>
                {answered}/{questions.length} answered
                {dropped > 0 && ` · ${dropped} ungrounded question${dropped === 1 ? '' : 's'} discarded`}
              </span>
            </div>

            <div className="quiz-list">
              {questions.map((question, questionIndex) => {
                const choice = answers[questionIndex]
                const revealed = choice !== undefined
                return (
                  <article className="quiz-card" key={questionIndex}>
                    <div className="quiz-q-head">
                      <span className="quiz-q-num">Q{questionIndex + 1}</span>
                    </div>
                    <p className="quiz-q-text">{question.question}</p>

                    <div className="quiz-options">
                      {question.options.map((option, optionIndex) => {
                        let state = ''
                        if (revealed) {
                          if (optionIndex === question.correct_index) state = 'correct'
                          else if (optionIndex === choice) state = 'wrong'
                        }
                        return (
                          <button
                            key={optionIndex}
                            className={`quiz-option ${state}`}
                            disabled={revealed}
                            onClick={() =>
                              setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))
                            }
                          >
                            <span className="quiz-option-key">{LETTERS[optionIndex]}</span>
                            <span>{option}</span>
                          </button>
                        )
                      })}
                    </div>

                    {revealed && (
                      <div className="quiz-explain">
                        {question.explanation}
                        <div className="quiz-evidence">“{question.evidence_quote}”</div>
                        <button className="quiz-source" onClick={() => onJumpToPage(question.source_page)}>
                          <Icon name="file" size={12} />
                          Source: page {question.source_page}
                        </button>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </>
        )}
      </div>
    </>
  )
}
