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
  Star,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroTruck from "@/assets/hero-truck.jpg";

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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25"
            >
              <Boxes className="h-5 w-5 text-primary-foreground" />
            </motion.div>
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Commencer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden pt-32 pb-20 min-h-screen flex items-center">
        {/* Hero Background Image */}
        <motion.div 
          className="absolute inset-0 -z-10"
          style={{ y: bgY, scale: bgScale }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroTruck})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[120px]" 
          />
        </motion.div>

        <motion.div 
          className="container mx-auto px-4"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-4 w-4" />
              </motion.div>
              <span>La nouvelle génération de gestion logistique</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Gérez votre logistique avec{" "}
              <motion.span 
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
              >
                précision
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            >
              LogiTrack Pro simplifie la gestion de vos livraisons, commandes et véhicules. 
              Une solution tout-en-un pour optimiser vos opérations logistiques.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/auth">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="h-12 gap-2 px-8 text-base bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    Démarrer gratuitement
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  Voir la démo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-2 bg-muted-foreground rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                  className="text-3xl font-bold text-foreground sm:text-4xl"
                >
                  {stat.value}
                </motion.div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-muted-foreground">
              Une plateforme complète pour gérer tous les aspects de votre chaîne logistique.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <feature.icon className="h-6 w-6" />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-border bg-card/30 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-muted-foreground">
              Découvrez pourquoi des centaines d'entreprises ont choisi LogiTrack Pro.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-8 md:grid-cols-3"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 20px 40px -20px hsl(var(--primary) / 0.3)",
                  transition: { duration: 0.2 } 
                }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="mb-4 flex gap-1"
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <Star className="h-5 w-5 fill-warning text-warning" />
                    </motion.div>
                  ))}
                </motion.div>
                <p className="mb-6 text-foreground">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold"
                  >
                    {testimonial.name.charAt(0)}
                  </motion.div>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute inset-0 -z-10"
        >
          <motion.div 
            animate={{ 
              background: [
                "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--accent) / 0.1) 100%)",
                "linear-gradient(135deg, hsl(var(--accent) / 0.1) 0%, hsl(var(--primary) / 0.1) 100%)",
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0" 
          />
        </motion.div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Prêt à optimiser votre logistique ?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Rejoignez des centaines d'entreprises qui font confiance à LogiTrack Pro pour gérer leurs opérations.
            </p>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/auth">
                <motion.div
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="h-12 gap-2 px-8 text-base bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25">
                    Créer un compte gratuit
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/auth">
                <motion.div
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Contacter les ventes
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-border bg-card py-12"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <Boxes className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">LogiTrack Pro</span>
            </motion.div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {["Confidentialité", "Conditions", "Contact"].map((item, index) => (
                <motion.a 
                  key={item}
                  href="#" 
                  whileHover={{ y: -2, color: "hsl(var(--foreground))" }}
                  className="hover:text-foreground transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 LogiTrack Pro. Tous droits réservés.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
