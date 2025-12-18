import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export interface CampaignStats {
  id: string;
  name: string;
  startDate: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface CampaignStatsTableProps {
  campaigns: CampaignStats[];
}

type SortField = 'name' | 'spend' | 'impressions' | 'clicks' | 'conversions' | 'ctr';
type SortOrder = 'asc' | 'desc';

const PAGE_SIZES = [5, 10, 25, 50];

export function CampaignStatsTable({ campaigns }: CampaignStatsTableProps) {
  const { language } = useLanguage();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const statusLabels: Record<string, string> = {
    active: language === 'de' ? 'Aktiv' : 'Active',
    paused: language === 'de' ? 'Pausiert' : 'Paused',
    completed: language === 'de' ? 'Beendet' : 'Completed',
    draft: language === 'de' ? 'Entwurf' : 'Draft',
  };

  const statusStyles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    paused: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    completed: 'bg-muted text-muted-foreground border-border',
    draft: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getCtr = (campaign: CampaignStats) => {
    return campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
  };

  const sortedCampaigns = useMemo(() => {
    if (!sortField) return campaigns;

    return [...campaigns].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case 'name':
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        case 'spend':
          aValue = a.spend;
          bValue = b.spend;
          break;
        case 'impressions':
          aValue = a.impressions;
          bValue = b.impressions;
          break;
        case 'clicks':
          aValue = a.clicks;
          bValue = b.clicks;
          break;
        case 'conversions':
          aValue = a.conversions;
          bValue = b.conversions;
          break;
        case 'ctr':
          aValue = getCtr(a);
          bValue = getCtr(b);
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [campaigns, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedCampaigns.length / pageSize);
  const paginatedCampaigns = sortedCampaigns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1 text-primary" />
      : <ArrowDown className="h-4 w-4 ml-1 text-primary" />;
  };

  const SortableHeader = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead 
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors select-none", className)}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        <SortIcon field={field} />
      </div>
    </TableHead>
  );

  // Empty state
  if (campaigns.length === 0) {
    return (
      <Card className="animate-fade-in" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'de' ? 'Kampagnen-Übersicht' : 'Campaign Overview'}
          </CardTitle>
          <CardDescription>
            {language === 'de' ? 'Detaillierte Performance-Daten aller Kampagnen' : 'Detailed performance data for all campaigns'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center border-2 border-dashed border-muted rounded-lg bg-muted/20">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              {language === 'de' ? 'Keine Kampagnen vorhanden' : 'No campaigns available'}
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              {language === 'de' ? 'Erstelle deine erste Kampagne um Daten zu sehen' : 'Create your first campaign to see data'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '500ms' }}>
      <CardHeader>
        <CardTitle className="text-lg">
          {language === 'de' ? 'Kampagnen-Übersicht' : 'Campaign Overview'}
        </CardTitle>
        <CardDescription>
          {language === 'de' ? 'Detaillierte Performance-Daten aller Kampagnen' : 'Detailed performance data for all campaigns'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="name">
                  {language === 'de' ? 'Kampagne' : 'Campaign'}
                </SortableHeader>
                <TableHead>Start</TableHead>
                <TableHead>Status</TableHead>
                <SortableHeader field="spend" className="text-right">
                  {language === 'de' ? 'Ausgaben' : 'Spend'}
                </SortableHeader>
                <SortableHeader field="impressions" className="text-right">
                  {language === 'de' ? 'Impressionen' : 'Impressions'}
                </SortableHeader>
                <SortableHeader field="clicks" className="text-right">
                  {language === 'de' ? 'Klicks' : 'Clicks'}
                </SortableHeader>
                <SortableHeader field="ctr" className="text-right">CTR</SortableHeader>
                <SortableHeader field="conversions" className="text-right">Conversions</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCampaigns.map((campaign) => {
                const ctr = getCtr(campaign).toFixed(2);
                
                return (
                  <TableRow key={campaign.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="text-muted-foreground">{campaign.startDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn('font-medium', statusStyles[campaign.status])}
                      >
                        {statusLabels[campaign.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {campaign.spend.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2 })} €
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.impressions.toLocaleString(language === 'de' ? 'de-DE' : 'en-US')}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.clicks.toLocaleString(language === 'de' ? 'de-DE' : 'en-US')}
                    </TableCell>
                    <TableCell className="text-right">{ctr}%</TableCell>
                    <TableCell className="text-right">
                      {campaign.conversions.toLocaleString(language === 'de' ? 'de-DE' : 'en-US')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {campaigns.length > PAGE_SIZES[0] && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{language === 'de' ? 'Zeige' : 'Show'}</span>
              <Select 
                value={pageSize.toString()} 
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>{language === 'de' ? `von ${campaigns.length} Einträgen` : `of ${campaigns.length} entries`}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {language === 'de' ? `Seite ${currentPage} von ${totalPages || 1}` : `Page ${currentPage} of ${totalPages || 1}`}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
