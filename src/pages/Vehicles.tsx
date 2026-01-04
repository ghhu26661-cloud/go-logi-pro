import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Wrench, 
  Fuel, 
  Calendar,
  Gauge,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Edit,
  Trash2,
  Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Vehicle {
  id: string;
  registration_number: string;
  brand: string;
  model: string;
  type: string;
  capacity_kg: number | null;
  capacity_m3: number | null;
  year: number | null;
  status: string;
  fuel_type: string | null;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  mileage_km: number | null;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  available: { label: "Disponible", className: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  in_use: { label: "En service", className: "bg-warning/10 text-warning border-warning/20", icon: Truck },
  maintenance: { label: "Maintenance", className: "bg-info/10 text-info border-info/20", icon: Wrench },
  out_of_service: { label: "Hors service", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

const typeConfig: Record<string, { label: string; className: string }> = {
  truck: { label: "Camion", className: "bg-primary/10 text-primary" },
  van: { label: "Camionnette", className: "bg-accent/10 text-accent" },
  trailer: { label: "Remorque", className: "bg-info/10 text-info" },
  semi: { label: "Semi-remorque", className: "bg-warning/10 text-warning" },
};

export default function Vehicles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    registration_number: "",
    brand: "",
    model: "",
    type: "truck",
    capacity_kg: "",
    capacity_m3: "",
    year: "",
    status: "available",
    fuel_type: "diesel",
    mileage_km: "",
    notes: "",
  });

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Vehicle[];
    },
  });

  const addVehicleMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("vehicles").insert({
        registration_number: data.registration_number,
        brand: data.brand,
        model: data.model,
        type: data.type,
        capacity_kg: data.capacity_kg ? parseFloat(data.capacity_kg) : null,
        capacity_m3: data.capacity_m3 ? parseFloat(data.capacity_m3) : null,
        year: data.year ? parseInt(data.year) : null,
        status: data.status,
        fuel_type: data.fuel_type,
        mileage_km: data.mileage_km ? parseInt(data.mileage_km) : null,
        notes: data.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast({ title: "Véhicule ajouté", description: "Le véhicule a été ajouté avec succès." });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("vehicles")
        .update({
          registration_number: data.registration_number,
          brand: data.brand,
          model: data.model,
          type: data.type,
          capacity_kg: data.capacity_kg ? parseFloat(data.capacity_kg) : null,
          capacity_m3: data.capacity_m3 ? parseFloat(data.capacity_m3) : null,
          year: data.year ? parseInt(data.year) : null,
          status: data.status,
          fuel_type: data.fuel_type,
          mileage_km: data.mileage_km ? parseInt(data.mileage_km) : null,
          notes: data.notes || null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast({ title: "Véhicule modifié", description: "Le véhicule a été modifié avec succès." });
      setEditingVehicle(null);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast({ title: "Véhicule supprimé", description: "Le véhicule a été supprimé." });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      registration_number: "",
      brand: "",
      model: "",
      type: "truck",
      capacity_kg: "",
      capacity_m3: "",
      year: "",
      status: "available",
      fuel_type: "diesel",
      mileage_km: "",
      notes: "",
    });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      registration_number: vehicle.registration_number,
      brand: vehicle.brand,
      model: vehicle.model,
      type: vehicle.type,
      capacity_kg: vehicle.capacity_kg?.toString() || "",
      capacity_m3: vehicle.capacity_m3?.toString() || "",
      year: vehicle.year?.toString() || "",
      status: vehicle.status,
      fuel_type: vehicle.fuel_type || "diesel",
      mileage_km: vehicle.mileage_km?.toString() || "",
      notes: vehicle.notes || "",
    });
  };

  const handleSubmit = () => {
    if (editingVehicle) {
      updateVehicleMutation.mutate({ id: editingVehicle.id, data: formData });
    } else {
      addVehicleMutation.mutate(formData);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    inUse: vehicles.filter((v) => v.status === "in_use").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
  };

  const VehicleForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registration">Immatriculation *</Label>
          <Input
            id="registration"
            value={formData.registration_number}
            onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
            placeholder="AB-123-CD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="truck">Camion</SelectItem>
              <SelectItem value="van">Camionnette</SelectItem>
              <SelectItem value="trailer">Remorque</SelectItem>
              <SelectItem value="semi">Semi-remorque</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Marque *</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Mercedes, Volvo..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Modèle *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Actros, FH..."
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Année</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="2023"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity_kg">Capacité (kg)</Label>
          <Input
            id="capacity_kg"
            type="number"
            value={formData.capacity_kg}
            onChange={(e) => setFormData({ ...formData, capacity_kg: e.target.value })}
            placeholder="5000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity_m3">Volume (m³)</Label>
          <Input
            id="capacity_m3"
            type="number"
            value={formData.capacity_m3}
            onChange={(e) => setFormData({ ...formData, capacity_m3: e.target.value })}
            placeholder="40"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="in_use">En service</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="out_of_service">Hors service</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuel">Carburant</Label>
          <Select value={formData.fuel_type} onValueChange={(v) => setFormData({ ...formData, fuel_type: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="gasoline">Essence</SelectItem>
              <SelectItem value="electric">Électrique</SelectItem>
              <SelectItem value="hybrid">Hybride</SelectItem>
              <SelectItem value="gnv">GNV</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage">Kilométrage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage_km}
            onChange={(e) => setFormData({ ...formData, mileage_km: e.target.value })}
            placeholder="150000"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Gestion de la Flotte</h1>
          <p className="text-muted-foreground">Gérez vos véhicules et leur disponibilité</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
              <Plus className="h-4 w-4" />
              Ajouter un véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un véhicule</DialogTitle>
              <DialogDescription>
                Remplissez les informations du nouveau véhicule.
              </DialogDescription>
            </DialogHeader>
            <VehicleForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleSubmit} disabled={addVehicleMutation.isPending} className="gradient-primary">
                {addVehicleMutation.isPending ? "Ajout..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4 animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <Truck className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Total véhicules</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-success">{stats.available}</p>
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <p className="text-sm text-muted-foreground">Disponibles</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-primary">{stats.inUse}</p>
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">En service</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-warning">{stats.maintenance}</p>
            <Wrench className="h-5 w-5 text-warning" />
          </div>
          <p className="text-sm text-muted-foreground">Maintenance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par immatriculation, marque..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="in_use">En service</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="out_of_service">Hors service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Chargement...
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Aucun véhicule trouvé
          </div>
        ) : (
          filteredVehicles.map((vehicle) => {
            const status = statusConfig[vehicle.status] || statusConfig.available;
            const type = typeConfig[vehicle.type] || typeConfig.truck;
            const StatusIcon = status.icon;
            
            return (
              <div
                key={vehicle.id}
                className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-lg hover:border-primary/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg p-3", type.className)}>
                      <Car className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground font-mono">
                        {vehicle.registration_number}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.brand} {vehicle.model}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteVehicleMutation.mutate(vehicle.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs", type.className)}>
                    {type.label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs gap-1", status.className)}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Gauge className="h-4 w-4" />
                    {vehicle.capacity_kg ? `${vehicle.capacity_kg.toLocaleString()} kg` : "-"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Fuel className="h-4 w-4" />
                    {vehicle.fuel_type || "-"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Car className="h-4 w-4" />
                    {vehicle.mileage_km ? `${vehicle.mileage_km.toLocaleString()} km` : "-"}
                  </div>
                  {vehicle.year && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {vehicle.year}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingVehicle} onOpenChange={(open) => !open && setEditingVehicle(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le véhicule</DialogTitle>
            <DialogDescription>
              Modifiez les informations du véhicule.
            </DialogDescription>
          </DialogHeader>
          <VehicleForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVehicle(null)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={updateVehicleMutation.isPending} className="gradient-primary">
              {updateVehicleMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
