import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Calendar, Clock, DollarSign, Navigation, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { getCurrentDate } from '@/lib/utils'

interface SessionData {
  platform: string
  earnings: number
  hours: number
  miles: number
  date: string
  notes?: string
}

interface SessionLogFormProps {
  onSubmit: (data: SessionData) => void
  isOpen: boolean
  onClose: () => void
  isSubmitting?: boolean
}

const platforms = [
  { name: 'Uber', color: '#000000' },
  { name: 'DoorDash', color: '#FF6000' },
  { name: 'Lyft', color: '#FF00BF' },
  { name: 'Instacart', color: '#43B02A' },
  { name: 'Grubhub', color: '#F63440' },
  { name: 'Postmates', color: '#000000' },
  { name: 'Shipt', color: '#0077CC' },
  { name: 'Other', color: '#6B7280' }
]

export const SessionLogForm = ({ onSubmit, isOpen, onClose, isSubmitting = false }: SessionLogFormProps) => {
  const [formData, setFormData] = useState<SessionData>({
    platform: '',
    earnings: 0,
    hours: 0,
    miles: 0,
    date: getCurrentDate(),
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    // Reset form
    setFormData({
      platform: '',
      earnings: 0,
      hours: 0,
      miles: 0,
      date: getCurrentDate(),
      notes: ''
    })
    onClose()
  }

  const handleInputChange = (field: keyof SessionData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Log Work Session
          </DialogTitle>
          <DialogDescription>
            Record your earnings, hours, and mileage for this work session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Platform Selection */}
          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <Select 
              value={formData.platform} 
              onValueChange={(value) => handleInputChange('platform', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.name} value={platform.name}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      {platform.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              max={getCurrentDate()}
              required
            />
          </div>

          {/* Financial and Time Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="earnings" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Earnings ($)
              </Label>
              <Input
                id="earnings"
                type="number"
                step="0.01"
                min="0"
                value={formData.earnings}
                onChange={(e) => handleInputChange('earnings', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hours
              </Label>
              <Input
                id="hours"
                type="number"
                step="0.1"
                min="0"
                value={formData.hours}
                onChange={(e) => handleInputChange('hours', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="miles" className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Miles
              </Label>
              <Input
                id="miles"
                type="number"
                step="0.1"
                min="0"
                value={formData.miles}
                onChange={(e) => handleInputChange('miles', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this session..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          {formData.earnings > 0 && formData.hours > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hourly Rate:</span>
                  <span className="font-semibold">
                    ${(formData.earnings / formData.hours).toFixed(2)}/hr
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground" disabled={isSubmitting}>
              {isSubmitting ? 'Logging...' : 'Log Session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 