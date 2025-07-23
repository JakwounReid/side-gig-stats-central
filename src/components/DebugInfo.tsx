import { useAuth } from '../contexts/AuthContext'
import { useSessions } from '../contexts/SessionContext'

const DebugInfo = () => {
  const { session, user, loading } = useAuth()
  const { sessions, loading: sessionsLoading, error } = useSessions()
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>Session: {session ? 'exists' : 'null'}</div>
        <div>User: {user ? user.email : 'null'}</div>
        <div>User ID: {user?.id || 'null'}</div>
        <div>Sessions Loading: {sessionsLoading ? 'true' : 'false'}</div>
        <div>Sessions Count: {sessions.length}</div>
        <div>Error: {error || 'none'}</div>
        <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? 'set' : 'missing'}</div>
        <div>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'set' : 'missing'}</div>
        <div>Origin: {window.location.origin}</div>
        <div>Environment: {import.meta.env.MODE}</div>
      </div>
    </div>
  )
}

export default DebugInfo 