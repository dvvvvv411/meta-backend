import { Download, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ExportButtonsProps {
  disabled?: boolean;
}

export function ExportButtons({ disabled = false }: ExportButtonsProps) {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={disabled}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                CSV Export
              </Button>
            </span>
          </TooltipTrigger>
          {disabled && (
            <TooltipContent>
              <p>Export ist im Demo-Modus nicht verfügbar</p>
            </TooltipContent>
          )}
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={disabled}
                className="gap-2"
              >
                <Image className="h-4 w-4" />
                PNG Snapshot
              </Button>
            </span>
          </TooltipTrigger>
          {disabled && (
            <TooltipContent>
              <p>Export ist im Demo-Modus nicht verfügbar</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
