import { Clock, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Deposit } from '@/hooks/useDeposits';
import { getCoinBySymbol } from '@/lib/crypto-config';

interface PaymentStatusProps {
  deposit: Deposit;
}

export function PaymentStatus({ deposit }: PaymentStatusProps) {
  const coinConfig = getCoinBySymbol(deposit.coin_type);
  const progress = (deposit.confirmations / deposit.confirmations_required) * 100;
  const isComplete = deposit.status === 'completed';

  const formatCoinAmount = (amount: number, coin: string) => {
    if (coin === 'BTC') return amount.toFixed(6);
    if (coin === 'ETH') return amount.toFixed(5);
    return amount.toFixed(2);
  };

  return (
    <Card className={isComplete ? 'border-green-500/50 bg-green-500/5' : 'border-yellow-500/50 bg-yellow-500/5'}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isComplete ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Zahlung bestätigt
            </>
          ) : (
            <>
              <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
              Zahlung wird geprüft...
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confirmation Progress */}
        {!isComplete && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bestätigungen</span>
              <span className="font-medium">
                {deposit.confirmations} von {deposit.confirmations_required}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between items-center">
              {Array.from({ length: deposit.confirmations_required }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  {i < deposit.confirmations ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : i === deposit.confirmations ? (
                    <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/30" />
                  )}
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Coin:</span>
            <span className="font-medium">{deposit.coin_type}</span>
          </div>
          {deposit.gross_amount && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bruttobetrag:</span>
              <span>{formatCoinAmount(deposit.gross_amount, deposit.coin_type)} {deposit.coin_type}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Geschätzte Gutschrift:</span>
            <span className="font-medium text-primary">
              ~{deposit.amount.toFixed(2)}€
            </span>
          </div>
          {!isComplete && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Erwartete Zeit:</span>
              <span>5-10 Minuten</span>
            </div>
          )}
        </div>

        {deposit.tx_hash && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
            <code className="text-xs font-mono break-all">{deposit.tx_hash}</code>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
