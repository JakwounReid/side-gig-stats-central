import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PlatformCardProps {
  name: string;
  earnings: number;
  hours: number;
  trips: number;
  color: string;
  logo?: string;
}

export const PlatformCard = ({ 
  name, 
  earnings, 
  hours, 
  trips, 
  color,
  logo 
}: PlatformCardProps) => {
  const hourlyRate = hours > 0 ? earnings / hours : 0;
  const maxEarnings = 400; // For progress calculation
  const progressPercentage = (earnings / maxEarnings) * 100;

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
          <p className="text-xl font-bold text-card-foreground">${earnings}</p>
          <p className="text-xs text-muted-foreground">today</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2"
          style={{ 
            // @ts-ignore - CSS custom properties
            '--progress-background': color 
          }}
        />
        
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