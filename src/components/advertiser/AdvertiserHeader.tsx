import { User, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useAdvertiserAccount } from '@/hooks/useAdvertiserAccount';

export const AdvertiserHeader = () => {
  const { user } = useAuth();
  const { hasActiveAccount, balanceEur, balanceUsdt, isLoading } = useAdvertiserAccount();

  const companyName = user?.user_metadata?.company_name as string | undefined;

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
    }
    return `${amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} USDT`;
  };

  return (
    <header className="sticky top-0 z-10 h-16 bg-background/95 backdrop-blur border-b border-border px-6 flex items-center justify-between gap-4">
      {/* User Card */}
      <Card className="flex items-center gap-3 px-4 py-2 bg-card/50">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-foreground leading-tight">
            {companyName || user?.email?.split('@')[0] || 'Benutzer'}
          </p>
          <p className="text-xs text-muted-foreground leading-tight">
            {user?.email}
          </p>
        </div>
        {isLoading ? (
          <Skeleton className="h-5 w-16 ml-2" />
        ) : (
          <Badge 
            variant={hasActiveAccount ? "default" : "secondary"}
            className="ml-2"
          >
            {hasActiveAccount ? 'Aktiv' : 'Kein Account'}
          </Badge>
        )}
      </Card>

      {/* Quick Balance */}
      <div className="flex items-center gap-3">
        <Card className="flex items-center gap-2 px-4 py-2 bg-card/50">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground leading-none mb-0.5">EUR</p>
                <p className="text-sm font-semibold text-foreground leading-none">
                  {formatCurrency(balanceEur, 'EUR')}
                </p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-right">
                <p className="text-xs text-muted-foreground leading-none mb-0.5">USDT</p>
                <p className="text-sm font-semibold text-foreground leading-none">
                  {formatCurrency(balanceUsdt, 'USDT')}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </header>
  );
};
