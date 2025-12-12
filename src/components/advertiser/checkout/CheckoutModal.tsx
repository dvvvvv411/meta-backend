import { useState } from 'react';
import { Copy, Loader2, AlertCircle } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { PaymentMethodSelector } from './PaymentMethodSelector';

// Placeholder wallet address
const CRYPTO_WALLET = 'TXyz1234567890abcdefghijklmnop';
const USDT_AMOUNT = 160;

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentConfirmed: () => Promise<void>;
  isProcessing: boolean;
}

export function CheckoutModal({ 
  open, 
  onOpenChange, 
  onPaymentConfirmed,
  isProcessing 
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'fiat'>('crypto');
  const { toast } = useToast();

  const copyAddress = () => {
    navigator.clipboard.writeText(CRYPTO_WALLET);
    toast({
      title: 'Adresse kopiert',
      description: 'Die Wallet-Adresse wurde in die Zwischenablage kopiert.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Schließe deinen Kauf ab um sofort loszulegen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Produkt</span>
              <span className="font-medium">Agency Account</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Laufzeit</span>
              <span className="font-medium">30 Tage (auto. Verlängerung)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Preis</span>
              <span className="font-medium">150,00 €</span>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-3">Zahlungsmethode wählen:</p>
            <PaymentMethodSelector 
              selected={paymentMethod} 
              onSelect={setPaymentMethod} 
            />
          </div>

          {paymentMethod === 'crypto' && (
            <div className="space-y-3">
              <Separator />
              
              <p className="text-sm text-muted-foreground">
                Sende <span className="font-bold text-foreground">{USDT_AMOUNT} USDT</span> an folgende Adresse:
              </p>

              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded text-xs font-mono truncate">
                  {CRYPTO_WALLET}
                </code>
                <Button size="icon" variant="outline" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Netzwerk:</strong> TRC-20 (TRON)</p>
              </div>

              <Alert variant="default" className="bg-amber-500/10 border-amber-500/20">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
                  Bitte sende exakt {USDT_AMOUNT} USDT. Nach Zahlungseingang wird dein Account innerhalb von 5 Minuten aktiviert.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <Button 
            className="w-full" 
            size="lg"
            onClick={onPaymentConfirmed}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird verarbeitet...
              </>
            ) : (
              'Ich habe bezahlt - Transaktion prüfen'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Probleme? support@agency-ads.de
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
