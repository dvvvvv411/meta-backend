import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import type { Deposit } from '@/hooks/useDeposits';
import { useNowPayments } from '@/hooks/useNowPayments';

interface TransactionDetailModalProps {
  transaction: Deposit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailModal({ transaction, open, onOpenChange }: TransactionDetailModalProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const { checkPaymentStatus } = useNowPayments();
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);

  // Calculate time remaining
  useEffect(() => {
    if (!transaction?.expires_at) {
      setTimeLeft(null);
      setIsExpired(false);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(transaction.expires_at!).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      setIsExpired(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [transaction?.expires_at]);

  // Poll payment status
  useEffect(() => {
    if (!open || !transaction?.nowpayments_id || transaction.status === 'completed') return;

    setCurrentStatus(transaction.payment_status);

    const pollStatus = async () => {
      try {
        const status = await checkPaymentStatus(transaction.nowpayments_id!);
        if (status) {
          setCurrentStatus(status.payment_status);
        }
      } catch (error) {
        console.error('Failed to check payment status:', error);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [open, transaction?.nowpayments_id, transaction?.status, checkPaymentStatus]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Kopiert',
        description: `${label} wurde in die Zwischenablage kopiert.`,
      });
    } catch {
      toast({
        title: 'Fehler',
        description: 'Konnte nicht kopieren.',
        variant: 'destructive',
      });
    }
  };

  const getStatusDisplay = (status: string | null) => {
    switch (status) {
      case 'waiting':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Warte auf Zahlung
          </Badge>
        );
      case 'confirming':
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Wird bestätigt
          </Badge>
        );
      case 'confirmed':
      case 'finished':
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Bestätigt
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Abgelaufen
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {status || 'Ausstehend'}
          </Badge>
        );
    }
  };

  if (!transaction) return null;

  const formatAmount = (amount: number | null, currency: string | null) => {
    if (!amount || !currency) return '-';
    return `${amount} ${currency.toUpperCase()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaktionsdetails</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            {getStatusDisplay(currentStatus || transaction.payment_status)}
          </div>

          {/* QR Code & Payment Address */}
          {transaction.pay_address && !isExpired && transaction.status !== 'completed' && (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-xl">
                  <QRCodeSVG
                    value={transaction.pay_address}
                    size={180}
                    level="M"
                    includeMargin={false}
                  />
                </div>
              </div>

              {/* Amount to pay */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Zu zahlen</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-lg">
                      {formatAmount(transaction.pay_amount, transaction.pay_currency)}
                    </span>
                    {transaction.pay_amount && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(transaction.pay_amount!.toString(), 'Betrag')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Wallet-Adresse</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-background rounded px-2 py-1.5 font-mono truncate">
                      {transaction.pay_address}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.pay_address!, 'Wallet-Adresse')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Timer */}
                {timeLeft && (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Ablauf in</span>
                    <span className="font-mono text-sm font-medium text-orange-600">
                      {timeLeft}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expired Warning */}
          {isExpired && transaction.status !== 'completed' && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm font-medium text-destructive">Zahlungsfrist abgelaufen</p>
              <p className="text-xs text-muted-foreground mt-1">
                Diese Zahlungsanfrage ist nicht mehr gültig.
              </p>
            </div>
          )}

          {/* Completed */}
          {transaction.status === 'completed' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-600">Zahlung abgeschlossen</p>
              <p className="text-xs text-muted-foreground mt-1">
                Der Betrag wurde deinem Guthaben gutgeschrieben.
              </p>
            </div>
          )}

          {/* Transaction Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Betrag (EUR)</span>
              <span className="font-medium">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(transaction.amount)}
              </span>
            </div>
            {transaction.pay_currency && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Währung</span>
                <span className="font-medium">{transaction.pay_currency.toUpperCase()}</span>
              </div>
            )}
            {transaction.tx_hash && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">TX Hash</span>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs font-mono"
                  onClick={() => copyToClipboard(transaction.tx_hash!, 'TX Hash')}
                >
                  {transaction.tx_hash.slice(0, 8)}...{transaction.tx_hash.slice(-8)}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
