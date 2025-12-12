import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

const statusLabels: Record<string, string> = {
  active: 'Aktiv',
  paused: 'Pausiert',
  completed: 'Beendet',
  draft: 'Entwurf',
};

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  paused: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  completed: 'bg-muted text-muted-foreground border-border',
  draft: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

export function CampaignStatsTable({ campaigns }: CampaignStatsTableProps) {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: '500ms' }}>
      <CardHeader>
        <CardTitle className="text-lg">Kampagnen-Übersicht</CardTitle>
        <CardDescription>Detaillierte Performance-Daten aller Kampagnen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kampagne</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ausgaben</TableHead>
                <TableHead className="text-right">Impressionen</TableHead>
                <TableHead className="text-right">Klicks</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                const ctr = campaign.impressions > 0 
                  ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) 
                  : '0.00';
                
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
                      {campaign.spend.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.impressions.toLocaleString('de-DE')}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.clicks.toLocaleString('de-DE')}
                    </TableCell>
                    <TableCell className="text-right">{ctr}%</TableCell>
                    <TableCell className="text-right">
                      {campaign.conversions.toLocaleString('de-DE')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
