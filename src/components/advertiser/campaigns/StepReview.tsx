import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Pencil, Rocket, Image, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DemoTooltip } from './DemoTooltip';

interface MockFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
}

interface StepReviewProps {
  campaignData: {
    name: string;
    notes: string;
    budget: number;
    budgetType: 'daily' | 'total';
    startDate: Date | undefined;
    endDate: Date | undefined;
    location: string;
    ageRange: string;
    gender: string;
    interests: string;
    files: MockFile[];
  };
  onEditStep: (step: number) => void;
  onSave: () => void;
  hasActiveAccount: boolean;
}

const LOCATION_LABELS: Record<string, string> = {
  de: 'Deutschland',
  at: 'Österreich',
  ch: 'Schweiz',
  dach: 'DACH Region',
  eu: 'Europa',
};

const GENDER_LABELS: Record<string, string> = {
  all: 'Alle Geschlechter',
  male: 'Männlich',
  female: 'Weiblich',
};

const INTEREST_LABELS: Record<string, string> = {
  ecommerce: 'E-Commerce',
  tech: 'Technologie',
  fashion: 'Mode & Lifestyle',
  sports: 'Sport & Fitness',
  travel: 'Reisen',
  food: 'Food & Gastronomie',
};

export function StepReview({ campaignData, onEditStep, onSave, hasActiveAccount }: StepReviewProps) {
  const days = campaignData.startDate && campaignData.endDate
    ? Math.ceil((campaignData.endDate.getTime() - campaignData.startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 30;
  
  const totalBudget = campaignData.budgetType === 'daily' 
    ? campaignData.budget * days 
    : campaignData.budget;

  // Mock performance estimates
  const estimatedImpressions = Math.floor(totalBudget * 100);
  const estimatedClicks = Math.floor(estimatedImpressions * 0.024);
  const estimatedCTR = 2.4;

  return (
    <Card className="animate-in fade-in-50 slide-in-from-right-5 duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">✅</span>
          Kampagne überprüfen
        </CardTitle>
        <DemoTooltip />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Campaign Summary Card */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {campaignData.name || 'Unbenannte Kampagne'}
            </h3>
          </div>

          <Separator className="my-4 bg-primary/10" />

          <div className="grid gap-4">
            {/* Name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📝</span>
                <span className="text-sm text-muted-foreground">Name</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {campaignData.name || '-'}
                </span>
                <Button variant="ghost" size="sm" onClick={() => onEditStep(1)} className="h-7 w-7 p-0">
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">💰</span>
                <span className="text-sm text-muted-foreground">Budget</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {totalBudget.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € 
                  ({campaignData.budget.toLocaleString('de-DE')}€/{campaignData.budgetType === 'daily' ? 'Tag' : 'Gesamt'})
                </span>
                <Button variant="ghost" size="sm" onClick={() => onEditStep(2)} className="h-7 w-7 p-0">
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📅</span>
                <span className="text-sm text-muted-foreground">Zeitraum</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {campaignData.startDate 
                    ? format(campaignData.startDate, 'dd.MM.yyyy', { locale: de })
                    : '-'} 
                  {' - '}
                  {campaignData.endDate 
                    ? format(campaignData.endDate, 'dd.MM.yyyy', { locale: de })
                    : '-'}
                </span>
                <Button variant="ghost" size="sm" onClick={() => onEditStep(2)} className="h-7 w-7 p-0">
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Targeting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🎯</span>
                <span className="text-sm text-muted-foreground">Zielgruppe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {LOCATION_LABELS[campaignData.location] || '-'}, {campaignData.ageRange || '-'}, {GENDER_LABELS[campaignData.gender] || '-'}
                </span>
                <Button variant="ghost" size="sm" onClick={() => onEditStep(3)} className="h-7 w-7 p-0">
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Creatives */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🎨</span>
                <span className="text-sm text-muted-foreground">Creatives</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  {campaignData.files.length} Dateien hochgeladen
                </span>
                <Button variant="ghost" size="sm" onClick={() => onEditStep(4)} className="h-7 w-7 p-0">
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-4 bg-primary/10" />

          {/* Estimated Performance */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              💡 Geschätzte Performance
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-foreground">
                  ~{estimatedImpressions.toLocaleString('de-DE')}
                </p>
                <p className="text-xs text-muted-foreground">Impressionen</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-foreground">
                  ~{estimatedClicks.toLocaleString('de-DE')}
                </p>
                <p className="text-xs text-muted-foreground">Klicks</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-foreground">
                  ~{estimatedCTR}%
                </p>
                <p className="text-xs text-muted-foreground">CTR</p>
              </div>
            </div>
          </div>
        </div>

        {/* No Account Warning */}
        {!hasActiveAccount && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Du benötigst ein aktives Agency Account um Kampagnen zu erstellen. 
              Bitte miete zuerst ein Account.
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Note */}
        <Alert className="bg-muted/50 border-muted">
          <AlertDescription className="text-muted-foreground">
            ⚠️ Dies ist aktuell eine Demo-UI — vollständige Funktionen folgen in Kürze.
          </AlertDescription>
        </Alert>

        {/* Save Button */}
        <Button
          onClick={onSave}
          disabled={!hasActiveAccount}
          className="w-full h-12 text-base"
          size="lg"
        >
          <Rocket className="mr-2 h-5 w-5" />
          Kampagne speichern (Platzhalter)
        </Button>
      </CardContent>
    </Card>
  );
}
