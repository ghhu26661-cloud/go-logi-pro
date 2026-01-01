import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleBasedRoute } from "@/components/auth/RoleBasedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import RoleRouter from "./pages/RoleRouter";
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

// Staff-only layout (admin + manager)
const StaffLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["admin", "manager"]}>
      <AppLayout>{children}</AppLayout>
    </RoleBasedRoute>
  </ProtectedRoute>
);

// Admin-only layout
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["admin"]}>
      <AppLayout>{children}</AppLayout>
    </RoleBasedRoute>
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
            
            {/* Role-based dashboard */}
            <Route path="/" element={<AuthenticatedLayout><RoleRouter /></AuthenticatedLayout>} />
            
            {/* Staff-only routes (admin + manager) */}
            <Route path="/clients" element={<StaffLayout><Clients /></StaffLayout>} />
            <Route path="/orders" element={<StaffLayout><Orders /></StaffLayout>} />
            <Route path="/deliveries" element={<StaffLayout><Deliveries /></StaffLayout>} />
            <Route path="/drivers" element={<StaffLayout><Drivers /></StaffLayout>} />
            <Route path="/vehicles" element={<StaffLayout><Vehicles /></StaffLayout>} />
            <Route path="/invoices" element={<StaffLayout><Invoices /></StaffLayout>} />
            
            {/* Admin-only routes */}
            <Route path="/users" element={<AdminLayout><Users /></AdminLayout>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
