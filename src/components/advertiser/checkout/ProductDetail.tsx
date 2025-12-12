import { Check, Zap, Shield, BarChart3, Headphones, Clock, ArrowRight, Star, Lock, Sparkles } from 'lucide-react';
import metaLogo from '@/assets/meta-logo.png';
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
      {/* Main card with subtle border */}
      <div className="relative border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative bg-card rounded-2xl overflow-hidden">
          
          {/* Popular badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
              <Sparkles className="h-3 w-3 mr-1" />
              Beliebt
            </Badge>
          </div>
          
          <div className="relative p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              
              {/* Left Column - Pricing Hero */}
              <div className="flex flex-col justify-center order-2 lg:order-1">
                <div className="space-y-4">
                  {/* Logo and Badge */}
                  <div className="flex items-center gap-3">
                    <img src={metaLogo} alt="Meta Logo" className="h-8 w-auto" />
                    <Badge className="gradient-bg text-primary-foreground border-0 text-sm px-3 py-1">
                      Premium • 30 Tage
                    </Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                      META Agency Account
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Dein Schlüssel zu professionellem Advertising
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl lg:text-6xl font-bold gradient-text">150€</span>
                    <span className="text-lg text-muted-foreground">/ 30 Tage</span>
                  </div>

                  {/* Features list */}
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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
                    size="lg"
                    variant="hero"
                    className="w-full group"
                    onClick={onRentClick}
                  >
                    Jetzt mieten
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>

                  {/* Trust badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Sichere & verschlüsselte Zahlung</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Benefits */}
              <div className="order-1 lg:order-2 lg:border-l lg:border-border/50 lg:pl-10">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-1 gradient-bg rounded-full" />
                  Deine Vorteile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {benefits.map((benefit, i) => (
                    <div 
                      key={i} 
                      className="group flex items-start gap-3 p-3 rounded-xl bg-background/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 group-hover:gradient-bg flex items-center justify-center transition-all duration-300">
                        <benefit.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-foreground block">{benefit.text}</span>
                        <span className="text-xs text-muted-foreground">{benefit.description}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional trust points */}
                <div className="flex flex-wrap gap-2">
                  {trustPoints.map((point, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs bg-secondary/50 text-secondary-foreground px-2.5 py-1 rounded-full">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Proof Footer */}
            <div className="mt-5 pt-4 border-t border-border/50">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
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
