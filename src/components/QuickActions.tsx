import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, TrendingUp, Settings } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      icon: Download,
      label: "Export Data",
      description: "Download reports & CSV",
      color: "bg-primary/10 text-primary hover:bg-primary/20"
    },
    {
      icon: Calendar,
      label: "Tax Summary",
      description: "Year-to-date totals",
      color: "bg-earnings/10 text-earnings hover:bg-earnings/20"
    },
    {
      icon: TrendingUp,
      label: "Analytics",
      description: "Performance insights",
      color: "bg-time/10 text-time hover:bg-time/20"
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Preferences & data",
      color: "bg-mileage/10 text-mileage hover:bg-mileage/20"
    }
  ];

  const handleAction = (action: string) => {
    switch (action) {
      case "Export Data":
        // TODO: Implement data export (CSV, PDF reports)
        console.log("Export data clicked");
        break;
      case "Tax Summary":
        // TODO: Implement tax summary
        console.log("Tax summary clicked");
        break;
      case "Analytics":
        // TODO: Implement analytics
        console.log("Analytics clicked");
        break;
      case "Settings":
        // TODO: Implement settings
        console.log("Settings clicked");
        break;
      default:
        break;
    }
  };

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
            onClick={() => handleAction(action.label)}
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