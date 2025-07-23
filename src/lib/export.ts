import { SessionData } from '../contexts/SessionContext'

export const exportToCSV = (sessions: SessionData[], filename: string = 'gig-sessions.csv') => {
  // Define CSV headers
  const headers = [
    'Date',
    'Platform',
    'Earnings ($)',
    'Hours',
    'Miles',
    'Hourly Rate ($/hr)',
    'Notes',
    'Created At'
  ]

  // Convert sessions to CSV rows
  const csvRows = sessions.map(session => [
    session.date,
    session.platform,
    session.earnings.toFixed(2),
    session.hours.toFixed(2),
    session.miles.toFixed(1),
    session.hours > 0 ? (session.earnings / session.hours).toFixed(2) : '0.00',
    session.notes || '',
    new Date(session.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  ])

  // Combine headers and data
  const csvContent = [headers, ...csvRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export const generateExportFilename = (startDate?: string, endDate?: string) => {
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
  
  if (startDate && endDate) {
    // If it's a single date, use that date
    if (startDate === endDate) {
      return `gig-sessions-${startDate}.csv`
    }
    // If it's a range, include both dates
    return `gig-sessions-${startDate}-to-${endDate}.csv`
  }
  
  // Default filename with current date
  return `gig-sessions-${dateStr}.csv`
}

export const filterSessionsByDateRange = (sessions: SessionData[], startDate: string, endDate: string) => {
  return sessions.filter(session => 
    session.date >= startDate && session.date <= endDate
  )
} 