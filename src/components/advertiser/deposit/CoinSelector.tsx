import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getCoinList, type CryptoConfig } from '@/lib/crypto-config';

interface CoinSelectorProps {
  selectedCoin: string;
  onCoinChange: (coin: string) => void;
}

export function CoinSelector({ selectedCoin, onCoinChange }: CoinSelectorProps) {
  const coins = getCoinList();

  return (
    <div className="space-y-2">
      <Label>1. Wähle deine Kryptowährung</Label>
      <Select value={selectedCoin} onValueChange={onCoinChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Kryptowährung auswählen" />
        </SelectTrigger>
        <SelectContent className="bg-background border">
          {coins.map((coin) => (
            <SelectItem key={coin.symbol} value={coin.symbol}>
              <div className="flex items-center gap-2">
                <span>{coin.icon}</span>
                <span className="font-medium">{coin.symbol}</span>
                <span className="text-muted-foreground">({coin.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
