import { useState } from 'react';
import { Check, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAdvertiserAccount } from '@/hooks/useAdvertiserAccount';
import { useToast } from '@/hooks/use-toast';

interface PlanOption {
  id: string;
  name: string;
  platform: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

const plans: PlanOption[] = [
  {
    id: 'meta-basic',
    name: 'Meta Basic',
    platform: 'Meta',
    price: 299,
    period: 'Monat',
    features: [
      'Bis zu 5.000€ Ad Spend',
      'Facebook & Instagram Ads',
      'Standard Support',
      '1 Werbekonto',
    ],
  },
  {
    id: 'meta-pro',
    name: 'Meta Pro',
    platform: 'Meta',
    price: 499,
    period: 'Monat',
    features: [
      'Bis zu 25.000€ Ad Spend',
      'Facebook & Instagram Ads',
      'Priority Support',
      '3 Werbekonten',
      'Erweiterte Analysen',
    ],
    popular: true,
  },
  {
    id: 'google-basic',
    name: 'Google Basic',
    platform: 'Google',
    price: 349,
    period: 'Monat',
    features: [
      'Bis zu 10.000€ Ad Spend',
      'Google Ads & YouTube',
      'Standard Support',
      '1 Werbekonto',
    ],
  },
];

export default function RentAccountPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { hasActiveAccount, isLoading } = useAdvertiserAccount();
  const { toast } = useToast();

  const handleRentAccount = () => {
    if (!selectedPlan) {
      toast({
        title: 'Bitte wähle einen Plan',
        description: 'Wähle einen Plan aus um fortzufahren.',
        variant: 'destructive',
      });
      return;
    }

    // Placeholder - would integrate with payment/rental flow
    toast({
      title: 'Anfrage gesendet',
      description: 'Wir werden dich in Kürze kontaktieren um die Miete abzuschließen.',
    });
  };

  if (hasActiveAccount) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agency Account mieten</h1>
          <p className="text-muted-foreground mt-1">
            Wähle einen Plan der zu deinen Bedürfnissen passt.
          </p>
        </div>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              Du hast bereits einen aktiven Account
            </CardTitle>
            <CardDescription>
              Dein Agency Account ist aktiv. Du kannst Kampagnen erstellen und Werbung schalten.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agency Account mieten</h1>
        <p className="text-muted-foreground mt-1">
          Wähle einen Plan der zu deinen Bedürfnissen passt.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={cn(
              "relative cursor-pointer transition-all hover:border-primary/50",
              selectedPlan === plan.id && "border-primary ring-2 ring-primary/20",
              plan.popular && "border-primary/30"
            )}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                Beliebt
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-primary" />
                <Badge variant="secondary">{plan.platform}</Badge>
              </div>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">{plan.price}€</span>
                <span className="text-muted-foreground"> / {plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={selectedPlan === plan.id ? "default" : "outline"}
              >
                {selectedPlan === plan.id ? 'Ausgewählt' : 'Auswählen'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Ausgewählt: {plans.find(p => p.id === selectedPlan)?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {plans.find(p => p.id === selectedPlan)?.price}€ / {plans.find(p => p.id === selectedPlan)?.period}
                </p>
              </div>
              <Button size="lg" onClick={handleRentAccount}>
                Jetzt mieten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
