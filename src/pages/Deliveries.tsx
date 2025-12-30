import {
  Plus,
  Search,
  MoreHorizontal,
  Truck,
  MapPin,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const deliveries = [
  {
    id: "LIV-2024-001",
    orderId: "CMD-2024-001",
    driver: "Marc Dubois",
    vehicle: "AB-123-CD",
    origin: "Paris, France",
    destination: "Lyon, France",
    departureDate: "2024-01-15 08:00",
    estimatedArrival: "2024-01-15 14:00",
    status: "en_route",
    progress: 65,
  },
  {
    id: "LIV-2024-002",
    orderId: "CMD-2024-002",
    driver: "Pierre Martin",
    vehicle: "EF-456-GH",
    origin: "Lyon, France",
    destination: "Marseille, France",
    departureDate: "2024-01-15 09:30",
    estimatedArrival: "2024-01-15 13:30",
    status: "en_route",
    progress: 40,
  },
  {
    id: "LIV-2024-003",
    orderId: "CMD-2024-004",
    driver: "Jean Petit",
    vehicle: "IJ-789-KL",
    origin: "Marseille, France",
    destination: "Toulouse, France",
    departureDate: "2024-01-14 07:00",
    estimatedArrival: "2024-01-14 12:00",
    status: "livree",
    progress: 100,
  },
  {
    id: "LIV-2024-004",
    orderId: "CMD-2024-006",
    driver: "Luc Bernard",
    vehicle: "MN-012-OP",
    origin: "Lille, France",
    destination: "Strasbourg, France",
    departureDate: "2024-01-13 06:00",
    estimatedArrival: "2024-01-13 14:00",
    status: "en_route",
    progress: 85,
  },
];

const statusConfig = {
  en_route: { label: "En route", className: "bg-warning/10 text-warning border-warning/20" },
  livree: { label: "Livrée", className: "bg-success/10 text-success border-success/20" },
  retard: { label: "En retard", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Deliveries() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Livraisons</h1>
          <p className="text-muted-foreground">
            Suivez vos livraisons en temps réel.
          </p>
        </div>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
          <Plus className="h-5 w-5" />
          Nouvelle livraison
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <Truck className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">3</p>
              <p className="text-sm text-muted-foreground">En route</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <Truck className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">156</p>
              <p className="text-sm text-muted-foreground">Livrées ce mois</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <Clock className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">2</p>
              <p className="text-sm text-muted-foreground">En retard</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">96.8%</p>
              <p className="text-sm text-muted-foreground">Taux de succès</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher une livraison..." className="pl-10" />
        </div>
      </div>

      {/* Deliveries Grid */}
      <div className="grid gap-4 md:grid-cols-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-card-foreground">
                    {delivery.id}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      statusConfig[delivery.status as keyof typeof statusConfig].className
                    )}
                  >
                    {statusConfig[delivery.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Commande: {delivery.orderId}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Voir détails</DropdownMenuItem>
                  <DropdownMenuItem>Contacter chauffeur</DropdownMenuItem>
                  <DropdownMenuItem>Marquer livrée</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Progress */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium text-card-foreground">
                  {delivery.progress}%
                </span>
              </div>
              <Progress value={delivery.progress} className="h-2" />
            </div>

            {/* Route */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">{delivery.origin}</span>
              </div>
              <div className="ml-1 border-l-2 border-dashed border-border h-4" />
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">{delivery.destination}</span>
              </div>
            </div>

            {/* Details */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                {delivery.driver}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-4 w-4" />
                {delivery.vehicle}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                ETA: {delivery.estimatedArrival.split(" ")[1]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
