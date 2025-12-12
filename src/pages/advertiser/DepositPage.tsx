import { useState } from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAdvertiserAccounts } from '@/hooks/useAdvertiserAccounts';
import { useDeposits } from '@/hooks/useDeposits';
import { BalanceOverview } from '@/components/advertiser/deposit/BalanceOverview';
import { CoinSelector } from '@/components/advertiser/deposit/CoinSelector';
import { AmountInput } from '@/components/advertiser/deposit/AmountInput';
import { WalletDisplay } from '@/components/advertiser/deposit/WalletDisplay';
import { PaymentStatus } from '@/components/advertiser/deposit/PaymentStatus';
import { TransactionHistory } from '@/components/advertiser/deposit/TransactionHistory';
import { MIN_DEPOSIT_EUR, MAX_DEPOSIT_EUR, EXCHANGE_RATES } from '@/lib/crypto-config';

export default function DepositPage() {
  const [selectedCoin, setSelectedCoin] = useState('USDT');
  const [eurAmount, setEurAmount] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);
  
  const { toast } = useToast();
  const { totalBalanceEur, totalBalanceUsdt } = useAdvertiserAccounts();
  const { deposits, pendingDeposits, createDeposit } = useDeposits();

  const handleCoinChange = (coin: string) => {
    setSelectedCoin(coin);
    // Recalculate coin amount based on new exchange rate
    const newRate = EXCHANGE_RATES[coin] || 1;
    setCoinAmount(eurAmount * newRate);
  };

  const isValidAmount = eurAmount >= MIN_DEPOSIT_EUR && eurAmount <= MAX_DEPOSIT_EUR;

  const handlePaymentInitiated = async () => {
    if (!isValidAmount) {
      toast({
        title: 'Ungültiger Betrag',
        description: `Bitte gib einen Betrag zwischen ${MIN_DEPOSIT_EUR}€ und ${MAX_DEPOSIT_EUR.toLocaleString('de-DE')}€ ein.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      await createDeposit.mutateAsync({
        coinType: selectedCoin,
        grossAmount: coinAmount,
        eurAmount: eurAmount,
      });

      toast({
        title: 'Einzahlung wird geprüft',
        description: `Wir prüfen deine ${selectedCoin}-Transaktion. Dies kann einige Minuten dauern.`,
      });

      // Reset form
      setEurAmount(0);
      setCoinAmount(0);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Die Einzahlung konnte nicht erstellt werden.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Guthaben einzahlen</h1>
        <p className="text-muted-foreground mt-1">
          Lade dein Konto mit Kryptowährung auf.
        </p>
      </div>

      {/* Current Balance */}
      <BalanceOverview balanceEur={totalBalanceEur} balanceUsdt={totalBalanceUsdt} />

      {/* Pending Deposits */}
      {pendingDeposits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Ausstehende Einzahlungen</h2>
          {pendingDeposits.map((deposit) => (
            <PaymentStatus key={deposit.id} deposit={deposit} />
          ))}
        </div>
      )}

      <Separator />

      {/* Deposit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Neue Einzahlung</CardTitle>
          <CardDescription>
            Wähle eine Kryptowährung und den Betrag, den du einzahlen möchtest.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CoinSelector 
            selectedCoin={selectedCoin} 
            onCoinChange={handleCoinChange} 
          />

          <AmountInput
            selectedCoin={selectedCoin}
            eurAmount={eurAmount}
            coinAmount={coinAmount}
            onEurChange={setEurAmount}
            onCoinChange={setCoinAmount}
          />

          <WalletDisplay
            selectedCoin={selectedCoin}
            onPaymentInitiated={handlePaymentInitiated}
            isValid={isValidAmount && eurAmount > 0}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Transaction History */}
      <TransactionHistory deposits={deposits} />

      {/* Security Note */}
      <Card className="bg-muted/30 border-muted">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Sicherheitshinweis</p>
              <p className="mt-1">
                Zahlungen sind final und nicht erstattbar. Bei Problemen oder Fragen 
                kontaktiere unseren Support unter{' '}
                <a href="mailto:support@example.com" className="text-primary hover:underline">
                  support@example.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
