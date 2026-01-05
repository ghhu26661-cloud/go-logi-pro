import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMonthlyRevenue } from "@/hooks/useDashboardStats";
import { Loader2 } from "lucide-react";

export function RevenueChart() {
  const { data, isLoading, error } = useMonthlyRevenue();

  if (isLoading) {
    return (
      <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-card" style={{ animationDelay: "200ms" }}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Chiffre d'affaires mensuel
          </h3>
          <p className="text-sm text-muted-foreground">
            Évolution sur les 12 derniers mois
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
      <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-card" style={{ animationDelay: "200ms" }}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Chiffre d'affaires mensuel
          </h3>
        </div>
        <div className="h-[300px] flex items-center justify-center text-destructive">
          Erreur lors du chargement
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-card" style={{ animationDelay: "200ms" }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Chiffre d'affaires mensuel
        </h3>
        <p className="text-sm text-muted-foreground">
          Évolution sur les 12 derniers mois
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px hsl(var(--foreground) / 0.1)",
              }}
              formatter={(value: number) => [`${value.toLocaleString()} €`, "Revenus"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(24, 95%, 53%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
