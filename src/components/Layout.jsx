import { NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, MessageCircle, BrainCircuit, FileText, Zap, Layers, BarChart2, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import './Layout.css'

const navItems = [
  { to: '/', icon: Zap, label: 'Home', exact: true },
  { to: '/summarize', icon: FileText, label: 'Summarize' },
  { to: '/chat', icon: MessageCircle, label: 'AI Tutor' },
  { to: '/quiz', icon: BrainCircuit, label: 'Quiz' },
  { to: '/flashcards', icon: Layers, label: 'Flashcards' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <BookOpen size={22} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
          <span className="logo-text">StudyMind</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="user-card">
              <div className="user-avatar">{user.avatar}</div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={15} />
              </button>
            </div>
          )}
          <div className="ai-badge">
            <span className="ai-dot" />
            Powered by Claude
          </div>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}