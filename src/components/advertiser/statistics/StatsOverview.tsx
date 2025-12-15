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
  isEmpty?: boolean;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  accentColor: string;
  delay: number;
  isEmpty?: boolean;
}

function StatCard({ title, value, subtitle, accentColor, delay, isEmpty }: StatCardProps) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden border-0 shadow-sm animate-fade-in transition-all duration-300",
        isEmpty ? "opacity-70" : "hover:shadow-md hover:-translate-y-0.5"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Farbiger Akzent-Balken links */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b", accentColor)} />
      
      <CardContent className="p-5 pl-4">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          {title}
        </p>
        <p className={cn(
          "text-3xl font-bold tracking-tight",
          isEmpty ? "text-muted-foreground" : "text-foreground"
        )}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}

export function StatsOverview({ data, isEmpty }: StatsOverviewProps) {
  const cpc = data.clicks > 0 ? data.spend / data.clicks : 0;

  const stats = [
    {
      title: 'Ausgaben',
      value: isEmpty ? '€0,00' : `€${data.spend.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Gesamtausgaben',
      accentColor: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Reichweite',
      value: isEmpty ? '0' : data.impressions.toLocaleString('de-DE'),
      subtitle: 'Impressionen',
      accentColor: 'from-cyan-500 to-teal-500',
    },
    {
      title: 'Ergebnisse',
      value: isEmpty ? '0' : data.clicks.toLocaleString('de-DE'),
      subtitle: 'Klicks',
      accentColor: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Kosten pro Ergebnis',
      value: isEmpty ? '--' : `€${cpc.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'pro Klick',
      accentColor: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          accentColor={stat.accentColor}
          delay={index * 75}
          isEmpty={isEmpty}
        />
      ))}
    </div>
  );
}
