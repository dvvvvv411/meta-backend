import { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { useAdvertiserAccount } from '@/hooks/useAdvertiserAccount';
import { StatsOverview } from '@/components/advertiser/statistics/StatsOverview';
import { SpendLineChart } from '@/components/advertiser/statistics/SpendLineChart';
import { ImpressionsBarChart } from '@/components/advertiser/statistics/ImpressionsBarChart';
import { SpendPieChart } from '@/components/advertiser/statistics/SpendPieChart';
import { CampaignStatsTable, type CampaignStats } from '@/components/advertiser/statistics/CampaignStatsTable';
import { StatisticsFilters, type TimeRange } from '@/components/advertiser/statistics/StatisticsFilters';
import { NoAccountOverlay } from '@/components/advertiser/statistics/NoAccountOverlay';
import { ExportButtons } from '@/components/advertiser/statistics/ExportButtons';

// Dummy campaign data
const DUMMY_CAMPAIGNS: CampaignStats[] = [
  {
    id: '1',
    name: 'Sommer Sale 2024',
    startDate: '01.06.2024',
    status: 'active',
    spend: 2450.00,
    impressions: 125000,
    clicks: 3200,
    conversions: 89,
  },
  {
    id: '2',
    name: 'Brand Awareness Q4',
    startDate: '15.10.2024',
    status: 'active',
    spend: 1820.50,
    impressions: 98000,
    clicks: 2100,
    conversions: 45,
  },
  {
    id: '3',
    name: 'Produkt Launch Alpha',
    startDate: '01.11.2024',
    status: 'paused',
    spend: 890.25,
    impressions: 45000,
    clicks: 1200,
    conversions: 28,
  },
  {
    id: '4',
    name: 'Retargeting Kampagne',
    startDate: '20.11.2024',
    status: 'completed',
    spend: 650.00,
    impressions: 32000,
    clicks: 890,
    conversions: 52,
  },
];

// Generate time-series data based on range
function generateSpendData(days: number) {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const baseSpend = 80 + Math.random() * 60;
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
    
    data.push({
      date: date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
      spend: Math.round(baseSpend * weekendFactor * 100) / 100,
    });
  }
  
  return data;
}

function generatePerformanceData(days: number) {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const baseImpressions = 3000 + Math.random() * 2000;
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;
    
    const impressions = Math.round(baseImpressions * weekendFactor);
    const clicks = Math.round(impressions * (0.02 + Math.random() * 0.015));
    
    data.push({
      date: date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
      impressions,
      clicks,
    });
  }
  
  return data;
}

// Spend distribution for pie chart
const SPEND_DISTRIBUTION = [
  { name: 'Sommer Sale 2024', value: 2450, color: 'hsl(var(--primary))' },
  { name: 'Brand Awareness Q4', value: 1820.5, color: 'hsl(var(--chart-2))' },
  { name: 'Produkt Launch Alpha', value: 890.25, color: 'hsl(var(--chart-3))' },
  { name: 'Retargeting Kampagne', value: 650, color: 'hsl(var(--chart-4))' },
];

export default function StatisticsPage() {
  const { hasActiveAccount } = useAdvertiserAccount();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

  const spendData = useMemo(() => generateSpendData(days), [days]);
  const performanceData = useMemo(() => generatePerformanceData(days), [days]);

  // Filter campaigns if specific one is selected
  const filteredCampaigns = selectedCampaign === 'all' 
    ? DUMMY_CAMPAIGNS 
    : DUMMY_CAMPAIGNS.filter(c => c.id === selectedCampaign);

  // Calculate aggregated KPIs
  const kpiData = useMemo(() => {
    return filteredCampaigns.reduce(
      (acc, campaign) => ({
        spend: acc.spend + campaign.spend,
        impressions: acc.impressions + campaign.impressions,
        clicks: acc.clicks + campaign.clicks,
        conversions: acc.conversions + campaign.conversions,
      }),
      { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
    );
  }, [filteredCampaigns]);

  // Filter spend distribution for pie chart
  const filteredSpendDistribution = selectedCampaign === 'all'
    ? SPEND_DISTRIBUTION
    : SPEND_DISTRIBUTION.filter(s => 
        DUMMY_CAMPAIGNS.find(c => c.id === selectedCampaign)?.name === s.name
      );

  const campaignOptions = DUMMY_CAMPAIGNS.map(c => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Statistiken</h1>
          <p className="text-muted-foreground mt-1">
            Analysiere die Performance deiner Kampagnen.
          </p>
        </div>
        <ExportButtons disabled={!hasActiveAccount} />
      </div>

      {/* Filters */}
      <StatisticsFilters
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedCampaign={selectedCampaign}
        onCampaignChange={setSelectedCampaign}
        campaigns={campaignOptions}
      />

      {/* Content with overlay if no account */}
      <div className="relative">
        {!hasActiveAccount && <NoAccountOverlay />}
        
        <div className={!hasActiveAccount ? 'pointer-events-none select-none' : ''}>
          {/* KPI Cards */}
          <StatsOverview data={kpiData} />

          {/* Charts Grid */}
          <div className="grid gap-6 mt-6 lg:grid-cols-2">
            <SpendLineChart data={spendData} />
            <ImpressionsBarChart data={performanceData} />
          </div>

          {/* Pie Chart */}
          <div className="mt-6">
            <SpendPieChart data={filteredSpendDistribution} />
          </div>

          {/* Campaign Table */}
          <div className="mt-6">
            <CampaignStatsTable campaigns={filteredCampaigns} />
          </div>
        </div>
      </div>
    </div>
  );
}
