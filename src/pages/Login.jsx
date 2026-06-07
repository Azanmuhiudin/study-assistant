import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../Context/AuthContext.jsx'
import './Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email || !password) return setError('Please fill in all fields')
    setLoading(true)
    setError('')
    try {
      login(email, password)
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

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue studying</p>

        {error && (
          <div className="auth-error">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label">Email</label>
          <div className="auth-input-wrap">
            <Mail size={16} className="auth-input-icon" />
            <input
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
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
              placeholder="••••••••"
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
          {loading ? <><span className="spinner" /> Signing in…</> : 'Sign in'}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}