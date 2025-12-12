import { cn } from '@/lib/utils';

interface QuickAmountSelectorProps {
  amounts: number[];
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
  customAmount?: string;
  onCustomAmountChange?: (value: string) => void;
}

export function QuickAmountSelector({
  amounts,
  selectedAmount,
  onSelect,
  customAmount,
  onCustomAmountChange,
}: QuickAmountSelectorProps) {
  const isCustomSelected = customAmount && parseFloat(customAmount) > 0 && !amounts.includes(parseFloat(customAmount));

  return (
    <div className="grid grid-cols-4 gap-2">
      {amounts.map((amount) => (
        <button
          key={amount}
          onClick={() => onSelect(amount)}
          className={cn(
            "py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200",
            "border-2 hover:scale-[1.02] active:scale-[0.98]",
            selectedAmount === amount
              ? "border-primary bg-primary text-primary-foreground shadow-md"
              : "border-border/50 bg-muted/30 text-foreground hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          {amount}€
        </button>
      ))}
    </div>
  );
}
