import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Clients from "./pages/Clients";
import Orders from "./pages/Orders";
import Deliveries from "./pages/Deliveries";
import Drivers from "./pages/Drivers";
import Vehicles from "./pages/Vehicles";
import Invoices from "./pages/Invoices";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper for authenticated pages
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes with layout */}
            <Route path="/" element={<AuthenticatedLayout><Dashboard /></AuthenticatedLayout>} />
            <Route path="/clients" element={<AuthenticatedLayout><Clients /></AuthenticatedLayout>} />
            <Route path="/orders" element={<AuthenticatedLayout><Orders /></AuthenticatedLayout>} />
            <Route path="/deliveries" element={<AuthenticatedLayout><Deliveries /></AuthenticatedLayout>} />
            <Route path="/drivers" element={<AuthenticatedLayout><Drivers /></AuthenticatedLayout>} />
            <Route path="/vehicles" element={<AuthenticatedLayout><Vehicles /></AuthenticatedLayout>} />
            <Route path="/invoices" element={<AuthenticatedLayout><Invoices /></AuthenticatedLayout>} />
            <Route path="/users" element={<AuthenticatedLayout><Users /></AuthenticatedLayout>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
