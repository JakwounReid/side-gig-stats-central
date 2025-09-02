import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from "./contexts/AuthContext";
import { SessionProvider } from "./contexts/SessionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TawkTo from "./components/TawkTo";
import EnvDebug from "./components/EnvDebug";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const App = () => {
  const tawkToPropertyId = import.meta.env.VITE_TAWKTO_PROPERTY_ID;
  const tawkToWidgetId = import.meta.env.VITE_TAWKTO_WIDGET_ID;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SessionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/auth" element={<AuthPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Analytics />
            {tawkToPropertyId && tawkToWidgetId && (
              <TawkTo 
                propertyId={tawkToPropertyId} 
                widgetId={tawkToWidgetId} 
              />
            )}
            <EnvDebug />
          </TooltipProvider>
        </SessionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
