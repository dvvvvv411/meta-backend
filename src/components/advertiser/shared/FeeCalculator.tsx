import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeeCalculatorProps {
  grossAmount: number;
  feePercent?: number;
  className?: string;
}

export function FeeCalculator({ grossAmount, feePercent = 2, className }: FeeCalculatorProps) {
  const { t, language } = useLanguage();
  const feeAmount = grossAmount * (feePercent / 100);
  const netAmount = grossAmount - feeAmount;
  const isValid = grossAmount >= 10;

  if (!isValid) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  return (
    <div className={cn(
      "rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-4 space-y-3",
      "backdrop-blur-sm",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t.deposit.filterDeposit}</span>
        <span className="font-medium">{formatCurrency(grossAmount)}</span>
      </div>
      
      {/* Fee */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{language === 'de' ? 'Gebühr' : 'Fee'} ({feePercent}%)</span>
        <span className="text-destructive font-medium">-{formatCurrency(feeAmount)}</span>
      </div>
      
      {/* Divider */}
      <div className="border-t border-border/50" />
      
      {/* Net Amount */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{language === 'de' ? 'Gutschrift' : 'Credit'}</span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">{formatCurrency(netAmount)}</span>
          <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="h-3 w-3 text-success" />
          </div>
        </div>
      </div>
    </div>
  );
}
