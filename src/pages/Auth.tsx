import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Boxes, Eye, EyeOff, Mail, Lock, ArrowRight, User, Loader2, Building2, Truck, Package, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import heroTruckImg from "@/assets/hero-truck.jpg";

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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "client" as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const demoAccounts = [
    { label: "Admin", email: "admin@logitrack.com", icon: Boxes },
    { label: "Manager", email: "manager@logitrack.com", icon: Building2 },
    { label: "Chauffeur", email: "chauffeur@logitrack.com", icon: Truck },
    { label: "Client", email: "client@logitrack.com", icon: Package },
  ];

  const features = [
    { icon: Package, label: "Suivi temps réel", desc: "Géolocalisez vos colis" },
    { icon: MapPin, label: "Optimisation", desc: "Routes intelligentes" },
    { icon: Clock, label: "Ponctualité", desc: "98% à l'heure" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Form */}
      <div className="relative flex w-full flex-col justify-center px-6 py-12 lg:w-[45%] lg:px-12 xl:px-20">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Boxes className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">LogiTrack</span>
              <span className="ml-1 text-xl font-bold text-primary">Pro</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {isLogin ? "Bon retour !" : "Créer un compte"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isLogin
                ? "Connectez-vous pour accéder à votre tableau de bord."
                : "Inscrivez-vous pour commencer vos opérations."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Nom complet
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Jean Dupont"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={`h-11 pl-10 transition-all focus:ring-2 focus:ring-primary/20 ${errors.fullName ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    Type de compte
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choisir un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span>Client - Expédier des colis</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="chauffeur">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-primary" />
                          <span>Chauffeur - Livrer des colis</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Adresse email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@entreprise.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`h-11 pl-10 transition-all focus:ring-2 focus:ring-primary/20 ${errors.email ? "border-destructive" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </Label>
                {isLogin && (
                  <a href="#" className="text-xs font-medium text-primary hover:underline">
                    Mot de passe oublié ?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`h-11 pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary/20 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full gap-2 gradient-primary text-primary-foreground font-semibold shadow-lg transition-all hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isLogin ? "Connexion..." : "Inscription..."}
                </>
              ) : (
                <>
                  {isLogin ? "Se connecter" : "S'inscrire"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setFormData({ email: "", password: "", fullName: "", role: "client" });
              }}
              className="font-semibold text-primary transition-colors hover:text-accent"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>

          {/* Demo Accounts - Compact */}
          {isLogin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">Comptes démo</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, email: account.email, password: "demo123456" })}
                    className="group flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-primary/10">
                      <account.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{account.label}</p>
                      <p className="text-[10px] text-muted-foreground">demo123456</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Right side - Hero with image */}
      <div className="relative hidden overflow-hidden lg:block lg:w-[55%]">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroTruckImg})` }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-12">
          {/* Top decorative element */}
          <div className="flex justify-end">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          {/* Main content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-lg"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">Plateforme #1 en logistique</span>
            </div>
            
            <h2 className="mb-4 text-4xl font-bold leading-tight text-foreground xl:text-5xl">
              Gérez votre flotte avec{" "}
              <span className="text-gradient">précision</span>
            </h2>
            
            <p className="mb-8 text-lg text-muted-foreground">
              Optimisez vos livraisons, suivez vos véhicules en temps réel et augmentez la satisfaction de vos clients.
            </p>

            {/* Features */}
            <div className="flex gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats at bottom */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-8"
          >
            {[
              { value: "500+", label: "Entreprises" },
              { value: "1M+", label: "Livraisons" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="border-l border-primary/30 pl-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-12 top-12">
          <div className="h-32 w-32 rounded-full border border-primary/20" />
        </div>
        <div className="absolute bottom-24 right-24">
          <div className="h-48 w-48 rounded-full border border-primary/10" />
        </div>
      </div>
    </div>
  );
}
