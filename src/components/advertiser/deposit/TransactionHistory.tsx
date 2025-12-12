import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CheckCircle2, Clock, XCircle, Receipt, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Deposit } from '@/hooks/useDeposits';
import { generateCSV, downloadCSV, formatDateForCSV } from '@/lib/csv-export';

interface TransactionHistoryProps {
  deposits: Deposit[];
}

export function TransactionHistory({ deposits }: TransactionHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getStatusBadge = (status: string) => {
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
            Ausstehend
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

  const getTypeBadge = (type: string) => {
    if (type === 'deposit') {
      return <Badge variant="outline" className="text-green-600 border-green-200">Einzahlung</Badge>;
    }
    return <Badge variant="outline" className="text-orange-600 border-orange-200">Auszahlung</Badge>;
  };

  const handleExportCSV = () => {
    const columns = [
      { header: 'Datum', accessor: (d: Deposit) => formatDateForCSV(d.created_at) },
      { header: 'Typ', accessor: (d: Deposit) => d.type === 'deposit' ? 'Einzahlung' : 'Auszahlung' },
      { header: 'Betrag', accessor: (d: Deposit) => formatCurrency(d.amount) },
      { header: 'Status', accessor: (d: Deposit) => d.status === 'completed' ? 'Bestätigt' : d.status === 'pending' ? 'Ausstehend' : 'Fehlgeschlagen' },
      { header: 'Beschreibung', accessor: (d: Deposit) => d.description || '-' },
    ];

    const csvContent = generateCSV(deposits, columns);
    downloadCSV(csvContent, `transaktionen-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Transaktionshistorie</CardTitle>
            <CardDescription>Alle deine Ein- und Auszahlungen</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            disabled={deposits.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {deposits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">Keine Transaktionen vorhanden</p>
            <p className="text-sm text-muted-foreground mt-1">
              Deine Ein- und Auszahlungen werden hier angezeigt.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead className="text-right">Betrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Beschreibung</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(deposit.created_at), 'dd.MM.yyyy', { locale: de })}
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(deposit.type)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(deposit.amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(deposit.status || 'pending')}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {deposit.description || '-'}
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
