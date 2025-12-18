import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { DeleteAccountModal } from './DeleteAccountModal';
import { useLanguage } from '@/contexts/LanguageContext';

export function DangerZoneSection() {
  const { t } = useLanguage();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t.settings.dangerZoneWarning}</AlertTitle>
        <AlertDescription>
          {t.settings.dangerZoneDesc}
        </AlertDescription>
      </Alert>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {t.settings.deleteAccount}
          </CardTitle>
          <CardDescription>
            {t.settings.deleteAccountDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>{t.settings.deleteAccountInfo}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{t.settings.deleteAccountPoint1}</li>
              <li>{t.settings.deleteAccountPoint2}</li>
              <li>{t.settings.deleteAccountPoint3}</li>
              <li>{t.settings.deleteAccountPoint4}</li>
              <li>{t.settings.deleteAccountPoint5}</li>
            </ul>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t.settings.deleteAccountButton}
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
