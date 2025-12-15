import { useState, useEffect } from 'react';
import { Wallet, ArrowUpFromLine, AlertCircle, Check, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useUserBalance } from '@/hooks/useUserBalance';
import { useWithdrawals } from '@/hooks/useWithdrawals';

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const { toast } = useToast();
  const { balanceEur, invalidateBalance } = useUserBalance();
  const { createWithdrawalRequest } = useWithdrawals();
  
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setWalletAddress('');
      setAmount('');
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [open]);

  const numAmount = parseFloat(amount) || 0;
  const minAmount = 10;
  const maxAmount = balanceEur;

  // Validate ERC20 wallet address (0x followed by 40 hex characters)
  const isValidWalletAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
  const isValidAmount = numAmount >= minAmount && numAmount <= maxAmount;
  const canSubmit = isValidWalletAddress && isValidAmount && !isSubmitting;

  const handleWithdrawAll = () => {
    setAmount(balanceEur.toFixed(2));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    
    try {
      await createWithdrawalRequest.mutateAsync({
        amount: numAmount,
        walletAddress,
      });
      
      setIsSuccess(true);
      invalidateBalance();
      
      toast({
        title: 'Auszahlungsanfrage erstellt',
        description: 'Deine Anfrage wird innerhalb von 24-48h bearbeitet.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error instanceof Error ? error.message : 'Auszahlung konnte nicht erstellt werden',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <ArrowUpFromLine className="h-6 w-6 text-muted-foreground" />
          </div>
          <DialogTitle className="text-xl">
            {isSuccess ? 'Anfrage erstellt!' : 'Guthaben auszahlen'}
          </DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? 'Deine Auszahlungsanfrage wurde erfolgreich eingereicht'
              : 'Auszahlung via USDT (ERC20)'
            }
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-5 text-center py-4">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-emerald-100 text-emerald-600">
              <Check className="h-10 w-10" />
            </div>
            
            <div>
              <p className="text-lg font-semibold">Auszahlung beantragt!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {numAmount.toFixed(2)} € werden an deine Wallet gesendet.
                <br />
                Bearbeitungszeit: 24-48 Stunden.
              </p>
            </div>
            
            <Button 
              className="w-full h-12 gradient-bg"
              onClick={() => onOpenChange(false)}
            >
              Fertig
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Current Balance */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
              <p className="text-sm text-muted-foreground">Verfügbares Guthaben</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {balanceEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </p>
            </div>

            {/* Wallet Address Input */}
            <div className="space-y-2">
              <Label htmlFor="wallet" className="text-sm font-medium">
                USDT (ERC20) Wallet-Adresse
              </Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="wallet"
                  type="text"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="pl-10 font-mono text-sm"
                />
              </div>
              {walletAddress && !isValidWalletAddress && (
                <p className="text-xs text-destructive">
                  Bitte gib eine gültige ERC20 Wallet-Adresse ein (0x...)
                </p>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Auszahlungsbetrag
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-primary hover:text-primary/80"
                  onClick={handleWithdrawAll}
                  disabled={balanceEur <= 0}
                >
                  Alles auszahlen
                </Button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">€</span>
                <Input
                  id="amount"
                  type="number"
                  min={minAmount}
                  max={maxAmount}
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg font-semibold"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Min. {minAmount}€ • Max. {maxAmount.toFixed(2)}€
              </p>
              {amount && !isValidAmount && numAmount > maxAmount && (
                <p className="text-xs text-destructive">
                  Der Betrag übersteigt dein verfügbares Guthaben
                </p>
              )}
            </div>

            {/* Info Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                Auszahlungen werden innerhalb von 24-48 Stunden bearbeitet.
                Die Gutschrift erfolgt als USDT auf das ERC20 Netzwerk.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird bearbeitet...
                </>
              ) : (
                'Auszahlung beantragen'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}