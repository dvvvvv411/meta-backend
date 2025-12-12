import { Wallet, Bitcoin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BalanceOverviewProps {
  balanceEur: number;
  balanceUsdt: number;
}

export function BalanceOverview({ balanceEur, balanceUsdt }: BalanceOverviewProps) {
  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
    }
    return `${amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} USDT`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Aktuelles EUR Guthaben
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(balanceEur, 'EUR')}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Aktuelles USDT Guthaben
          </CardTitle>
          <Bitcoin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(balanceUsdt, 'USDT')}</div>
        </CardContent>
      </Card>
    </div>
  );
}
