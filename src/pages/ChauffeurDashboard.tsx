import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Truck, Package, Euro, MapPin, Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Delivery {
  id: string;
  scheduled_date: string;
  start_time: string | null;
  end_time: string | null;
  distance_km: number | null;
  status: string;
  notes: string | null;
  order: {
    id: string;
    order_number: string;
    pickup_address: string;
    delivery_address: string;
    status: string;
    client: {
      contact_name: string;
      company_name: string | null;
    };
  };
}

interface Salary {
  id: string;
  month: number;
  year: number;
  base_salary: number;
  bonus: number;
  deductions: number;
  total_deliveries: number;
  total_km: number;
  paid: boolean;
}

type PeriodFilter = "day" | "week" | "month";

export default function ChauffeurDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [salary, setSalary] = useState<Salary | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodFilter>("day");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDeliveries();
      fetchSalary();
    }
  }, [user, period]);

  const getDateRange = () => {
    const now = new Date();
    switch (period) {
      case "day":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "week":
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
      case "month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const fetchDeliveries = async () => {
    if (!user) return;
    
    setLoading(true);
    const { start, end } = getDateRange();

    const { data, error } = await supabase
      .from("deliveries")
      .select(`
        id,
        scheduled_date,
        start_time,
        end_time,
        distance_km,
        status,
        notes,
        order:orders (
          id,
          order_number,
          pickup_address,
          delivery_address,
          status,
          client:clients (
            contact_name,
            company_name
          )
        )
      `)
      .eq("chauffeur_id", user.id)
      .gte("scheduled_date", format(start, "yyyy-MM-dd"))
      .lte("scheduled_date", format(end, "yyyy-MM-dd"))
      .order("scheduled_date", { ascending: true });

    if (error) {
      console.error("Error fetching deliveries:", error);
      toast.error("Erreur lors du chargement des livraisons");
    } else {
      setDeliveries((data as unknown as Delivery[]) || []);
    }
    setLoading(false);
  };

  const fetchSalary = async () => {
    if (!user) return;

    const now = new Date();
    const { data, error } = await supabase
      .from("chauffeur_salaries")
      .select("*")
      .eq("chauffeur_id", user.id)
      .eq("month", now.getMonth() + 1)
      .eq("year", now.getFullYear())
      .maybeSingle();

    if (error) {
      console.error("Error fetching salary:", error);
    } else {
      setSalary(data as Salary);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    setUpdatingStatus(deliveryId);

    const { error } = await supabase
      .from("deliveries")
      .update({ 
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null
      })
      .eq("id", deliveryId);

    if (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    } else {
      toast.success("Statut mis à jour");
      fetchDeliveries();
    }
    setUpdatingStatus(null);
  };

  const stats = {
    total: deliveries.length,
    completed: deliveries.filter(d => d.status === "completed").length,
    inProgress: deliveries.filter(d => d.status === "in_progress").length,
    totalKm: deliveries.reduce((sum, d) => sum + (d.distance_km || 0), 0),
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      assigned: { label: "Assignée", className: "bg-secondary text-secondary-foreground" },
      in_progress: { label: "En cours", className: "bg-info text-info-foreground" },
      completed: { label: "Terminée", className: "bg-success text-success-foreground" },
      failed: { label: "Échouée", className: "bg-destructive text-destructive-foreground" },
    };
    const variant = variants[status] || variants.assigned;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const calculateTotalSalary = () => {
    if (!salary) return 0;
    return salary.base_salary + salary.bonus - salary.deductions;
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon Tableau de Bord</h1>
          <p className="text-muted-foreground">Gérez vos livraisons et suivez vos performances</p>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Aujourd'hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Livraisons totales</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Complétées</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
              <Truck className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En cours</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <MapPin className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Km parcourus</p>
              <p className="text-2xl font-bold">{stats.totalKm.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Deliveries List */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Mes Trajets
              </CardTitle>
              <CardDescription>
                {period === "day" && "Livraisons d'aujourd'hui"}
                {period === "week" && "Livraisons de cette semaine"}
                {period === "month" && "Livraisons de ce mois"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deliveries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">Aucune livraison prévue</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deliveries.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="rounded-xl border bg-card p-4 transition-all hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {delivery.order?.order_number || "N/A"}
                            </span>
                            {getStatusBadge(delivery.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {delivery.order?.client?.company_name || delivery.order?.client?.contact_name || "Client inconnu"}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {format(new Date(delivery.scheduled_date), "EEEE d MMMM", { locale: fr })}
                            {delivery.start_time && ` à ${delivery.start_time.slice(0, 5)}`}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Select
                            value={delivery.status}
                            onValueChange={(v) => updateDeliveryStatus(delivery.id, v)}
                            disabled={updatingStatus === delivery.id}
                          >
                            <SelectTrigger className="w-[140px]">
                              {updatingStatus === delivery.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="assigned">Assignée</SelectItem>
                              <SelectItem value="in_progress">En cours</SelectItem>
                              <SelectItem value="completed">Terminée</SelectItem>
                              <SelectItem value="failed">Échouée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-success" />
                          <span className="text-foreground">{delivery.order?.pickup_address || "N/A"}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-destructive" />
                          <span className="text-foreground">{delivery.order?.delivery_address || "N/A"}</span>
                        </div>
                        {delivery.distance_km && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Truck className="h-4 w-4" />
                            <span>{delivery.distance_km} km</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Salary Card */}
        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Mon Salaire
              </CardTitle>
              <CardDescription>
                {format(new Date(), "MMMM yyyy", { locale: fr })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {salary ? (
                <>
                  <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4">
                    <p className="text-sm text-muted-foreground">Total net</p>
                    <p className="text-3xl font-bold text-foreground">
                      {calculateTotalSalary().toFixed(2)} €
                    </p>
                    {salary.paid ? (
                      <Badge className="mt-2 bg-success text-success-foreground">Payé</Badge>
                    ) : (
                      <Badge className="mt-2 bg-warning text-warning-foreground">En attente</Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Salaire de base</span>
                      <span className="font-medium">{salary.base_salary.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bonus</span>
                      <span className="font-medium text-success">+{salary.bonus.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Déductions</span>
                      <span className="font-medium text-destructive">-{salary.deductions.toFixed(2)} €</span>
                    </div>
                    <div className="my-2 border-t" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraisons effectuées</span>
                      <span className="font-medium">{salary.total_deliveries}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Km parcourus</span>
                      <span className="font-medium">{salary.total_km.toFixed(1)} km</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Euro className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-3 text-muted-foreground">Aucune donnée de salaire</p>
                  <p className="text-sm text-muted-foreground">pour ce mois</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
