import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMonthlyOrderStats } from "@/hooks/useDashboardStats";
import { Loader2 } from "lucide-react";

export function OrdersChart() {
  const { data, isLoading, error } = useMonthlyOrderStats();

  if (isLoading) {
    return (
      <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-card" style={{ animationDelay: "300ms" }}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Statut des commandes
          </h3>
          <p className="text-sm text-muted-foreground">
            Répartition mensuelle par statut
          </p>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-card" style={{ animationDelay: "300ms" }}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Statut des commandes
          </h3>
        </div>
        <div className="h-[300px] flex items-center justify-center text-destructive">
          Erreur lors du chargement
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-card" style={{ animationDelay: "300ms" }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Statut des commandes
        </h3>
        <p className="text-sm text-muted-foreground">
          Répartition mensuelle par statut
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px hsl(var(--foreground) / 0.1)",
              }}
            />
            <Legend />
            <Bar
              dataKey="livrees"
              name="Livrées"
              fill="hsl(142, 71%, 45%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="enCours"
              name="En cours"
              fill="hsl(24, 95%, 53%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="annulees"
              name="Annulées"
              fill="hsl(0, 84%, 60%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
