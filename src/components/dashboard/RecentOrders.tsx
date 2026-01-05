import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRecentOrders } from "@/hooks/useDashboardStats";
import { Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-info/10 text-info border-info/20" },
  confirmed: { label: "Confirmée", className: "bg-primary/10 text-primary border-primary/20" },
  in_transit: { label: "En transit", className: "bg-warning/10 text-warning border-warning/20" },
  delivered: { label: "Livrée", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Annulée", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function RecentOrders() {
  const { data: orders, isLoading, error } = useRecentOrders();

  if (isLoading) {
    return (
      <div className="animate-slide-up rounded-xl border border-border bg-card shadow-card p-12" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-slide-up rounded-xl border border-border bg-card shadow-card p-6" style={{ animationDelay: "400ms" }}>
        <p className="text-center text-destructive">Erreur lors du chargement</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="animate-slide-up rounded-xl border border-border bg-card shadow-card" style={{ animationDelay: "400ms" }}>
        <div className="border-b border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Commandes récentes
          </h3>
          <p className="text-sm text-muted-foreground">
            Les 5 dernières commandes enregistrées
          </p>
        </div>
        <div className="p-12 text-center text-muted-foreground">
          Aucune commande pour le moment
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card shadow-card" style={{ animationDelay: "400ms" }}>
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Commandes récentes
        </h3>
        <p className="text-sm text-muted-foreground">
          Les 5 dernières commandes enregistrées
        </p>
      </div>
      <div className="divide-y divide-border">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending;
          return (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-card-foreground">
                    {order.order_number}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs font-medium", status.className)}
                  >
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{order.client_name}</p>
                <p className="text-xs text-muted-foreground">{order.destination}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-card-foreground">
                  {order.amount.toLocaleString()} €
                </p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
