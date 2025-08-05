import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import StatsCards from "@/components/stats-cards";
import RecentProjects from "@/components/recent-projects";
import QuickActions from "@/components/quick-actions";
import AiAssistant from "@/components/ai-assistant";
import SystemStatus from "@/components/system-status";
import { THAENOSHealingIndicator } from "@/components/thaenos-healing-indicator";

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
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      {/* HEAL CONNECT Indicator */}
      <THAENOSHealingIndicator />
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-float" />
        <div className="absolute top-32 right-20 w-12 h-12 bg-purple-500/20 rounded-full animate-float-slow" />
        <div className="absolute bottom-20 left-32 w-16 h-16 bg-cyan-500/20 rounded-full animate-liquid" />
        <div className="absolute top-1/2 right-10 w-8 h-8 bg-green-500/20 rounded-full animate-pulse-glow" />
        <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-pink-500/20 rounded-full animate-float" />
      </div>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-6 nature-texture overflow-y-auto relative">
          {/* Floating Orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full animate-float blur-xl" />
            <div className="absolute bottom-32 right-1/4 w-40 h-40 bg-gradient-to-r from-cyan-500/10 to-green-500/10 rounded-full animate-float-slow blur-2xl" />
          </div>
          
          <div className="relative z-10">
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
          </div>
        </main>
      </div>
    </div>
  );
}