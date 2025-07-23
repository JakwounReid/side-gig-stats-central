import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSessions } from '../contexts/SessionContext'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { DashboardHeader } from './DashboardHeader'
import { StatsCard } from './StatsCard'
import { PlatformCard } from './PlatformCard'
import { EarningsChart } from './EarningsChart'
import { SessionLogForm } from './SessionLogForm'
import { SessionHistory } from './SessionHistory'
import { ProfileDropdown } from './ProfileDropdown'
import { ExportDialog } from './ExportDialog'
import ImportDialog from './ImportDialog'
import { DollarSign, Clock, Navigation, TrendingUp, AlertCircle, Calendar, Download, Upload } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { getCurrentDate, formatDateString } from '@/lib/utils'
import { exportToCSV, generateExportFilename } from '@/lib/export'

type TimePeriod = 'day' | 'week' | 'month' | 'year'

const Dashboard = () => {
  const { sessions, getTotalStats, getPlatformStats, getWeeklySessions, addSession, addMultipleSessions, loading, error } = useSessions()
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState(getCurrentDate())
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day')
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const handleSessionSubmit = async (sessionData: any) => {
    setIsSubmitting(true)
    try {
      await addSession(sessionData)
      setIsSessionFormOpen(false)
      // Update selected date to show the newly logged session
      setSelectedDate(sessionData.date)
    } catch (error) {
      console.error('Error adding session:', error)
      // Error is handled by the context
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExportData = () => {
    setIsExportDialogOpen(true)
  }

  const handleConfirmExport = (startDate: string, endDate: string) => {
    setIsExporting(true)
    try {
      const filteredSessions = sessions.filter(session => 
        session.date >= startDate && session.date <= endDate
      )
      const filename = generateExportFilename(startDate, endDate)
      exportToCSV(filteredSessions, filename)
      setIsExportDialogOpen(false)
    } catch (error) {
      console.error('Error exporting data:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportData = () => {
    setIsImportDialogOpen(true)
  }

  const handleConfirmImport = async (sessionsData: any[]) => {
    try {
      await addMultipleSessions(sessionsData)
      setIsImportDialogOpen(false)
    } catch (error) {
      console.error('Error importing data:', error)
    }
  }

  // Helper function to get sessions for a specific time period
  const getSessionsForPeriod = (period: TimePeriod, date: string) => {
    const targetDate = new Date(date)
    
    switch (period) {
      case 'day':
        return sessions.filter(session => session.date === date)
      
      case 'week':
        const weekStart = new Date(targetDate)
        weekStart.setDate(targetDate.getDate() - targetDate.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        
        return sessions.filter(session => {
          const sessionDate = new Date(session.date)
          return sessionDate >= weekStart && sessionDate <= weekEnd
        })
      
      case 'month':
        const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
        const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)
        
        return sessions.filter(session => {
          const sessionDate = new Date(session.date)
          return sessionDate >= monthStart && sessionDate <= monthEnd
        })
      
      case 'year':
        const yearStart = new Date(targetDate.getFullYear(), 0, 1)
        const yearEnd = new Date(targetDate.getFullYear(), 11, 31)
        
        return sessions.filter(session => {
          const sessionDate = new Date(session.date)
          return sessionDate >= yearStart && sessionDate <= yearEnd
        })
      
      default:
        return sessions.filter(session => session.date === date)
    }
  }

  // Get stats for the selected period
  const getStatsForPeriod = (period: TimePeriod, date: string) => {
    const periodSessions = getSessionsForPeriod(period, date)
    
    return periodSessions.reduce((acc, session) => ({
      earnings: acc.earnings + session.earnings,
      hours: acc.hours + session.hours,
      miles: acc.miles + session.miles,
      trips: acc.trips + 1
    }), { earnings: 0, hours: 0, miles: 0, trips: 0 })
  }

  // Get platform stats for the selected period
  const getPlatformStatsForPeriod = (period: TimePeriod, date: string) => {
    const periodSessions = getSessionsForPeriod(period, date)
    
    return periodSessions.reduce((acc, session) => {
      if (!acc[session.platform]) {
        acc[session.platform] = { earnings: 0, hours: 0, trips: 0 }
      }
      acc[session.platform].earnings += session.earnings
      acc[session.platform].hours += session.hours
      acc[session.platform].trips += 1
      return acc
    }, {} as { [key: string]: { earnings: number; hours: number; trips: number } })
  }

  // Get real data from sessions using the selected period
  const totalStats = getStatsForPeriod(selectedPeriod, selectedDate)
  const platformStats = getPlatformStatsForPeriod(selectedPeriod, selectedDate)
  const weeklySessions = getWeeklySessions()

  // Calculate weekly totals
  const weeklyStats = weeklySessions.reduce((acc, session) => ({
    earnings: acc.earnings + session.earnings,
    hours: acc.hours + session.hours,
    miles: acc.miles + session.miles,
    trips: acc.trips + 1
  }), { earnings: 0, hours: 0, miles: 0, trips: 0 })

  const weeklyAvgHourly = weeklyStats.hours > 0 ? weeklyStats.earnings / weeklyStats.hours : 0

  // Helper function to get period label
  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 'day': return 'Day'
      case 'week': return 'Week'
      case 'month': return 'Month'
      case 'year': return 'Year'
      default: return 'Day'
    }
  }

  // Platform colors mapping
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

  // Convert platform stats to array for rendering
  const platformData = Object.entries(platformStats).map(([name, stats]) => ({
    name,
    earnings: stats.earnings,
    hours: stats.hours,
    trips: stats.trips,
    color: platformColors[name] || '#6B7280'
  }))

  // Get unique dates from sessions for the date selector
  const availableDates = [...new Set(sessions.map(s => s.date))].sort().reverse()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Profile Dropdown */}
      <ProfileDropdown />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}



        {/* Dashboard Header */}
        <div className="mb-8">
          <DashboardHeader />
          <div className="flex justify-between items-center mt-4">
            {/* Period and Date Selectors */}
            <div className="flex items-center gap-4">
              {/* Period Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
                  className="bg-background border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
              
              {/* Date Selector */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {availableDates.length > 0 ? (
                    availableDates.map(date => (
                      <option key={date} value={date}>
                        {formatDateString(date)}
                      </option>
                    ))
                  ) : (
                    <option value={getCurrentDate()}>Today</option>
                  )}
                </select>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleImportData}
                variant="outline"
                size="lg"
                className="border-border hover:bg-muted"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <Button 
                onClick={handleExportData}
                variant="outline"
                size="lg"
                className="border-border hover:bg-muted"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button 
                onClick={() => setIsSessionFormOpen(true)}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-card"
                size="lg"
              >
                Log Work Session
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mb-8">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your sessions...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title={`${getPeriodLabel(selectedPeriod)}'s Earnings`}
            value={`$${totalStats.earnings.toFixed(2)}`}
            icon={DollarSign}
            iconColor="text-earnings"
          />
          <StatsCard
            title="Hours Worked"
            value={totalStats.hours.toFixed(1)}
            icon={Clock}
            iconColor="text-time"
          />
          <StatsCard
            title="Miles Driven"
            value={totalStats.miles.toFixed(0)}
            icon={Navigation}
            iconColor="text-mileage"
          />
          <StatsCard
            title="Total Trips"
            value={totalStats.trips.toString()}
            icon={TrendingUp}
            iconColor="text-primary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Platform Cards */}
          <div className="lg:col-span-2 space-y-6">
            {platformData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platformData.map((platform) => (
                  <PlatformCard
                    key={platform.name}
                    name={platform.name}
                    earnings={platform.earnings}
                    hours={platform.hours}
                    trips={platform.trips}
                    color={platform.color}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-card shadow-card p-8 text-center">
                <p className="text-muted-foreground">
                  No sessions logged for this {selectedPeriod}
                </p>
              </Card>
            )}
            
            {/* Earnings Chart */}
            <EarningsChart />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session History */}
            <SessionHistory limit={5} />
            
            {/* Weekly Summary Card */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>This Week</CardTitle>
                <CardDescription>Performance summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Earnings</span>
                  <span className="font-semibold">${weeklyStats.earnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hours Worked</span>
                  <span className="font-semibold">{weeklyStats.hours.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Hourly</span>
                  <span className="font-semibold">${weeklyAvgHourly.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Trips</span>
                  <span className="font-semibold">{weeklyStats.trips}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Session Log Form Dialog */}
      <SessionLogForm
        onSubmit={handleSessionSubmit}
        isOpen={isSessionFormOpen}
        onClose={() => setIsSessionFormOpen(false)}
        isSubmitting={isSubmitting}
      />

      {/* Export Dialog */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onConfirm={handleConfirmExport}
        sessions={sessions}
        isExporting={isExporting}
      />

      {/* Import Dialog */}
      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleConfirmImport}
      />
    </div>
  )
}

export default Dashboard