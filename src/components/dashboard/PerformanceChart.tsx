import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { name: "Mo", impressionen: 4000, klicks: 240, conversions: 24 },
  { name: "Di", impressionen: 3000, klicks: 198, conversions: 22 },
  { name: "Mi", impressionen: 5000, klicks: 320, conversions: 35 },
  { name: "Do", impressionen: 4800, klicks: 308, conversions: 31 },
  { name: "Fr", impressionen: 6200, klicks: 425, conversions: 48 },
  { name: "Sa", impressionen: 3800, klicks: 215, conversions: 19 },
  { name: "So", impressionen: 3200, klicks: 178, conversions: 15 },
];

export function PerformanceChart() {
  return (
    <div className="fintech-card">
      <div className="mb-6">
        <h3 className="font-display font-semibold text-lg">
          Wochenperformance
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Impressionen, Klicks und Conversions der letzten 7 Tage
        </p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(263, 70%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(263, 70%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(220, 13%, 91%)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="hsl(220, 9%, 46%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(220, 9%, 46%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "12px",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(222, 47%, 11%)", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="impressionen"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fill="url(#colorImpressions)"
            />
            <Area
              type="monotone"
              dataKey="klicks"
              stroke="hsl(263, 70%, 50%)"
              strokeWidth={2}
              fill="url(#colorClicks)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Impressionen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Klicks</span>
        </div>
      </div>
    </div>
  );
}
