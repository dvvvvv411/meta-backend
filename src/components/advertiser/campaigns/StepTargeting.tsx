import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DemoTooltip } from './DemoTooltip';

interface StepTargetingProps {
  location: string;
  ageRange: string;
  gender: string;
  interests: string;
  onLocationChange: (value: string) => void;
  onAgeRangeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onInterestsChange: (value: string) => void;
}

const LOCATIONS = [
  { value: 'de', label: '🇩🇪 Deutschland' },
  { value: 'at', label: '🇦🇹 Österreich' },
  { value: 'ch', label: '🇨🇭 Schweiz' },
  { value: 'dach', label: '🌍 DACH Region' },
  { value: 'eu', label: '🇪🇺 Europa' },
];

const AGE_RANGES = [
  { value: '18-24', label: '18-24 Jahre' },
  { value: '25-34', label: '25-34 Jahre' },
  { value: '35-44', label: '35-44 Jahre' },
  { value: '45-54', label: '45-54 Jahre' },
  { value: '55-65', label: '55-65 Jahre' },
  { value: '18-65+', label: '18-65+ (Alle)' },
];

const GENDERS = [
  { value: 'all', label: 'Alle Geschlechter' },
  { value: 'male', label: 'Männlich' },
  { value: 'female', label: 'Weiblich' },
];

const INTERESTS = [
  { value: 'ecommerce', label: '🛒 E-Commerce' },
  { value: 'tech', label: '💻 Technologie' },
  { value: 'fashion', label: '👗 Mode & Lifestyle' },
  { value: 'sports', label: '⚽ Sport & Fitness' },
  { value: 'travel', label: '✈️ Reisen' },
  { value: 'food', label: '🍕 Food & Gastronomie' },
];

export function StepTargeting({
  location,
  ageRange,
  gender,
  interests,
  onLocationChange,
  onAgeRangeChange,
  onGenderChange,
  onInterestsChange,
}: StepTargetingProps) {
  // Mock reach calculation based on selections
  const getReachEstimate = () => {
    let baseReach = 3500000;
    if (location === 'de') baseReach = 2000000;
    if (location === 'at') baseReach = 500000;
    if (location === 'ch') baseReach = 400000;
    if (ageRange !== '18-65+') baseReach *= 0.3;
    if (gender !== 'all') baseReach *= 0.5;
    
    const minReach = Math.floor(baseReach * 0.6);
    const maxReach = Math.floor(baseReach * 1.2);
    
    return { min: minReach, max: maxReach };
  };

  const reach = getReachEstimate();
  const reachPercentage = Math.min(100, Math.max(20, (reach.max / 5000000) * 100));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <Card className="animate-in fade-in-50 slide-in-from-right-5 duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          Zielgruppe definieren
        </CardTitle>
        <DemoTooltip />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Location */}
          <div className="space-y-2">
            <Label>Standort</Label>
            <Select value={location} onValueChange={onLocationChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Standort wählen" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div className="space-y-2">
            <Label>Altersgruppe</Label>
            <Select value={ageRange} onValueChange={onAgeRangeChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Alter wählen" />
              </SelectTrigger>
              <SelectContent>
                {AGE_RANGES.map((age) => (
                  <SelectItem key={age.value} value={age.value}>
                    {age.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Geschlecht</Label>
            <Select value={gender} onValueChange={onGenderChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Geschlecht wählen" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Interessen</Label>
            <Select value={interests} onValueChange={onInterestsChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Interessen wählen" />
              </SelectTrigger>
              <SelectContent>
                {INTERESTS.map((interest) => (
                  <SelectItem key={interest.value} value={interest.value}>
                    {interest.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reach Estimate */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              👁️ Geschätzte Reichweite
            </span>
            <span className="text-sm font-semibold text-primary">
              {formatNumber(reach.min)} - {formatNumber(reach.max)} Personen
            </span>
          </div>
          <Progress value={reachPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Basierend auf deinen Targeting-Einstellungen. Die tatsächliche Reichweite kann variieren.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
