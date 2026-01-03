import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Boxes, Eye, EyeOff, Mail, Lock, ArrowRight, User, Loader2, Building2, Truck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import deliveryTruckImg from "@/assets/delivery-truck.png";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const signUpSchema = loginSchema.extend({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  role: z.enum(["client", "chauffeur"]),
});

type UserRole = "client" | "chauffeur";

export default function Auth() {
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "client" as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const seedDemoAccounts = async () => {
    setIsSeeding(true);
    try {
      const token = prompt("Entrez le token de seed (DEMO_SEED_TOKEN):");
      if (!token) {
        setIsSeeding(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('seed-demo-accounts', {
        body: { token }
      });

      if (error) throw error;

      toast({
        title: "Comptes démo créés",
        description: `${data.results?.filter((r: { success: boolean }) => r.success).length || 0} comptes créés avec succès`,
      });

      console.log("Seed results:", data);
    } catch (error) {
      console.error("Seed error:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création des comptes",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = () => {
    try {
      if (isLogin) {
        loginSchema.parse(formData);
      } else {
        signUpSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    if (isLogin) {
      await signIn(formData.email, formData.password);
    } else {
      await signUp(formData.email, formData.password, formData.fullName, formData.role);
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <Boxes className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">LogiTrack Pro</span>
          </div>

          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">
              {isLogin ? "Bon retour !" : "Créer un compte"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isLogin
                ? "Connectez-vous pour accéder à votre espace de gestion logistique."
                : "Inscrivez-vous pour commencer à gérer vos opérations."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="animate-slide-up space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Nom complet
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jean Dupont"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`h-12 pl-11 ${errors.fullName ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-foreground">
                  Type de compte
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choisir un type de compte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>Client - Je veux expédier des colis</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="chauffeur">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Chauffeur - Je veux effectuer des livraisons</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Adresse email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@entreprise.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`h-12 pl-11 ${errors.email ? "border-destructive" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`h-12 pl-11 pr-11 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full gap-2 gradient-primary text-primary-foreground font-semibold shadow-glow transition-all hover:shadow-lg disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isLogin ? "Connexion..." : "Inscription..."}
                </>
              ) : (
                <>
                  {isLogin ? "Se connecter" : "S'inscrire"}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setFormData({ email: "", password: "", fullName: "", role: "client" });
              }}
              className="font-medium text-primary hover:underline"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>

          {/* Demo Accounts */}
          {isLogin && (
            <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Comptes de démonstration
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-md bg-background px-3 py-2">
                  <div>
                    <span className="font-medium text-foreground">Admin</span>
                    <span className="ml-2 text-muted-foreground">admin@logitrack.com</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setFormData({ ...formData, email: "admin@logitrack.com", password: "demo123456" })}
                  >
                    Utiliser
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-background px-3 py-2">
                  <div>
                    <span className="font-medium text-foreground">Manager</span>
                    <span className="ml-2 text-muted-foreground">manager@logitrack.com</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setFormData({ ...formData, email: "manager@logitrack.com", password: "demo123456" })}
                  >
                    Utiliser
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-background px-3 py-2">
                  <div>
                    <span className="font-medium text-foreground">Chauffeur</span>
                    <span className="ml-2 text-muted-foreground">chauffeur@logitrack.com</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setFormData({ ...formData, email: "chauffeur@logitrack.com", password: "demo123456" })}
                  >
                    Utiliser
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-background px-3 py-2">
                  <div>
                    <span className="font-medium text-foreground">Client</span>
                    <span className="ml-2 text-muted-foreground">client@logitrack.com</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setFormData({ ...formData, email: "client@logitrack.com", password: "demo123456" })}
                  >
                    Utiliser
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-muted-foreground">
                Mot de passe: <code className="rounded bg-muted px-1.5 py-0.5 font-mono">demo123456</code>
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full gap-2 text-xs"
                onClick={seedDemoAccounts}
                disabled={isSeeding}
              >
                {isSeeding ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {isSeeding ? "Création..." : "Créer les comptes démo"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="relative flex h-full items-center justify-center gradient-hero p-12">
          <div className="relative z-10 max-w-lg text-center">
            <div className="mb-8 inline-flex items-center justify-center">
              <img 
                src={deliveryTruckImg} 
                alt="Camion de livraison" 
                className="h-40 w-40 object-contain drop-shadow-2xl"
              />
            </div>
            <h2 className="mb-4 text-4xl font-bold text-primary-foreground">
              Gérez votre logistique efficacement
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Suivez vos commandes, livraisons et véhicules en temps réel. Optimisez vos opérations avec LogiTrack Pro.
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold text-primary-foreground">98%</p>
                <p className="text-sm text-primary-foreground/70">Satisfaction</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold text-primary-foreground">500+</p>
                <p className="text-sm text-primary-foreground/70">Entreprises</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold text-primary-foreground">1M+</p>
                <p className="text-sm text-primary-foreground/70">Livraisons</p>
              </div>
            </div>
          </div>

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary-foreground blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Truck body */}
      <rect x="1" y="6" width="13" height="10" rx="1" fill="currentColor" opacity="0.9" />
      {/* Cabin */}
      <path d="M14 8h4l3 4v4h-7V8z" fill="currentColor" opacity="0.8" />
      {/* Window */}
      <path d="M15 9h2.5l2 2.5H15V9z" fill="currentColor" opacity="0.3" />
      {/* Front wheel */}
      <circle cx="5" cy="17" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="5" cy="17" r="1" fill="currentColor" opacity="0.3" />
      {/* Back wheel */}
      <circle cx="17" cy="17" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="17" cy="17" r="1" fill="currentColor" opacity="0.3" />
      {/* Package line */}
      <rect x="3" y="9" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
      <rect x="8" y="9" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
