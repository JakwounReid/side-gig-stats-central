import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  iconColor?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className,
  iconColor = "text-primary"
}: StatsCardProps) => {
  return (
    <div className={cn(
      "bg-gradient-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 animate-scale-in border border-border/50",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg bg-primary/10", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-medium",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-card-foreground">{value}</p>
      </div>
    </div>
  );
};