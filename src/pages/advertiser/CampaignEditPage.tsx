import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { CAMPAIGN_OBJECTIVES } from '@/components/advertiser/campaigns/ObjectiveSelector';
import { useState } from 'react';

type EditorLevel = 'campaign' | 'adset' | 'ad';

export default function CampaignEditPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const objective = searchParams.get('objective') || 'awareness';
  const buyingType = searchParams.get('buyingType') || 'auction';
  const setup = searchParams.get('setup') || 'recommended';

  const [activeLevel, setActiveLevel] = useState<EditorLevel>('campaign');
  const [campaignName, setCampaignName] = useState('Meine erste Kampagne');

  const objectiveConfig = CAMPAIGN_OBJECTIVES.find(obj => obj.id === objective);
  const ObjectiveIcon = objectiveConfig?.icon;

  const levels: { id: EditorLevel; label: string; completed: boolean }[] = [
    { id: 'campaign', label: 'Kampagne', completed: true },
    { id: 'adset', label: 'Anzeigengruppe', completed: false },
    { id: 'ad', label: 'Anzeige', completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/advertiser/campaigns')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {ObjectiveIcon && (
                <div className={`h-8 w-8 rounded-full ${objectiveConfig?.color} flex items-center justify-center`}>
                  <ObjectiveIcon className="h-4 w-4 text-white" />
                </div>
              )}
              <div>
                <h1 className="font-semibold text-foreground">Neue Kampagne - {objectiveConfig?.label}</h1>
                <p className="text-xs text-muted-foreground capitalize">{buyingType} • {setup === 'recommended' ? 'Empfohlene Einstellungen' : 'Manuell'}</p>
              </div>
            </div>
          </div>
          <Button disabled>
            Entwurf speichern
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Levels Navigation */}
        <div className="w-64 border-r bg-card/30 p-4 min-h-[calc(100vh-57px)]">
          <div className="space-y-1">
            {levels.map((level, index) => (
              <div key={level.id}>
                {index > 0 && (
                  <div className="flex justify-center py-1">
                    <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
                  </div>
                )}
                <button
                  onClick={() => setActiveLevel(level.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeLevel === level.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    level.completed 
                      ? 'bg-primary border-primary' 
                      : activeLevel === level.id 
                        ? 'border-primary' 
                        : 'border-muted-foreground'
                  }`}>
                    {level.completed && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-sm font-medium">{level.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 max-w-3xl">
          {activeLevel === 'campaign' && (
            <div className="space-y-6">
              {/* Development Notice */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Diese Seite ist noch in Entwicklung. Kampagnen können aktuell nicht gespeichert werden.
                </AlertDescription>
              </Alert>

              {/* Campaign Name */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kampagnenname</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input 
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Gib deiner Kampagne einen Namen"
                  />
                </CardContent>
              </Card>

              {/* Special Ad Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sonderanzeigenkategorien</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Wähle Kategorien aus, wenn deine Anzeigen zu diesen Themen gehören.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {['Kredit', 'Beschäftigung', 'Immobilien', 'Soziale Themen'].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category} disabled />
                        <Label htmlFor={category} className="text-sm text-muted-foreground">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kampagnendetails</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Buying Type</Label>
                      <p className="font-medium capitalize">{buyingType}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Objective</Label>
                      <p className="font-medium">{objectiveConfig?.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeLevel === 'adset' && (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Anzeigengruppen-Einstellungen sind noch nicht verfügbar.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Anzeigengruppe</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Hier werden Targeting, Budget und Zeitplan konfiguriert.
                </CardContent>
              </Card>
            </div>
          )}

          {activeLevel === 'ad' && (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Anzeigen-Einstellungen sind noch nicht verfügbar.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Anzeige</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Hier werden Creatives, Texte und Call-to-Actions konfiguriert.
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
