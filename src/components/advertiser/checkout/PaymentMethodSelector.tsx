import { CreditCard, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaymentMethod = 'crypto' | 'fiat';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled
        className={cn(
          "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
          "border-muted bg-muted/30 cursor-not-allowed opacity-60"
        )}
      >
        <CreditCard className="h-6 w-6 text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium text-muted-foreground">Fiat (EUR)</p>
          <p className="text-xs text-muted-foreground">Kreditkarte, SEPA</p>
        </div>
        <span className="absolute -top-2 -right-2 bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">
          Bald
        </span>
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
          <p className="font-medium text-foreground">Krypto (USDT)</p>
          <p className="text-xs text-muted-foreground">TRC-20, ERC-20</p>
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
