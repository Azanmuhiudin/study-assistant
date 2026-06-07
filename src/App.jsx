import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './Context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import Quiz from './pages/Quiz.jsx'
import Summarize from './pages/Summarize.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Progress from './pages/Progress.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="app-loading"><span className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/summarize" element={<Summarize />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/progress" element={<Progress />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}