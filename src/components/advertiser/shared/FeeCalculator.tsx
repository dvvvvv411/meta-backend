import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeeCalculatorProps {
  grossAmount: number;
  feePercent?: number;
  className?: string;
}

export function FeeCalculator({ grossAmount, feePercent = 2, className }: FeeCalculatorProps) {
  const feeAmount = grossAmount * (feePercent / 100);
  const netAmount = grossAmount - feeAmount;
  const isValid = grossAmount >= 10;

  if (!isValid) return null;

  return (
    <div className={cn(
      "rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-4 space-y-3",
      "backdrop-blur-sm",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Einzahlung</span>
        <span className="font-medium">{grossAmount.toFixed(2)} €</span>
      </div>
      
      {/* Fee */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Gebühr ({feePercent}%)</span>
        <span className="text-destructive font-medium">-{feeAmount.toFixed(2)} €</span>
      </div>
      
      {/* Divider */}
      <div className="border-t border-border/50" />
      
      {/* Net Amount */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">Gutschrift</span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">{netAmount.toFixed(2)} €</span>
          <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="h-3 w-3 text-success" />
          </div>
        </div>
      </div>
    </div>
  );
}
