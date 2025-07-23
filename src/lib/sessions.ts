import { supabase } from './supabase'
import { SessionData } from '../contexts/SessionContext'

export interface DBSessionData {
  id: string
  user_id: string
  platform: string
  earnings: number
  hours: number
  miles: number
  date: string
  notes?: string
  created_at: string
}

// Convert SessionData to DBSessionData
const toDBSession = (session: Omit<SessionData, 'id' | 'createdAt'>, userId: string): Omit<DBSessionData, 'id' | 'created_at'> => ({
  user_id: userId,
  platform: session.platform,
  earnings: session.earnings,
  hours: session.hours,
  miles: session.miles,
  date: session.date,
  notes: session.notes
})

// Convert DBSessionData to SessionData
const fromDBSession = (dbSession: DBSessionData): SessionData => ({
  id: dbSession.id,
  platform: dbSession.platform,
  earnings: dbSession.earnings,
  hours: dbSession.hours,
  miles: dbSession.miles,
  date: dbSession.date,
  notes: dbSession.notes,
  createdAt: dbSession.created_at
})

export const sessionsService = {
  // Get all sessions for a user
  async getUserSessions(userId: string): Promise<SessionData[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sessions:', error)
      throw error
    }

    return data?.map(fromDBSession) || []
  },

  // Add a new session
  async addSession(session: Omit<SessionData, 'id' | 'createdAt'>, userId: string): Promise<SessionData> {
    const dbSession = toDBSession(session, userId)
    
    const { data, error } = await supabase
      .from('sessions')
      .insert([dbSession])
      .select()
      .single()

    if (error) {
      console.error('Error adding session:', error)
      throw error
    }

    return fromDBSession(data)
  },

  // Delete a session
  async deleteSession(sessionId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId) // Ensure user can only delete their own sessions

    if (error) {
      console.error('Error deleting session:', error)
      throw error
    }
  },

  // Update a session
  async updateSession(sessionId: string, updates: Partial<Omit<SessionData, 'id' | 'createdAt'>>, userId: string): Promise<SessionData> {
    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', sessionId)
      .eq('user_id', userId) // Ensure user can only update their own sessions
      .select()
      .single()

    if (error) {
      console.error('Error updating session:', error)
      throw error
    }

    return fromDBSession(data)
  }
} 