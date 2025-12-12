import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Check, Copy, ExternalLink, AlertCircle } from 'lucide-react';
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

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'amount' | 'currency' | 'payment' | 'status';

interface CurrencyOption {
  id: string;
  name: string;
  symbol: string;
  network?: string;
  icon: string;
}

const CURRENCIES: CurrencyOption[] = [
  { id: 'usdttrc20', name: 'Tether', symbol: 'USDT', network: 'TRC20', icon: '₮' },
  { id: 'usdterc20', name: 'Tether', symbol: 'USDT', network: 'ERC20', icon: '₮' },
  { id: 'usdtbsc', name: 'Tether', symbol: 'USDT', network: 'BSC', icon: '₮' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', network: 'ERC20', icon: '$' },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
];

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
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
  const [copied, setCopied] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

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
            title: 'Zahlung erfolgreich!',
            description: `${paymentData.net_amount.toFixed(2)} € wurden deinem Guthaben gutgeschrieben.`,
          });
        } else if (status.payment_status === 'failed' || status.payment_status === 'expired') {
          setIsPolling(false);
          setStep('status');
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [paymentData?.payment_id, isPolling, checkPaymentStatus, toast]);

  const handleAmountSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 10 || numAmount > 10000) {
      toast({
        title: 'Ungültiger Betrag',
        description: 'Bitte gib einen Betrag zwischen 10€ und 10.000€ ein.',
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
        amount_eur: parseFloat(amount),
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
      description: 'Adresse wurde in die Zwischenablage kopiert.',
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
      case 'failed':
      case 'expired':
        return { text: 'Zahlung fehlgeschlagen', color: 'text-red-500', icon: AlertCircle };
      default:
        return { text: 'Status unbekannt', color: 'text-muted-foreground', icon: Loader2 };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'amount' && 'Betrag eingeben'}
            {step === 'currency' && 'Kryptowährung wählen'}
            {step === 'payment' && 'Zahlung durchführen'}
            {step === 'status' && 'Zahlungsstatus'}
          </DialogTitle>
          <DialogDescription>
            {step === 'amount' && 'Wie viel möchtest du einzahlen?'}
            {step === 'currency' && 'Wähle deine bevorzugte Kryptowährung'}
            {step === 'payment' && 'Scanne den QR-Code oder kopiere die Adresse'}
            {step === 'status' && 'Deine Zahlung wurde verarbeitet'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step: Amount */}
          {step === 'amount' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Betrag in EUR</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    min="10"
                    max="10000"
                    step="1"
                    placeholder="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-10 text-lg"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Min. 10€ • Max. 10.000€ • 2% Gebühr wird abgezogen
                </p>
              </div>
              
              {amount && parseFloat(amount) >= 10 && (
                <div className="rounded-lg border bg-muted/50 p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Einzahlung</span>
                    <span>{parseFloat(amount).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gebühr (2%)</span>
                    <span className="text-destructive">-{(parseFloat(amount) * 0.02).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Gutschrift</span>
                    <span className="text-primary">{(parseFloat(amount) * 0.98).toFixed(2)} €</span>
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full gradient-bg" 
                onClick={handleAmountSubmit}
                disabled={!amount || parseFloat(amount) < 10}
              >
                Weiter <ArrowRight className="ml-2 h-4 w-4" />
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
                className="mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
              </Button>
              
              <div className="grid gap-2">
                {CURRENCIES.map((currency) => (
                  <button
                    key={currency.id}
                    onClick={() => handleCurrencySelect(currency)}
                    disabled={createPayment.isPending}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all",
                      "hover:border-primary/50 hover:bg-primary/5",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                      {currency.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{currency.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {currency.symbol} {currency.network && `(${currency.network})`}
                      </p>
                    </div>
                    {createPayment.isPending && selectedCurrency?.id === currency.id && (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Payment */}
          {step === 'payment' && paymentData && (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-4 bg-white rounded-lg">
                <QRCodeSVG 
                  value={paymentData.pay_address} 
                  size={180}
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
                <StatusIcon className={cn("h-5 w-5", paymentStatus === 'waiting' && "animate-spin")} />
                <span className="font-medium">{statusInfo.text}</span>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Nach Zahlungseingang wird dein Guthaben automatisch aktualisiert.
                <br />
                Du kannst dieses Fenster schließen.
              </p>
            </div>
          )}

          {/* Step: Status */}
          {step === 'status' && (
            <div className="space-y-4 text-center py-4">
              <div className={cn(
                "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
                paymentStatus === 'finished' || paymentStatus === 'confirmed' 
                  ? "bg-green-100 text-green-600" 
                  : "bg-red-100 text-red-600"
              )}>
                <StatusIcon className="h-8 w-8" />
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">{statusInfo.text}</h3>
                {paymentData && (paymentStatus === 'finished' || paymentStatus === 'confirmed') && (
                  <p className="text-muted-foreground mt-1">
                    {paymentData.net_amount.toFixed(2)} € wurden gutgeschrieben
                  </p>
                )}
                {(paymentStatus === 'failed' || paymentStatus === 'expired') && (
                  <p className="text-muted-foreground mt-1">
                    Die Zahlung ist fehlgeschlagen oder abgelaufen. Bitte versuche es erneut.
                  </p>
                )}
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => onOpenChange(false)}
              >
                Schließen
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
