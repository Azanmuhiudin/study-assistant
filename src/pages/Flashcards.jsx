import { useState } from 'react'
import { Layers, Sparkles, RotateCcw, ChevronLeft, ChevronRight, Check, X, AlertCircle } from 'lucide-react'
import axios from 'axios'
import './Flashcards.css'

export default function Flashcards() {
  const [text, setText] = useState('')
  const [cards, setCards] = useState([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState([])
  const [review, setReview] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const generate = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    setCards([])
    setKnown([])
    setReview([])
    setCurrent(0)
    setFlipped(false)
    setDone(false)
    try {
      const { data } = await axios.post('/api/flashcards', { text })
      setCards(data.flashcards)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to generate flashcards.')
    } finally {
      setLoading(false)
    }
  }

  const flip = () => setFlipped(f => !f)

  const markKnown = () => {
    setKnown(k => [...k, current])
    next()
  }

  const markReview = () => {
    setReview(r => [...r, current])
    next()
  }

  const next = () => {
    setFlipped(false)
    setTimeout(() => {
      if (current + 1 >= cards.length) setDone(true)
      else setCurrent(c => c + 1)
    }, 150)
  }

  const restart = () => {
    setCurrent(0)
    setFlipped(false)
    setKnown([])
    setReview([])
    setDone(false)
  }

  const progress = cards.length ? ((known.length + review.length) / cards.length) * 100 : 0

  return (
    <div>
      <div className="page-header">
        <div className="page-label">Flashcards</div>
        <h1 className="page-title">Flashcard generator</h1>
        <p className="page-subtitle">Paste any text — Claude turns it into study flashcards.</p>
      </div>

      <div className="page-body">
        {/* Setup */}
        {cards.length === 0 && !loading && (
          <div className="fc-setup animate-fadeUp">
            <div className="card">
              <div className="sum-panel-title" style={{ marginBottom: 12 }}>
                <Layers size={16} style={{ color: 'var(--accent2)' }} />
                Your study material
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste your notes, summary, or any study material here..."
                style={{ minHeight: 200 }}
              />
              {error && (
                <div className="sum-error" style={{ marginTop: 12 }}>
                  <AlertCircle size={15} /> {error}
                </div>
              )}
              <button
                className="btn btn-primary"
                onClick={generate}
                disabled={!text.trim()}
                style={{ marginTop: 16, width: '100%', justifyContent: 'center', padding: '13px' }}
              >
                <Sparkles size={16} /> Generate flashcards
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="fc-loading animate-fadeUp">
            <div className="fc-loading-icon">
              <Layers size={32} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="fc-loading-text">Generating flashcards…</p>
            <div className="fc-loading-dots">
              <span /><span /><span />
            </div>
          </div>
        )}

        {/* Active cards */}
        {cards.length > 0 && !done && (
          <div className="fc-active animate-fadeUp">
            {/* Progress */}
            <div className="fc-progress-wrap">
              <div className="fc-progress-bar">
                <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="fc-progress-meta">
                <span className="fc-card-count">{current + 1} / {cards.length}</span>
                <div className="fc-legend">
                  <span className="fc-known-count"><Check size={12} /> {known.length} known</span>
                  <span className="fc-review-count"><RotateCcw size={12} /> {review.length} review</span>
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="fc-card-wrap" onClick={flip}>
              <div className={`fc-card ${flipped ? 'flipped' : ''}`}>
                <div className="fc-card-front">
                  <div className="fc-card-label">Question</div>
                  <p className="fc-card-text">{cards[current]?.front}</p>
                  <div className="fc-tap-hint">Tap to reveal answer</div>
                </div>
                <div className="fc-card-back">
                  <div className="fc-card-label" style={{ color: 'var(--accent2)' }}>Answer</div>
                  <p className="fc-card-text">{cards[current]?.back}</p>
                  <div className="fc-tap-hint">Tap to flip back</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="fc-actions">
              <button className="fc-btn fc-btn-review" onClick={markReview}>
                <X size={20} /> Still learning
              </button>
              <button className="fc-btn fc-btn-known" onClick={markKnown}>
                <Check size={20} /> Got it!
              </button>
            </div>

            <div className="fc-nav">
              <button className="btn btn-ghost" onClick={() => { setFlipped(false); setTimeout(() => setCurrent(c => Math.max(0, c-1)), 150) }} disabled={current === 0}>
                <ChevronLeft size={15} /> Previous
              </button>
              <button className="btn btn-ghost" onClick={next} disabled={current >= cards.length - 1}>
                Skip <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Done screen */}
        {done && (
          <div className="fc-done animate-fadeUp">
            <div className="fc-done-icon">🎉</div>
            <h2 className="fc-done-title">Session complete!</h2>
            <p className="fc-done-sub">You went through all {cards.length} flashcards</p>
            <div className="fc-done-stats">
              <div className="fc-done-stat known">
                <Check size={20} />
                <span className="fc-done-num">{known.length}</span>
                <span className="fc-done-label">Known</span>
              </div>
              <div className="fc-done-stat review">
                <RotateCcw size={20} />
                <span className="fc-done-num">{review.length}</span>
                <span className="fc-done-label">Need review</span>
              </div>
            </div>
            <div className="fc-done-actions">
              <button className="btn btn-primary" onClick={restart}>
                <RotateCcw size={15} /> Study again
              </button>
              <button className="btn btn-secondary" onClick={() => { setCards([]); setText('') }}>
                New flashcards
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}