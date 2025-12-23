import { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DEPOSIT_FEE_PERCENT, 
  EXCHANGE_RATES, 
  MIN_DEPOSIT_USD, 
  MAX_DEPOSIT_USD 
} from '@/lib/crypto-config';
import { useLanguage } from '@/contexts/LanguageContext';

interface AmountInputProps {
  selectedCoin: string;
  usdAmount: number;
  coinAmount: number;
  onUsdChange: (amount: number) => void;
  onCoinChange: (amount: number) => void;
}

export function AmountInput({
  selectedCoin,
  usdAmount,
  coinAmount,
  onUsdChange,
  onCoinChange,
}: AmountInputProps) {
  const { language } = useLanguage();
  const [activeField, setActiveField] = useState<'usd' | 'coin'>('usd');
  
  const exchangeRate = EXCHANGE_RATES[selectedCoin] || 1;
  const feeAmount = coinAmount * (DEPOSIT_FEE_PERCENT / 100);
  const netCoinAmount = coinAmount - feeAmount;
  const netUsdAmount = usdAmount * (1 - DEPOSIT_FEE_PERCENT / 100);

  const handleUsdChange = (value: string) => {
    const usd = parseFloat(value) || 0;
    onUsdChange(usd);
    onCoinChange(usd * exchangeRate);
  };

  const handleCoinChange = (value: string) => {
    const coin = parseFloat(value) || 0;
    onCoinChange(coin);
    onUsdChange(coin / exchangeRate);
  };

  const formatCoinAmount = (amount: number) => {
    if (selectedCoin === 'BTC') return amount.toFixed(6);
    if (selectedCoin === 'ETH') return amount.toFixed(5);
    return amount.toFixed(2);
  };

  const isValidAmount = usdAmount >= MIN_DEPOSIT_USD && usdAmount <= MAX_DEPOSIT_USD;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <Label>2. {language === 'de' ? 'Betrag eingeben' : 'Enter amount'}</Label>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Label className="text-xs text-muted-foreground mb-1 block">
            {language === 'de' ? 'Betrag in USD' : 'Amount in USD'}
          </Label>
          <div className="relative">
            <Input
              type="number"
              placeholder={language === 'de' ? 'z.B. 500' : 'e.g. 500'}
              value={usdAmount || ''}
              onChange={(e) => handleUsdChange(e.target.value)}
              onFocus={() => setActiveField('usd')}
              className="pr-10"
              min={MIN_DEPOSIT_USD}
              max={MAX_DEPOSIT_USD}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          </div>
        </div>
        
        <ArrowLeftRight className="h-5 w-5 text-muted-foreground shrink-0 rotate-90 sm:rotate-0" />
        
        <div className="flex-1 w-full">
          <Label className="text-xs text-muted-foreground mb-1 block">
            {language === 'de' ? 'Betrag in' : 'Amount in'} {selectedCoin}
          </Label>
          <div className="relative">
            <Input
              type="number"
              placeholder={language === 'de' ? 'z.B. 545' : 'e.g. 545'}
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

      {usdAmount > 0 && (
        <>
          {!isValidAmount && (
            <p className="text-sm text-destructive">
              {usdAmount < MIN_DEPOSIT_USD 
                ? `${language === 'de' ? 'Mindestbetrag' : 'Minimum'}: $${MIN_DEPOSIT_USD}`
                : `${language === 'de' ? 'Maximalbetrag' : 'Maximum'}: $${MAX_DEPOSIT_USD.toLocaleString('en-US')}`
              }
            </p>
          )}

          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'de' ? 'Bruttobetrag' : 'Gross amount'}:</span>
                <span className="font-medium">{formatCoinAmount(coinAmount)} {selectedCoin}</span>
              </div>
              <div className="flex justify-between text-destructive/80">
                <span>{language === 'de' ? 'Gebühr' : 'Fee'} ({DEPOSIT_FEE_PERCENT}%):</span>
                <span>- {formatCoinAmount(feeAmount)} {selectedCoin}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>{language === 'de' ? 'Nettogutschrift' : 'Net credit'}:</span>
                <span className="text-primary">
                  {formatCoinAmount(netCoinAmount)} {selectedCoin} (≈ {formatCurrency(netUsdAmount)})
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
