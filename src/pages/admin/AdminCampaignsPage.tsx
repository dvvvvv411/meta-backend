import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAdminCampaigns } from '@/hooks/useAdminCampaigns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const objectiveLabels: Record<string, string> = {
  awareness: 'Awareness',
  traffic: 'Traffic',
  engagement: 'Engagement',
  leads: 'Leads',
  app_promotion: 'App Promotion',
  sales: 'Sales',
};

const buyingTypeLabels: Record<string, string> = {
  auction: 'Auction',
  reservation: 'Reservation',
};

export default function AdminCampaignsPage() {
  const navigate = useNavigate();
  const { data: campaigns, isLoading } = useAdminCampaigns();
  const [search, setSearch] = useState('');
  const [objectiveFilter, setObjectiveFilter] = useState<string>('all');

  const filteredCampaigns = campaigns?.filter((campaign) => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(search.toLowerCase()) ||
      campaign.user_email.toLowerCase().includes(search.toLowerCase());
    const matchesObjective = objectiveFilter === 'all' || campaign.objective === objectiveFilter;
    return matchesSearch && matchesObjective;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Kampagnenentwürfe</h1>
          <p className="text-muted-foreground">Alle Kampagnenentwürfe aller Benutzer</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Entwürfe
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suche nach Name oder Benutzer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={objectiveFilter} onValueChange={setObjectiveFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ziel filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Ziele</SelectItem>
                  {Object.entries(objectiveLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : filteredCampaigns?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine Kampagnenentwürfe gefunden</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Benutzer</TableHead>
                      <TableHead className="hidden sm:table-cell">Ziel</TableHead>
                      <TableHead className="hidden lg:table-cell">Kaufart</TableHead>
                      <TableHead className="hidden md:table-cell">Letzte Änderung</TableHead>
                      <TableHead className="w-24">Aktion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns?.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground md:hidden">
                            {campaign.user_email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm">{campaign.user_email}</span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary">
                            {objectiveLabels[campaign.objective] || campaign.objective}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline">
                            {buyingTypeLabels[campaign.buying_type] || campaign.buying_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(campaign.updated_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/campaigns/${campaign.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
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
