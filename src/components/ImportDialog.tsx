import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Upload, FileText, AlertCircle, CheckCircle, X, Download } from 'lucide-react'
import { SessionData } from '../contexts/SessionContext'
import { getCurrentDate } from '../lib/utils'
import { downloadTemplate, getSupportedFormats } from '../lib/import-templates'

interface ImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (sessions: Omit<SessionData, 'id' | 'createdAt'>[]) => Promise<void>
}

interface ImportPreview {
  platform: string
  date: string
  earnings: number
  hours: number
  miles: number
  notes?: string
  isValid: boolean
  error?: string
}

const ImportDialog = ({ isOpen, onClose, onImport }: ImportDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [preview, setPreview] = useState<ImportPreview[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setError(null)
    setSuccess(null)
    setPreview([])

    try {
      const text = await file.text()
      const sessions = parseFileContent(text, file.name)
      setPreview(sessions)
    } catch (err) {
      setError('Failed to read file. Please check the file format.')
      console.error('File parsing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const parseFileContent = (content: string, filename: string): ImportPreview[] => {
    const lines = content.split('\n').filter(line => line.trim())
    
    // Check if it's the template format (has Platform column)
    const firstLine = lines[0]?.toLowerCase() || ''
    if (firstLine.includes('platform')) {
      return parseCSVFormat(lines)
    }
    
    // Try to detect file format
    if (filename.toLowerCase().includes('uber') || content.toLowerCase().includes('uber')) {
      return parseUberFormat(lines)
    } else if (filename.toLowerCase().includes('doordash') || content.toLowerCase().includes('doordash')) {
      return parseDoorDashFormat(lines)
    } else if (filename.toLowerCase().includes('lyft') || content.toLowerCase().includes('lyft')) {
      return parseLyftFormat(lines)
    } else if (filename.toLowerCase().includes('instacart') || content.toLowerCase().includes('instacart')) {
      return parseInstacartFormat(lines)
    } else {
      // Try CSV format
      return parseCSVFormat(lines)
    }
  }

  const parseUberFormat = (lines: string[]): ImportPreview[] => {
    return lines.slice(1).map((line, index) => {
      try {
        const columns = line.split(',').map(col => col.trim().replace(/"/g, ''))
        if (columns.length < 3) return createInvalidPreview('Uber', 'Insufficient data columns')

        const date = parseDate(columns[0])
        const earnings = parseFloat(columns[1]?.replace('$', '') || '0')
        const hours = parseFloat(columns[2] || '0')
        const miles = parseFloat(columns[3] || '0')

        return {
          platform: 'Uber',
          date,
          earnings,
          hours,
          miles,
          notes: `Imported from Uber - ${columns[0]}`,
          isValid: true
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        return createInvalidPreview('Uber', `Row ${index + 2}: ${errorMessage}`)
      }
    }).filter(Boolean)
  }

  const parseDoorDashFormat = (lines: string[]): ImportPreview[] => {
    return lines.slice(1).map((line, index) => {
      try {
        const columns = line.split(',').map(col => col.trim().replace(/"/g, ''))
        if (columns.length < 3) return createInvalidPreview('DoorDash', 'Insufficient data columns')

        const date = parseDate(columns[0])
        const earnings = parseFloat(columns[1]?.replace('$', '') || '0')
        const hours = parseFloat(columns[2] || '0')
        const miles = parseFloat(columns[3] || '0')

        return {
          platform: 'DoorDash',
          date,
          earnings,
          hours,
          miles,
          notes: `Imported from DoorDash - ${columns[0]}`,
          isValid: true
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        return createInvalidPreview('DoorDash', `Row ${index + 2}: ${errorMessage}`)
      }
    }).filter(Boolean)
  }

  const parseLyftFormat = (lines: string[]): ImportPreview[] => {
    return lines.slice(1).map((line, index) => {
      try {
        const columns = line.split(',').map(col => col.trim().replace(/"/g, ''))
        if (columns.length < 3) return createInvalidPreview('Lyft', 'Insufficient data columns')

        const date = parseDate(columns[0])
        const earnings = parseFloat(columns[1]?.replace('$', '') || '0')
        const hours = parseFloat(columns[2] || '0')
        const miles = parseFloat(columns[3] || '0')

        return {
          platform: 'Lyft',
          date,
          earnings,
          hours,
          miles,
          notes: `Imported from Lyft - ${columns[0]}`,
          isValid: true
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        return createInvalidPreview('Lyft', `Row ${index + 2}: ${errorMessage}`)
      }
    }).filter(Boolean)
  }

  const parseInstacartFormat = (lines: string[]): ImportPreview[] => {
    return lines.slice(1).map((line, index) => {
      try {
        const columns = line.split(',').map(col => col.trim().replace(/"/g, ''))
        if (columns.length < 3) return createInvalidPreview('Instacart', 'Insufficient data columns')

        const date = parseDate(columns[0])
        const earnings = parseFloat(columns[1]?.replace('$', '') || '0')
        const hours = parseFloat(columns[2] || '0')
        const miles = parseFloat(columns[3] || '0')

        return {
          platform: 'Instacart',
          date,
          earnings,
          hours,
          miles,
          notes: `Imported from Instacart - ${columns[0]}`,
          isValid: true
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        return createInvalidPreview('Instacart', `Row ${index + 2}: ${errorMessage}`)
      }
    }).filter(Boolean)
  }

  const parseCSVFormat = (lines: string[]): ImportPreview[] => {
    return lines.slice(1).map((line, index) => {
      try {
        const columns = line.split(',').map(col => col.trim().replace(/"/g, ''))
        if (columns.length < 4) return createInvalidPreview('Unknown', 'Insufficient data columns')

        const platform = columns[0] || 'Other'
        const date = parseDate(columns[1])
        const earnings = parseFloat(columns[2]?.replace('$', '') || '0')
        const hours = parseFloat(columns[3] || '0')
        const miles = parseFloat(columns[4] || '0')
        const notes = columns[5] || ''

        return {
          platform,
          date,
          earnings,
          hours,
          miles,
          notes: notes || `Imported - ${date}`,
          isValid: true
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        return createInvalidPreview('Unknown', `Row ${index + 2}: ${errorMessage}`)
      }
    }).filter(Boolean)
  }

  const createInvalidPreview = (platform: string, error: string): ImportPreview => ({
    platform,
    date: getCurrentDate(),
    earnings: 0,
    hours: 0,
    miles: 0,
    isValid: false,
    error
  })

  const parseDate = (dateStr: string): string => {
    // Clean the date string
    const cleanDateStr = dateStr.trim()
    
    // Try multiple date formats
    const dateFormats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // M/D/YYYY
      /^\d{1,2}\/\d{1,2}\/\d{2}$/, // M/D/YY
      /^\d{4}\/\d{1,2}\/\d{1,2}$/, // YYYY/M/D
    ]

    for (const format of dateFormats) {
      if (format.test(cleanDateStr)) {
        const date = new Date(cleanDateStr)
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0]
        }
      }
    }

    // Try parsing with Date constructor directly
    const date = new Date(cleanDateStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }

    throw new Error(`Invalid date format: ${dateStr}`)
  }

  const handleImport = async () => {
    const validSessions = preview.filter(session => session.isValid)
    if (validSessions.length === 0) {
      setError('No valid sessions to import')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      await onImport(validSessions)
      setSuccess(`Successfully imported ${validSessions.length} sessions`)
      setPreview([])
      setTimeout(() => {
        onClose()
        setSuccess(null)
      }, 2000)
    } catch (err) {
      setError('Failed to import sessions. Please try again.')
      console.error('Import error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const validSessions = preview.filter(session => session.isValid)
  const invalidSessions = preview.filter(session => !session.isValid)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Sessions
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file from your gig app to bulk import sessions.
            Supported formats: Uber, DoorDash, Lyft, Instacart, and generic CSV.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                disabled={isProcessing}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Choose File'}
              </Button>
              <div className="flex justify-center mt-4">
                <Button
                  onClick={downloadTemplate}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Supported: CSV files from Uber, DoorDash, Lyft, Instacart
              </p>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="space-y-3">
            <h4 className="font-medium">Supported Formats</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getSupportedFormats().map((format) => (
                <div key={format.name} className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm">{format.name}</h5>
                  <p className="text-xs text-muted-foreground mt-1">{format.description}</p>
                  <p className="text-xs font-mono bg-muted p-1 rounded mt-2">{format.example}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-success">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Preview ({validSessions.length} valid, {invalidSessions.length} invalid)</h3>
                <Button
                  onClick={handleImport}
                  disabled={validSessions.length === 0 || isProcessing}
                  className="bg-gradient-primary text-primary-foreground"
                >
                  {isProcessing ? 'Importing...' : `Import ${validSessions.length} Sessions`}
                </Button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {preview.map((session, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      session.isValid ? 'border-border bg-background' : 'border-destructive bg-destructive/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{session.platform}</span>
                          <span className="text-sm text-muted-foreground">{session.date}</span>
                          {session.isValid ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <X className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ${session.earnings.toFixed(2)} • {session.hours}h • {session.miles}mi
                        </div>
                        {session.notes && (
                          <div className="text-xs text-muted-foreground mt-1">{session.notes}</div>
                        )}
                      </div>
                    </div>
                    {!session.isValid && session.error && (
                      <div className="text-xs text-destructive mt-2">{session.error}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImportDialog 