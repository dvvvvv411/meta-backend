import { useState, useEffect } from 'react';
import { Wallet, AlertCircle, Check, Loader2 } from 'lucide-react';
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
import { useUsdtRate } from '@/hooks/useUsdtRate';
import { TetherIcon, ERC20Icon } from '@/lib/crypto-icons';
import { useLanguage } from '@/contexts/LanguageContext';

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { balanceEur, invalidateBalance } = useUserBalance();
  const { createWithdrawalRequest } = useWithdrawals();
  const { eurToUsdt } = useUsdtRate();
  
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

  const isValidWalletAddress = walletAddress.trim().length > 0;
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
        title: t.deposit.withdrawalRequestCreated,
        description: t.deposit.withdrawalRequestCreatedDesc,
      });
    } catch (error) {
      toast({
        title: t.common.error,
        description: error instanceof Error ? error.message : t.deposit.withdrawalError,
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
          {/* USDT + ERC20 Badge Header */}
          <div className="mx-auto flex items-center justify-center mb-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#26A17B]/10 flex items-center justify-center">
                <TetherIcon size={40} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-border/50">
                <ERC20Icon size={18} />
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl">
            {isSuccess ? t.deposit.requestCreated : t.deposit.withdrawModalTitle}
          </DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? t.deposit.requestSubmitted
              : `${t.deposit.withdrawFundsDesc.split('USDT')[0]}USDT ${t.deposit.ethereumNetwork}`
            }
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-5 text-center py-4">
            {/* Success with USDT Branding */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#26A17B]/10">
                <TetherIcon size={48} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <Check className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div>
              <p className="text-lg font-semibold">{t.deposit.withdrawalRequested}</p>
              <p className="text-2xl font-bold text-[#26A17B] mt-2">
                ≈ {eurToUsdt(numAmount).toFixed(2)} USDT
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t.deposit.toYourWallet}
                <br />
                {t.deposit.processingTimeNote}
              </p>
            </div>
            
            <Button 
              className="w-full h-12 gradient-bg"
              onClick={() => onOpenChange(false)}
            >
              {t.common.done}
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Current Balance */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
              <p className="text-sm text-muted-foreground">{t.deposit.availableBalance}</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {balanceEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </p>
              <p className="text-sm text-[#26A17B] font-medium mt-1">
                ≈ {eurToUsdt(balanceEur).toLocaleString('de-DE', { minimumFractionDigits: 2 })} USDT
              </p>
            </div>

            {/* Wallet Address Input */}
            <div className="space-y-2">
              <Label htmlFor="wallet" className="text-sm font-medium flex items-center gap-2">
                <TetherIcon size={16} />
                {t.deposit.usdtWallet}
              </Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="wallet"
                  type="text"
                  placeholder={t.deposit.walletPlaceholder}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="pl-10 font-mono text-sm"
                />
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount" className="text-sm font-medium">
                  {t.deposit.withdrawalAmount}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-primary hover:text-primary/80"
                  onClick={handleWithdrawAll}
                  disabled={balanceEur <= 0}
                >
                  {t.deposit.withdrawAll}
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
              {numAmount > 0 && (
                <p className="text-sm text-[#26A17B] font-medium">
                  ≈ {eurToUsdt(numAmount).toFixed(2)} USDT
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {t.deposit.minWithdrawal} • {t.deposit.maxWithdrawal} {maxAmount.toFixed(2)}€
              </p>
              {amount && !isValidAmount && numAmount > maxAmount && (
                <p className="text-xs text-destructive">
                  {t.deposit.exceedsBalance}
                </p>
              )}
            </div>

            {/* Info Alert with Network Badge */}
            <Alert className="bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <AlertDescription className="text-blue-800 text-sm">
                    {t.deposit.processingTime}
                  </AlertDescription>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/80 border border-blue-200">
                      <ERC20Icon size={14} />
                      <span className="text-xs font-medium text-blue-800">{t.deposit.ethereumNetwork}</span>
                    </div>
                  </div>
                </div>
              </div>
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
                  {t.deposit.processing}
                </>
              ) : (
                t.deposit.submitWithdrawal
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
