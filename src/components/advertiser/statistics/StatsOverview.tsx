import { TrendingUp, TrendingDown, Eye, MousePointer, Percent, DollarSign, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPIData {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface StatsOverviewProps {
  data: KPIData;
  previousData?: KPIData;
}

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  delay: number;
}

function StatCard({ title, value, change, icon, delay }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card 
      className="animate-fade-in hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositive && "text-emerald-500",
                isNegative && "text-destructive",
                !isPositive && !isNegative && "text-muted-foreground"
              )}>
                {isPositive && <TrendingUp className="h-3 w-3" />}
                {isNegative && <TrendingDown className="h-3 w-3" />}
                <span>{isPositive ? '+' : ''}{change.toFixed(1)}% vs. Vorperiode</span>
              </div>
            )}
          </div>
          <div className="rounded-xl bg-primary/10 p-3">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsOverview({ data, previousData }: StatsOverviewProps) {
  const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
  const cpc = data.clicks > 0 ? data.spend / data.clicks : 0;
  const roas = data.spend > 0 ? ((data.conversions * 50) / data.spend) * 100 : 0; // Assuming 50€ per conversion

  const prevCtr = previousData && previousData.impressions > 0 
    ? (previousData.clicks / previousData.impressions) * 100 : 0;
  const prevCpc = previousData && previousData.clicks > 0 
    ? previousData.spend / previousData.clicks : 0;
  const prevRoas = previousData && previousData.spend > 0 
    ? ((previousData.conversions * 50) / previousData.spend) * 100 : 0;

  const calculateChange = (current: number, previous: number) => {
    if (!previous || previous === 0) return undefined;
    return ((current - previous) / previous) * 100;
  };

  const stats = [
    {
      title: 'Ausgaben',
      value: `${data.spend.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
      change: previousData ? calculateChange(data.spend, previousData.spend) : 12.5,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Impressionen',
      value: data.impressions.toLocaleString('de-DE'),
      change: previousData ? calculateChange(data.impressions, previousData.impressions) : 8.3,
      icon: <Eye className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Klicks',
      value: data.clicks.toLocaleString('de-DE'),
      change: previousData ? calculateChange(data.clicks, previousData.clicks) : 15.2,
      icon: <MousePointer className="h-5 w-5 text-primary" />,
    },
    {
      title: 'CTR',
      value: `${ctr.toFixed(2)}%`,
      change: previousData ? calculateChange(ctr, prevCtr) : 6.1,
      icon: <Percent className="h-5 w-5 text-primary" />,
    },
    {
      title: 'CPC',
      value: `${cpc.toFixed(2)} €`,
      change: previousData ? calculateChange(cpc, prevCpc) : -3.2,
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Conversions',
      value: data.conversions.toLocaleString('de-DE'),
      change: previousData ? calculateChange(data.conversions, previousData.conversions) : 22.8,
      icon: <Target className="h-5 w-5 text-primary" />,
    },
    {
      title: 'ROAS',
      value: `${roas.toFixed(0)}%`,
      change: previousData ? calculateChange(roas, prevRoas) : 18.4,
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          delay={index * 50}
        />
      ))}
    </div>
  );
}
