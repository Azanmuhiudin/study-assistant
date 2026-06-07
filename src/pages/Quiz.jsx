import { useState } from 'react'
import { BrainCircuit, Sparkles, RotateCcw, CheckCircle2, XCircle, Trophy, ChevronRight } from 'lucide-react'
import axios from 'axios'
import './Quiz.css'

const TOPICS = ['Photosynthesis', 'World War II', 'Algebra', 'Human Anatomy', 'Python Programming']

export default function Quiz() {
  const [topic, setTopic] = useState('')
  const [numQ, setNumQ] = useState(5)
  const [quiz, setQuiz] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [current, setCurrent] = useState(0)

  const generateQuiz = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setQuiz([])
    setAnswers({})
    setSubmitted(false)
    setCurrent(0)
    try {
      const { data } = await axios.post('/api/quiz', { topic, numQuestions: numQ })
      setQuiz(data.quiz)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to generate quiz. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = (qIdx, opt) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIdx]: opt }))
  }

  const handleSubmit = () => {
    if (Object.keys(answers).length < quiz.length) return
    setSubmitted(true)
  }

  const score = submitted ? quiz.filter((q, i) => answers[i] === q.answer).length : 0
  const pct = quiz.length ? Math.round((score / quiz.length) * 100) : 0

  const q = quiz[current]
  const opts = q ? ['a', 'b', 'c', 'd'] : []

  const getOptClass = (opt) => {
    if (!submitted) return answers[current] === opt ? 'opt-selected' : ''
    if (opt === q.answer) return 'opt-correct'
    if (answers[current] === opt && opt !== q.answer) return 'opt-wrong'
    return ''
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-label">Quiz</div>
        <h1 className="page-title">Quiz generator</h1>
        <p className="page-subtitle">Enter a topic, pick question count — get a quiz instantly.</p>
      </div>

      <div className="page-body">
        {/* Setup card */}
        {quiz.length === 0 && (
          <div className="quiz-setup card animate-fadeUp">
            <div className="setup-row">
              <div style={{ flex: 1 }}>
                <label className="setup-label">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generateQuiz()}
                  placeholder="e.g. Photosynthesis, World War II, Python..."
                />
                <div className="topic-chips">
                  {TOPICS.map(t => (
                    <button key={t} className={`topic-chip ${topic === t ? 'active' : ''}`} onClick={() => setTopic(t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="num-q-wrap">
                <label className="setup-label">Questions</label>
                <select value={numQ} onChange={e => setNumQ(Number(e.target.value))}>
                  {[3,5,8,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            {error && (
              <div className="quiz-error">⚠️ {error}</div>
            )}

            <button
              className="btn btn-primary"
              onClick={generateQuiz}
              disabled={loading || !topic.trim()}
              style={{ marginTop: 20, padding: '13px 28px' }}
            >
              {loading
                ? <><span className="spinner" /> Generating quiz…</>
                : <><Sparkles size={16} /> Generate quiz</>
              }
            </button>
          </div>
        )}

        {/* Quiz UI */}
        {quiz.length > 0 && !submitted && (
          <div className="quiz-active animate-fadeUp">
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${((current + 1) / quiz.length) * 100}%` }} />
            </div>
            <div className="quiz-meta">
              <span className="quiz-qnum">Question {current + 1} of {quiz.length}</span>
              <span className="quiz-topic-tag">{topic}</span>
            </div>

            <div className="quiz-question card">
              <p className="question-text">{q.question}</p>
              <div className="options-list">
                {opts.map(opt => (
                  <button
                    key={opt}
                    className={`opt-btn ${answers[current] === opt ? 'opt-selected' : ''}`}
                    onClick={() => selectAnswer(current, opt)}
                  >
                    <span className="opt-letter">{opt.toUpperCase()}</span>
                    <span className="opt-text">{q.options?.[opt] || q[opt]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-nav">
              <button className="btn btn-ghost" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
                ← Back
              </button>
              {current < quiz.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)} disabled={!answers[current]}>
                  Next <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length < quiz.length}
                  style={{ background: 'var(--accent2)', color: '#0d1a14' }}
                >
                  Submit quiz →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {submitted && (
          <div className="quiz-results animate-fadeUp">
            <div className="results-score-card card">
              <div className="score-icon">
                <Trophy size={32} style={{ color: pct >= 70 ? 'var(--accent3)' : 'var(--text3)' }} />
              </div>
              <div>
                <div className="score-big">{score}/{quiz.length}</div>
                <div className="score-label">{pct}% — {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good work!' : 'Keep studying!'}</div>
              </div>
              <button className="btn btn-secondary" onClick={() => { setQuiz([]); setSubmitted(false); }} style={{ marginLeft: 'auto' }}>
                <RotateCcw size={14} /> New quiz
              </button>
            </div>

            <div className="results-list">
              {quiz.map((q, i) => {
                const correct = answers[i] === q.answer
                return (
                  <div key={i} className={`result-item card ${correct ? 'result-correct' : 'result-wrong'}`}>
                    <div className="result-header">
                      <span className="result-icon">
                        {correct ? <CheckCircle2 size={18} style={{ color: 'var(--accent2)' }} /> : <XCircle size={18} style={{ color: 'var(--danger)' }} />}
                      </span>
                      <span className="result-q">{i + 1}. {q.question}</span>
                    </div>
                    <div className="result-opts">
                      {['a','b','c','d'].map(opt => (
                        <div
                          key={opt}
                          className={`result-opt ${opt === q.answer ? 'correct-opt' : ''} ${answers[i] === opt && opt !== q.answer ? 'wrong-opt' : ''}`}
                        >
                          <span className="opt-letter">{opt.toUpperCase()}</span>
                          <span>{q.options?.[opt] || q[opt]}</span>
                          {opt === q.answer && <CheckCircle2 size={13} style={{ marginLeft: 'auto', color: 'var(--accent2)', flexShrink: 0 }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
