import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdvertiserAccount } from '@/hooks/useAdvertiserAccount';

export default function StatisticsPage() {
  const { hasActiveAccount } = useAdvertiserAccount();

  if (!hasActiveAccount) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Statistiken</h1>
          <p className="text-muted-foreground mt-1">
            Analysiere die Performance deiner Kampagnen.
          </p>
        </div>

        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              Account erforderlich
            </CardTitle>
            <CardDescription>
              Bitte miete zuerst ein Agency Account um Statistiken zu sehen.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Statistiken</h1>
        <p className="text-muted-foreground mt-1">
          Analysiere die Performance deiner Kampagnen.
        </p>
      </div>

      {/* Placeholder Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Impressionen
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Keine Daten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Klicks
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Keine Daten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CTR
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground mt-1">Keine Daten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ausgaben
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0,00€</div>
            <p className="text-xs text-muted-foreground mt-1">Keine Daten</p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Chart Area */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Übersicht</CardTitle>
          <CardDescription>
            Hier werden deine Kampagnen-Statistiken angezeigt.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Keine Statistiken vorhanden
          </h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Starte deine erste Kampagne um Performance-Daten zu sammeln.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
