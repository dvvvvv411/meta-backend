import { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DEPOSIT_FEE_PERCENT, 
  EXCHANGE_RATES, 
  MIN_DEPOSIT_EUR, 
  MAX_DEPOSIT_EUR 
} from '@/lib/crypto-config';

interface AmountInputProps {
  selectedCoin: string;
  eurAmount: number;
  coinAmount: number;
  onEurChange: (amount: number) => void;
  onCoinChange: (amount: number) => void;
}

export function AmountInput({
  selectedCoin,
  eurAmount,
  coinAmount,
  onEurChange,
  onCoinChange,
}: AmountInputProps) {
  const [activeField, setActiveField] = useState<'eur' | 'coin'>('eur');
  
  const exchangeRate = EXCHANGE_RATES[selectedCoin] || 1;
  const feeAmount = coinAmount * (DEPOSIT_FEE_PERCENT / 100);
  const netCoinAmount = coinAmount - feeAmount;
  const netEurAmount = eurAmount * (1 - DEPOSIT_FEE_PERCENT / 100);

  const handleEurChange = (value: string) => {
    const eur = parseFloat(value) || 0;
    onEurChange(eur);
    onCoinChange(eur * exchangeRate);
  };

  const handleCoinChange = (value: string) => {
    const coin = parseFloat(value) || 0;
    onCoinChange(coin);
    onEurChange(coin / exchangeRate);
  };

  const formatCoinAmount = (amount: number) => {
    if (selectedCoin === 'BTC') return amount.toFixed(6);
    if (selectedCoin === 'ETH') return amount.toFixed(5);
    return amount.toFixed(2);
  };

  const isValidAmount = eurAmount >= MIN_DEPOSIT_EUR && eurAmount <= MAX_DEPOSIT_EUR;

  return (
    <div className="space-y-4">
      <Label>2. Betrag eingeben</Label>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Label className="text-xs text-muted-foreground mb-1 block">Betrag in EUR</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="z.B. 500"
              value={eurAmount || ''}
              onChange={(e) => handleEurChange(e.target.value)}
              onFocus={() => setActiveField('eur')}
              className="pr-10"
              min={MIN_DEPOSIT_EUR}
              max={MAX_DEPOSIT_EUR}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
          </div>
        </div>
        
        <ArrowLeftRight className="h-5 w-5 text-muted-foreground shrink-0 rotate-90 sm:rotate-0" />
        
        <div className="flex-1 w-full">
          <Label className="text-xs text-muted-foreground mb-1 block">Betrag in {selectedCoin}</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="z.B. 545"
              value={coinAmount || ''}
              onChange={(e) => handleCoinChange(e.target.value)}
              onFocus={() => setActiveField('coin')}
              className="pr-16"
              step={selectedCoin === 'BTC' ? '0.000001' : selectedCoin === 'ETH' ? '0.00001' : '0.01'}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {selectedCoin}
            </span>
          </div>
        </div>
      </div>

      {eurAmount > 0 && (
        <>
          {!isValidAmount && (
            <p className="text-sm text-destructive">
              {eurAmount < MIN_DEPOSIT_EUR 
                ? `Mindestbetrag: ${MIN_DEPOSIT_EUR}€`
                : `Maximalbetrag: ${MAX_DEPOSIT_EUR.toLocaleString('de-DE')}€`
              }
            </p>
          )}

          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bruttobetrag:</span>
                <span className="font-medium">{formatCoinAmount(coinAmount)} {selectedCoin}</span>
              </div>
              <div className="flex justify-between text-destructive/80">
                <span>Gebühr ({DEPOSIT_FEE_PERCENT}%):</span>
                <span>- {formatCoinAmount(feeAmount)} {selectedCoin}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Nettogutschrift:</span>
                <span className="text-primary">
                  {formatCoinAmount(netCoinAmount)} {selectedCoin} (≈ {netEurAmount.toFixed(2)}€)
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
