import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CheckCircle2, Clock, XCircle, Receipt, Download, Eye, ChevronDown } from 'lucide-react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { Deposit } from '@/hooks/useDeposits';
import { generateCSV, downloadCSV, formatDateForCSV } from '@/lib/csv-export';
import { TransactionDetailModal } from './TransactionDetailModal';

interface TransactionHistoryProps {
  deposits: Deposit[];
}

export function TransactionHistory({ deposits }: TransactionHistoryProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Deposit | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const openDetails = (deposit: Deposit) => {
    setSelectedTransaction(deposit);
    setDetailModalOpen(true);
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getStatusBadge = (status: string, expiresAt: string | null) => {
    // Check if expired (pending + expires_at in past)
    if (status === 'pending' && expiresAt && new Date(expiresAt) < new Date()) {
      return (
        <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
          <XCircle className="h-3 w-3 mr-1" />
          Abgelaufen
        </Badge>
      );
    }

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
    switch (type) {
      case 'deposit':
        return <Badge variant="outline" className="text-green-600 border-green-200">Einzahlung</Badge>;
      case 'rental':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Account Miete</Badge>;
      case 'withdrawal':
        return <Badge variant="outline" className="text-orange-600 border-orange-200">Auszahlung</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleExportCSV = () => {
    const columns = [
      { header: 'Datum', accessor: (d: Deposit) => formatDateForCSV(d.created_at) },
      { header: 'Typ', accessor: (d: Deposit) => {
        switch (d.type) {
          case 'deposit': return 'Einzahlung';
          case 'rental': return 'Account Miete';
          case 'withdrawal': return 'Auszahlung';
          default: return d.type;
        }
      }},
      { header: 'Betrag', accessor: (d: Deposit) => formatCurrency(d.amount) },
      { header: 'Status', accessor: (d: Deposit) => {
        if (d.status === 'pending' && d.expires_at && new Date(d.expires_at) < new Date()) {
          return 'Abgelaufen';
        }
        return d.status === 'completed' ? 'Bestätigt' : d.status === 'pending' ? 'Ausstehend' : 'Fehlgeschlagen';
      }},
      { header: 'Beschreibung', accessor: (d: Deposit) => d.description || '-' },
    ];

    const csvContent = generateCSV(deposits, columns);
    downloadCSV(csvContent, `transaktionen-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  // Mobile Card Component
  const TransactionCard = ({ deposit }: { deposit: Deposit }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border rounded-xl p-4 bg-card">
          <CollapsibleTrigger className="w-full text-left">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Date + Type */}
              <div className="flex flex-col items-start gap-1.5 min-w-0">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(deposit.created_at), 'dd.MM.yyyy', { locale: de })}
                </span>
                {getTypeBadge(deposit.type)}
              </div>
              
              {/* Right: Amount + Status + Chevron */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="font-mono font-semibold text-base">
                    {formatCurrency(deposit.amount)}
                  </div>
                  <div className="mt-1">
                    {getStatusBadge(deposit.status || 'pending', deposit.expires_at)}
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="pt-4 mt-4 border-t space-y-3">
              {/* Description */}
              {deposit.description && (
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm text-muted-foreground">Beschreibung</span>
                  <span className="text-sm text-right">{deposit.description}</span>
                </div>
              )}
              
              {/* Details Button if pay_address exists */}
              {deposit.pay_address && (
                <Button 
                  variant="outline" 
                  className="w-full h-10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetails(deposit);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Zahlungsdetails anzeigen
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
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
          <>
            {/* Mobile: Collapsible Cards */}
            <div className="md:hidden space-y-3">
              {deposits.map((deposit) => (
                <TransactionCard key={deposit.id} deposit={deposit} />
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead className="text-right">Betrag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Beschreibung</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
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
                        {getStatusBadge(deposit.status || 'pending', deposit.expires_at)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {deposit.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {deposit.pay_address && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetails(deposit)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>

      <TransactionDetailModal
        transaction={selectedTransaction}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </Card>
  );
}
