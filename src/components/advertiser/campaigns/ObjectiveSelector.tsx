import { Eye, MousePointerClick, MessageCircle, UserPlus, Smartphone, ShoppingCart, LucideIcon } from 'lucide-react';
import { BuyingType, CampaignObjective } from './CreateCampaignModal';
import { ObjectiveCard } from './ObjectiveCard';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ObjectiveConfig {
  id: CampaignObjective;
  label: string;
  description: string;
  availableFor: BuyingType[];
  goodFor: string[];
  icon: LucideIcon;
  color: string;
}

export const CAMPAIGN_OBJECTIVES: ObjectiveConfig[] = [
  {
    id: 'awareness',
    label: 'Awareness',
    description: 'Show your ads to people who are most likely to remember them.',
    availableFor: ['auction', 'reservation'],
    goodFor: ['Reach', 'Brand awareness', 'Video views'],
    icon: Eye,
    color: 'bg-blue-500',
  },
  {
    id: 'traffic',
    label: 'Traffic',
    description: 'Send people to a destination, like your website, app, Instagram profile or Facebook event.',
    availableFor: ['auction'],
    goodFor: ['Link clicks', 'Landing page views', 'Instagram profile visits', 'Messenger, Instagram and WhatsApp', 'Calls'],
    icon: MousePointerClick,
    color: 'bg-green-500',
  },
  {
    id: 'engagement',
    label: 'Engagement',
    description: 'Get more messages, purchases through messaging, video views, post engagement, Page likes or event responses.',
    availableFor: ['auction', 'reservation'],
    goodFor: ['Messenger, Instagram and WhatsApp', 'Video views', 'Post engagement', 'Conversions', 'Calls'],
    icon: MessageCircle,
    color: 'bg-violet-500',
  },
  {
    id: 'leads',
    label: 'Leads',
    description: 'Collect leads for your business or brand.',
    availableFor: ['auction'],
    goodFor: ['Website and instant forms', 'Instant forms', 'Messenger, Instagram and WhatsApp', 'Conversions', 'Calls'],
    icon: UserPlus,
    color: 'bg-orange-500',
  },
  {
    id: 'app_promotion',
    label: 'App promotion',
    description: 'Find new people to install your app and continue using it.',
    availableFor: ['auction'],
    goodFor: ['App installs', 'App events'],
    icon: Smartphone,
    color: 'bg-pink-500',
  },
  {
    id: 'sales',
    label: 'Sales',
    description: 'Find people likely to purchase your product or service.',
    availableFor: ['auction'],
    goodFor: ['Conversions', 'Catalog sales', 'Messenger, Instagram and WhatsApp', 'Calls'],
    icon: ShoppingCart,
    color: 'bg-emerald-500',
  },
];

interface ObjectiveSelectorProps {
  buyingType: BuyingType;
  selectedObjective: CampaignObjective;
  onSelectObjective: (objective: CampaignObjective) => void;
}

export function ObjectiveSelector({ buyingType, selectedObjective, onSelectObjective }: ObjectiveSelectorProps) {
  const availableObjectives = CAMPAIGN_OBJECTIVES.filter(obj => 
    obj.availableFor.includes(buyingType)
  );

  const selectedConfig = CAMPAIGN_OBJECTIVES.find(obj => obj.id === selectedObjective);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 border rounded-xl p-4 bg-muted/30 lg:h-[450px]">
      {/* Radio options - passt sich auf Mobile an Inhalt an */}
      <div className="space-y-1">
        <RadioGroup value={selectedObjective} onValueChange={(v) => onSelectObjective(v as CampaignObjective)}>
          {availableObjectives.map((obj) => (
            <div
              key={obj.id}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedObjective === obj.id
                  ? 'bg-blue-50'
                  : 'hover:bg-muted'
              }`}
              onClick={() => onSelectObjective(obj.id)}
            >
              <RadioGroupItem value={obj.id} id={obj.id} />
              <Label htmlFor={obj.id} className="flex items-center gap-2 cursor-pointer">
                <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center">
                  <obj.icon className="h-4 w-4 text-foreground" />
                </div>
                {obj.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Details card - auf Mobile unterhalb der Liste */}
      <div className="flex items-stretch">
        {selectedConfig && (
          <ObjectiveCard objective={selectedConfig} />
        )}
      </div>
    </div>
  );
}
