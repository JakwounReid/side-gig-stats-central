import { useAuth } from '../contexts/AuthContext'
import { useSessions } from '../contexts/SessionContext'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ProfileDropdown } from './ProfileDropdown'
import { supabase } from '../lib/supabase'

const SimpleDashboard = () => {
  const { user } = useAuth()
  const { sessions, loading, error } = useSessions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Profile Dropdown */}
      <ProfileDropdown />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Side Gig Stats Central
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">User ID: {user?.id || 'Not set'}</p>
              <p className="text-sm text-muted-foreground">Email: {user?.email || 'Not set'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Loading: {loading ? 'Yes' : 'No'}</p>
              <p className="text-sm text-muted-foreground">Sessions: {sessions.length}</p>
              {error && (
                <p className="text-sm text-red-500 mt-2">Error: {error}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing'}
              </p>
              <p className="text-sm text-muted-foreground">
                Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No sessions found</p>
                <p className="text-sm text-muted-foreground">
                  This could mean:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• You haven't logged any work sessions yet</li>
                  <li>• There's a database connection issue</li>
                  <li>• The sessions table doesn't exist</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div key={session.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{session.platform}</p>
                      <p className="text-sm text-muted-foreground">{session.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${session.earnings}</p>
                      <p className="text-sm text-muted-foreground">{session.hours}h</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Refresh Page
          </Button>
          <Button 
            onClick={() => console.log('Current state:', { user, sessions, loading, error })}
            variant="outline"
          >
            Log State to Console
          </Button>
          <Button 
            onClick={() => {
              console.log('Manual refresh triggered')
              // Force a refresh of sessions
              if (user?.id) {
                console.log('Attempting to fetch sessions for user:', user.id)
                // This will trigger the useEffect in SessionContext
                window.location.reload()
              }
            }}
            variant="outline"
          >
            Test Session Fetch
          </Button>
          <Button 
            onClick={async () => {
              console.log('Testing Supabase connection...')
              try {
                const { data, error } = await supabase
                  .from('sessions')
                  .select('count')
                  .limit(1)
                
                console.log('Supabase test result:', { data, error })
                alert(`Supabase test: ${error ? 'Error: ' + error.message : 'Success! Data: ' + JSON.stringify(data)}`)
              } catch (err) {
                console.error('Supabase test error:', err)
                alert('Supabase test failed: ' + err)
              }
            }}
            variant="outline"
          >
            Test Supabase
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SimpleDashboard 