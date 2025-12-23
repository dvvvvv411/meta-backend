import { Check, Zap, Shield, BarChart3, Headphones, Clock, ArrowRight, Star, Lock, Sparkles } from 'lucide-react';

const DEFAULT_LOGO_URL = 'https://tpkecrwoyfxcynezbyel.supabase.co/storage/v1/object/public/branding-logos/fec753ad-b83c-4bf6-b1e8-3879fccd5018.png';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { RENTAL_PRICE_USD } from '@/lib/crypto-config';

interface ProductDetailProps {
  onRentClick: () => void;
}

export function ProductDetail({ onRentClick }: ProductDetailProps) {
  const { t, language } = useLanguage();

  const benefits = [
    { icon: Zap, text: language === 'de' ? 'Keine Limits' : 'No Limits' },
    { icon: BarChart3, text: language === 'de' ? 'Skalierbar' : 'Scalable' },
    { icon: Shield, text: 'Meta Trust' },
    { icon: Clock, text: language === 'de' ? 'Sofort aktiv' : 'Instant activation' },
    { icon: Headphones, text: '24/7 Support' },
    { icon: Check, text: language === 'de' ? 'Transparent' : 'Transparent' },
  ];

  const trustPoints = [
    language === 'de' ? '30 Tage Laufzeit' : '30 days duration',
    language === 'de' ? 'Sofort einsatzbereit' : 'Ready to use immediately', 
    language === 'de' ? 'Sichere Crypto-Zahlung' : 'Secure crypto payment',
  ];

  return (
    <div className="relative">
      {/* Main card with subtle border */}
      <div className="relative border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative bg-card rounded-2xl overflow-hidden">
          
          {/* Popular badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
              <Sparkles className="h-3 w-3 mr-1" />
              {language === 'de' ? 'Beliebt' : 'Popular'}
            </Badge>
          </div>
          
          <div className="relative p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              
              {/* Left Column - Pricing Hero */}
              <div className="flex flex-col justify-center order-2 lg:order-1">
                <div className="space-y-4 text-center">
                  {/* Logo and Badge */}
                  <div className="flex items-center justify-center gap-3">
                    <img src={DEFAULT_LOGO_URL} alt="MetaNetwork Agency" className="h-8 w-auto" />
                    <Badge className="gradient-bg text-primary-foreground border-0 text-sm px-3 py-1">
                      Premium • 30 {language === 'de' ? 'Tage' : 'Days'}
                    </Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                      Agency Account
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' 
                        ? 'Dein Schlüssel zu professionellem Advertising' 
                        : 'Your key to professional advertising'}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl lg:text-6xl font-bold gradient-text">${RENTAL_PRICE_USD}</span>
                    <span className="text-lg text-muted-foreground">/ 30 {language === 'de' ? 'Tage' : 'Days'}</span>
                  </div>

                  {/* Features list */}
                  <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{language === 'de' ? 'Automatische Verlängerung' : 'Auto-renewal'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{language === 'de' ? 'Jederzeit kündbar' : 'Cancel anytime'}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    size="lg"
                    variant="hero"
                    className="w-full group"
                    onClick={onRentClick}
                  >
                    {t.rentAccount.rentNow}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>

                  {/* Trust badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    <span>{language === 'de' ? 'Sichere & verschlüsselte Zahlung' : 'Secure & encrypted payment'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Benefits Flowchart */}
              <div className="order-1 lg:order-2 lg:border-l lg:border-border/50 lg:pl-10">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-1 gradient-bg rounded-full" />
                  {language === 'de' ? 'Deine Vorteile' : 'Your Benefits'}
                </h3>

                {/* Flowchart Grid */}
                <div className="relative p-4 rounded-xl border border-border/50 bg-background/30 mb-5">
                  {/* Obere Reihe (3 Items) */}
                  <div className="grid grid-cols-3 gap-2 relative">
                    {benefits.slice(0, 3).map((benefit, i) => (
                      <div key={i} className="group relative flex flex-col items-center text-center p-3">
                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110">
                          <benefit.icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xs font-medium text-foreground">{benefit.text}</span>
                        
                        {/* Horizontale Verbindungslinie (nicht beim letzten) */}
                        {i < 2 && (
                          <div className="absolute right-0 top-5 w-[calc(50%-20px)] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-primary/30" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Vertikale Verbindungslinien */}
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex justify-center">
                        <div className="w-0.5 h-4 bg-gradient-to-b from-primary/30 to-primary/20" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Untere Reihe (3 Items) */}
                  <div className="grid grid-cols-3 gap-2 relative">
                    {benefits.slice(3, 6).map((benefit, i) => (
                      <div key={i} className="group relative flex flex-col items-center text-center p-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:gradient-bg flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110">
                          <benefit.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                        </div>
                        <span className="text-xs font-medium text-foreground">{benefit.text}</span>
                        
                        {/* Horizontale Verbindungslinie (nicht beim letzten) */}
                        {i < 2 && (
                          <div className="absolute right-0 top-5 w-[calc(50%-20px)] h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-primary/20" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional trust points */}
                <div className="hidden lg:flex flex-wrap gap-2">
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
                  <span className="font-semibold text-foreground">3,500+</span> {t.rentAccount.socialProof.split('3.500+')[1] || (language === 'de' ? 'zufriedene Werbetreibende vertrauen uns' : 'satisfied advertisers trust us')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
