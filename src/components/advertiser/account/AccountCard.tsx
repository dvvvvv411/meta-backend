import { Building2, Calendar, AlertTriangle, Download } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AutoRenewToggle } from './AutoRenewToggle';
import { downloadInvoice, InvoiceData } from '@/lib/invoice-generator';
import { cn } from '@/lib/utils';
import type { AdvertiserAccount } from '@/hooks/useAdvertiserAccounts';

interface AccountCardProps {
  account: AdvertiserAccount;
  onToggleAutoRenew: (accountId: string, autoRenew: boolean) => void;
  isToggling?: boolean;
  customerName: string;
  customerEmail: string;
  companyName?: string;
}

export function AccountCard({ 
  account, 
  onToggleAutoRenew, 
  isToggling,
  customerName,
  customerEmail,
  companyName,
}: AccountCardProps) {
  const expireDate = account.expire_at ? new Date(account.expire_at) : null;
  const startDate = account.start_date ? new Date(account.start_date) : null;
  const daysRemaining = expireDate ? differenceInDays(expireDate, new Date()) : 0;
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  const getStatusBadge = () => {
    if (account.account_status === 'active' && !isExpired) {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Aktiv</Badge>;
    }
    if (isExpiringSoon) {
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Bald fällig</Badge>;
    }
    if (isExpired || account.account_status === 'expired') {
      return <Badge variant="destructive">Abgelaufen</Badge>;
    }
    return <Badge variant="secondary">{account.account_status}</Badge>;
  };

  const handleDownloadInvoice = () => {
    if (!account.invoice_number || !startDate || !expireDate) return;

    const invoiceData: InvoiceData = {
      invoiceNumber: account.invoice_number,
      date: startDate,
      customerName,
      customerEmail,
      companyName,
      product: 'Agency Account - 30 Tage',
      amount: account.price_paid ?? 150,
      currency: 'EUR',
      paymentMethod: 'Krypto (USDT)',
      validFrom: startDate,
      validUntil: expireDate,
    };
    downloadInvoice(invoiceData);
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <Card className={cn(
      "transition-all",
      isExpiringSoon && "border-amber-500/50",
      isExpired && "border-destructive/50 opacity-75"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{account.name}</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isExpiringSoon && (
          <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-500/10 p-2 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            <span>Account läuft in {daysRemaining} Tagen ab!</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Verbleibend</p>
            <p className="font-medium">{Math.max(0, daysRemaining)} Tage</p>
          </div>
          <div>
            <p className="text-muted-foreground">Nächste Abrechnung</p>
            <p className="font-medium">
              {expireDate ? format(expireDate, 'dd.MM.yyyy', { locale: de }) : '-'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Balance EUR</p>
            <p className="font-medium">{formatCurrency(account.balance_eur ?? 0)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Balance USDT</p>
            <p className="font-medium">{(account.balance_usdt ?? 0).toFixed(2)} USDT</p>
          </div>
        </div>

        <Separator />

        <AutoRenewToggle
          checked={account.auto_renew ?? true}
          onCheckedChange={(checked) => onToggleAutoRenew(account.id, checked)}
          disabled={isToggling || isExpired}
        />

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleDownloadInvoice}
            disabled={!account.invoice_number}
          >
            <Download className="mr-1 h-3 w-3" />
            Rechnung
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Calendar className="mr-1 h-3 w-3" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
