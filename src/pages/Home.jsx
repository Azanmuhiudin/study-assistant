import { Link } from 'react-router-dom'
import { FileText, MessageCircle, BrainCircuit, ArrowRight, Sparkles } from 'lucide-react'
import './Home.css'

const features = [
  {
    to: '/summarize',
    icon: FileText,
    color: 'var(--accent2)',
    colorBg: 'rgba(93,220,184,0.1)',
    title: 'Summarize Notes',
    desc: 'Paste your study material and get a clean, structured summary with key concepts highlighted.',
    tag: 'Upload & Go',
  },
  {
    to: '/chat',
    icon: MessageCircle,
    color: 'var(--accent)',
    colorBg: 'rgba(124,106,247,0.1)',
    title: 'AI Tutor Chat',
    desc: 'Ask questions, explore concepts, and get explained in the way that clicks for you.',
    tag: 'Multi-turn',
  },
  {
    to: '/quiz',
    icon: BrainCircuit,
    color: 'var(--accent3)',
    colorBg: 'rgba(247,194,106,0.1)',
    title: 'Quiz Generator',
    desc: 'Turn any topic into a multiple-choice quiz. Test yourself and get instant feedback.',
    tag: 'Interactive',
  },
]

export default function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="hero-badge">
          <Sparkles size={12} />
          AI-Powered Study Tool
        </div>
        <h1 className="hero-title">
          Study smarter,<br />
          <span className="hero-accent">not harder.</span>
        </h1>
        <p className="hero-subtitle">
          Your personal AI study companion — summarize notes,<br />
          chat with a tutor, and test your knowledge.
        </p>
      </div>

      <div className="feature-grid">
        {features.map(({ to, icon: Icon, color, colorBg, title, desc, tag }) => (
          <Link key={to} to={to} className="feature-card">
            <div className="feature-icon-wrap" style={{ background: colorBg }}>
              <Icon size={22} style={{ color }} strokeWidth={2} />
            </div>
            <div className="feature-tag" style={{ color, background: colorBg }}>
              {tag}
            </div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{desc}</p>
            <div className="feature-cta" style={{ color }}>
              Get started <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      <div className="home-stats">
        <div className="stat">
          <span className="stat-num">3</span>
          <span className="stat-label">Study modes</span>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <span className="stat-num">∞</span>
          <span className="stat-label">Topics supported</span>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <span className="stat-num">Claude</span>
          <span className="stat-label">AI engine</span>
        </div>
      </div>
    </div>
  )
}
