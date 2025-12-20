import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Search, Users, ChevronRight } from 'lucide-react';

export default function UsersPage() {
  const navigate = useNavigate();
  const { data: users, isLoading } = useAdminUsers();
  const [search, setSearch] = useState('');

  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Benutzer</h1>
          <p className="text-muted-foreground">Alle registrierten Benutzer verwalten</p>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach E-Mail oder Firma..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredUsers?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine Benutzer gefunden</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-Mail</TableHead>
                    <TableHead>Firma</TableHead>
                    <TableHead>Branding</TableHead>
                    <TableHead className="text-right">Guthaben</TableHead>
                    <TableHead className="text-center">Accounts</TableHead>
                    <TableHead>Registriert</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.company_name || '-'}
                      </TableCell>
                      <TableCell>
                        {user.branding_name ? (
                          <Badge variant="outline">{user.branding_name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {(user.balance_eur || 0).toFixed(2)} €
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{user.accounts_count}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.created_at ? format(new Date(user.created_at), 'dd.MM.yyyy', { locale: de }) : '-'}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
