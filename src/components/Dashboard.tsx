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
import { useToast } from "@/hooks/use-toast";

const PLATFORM_OPTIONS = [
  { key: 'all', label: 'All Platforms' },
  { key: 'uber', label: 'Uber' },
  { key: 'doordash', label: 'DoorDash' },
  { key: 'lyft', label: 'Lyft' },
  { key: 'instacart', label: 'Instacart' },
  { key: 'grubhub', label: 'Grubhub' },
  { key: 'shipt', label: 'Shipt' },
  { key: 'other', label: 'Other' },
];

const Dashboard = () => {
  const { sessions, loading, error, refreshSessions, addSession } = useSessions()
  const { toast } = useToast()
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false)

  // Debug logging for sessions
  console.log('📊 Dashboard sessions state:', {
    sessionsCount: sessions.length,
    loading,
    error,
    sessions: sessions.map(s => ({ id: s.id, date: s.date, platform: s.platform, earnings: s.earnings }))
  })

  const handleImportData = () => {
    setIsImportDialogOpen(true)
  }

  const handleConfirmImport = async (importedSessions: any[]) => {
    try {
      console.log('🔄 Importing sessions:', importedSessions.length)
      
      // Add each session using the addSession function
      for (const session of importedSessions) {
        await addSession(session)
      }
      
      console.log('✅ Successfully imported', importedSessions.length, 'sessions')
      setIsImportDialogOpen(false)
      
      // Refresh the sessions to show the new data
      await refreshSessions()
      
      // Show success toast
      toast({
        title: "Import completed successfully!",
        description: `${importedSessions.length} sessions imported`,
        variant: "default",
        className: "border-green-500 bg-green-50 text-green-900",
      })
    } catch (error) {
      console.error('❌ Error importing sessions:', error)
      
      // Show error toast
      toast({
        title: "Import failed",
        description: "Please check your file format and try again.",
        variant: "destructive",
      })
    }
  }

  // Helper function to get sessions for a specific date range and platform
  const getSessionsForDateRange = (start: Date | undefined, end: Date | undefined, platform: string = 'all') => {
    let filtered = sessions
    
    // Debug logging
    console.log('🔍 Filtering sessions:', {
      totalSessions: sessions.length,
      startDate: start,
      endDate: end,
      selectedPlatform: platform,
      sessions: sessions.map(s => ({ date: s.date, platform: s.platform, earnings: s.earnings }))
    })
    
    if (start && end) {
      const startOfDay = new Date(start)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(end)
      endOfDay.setHours(23, 59, 59, 999)
      
      const beforeDateFilter = filtered.length
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.date)
        return sessionDate >= startOfDay && sessionDate <= endOfDay
      })
      console.log(`📅 Date filter: ${beforeDateFilter} → ${filtered.length} sessions`)
    }
    
    if (platform !== 'all') {
      const beforePlatformFilter = filtered.length
      filtered = filtered.filter(session => {
        const p = session.platform.toLowerCase()
        if (platform === 'other') {
          return !['uber','doordash','lyft','instacart','grubhub','shipt'].some(x => p.includes(x))
        }
        return p.includes(platform)
      })
      console.log(`🏢 Platform filter: ${beforePlatformFilter} → ${filtered.length} sessions`)
    }
    
    console.log('✅ Final filtered sessions:', filtered.length)
    return filtered
  }

  // Update stats and platformStats to use selectedPlatform
  const dateRangeSessions = getSessionsForDateRange(startDate, endDate, selectedPlatform)

  const getStatsForDateRange = (start: Date | undefined, end: Date | undefined, platform: string = 'all') => {
    const sessions = getSessionsForDateRange(start, end, platform)
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

  const getPlatformStatsForDateRange = (start: Date | undefined, end: Date | undefined, platform: string = 'all') => {
    const sessions = getSessionsForDateRange(start, end, platform)
    const platformStats: { [key: string]: { earnings: number; sessions: number; hours: number } } = {}
    sessions.forEach(session => {
      const p = session.platform.toLowerCase()
      let platformKey = 'other'
      if (p.includes('uber')) platformKey = 'uber'
      else if (p.includes('doordash') || p.includes('door')) platformKey = 'doordash'
      else if (p.includes('lyft')) platformKey = 'lyft'
      else if (p.includes('instacart')) platformKey = 'instacart'
      else if (p.includes('grubhub')) platformKey = 'grubhub'
      else if (p.includes('shipt')) platformKey = 'shipt'
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

  // Update stats and platformStats to use selectedPlatform
  const stats = getStatsForDateRange(startDate, endDate, selectedPlatform)
  const platformStats = getPlatformStatsForDateRange(startDate, endDate, selectedPlatform)

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Dropdown */}
      <ProfileDropdown />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <DashboardHeader />
        
        {/* Date Range & Platform Picker */}
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
          <span className="text-sm font-medium text-muted-foreground ml-4">Platform:</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
          >
            {PLATFORM_OPTIONS.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
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
          
          <Button 
            variant="outline" 
            onClick={() => {
              setStartDate(undefined)
              setEndDate(undefined)
              setSelectedPlatform('all')
            }}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              refreshSessions()
            }}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
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
            Object.entries(platformStats).map(([platform, stats]) => {
              // Platform colors mapping - matching the dropdown colors
              const platformColors: { [key: string]: string } = {
                'uber': '#000000',
                'doordash': '#FF6000',
                'lyft': '#FF00BF',
                'instacart': '#43B02A',
                'grubhub': '#F63440',
                'shipt': '#0077CC',
                'other': '#6B7280'
              };
              
              return (
                <PlatformCard
                  key={platform}
                  name={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  earnings={stats.earnings}
                  hours={stats.hours}
                  trips={stats.sessions}
                  color={platformColors[platform] || '#6B7280'}
                  startDate={startDate}
                  endDate={endDate}
                />
              );
            })
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
          onSubmit={async (sessionData) => {
            try {
              console.log('🔄 Adding session:', sessionData)
              await addSession(sessionData)
              console.log('✅ Session added successfully')
              setIsSessionFormOpen(false)
              
              // Show success toast
              toast({
                title: "Session logged successfully!",
                description: `${sessionData.platform} - $${sessionData.earnings.toFixed(2)}`,
                variant: "default",
                className: "border-green-500 bg-green-50 text-green-900",
              })
            } catch (error) {
              console.error('❌ Error adding session:', error)
              
              // Show error toast
              toast({
                title: "Failed to log session",
                description: "Please try again.",
                variant: "destructive",
              })
            }
          }}
          isSubmitting={false}
        />
        
        {/* Earnings Chart */}
        <EarningsChart
          startDate={startDate}
          endDate={endDate}
          selectedPlatform={selectedPlatform}
        />
      </div>
    </div>
  )
}

export default Dashboard 