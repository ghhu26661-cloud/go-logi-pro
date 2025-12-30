import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "CMD-2024-001",
    client: "Transport Express SARL",
    destination: "Paris, France",
    date: "2024-01-15",
    status: "livree",
    amount: 1250,
  },
  {
    id: "CMD-2024-002",
    client: "Logistics Plus",
    destination: "Lyon, France",
    date: "2024-01-15",
    status: "en_cours",
    amount: 890,
  },
  {
    id: "CMD-2024-003",
    client: "FastShip International",
    destination: "Marseille, France",
    date: "2024-01-14",
    status: "en_attente",
    amount: 2100,
  },
  {
    id: "CMD-2024-004",
    client: "Global Freight Co",
    destination: "Bordeaux, France",
    date: "2024-01-14",
    status: "livree",
    amount: 1650,
  },
  {
    id: "CMD-2024-005",
    client: "Quick Delivery",
    destination: "Toulouse, France",
    date: "2024-01-13",
    status: "annulee",
    amount: 450,
  },
];

const statusConfig = {
  livree: { label: "Livrée", className: "bg-success/10 text-success border-success/20" },
  en_cours: { label: "En cours", className: "bg-warning/10 text-warning border-warning/20" },
  en_attente: { label: "En attente", className: "bg-info/10 text-info border-info/20" },
  annulee: { label: "Annulée", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function RecentOrders() {
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
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-card-foreground">
                  {order.id}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium",
                    statusConfig[order.status as keyof typeof statusConfig].className
                  )}
                >
                  {statusConfig[order.status as keyof typeof statusConfig].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{order.client}</p>
              <p className="text-xs text-muted-foreground">{order.destination}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-card-foreground">
                {order.amount.toLocaleString()} €
              </p>
              <p className="text-xs text-muted-foreground">{order.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
