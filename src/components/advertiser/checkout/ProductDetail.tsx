import { Check, Building2, Zap, Shield, BarChart3, Headphones, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const benefits = [
  { icon: Zap, text: 'Unbegrenzte Kampagnen' },
  { icon: BarChart3, text: 'Skalierbare Limits' },
  { icon: Shield, text: 'Meta Agency Trust' },
  { icon: Clock, text: 'Sofortiger Dashboard-Zugriff' },
  { icon: Headphones, text: 'Premium Support' },
  { icon: Check, text: 'Keine versteckten Kosten' },
];

interface ProductDetailProps {
  onRentClick: () => void;
}

export function ProductDetail({ onRentClick }: ProductDetailProps) {
  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <CardContent className="pt-8 pb-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column - Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Deine Vorteile
            </h3>
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Right Column - Pricing & CTA */}
          <div className="flex flex-col justify-center md:border-l md:border-border/50 md:pl-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <Badge variant="secondary" className="text-sm">Premium — 30 Tage</Badge>
            </div>
            
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Agency Account
            </h2>
            
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-bold text-foreground">150€</span>
              <span className="text-muted-foreground text-lg">/ 30 Tage</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-8">
              Automatische Verlängerung • Jederzeit kündbar
            </p>

            <Button 
              size="lg" 
              className="w-full text-lg h-14"
              onClick={onRentClick}
            >
              Jetzt mieten
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
