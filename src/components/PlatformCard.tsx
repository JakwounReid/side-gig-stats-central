import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSessions } from '../contexts/SessionContext';

interface PlatformCardProps {
  name: string;
  earnings: number;
  hours: number;
  trips: number;
  color: string;
  logo?: string;
  startDate?: Date;
  endDate?: Date;
}

export const PlatformCard = ({ 
  name, 
  earnings, 
  hours, 
  trips, 
  color,
  logo,
  startDate,
  endDate
}: PlatformCardProps) => {
  const { sessions } = useSessions();
  const hourlyRate = hours > 0 ? earnings / hours : 0;

  // Generate sparkline data for this platform
  const generateSparklineData = () => {
    const platformSessions = sessions.filter(session => {
      const p = session.platform.toLowerCase();
      const platformKey = name.toLowerCase();
      return p.includes(platformKey);
    });

    // Get last 7 days of data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const daySessions = platformSessions.filter(s => s.date === date);
      return daySessions.reduce((sum, s) => sum + s.earnings, 0);
    });
  };

  const sparklineData = generateSparklineData();

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

  return (
    <Card className="p-4 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: color }}
          >
            {logo || name.charAt(0)}
          </div>
          <h4 className="font-semibold text-card-foreground">{name}</h4>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-card-foreground">${earnings.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{getDateRangeLabel(startDate, endDate)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Sparkline */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">7-day trend</p>
            <p className="text-xs text-muted-foreground">
              {sparklineData.some(v => v > 0) ? 'Active' : 'No recent activity'}
            </p>
          </div>
          <div className="h-8 flex items-end gap-1">
            {sparklineData.map((value, index) => {
              const maxValue = Math.max(...sparklineData.filter(v => v > 0), 1);
              const height = value > 0 ? (value / maxValue) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex-1 bg-current opacity-20 rounded-sm transition-all duration-200 hover:opacity-40"
                  style={{
                    height: `${Math.max(height, 2)}%`,
                    backgroundColor: color,
                    minHeight: '2px'
                  }}
                  title={`${new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString()}: $${value.toFixed(2)}`}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Hours</p>
            <p className="font-semibold text-card-foreground">{hours.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Trips</p>
            <p className="font-semibold text-card-foreground">{trips}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Hourly Rate</p>
            <p className="font-semibold text-card-foreground">${hourlyRate.toFixed(2)}/hr</p>
          </div>
        </div>
      </div>
    </Card>
  );
};