import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { day: 'Mon', earnings: 120, uber: 80, doordash: 40 },
  { day: 'Tue', earnings: 180, uber: 100, doordash: 80 },
  { day: 'Wed', earnings: 150, uber: 90, doordash: 60 },
  { day: 'Thu', earnings: 220, uber: 140, doordash: 80 },
  { day: 'Fri', earnings: 280, uber: 180, doordash: 100 },
  { day: 'Sat', earnings: 320, uber: 200, doordash: 120 },
  { day: 'Sun', earnings: 190, uber: 120, doordash: 70 }
];

export const EarningsChart = () => {
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
          <LineChart data={mockData}>
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
              formatter={(value, name) => [`$${value}`, name === 'earnings' ? 'Total' : String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
            />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="uber" 
              stroke="hsl(var(--uber))" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="doordash" 
              stroke="hsl(var(--doordash))" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};