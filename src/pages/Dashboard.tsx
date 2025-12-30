import {
  Package,
  Truck,
  Users,
  Car,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersChart } from "@/components/dashboard/OrdersChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";

const stats = [
  {
    title: "Total Commandes",
    value: "1,284",
    change: "+12% vs mois dernier",
    changeType: "positive" as const,
    icon: Package,
    iconColor: "bg-primary/10 text-primary",
  },
  {
    title: "Commandes Livrées",
    value: "1,048",
    change: "82% du total",
    changeType: "positive" as const,
    icon: CheckCircle,
    iconColor: "bg-success/10 text-success",
  },
  {
    title: "En cours",
    value: "156",
    change: "-5% vs mois dernier",
    changeType: "negative" as const,
    icon: Clock,
    iconColor: "bg-warning/10 text-warning",
  },
  {
    title: "Chiffre d'affaires",
    value: "89,400 €",
    change: "+18% vs mois dernier",
    changeType: "positive" as const,
    icon: DollarSign,
    iconColor: "bg-accent/10 text-accent",
  },
];

const operationalStats = [
  {
    title: "Clients actifs",
    value: "248",
    change: "+8 nouveaux ce mois",
    changeType: "positive" as const,
    icon: Users,
    iconColor: "bg-info/10 text-info",
  },
  {
    title: "Chauffeurs",
    value: "32",
    change: "28 disponibles",
    changeType: "neutral" as const,
    icon: Truck,
    iconColor: "bg-primary/10 text-primary",
  },
  {
    title: "Véhicules",
    value: "45",
    change: "38 opérationnels",
    changeType: "neutral" as const,
    icon: Car,
    iconColor: "bg-accent/10 text-accent",
  },
  {
    title: "Taux de livraison",
    value: "96.8%",
    change: "+2.3% vs mois dernier",
    changeType: "positive" as const,
    icon: TrendingUp,
    iconColor: "bg-success/10 text-success",
  },
];

export default function Dashboard() {
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
        {stats.map((stat, index) => (
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
