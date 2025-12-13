import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Eye, Clock, Ban, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Account, AccountStatus } from '@/hooks/useAccounts';
import { AccountExtendModal } from './AccountExtendModal';
import { AccountSuspendModal } from './AccountSuspendModal';
import { AccountRefundModal } from './AccountRefundModal';

interface AccountsTableProps {
  accounts: Account[] | undefined;
  isLoading: boolean;
}

const statusConfig: Record<AccountStatus, { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }> = {
  active: { label: 'Aktiv', variant: 'default' },
  expired: { label: 'Abgelaufen', variant: 'destructive' },
  canceled: { label: 'Gekündigt', variant: 'secondary' },
  suspended: { label: 'Gesperrt', variant: 'outline' },
};

export function AccountsTable({ accounts, isLoading }: AccountsTableProps) {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'dd.MM.yyyy', { locale: de });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const isExpired = (expireAt: string | null) => {
    if (!expireAt) return false;
    return new Date(expireAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nutzer</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Zeitraum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!accounts?.length) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">Keine Accounts gefunden.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nutzer</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Zeitraum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => {
              const status = statusConfig[account.account_status];
              const expired = isExpired(account.expire_at);

              return (
                <TableRow key={account.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/accounts/${account.id}`)}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{account.user_email || '-'}</p>
                      {account.user_company && (
                        <p className="text-sm text-muted-foreground">{account.user_company}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{account.id.slice(0, 8)}...</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{formatDate(account.start_date)} - {formatDate(account.expire_at)}</p>
                      {expired && account.account_status === 'active' && (
                        <p className="text-xs text-destructive">Überfällig</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/accounts/${account.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Details anzeigen
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setSelectedAccount(account); setExtendModalOpen(true); }}>
                          <Clock className="mr-2 h-4 w-4" />
                          Verlängern
                        </DropdownMenuItem>
                        {account.account_status !== 'suspended' ? (
                          <DropdownMenuItem onClick={() => { setSelectedAccount(account); setSuspendModalOpen(true); }}>
                            <Ban className="mr-2 h-4 w-4" />
                            Sperren
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => { setSelectedAccount(account); }}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reaktivieren
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => { setSelectedAccount(account); setRefundModalOpen(true); }}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refund
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedAccount && (
        <>
          <AccountExtendModal
            open={extendModalOpen}
            onOpenChange={setExtendModalOpen}
            account={selectedAccount}
          />
          <AccountSuspendModal
            open={suspendModalOpen}
            onOpenChange={setSuspendModalOpen}
            account={selectedAccount}
          />
          <AccountRefundModal
            open={refundModalOpen}
            onOpenChange={setRefundModalOpen}
            account={selectedAccount}
          />
        </>
      )}
    </>
  );
}
