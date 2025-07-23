import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSessions } from '../contexts/SessionContext';

export const EarningsChart = () => {
  const { getWeeklySessions } = useSessions();
  const weeklySessions = getWeeklySessions();

  // Group sessions by day and calculate totals
  const dailyData = weeklySessions.reduce((acc, session) => {
    const day = new Date(session.date).toLocaleDateString('en-US', { weekday: 'short' });
    
    if (!acc[day]) {
      acc[day] = { day, earnings: 0 };
    }
    
    acc[day].earnings += session.earnings;
    
    // Add to platform-specific totals
    const platform = session.platform.toLowerCase();
    if (platform.includes('uber')) {
      acc[day].uber = (acc[day].uber || 0) + session.earnings;
    } else if (platform.includes('doordash') || platform.includes('door')) {
      acc[day].doordash = (acc[day].doordash || 0) + session.earnings;
    } else if (platform.includes('lyft')) {
      acc[day].lyft = (acc[day].lyft || 0) + session.earnings;
    } else if (platform.includes('instacart')) {
      acc[day].instacart = (acc[day].instacart || 0) + session.earnings;
    } else if (platform.includes('grubhub')) {
      acc[day].grubhub = (acc[day].grubhub || 0) + session.earnings;
    } else if (platform.includes('shipt')) {
      acc[day].shipt = (acc[day].shipt || 0) + session.earnings;
    } else {
      acc[day].other = (acc[day].other || 0) + session.earnings;
    }
    
    return acc;
  }, {} as any);

  // Convert to array and sort by day
  const chartData = Object.values(dailyData).sort((a, b) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.indexOf(a.day) - days.indexOf(b.day);
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

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card shadow-card animate-fade-in">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Weekly Earnings Overview
          </h3>
          <p className="text-sm text-muted-foreground">
            Track your daily earnings across platforms
          </p>
        </div>
        
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No earnings data for this week</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-card animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Weekly Earnings Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Track your daily earnings across platforms
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="day" 
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