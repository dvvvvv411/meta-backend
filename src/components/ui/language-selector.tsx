import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { GermanFlag, BritishFlag } from '@/components/ui/flag-icons';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  showLabel?: boolean;
  className?: string;
}

const languages: { code: Language; label: string; shortLabel: string }[] = [
  { code: 'de', label: 'Deutsch', shortLabel: 'DE' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
];

const FlagIcon = ({ code, className }: { code: Language; className?: string }) => {
  if (code === 'de') return <GermanFlag className={className} />;
  return <BritishFlag className={className} />;
};

export function LanguageSelector({ variant = 'outline', showLabel = false, className }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  
  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size="sm" 
          className={cn(
            "gap-2 px-3 rounded-full border-border/60 hover:border-primary/50 hover:bg-accent/50 transition-all shadow-sm",
            className
          )}
        >
          <FlagIcon code={currentLang.code} className="w-7 h-5" />
          <span className="text-xs font-medium">{currentLang.shortLabel}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              language === lang.code && 'bg-accent'
            )}
          >
            <FlagIcon code={lang.code} className="w-7 h-5" />
            <span className="flex-1">{lang.label}</span>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
