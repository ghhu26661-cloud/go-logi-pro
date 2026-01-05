import {
  Package,
  Truck,
  Users,
  Car,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersChart } from "@/components/dashboard/OrdersChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erreur lors du chargement des données</p>
      </div>
    );
  }

  const mainStats = [
    {
      title: "Total Commandes",
      value: stats?.totalOrders.toLocaleString() || "0",
      change: `${stats?.ordersChange >= 0 ? "+" : ""}${stats?.ordersChange}% vs mois dernier`,
      changeType: (stats?.ordersChange || 0) >= 0 ? "positive" as const : "negative" as const,
      icon: Package,
      iconColor: "bg-primary/10 text-primary",
    },
    {
      title: "Commandes Livrées",
      value: stats?.deliveredOrders.toLocaleString() || "0",
      change: `${stats?.totalOrders ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}% du total`,
      changeType: "positive" as const,
      icon: CheckCircle,
      iconColor: "bg-success/10 text-success",
    },
    {
      title: "En cours",
      value: stats?.inProgressOrders.toLocaleString() || "0",
      change: "Commandes actives",
      changeType: "neutral" as const,
      icon: Clock,
      iconColor: "bg-warning/10 text-warning",
    },
    {
      title: "Chiffre d'affaires",
      value: `${stats?.totalRevenue.toLocaleString()} €`,
      change: `${stats?.revenueChange >= 0 ? "+" : ""}${stats?.revenueChange}% vs mois dernier`,
      changeType: (stats?.revenueChange || 0) >= 0 ? "positive" as const : "negative" as const,
      icon: DollarSign,
      iconColor: "bg-accent/10 text-accent",
    },
  ];

  const operationalStats = [
    {
      title: "Clients actifs",
      value: stats?.activeClients.toString() || "0",
      change: `+${stats?.newClientsThisMonth || 0} nouveaux ce mois`,
      changeType: "positive" as const,
      icon: Users,
      iconColor: "bg-info/10 text-info",
    },
    {
      title: "Chauffeurs",
      value: stats?.totalDrivers.toString() || "0",
      change: "Chauffeurs enregistrés",
      changeType: "neutral" as const,
      icon: Truck,
      iconColor: "bg-primary/10 text-primary",
    },
    {
      title: "Véhicules",
      value: stats?.totalVehicles.toString() || "0",
      change: `${stats?.availableVehicles || 0} disponibles`,
      changeType: "neutral" as const,
      icon: Car,
      iconColor: "bg-accent/10 text-accent",
    },
    {
      title: "Taux de livraison",
      value: `${stats?.deliveryRate || 0}%`,
      change: "Livraisons complétées",
      changeType: (stats?.deliveryRate || 0) >= 90 ? "positive" as const : "neutral" as const,
      icon: TrendingUp,
      iconColor: "bg-success/10 text-success",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur LogiTrack Pro. Voici un aperçu de vos opérations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 50} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <OrdersChart />
      </div>

      {/* Operational Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {operationalStats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={(index + 4) * 50} />
        ))}
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
}
