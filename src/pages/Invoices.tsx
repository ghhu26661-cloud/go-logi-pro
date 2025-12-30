import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  FileText,
  Download,
  Eye,
  Calendar,
  Euro,
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
import { cn } from "@/lib/utils";

const invoices = [
  {
    id: "FAC-2024-001",
    orderId: "CMD-2024-001",
    client: "Transport Express SARL",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    amountHT: 1041.67,
    tva: 208.33,
    amountTTC: 1250.00,
    status: "payee",
  },
  {
    id: "FAC-2024-002",
    orderId: "CMD-2024-002",
    client: "Logistics Plus",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    amountHT: 741.67,
    tva: 148.33,
    amountTTC: 890.00,
    status: "en_attente",
  },
  {
    id: "FAC-2024-003",
    orderId: "CMD-2024-004",
    client: "Global Freight Co",
    date: "2024-01-14",
    dueDate: "2024-02-14",
    amountHT: 1375.00,
    tva: 275.00,
    amountTTC: 1650.00,
    status: "payee",
  },
  {
    id: "FAC-2024-004",
    orderId: "CMD-2024-006",
    client: "Euro Transport SA",
    date: "2024-01-13",
    dueDate: "2024-02-13",
    amountHT: 1575.00,
    tva: 315.00,
    amountTTC: 1890.00,
    status: "en_retard",
  },
  {
    id: "FAC-2024-005",
    orderId: "CMD-2024-007",
    client: "Transport Express SARL",
    date: "2024-01-12",
    dueDate: "2024-02-12",
    amountHT: 933.33,
    tva: 186.67,
    amountTTC: 1120.00,
    status: "payee",
  },
];

const statusConfig = {
  payee: { label: "Payée", className: "bg-success/10 text-success border-success/20" },
  en_attente: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  en_retard: { label: "En retard", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPaid = invoices
    .filter((i) => i.status === "payee")
    .reduce((sum, i) => sum + i.amountTTC, 0);
  
  const totalPending = invoices
    .filter((i) => i.status === "en_attente")
    .reduce((sum, i) => sum + i.amountTTC, 0);

  const totalOverdue = invoices
    .filter((i) => i.status === "en_retard")
    .reduce((sum, i) => sum + i.amountTTC, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Factures</h1>
          <p className="text-muted-foreground">
            Gérez vos factures et suivez les paiements.
          </p>
        </div>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
          <Plus className="h-5 w-5" />
          Nouvelle facture
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{invoices.length}</p>
              <p className="text-sm text-muted-foreground">Total factures</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <Euro className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{totalPaid.toLocaleString()} €</p>
              <p className="text-sm text-muted-foreground">Payées</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <Euro className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{totalPending.toLocaleString()} €</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <Euro className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{totalOverdue.toLocaleString()} €</p>
              <p className="text-sm text-muted-foreground">En retard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une facture..."
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
              <TableHead className="font-semibold">N° Facture</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Échéance</TableHead>
              <TableHead className="font-semibold text-right">Montant HT</TableHead>
              <TableHead className="font-semibold text-right">TVA</TableHead>
              <TableHead className="font-semibold text-right">Total TTC</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium text-card-foreground">
                      {invoice.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {invoice.client}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {invoice.date}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {invoice.dueDate}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {invoice.amountHT.toLocaleString()} €
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {invoice.tva.toLocaleString()} €
                </TableCell>
                <TableCell className="text-right font-semibold text-card-foreground">
                  {invoice.amountTTC.toLocaleString()} €
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      statusConfig[invoice.status as keyof typeof statusConfig].className
                    )}
                  >
                    {statusConfig[invoice.status as keyof typeof statusConfig].label}
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
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>Marquer payée</DropdownMenuItem>
                      <DropdownMenuItem>Envoyer rappel</DropdownMenuItem>
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
