import { ArrowRight, Building2, Wallet, TrendingUp, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdvertiserAccount } from '@/hooks/useAdvertiserAccount';
import { useAuth } from '@/contexts/AuthContext';

export default function AdvertiserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { account, hasActiveAccount, balanceEur, balanceUsdt, isLoading } = useAdvertiserAccount();
  const companyName = user?.user_metadata?.company_name as string | undefined;

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
    }
    return `${amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} USDT`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Willkommen zurück, {companyName || 'Werbetreibender'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Hier ist eine Übersicht deines Accounts.
        </p>
      </div>

      {/* Quick Actions for users without account */}
      {!hasActiveAccount && !isLoading && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Starte jetzt mit deinem Agency Account
            </CardTitle>
            <CardDescription>
              Miete einen Agency Account um Kampagnen zu erstellen und deine Werbung zu schalten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/advertiser/rent-account')}>
              Agency Account mieten
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Account Status
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : hasActiveAccount ? 'Aktiv' : 'Inaktiv'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasActiveAccount && account?.platform ? `Plattform: ${account.platform}` : 'Kein Account gemietet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              EUR Guthaben
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : formatCurrency(balanceEur, 'EUR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Verfügbares Guthaben
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              USDT Guthaben
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : formatCurrency(balanceUsdt, 'USDT')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Verfügbares Guthaben
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kampagnen
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasActiveAccount ? '0' : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Aktive Kampagnen
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/advertiser/deposit')}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Guthaben einzahlen
            </CardTitle>
            <CardDescription>
              Lade dein Konto auf um Werbung zu schalten.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/advertiser/support')}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Support kontaktieren
            </CardTitle>
            <CardDescription>
              Hast du Fragen? Unser Team hilft dir gerne.
            </CardDescription>
          </CardHeader>
        </Card>

        {hasActiveAccount && (
          <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/advertiser/campaigns')}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Kampagne erstellen
              </CardTitle>
              <CardDescription>
                Starte deine erste Werbekampagne.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
