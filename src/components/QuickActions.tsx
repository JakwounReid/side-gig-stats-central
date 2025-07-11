import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Navigation, FileText } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      icon: Clock,
      label: "Start Timer",
      description: "Begin tracking work time",
      color: "bg-time/10 text-time hover:bg-time/20"
    },
    {
      icon: DollarSign,
      label: "Log Earnings",
      description: "Record completed trips",
      color: "bg-earnings/10 text-earnings hover:bg-earnings/20"
    },
    {
      icon: Navigation,
      label: "Track Mileage",
      description: "Start mileage tracking",
      color: "bg-mileage/10 text-mileage hover:bg-mileage/20"
    },
    {
      icon: FileText,
      label: "View Reports",
      description: "Generate tax reports",
      color: "bg-primary/10 text-primary hover:bg-primary/20"
    }
  ];

  return (
    <Card className="p-6 bg-gradient-card shadow-card animate-fade-in">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={action.label}
            variant="ghost"
            className={`h-auto p-4 justify-start ${action.color} transition-all duration-200`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3 w-full">
              <action.icon className="h-5 w-5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">{action.label}</p>
                <p className="text-xs opacity-80">{action.description}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};