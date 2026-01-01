import { Link } from "react-router-dom";
import { 
  Boxes, 
  ArrowRight, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Shield, 
  BarChart3,
  CheckCircle2,
  Star,
  Users,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const features = [
  {
    icon: Truck,
    title: "Gestion des Livraisons",
    description: "Suivez vos livraisons en temps réel avec un système de tracking avancé.",
  },
  {
    icon: Package,
    title: "Gestion des Commandes",
    description: "Gérez toutes vos commandes depuis une interface centralisée et intuitive.",
  },
  {
    icon: MapPin,
    title: "Optimisation des Routes",
    description: "Optimisez vos trajets pour réduire les coûts et améliorer l'efficacité.",
  },
  {
    icon: Clock,
    title: "Suivi en Temps Réel",
    description: "Informez vos clients avec des mises à jour de statut instantanées.",
  },
  {
    icon: Shield,
    title: "Sécurité des Données",
    description: "Vos données sont protégées avec un chiffrement de niveau entreprise.",
  },
  {
    icon: BarChart3,
    title: "Analyses Détaillées",
    description: "Accédez à des rapports complets pour optimiser vos opérations.",
  },
];

const stats = [
  { value: "99.9%", label: "Disponibilité" },
  { value: "50K+", label: "Livraisons/jour" },
  { value: "500+", label: "Entreprises" },
  { value: "4.9/5", label: "Satisfaction" },
];

const testimonials = [
  {
    name: "Sophie Martin",
    role: "Directrice Logistique",
    company: "TransExpress",
    content: "LogiTrack Pro a transformé notre gestion logistique. Nous avons réduit nos délais de 40%.",
    rating: 5,
  },
  {
    name: "Pierre Dubois",
    role: "CEO",
    company: "FastDelivery",
    content: "Une solution complète et intuitive. Notre équipe l'a adoptée en quelques jours.",
    rating: 5,
  },
  {
    name: "Marie Lambert",
    role: "Responsable Transport",
    company: "LogiCorp",
    content: "Le meilleur investissement que nous ayons fait cette année. ROI immédiat.",
    rating: 5,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <Boxes className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LogiTrack Pro</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Connexion
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Commencer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" />
              <span>La nouvelle génération de gestion logistique</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Gérez votre logistique avec{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                précision
              </span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              LogiTrack Pro simplifie la gestion de vos livraisons, commandes et véhicules. 
              Une solution tout-en-un pour optimiser vos opérations logistiques.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button size="lg" className="h-12 gap-2 px-8 text-base bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Démarrer gratuitement
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Voir la démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-muted-foreground">
              Une plateforme complète pour gérer tous les aspects de votre chaîne logistique.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-border bg-card/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-muted-foreground">
              Découvrez pourquoi des centaines d'entreprises ont choisi LogiTrack Pro.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mb-6 text-foreground">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Prêt à optimiser votre logistique ?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Rejoignez des centaines d'entreprises qui font confiance à LogiTrack Pro pour gérer leurs opérations.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button size="lg" className="h-12 gap-2 px-8 text-base bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25">
                  Créer un compte gratuit
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  Contacter les ventes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <Boxes className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">LogiTrack Pro</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-foreground transition-colors">Conditions</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 LogiTrack Pro. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
