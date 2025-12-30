import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const clients = [
  {
    id: 1,
    name: "Transport Express SARL",
    email: "contact@transport-express.fr",
    phone: "+33 1 23 45 67 89",
    address: "15 Rue de la Logistique, 75001 Paris",
    orders: 45,
    status: "actif",
  },
  {
    id: 2,
    name: "Logistics Plus",
    email: "info@logistics-plus.com",
    phone: "+33 4 56 78 90 12",
    address: "28 Avenue du Commerce, 69001 Lyon",
    orders: 32,
    status: "actif",
  },
  {
    id: 3,
    name: "FastShip International",
    email: "contact@fastship.io",
    phone: "+33 6 12 34 56 78",
    address: "5 Boulevard Maritime, 13001 Marseille",
    orders: 28,
    status: "actif",
  },
  {
    id: 4,
    name: "Global Freight Co",
    email: "sales@globalfreight.fr",
    phone: "+33 5 67 89 01 23",
    address: "42 Rue de l'Industrie, 33000 Bordeaux",
    orders: 19,
    status: "inactif",
  },
  {
    id: 5,
    name: "Quick Delivery",
    email: "hello@quickdelivery.fr",
    phone: "+33 7 89 01 23 45",
    address: "8 Place du Transport, 31000 Toulouse",
    orders: 56,
    status: "actif",
  },
  {
    id: 6,
    name: "Euro Transport SA",
    email: "contact@eurotransport.eu",
    phone: "+33 2 34 56 78 90",
    address: "120 Avenue Foch, 44000 Nantes",
    orders: 12,
    status: "actif",
  },
];

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">
            Gérez votre portefeuille clients et leurs informations.
          </p>
        </div>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
          <Plus className="h-5 w-5" />
          Nouveau client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center animate-slide-up">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{clients.length}</p>
              <p className="text-sm text-muted-foreground">Total clients</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <Building2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {clients.filter((c) => c.status === "actif").length}
              </p>
              <p className="text-sm text-muted-foreground">Clients actifs</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {clients.reduce((sum, c) => sum + c.orders, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total commandes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card animate-slide-up" style={{ animationDelay: "200ms" }}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Adresse</TableHead>
              <TableHead className="font-semibold text-center">Commandes</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-card-foreground">
                      {client.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {client.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="max-w-[200px] truncate">{client.address}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-card-foreground">
                    {client.orders}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      client.status === "actif"
                        ? "border-success/20 bg-success/10 text-success"
                        : "border-muted-foreground/20 bg-muted text-muted-foreground"
                    }
                  >
                    {client.status === "actif" ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Voir détails</DropdownMenuItem>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Voir commandes</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
