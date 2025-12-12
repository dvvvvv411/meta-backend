import { Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BalanceOverviewProps {
  balanceEur: number;
}

export function BalanceOverview({ balanceEur }: BalanceOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-1 gradient-bg" />
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
            <Wallet className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Aktuelles Guthaben</p>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(balanceEur)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
