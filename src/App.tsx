import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { Workspace } from "./pages/Workspace";
import { Compare } from "./pages/Compare";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Dashboard />}>
            <Route index element={<Workspace />} />
            <Route path="algorithms" element={<div className="p-6 flex-1 text-center"><h2 className="text-2xl font-bold mt-10">Algorithms Library</h2><p className="text-muted-foreground mt-2">Coming soon in v2.1</p></div>} />
            <Route path="compare" element={<Compare />} />
            <Route path="ai-copilot" element={<div className="p-6 flex-1 text-center"><h2 className="text-2xl font-bold mt-10">AI Copilot</h2><p className="text-muted-foreground mt-2">Coming soon in v2.1</p></div>} />
            <Route path="settings" element={<div className="p-6 flex-1 text-center"><h2 className="text-2xl font-bold mt-10">Settings</h2><p className="text-muted-foreground mt-2">Coming soon in v2.1</p></div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
