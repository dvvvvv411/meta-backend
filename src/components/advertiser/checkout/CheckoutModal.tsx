import { useState, useEffect } from 'react';
import { Copy, Loader2, AlertCircle, Check, ArrowLeft, ShoppingBag, CreditCard, Coins } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNowPayments } from '@/hooks/useNowPayments';
import { cn } from '@/lib/utils';
import { CurrencySearchSelector, CurrencyOption } from '@/components/advertiser/shared/CurrencySearchSelector';
import { TrustBadges, PoweredByBadge } from '@/components/advertiser/shared/TrustBadges';
import { PaymentStatusIndicator } from '@/components/advertiser/shared/PaymentStatusIndicator';
import metaLogo from '@/assets/meta-logo.png';

const RENTAL_PRICE = 150;

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: (paymentMethod: 'balance' | 'crypto', transactionId?: string) => Promise<void>;
  isProcessing: boolean;
  balanceEur: number;
}

type Step = 'select' | 'balance-confirm' | 'crypto-currency' | 'crypto-payment' | 'success';

export function CheckoutModal({ 
  open, 
  onOpenChange, 
  onPaymentSuccess,
  isProcessing,
  balanceEur
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'crypto'>('crypto');
  const [step, setStep] = useState<Step>('select');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption | null>(null);
  const [paymentData, setPaymentData] = useState<{
    payment_id: string;
    pay_address: string;
    pay_amount: number;
    pay_currency: string;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('waiting');
  const [isPolling, setIsPolling] = useState(false);
  const [copied, setCopied] = useState<'amount' | 'address' | null>(null);
  
  const { toast } = useToast();
  const { createPayment, checkPaymentStatus } = useNowPayments();

  const hasSufficientBalance = balanceEur >= RENTAL_PRICE;

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep('select');
      setPaymentMethod(hasSufficientBalance ? 'balance' : 'crypto');
      setSelectedCurrency(null);
      setPaymentData(null);
      setPaymentStatus('waiting');
      setIsPolling(false);
    }
  }, [open, hasSufficientBalance]);

  // Poll for payment status
  useEffect(() => {
    if (!paymentData?.payment_id || !isPolling) return;

    const interval = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(paymentData.payment_id);
        setPaymentStatus(status.payment_status);
        
        if (status.payment_status === 'finished' || status.payment_status === 'confirmed') {
          setIsPolling(false);
          await onPaymentSuccess('crypto', paymentData.payment_id);
          setStep('success');
        } else if (status.payment_status === 'failed' || status.payment_status === 'expired') {
          setIsPolling(false);
          toast({
            title: 'Zahlung fehlgeschlagen',
            description: 'Die Zahlung ist abgelaufen oder fehlgeschlagen.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [paymentData?.payment_id, isPolling, checkPaymentStatus, onPaymentSuccess, toast]);

  const handleContinue = () => {
    if (paymentMethod === 'balance') {
      setStep('balance-confirm');
    } else {
      setStep('crypto-currency');
    }
  };

  const handleBalancePayment = async () => {
    try {
      await onPaymentSuccess('balance');
      setStep('success');
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Die Zahlung konnte nicht verarbeitet werden.',
        variant: 'destructive',
      });
    }
  };

  const handleCurrencySelect = async (currency: CurrencyOption) => {
    setSelectedCurrency(currency);
    
    try {
      const result = await createPayment.mutateAsync({
        amount_eur: RENTAL_PRICE,
        pay_currency: currency.id,
        payment_type: 'rental',
      });
      
      setPaymentData({
        payment_id: result.payment_id,
        pay_address: result.pay_address,
        pay_amount: result.pay_amount,
        pay_currency: result.pay_currency,
      });
      
      setIsPolling(true);
      setStep('crypto-payment');
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error instanceof Error ? error.message : 'Zahlung konnte nicht erstellt werden',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string, type: 'amount' | 'address') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: 'Kopiert!',
      description: type === 'address' ? 'Adresse kopiert.' : 'Betrag kopiert.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mb-3">
            <ShoppingBag className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl">
            {step === 'select' && 'Checkout'}
            {step === 'balance-confirm' && 'Zahlung bestätigen'}
            {step === 'crypto-currency' && 'Kryptowährung wählen'}
            {step === 'crypto-payment' && 'Zahlung durchführen'}
            {step === 'success' && 'Erfolgreich!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && 'Sichere Zahlung für dein Agency Account'}
            {step === 'balance-confirm' && 'Bestätige die Zahlung mit deinem Guthaben'}
            {step === 'crypto-currency' && 'Wähle deine bevorzugte Kryptowährung'}
            {step === 'crypto-payment' && 'Scanne den QR-Code oder kopiere die Adresse'}
            {step === 'success' && 'Dein Agency Account wurde aktiviert!'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Step: Select Payment Method */}
          {step === 'select' && (
            <>
              {/* Product Card */}
              <Card className="overflow-hidden border-border/50 shadow-sm">
                <CardContent className="p-0">
                  {/* Product Header */}
                  <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/20 border-b border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center p-2">
                        <img src={metaLogo} alt="Meta" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">Agency Account</p>
                        <p className="text-sm text-muted-foreground">Meta Ads Werbekonto</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            Premium
                          </span>
                          <span className="text-xs text-muted-foreground">30 Tage</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Laufzeit</span>
                      <span className="font-medium">30 Tage</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Auto-Verlängerung</span>
                      <span className="font-medium text-primary flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" />
                        Aktiv
                      </span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Gesamt</span>
                      <span className="text-2xl font-bold">{RENTAL_PRICE},00 €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Zahlungsmethode wählen</Label>
                
                <div className="grid gap-2">
                  {/* Balance Option */}
                  <button
                    onClick={() => setPaymentMethod('balance')}
                    disabled={!hasSufficientBalance}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      paymentMethod === 'balance' && hasSufficientBalance
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-border",
                      !hasSufficientBalance && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      paymentMethod === 'balance' && hasSufficientBalance
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}>
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Guthaben verwenden</p>
                      <p className="text-sm text-muted-foreground">
                        {hasSufficientBalance 
                          ? `${balanceEur.toFixed(2)} € verfügbar`
                          : `${balanceEur.toFixed(2)} € (nicht genug)`
                        }
                      </p>
                    </div>
                    {hasSufficientBalance && paymentMethod === 'balance' && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    {!hasSufficientBalance && (
                      <span className="text-xs text-destructive font-medium">Nicht genug</span>
                    )}
                  </button>
                  
                  {/* Crypto Option */}
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      paymentMethod === 'crypto'
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-border"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      paymentMethod === 'crypto'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}>
                      <Coins className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Kryptowährung</p>
                      <p className="text-sm text-muted-foreground">USDT, BTC, ETH, USDC & mehr</p>
                    </div>
                    {paymentMethod === 'crypto' && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <Button 
                className="w-full h-12 gradient-bg text-base font-semibold" 
                size="lg"
                onClick={handleContinue}
              >
                Weiter
              </Button>

              <TrustBadges variant="footer" />
            </>
          )}

          {/* Step: Balance Confirm */}
          {step === 'balance-confirm' && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep('select')}
                className="-ml-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
              </Button>

              <Card className="border-border/50">
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aktuelles Guthaben</span>
                    <span className="font-medium">{balanceEur.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kosten</span>
                    <span className="font-medium text-destructive">-{RENTAL_PRICE},00 €</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Neues Guthaben</span>
                    <span className="font-bold text-lg text-primary">{(balanceEur - RENTAL_PRICE).toFixed(2)} €</span>
                  </div>
                </CardContent>
              </Card>

              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm">
                  Mit Klick auf "Jetzt bezahlen" wird dein Agency Account sofort aktiviert.
                </AlertDescription>
              </Alert>

              <Button 
                className="w-full h-12 gradient-bg text-base font-semibold" 
                size="lg"
                onClick={handleBalancePayment}
                disabled={isProcessing || !hasSufficientBalance}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird verarbeitet...
                  </>
                ) : (
                  `Jetzt ${RENTAL_PRICE}€ bezahlen`
                )}
              </Button>
              
              <TrustBadges variant="footer" />
            </>
          )}

          {/* Step: Crypto Currency Selection */}
          {step === 'crypto-currency' && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep('select')}
                className="-ml-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
              </Button>
              
              {/* Price Summary */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <span className="text-sm text-muted-foreground">Zu zahlen</span>
                <span className="font-bold text-lg">{RENTAL_PRICE},00 €</span>
              </div>
              
              <CurrencySearchSelector
                onSelect={handleCurrencySelect}
                isLoading={createPayment.isPending}
                loadingCurrencyId={selectedCurrency?.id}
                amount={RENTAL_PRICE}
              />
            </>
          )}

          {/* Step: Crypto Payment */}
          {step === 'crypto-payment' && paymentData && (
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
              </div>
              
              {/* Payment Details */}
              <div className="space-y-3">
                {/* Amount to pay */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Zu zahlender Betrag</Label>
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-border/50 bg-muted/20">
                    <span className="flex-1 font-mono text-lg font-bold">
                      {paymentData.pay_amount} {paymentData.pay_currency.toUpperCase()}
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
                </div>
                
                {/* Wallet Address */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Wallet-Adresse</Label>
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-border/50 bg-muted/20">
                    <span className="flex-1 font-mono text-xs break-all leading-relaxed">
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
                  Dein Account wird nach Zahlungseingang automatisch aktiviert.
                </p>
                <PoweredByBadge />
              </div>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="space-y-5 text-center py-4">
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-emerald-100 text-emerald-600">
                <Check className="h-10 w-10" />
              </div>
              
              <div>
                <p className="text-lg font-semibold">Dein Agency Account ist aktiv!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Du kannst jetzt mit dem Werben beginnen. Viel Erfolg!
                </p>
              </div>
              
              <Button 
                className="w-full h-12 gradient-bg text-base font-semibold"
                onClick={() => onOpenChange(false)}
              >
                Los geht's
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
