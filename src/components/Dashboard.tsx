import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSessions } from "../contexts/SessionContext";
import { ProfileDropdown } from "./ProfileDropdown";
import { DashboardHeader } from "./DashboardHeader";
import { DateRangePicker } from "./DateRangePicker";
import ImportDialog from "./ImportDialog";
import { ExportDialog } from "./ExportDialog";
import { SessionLogForm } from "./SessionLogForm";
import { EarningsChart } from "./EarningsChart";
import { StatsCard } from "./StatsCard";
import { PlatformCard } from "./PlatformCard";
import { DollarSign, Clock, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const { sessions, loading, error } = useSessions()
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false)

  const handleImportData = () => {
    setIsImportDialogOpen(true)
  }

  const handleConfirmImport = async (importedSessions: any[]) => {
    // This will be handled by the ImportDialog component
    setIsImportDialogOpen(false)
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

  // Get sessions for the selected date range
  const dateRangeSessions = getSessionsForDateRange(startDate, endDate)

  // Helper function to calculate stats for a date range
  const getStatsForDateRange = (start: Date | undefined, end: Date | undefined) => {
    const sessions = getSessionsForDateRange(start, end)
    
    const totalEarnings = sessions.reduce((sum, session) => sum + session.earnings, 0)
    const totalHours = sessions.reduce((sum, session) => sum + (session.hours || 0), 0)
    const totalSessions = sessions.length
    const averagePerHour = totalHours > 0 ? totalEarnings / totalHours : 0
    
    return {
      totalEarnings,
      totalHours,
      totalSessions,
      averagePerHour
    }
  }

  // Helper function to get platform stats for a date range
  const getPlatformStatsForDateRange = (start: Date | undefined, end: Date | undefined) => {
    const sessions = getSessionsForDateRange(start, end)
    
    const platformStats: { [key: string]: { earnings: number; sessions: number; hours: number } } = {}
    
    sessions.forEach(session => {
      const platform = session.platform.toLowerCase()
      let platformKey = 'other'
      
      if (platform.includes('uber')) {
        platformKey = 'uber'
      } else if (platform.includes('doordash') || platform.includes('door')) {
        platformKey = 'doordash'
      } else if (platform.includes('lyft')) {
        platformKey = 'lyft'
      } else if (platform.includes('instacart')) {
        platformKey = 'instacart'
      } else if (platform.includes('grubhub')) {
        platformKey = 'grubhub'
      } else if (platform.includes('shipt')) {
        platformKey = 'shipt'
      }
      
      if (!platformStats[platformKey]) {
        platformStats[platformKey] = { earnings: 0, sessions: 0, hours: 0 }
      }
      
      platformStats[platformKey].earnings += session.earnings
      platformStats[platformKey].sessions += 1
      platformStats[platformKey].hours += session.hours || 0
    })
    
    return platformStats
  }

  // Helper function to get date range label
  const getDateRangeLabel = (start: Date | undefined, end: Date | undefined) => {
    if (!start || !end) {
      return 'all time'
    }
    
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    if (startStr === endStr) {
      return startStr
    }
    
    return `${startStr} - ${endStr}`
  }

  // Get current stats
  const stats = getStatsForDateRange(startDate, endDate)
  const platformStats = getPlatformStatsForDateRange(startDate, endDate)

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Dropdown */}
      <ProfileDropdown />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <DashboardHeader />
        
        {/* Date Range Picker */}
        <div className="flex items-center gap-2 mb-4">
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
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={handleImportData} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Import Data
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setIsExportDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setIsSessionFormOpen(true)}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Log Session
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Earnings"
            value={`$${stats.totalEarnings.toFixed(2)}`}
            icon={DollarSign}
          />
          <StatsCard
            title="Total Hours"
            value={stats.totalHours.toFixed(1)}
            icon={Clock}
          />
          <StatsCard
            title="Total Sessions"
            value={stats.totalSessions.toString()}
            icon={Calendar}
          />
          <StatsCard
            title="Average/Hour"
            value={`$${stats.averagePerHour.toFixed(2)}`}
            icon={TrendingUp}
          />
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(platformStats).length > 0 ? (
            Object.entries(platformStats).map(([platform, stats]) => (
              <PlatformCard
                key={platform}
                name={platform.charAt(0).toUpperCase() + platform.slice(1)}
                earnings={stats.earnings}
                hours={stats.hours}
                trips={stats.sessions}
                color={`hsl(var(--${platform}))`}
                startDate={startDate}
                endDate={endDate}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No platform data for {getDateRangeLabel(startDate, endDate)}</p>
            </div>
          )}
        </div>
        
        {/* Import Dialog */}
        <ImportDialog
          isOpen={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
          onImport={handleConfirmImport}
        />
        
        {/* Export Dialog */}
        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          onConfirm={() => {}}
          sessions={sessions}
          isExporting={false}
        />
        
        {/* Session Log Form */}
        <SessionLogForm
          isOpen={isSessionFormOpen}
          onClose={() => setIsSessionFormOpen(false)}
          onSubmit={() => {}}
          isSubmitting={false}
        />
        
        {/* Earnings Chart */}
        <EarningsChart
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  )
}

export default Dashboard 