import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSessions } from '../contexts/SessionContext';

type TimePeriod = 'day' | 'week' | 'month' | 'year' | '2year' | '3year';

interface EarningsChartProps {
  selectedPeriod: TimePeriod;
}

export const EarningsChart = ({ selectedPeriod }: EarningsChartProps) => {
  const { sessions } = useSessions();

  // Helper function to get sessions for a specific time period
  const getSessionsForPeriod = (period: TimePeriod) => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    switch (period) {
      case 'day':
        return sessions.filter(session => session.date === todayStr)
      
      case 'week':
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        const weekEnd = new Date(today)
        
        return sessions.filter(session => {
          const sessionDate = new Date(session.date)
          return sessionDate >= weekStart && sessionDate <= weekEnd
        })
      
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthEnd = new Date(today)
        
        return sessions.filter(session => {
          const sessionDate = new Date(session.date)
          return sessionDate >= monthStart && sessionDate <= monthEnd
        })
      
      case 'year':
        const yearStart = new Date(today)
        yearStart.setDate(today.getDate() - 365)
        const yearEnd = new Date(today)
        
        return sessions.filter(session => {
          const sessionDate = new Date(session.date)
          return sessionDate >= yearStart && sessionDate <= yearEnd
        })
      
      case '2year':
        const twoYearStart = new Date(today)
        twoYearStart.setDate(today.getDate() - 730) // 2 years = 730 days
        const twoYearEnd = new Date(today)
        
        return sessions.filter(session => {
          const sessionDate = new Date(session.date)
          return sessionDate >= twoYearStart && sessionDate <= twoYearEnd
        })
      
      case '3year':
        const threeYearStart = new Date(today)
        threeYearStart.setDate(today.getDate() - 1095) // 3 years = 1095 days
        const threeYearEnd = new Date(today)
        
        return sessions.filter(session => {
          const sessionDate = new Date(session.date)
          return sessionDate >= threeYearStart && sessionDate <= threeYearEnd
        })
      
      default:
        return sessions.filter(session => session.date === todayStr)
    }
  }

  // Get sessions for the selected period
  const periodSessions = getSessionsForPeriod(selectedPeriod)

  // Helper function to get appropriate label based on period
  const getDataLabel = (date: Date, period: TimePeriod) => {
    switch (period) {
      case 'day':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case 'week':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case 'month':
        return date.toLocaleDateString('en-US', { day: 'numeric' });
      case 'year':
        return date.toLocaleDateString('en-US', { month: 'short' });
      case '2year':
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      case '3year':
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  // Helper function to get grouping key based on period
  const getGroupingKey = (date: Date, period: TimePeriod) => {
    switch (period) {
      case 'day':
      case 'week':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case 'month':
        return date.toLocaleDateString('en-US', { day: 'numeric' });
      case 'year':
        return date.toLocaleDateString('en-US', { month: 'short' });
      case '2year':
      case '3year':
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  // Group sessions by appropriate time unit and calculate totals
  const groupedData = periodSessions.reduce((acc, session) => {
    const sessionDate = new Date(session.date);
    const key = getGroupingKey(sessionDate, selectedPeriod);
    
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
      if (key !== 'day' && key !== 'earnings' && day[key] > 0) {
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

  // Helper function to get period label
  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 'day': return 'Day'
      case 'week': return 'Week'
      case 'month': return 'Month'
      case 'year': return 'Year'
      case '2year': return '2 Years'
      case '3year': return '3 Years'
      default: return 'Day'
    }
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
            Track your earnings across platforms for this {selectedPeriod}
          </p>
        </div>
        
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No earnings data for this {selectedPeriod}</p>
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
          Track your earnings across platforms for this {selectedPeriod}
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                borderRadius: '8px',
                boxShadow: 'var(--shadow-card)'
              }}
              formatter={(value, name) => [`$${value}`, name === 'earnings' ? 'Total' : platformNames[name as string] || name]}
            />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
            {Array.from(platformsWithData).map((platform) => (
              <Line 
                key={platform}
                type="monotone" 
                dataKey={platform} 
                stroke={platformColors[platform] || 'hsl(var(--muted-foreground))'} 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};