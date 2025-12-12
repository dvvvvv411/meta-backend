import { Megaphone, Plus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdvertiserAccount } from '@/hooks/useAdvertiserAccount';

export default function CampaignsPage() {
  const { hasActiveAccount } = useAdvertiserAccount();

  if (!hasActiveAccount) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kampagnen erstellen</h1>
          <p className="text-muted-foreground mt-1">
            Erstelle und verwalte deine Werbekampagnen.
          </p>
        </div>

        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              Account erforderlich
            </CardTitle>
            <CardDescription>
              Bitte miete zuerst ein Agency Account um Kampagnen zu erstellen.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kampagnen erstellen</h1>
          <p className="text-muted-foreground mt-1">
            Erstelle und verwalte deine Werbekampagnen.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neue Kampagne
        </Button>
      </div>

      {/* Placeholder for campaigns list */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Megaphone className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Keine Kampagnen vorhanden
          </h3>
          <p className="text-muted-foreground text-center max-w-sm mb-4">
            Erstelle deine erste Kampagne um mit der Werbung zu starten.
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Erste Kampagne erstellen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
