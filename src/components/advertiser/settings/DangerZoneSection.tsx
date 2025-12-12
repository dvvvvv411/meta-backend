import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { DeleteAccountModal } from './DeleteAccountModal';

export function DangerZoneSection() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Achtung: Gefährlicher Bereich</AlertTitle>
        <AlertDescription>
          Die folgenden Aktionen sind permanent und können nicht rückgängig gemacht werden.
        </AlertDescription>
      </Alert>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Account löschen
          </CardTitle>
          <CardDescription>
            Ihren Account und alle zugehörigen Daten permanent löschen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Wenn Sie Ihren Account löschen:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Werden alle Ihre persönlichen Daten gelöscht</li>
              <li>Verlieren Sie Zugang zu allen gemieteten Agency Accounts</li>
              <li>Werden alle offenen Guthaben verfallen</li>
              <li>Können Sie diese E-Mail-Adresse nicht erneut registrieren</li>
              <li>Werden alle Support-Tickets geschlossen</li>
            </ul>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Account permanent löschen
          </Button>
        </CardContent>
      </Card>

      <DeleteAccountModal 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal} 
      />
    </div>
  );
}
