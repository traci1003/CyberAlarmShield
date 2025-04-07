import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import AlarmTab from "@/pages/AlarmTab";
import SecurityTab from "@/pages/SecurityTab";
import StatsTab from "@/pages/StatsTab";
import SettingsTab from "@/pages/SettingsTab";
import { Tab } from "@/lib/types";

const tabs: Tab[] = [
  { id: "alarm", label: "Alarm", icon: "ri-alarm-line" },
  { id: "security", label: "Security", icon: "ri-shield-line" },
  { id: "stats", label: "Stats", icon: "ri-bar-chart-line" },
  { id: "settings", label: "Settings", icon: "ri-settings-line" }
];

function Router() {
  const [location, setLocation] = useLocation();
  
  // If at root, redirect to alarm tab
  if (location === "/") {
    setLocation("/alarm");
    return null;
  }
  
  return (
    <Switch>
      <Route path="/alarm" component={AlarmTab} />
      <Route path="/security" component={SecurityTab} />
      <Route path="/stats" component={StatsTab} />
      <Route path="/settings" component={SettingsTab} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Router />
        </main>
        <Navigation tabs={tabs} />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
