import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Zap,
  Shield,
  Users,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Echtzeit-Analysen",
    description:
      "Verfolgen Sie die Performance Ihrer Kampagnen in Echtzeit mit detaillierten Metriken.",
  },
  {
    icon: Zap,
    title: "Schnelle Optimierung",
    description:
      "KI-gestützte Empfehlungen zur Maximierung Ihres Werbebudgets.",
  },
  {
    icon: Shield,
    title: "Datenschutz",
    description:
      "DSGVO-konforme Datenspeicherung und -verarbeitung für maximale Sicherheit.",
  },
  {
    icon: Users,
    title: "Team-Kollaboration",
    description:
      "Arbeiten Sie nahtlos mit Ihrem Team an gemeinsamen Kampagnen.",
  },
];

const stats = [
  { value: "2.4M+", label: "Ausgelieferte Anzeigen" },
  { value: "98.5%", label: "Kundenzufriedenheit" },
  { value: "340+", label: "Aktive Werbetreibende" },
  { value: "24/7", label: "Support verfügbar" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">AD</span>
              </div>
              <span className="font-display font-semibold text-xl">
                AdManager
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Funktionen
              </a>
              <a
                href="#stats"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Statistiken
              </a>
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Preise
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Anmelden</Link>
              </Button>
              <Button variant="gradient" asChild>
                <Link to="/auth/register">Kostenlos starten</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-bg-soft border border-primary/20 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Neu: KI-gestützte Optimierung
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
              Ihre Werbung.{" "}
              <span className="gradient-text">Maximale Wirkung.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Verwalten Sie alle Ihre Werbekampagnen an einem Ort. Analysieren
              Sie Performance, optimieren Sie Budgets und steigern Sie Ihren ROI
              mit unserer modernen Plattform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth/register">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl">
                Demo ansehen
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 gradient-bg rounded-3xl blur-3xl opacity-20" />
            <div className="relative bg-card rounded-2xl sm:rounded-3xl border border-border shadow-2xl overflow-hidden">
              <div className="h-8 bg-muted/50 border-b border-border flex items-center gap-2 px-4">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="p-4 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Impressionen", value: "1.24M" },
                    { label: "Klicks", value: "48.2K" },
                    { label: "CTR", value: "3.89%" },
                    { label: "Conversions", value: "1.8K" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-muted/30 rounded-xl p-4 text-center"
                    >
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-lg sm:text-2xl font-bold font-display mt-1">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="h-32 sm:h-48 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-12 sm:h-20 w-12 sm:w-20 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold gradient-text">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Alles was Sie brauchen
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leistungsstarke Tools zur Verwaltung und Optimierung Ihrer
              Werbekampagnen.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="fintech-card group hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="h-12 w-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:animate-pulse-glow">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-bg p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
                Bereit durchzustarten?
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Starten Sie noch heute und entdecken Sie, wie einfach
                professionelles Werbemanagement sein kann.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="xl"
                  variant="glass"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  asChild
                >
                  <Link to="/auth/register">
                    Kostenlos starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-primary-foreground/70 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Keine Kreditkarte
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  14 Tage kostenlos
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  AD
                </span>
              </div>
              <span className="font-display font-semibold">AdManager</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AdManager. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
