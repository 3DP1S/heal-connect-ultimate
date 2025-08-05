import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { THAENOSHealingIndicator } from "@/components/thaenos-healing-indicator";
import { ViteRecovery } from "@/components/vite-recovery";
import Dashboard from "@/pages/dashboard";
import EmergencyDashboard from "@/pages/emergency-dashboard";
import MeditationPage from "@/pages/meditation";
import StressTrackerPage from "@/pages/stress-tracker";
import JournalPage from "@/pages/journal";
import BreathingPage from "@/pages/breathing";
import MarketplacePage from "@/pages/marketplace";
import SellerDashboardPage from "@/pages/seller-dashboard";
import VideoPlatformPage from "@/pages/video-platform";
import CreatorDashboardPage from "@/pages/creator-dashboard";
import CollaborationPage from "@/pages/collaboration";
import Generator3DPage from "@/pages/3d-generator";
import QuantumHealingPage from "@/pages/quantum-healing";
import HealingSuitePage from "@/pages/healing-suite";
import DeployPage from "@/pages/deploy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/emergency" component={EmergencyDashboard} />
      <Route path="/meditation" component={MeditationPage} />
      <Route path="/stress-tracker" component={StressTrackerPage} />
      <Route path="/journal" component={JournalPage} />
      <Route path="/breathing" component={BreathingPage} />
      <Route path="/marketplace" component={MarketplacePage} />
      <Route path="/seller-dashboard" component={SellerDashboardPage} />
      <Route path="/video-platform" component={VideoPlatformPage} />
      <Route path="/creator-dashboard" component={CreatorDashboardPage} />
      <Route path="/collaboration" component={CollaborationPage} />
      <Route path="/3d-generator" component={Generator3DPage} />
      <Route path="/quantum-healing" component={QuantumHealingPage} />
      <Route path="/healing-suite" component={HealingSuitePage} />
      <Route path="/deploy" component={DeployPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="dark">
      <Router />
    </div>
  );
}

export default App;
