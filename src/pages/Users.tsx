import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Shield,
  Mail,
  Calendar,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const users = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@logitrack.fr",
    role: "admin",
    status: "actif",
    lastLogin: "2024-01-15 14:32",
    createdAt: "2023-06-15",
  },
  {
    id: 2,
    name: "Marie Lambert",
    email: "marie.lambert@logitrack.fr",
    role: "manager",
    status: "actif",
    lastLogin: "2024-01-15 09:15",
    createdAt: "2023-08-22",
  },
  {
    id: 3,
    name: "Marc Dubois",
    email: "marc.dubois@logitrack.fr",
    role: "chauffeur",
    status: "actif",
    lastLogin: "2024-01-15 06:45",
    createdAt: "2023-09-10",
  },
  {
    id: 4,
    name: "Sophie Martin",
    email: "sophie.martin@logitrack.fr",
    role: "manager",
    status: "actif",
    lastLogin: "2024-01-14 16:20",
    createdAt: "2023-10-05",
  },
  {
    id: 5,
    name: "Pierre Martin",
    email: "pierre.martin@logitrack.fr",
    role: "chauffeur",
    status: "inactif",
    lastLogin: "2024-01-10 08:30",
    createdAt: "2023-11-18",
  },
  {
    id: 6,
    name: "Luc Bernard",
    email: "luc.bernard@logitrack.fr",
    role: "chauffeur",
    status: "actif",
    lastLogin: "2024-01-15 07:00",
    createdAt: "2023-12-01",
  },
];

const roleConfig = {
  admin: { label: "Administrateur", className: "bg-primary/10 text-primary border-primary/20" },
  manager: { label: "Manager", className: "bg-accent/10 text-accent border-accent/20" },
  chauffeur: { label: "Chauffeur", className: "bg-info/10 text-info border-info/20" },
};

const statusConfig = {
  actif: { label: "Actif", className: "bg-success/10 text-success border-success/20" },
  inactif: { label: "Inactif", className: "bg-muted text-muted-foreground border-muted" },
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs et leurs permissions.
          </p>
        </div>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
          <Plus className="h-5 w-5" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-card-foreground">{users.length}</p>
          <p className="text-sm text-muted-foreground">Total utilisateurs</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-primary">
            {users.filter((u) => u.role === "admin").length}
          </p>
          <p className="text-sm text-muted-foreground">Administrateurs</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-accent">
            {users.filter((u) => u.role === "manager").length}
          </p>
          <p className="text-sm text-muted-foreground">Managers</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-bold text-info">
            {users.filter((u) => u.role === "chauffeur").length}
          </p>
          <p className="text-sm text-muted-foreground">Chauffeurs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card animate-slide-up" style={{ animationDelay: "200ms" }}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Utilisateur</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Rôle</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="font-semibold">Dernière connexion</TableHead>
              <TableHead className="font-semibold">Créé le</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-card-foreground">
                      {user.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      roleConfig[user.role as keyof typeof roleConfig].className
                    )}
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    {roleConfig[user.role as keyof typeof roleConfig].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      statusConfig[user.status as keyof typeof statusConfig].className
                    )}
                  >
                    {statusConfig[user.status as keyof typeof statusConfig].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.lastLogin}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {user.createdAt}
                  </div>
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
                      <DropdownMenuItem>Voir profil</DropdownMenuItem>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Réinitialiser mot de passe</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Désactiver
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
