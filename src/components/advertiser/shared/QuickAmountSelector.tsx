import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickAmountSelectorProps {
  amounts: number[];
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
}

export function QuickAmountSelector({
  amounts,
  selectedAmount,
  onSelect,
}: QuickAmountSelectorProps) {
  const { language } = useLanguage();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {amounts.map((amount) => (
        <button
          key={amount}
          onClick={() => onSelect(amount)}
          className={cn(
            "py-4 px-4 rounded-xl text-lg font-bold transition-all duration-200",
            "border-2 hover:scale-[1.02] active:scale-[0.98]",
            selectedAmount === amount
              ? "border-primary bg-primary/10 text-primary shadow-md"
              : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          {formatCurrency(amount)}
        </button>
      ))}
    </div>
  );
}
