import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Download, FileText, Calendar, DollarSign, CalendarDays } from 'lucide-react'
import { SessionData } from '../contexts/SessionContext'
import { useState, useMemo } from 'react'
import { formatDateString } from '@/lib/utils'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (startDate: string, endDate: string) => void
  sessions: SessionData[]
  isExporting: boolean
}

export const ExportDialog = ({ isOpen, onClose, onConfirm, sessions, isExporting }: ExportDialogProps) => {
  // Get all available dates from sessions
  const availableDates = useMemo(() => {
    const dates = [...new Set(sessions.map(s => s.date))].sort()
    return dates
  }, [sessions])

  // Default to all available data
  const [startDate, setStartDate] = useState(availableDates[0] || '')
  const [endDate, setEndDate] = useState(availableDates[availableDates.length - 1] || '')

  // Filter sessions based on selected date range
  const filteredSessions = useMemo(() => {
    if (!startDate || !endDate) return sessions
    return sessions.filter(session => 
      session.date >= startDate && session.date <= endDate
    )
  }, [sessions, startDate, endDate])

  // Calculate summary stats for filtered data
  const totalSessions = filteredSessions.length
  const totalEarnings = filteredSessions.reduce((sum, session) => sum + session.earnings, 0)
  const totalHours = filteredSessions.reduce((sum, session) => sum + session.hours, 0)
  const platforms = [...new Set(filteredSessions.map(s => s.platform))]

  const handleConfirm = () => {
    onConfirm(startDate, endDate)
  }

  const handleSelectAll = () => {
    setStartDate(availableDates[0] || '')
    setEndDate(availableDates[availableDates.length - 1] || '')
  }

  const handleSelectLast30Days = () => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)
    
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]
    
    setStartDate(thirtyDaysAgoStr)
    setEndDate(todayStr)
  }

  const handleSelectThisMonth = () => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    
    const firstDayStr = firstDayOfMonth.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]
    
    setStartDate(firstDayStr)
    setEndDate(todayStr)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Session Data
          </DialogTitle>
          <DialogDescription>
            Select a date range and generate a CSV file with your session data for analysis or record keeping.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Range Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Select Date Range</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={availableDates[0]}
                  max={endDate}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={availableDates[availableDates.length - 1]}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Quick Selection Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                All Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectLast30Days}
                className="text-xs"
              >
                Last 30 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectThisMonth}
                className="text-xs"
              >
                This Month
              </Button>
            </div>
          </div>

          {/* Data Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Data Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{totalSessions} sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>${totalEarnings.toFixed(2)} total</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{totalHours.toFixed(1)} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Platforms:</span>
                <span>{platforms.length}</span>
              </div>
            </div>
            {startDate && endDate && (
              <div className="mt-3 text-xs text-muted-foreground">
                Date range: {formatDateString(startDate)} to {formatDateString(endDate)}
              </div>
            )}
          </div>

          {/* Export Details */}
          <div className="space-y-3">
            <h4 className="font-medium">Export Includes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Date and platform for each session</li>
              <li>• Earnings, hours, and miles</li>
              <li>• Calculated hourly rates</li>
              <li>• Session notes and timestamps</li>
              <li>• CSV format for easy spreadsheet import</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={isExporting || !startDate || !endDate || totalSessions === 0}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 