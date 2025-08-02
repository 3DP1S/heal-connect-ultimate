import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import MeditationPage from "@/pages/meditation";
import StressTrackerPage from "@/pages/stress-tracker";
import JournalPage from "@/pages/journal";
import BreathingPage from "@/pages/breathing";
import MarketplacePage from "@/pages/marketplace";
import SellerDashboardPage from "@/pages/seller-dashboard";
import VideoPlatformPage from "@/pages/video-platform";
import CreatorDashboardPage from "@/pages/creator-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/meditation" component={MeditationPage} />
      <Route path="/stress-tracker" component={StressTrackerPage} />
      <Route path="/journal" component={JournalPage} />
      <Route path="/breathing" component={BreathingPage} />
      <Route path="/marketplace" component={MarketplacePage} />
      <Route path="/seller-dashboard" component={SellerDashboardPage} />
      <Route path="/video-platform" component={VideoPlatformPage} />
      <Route path="/creator-dashboard" component={CreatorDashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
