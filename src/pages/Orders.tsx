import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Calendar,
  User,
  Package,
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "CMD-2024-001",
    client: "Transport Express SARL",
    origin: "Paris, France",
    destination: "Lyon, France",
    date: "2024-01-15",
    status: "livree",
    driver: "Marc Dubois",
    amount: 1250,
  },
  {
    id: "CMD-2024-002",
    client: "Logistics Plus",
    origin: "Lyon, France",
    destination: "Marseille, France",
    date: "2024-01-15",
    status: "en_cours",
    driver: "Pierre Martin",
    amount: 890,
  },
  {
    id: "CMD-2024-003",
    client: "FastShip International",
    origin: "Paris, France",
    destination: "Bordeaux, France",
    date: "2024-01-14",
    status: "en_attente",
    driver: null,
    amount: 2100,
  },
  {
    id: "CMD-2024-004",
    client: "Global Freight Co",
    origin: "Marseille, France",
    destination: "Toulouse, France",
    date: "2024-01-14",
    status: "livree",
    driver: "Jean Petit",
    amount: 1650,
  },
  {
    id: "CMD-2024-005",
    client: "Quick Delivery",
    origin: "Nantes, France",
    destination: "Paris, France",
    date: "2024-01-13",
    status: "annulee",
    driver: null,
    amount: 450,
  },
  {
    id: "CMD-2024-006",
    client: "Euro Transport SA",
    origin: "Lille, France",
    destination: "Strasbourg, France",
    date: "2024-01-13",
    status: "en_cours",
    driver: "Luc Bernard",
    amount: 1890,
  },
  {
    id: "CMD-2024-007",
    client: "Transport Express SARL",
    origin: "Bordeaux, France",
    destination: "Lyon, France",
    date: "2024-01-12",
    status: "livree",
    driver: "Marc Dubois",
    amount: 1120,
  },
];

const statusConfig = {
  livree: { label: "Livrée", className: "bg-success/10 text-success border-success/20" },
  en_cours: { label: "En cours", className: "bg-warning/10 text-warning border-warning/20" },
  en_attente: { label: "En attente", className: "bg-info/10 text-info border-info/20" },
  annulee: { label: "Annulée", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    en_attente: orders.filter((o) => o.status === "en_attente").length,
    en_cours: orders.filter((o) => o.status === "en_cours").length,
    livree: orders.filter((o) => o.status === "livree").length,
    annulee: orders.filter((o) => o.status === "annulee").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Commandes</h1>
          <p className="text-muted-foreground">
            Gérez et suivez toutes vos commandes de transport.
          </p>
        </div>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
          <Plus className="h-5 w-5" />
          Nouvelle commande
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 animate-slide-up">
        {[
          { key: "all", label: "Toutes" },
          { key: "en_attente", label: "En attente" },
          { key: "en_cours", label: "En cours" },
          { key: "livree", label: "Livrées" },
          { key: "annulee", label: "Annulées" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              statusFilter === tab.key
                ? "bg-primary text-primary-foreground shadow-glow"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
            )}
          >
            {tab.label} ({statusCounts[tab.key as keyof typeof statusCounts]})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro ou client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Date (récent)</SelectItem>
            <SelectItem value="date-asc">Date (ancien)</SelectItem>
            <SelectItem value="amount-desc">Montant (haut)</SelectItem>
            <SelectItem value="amount-asc">Montant (bas)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card animate-slide-up" style={{ animationDelay: "200ms" }}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">N° Commande</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Trajet</TableHead>
              <TableHead className="font-semibold">Chauffeur</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Montant</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-medium text-card-foreground">
                      {order.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {order.client}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">{order.origin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <span className="text-muted-foreground">{order.destination}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {order.driver ? (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-card-foreground">{order.driver}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Non assigné</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {order.date}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-card-foreground">
                  {order.amount.toLocaleString()} €
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      statusConfig[order.status as keyof typeof statusConfig].className
                    )}
                  >
                    {statusConfig[order.status as keyof typeof statusConfig].label}
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
                      <DropdownMenuItem>Assigner chauffeur</DropdownMenuItem>
                      <DropdownMenuItem>Générer facture</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Annuler
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
