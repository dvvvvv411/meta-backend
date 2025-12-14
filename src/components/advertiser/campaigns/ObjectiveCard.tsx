import { LucideIcon, Check } from 'lucide-react';
import { CampaignObjective } from './CreateCampaignModal';

interface ObjectiveConfig {
  id: CampaignObjective;
  label: string;
  description: string;
  goodFor: string[];
  icon: LucideIcon;
  color: string;
}

interface ObjectiveCardProps {
  objective: ObjectiveConfig;
}

export function ObjectiveCard({ objective }: ObjectiveCardProps) {
  const Icon = objective.icon;

  return (
    <div className="bg-background rounded-xl p-4 border w-full">
      {/* Circular icon */}
      <div className="flex flex-col items-center mb-4">
        <div className={`h-16 w-16 rounded-full ${objective.color} flex items-center justify-center mb-3 shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-semibold text-lg text-foreground">{objective.label}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground text-center mb-4">
        {objective.description}
      </p>

      {/* Good for list */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Good for:
        </p>
        <ul className="space-y-1">
          {objective.goodFor.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-foreground">
              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
