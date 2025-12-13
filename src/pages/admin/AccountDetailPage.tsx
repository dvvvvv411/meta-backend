import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArrowLeft, Clock, Ban, RefreshCw, UserCheck, CreditCard, Info } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionsTable } from '@/components/admin/accounts/TransactionsTable';
import { AccountAuditLog } from '@/components/admin/accounts/AccountAuditLog';
import { AccountExtendModal } from '@/components/admin/accounts/AccountExtendModal';
import { AccountSuspendModal } from '@/components/admin/accounts/AccountSuspendModal';
import { AccountRefundModal } from '@/components/admin/accounts/AccountRefundModal';
import { useAccount, useReactivateAccount, AccountStatus } from '@/hooks/useAccounts';
import { supabase } from '@/integrations/supabase/client';

const statusConfig: Record<AccountStatus, { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }> = {
  active: { label: 'Aktiv', variant: 'default' },
  expired: { label: 'Abgelaufen', variant: 'destructive' },
  canceled: { label: 'Gekündigt', variant: 'secondary' },
  suspended: { label: 'Gesperrt', variant: 'outline' },
};

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: account, isLoading } = useAccount(id || '');
  const reactivateMutation = useReactivateAccount();

  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  // Fetch central user balance
  const { data: userBalance } = useQuery({
    queryKey: ['user-balance', account?.user_id],
    queryFn: async () => {
      if (!account?.user_id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('balance_eur')
        .eq('id', account.user_id)
        .maybeSingle();
      if (error) throw error;
      return data?.balance_eur ?? 0;
    },
    enabled: !!account?.user_id,
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const handleReactivate = () => {
    if (account) {
      reactivateMutation.mutate({ accountId: account.id });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Account nicht gefunden.</p>
          <Button variant="outline" onClick={() => navigate('/admin/accounts')}>
            Zurück zur Übersicht
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const status = statusConfig[account.account_status];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/accounts')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6" />
                <h1 className="text-2xl font-bold">{account.name}</h1>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {account.user_email || 'Kein Nutzer zugewiesen'}
                {account.user_company && ` • ${account.user_company}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setExtendModalOpen(true)}>
              <Clock className="mr-2 h-4 w-4" />
              Verlängern
            </Button>
            {account.account_status !== 'suspended' ? (
              <Button variant="outline" size="sm" onClick={() => setSuspendModalOpen(true)}>
                <Ban className="mr-2 h-4 w-4" />
                Sperren
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReactivate}
                disabled={reactivateMutation.isPending}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Reaktivieren
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setRefundModalOpen(true)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refund
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account-Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plattform</p>
                  <p className="font-medium">{account.platform}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monatl. Budget</p>
                  <p className="font-medium">{formatCurrency(account.monthly_budget || 0, 'EUR')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Startdatum</p>
                  <p className="font-medium">
                    {account.start_date 
                      ? format(new Date(account.start_date), 'dd.MM.yyyy', { locale: de })
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ablaufdatum</p>
                  <p className="font-medium">
                    {account.expire_at 
                      ? format(new Date(account.expire_at), 'dd.MM.yyyy', { locale: de })
                      : '-'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account-ID</p>
                <p className="font-mono text-sm">{account.id}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nutzer-Guthaben (Zentral)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-2">EUR Guthaben</p>
                <p className="text-3xl font-bold">{formatCurrency(userBalance ?? 0, 'EUR')}</p>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Alle Accounts dieses Nutzers teilen dieses Guthaben.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions & Audit Log */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TransactionsTable accountId={account.id} accountName={account.name} />
          <AccountAuditLog accountId={account.id} />
        </div>

        {/* Modals */}
        <AccountExtendModal
          open={extendModalOpen}
          onOpenChange={setExtendModalOpen}
          account={account}
        />
        <AccountSuspendModal
          open={suspendModalOpen}
          onOpenChange={setSuspendModalOpen}
          account={account}
        />
        <AccountRefundModal
          open={refundModalOpen}
          onOpenChange={setRefundModalOpen}
          account={account}
        />
      </div>
    </DashboardLayout>
  );
}
