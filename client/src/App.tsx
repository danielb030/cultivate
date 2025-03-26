import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Dashboard from "@/pages/dashboard";
import Recordings from "@/pages/recordings";
import RecordingDetail from "@/pages/recording-detail";
import Insights from "@/pages/insights";
import Tips from "@/pages/tips";
import About from "@/pages/about";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/recordings" component={Recordings} />
          <Route path="/recordings/:id" component={RecordingDetail} />
          <Route path="/insights" component={Insights} />
          <Route path="/tips" component={Tips} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
