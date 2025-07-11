import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCard } from "@/components/StatsCard";
import { EarningsChart } from "@/components/EarningsChart";
import { PlatformCard } from "@/components/PlatformCard";
import { QuickActions } from "@/components/QuickActions";
import { DollarSign, Clock, Navigation, TrendingUp } from "lucide-react";

const Index = () => {
  // Mock data - in a real app, this would come from your state management/API
  const todayStats = {
    totalEarnings: 287.50,
    hoursWorked: 8.5,
    milesDriven: 124,
    avgHourly: 33.82
  };

  const platforms = [
    {
      name: "Uber",
      earnings: 180,
      hours: 5.5,
      trips: 12,
      color: "#000000"
    },
    {
      name: "DoorDash", 
      earnings: 107.50,
      hours: 3,
      trips: 8,
      color: "#FF3008"
    },
    {
      name: "Instacart",
      earnings: 0,
      hours: 0,
      trips: 0,
      color: "#43B02A"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <DashboardHeader />
        
        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Today's Earnings"
            value={`$${todayStats.totalEarnings.toFixed(2)}`}
            icon={DollarSign}
            trend={{ value: "12.5%", isPositive: true }}
            iconColor="text-earnings"
          />
          <StatsCard
            title="Hours Worked"
            value={`${todayStats.hoursWorked}h`}
            icon={Clock}
            trend={{ value: "2.1h", isPositive: true }}
            iconColor="text-time"
          />
          <StatsCard
            title="Miles Driven"
            value={`${todayStats.milesDriven} mi`}
            icon={Navigation}
            iconColor="text-mileage"
          />
          <StatsCard
            title="Avg Hourly"
            value={`$${todayStats.avgHourly}/hr`}
            icon={TrendingUp}
            trend={{ value: "8.2%", isPositive: true }}
            iconColor="text-accent"
          />
        </div>

        {/* Charts and Platform Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EarningsChart />
          </div>
          <div className="space-y-6">
            <QuickActions />
            
            {/* Platform Performance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Platform Performance
              </h3>
              {platforms.map((platform) => (
                <PlatformCard key={platform.name} {...platform} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
