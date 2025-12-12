import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DemoTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Info className="h-4 w-4" />
            <span className="sr-only">Demo-Hinweis</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p className="text-sm">
            Dies ist aktuell eine Demo-UI — vollständige Funktionen folgen in Kürze.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
