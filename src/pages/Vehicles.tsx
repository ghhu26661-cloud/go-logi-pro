import {
  Plus,
  Search,
  MoreHorizontal,
  Car,
  Fuel,
  Calendar,
  Wrench,
  Gauge,
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

const vehicles = [
  {
    id: 1,
    plate: "AB-123-CD",
    type: "Camion 20T",
    brand: "Renault Trucks",
    capacity: "20 tonnes",
    fuelType: "Diesel",
    status: "disponible",
    mileage: 145000,
    nextMaintenance: "2024-02-15",
  },
  {
    id: 2,
    plate: "EF-456-GH",
    type: "Camion 12T",
    brand: "Mercedes Actros",
    capacity: "12 tonnes",
    fuelType: "Diesel",
    status: "en_service",
    mileage: 98500,
    nextMaintenance: "2024-03-01",
  },
  {
    id: 3,
    plate: "IJ-789-KL",
    type: "Fourgon",
    brand: "Iveco Daily",
    capacity: "3.5 tonnes",
    fuelType: "Diesel",
    status: "disponible",
    mileage: 67000,
    nextMaintenance: "2024-01-30",
  },
  {
    id: 4,
    plate: "MN-012-OP",
    type: "Camion 20T",
    brand: "Volvo FH",
    capacity: "20 tonnes",
    fuelType: "Diesel",
    status: "en_service",
    mileage: 210000,
    nextMaintenance: "2024-02-28",
  },
  {
    id: 5,
    plate: "QR-345-ST",
    type: "Fourgon",
    brand: "Fiat Ducato",
    capacity: "2 tonnes",
    fuelType: "Électrique",
    status: "maintenance",
    mileage: 45000,
    nextMaintenance: "2024-01-20",
  },
  {
    id: 6,
    plate: "UV-678-WX",
    type: "Camion 12T",
    brand: "MAN TGX",
    capacity: "12 tonnes",
    fuelType: "Diesel",
    status: "disponible",
    mileage: 125000,
    nextMaintenance: "2024-04-15",
  },
];

const statusConfig = {
  disponible: { label: "Disponible", className: "bg-success/10 text-success border-success/20" },
  en_service: { label: "En service", className: "bg-warning/10 text-warning border-warning/20" },
  maintenance: { label: "Maintenance", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const typeColors: Record<string, string> = {
  "Camion 20T": "bg-primary/10 text-primary",
  "Camion 12T": "bg-info/10 text-info",
  "Fourgon": "bg-accent/10 text-accent",
};

export default function Vehicles() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Véhicules</h1>
          <p className="text-muted-foreground">
            Gérez votre flotte de véhicules et leur maintenance.
          </p>
        </div>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
          <Plus className="h-5 w-5" />
          Nouveau véhicule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-card-foreground">{vehicles.length}</p>
          <p className="text-sm text-muted-foreground">Total véhicules</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-success">
            {vehicles.filter((v) => v.status === "disponible").length}
          </p>
          <p className="text-sm text-muted-foreground">Disponibles</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-warning">
            {vehicles.filter((v) => v.status === "en_service").length}
          </p>
          <p className="text-sm text-muted-foreground">En service</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-destructive">
            {vehicles.filter((v) => v.status === "maintenance").length}
          </p>
          <p className="text-sm text-muted-foreground">En maintenance</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un véhicule..." className="pl-10" />
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("rounded-lg p-3", typeColors[vehicle.type] || "bg-muted")}>
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    {vehicle.plate}
                  </h3>
                  <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Voir détails</DropdownMenuItem>
                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                  <DropdownMenuItem>Planifier maintenance</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Retirer de la flotte
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {vehicle.type}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium",
                  statusConfig[vehicle.status as keyof typeof statusConfig].className
                )}
              >
                {statusConfig[vehicle.status as keyof typeof statusConfig].label}
              </Badge>
            </div>

            {/* Details */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gauge className="h-4 w-4" />
                {vehicle.capacity}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Fuel className="h-4 w-4" />
                {vehicle.fuelType}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Car className="h-4 w-4" />
                {vehicle.mileage.toLocaleString()} km
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wrench className="h-4 w-4" />
                {vehicle.nextMaintenance}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
