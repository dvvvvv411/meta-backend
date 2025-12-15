import { Eye, MousePointer, Percent, DollarSign, Target, BarChart3, TrendingUp } from 'lucide-react';
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
  isEmpty?: boolean;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  delay: number;
  isEmpty?: boolean;
}

function StatCard({ title, value, icon, delay, isEmpty }: StatCardProps) {
  return (
    <Card 
      className={cn(
        "animate-fade-in transition-all duration-300",
        isEmpty ? "opacity-60" : "hover:shadow-lg hover:-translate-y-1"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn(
              "text-2xl font-bold",
              isEmpty ? "text-muted-foreground" : "text-foreground"
            )}>
              {value}
            </p>
          </div>
          <div className={cn(
            "rounded-xl p-3",
            isEmpty ? "bg-muted" : "bg-primary/10"
          )}>
            <div className={isEmpty ? "text-muted-foreground" : "text-primary"}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsOverview({ data, isEmpty }: StatsOverviewProps) {
  const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
  const cpc = data.clicks > 0 ? data.spend / data.clicks : 0;
  const roas = data.spend > 0 ? ((data.conversions * 50) / data.spend) * 100 : 0;

  const stats = [
    {
      title: 'Ausgaben',
      value: isEmpty ? '0,00 €' : `${data.spend.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: 'Impressionen',
      value: isEmpty ? '0' : data.impressions.toLocaleString('de-DE'),
      icon: <Eye className="h-5 w-5" />,
    },
    {
      title: 'Klicks',
      value: isEmpty ? '0' : data.clicks.toLocaleString('de-DE'),
      icon: <MousePointer className="h-5 w-5" />,
    },
    {
      title: 'CTR',
      value: isEmpty ? '--' : `${ctr.toFixed(2)}%`,
      icon: <Percent className="h-5 w-5" />,
    },
    {
      title: 'CPC',
      value: isEmpty ? '--' : `${cpc.toFixed(2)} €`,
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'Conversions',
      value: isEmpty ? '0' : data.conversions.toLocaleString('de-DE'),
      icon: <Target className="h-5 w-5" />,
    },
    {
      title: 'ROAS',
      value: isEmpty ? '--' : `${roas.toFixed(0)}%`,
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          delay={index * 50}
          isEmpty={isEmpty}
        />
      ))}
    </div>
  );
}
