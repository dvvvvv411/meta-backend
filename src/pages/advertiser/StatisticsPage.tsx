import { useNavigate } from 'react-router-dom';
import { BarChart3, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsOverview } from '@/components/advertiser/statistics/StatsOverview';
import { SpendLineChart } from '@/components/advertiser/statistics/SpendLineChart';
import { ImpressionsBarChart } from '@/components/advertiser/statistics/ImpressionsBarChart';
import { CampaignStatsTable } from '@/components/advertiser/statistics/CampaignStatsTable';
import { ExportButtons } from '@/components/advertiser/statistics/ExportButtons';
import { useLanguage } from '@/contexts/LanguageContext';

export default function StatisticsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Empty data for placeholder state
  const emptyKpiData = { spend: 0, impressions: 0, clicks: 0, conversions: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.statistics.pageTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {t.statistics.pageSubtitle}
          </p>
        </div>
        <ExportButtons disabled />
      </div>

      {/* Empty State Hero */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-900/30">
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
            <BarChart3 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {t.statistics.noStats}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {t.statistics.noStatsDesc}
          </p>
          <Button 
            onClick={() => navigate('/advertiser/campaigns')} 
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t.statistics.createCampaign}
          </Button>
        </CardContent>
      </Card>

      {/* KPI Cards with zero values */}
      <StatsOverview data={emptyKpiData} isEmpty />

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendLineChart data={[]} isEmpty />
        <ImpressionsBarChart data={[]} isEmpty />
      </div>

      {/* Campaign Table */}
      <CampaignStatsTable campaigns={[]} />
    </div>
  );
}
