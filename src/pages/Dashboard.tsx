import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Receipt, MonitorSmartphone, MessageSquare } from "lucide-react";
import { useAdminStats } from "@/hooks/useAdminTransactions";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useAdminStats();

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

  if (isLoading) {
    return (
      <DashboardLayout isAdmin={true}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isAdmin={true}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Admin Übersicht</h1>
          <p className="text-muted-foreground">Willkommen im Admin Dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Benutzer"
            value={stats?.usersCount.toString() || "0"}
            icon={Users}
            change=""
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            title="Transaktionen"
            value={stats?.transactionsCount.toString() || "0"}
            icon={Receipt}
            change=""
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin/transactions')}
          />
          <StatCard
            title="Agency Accounts"
            value={stats?.accountsCount.toString() || "0"}
            icon={MonitorSmartphone}
            change=""
          />
          <StatCard
            title="Tickets"
            value={stats?.ticketsCount.toString() || "0"}
            icon={MessageSquare}
            change={stats?.openTicketsCount ? `${stats.openTicketsCount} offen` : ""}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin/tickets')}
          />
        </div>

        {/* Recent Data */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Letzte Transaktionen</CardTitle>
              <button 
                onClick={() => navigate('/admin/transactions')}
                className="text-sm text-primary hover:underline"
              >
                Alle anzeigen
              </button>
            </CardHeader>
            <CardContent>
              {stats?.recentTransactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Keine Transaktionen vorhanden</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead className="text-right">Betrag</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.recentTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm">
                          {tx.created_at ? format(new Date(tx.created_at), 'dd.MM.', { locale: de }) : '-'}
                        </TableCell>
                        <TableCell>{getTypeBadge(tx.type)}</TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {tx.amount.toFixed(2)} €
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Neue Benutzer</CardTitle>
              <button 
                onClick={() => navigate('/admin/users')}
                className="text-sm text-primary hover:underline"
              >
                Alle anzeigen
              </button>
            </CardHeader>
            <CardContent>
              {stats?.recentUsers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Keine Benutzer vorhanden</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-Mail</TableHead>
                      <TableHead>Firma</TableHead>
                      <TableHead>Registriert</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.recentUsers.map((user) => (
                      <TableRow 
                        key={user.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        <TableCell className="font-medium text-sm">{user.email}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {user.company_name || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {user.created_at ? format(new Date(user.created_at), 'dd.MM.yyyy', { locale: de }) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
