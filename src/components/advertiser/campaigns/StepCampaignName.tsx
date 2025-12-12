import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DemoTooltip } from './DemoTooltip';

interface StepCampaignNameProps {
  name: string;
  notes: string;
  onNameChange: (name: string) => void;
  onNotesChange: (notes: string) => void;
}

export function StepCampaignName({
  name,
  notes,
  onNameChange,
  onNotesChange,
}: StepCampaignNameProps) {
  return (
    <Card className="animate-in fade-in-50 slide-in-from-right-5 duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          Kampagnenname
        </CardTitle>
        <DemoTooltip />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="campaign-name">Wie soll deine Kampagne heißen?</Label>
          <Input
            id="campaign-name"
            placeholder="z.B. Sommerschlussverkauf 2025"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-12 text-lg"
          />
          <p className="text-sm text-muted-foreground">
            Wähle einen aussagekräftigen Namen für die interne Zuordnung.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaign-notes">Interne Notizen (optional)</Label>
          <Textarea
            id="campaign-notes"
            placeholder="z.B. Q1 2025 Produkt-Launch, Zielgruppe: Bestandskunden"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-sm text-muted-foreground">
            Füge zusätzliche Informationen für dein Team hinzu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
