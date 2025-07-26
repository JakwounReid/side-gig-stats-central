import { Card } from "@/components/ui/card";
import { useSessions } from '../contexts/SessionContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EarningsChartProps {
  startDate?: Date;
  endDate?: Date;
}

export const EarningsChart = ({ startDate, endDate }: EarningsChartProps) => {
  const { sessions } = useSessions();

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

  // Helper function to get appropriate label based on date range
  const getDataLabel = (date: Date, start: Date | undefined, end: Date | undefined) => {
    if (!start || !end) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (daysDiff <= 31) {
      return date.toLocaleDateString('en-US', { day: 'numeric' });
    } else if (daysDiff <= 365) {
      return date.toLocaleDateString('en-US', { month: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  // Helper function to get grouping key based on date range
  const getGroupingKey = (date: Date, start: Date | undefined, end: Date | undefined) => {
    if (!start || !end) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (daysDiff <= 31) {
      return date.toLocaleDateString('en-US', { day: 'numeric' });
    } else if (daysDiff <= 365) {
      return date.toLocaleDateString('en-US', { month: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  // Group sessions by appropriate time unit and calculate totals
  const groupedData = dateRangeSessions.reduce((acc, session) => {
    const sessionDate = new Date(session.date);
    const key = getGroupingKey(sessionDate, startDate, endDate);
    
    if (!acc[key]) {
      acc[key] = { 
        label: key, 
        earnings: 0,
        date: sessionDate // Keep original date for sorting
      };
    }
    
    acc[key].earnings += session.earnings;
    
    // Add to platform-specific totals
    const platform = session.platform.toLowerCase();
    if (platform.includes('uber')) {
      acc[key].uber = (acc[key].uber || 0) + session.earnings;
    } else if (platform.includes('doordash') || platform.includes('door')) {
      acc[key].doordash = (acc[key].doordash || 0) + session.earnings;
    } else if (platform.includes('lyft')) {
      acc[key].lyft = (acc[key].lyft || 0) + session.earnings;
    } else if (platform.includes('instacart')) {
      acc[key].instacart = (acc[key].instacart || 0) + session.earnings;
    } else if (platform.includes('grubhub')) {
      acc[key].grubhub = (acc[key].grubhub || 0) + session.earnings;
    } else if (platform.includes('shipt')) {
      acc[key].shipt = (acc[key].shipt || 0) + session.earnings;
    } else {
      acc[key].other = (acc[key].other || 0) + session.earnings;
    }
    
    return acc;
  }, {} as any);

  // Convert to array and sort by date
  const chartData = Object.values(groupedData).sort((a: any, b: any) => {
    return a.date.getTime() - b.date.getTime();
  });

  // Determine which platforms have data
  const platformsWithData = new Set<string>();
  chartData.forEach((day: any) => {
    Object.keys(day).forEach(key => {
      if (key !== 'label' && key !== 'earnings' && key !== 'date' && day[key] > 0) {
        platformsWithData.add(key);
      }
    });
  });

  // Platform colors mapping
  const platformColors: { [key: string]: string } = {
    'uber': 'hsl(var(--uber))',
    'doordash': 'hsl(var(--doordash))',
    'lyft': 'hsl(var(--lyft))',
    'instacart': 'hsl(var(--instacart))',
    'grubhub': 'hsl(var(--grubhub))',
    'shipt': 'hsl(var(--shipt))',
    'other': 'hsl(var(--muted-foreground))'
  };

  // Platform display names
  const platformNames: { [key: string]: string } = {
    'uber': 'Uber',
    'doordash': 'DoorDash',
    'lyft': 'Lyft',
    'instacart': 'Instacart',
    'grubhub': 'Grubhub',
    'shipt': 'Shipt',
    'other': 'Other'
  };

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



  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card shadow-card animate-fade-in">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Earnings Overview
          </h3>
          <p className="text-sm text-muted-foreground">
            Track your earnings across platforms for {getDateRangeLabel(startDate, endDate)}
          </p>
        </div>
        
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No earnings data for {getDateRangeLabel(startDate, endDate)}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-card animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Earnings Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Track your earnings across platforms for {getDateRangeLabel(startDate, endDate)}
        </p>
      </div>
      
      <div className="h-80" style={{ position: 'relative', zIndex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="label" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: any) => [`$${value}`, 'Earnings']}
            />
            {Array.from(platformsWithData).map((platform) => (
              <Line
                key={platform}
                type="monotone"
                dataKey={platform}
                stroke={platformColors[platform]}
                strokeWidth={2}
                dot={{ fill: platformColors[platform], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: platformColors[platform], strokeWidth: 2 }}
                name={platformNames[platform]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};