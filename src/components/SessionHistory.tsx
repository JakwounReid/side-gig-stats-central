import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Trash2, Clock, DollarSign, Navigation } from 'lucide-react'
import { useSessions, SessionData } from '../contexts/SessionContext'
import { formatDateString } from '../lib/utils'

interface SessionHistoryProps {
  limit?: number
}

export const SessionHistory = ({ limit }: SessionHistoryProps) => {
  const { sessions, deleteSession } = useSessions()

  const platformColors: { [key: string]: string } = {
    'Uber': '#000000',
    'DoorDash': '#FF6000',
    'Lyft': '#FF00BF',
    'Instacart': '#43B02A',
    'Grubhub': '#F63440',
    'Postmates': '#000000',
    'Shipt': '#0077CC',
    'Other': '#6B7280'
  }

  const displaySessions = limit ? sessions.slice(0, limit) : sessions

  const handleDeleteSession = (id: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      deleteSession(id)
    }
  }

  if (sessions.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No sessions logged yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>Your latest work sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displaySessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/50"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: platformColors[session.platform] || '#6B7280' }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{session.platform}</span>
                    <Badge variant="secondary" className="text-xs">
                      {formatDateString(session.date)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>${session.earnings.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{session.hours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      <span>{session.miles}mi</span>
                    </div>
                  </div>
                  {session.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {session.notes}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteSession(session.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 