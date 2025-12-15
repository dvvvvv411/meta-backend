import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Search, Copy, Check, CheckCircle, XCircle, Loader2, ArrowUpFromLine } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAdminWithdrawals } from '@/hooks/useWithdrawals';
import { Skeleton } from '@/components/ui/skeleton';

type StatusFilter = 'all' | 'pending' | 'completed' | 'failed';

export default function WithdrawalsPage() {
  const { toast } = useToast();
  const { 
    withdrawals, 
    isLoading, 
    approveWithdrawal, 
    declineWithdrawal,
    pendingWithdrawals 
  } = useAdminWithdrawals();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: 'Kopiert!',
      description: 'Wallet-Adresse wurde kopiert.',
    });
  };

  const handleApprove = async (id: string) => {
    try {
      await approveWithdrawal.mutateAsync(id);
      toast({
        title: 'Auszahlung genehmigt',
        description: 'Die Auszahlung wurde erfolgreich genehmigt und der Betrag abgezogen.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error instanceof Error ? error.message : 'Auszahlung konnte nicht genehmigt werden',
        variant: 'destructive',
      });
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineWithdrawal.mutateAsync(id);
      toast({
        title: 'Auszahlung abgelehnt',
        description: 'Die Auszahlungsanfrage wurde abgelehnt.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error instanceof Error ? error.message : 'Auszahlung konnte nicht abgelehnt werden',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Ausstehend</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Genehmigt</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Abgelehnt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter withdrawals
  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = 
      w.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.wallet_address?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Auszahlungen</h1>
          <p className="text-muted-foreground mt-1">
            Verwalte Auszahlungsanfragen der Benutzer
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <ArrowUpFromLine className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ausstehend</p>
                  <p className="text-2xl font-bold text-foreground">{pendingWithdrawals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Genehmigt (Gesamt)</p>
                  <p className="text-2xl font-bold text-foreground">
                    {withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0).toFixed(2)} €
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Abgelehnt</p>
                  <p className="text-2xl font-bold text-foreground">{withdrawals.filter(w => w.status === 'failed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Auszahlungsanfragen</CardTitle>
            <CardDescription>Alle Auszahlungsanfragen von Benutzern</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suche nach E-Mail oder Wallet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="completed">Genehmigt</SelectItem>
                  <SelectItem value="failed">Abgelehnt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredWithdrawals.length === 0 ? (
              <div className="text-center py-12">
                <ArrowUpFromLine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Keine Auszahlungsanfragen gefunden</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Benutzer</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Wallet-Adresse</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(withdrawal.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {withdrawal.user_email}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {withdrawal.amount.toFixed(2)} €
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">
                              {withdrawal.wallet_address?.slice(0, 8)}...{withdrawal.wallet_address?.slice(-6)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(withdrawal.wallet_address || '', withdrawal.id)}
                            >
                              {copiedId === withdrawal.id ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(withdrawal.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {withdrawal.status === 'pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleApprove(withdrawal.id)}
                                disabled={approveWithdrawal.isPending}
                              >
                                {approveWithdrawal.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                )}
                                Genehmigen
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleDecline(withdrawal.id)}
                                disabled={declineWithdrawal.isPending}
                              >
                                {declineWithdrawal.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                Ablehnen
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}