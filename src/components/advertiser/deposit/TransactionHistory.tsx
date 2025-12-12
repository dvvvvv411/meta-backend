import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TransactionFilters } from './TransactionFilters';
import type { Deposit } from '@/hooks/useDeposits';
import { generateCSV, downloadCSV, formatDateForCSV } from '@/lib/csv-export';

interface TransactionHistoryProps {
  deposits: Deposit[];
}

export function TransactionHistory({ deposits }: TransactionHistoryProps) {
  const [coinFilter, setCoinFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDeposits = deposits.filter((deposit) => {
    if (coinFilter !== 'all' && deposit.coin_type !== coinFilter) return false;
    if (statusFilter !== 'all' && deposit.status !== statusFilter) return false;
    return true;
  });

  const formatCoinAmount = (amount: number | null, coin: string) => {
    if (amount === null) return '-';
    if (coin === 'BTC') return amount.toFixed(6);
    if (coin === 'ETH') return amount.toFixed(5);
    return amount.toFixed(2);
  };

  const getStatusBadge = (status: string, confirmations: number, required: number) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Bestätigt
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            {confirmations}/{required} Conf.
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="h-3 w-3 mr-1" />
            Fehlgeschlagen
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExportCSV = () => {
    const columns = [
      { header: 'Datum', accessor: (d: Deposit) => formatDateForCSV(d.created_at) },
      { header: 'Coin', accessor: (d: Deposit) => d.coin_type },
      { header: 'Netzwerk', accessor: (d: Deposit) => d.network || '-' },
      { header: 'Bruttobetrag', accessor: (d: Deposit) => d.gross_amount ? formatCoinAmount(d.gross_amount, d.coin_type) : '-' },
      { header: 'Gebühr (2%)', accessor: (d: Deposit) => d.fee_amount ? formatCoinAmount(d.fee_amount, d.coin_type) : '-' },
      { header: 'Nettobetrag', accessor: (d: Deposit) => d.amount.toFixed(2) + '€' },
      { header: 'Status', accessor: (d: Deposit) => d.status === 'completed' ? 'Bestätigt' : d.status === 'pending' ? 'Ausstehend' : 'Fehlgeschlagen' },
      { header: 'TX Hash', accessor: (d: Deposit) => d.tx_hash || '-' },
    ];

    const csvContent = generateCSV(filteredDeposits, columns);
    downloadCSV(csvContent, `einzahlungen-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Einzahlungshistorie</CardTitle>
            <CardDescription>Alle deine Krypto-Einzahlungen</CardDescription>
          </div>
          <TransactionFilters
            coinFilter={coinFilter}
            statusFilter={statusFilter}
            onCoinFilterChange={setCoinFilter}
            onStatusFilterChange={setStatusFilter}
            onExportCSV={handleExportCSV}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredDeposits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Keine Einzahlungen gefunden
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Coin</TableHead>
                  <TableHead className="text-right">Brutto</TableHead>
                  <TableHead className="text-right">Gebühr</TableHead>
                  <TableHead className="text-right">Netto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(deposit.created_at), 'dd.MM.yyyy', { locale: de })}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{deposit.coin_type}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCoinAmount(deposit.gross_amount, deposit.coin_type)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatCoinAmount(deposit.fee_amount, deposit.coin_type)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {deposit.amount.toFixed(2)}€
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(deposit.status || 'pending', deposit.confirmations, deposit.confirmations_required)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
