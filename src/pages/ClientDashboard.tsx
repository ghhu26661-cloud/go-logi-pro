import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Package, Plus, User, MapPin, Clock, Loader2, Building2, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ClientProfile {
  id: string;
  company_name: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
}

interface Order {
  id: string;
  order_number: string;
  pickup_address: string;
  delivery_address: string;
  pickup_date: string | null;
  delivery_date: string | null;
  status: string;
  weight_kg: number | null;
  price: number | null;
  notes: string | null;
  created_at: string;
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOrder, setNewOrder] = useState({
    pickup_address: "",
    delivery_address: "",
    pickup_date: "",
    weight_kg: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);

  const fetchClientData = async () => {
    if (!user) return;

    setLoading(true);

    // Fetch client profile
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (clientError) {
      console.error("Error fetching client:", clientError);
    } else if (clientData) {
      setClient(clientData as ClientProfile);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", clientData.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
      } else {
        setOrders((ordersData as Order[]) || []);
      }
    }

    setLoading(false);
  };

  const handleCreateOrder = async () => {
    if (!client) {
      toast.error("Profil client non trouvé");
      return;
    }

    if (!newOrder.pickup_address || !newOrder.delivery_address) {
      toast.error("Veuillez remplir les adresses de collecte et de livraison");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("orders").insert({
      client_id: client.id,
      pickup_address: newOrder.pickup_address,
      delivery_address: newOrder.delivery_address,
      pickup_date: newOrder.pickup_date || null,
      weight_kg: newOrder.weight_kg ? parseFloat(newOrder.weight_kg) : null,
      notes: newOrder.notes || null,
    });

    if (error) {
      console.error("Error creating order:", error);
      toast.error("Erreur lors de la création de la commande");
    } else {
      toast.success("Commande créée avec succès");
      setIsOrderDialogOpen(false);
      setNewOrder({
        pickup_address: "",
        delivery_address: "",
        pickup_date: "",
        weight_kg: "",
        notes: "",
      });
      fetchClientData();
    }

    setIsSubmitting(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "En attente", className: "bg-warning text-warning-foreground" },
      confirmed: { label: "Confirmée", className: "bg-info text-info-foreground" },
      in_transit: { label: "En transit", className: "bg-primary text-primary-foreground" },
      delivered: { label: "Livrée", className: "bg-success text-success-foreground" },
      cancelled: { label: "Annulée", className: "bg-destructive text-destructive-foreground" },
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    inTransit: orders.filter(o => o.status === "in_transit").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <User className="h-16 w-16 text-muted-foreground/50" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">Profil client non configuré</h2>
          <p className="mt-2 text-muted-foreground">
            Veuillez contacter l'administration pour configurer votre compte client.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon Espace Client</h1>
          <p className="text-muted-foreground">Gérez vos commandes et suivez vos livraisons</p>
        </div>
        <Button onClick={() => setIsOrderDialogOpen(true)} className="gap-2 gradient-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
          Nouvelle Commande
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total commandes</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
              <MapPin className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En transit</p>
              <p className="text-2xl font-bold">{stats.inTransit}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <Package className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Livrées</p>
              <p className="text-2xl font-bold">{stats.delivered}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Mes Commandes</CardTitle>
              <CardDescription>Historique de toutes vos commandes</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">Aucune commande</p>
                  <Button
                    onClick={() => setIsOrderDialogOpen(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    Créer ma première commande
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border bg-card p-4 transition-all hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {order.order_number}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {format(new Date(order.created_at), "d MMMM yyyy à HH:mm", { locale: fr })}
                          </div>
                        </div>
                        {order.price && (
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">{order.price.toFixed(2)} €</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 grid gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-success" />
                          <span className="text-foreground">{order.pickup_address}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-destructive" />
                          <span className="text-foreground">{order.delivery_address}</span>
                        </div>
                        {order.weight_kg && (
                          <div className="text-muted-foreground">
                            Poids: {order.weight_kg} kg
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

        {/* Client Info Card */}
        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mon Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.company_name && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entreprise</p>
                    <p className="font-medium">{client.company_name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <User className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{client.contact_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <Mail className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>

              {client.phone && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <Phone className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                </div>
              )}

              {client.address && (
                <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">
                    {client.address}
                    {client.postal_code && client.city && (
                      <>, {client.postal_code} {client.city}</>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouvelle Commande</DialogTitle>
            <DialogDescription>
              Créez une nouvelle demande de livraison
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pickup_address">Adresse de collecte *</Label>
              <Input
                id="pickup_address"
                placeholder="123 rue du Commerce, Paris"
                value={newOrder.pickup_address}
                onChange={(e) => setNewOrder({ ...newOrder, pickup_address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_address">Adresse de livraison *</Label>
              <Input
                id="delivery_address"
                placeholder="456 avenue des Champs, Lyon"
                value={newOrder.delivery_address}
                onChange={(e) => setNewOrder({ ...newOrder, delivery_address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickup_date">Date de collecte</Label>
                <Input
                  id="pickup_date"
                  type="datetime-local"
                  value={newOrder.pickup_date}
                  onChange={(e) => setNewOrder({ ...newOrder, pickup_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight_kg">Poids (kg)</Label>
                <Input
                  id="weight_kg"
                  type="number"
                  placeholder="10"
                  value={newOrder.weight_kg}
                  onChange={(e) => setNewOrder({ ...newOrder, weight_kg: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Instructions spéciales pour la livraison..."
                value={newOrder.notes}
                onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateOrder}
              disabled={isSubmitting}
              className="gradient-primary text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la commande"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
