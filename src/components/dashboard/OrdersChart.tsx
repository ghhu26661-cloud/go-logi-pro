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

const data = [
  { month: "Jan", livrees: 120, enCours: 45, annulees: 12 },
  { month: "Fév", livrees: 135, enCours: 52, annulees: 8 },
  { month: "Mar", livrees: 142, enCours: 38, annulees: 15 },
  { month: "Avr", livrees: 158, enCours: 61, annulees: 10 },
  { month: "Mai", livrees: 165, enCours: 48, annulees: 7 },
  { month: "Jun", livrees: 178, enCours: 55, annulees: 11 },
];

export function OrdersChart() {
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
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 32%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px hsl(222 47% 11% / 0.1)",
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
              fill="hsl(38, 92%, 50%)"
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
