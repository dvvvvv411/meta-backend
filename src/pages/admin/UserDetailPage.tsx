import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAdminUserDetail } from '@/hooks/useAdminUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArrowLeft, Mail, Building2, Wallet, Calendar, Shield, Receipt, FileText, MonitorSmartphone } from 'lucide-react';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useAdminUserDetail(id);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Einzahlung</Badge>;
      case 'rental':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Account Miete</Badge>;
      case 'withdrawal':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Auszahlung</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Abgeschlossen</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Ausstehend</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Fehlgeschlagen</Badge>;
      default:
        return <Badge variant="secondary">{status || '-'}</Badge>;
    }
  };

  const getAccountStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktiv</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800">Abgelaufen</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Gesperrt</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data?.profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Benutzer nicht gefunden</p>
          <Button variant="outline" onClick={() => navigate('/admin/users')} className="mt-4">
            Zurück zur Übersicht
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { profile, transactions, drafts, accounts, role } = data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{profile.email}</h1>
            <p className="text-muted-foreground">Benutzer-Details</p>
          </div>
        </div>

        {/* User Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-Mail</p>
                  <p className="font-medium text-sm">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Firma</p>
                  <p className="font-medium text-sm">{profile.company_name || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guthaben</p>
                  <p className="font-medium text-sm">{(profile.balance_eur || 0).toFixed(2)} €</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rolle</p>
                  <p className="font-medium text-sm capitalize">{role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-50">
                  <MonitorSmartphone className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Accounts</p>
                  <p className="font-medium text-sm">{accounts.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registriert</p>
                  <p className="font-medium text-sm">
                    {profile.created_at ? format(new Date(profile.created_at), 'dd.MM.yyyy', { locale: de }) : '-'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions" className="gap-2">
              <Receipt className="h-4 w-4" />
              Transaktionen ({transactions.length})
            </TabsTrigger>
            <TabsTrigger value="drafts" className="gap-2">
              <FileText className="h-4 w-4" />
              Kampagnenentwürfe ({drafts.length})
            </TabsTrigger>
            <TabsTrigger value="accounts" className="gap-2">
              <MonitorSmartphone className="h-4 w-4" />
              Agency Accounts ({accounts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>Keine Transaktionen vorhanden</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead className="text-right">Betrag</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Beschreibung</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            {tx.created_at ? format(new Date(tx.created_at), 'dd.MM.yyyy HH:mm', { locale: de }) : '-'}
                          </TableCell>
                          <TableCell>{getTypeBadge(tx.type)}</TableCell>
                          <TableCell className="text-right font-mono">
                            {tx.amount.toFixed(2)} {tx.currency || 'EUR'}
                          </TableCell>
                          <TableCell>{getStatusBadge(tx.status)}</TableCell>
                          <TableCell className="text-muted-foreground">{tx.description || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafts" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {drafts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>Keine Kampagnenentwürfe vorhanden</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Ziel</TableHead>
                        <TableHead>Kaufart</TableHead>
                        <TableHead>Letzte Änderung</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drafts.map((draft) => (
                        <TableRow key={draft.id}>
                          <TableCell className="font-medium">{draft.name}</TableCell>
                          <TableCell className="capitalize">{draft.objective}</TableCell>
                          <TableCell className="capitalize">{draft.buying_type}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {draft.updated_at ? format(new Date(draft.updated_at), 'dd.MM.yyyy HH:mm', { locale: de }) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {accounts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MonitorSmartphone className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>Keine Agency Accounts vorhanden</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Plattform</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Startdatum</TableHead>
                        <TableHead>Ablaufdatum</TableHead>
                        <TableHead className="text-right">Preis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell className="capitalize">{account.platform}</TableCell>
                          <TableCell>{getAccountStatusBadge(account.status)}</TableCell>
                          <TableCell>
                            {account.start_date ? format(new Date(account.start_date), 'dd.MM.yyyy', { locale: de }) : '-'}
                          </TableCell>
                          <TableCell>
                            {account.expire_at ? format(new Date(account.expire_at), 'dd.MM.yyyy', { locale: de }) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {(account.price_paid || 150).toFixed(2)} €
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
