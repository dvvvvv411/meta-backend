import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface SpendDataPoint {
  date: string;
  spend: number;
}

interface SpendLineChartProps {
  data: SpendDataPoint[];
  isEmpty?: boolean;
}

const chartConfig = {
  spend: {
    label: 'Ausgaben',
    color: 'hsl(var(--primary))',
  },
};

export function SpendLineChart({ data, isEmpty }: SpendLineChartProps) {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
      <CardHeader>
        <CardTitle className="text-lg">Ausgaben über Zeit</CardTitle>
        <CardDescription>Tägliche Werbeausgaben im ausgewählten Zeitraum</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty || data.length === 0 ? (
          <div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg bg-muted/20">
            <TrendingUp className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">Keine Ausgaben-Daten verfügbar</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Starte eine Kampagne um Daten zu sehen</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}€`}
                  className="text-muted-foreground"
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value) => [`${Number(value).toFixed(2)} €`, 'Ausgaben']}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#spendGradient)"
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
