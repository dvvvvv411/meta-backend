import { useState, useEffect } from 'react';
import { Copy, Loader2, AlertCircle, FileText, Check, ArrowLeft } from 'lucide-react';
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
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { useNowPayments } from '@/hooks/useNowPayments';
import { getCryptoIcon } from '@/lib/crypto-icons';
import { cn } from '@/lib/utils';

const RENTAL_PRICE = 150;

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: (paymentMethod: 'balance' | 'crypto', transactionId?: string) => Promise<void>;
  isProcessing: boolean;
  balanceEur: number;
}

type Step = 'select' | 'balance-confirm' | 'crypto-currency' | 'crypto-payment' | 'success';

interface CurrencyOption {
  id: string;
  name: string;
  symbol: string;
  network?: string;
  minEur: number;
  category: 'stablecoin' | 'crypto';
}

const CURRENCIES: CurrencyOption[] = [
  // Stablecoins
  { id: 'usdttrc20', name: 'Tether', symbol: 'USDT', network: 'TRC20', minEur: 10, category: 'stablecoin' },
  { id: 'usdterc20', name: 'Tether', symbol: 'USDT', network: 'ERC20', minEur: 20, category: 'stablecoin' },
  { id: 'usdtbsc', name: 'Tether', symbol: 'USDT', network: 'BSC (BEP20)', minEur: 10, category: 'stablecoin' },
  { id: 'usdtmatic', name: 'Tether', symbol: 'USDT', network: 'Polygon', minEur: 10, category: 'stablecoin' },
  { id: 'usdcerc20', name: 'USD Coin', symbol: 'USDC', network: 'ERC20', minEur: 20, category: 'stablecoin' },
  // Cryptocurrencies
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', minEur: 50, category: 'crypto' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', minEur: 30, category: 'crypto' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', minEur: 10, category: 'crypto' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', minEur: 10, category: 'crypto' },
  { id: 'trx', name: 'Tron', symbol: 'TRX', minEur: 5, category: 'crypto' },
  { id: 'bnbbsc', name: 'BNB', symbol: 'BNB', network: 'BSC', minEur: 15, category: 'crypto' },
  { id: 'xmr', name: 'Monero', symbol: 'XMR', minEur: 10, category: 'crypto' },
];

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
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  const { createPayment, checkPaymentStatus } = useNowPayments();

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep('select');
      setPaymentMethod('crypto');
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
          // Payment successful - create account
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

  const handlePaymentMethodSelect = (method: 'balance' | 'crypto') => {
    setPaymentMethod(method);
  };

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Kopiert!',
      description: 'Wurde in die Zwischenablage kopiert.',
    });
  };

  const getStatusInfo = () => {
    switch (paymentStatus) {
      case 'waiting':
        return { text: 'Warte auf Zahlung...', color: 'text-yellow-500', icon: Loader2 };
      case 'confirming':
        return { text: 'Bestätigung läuft...', color: 'text-blue-500', icon: Loader2 };
      case 'confirmed':
      case 'finished':
        return { text: 'Zahlung erfolgreich!', color: 'text-green-500', icon: Check };
      default:
        return { text: 'Warte auf Zahlung...', color: 'text-yellow-500', icon: Loader2 };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const hasSufficientBalance = balanceEur >= RENTAL_PRICE;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' && 'Checkout'}
            {step === 'balance-confirm' && 'Zahlung bestätigen'}
            {step === 'crypto-currency' && 'Kryptowährung wählen'}
            {step === 'crypto-payment' && 'Zahlung durchführen'}
            {step === 'success' && 'Erfolgreich!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && 'Schließe deinen Kauf ab um sofort loszulegen.'}
            {step === 'balance-confirm' && 'Bestätige die Zahlung mit deinem Guthaben.'}
            {step === 'crypto-currency' && 'Wähle deine bevorzugte Kryptowährung'}
            {step === 'crypto-payment' && 'Scanne den QR-Code oder kopiere die Adresse'}
            {step === 'success' && 'Dein Agency Account wurde aktiviert!'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step: Select Payment Method */}
          {step === 'select' && (
            <>
              {/* Order Summary Card */}
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg gradient-bg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Agency Account</p>
                      <p className="text-xs text-muted-foreground">Meta Ads Werbekonto</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Laufzeit</span>
                      <span className="font-medium">30 Tage</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Automatische Verlängerung</span>
                      <span className="font-medium text-primary">Aktiv</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Gesamt</span>
                      <span className="font-bold text-lg">{RENTAL_PRICE},00 €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <p className="text-sm font-medium mb-3">Zahlungsmethode wählen:</p>
                <PaymentMethodSelector 
                  selected={paymentMethod} 
                  onSelect={handlePaymentMethodSelect}
                  balanceEur={balanceEur}
                  requiredAmount={RENTAL_PRICE}
                />
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleContinue}
              >
                Weiter
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Probleme? support@agency-ads.de
              </p>
            </>
          )}

          {/* Step: Balance Confirm */}
          {step === 'balance-confirm' && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep('select')}
                className="mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
              </Button>

              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-4 pb-3 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aktuelles Guthaben</span>
                    <span className="font-medium">{balanceEur.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kosten</span>
                    <span className="font-medium text-destructive">-{RENTAL_PRICE},00 €</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Neues Guthaben</span>
                    <span className="font-bold text-primary">{(balanceEur - RENTAL_PRICE).toFixed(2)} €</span>
                  </div>
                </CardContent>
              </Card>

              <Alert variant="default" className="bg-primary/10 border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-xs">
                  Mit Klick auf "Jetzt bezahlen" wird dein Agency Account sofort aktiviert und {RENTAL_PRICE}€ von deinem Guthaben abgezogen.
                </AlertDescription>
              </Alert>

              <Button 
                className="w-full gradient-bg" 
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
            </>
          )}

          {/* Step: Crypto Currency Selection */}
          {step === 'crypto-currency' && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep('select')}
                className="mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
              </Button>
              
              {/* Stablecoins */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                  Stablecoins
                </h4>
                <div className="grid gap-2 max-h-40 overflow-y-auto">
                  {CURRENCIES.filter(c => c.category === 'stablecoin').map((currency) => {
                    const CryptoIcon = getCryptoIcon(currency.id);
                    
                    return (
                      <button
                        key={currency.id}
                        onClick={() => handleCurrencySelect(currency)}
                        disabled={createPayment.isPending}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all",
                          "hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm",
                          "disabled:cursor-not-allowed disabled:opacity-50"
                        )}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                          <CryptoIcon size={32} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{currency.symbol}</p>
                          <p className="text-xs text-muted-foreground">
                            {currency.name} {currency.network && `• ${currency.network}`}
                          </p>
                        </div>
                        {createPayment.isPending && selectedCurrency?.id === currency.id && (
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Cryptocurrencies */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                  Kryptowährungen
                </h4>
                <div className="grid gap-2 max-h-40 overflow-y-auto">
                  {CURRENCIES.filter(c => c.category === 'crypto').map((currency) => {
                    const CryptoIcon = getCryptoIcon(currency.id);
                    
                    return (
                      <button
                        key={currency.id}
                        onClick={() => handleCurrencySelect(currency)}
                        disabled={createPayment.isPending}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all",
                          "hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm",
                          "disabled:cursor-not-allowed disabled:opacity-50"
                        )}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                          <CryptoIcon size={32} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{currency.symbol}</p>
                          <p className="text-xs text-muted-foreground">
                            {currency.name} {currency.network && `• ${currency.network}`}
                          </p>
                        </div>
                        {createPayment.isPending && selectedCurrency?.id === currency.id && (
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Step: Crypto Payment */}
          {step === 'crypto-payment' && paymentData && (
            <>
              <div className="flex items-center justify-center p-4 bg-white rounded-lg">
                <QRCodeSVG 
                  value={paymentData.pay_address} 
                  size={160}
                  level="H"
                  includeMargin
                />
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Zu zahlender Betrag</Label>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                    <span className="font-mono text-lg font-bold">
                      {paymentData.pay_amount} {paymentData.pay_currency.toUpperCase()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(paymentData.pay_amount.toString())}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Wallet-Adresse</Label>
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
                    <span className="font-mono text-xs flex-1 break-all">
                      {paymentData.pay_address}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(paymentData.pay_address)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "flex items-center justify-center gap-2 p-3 rounded-lg border",
                statusInfo.color
              )}>
                <StatusIcon className={cn("h-5 w-5", (paymentStatus === 'waiting' || paymentStatus === 'confirming') && "animate-spin")} />
                <span className="font-medium">{statusInfo.text}</span>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Nach Zahlungseingang wird dein Account automatisch aktiviert.
                <br />
                Du kannst dieses Fenster schließen.
              </p>
            </>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-green-100 text-green-600">
                <Check className="h-8 w-8" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Agency Account aktiviert!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Dein Werbekonto ist jetzt für 30 Tage aktiv.
                </p>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => onOpenChange(false)}
              >
                Zum Dashboard
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
