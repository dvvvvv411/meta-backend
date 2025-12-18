import { CreditCard, Zap, Building2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface BalanceOverviewProps {
  balanceEur: number;
  onDepositClick?: () => void;
}

// Generate unique 4 digits based on user ID
const generateCardDigits = (userId: string | undefined): string => {
  if (!userId) return '0000';
  
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const digits = Math.abs(hash % 10000);
  return digits.toString().padStart(4, '0');
};

export function BalanceOverview({ balanceEur, onDepositClick }: BalanceOverviewProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const cardLastDigits = generateCardDigits(user?.id);

  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      {/* Virtual Credit Card */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 p-6 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative z-10">
          {/* Card Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs font-medium">
                VIRTUAL CARD
              </Badge>
            </div>
            <CreditCard className="h-8 w-8 text-white/80" />
          </div>

          {/* Chip */}
          <div className="mb-6">
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-lg">
              <div className="w-full h-full grid grid-cols-2 gap-px p-1">
                <div className="bg-yellow-500/50 rounded-sm" />
                <div className="bg-yellow-600/50 rounded-sm" />
                <div className="bg-yellow-600/50 rounded-sm" />
                <div className="bg-yellow-500/50 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="mb-4">
            <p className="text-white/60 text-sm mb-1">{t.dashboard.availableBalance}</p>
            <p className="text-4xl font-bold tracking-tight">{formatCurrency(balanceEur)}</p>
          </div>

          {/* Card Number & Logo */}
          <div className="flex items-end justify-between">
            <p className="text-white/50 tracking-[0.25em] font-mono text-sm">
              •••• •••• •••• {cardLastDigits}
            </p>
            {/* Mastercard-style circles */}
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-red-500 opacity-90" />
              <div className="w-7 h-7 rounded-full bg-orange-400 opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Info & CTAs */}
      <CardContent className="pt-5 pb-5 space-y-4">
        {/* Usage Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {language === 'de' ? 'Werbebudget' : 'Ad Budget'}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'de' ? 'Für Kampagnen' : 'For campaigns'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {language === 'de' ? 'Account-Käufe' : 'Account Purchases'}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'de' ? 'Weitere Accounts' : 'More accounts'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 gradient-bg text-primary-foreground hover:opacity-90"
            onClick={onDepositClick}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.deposit.depositFunds}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            asChild
          >
            <Link to="/advertiser/rent-account">
              <Building2 className="h-4 w-4 mr-2" />
              {t.rentAccount.pageTitle}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
