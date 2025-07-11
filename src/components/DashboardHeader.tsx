import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Gig Dashboard
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground mt-1">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{today}</span>
        </div>
      </div>
      
      <Button 
        className="bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-card"
        size="lg"
      >
        <Plus className="h-4 w-4 mr-2" />
        Log Work Session
      </Button>
    </div>
  );
};