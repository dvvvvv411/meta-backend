import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Download, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Transaction, useAccountTransactions } from '@/hooks/useAccounts';
import { useExportTransactionsCSV } from '@/hooks/useExportCSV';

interface TransactionsTableProps {
  accountId: string;
  accountName?: string;
}

const typeConfig: Record<string, { icon: typeof ArrowUpRight; label: string; color: string }> = {
  deposit: { icon: ArrowDownRight, label: 'Einzahlung', color: 'text-green-500' },
  withdraw: { icon: ArrowUpRight, label: 'Auszahlung', color: 'text-red-500' },
  refund: { icon: RefreshCw, label: 'Refund', color: 'text-amber-500' },
};

export function TransactionsTable({ accountId, accountName }: TransactionsTableProps) {
  const { data: transactions, isLoading } = useAccountTransactions(accountId);
  const { exportTransactions } = useExportTransactionsCSV();

  const formatAmount = (amount: number, currency: string) => {
    const prefix = amount >= 0 ? '+' : '';
    return prefix + new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency === 'USDT' ? 'USD' : currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Transaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Transaktionen</CardTitle>
        {transactions && transactions.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportTransactions(transactions, accountName)}
          >
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Betrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Beschreibung</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const config = typeConfig[tx.type] || { icon: ArrowUpRight, label: tx.type, color: 'text-muted-foreground' };
                  const Icon = config.icon;
                  const isPositive = tx.amount >= 0;

                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm">
                        {format(new Date(tx.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${config.color}`} />
                          <span>{config.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {formatAmount(tx.amount, tx.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                          {tx.status === 'completed' ? 'Fertig' : tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {tx.description || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Keine Transaktionen vorhanden.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
