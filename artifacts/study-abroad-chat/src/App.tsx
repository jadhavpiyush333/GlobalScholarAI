import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { ChatPage } from "@/pages/chat-page";
import { KnowledgeBasePage } from "@/pages/knowledge-base";
import { UniversityDetailPage } from "@/pages/university-detail";
import { FieldInsightsPage } from "@/pages/field-insights";
import { FieldDetailPage } from "@/pages/field-detail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  }
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={ChatPage} />
      <Route path="/knowledge" component={KnowledgeBasePage} />
      <Route path="/knowledge/university/:id" component={UniversityDetailPage} />
      <Route path="/fields" component={FieldInsightsPage} />
      <Route path="/fields/:slug" component={FieldDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
