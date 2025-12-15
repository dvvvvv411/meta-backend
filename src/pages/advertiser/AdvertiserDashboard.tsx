import { ArrowRight, Building2, Wallet, TrendingUp, HelpCircle, Calendar, FileEdit, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAdvertiserAccounts } from '@/hooks/useAdvertiserAccounts';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBalance } from '@/hooks/useUserBalance';
import { useCampaignDrafts } from '@/hooks/useCampaignDrafts';

export default function AdvertiserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeAccounts, hasActiveAccount, isLoading: isAccountsLoading } = useAdvertiserAccounts();
  const { balanceEur, isLoading: isBalanceLoading } = useUserBalance();
  const { drafts, isLoading: isDraftsLoading } = useCampaignDrafts();
  const companyName = user?.user_metadata?.company_name as string | undefined;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const isLoading = isAccountsLoading || isBalanceLoading;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Willkommen zurück, {companyName || 'Werbetreibender'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Hier ist deine Übersicht.
        </p>
      </div>

      {/* Balance Hero Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent" />
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Guthaben</CardTitle>
          </div>
          <Button size="sm" onClick={() => navigate('/advertiser/deposit')}>
            <Plus className="h-4 w-4 mr-1" />
            Einzahlen
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground">
            {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : formatCurrency(balanceEur)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Verfügbares Guthaben
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Agency Accounts Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Agency Accounts
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? '...' : activeAccounts.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {hasActiveAccount ? 'aktive Accounts' : 'Kein Account gemietet'}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate('/advertiser/rent-account')}
            >
              Account mieten
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Campaigns Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Kampagnen
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {hasActiveAccount ? '0' : '-'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              aktive Kampagnen
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate('/advertiser/campaigns')}
              disabled={!hasActiveAccount}
            >
              Kampagne erstellen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Accounts Section */}
      {hasActiveAccount && activeAccounts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Deine Agency Accounts
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/advertiser/rent-account')}>
              Alle anzeigen
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {activeAccounts.slice(0, 2).map((account) => {
              const expireDate = account.expire_at ? new Date(account.expire_at) : null;
              const daysRemaining = expireDate ? differenceInDays(expireDate, new Date()) : 0;
              const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

              return (
                <Card key={account.id} className={isExpiringSoon ? 'border-warning/50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        {account.name}
                      </CardTitle>
                      <Badge className="bg-success/10 text-success border-success/20">
                        Aktiv
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Verbleibend</p>
                        <p className="font-medium">{Math.max(0, daysRemaining)} Tage</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Läuft ab am</p>
                        <p className="font-medium">
                          {expireDate ? format(expireDate, 'dd.MM.yyyy', { locale: de }) : '-'}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Auto-Verlängerung</span>
                      </div>
                      <Badge variant={account.auto_renew ? 'default' : 'secondary'}>
                        {account.auto_renew ? 'AN' : 'AUS'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Campaign Drafts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-primary" />
            Kampagnenentwürfe
          </h2>
          {drafts.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/advertiser/campaigns')}>
              Alle anzeigen
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
        
        {isDraftsLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : drafts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileEdit className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Keine Entwürfe vorhanden</p>
              <p className="text-sm text-muted-foreground mt-1">
                Erstelle deine erste Kampagne um loszulegen.
              </p>
              {hasActiveAccount && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => navigate('/advertiser/campaigns')}
                >
                  Kampagne erstellen
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {drafts.slice(0, 3).map((draft) => (
                <div key={draft.id} className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{draft.name || 'Unbenannter Entwurf'}</p>
                    <p className="text-sm text-muted-foreground">
                      Zuletzt bearbeitet: {formatDistanceToNow(new Date(draft.updated_at), { addSuffix: true, locale: de })}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/advertiser/campaigns/edit/new?draftId=${draft.id}`)}
                  >
                    Fortsetzen
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
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

      {/* Schnellaktionen */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Schnellaktionen</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Guthaben einzahlen */}
          <Card className="relative overflow-hidden hover:border-blue-300 transition-colors">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-cyan-400" />
            <CardContent className="p-6 pl-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Guthaben einzahlen</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Lade dein Konto auf um Werbung zu schalten.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                onClick={() => navigate('/advertiser/deposit')}
              >
                Einzahlen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Account mieten */}
          <Card className="relative overflow-hidden hover:border-emerald-300 transition-colors">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500 to-green-400" />
            <CardContent className="p-6 pl-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Account mieten</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Miete einen Agency Account für 150€/Monat.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                onClick={() => navigate('/advertiser/rent-account')}
              >
                Account mieten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Support kontaktieren */}
          <Card className="relative overflow-hidden hover:border-violet-300 transition-colors">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-violet-500 to-purple-400" />
            <CardContent className="p-6 pl-5">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
                <HelpCircle className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Support kontaktieren</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hast du Fragen? Unser Team hilft dir gerne.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-violet-600 border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300"
                onClick={() => navigate('/advertiser/support')}
              >
                Support öffnen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
