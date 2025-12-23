import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Copy, Check, Wallet, Timer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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
import { useToast } from '@/hooks/use-toast';
import { useNowPayments } from '@/hooks/useNowPayments';
import { cn } from '@/lib/utils';
import { CurrencySearchSelector, CurrencyOption } from '@/components/advertiser/shared/CurrencySearchSelector';
import { TrustBadges, PoweredByBadge } from '@/components/advertiser/shared/TrustBadges';
import { QuickAmountSelector } from '@/components/advertiser/shared/QuickAmountSelector';
import { FeeCalculator } from '@/components/advertiser/shared/FeeCalculator';
import { PaymentStatusIndicator } from '@/components/advertiser/shared/PaymentStatusIndicator';
import { useLanguage } from '@/contexts/LanguageContext';

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'amount' | 'currency' | 'payment' | 'status';

const QUICK_AMOUNTS = [100, 250, 500, 1000];

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { createPayment, checkPaymentStatus } = useNowPayments();
  
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption | null>(null);
  const [paymentData, setPaymentData] = useState<{
    payment_id: string;
    pay_address: string;
    pay_amount: number;
    pay_currency: string;
    expires_at: string;
    net_amount: number;
    fee_amount: number;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('waiting');
  const [copied, setCopied] = useState<'amount' | 'address' | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep('amount');
      setAmount('');
      setSelectedCurrency(null);
      setPaymentData(null);
      setPaymentStatus('waiting');
      setIsPolling(false);
    }
  }, [open]);

  // Poll for payment status
  useEffect(() => {
    if (!paymentData?.payment_id || !isPolling) return;

    const interval = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(paymentData.payment_id);
        setPaymentStatus(status.payment_status);
        
        if (status.payment_status === 'finished' || status.payment_status === 'confirmed') {
          setIsPolling(false);
          setStep('status');
          toast({
            title: t.deposit.paymentSuccessful,
            description: `$${paymentData.net_amount.toFixed(2)} ${t.deposit.balanceCredited}`,
          });
        } else if (status.payment_status === 'failed' || status.payment_status === 'expired') {
          setIsPolling(false);
          setStep('status');
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [paymentData?.payment_id, isPolling, checkPaymentStatus, toast, paymentData?.net_amount, t]);

  // Countdown Timer
  useEffect(() => {
    if (!paymentData?.expires_at || step !== 'payment') return;
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(paymentData.expires_at).getTime();
      const difference = expiry - now;
      
      if (difference <= 0) {
        setTimeLeft(t.deposit.expired);
        setPaymentStatus('expired');
        setIsPolling(false);
        return;
      }
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      if (hours > 0) {
        setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [paymentData?.expires_at, step, t]);

  const numAmount = parseFloat(amount) || 0;

  const handleQuickAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleAmountSubmit = () => {
    if (isNaN(numAmount) || numAmount < 10 || numAmount > 10000) {
      toast({
        title: t.deposit.invalidAmount,
        description: t.deposit.invalidAmountDesc,
        variant: 'destructive',
      });
      return;
    }
    setStep('currency');
  };

  const handleCurrencySelect = async (currency: CurrencyOption) => {
    setSelectedCurrency(currency);
    
    try {
      const result = await createPayment.mutateAsync({
        amount_usd: numAmount,
        pay_currency: currency.id,
      });
      
      setPaymentData({
        payment_id: result.payment_id,
        pay_address: result.pay_address,
        pay_amount: result.pay_amount,
        pay_currency: result.pay_currency,
        expires_at: result.expires_at,
        net_amount: result.net_amount,
        fee_amount: result.fee_amount,
      });
      
      setIsPolling(true);
      setStep('payment');
    } catch (error) {
      toast({
        title: t.common.error,
        description: error instanceof Error ? error.message : t.deposit.paymentCreationError,
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string, type: 'amount' | 'address') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: t.common.copied,
      description: type === 'address' ? t.deposit.addressCopied : t.deposit.amountCopied,
    });
  };

  const isSuccess = paymentStatus === 'finished' || paymentStatus === 'confirmed';

  // Format pay_currency nicely (e.g., "USDTTRC20" -> "USDT (TRC20)")
  const formatPayCurrency = (currency: string) => {
    const upper = currency.toUpperCase();
    if (upper === 'USDTTRC20' || upper === 'USDT_TRC20') return 'USDT (TRC20)';
    if (upper === 'USDTERC20' || upper === 'USDT_ERC20') return 'USDT (ERC20)';
    if (upper === 'USDTBSC' || upper === 'USDT_BSC') return 'USDT (BSC)';
    if (upper === 'USDTMATIC' || upper === 'USDT_MATIC') return 'USDT (Polygon)';
    if (upper === 'USDCERC20' || upper === 'USDC_ERC20') return 'USDC (ERC20)';
    if (upper === 'BNBBSC' || upper === 'BNB_BSC') return 'BNB (BSC)';
    return upper;
  };

  const getStepTitle = () => {
    if (step === 'amount') return t.deposit.depositModalTitle;
    if (step === 'currency') return t.deposit.selectCurrency;
    if (step === 'payment') return t.deposit.makePayment;
    if (step === 'status') return isSuccess ? t.deposit.paymentSuccess : t.deposit.paymentFailedTitle;
    return '';
  };

  const getStepDescription = () => {
    if (step === 'amount') return t.deposit.secureCryptoDeposit;
    if (step === 'currency') return t.deposit.selectPreferredCurrency;
    if (step === 'payment') return t.deposit.scanQrCode;
    if (step === 'status') return isSuccess ? t.deposit.balanceUpdated : t.deposit.paymentCouldNotComplete;
    return '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mb-3">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl">
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription>
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Step: Amount */}
          {step === 'amount' && (
            <div className="space-y-6">
              {/* Quick Amount Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-center block">{t.deposit.quickSelect}</Label>
                <QuickAmountSelector
                  amounts={QUICK_AMOUNTS}
                  selectedAmount={QUICK_AMOUNTS.includes(numAmount) ? numAmount : null}
                  onSelect={handleQuickAmountSelect}
                />
              </div>

              {/* Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">{t.common.or}</span>
                </div>
              </div>

              {/* Custom Amount Input - Centered & Narrow */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-center block">{t.deposit.customAmount}</Label>
                <div className="flex justify-center">
                  <div className="relative w-48">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      min="10"
                      max="10000"
                      step="1"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 pr-4 h-14 text-2xl font-bold text-center bg-muted/30 border-border/50 focus:border-primary focus:bg-background"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {t.deposit.customAmountHint}
                </p>
              </div>
              
              {/* Fee Calculator */}
              <FeeCalculator grossAmount={numAmount} />
              
              <Button 
                className="w-full h-12 gradient-bg text-base font-semibold" 
                onClick={handleAmountSubmit}
                disabled={numAmount < 10}
              >
                {t.deposit.continueToPayment}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step: Currency */}
          {step === 'currency' && (
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep('amount')}
                className="mb-2 -ml-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> {t.common.back}
              </Button>
              
              {/* Amount Summary */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <span className="text-sm text-muted-foreground">{t.deposit.depositAmount}</span>
                <span className="font-bold text-lg">${numAmount.toFixed(2)}</span>
              </div>
              
              <CurrencySearchSelector
                onSelect={handleCurrencySelect}
                isLoading={createPayment.isPending}
                loadingCurrencyId={selectedCurrency?.id}
                amount={numAmount}
              />
            </div>
          )}

          {/* Step: Payment */}
          {step === 'payment' && paymentData && (
            <div className="space-y-5">
              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl shadow-lg">
                  <QRCodeSVG 
                    value={paymentData.pay_address} 
                    size={180}
                    level="H"
                    includeMargin
                  />
                </div>
                
                {/* Countdown Timer */}
                <div className={cn(
                  "flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono text-base font-semibold mt-3",
                  timeLeft === t.deposit.expired 
                    ? "bg-destructive/10 text-destructive border border-destructive/20"
                    : "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                )}>
                  <Timer className="h-4 w-4" />
                  <span>
                    {timeLeft === t.deposit.expired 
                      ? t.deposit.addressExpired 
                      : `${t.deposit.validFor}: ${timeLeft}`
                    }
                  </span>
                </div>
              </div>
              
              {/* Payment Details */}
              <div className="space-y-3">
                {/* Amount to pay */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{t.deposit.amountToPay}</Label>
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-border/50 bg-muted/20">
                    <span className="flex-1 font-mono text-lg font-bold">
                      {paymentData.pay_amount} {formatPayCurrency(paymentData.pay_currency)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => copyToClipboard(paymentData.pay_amount.toString(), 'amount')}
                    >
                      {copied === 'amount' ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 px-1">
                    <span>{t.deposit.youReceive}:</span>
                    <span className="font-semibold text-foreground">${paymentData.net_amount.toFixed(2)}</span>
                    <span>{t.deposit.afterFee}</span>
                  </p>
                </div>
                
                {/* Wallet Address */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{t.deposit.walletAddress}</Label>
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-border/50 bg-muted/20">
                    <span className="flex-1 font-mono text-sm break-all leading-relaxed">
                      {paymentData.pay_address}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 shrink-0"
                      onClick={() => copyToClipboard(paymentData.pay_address, 'address')}
                    >
                      {copied === 'address' ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Status Indicator */}
              <PaymentStatusIndicator status={paymentStatus} />
              
              {/* Footer Info */}
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  {t.deposit.autoBalanceUpdate}
                </p>
                <PoweredByBadge />
              </div>
            </div>
          )}

          {/* Step: Status */}
          {step === 'status' && (
            <div className="space-y-5 text-center py-4">
              <div className={cn(
                "w-20 h-20 rounded-full mx-auto flex items-center justify-center",
                isSuccess 
                  ? "bg-emerald-100 text-emerald-600" 
                  : "bg-red-100 text-red-600"
              )}>
                {isSuccess ? (
                  <Check className="h-10 w-10" />
                ) : (
                  <ArrowLeft className="h-10 w-10" />
                )}
              </div>
              
              <div>
                <p className="text-lg font-semibold">
                  {isSuccess ? t.deposit.paymentCompleted : t.deposit.paymentNotSuccessful}
                </p>
              <p className="text-sm text-muted-foreground mt-1">
                  {isSuccess 
                    ? `$${paymentData?.net_amount.toFixed(2)} ${t.deposit.balanceCredited}`
                    : t.deposit.paymentExpiredOrFailed
                  }
                </p>
              </div>
              
              <Button 
                className={cn("w-full h-12", isSuccess && "gradient-bg")}
                variant={isSuccess ? "default" : "outline"}
                onClick={() => onOpenChange(false)}
              >
                {isSuccess ? t.common.done : t.common.close}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
