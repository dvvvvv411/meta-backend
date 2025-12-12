import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, Zap, BarChart3, Webhook } from 'lucide-react';

export function ApiKeysSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Programmatischer Zugriff auf Ihre Kampagnen und Statistiken
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              Coming Soon
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
            <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-medium mb-2">API-Zugang in Entwicklung</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Bald können Sie über unsere REST API programmatisch auf Ihre Kampagnen-Daten zugreifen, 
              Statistiken abrufen und Berichte automatisieren.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Geplante Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <Zap className="h-8 w-8 mb-3 text-primary" />
              <h4 className="font-medium mb-1">REST API</h4>
              <p className="text-sm text-muted-foreground">
                Vollständiger API-Zugang für Kampagnen, Statistiken und Account-Daten
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <BarChart3 className="h-8 w-8 mb-3 text-primary" />
              <h4 className="font-medium mb-1">Reporting API</h4>
              <p className="text-sm text-muted-foreground">
                Automatisierte Berichte und Daten-Exports für Ihre Analyse-Tools
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <Webhook className="h-8 w-8 mb-3 text-primary" />
              <h4 className="font-medium mb-1">Webhooks</h4>
              <p className="text-sm text-muted-foreground">
                Echtzeit-Benachrichtigungen für wichtige Events in Ihrem Account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
