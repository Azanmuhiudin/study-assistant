import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, User, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../Context/AuthContext.jsx'
import './Auth.css'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!name || !email || !password) return setError('Please fill in all fields')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setError('')
    try {
      signup(name, email, password)
      navigate('/')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card animate-fadeUp">
        <div className="auth-logo">
          <BookOpen size={28} style={{ color: 'var(--accent)' }} />
          <span className="logo-text">StudyMind</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start your AI study journey today</p>

        {error && (
          <div className="auth-error">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label">Full name</label>
          <div className="auth-input-wrap">
            <User size={16} className="auth-input-icon" />
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label">Email</label>
          <div className="auth-input-wrap">
            <Mail size={16} className="auth-input-icon" />
            <input
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label">Password</label>
          <div className="auth-input-wrap">
            <Lock size={16} className="auth-input-icon" />
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        <button
          className="btn btn-primary auth-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <><span className="spinner" /> Creating account…</> : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}