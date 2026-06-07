import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('studymind_user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('studymind_users') || '[]')
    const exists = users.find(u => u.email === email)
    if (exists) throw new Error('Email already registered')
    const newUser = { id: Date.now(), name, email, password, avatar: name[0].toUpperCase(), createdAt: new Date().toISOString() }
    users.push(newUser)
    localStorage.setItem('studymind_users', JSON.stringify(users))
    const { password: _, ...safeUser } = newUser
    localStorage.setItem('studymind_user', JSON.stringify(safeUser))
    setUser(safeUser)
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('studymind_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    const { password: _, ...safeUser } = found
    localStorage.setItem('studymind_user', JSON.stringify(safeUser))
    setUser(safeUser)
  }

  const logout = () => {
    localStorage.removeItem('studymind_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)