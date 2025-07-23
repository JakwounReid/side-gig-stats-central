import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { sessionsService } from '../lib/sessions'
import { useAuth } from './AuthContext'
import { getCurrentDate } from '../lib/utils'

export interface SessionData {
  id: string
  platform: string
  earnings: number
  hours: number
  miles: number
  date: string
  notes?: string
  createdAt: string
}

interface SessionContextType {
  sessions: SessionData[]
  loading: boolean
  error: string | null
  addSession: (session: Omit<SessionData, 'id' | 'createdAt'>) => Promise<void>
  addMultipleSessions: (sessions: Omit<SessionData, 'id' | 'createdAt'>[]) => Promise<void>
  deleteSession: (id: string) => Promise<void>
  updateSession: (id: string, updates: Partial<Omit<SessionData, 'id' | 'createdAt'>>) => Promise<void>
  refreshSessions: () => Promise<void>
  getTodaySessions: () => SessionData[]
  getWeeklySessions: () => SessionData[]
  getPlatformStats: () => { [key: string]: { earnings: number; hours: number; trips: number } }
  getTotalStats: () => { earnings: number; hours: number; miles: number; trips: number }
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useSessions = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSessions must be used within a SessionProvider')
  }
  return context
}

interface SessionProviderProps {
  children: ReactNode
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load sessions when user changes
  useEffect(() => {
    if (user?.id) {
      refreshSessions()
    } else {
      setSessions([])
    }
  }, [user?.id])

  const refreshSessions = async () => {
    if (!user?.id) return

    setLoading(true)
    setError(null)
    
    try {
      const userSessions = await sessionsService.getUserSessions(user.id)
      setSessions(userSessions)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sessions'
      console.error('Error loading sessions:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const addSession = async (sessionData: Omit<SessionData, 'id' | 'createdAt'>) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    setError(null)
    
    try {
      const newSession = await sessionsService.addSession(sessionData, user.id)
      setSessions(prev => [newSession, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add session')
      throw err
    }
  }

  const addMultipleSessions = async (sessionsData: Omit<SessionData, 'id' | 'createdAt'>[]) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    setError(null)
    
    try {
      const newSessions = await Promise.all(
        sessionsData.map(sessionData => sessionsService.addSession(sessionData, user.id))
      )
      setSessions(prev => [...newSessions, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import sessions')
      throw err
    }
  }

  const deleteSession = async (id: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    setError(null)
    
    try {
      await sessionsService.deleteSession(id, user.id)
      setSessions(prev => prev.filter(session => session.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete session')
      throw err
    }
  }

  const updateSession = async (id: string, updates: Partial<Omit<SessionData, 'id' | 'createdAt'>>) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    setError(null)
    
    try {
      const updatedSession = await sessionsService.updateSession(id, updates, user.id)
      setSessions(prev => prev.map(session => 
        session.id === id ? updatedSession : session
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update session')
      throw err
    }
  }

  const getTodaySessions = () => {
    const today = getCurrentDate()
    return sessions.filter(session => session.date === today)
  }

  const getWeeklySessions = () => {
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return sessions.filter(session => {
      const sessionDate = new Date(session.date)
      return sessionDate >= weekAgo && sessionDate <= today
    })
  }

  const getPlatformStats = () => {
    const today = getCurrentDate()
    const todaySessions = sessions.filter(session => session.date === today)
    
    return todaySessions.reduce((acc, session) => {
      if (!acc[session.platform]) {
        acc[session.platform] = { earnings: 0, hours: 0, trips: 0 }
      }
      acc[session.platform].earnings += session.earnings
      acc[session.platform].hours += session.hours
      acc[session.platform].trips += 1
      return acc
    }, {} as { [key: string]: { earnings: number; hours: number; trips: number } })
  }

  const getTotalStats = () => {
    const today = getCurrentDate()
    const todaySessions = sessions.filter(session => session.date === today)
    
    return todaySessions.reduce((acc, session) => ({
      earnings: acc.earnings + session.earnings,
      hours: acc.hours + session.hours,
      miles: acc.miles + session.miles,
      trips: acc.trips + 1
    }), { earnings: 0, hours: 0, miles: 0, trips: 0 })
  }

  const value = {
    sessions,
    loading,
    error,
    addSession,
    addMultipleSessions,
    deleteSession,
    updateSession,
    refreshSessions,
    getTodaySessions,
    getWeeklySessions,
    getPlatformStats,
    getTotalStats
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
} 