import { TrendingUp } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold leading-tight mb-2">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Gig Dash
              </span>
            </h1>
            <span></span>
            <p className="text-sm text-muted-foreground font-medium">
              Track your side hustle earnings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};