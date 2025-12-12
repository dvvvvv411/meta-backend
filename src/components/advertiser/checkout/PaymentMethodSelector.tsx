import { Wallet, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaymentMethod = 'balance' | 'crypto';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  balanceEur: number;
  requiredAmount: number;
}

export function PaymentMethodSelector({ 
  selected, 
  onSelect, 
  balanceEur,
  requiredAmount 
}: PaymentMethodSelectorProps) {
  const hasSufficientBalance = balanceEur >= requiredAmount;

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => hasSufficientBalance && onSelect('balance')}
        disabled={!hasSufficientBalance}
        className={cn(
          "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
          !hasSufficientBalance 
            ? "border-muted bg-muted/30 cursor-not-allowed opacity-60"
            : selected === 'balance'
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
        )}
      >
        <Wallet className={cn(
          "h-6 w-6",
          hasSufficientBalance ? "text-primary" : "text-muted-foreground"
        )} />
        <div className="text-center">
          <p className={cn(
            "font-medium",
            hasSufficientBalance ? "text-foreground" : "text-muted-foreground"
          )}>
            Von Guthaben
          </p>
          <p className={cn(
            "text-xs",
            hasSufficientBalance ? "text-primary font-medium" : "text-muted-foreground"
          )}>
            {balanceEur.toFixed(2)} € verfügbar
          </p>
        </div>
        {selected === 'balance' && hasSufficientBalance && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
            Aktiv
          </span>
        )}
        {!hasSufficientBalance && (
          <span className="absolute -top-2 -right-2 bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">
            Nicht genug
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => onSelect('crypto')}
        className={cn(
          "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
          selected === 'crypto'
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <Coins className="h-6 w-6 text-primary" />
        <div className="text-center">
          <p className="font-medium text-foreground">Krypto</p>
          <p className="text-xs text-muted-foreground">USDT, BTC, ETH...</p>
        </div>
        {selected === 'crypto' && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
            Aktiv
          </span>
        )}
      </button>
    </div>
  );
}
