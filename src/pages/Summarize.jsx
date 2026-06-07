import { useState, useRef } from 'react'
import { FileText, Sparkles, Copy, Check, AlertCircle, Upload, X, FileUp } from 'lucide-react'
import axios from 'axios'
import './Summarize.css'

export default function Summarize() {
  const [mode, setMode] = useState('text')
  const [text, setText] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleSummarize = async () => {
    setLoading(true)
    setError('')
    setSummary('')
    try {
      let data
      if (mode === 'pdf' && pdfFile) {
        const formData = new FormData()
        formData.append('pdf', pdfFile)
        const res = await axios.post('/api/summarize', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        data = res.data
      } else {
        const res = await axios.post('/api/summarize', { text })
        data = res.data
      }
      setSummary(data.summary)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to summarize. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
      setError('')
    } else {
      setError('Please upload a PDF file')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files[0])
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearPdf = () => {
    setPdfFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const canSummarize = mode === 'text' ? text.trim().length > 0 : pdfFile !== null

  return (
    <div>
      <div className="page-header">
        <div className="page-label">Summarize</div>
        <h1 className="page-title">Summarize your notes</h1>
        <p className="page-subtitle">Paste text or upload a PDF — Claude extracts the key ideas.</p>
      </div>

      <div className="page-body">
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
            onClick={() => setMode('text')}
          >
            <FileText size={15} /> Paste text
          </button>
          <button
            className={`mode-btn ${mode === 'pdf' ? 'active' : ''}`}
            onClick={() => setMode('pdf')}
          >
            <Upload size={15} /> Upload PDF
          </button>
        </div>

        <div className="summarize-layout">
          <div className="sum-panel card">
            <div className="sum-panel-header">
              <div className="sum-panel-title">
                {mode === 'text'
                  ? <><FileText size={16} style={{ color: 'var(--accent2)' }} /> Your notes</>
                  : <><FileUp size={16} style={{ color: 'var(--accent2)' }} /> PDF upload</>
                }
              </div>
              {mode === 'text' && wordCount > 0 && (
                <span className="word-count">{wordCount.toLocaleString()} words</span>
              )}
            </div>

            {mode === 'text' ? (
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste your lecture notes, textbook chapters, or any study material here..."
                style={{ minHeight: 280, border: 'none', background: 'transparent', padding: '12px 0', flex: 1 }}
              />
            ) : (
              <div
                className={`pdf-drop-zone ${dragOver ? 'drag-over' : ''} ${pdfFile ? 'has-file' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !pdfFile && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  style={{ display: 'none' }}
                  onChange={e => handleFileSelect(e.target.files[0])}
                />
                {pdfFile ? (
                  <div className="pdf-selected">
                    <div className="pdf-icon">
                      <FileText size={28} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div className="pdf-info">
                      <div className="pdf-name">{pdfFile.name}</div>
                      <div className="pdf-size">{(pdfFile.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button className="pdf-remove" onClick={e => { e.stopPropagation(); clearPdf() }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="pdf-empty">
                    <div className="pdf-upload-icon">
                      <Upload size={28} style={{ color: 'var(--text3)' }} />
                    </div>
                    <p className="pdf-drop-text">Drop your PDF here</p>
                    <p className="pdf-drop-sub">or click to browse</p>
                    <div className="pdf-hint">Max 10MB · Text-based PDFs only</div>
                  </div>
                )}
              </div>
            )}

            <div className="sum-actions">
              <button
                className="btn btn-primary"
                onClick={handleSummarize}
                disabled={loading || !canSummarize}
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                {loading
                  ? <><span className="spinner" /> Summarizing…</>
                  : <><Sparkles size={16} /> Summarize</>
                }
              </button>
            </div>
          </div>

          <div className="sum-panel card">
            <div className="sum-panel-header">
              <div className="sum-panel-title">
                <Sparkles size={16} style={{ color: 'var(--accent)' }} />
                Summary
              </div>
              {summary && (
                <button className="btn btn-ghost" onClick={handleCopy} style={{ padding: '6px 12px', fontSize: 13 }}>
                  {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
              )}
            </div>

            {error && (
              <div className="sum-error">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            {loading && (
              <div className="sum-loading">
                <div className="loading-lines">
                  {[90, 75, 85, 60, 80, 70, 88].map((w, i) => (
                    <div key={i} className="loading-line"
                      style={{ width: `${w}%`, animationDelay: `${i * 0.12}s` }} />
                  ))}
                </div>
              </div>
            )}

            {summary && !loading && (
              <div className="summary-content animate-fadeIn">
                {summary.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="sum-h2">{line.slice(3)}</h2>
                  if (line.startsWith('# ')) return <h1 key={i} className="sum-h1">{line.slice(2)}</h1>
                  if (line.startsWith('- ') || line.startsWith('• ')) return <li key={i} className="sum-li">{line.slice(2)}</li>
                  if (line.trim() === '') return <br key={i} />
                  return <p key={i} className="sum-p">{line}</p>
                })}
              </div>
            )}

            {!summary && !loading && !error && (
              <div className="sum-empty">
                <div className="sum-empty-icon">
                  <FileText size={32} style={{ color: 'var(--text3)' }} />
                </div>
                <p>Your summary will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}