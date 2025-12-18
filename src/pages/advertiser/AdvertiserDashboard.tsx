import { ArrowRight, Building2, Wallet, TrendingUp, HelpCircle, Calendar, FileEdit, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAdvertiserAccounts } from '@/hooks/useAdvertiserAccounts';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBalance } from '@/hooks/useUserBalance';
import { useCampaignDrafts } from '@/hooks/useCampaignDrafts';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdvertiserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { activeAccounts, hasActiveAccount, isLoading: isAccountsLoading } = useAdvertiserAccounts();
  const { balanceEur, isLoading: isBalanceLoading } = useUserBalance();
  const { drafts, isLoading: isDraftsLoading } = useCampaignDrafts();
  const companyName = user?.user_metadata?.company_name as string | undefined;

  const dateLocale = language === 'de' ? de : enUS;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const isLoading = isAccountsLoading || isBalanceLoading;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t.dashboard.welcomeBack}, {companyName || t.dashboard.advertiser}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {t.dashboard.overviewSubtitle}
        </p>
      </div>

      {/* Balance Hero Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent" />
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">{t.dashboard.balanceTitle}</CardTitle>
          </div>
          <Button size="sm" onClick={() => navigate('/advertiser/deposit')}>
            <Plus className="h-4 w-4 mr-1" />
            {t.common.deposit}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground">
            {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : formatCurrency(balanceEur)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t.dashboard.availableBalance}
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
                {t.dashboard.agencyAccounts}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? '...' : activeAccounts.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {hasActiveAccount ? t.dashboard.activeAccounts : t.dashboard.noAccountRented}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate('/advertiser/rent-account')}
            >
              {t.dashboard.rentAccount}
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
                {t.dashboard.campaignsTitle}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {hasActiveAccount ? '0' : '-'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {t.dashboard.activeCampaigns}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate('/advertiser/campaigns')}
              disabled={!hasActiveAccount}
            >
              {t.dashboard.createCampaign}
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
              {t.dashboard.yourAgencyAccounts}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/advertiser/rent-account')}>
              {t.dashboard.viewAll}
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
                        {t.common.active}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t.dashboard.remaining}</p>
                        <p className="font-medium">{Math.max(0, daysRemaining)} {t.common.days}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.dashboard.expiresOn}</p>
                        <p className="font-medium">
                          {expireDate ? format(expireDate, 'dd.MM.yyyy', { locale: dateLocale }) : '-'}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{t.dashboard.autoRenewal}</span>
                      </div>
                      <Badge variant={account.auto_renew ? 'default' : 'secondary'}>
                        {account.auto_renew ? t.dashboard.on : t.dashboard.off}
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
            {t.dashboard.campaignDrafts}
          </h2>
          {drafts.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/advertiser/campaigns')}>
              {t.dashboard.viewAll}
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
              <p className="text-muted-foreground">{t.dashboard.noDrafts}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t.dashboard.noDraftsSubtitle}
              </p>
              {hasActiveAccount && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => navigate('/advertiser/campaigns')}
                >
                  {t.dashboard.createCampaign}
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
                    <p className="font-medium truncate">{draft.name || t.dashboard.unnamedDraft}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.dashboard.lastEdited} {formatDistanceToNow(new Date(draft.updated_at), { addSuffix: true, locale: dateLocale })}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/advertiser/campaigns/edit/new?draftId=${draft.id}`)}
                  >
                    {t.common.continue}
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
              {t.dashboard.startWithAgencyAccount}
            </CardTitle>
            <CardDescription>
              {t.dashboard.startWithAgencyAccountDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/advertiser/rent-account')}>
              {t.dashboard.rentAgencyAccount}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Schnellaktionen */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t.dashboard.quickActions}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Guthaben einzahlen */}
          <Card className="relative overflow-hidden hover:border-blue-300 transition-colors">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-cyan-400" />
            <CardContent className="p-6 pl-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{t.dashboard.depositFunds}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t.dashboard.depositFundsDesc}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                onClick={() => navigate('/advertiser/deposit')}
              >
                {t.common.deposit}
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
              <h3 className="text-lg font-semibold text-foreground mb-1">{t.dashboard.rentAccountTitle}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t.dashboard.rentAccountDesc}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                onClick={() => navigate('/advertiser/rent-account')}
              >
                {t.dashboard.rentAccount}
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
              <h3 className="text-lg font-semibold text-foreground mb-1">{t.dashboard.contactSupport}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t.dashboard.contactSupportDesc}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-violet-600 border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300"
                onClick={() => navigate('/advertiser/support')}
              >
                {t.dashboard.openSupport}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
