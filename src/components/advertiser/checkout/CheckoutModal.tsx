import { useState } from 'react';
import { Copy, Loader2, AlertCircle, FileText, Clock } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
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
  const [showConfirmationTracker, setShowConfirmationTracker] = useState(false);
  const { toast } = useToast();

  const copyAddress = () => {
    navigator.clipboard.writeText(CRYPTO_WALLET);
    toast({
      title: 'Adresse kopiert',
      description: 'Die Wallet-Adresse wurde in die Zwischenablage kopiert.',
    });
  };

  const handlePaymentConfirmed = async () => {
    setShowConfirmationTracker(true);
    await onPaymentConfirmed();
  };

  // Mock confirmation state
  const confirmations = 0;
  const requiredConfirmations = 3;
  const confirmationProgress = (confirmations / requiredConfirmations) * 100;

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
                  <span className="font-bold text-lg">150,00 €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <p className="text-sm font-medium mb-3">Zahlungsmethode wählen:</p>
            <PaymentMethodSelector 
              selected={paymentMethod} 
              onSelect={setPaymentMethod} 
            />
          </div>

          {paymentMethod === 'crypto' && !showConfirmationTracker && (
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

          {/* Confirmation Tracker */}
          {showConfirmationTracker && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Warte auf Bestätigungen...</p>
                    <p className="text-xs text-muted-foreground">{confirmations}/{requiredConfirmations} Bestätigungen</p>
                  </div>
                </div>
                <Progress value={confirmationProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Dies kann einige Minuten dauern. Du kannst dieses Fenster schließen - wir benachrichtigen dich.
                </p>
              </CardContent>
            </Card>
          )}

          {!showConfirmationTracker && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={handlePaymentConfirmed}
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
          )}

          <p className="text-xs text-center text-muted-foreground">
            Probleme? support@agency-ads.de
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
