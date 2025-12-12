import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface PerformanceDataPoint {
  date: string;
  impressions: number;
  clicks: number;
}

interface ImpressionsBarChartProps {
  data: PerformanceDataPoint[];
}

const chartConfig = {
  impressions: {
    label: 'Impressionen',
    color: 'hsl(var(--primary))',
  },
  clicks: {
    label: 'Klicks',
    color: 'hsl(var(--chart-2))',
  },
};

export function ImpressionsBarChart({ data }: ImpressionsBarChartProps) {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
      <CardHeader>
        <CardTitle className="text-lg">Impressionen & Klicks</CardTitle>
        <CardDescription>Vergleich der täglichen Performance-Metriken</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
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
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                className="text-muted-foreground"
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar 
                dataKey="impressions" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                animationEasing="ease-out"
              />
              <Bar 
                dataKey="clicks" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                animationEasing="ease-out"
                animationBegin={200}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
