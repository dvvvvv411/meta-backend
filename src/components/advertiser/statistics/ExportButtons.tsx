import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExportButtonsProps {
  disabled?: boolean;
}

export function ExportButtons({ disabled = false }: ExportButtonsProps) {
  const { t, language } = useLanguage();

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
                {t.statistics.exportCsv}
              </Button>
            </span>
          </TooltipTrigger>
          {disabled && (
            <TooltipContent>
              <p>{t.statistics.noDataToExport}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
