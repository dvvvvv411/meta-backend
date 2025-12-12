import { Check, Building2, Zap, Shield, BarChart3, Headphones, Clock, ArrowRight, Star, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const benefits = [
  { icon: Zap, text: 'Unbegrenzte Kampagnen', description: 'Keine Limits bei der Erstellung' },
  { icon: BarChart3, text: 'Skalierbare Limits', description: 'Wächst mit deinem Business' },
  { icon: Shield, text: 'Meta Agency Trust', description: 'Verifizierter Partner-Status' },
  { icon: Clock, text: 'Sofortiger Zugriff', description: 'Direkt nach Zahlung aktiv' },
  { icon: Headphones, text: 'Premium Support', description: 'Prioritäre Bearbeitung' },
  { icon: Check, text: 'Keine versteckten Kosten', description: 'Transparente Preise' },
];

const trustPoints = [
  '30 Tage Laufzeit',
  'Sofort einsatzbereit', 
  'Sichere Crypto-Zahlung',
];

interface ProductDetailProps {
  onRentClick: () => void;
}

export function ProductDetail({ onRentClick }: ProductDetailProps) {
  return (
    <div className="relative">
      {/* Animated glow background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-xl opacity-20 animate-pulse" />
      
      {/* Main card with gradient border */}
      <div className="relative bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 p-[2px] rounded-3xl">
        <div className="relative bg-card rounded-3xl overflow-hidden">
          
          {/* Popular ribbon */}
          <div className="absolute top-6 -right-8 z-10">
            <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-12 py-1.5 text-sm font-semibold rotate-45 shadow-lg flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              BELIEBT
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="relative p-8 md:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              
              {/* Left Column - Pricing Hero */}
              <div className="flex flex-col justify-center order-2 lg:order-1">
                <div className="space-y-6">
                  {/* Icon and Badge */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg" />
                      <div className="relative w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
                        <Building2 className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                    <Badge className="gradient-bg text-primary-foreground border-0 text-sm px-3 py-1">
                      Premium • 30 Tage
                    </Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
                      Agency Account
                    </h2>
                    <p className="text-muted-foreground">
                      Dein Schlüssel zu professionellem Advertising
                    </p>
                  </div>

                  {/* Price */}
                  <div className="py-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl lg:text-7xl font-bold gradient-text">150€</span>
                      <span className="text-xl text-muted-foreground">/ 30 Tage</span>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Automatische Verlängerung</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Jederzeit kündbar</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    size="xl"
                    variant="hero"
                    className="w-full group"
                    onClick={onRentClick}
                  >
                    Jetzt mieten
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>

                  {/* Trust badge */}
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Sichere & verschlüsselte Zahlung</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Benefits */}
              <div className="order-1 lg:order-2 lg:border-l lg:border-border/50 lg:pl-16">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 gradient-bg rounded-full" />
                  Deine Vorteile
                </h3>

                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, i) => (
                    <div 
                      key={i} 
                      className="group flex items-start gap-4 p-4 rounded-2xl bg-background/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 group-hover:gradient-bg flex items-center justify-center transition-all duration-300">
                        <benefit.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block">{benefit.text}</span>
                        <span className="text-sm text-muted-foreground">{benefit.description}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional trust points */}
                <div className="flex flex-wrap gap-3">
                  {trustPoints.map((point, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-secondary/50 text-secondary-foreground px-3 py-1.5 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Proof Footer */}
            <div className="mt-10 pt-8 border-t border-border/50">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">500+</span> zufriedene Werbetreibende vertrauen uns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
