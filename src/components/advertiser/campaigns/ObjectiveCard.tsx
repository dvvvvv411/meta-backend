import { LucideIcon } from 'lucide-react';
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
    <div className="bg-background rounded-xl p-4 border w-full h-full flex flex-col">
      {/* Square icon with rounded corners */}
      <div className="flex flex-col items-start mb-4">
        <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center mb-3">
          <Icon className="h-7 w-7 text-foreground" />
        </div>
        <h3 className="font-medium text-lg text-foreground">{objective.label}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground text-left mb-4">
        {objective.description}
      </p>

      {/* Good for list as keyword tags */}
      <div className="flex-1 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Good for:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {objective.goodFor.map((item, index) => (
            <span 
              key={index} 
              className="bg-muted text-foreground text-xs px-2 py-1 rounded-md"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
