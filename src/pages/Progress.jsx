import { useState, useEffect } from 'react'
import { BarChart2, Trophy, Target, Flame, RotateCcw, Plus } from 'lucide-react'
import './Progress.css'

const STORAGE_KEY = 'studymind_quiz_history'

export default function Progress() {
  const [history, setHistory] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ topic: '', score: '', total: '' })

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const save = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setHistory(data)
  }

  const addEntry = () => {
    if (!form.topic || !form.score || !form.total) return
    const entry = {
      id: Date.now(),
      topic: form.topic,
      score: Number(form.score),
      total: Number(form.total),
      pct: Math.round((Number(form.score) / Number(form.total)) * 100),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    const updated = [entry, ...history]
    save(updated)
    setForm({ topic: '', score: '', total: '' })
    setShowAdd(false)
  }

  const deleteEntry = (id) => {
    save(history.filter(h => h.id !== id))
  }

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }

  // Stats
  const avgScore = history.length
    ? Math.round(history.reduce((a, b) => a + b.pct, 0) / history.length)
    : 0
  const best = history.length ? Math.max(...history.map(h => h.pct)) : 0
  const streak = history.filter(h => h.pct >= 70).length

  // Chart data — last 7 entries reversed
  const chartData = [...history].reverse().slice(-7)
  const maxPct = 100

  return (
    <div>
      <div className="page-header">
        <div className="page-label">Progress</div>
        <h1 className="page-title">Your progress</h1>
        <p className="page-subtitle">Track your quiz scores and see how you improve over time.</p>
      </div>

      <div className="page-body">
        {/* Stats row */}
        <div className="pg-stats animate-fadeUp">
          <div className="pg-stat-card card">
            <div className="pg-stat-icon" style={{ background: 'rgba(124,106,247,0.1)' }}>
              <Target size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <div className="pg-stat-num">{avgScore}%</div>
              <div className="pg-stat-label">Average score</div>
            </div>
          </div>
          <div className="pg-stat-card card">
            <div className="pg-stat-icon" style={{ background: 'rgba(247,194,106,0.1)' }}>
              <Trophy size={20} style={{ color: 'var(--accent3)' }} />
            </div>
            <div>
              <div className="pg-stat-num">{best}%</div>
              <div className="pg-stat-label">Best score</div>
            </div>
          </div>
          <div className="pg-stat-card card">
            <div className="pg-stat-icon" style={{ background: 'rgba(93,220,184,0.1)' }}>
              <Flame size={20} style={{ color: 'var(--accent2)' }} />
            </div>
            <div>
              <div className="pg-stat-num">{streak}</div>
              <div className="pg-stat-label">Passed quizzes</div>
            </div>
          </div>
          <div className="pg-stat-card card">
            <div className="pg-stat-icon" style={{ background: 'rgba(124,106,247,0.1)' }}>
              <BarChart2 size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <div className="pg-stat-num">{history.length}</div>
              <div className="pg-stat-label">Total quizzes</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="card pg-chart animate-fadeUp" style={{ marginBottom: 20 }}>
            <div className="pg-chart-title">Score history (last 7)</div>
            <div className="pg-bars">
              {chartData.map((entry, i) => (
                <div key={entry.id} className="pg-bar-wrap" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="pg-bar-label-top">{entry.pct}%</div>
                  <div className="pg-bar-track">
                    <div
                      className="pg-bar-fill"
                      style={{
                        height: `${(entry.pct / maxPct) * 100}%`,
                        background: entry.pct >= 80
                          ? 'linear-gradient(180deg, var(--accent2), rgba(93,220,184,0.5))'
                          : entry.pct >= 60
                          ? 'linear-gradient(180deg, var(--accent), rgba(124,106,247,0.5))'
                          : 'linear-gradient(180deg, var(--danger), rgba(247,106,106,0.5))'
                      }}
                    />
                  </div>
                  <div className="pg-bar-label">{entry.topic.slice(0, 8)}</div>
                  <div className="pg-bar-date">{entry.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add entry + history */}
        <div className="pg-actions animate-fadeUp">
          <button className="btn btn-primary" onClick={() => setShowAdd(s => !s)}>
            <Plus size={15} /> Log quiz result
          </button>
          {history.length > 0 && (
            <button className="btn btn-ghost" onClick={clearAll}>
              <RotateCcw size={14} /> Clear all
            </button>
          )}
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="card pg-form animate-fadeUp">
            <div className="pg-form-title">Log a quiz result</div>
            <div className="pg-form-row">
              <div style={{ flex: 2 }}>
                <label className="setup-label">Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Photosynthesis"
                  value={form.topic}
                  onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="setup-label">Score</label>
                <input
                  type="text"
                  placeholder="e.g. 4"
                  value={form.score}
                  onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="setup-label">Out of</label>
                <input
                  type="text"
                  placeholder="e.g. 5"
                  value={form.total}
                  onChange={e => setForm(f => ({ ...f, total: e.target.value }))}
                />
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={addEntry}
              disabled={!form.topic || !form.score || !form.total}
              style={{ marginTop: 16 }}
            >
              Save result
            </button>
          </div>
        )}

        {/* History list */}
        {history.length === 0 && (
          <div className="pg-empty card animate-fadeUp">
            <div className="pg-empty-icon">📊</div>
            <p className="pg-empty-text">No quiz results yet</p>
            <p className="pg-empty-sub">Take a quiz and log your score to start tracking progress</p>
          </div>
        )}

        {history.length > 0 && (
          <div className="pg-history animate-fadeUp">
            {history.map((entry, i) => (
              <div key={entry.id} className="pg-entry card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="pg-entry-left">
                  <div className="pg-entry-topic">{entry.topic}</div>
                  <div className="pg-entry-date">{entry.date}</div>
                </div>
                <div className="pg-entry-right">
                  <div className="pg-entry-bar-wrap">
                    <div className="pg-entry-bar">
                      <div
                        className="pg-entry-bar-fill"
                        style={{
                          width: `${entry.pct}%`,
                          background: entry.pct >= 80
                            ? 'var(--accent2)'
                            : entry.pct >= 60
                            ? 'var(--accent)'
                            : 'var(--danger)'
                        }}
                      />
                    </div>
                    <span className="pg-entry-pct" style={{
                      color: entry.pct >= 80 ? 'var(--accent2)' : entry.pct >= 60 ? 'var(--accent)' : 'var(--danger)'
                    }}>
                      {entry.pct}%
                    </span>
                  </div>
                  <span className="pg-entry-score">{entry.score}/{entry.total}</span>
                </div>
                <button className="pg-delete" onClick={() => deleteEntry(entry.id)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}