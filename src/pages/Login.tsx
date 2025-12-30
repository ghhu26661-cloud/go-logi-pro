import { useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login - will be connected to backend
    window.location.href = "/";
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
            <h1 className="text-3xl font-bold text-foreground">Bon retour !</h1>
            <p className="mt-2 text-muted-foreground">
              Connectez-vous pour accéder à votre espace de gestion logistique.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="animate-slide-up space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-11"
                  required
                />
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-11 pr-11"
                  required
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-muted-foreground"
                >
                  Se souvenir de moi
                </Label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <Button
              type="submit"
              className="h-12 w-full gap-2 gradient-primary text-primary-foreground font-semibold shadow-glow transition-all hover:shadow-lg"
            >
              Se connecter
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Demander un accès
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="relative flex h-full items-center justify-center gradient-hero p-12">
          <div className="relative z-10 max-w-lg text-center">
            <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-primary/20 p-4">
              <Truck className="h-16 w-16 text-primary-foreground" />
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

function Truck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17h4V5H2v12h3" />
      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
