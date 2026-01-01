import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";
import Dashboard from "./Dashboard";
import ChauffeurDashboard from "./ChauffeurDashboard";
import ClientDashboard from "./ClientDashboard";

export default function RoleRouter() {
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Route based on role
  switch (role) {
    case "chauffeur":
      return <ChauffeurDashboard />;
    case "client":
      return <ClientDashboard />;
    case "admin":
    case "manager":
    default:
      return <Dashboard />;
  }
}
