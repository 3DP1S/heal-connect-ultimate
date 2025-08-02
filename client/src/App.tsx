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
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/meditation" component={MeditationPage} />
      <Route path="/stress-tracker" component={StressTrackerPage} />
      <Route path="/journal" component={JournalPage} />
      <Route path="/breathing" component={BreathingPage} />
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
