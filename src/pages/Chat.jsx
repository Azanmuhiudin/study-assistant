import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Trash2, BookOpen } from 'lucide-react'
import axios from 'axios'
import './Chat.css'

const STARTERS = [
  "Explain the Pythagorean theorem simply",
  "What caused World War I?",
  "How does photosynthesis work?",
  "Explain Newton's laws of motion",
]

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')

    const newMessages = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const { data } = await axios.post('/api/chat', { messages: newMessages })
      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: '⚠️ Could not connect to the backend. Make sure your server is running on port 3001.',
        error: true
      }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setInput('')
  }

  return (
    <div className="chat-page">
      <div className="chat-topbar">
        <div>
          <div className="page-label" style={{ padding: 0, marginBottom: 2 }}>AI Tutor</div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Chat with your tutor</h1>
        </div>
        {messages.length > 0 && (
          <button className="btn btn-ghost" onClick={clearChat} style={{ fontSize: 13, padding: '7px 14px' }}>
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty animate-fadeUp">
            <div className="chat-empty-icon">
              <BookOpen size={28} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="chat-empty-title">Ask your AI tutor anything</h2>
            <p className="chat-empty-sub">Get explanations, explore concepts, or work through problems.</p>
            <div className="starter-grid">
              {STARTERS.map(s => (
                <button key={s} className="starter-btn" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.role}`} style={{ animationDelay: `${i * 0.03}s` }}>
            <div className="msg-avatar">
              {msg.role === 'user'
                ? <User size={14} />
                : <Bot size={14} style={{ color: 'var(--accent)' }} />
              }
            </div>
            <div className={`msg-bubble ${msg.error ? 'msg-error' : ''}`}>
              {msg.content.split('\n').map((line, j) => {
                if (line.startsWith('## ')) return <h3 key={j} style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '10px 0 4px' }}>{line.slice(3)}</h3>
                if (line.startsWith('- ') || line.startsWith('• ')) return <li key={j} style={{ marginLeft: 14, marginBottom: 3, fontSize: 14, color: msg.role === 'user' ? 'inherit' : 'var(--text2)' }}>{line.slice(2)}</li>
                if (line.trim() === '') return <br key={j} />
                return <p key={j} style={{ marginBottom: 4, fontSize: 14, lineHeight: 1.65 }}>{line}</p>
              })}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg-row assistant">
            <div className="msg-avatar">
              <Bot size={14} style={{ color: 'var(--accent)' }} />
            </div>
            <div className="msg-bubble typing-bubble">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <div className="chat-input-wrap">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
            rows={1}
            style={{ resize: 'none', border: 'none', background: 'transparent', padding: '12px 0', minHeight: 'unset', lineHeight: 1.5 }}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
