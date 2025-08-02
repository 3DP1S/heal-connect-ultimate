import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import StatsCards from "@/components/stats-cards";
import RecentProjects from "@/components/recent-projects";
import QuickActions from "@/components/quick-actions";
import AiAssistant from "@/components/ai-assistant";
import SystemStatus from "@/components/system-status";

export default function Dashboard() {
  useEffect(() => {
    // Keyboard navigation enhancement
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleClick = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-6 nature-texture overflow-y-auto">
          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <RecentProjects />
            </div>
            
            <div className="space-y-6">
              <QuickActions />
              <AiAssistant />
              <SystemStatus />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
