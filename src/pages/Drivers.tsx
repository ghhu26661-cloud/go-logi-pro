import {
  Plus,
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  Star,
  Truck,
  CreditCard,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const drivers = [
  {
    id: 1,
    name: "Marc Dubois",
    email: "marc.dubois@logitrack.fr",
    phone: "+33 6 12 34 56 78",
    license: "B-123456",
    vehicle: "AB-123-CD",
    status: "en_service",
    rating: 4.8,
    deliveries: 234,
  },
  {
    id: 2,
    name: "Pierre Martin",
    email: "pierre.martin@logitrack.fr",
    phone: "+33 6 23 45 67 89",
    license: "B-234567",
    vehicle: "EF-456-GH",
    status: "en_service",
    rating: 4.9,
    deliveries: 198,
  },
  {
    id: 3,
    name: "Jean Petit",
    email: "jean.petit@logitrack.fr",
    phone: "+33 6 34 56 78 90",
    license: "B-345678",
    vehicle: "IJ-789-KL",
    status: "disponible",
    rating: 4.7,
    deliveries: 312,
  },
  {
    id: 4,
    name: "Luc Bernard",
    email: "luc.bernard@logitrack.fr",
    phone: "+33 6 45 67 89 01",
    license: "B-456789",
    vehicle: "MN-012-OP",
    status: "en_service",
    rating: 4.6,
    deliveries: 156,
  },
  {
    id: 5,
    name: "Paul Robert",
    email: "paul.robert@logitrack.fr",
    phone: "+33 6 56 78 90 12",
    license: "B-567890",
    vehicle: null,
    status: "repos",
    rating: 4.5,
    deliveries: 89,
  },
  {
    id: 6,
    name: "Thomas Leroy",
    email: "thomas.leroy@logitrack.fr",
    phone: "+33 6 67 89 01 23",
    license: "B-678901",
    vehicle: "QR-345-ST",
    status: "disponible",
    rating: 4.8,
    deliveries: 267,
  },
];

const statusConfig = {
  en_service: { label: "En service", className: "bg-warning/10 text-warning border-warning/20" },
  disponible: { label: "Disponible", className: "bg-success/10 text-success border-success/20" },
  repos: { label: "En repos", className: "bg-muted text-muted-foreground border-muted" },
};

export default function Drivers() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Chauffeurs</h1>
          <p className="text-muted-foreground">
            Gérez votre équipe de chauffeurs et leurs affectations.
          </p>
        </div>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
          <Plus className="h-5 w-5" />
          Nouveau chauffeur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-card-foreground">{drivers.length}</p>
          <p className="text-sm text-muted-foreground">Total chauffeurs</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-success">
            {drivers.filter((d) => d.status === "disponible").length}
          </p>
          <p className="text-sm text-muted-foreground">Disponibles</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-warning">
            {drivers.filter((d) => d.status === "en_service").length}
          </p>
          <p className="text-sm text-muted-foreground">En service</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-muted-foreground">
            {drivers.filter((d) => d.status === "repos").length}
          </p>
          <p className="text-sm text-muted-foreground">En repos</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un chauffeur..." className="pl-10" />
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                    {driver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    {driver.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-1 text-xs font-medium",
                      statusConfig[driver.status as keyof typeof statusConfig].className
                    )}
                  >
                    {statusConfig[driver.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Voir profil</DropdownMenuItem>
                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                  <DropdownMenuItem>Assigner véhicule</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Désactiver
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Contact */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {driver.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {driver.phone}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-warning fill-warning" />
                <span className="font-semibold text-card-foreground">{driver.rating}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                {driver.deliveries} livraisons
              </div>
              {driver.vehicle ? (
                <div className="flex items-center gap-1 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-card-foreground">{driver.vehicle}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground italic">Pas de véhicule</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
