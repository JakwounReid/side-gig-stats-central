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
import { DateRangePicker } from './DateRangePicker'
import { DollarSign, Clock, Navigation, TrendingUp, AlertCircle, Download, Upload } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { getCurrentDate, formatDateString } from '@/lib/utils'
import { exportToCSV, generateExportFilename } from '@/lib/export'

const Dashboard = () => {
  const { sessions, getTotalStats, getPlatformStats, getWeeklySessions, addSession, addMultipleSessions, loading, error } = useSessions()
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const handleSessionSubmit = async (sessionData: any) => {
    setIsSubmitting(true)
    try {
      await addSession(sessionData)
      setIsSessionFormOpen(false)
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

  // Helper function to get sessions for a specific date range
  const getSessionsForDateRange = (start: Date | undefined, end: Date | undefined) => {
    if (!start || !end) {
      // If no date range is selected, return all sessions
      return sessions
    }
    
    // Set time to start of day for start date and end of day for end date
    const startOfDay = new Date(start)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(end)
    endOfDay.setHours(23, 59, 59, 999)
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.date)
      return sessionDate >= startOfDay && sessionDate <= endOfDay
    })
  }

  // Get stats for the selected date range
  const getStatsForDateRange = (start: Date | undefined, end: Date | undefined) => {
    const rangeSessions = getSessionsForDateRange(start, end)
    
    return rangeSessions.reduce((acc, session) => ({
      earnings: acc.earnings + session.earnings,
      hours: acc.hours + session.hours,
      miles: acc.miles + session.miles,
      trips: acc.trips + 1
    }), { earnings: 0, hours: 0, miles: 0, trips: 0 })
  }

  // Get platform stats for the selected date range
  const getPlatformStatsForDateRange = (start: Date | undefined, end: Date | undefined) => {
    const rangeSessions = getSessionsForDateRange(start, end)
    
    return rangeSessions.reduce((acc, session) => {
      if (!acc[session.platform]) {
        acc[session.platform] = { earnings: 0, hours: 0, trips: 0 }
      }
      acc[session.platform].earnings += session.earnings
      acc[session.platform].hours += session.hours
      acc[session.platform].trips += 1
      return acc
    }, {} as { [key: string]: { earnings: number; hours: number; trips: number } })
  }

  // Get real data from sessions using the selected date range
  const totalStats = getStatsForDateRange(startDate, endDate)
  const platformStats = getPlatformStatsForDateRange(startDate, endDate)
  const weeklySessions = getWeeklySessions()

  // Calculate weekly totals
  const weeklyStats = weeklySessions.reduce((acc, session) => ({
    earnings: acc.earnings + session.earnings,
    hours: acc.hours + session.hours,
    miles: acc.miles + session.miles,
    trips: acc.trips + 1
  }), { earnings: 0, hours: 0, miles: 0, trips: 0 })

  const weeklyAvgHourly = weeklyStats.hours > 0 ? weeklyStats.earnings / weeklyStats.hours : 0

  // Helper function to get date range label
  const getDateRangeLabel = (start: Date | undefined, end: Date | undefined) => {
    if (!start || !end) {
      return 'All Time'
    }
    
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    
    if (startStr === endStr) {
      return startStr
    }
    
    return `${startStr} - ${endStr}`
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
            {/* Date Range Picker */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Date Range:</span>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={(start, end) => {
                  setStartDate(start)
                  setEndDate(end)
                }}
              />
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
            title={`${getDateRangeLabel(startDate, endDate)} Earnings`}
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
                    startDate={startDate}
                    endDate={endDate}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-card shadow-card p-8 text-center">
                <p className="text-muted-foreground">
                  No sessions logged for {getDateRangeLabel(startDate, endDate).toLowerCase()}
                </p>
              </Card>
            )}
            
            {/* Earnings Chart */}
            <EarningsChart 
              startDate={startDate}
              endDate={endDate}
            />
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