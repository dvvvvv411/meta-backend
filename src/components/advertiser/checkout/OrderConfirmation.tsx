import { CheckCircle2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';


interface OrderConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: {
    invoiceNumber: string;
    amount: number;
    currency: string;
    startDate: Date;
    endDate: Date;
    customerName: string;
    customerEmail: string;
    companyName?: string;
  } | null;
  onGoToDashboard: () => void;
}

export function OrderConfirmation({ 
  open, 
  onOpenChange, 
  orderData,
  onGoToDashboard 
}: OrderConfirmationProps) {
  if (!orderData) return null;

  const formatDate = (date: Date) => format(date, 'dd.MM.yyyy', { locale: de });


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl">Zahlung erfolgreich!</DialogTitle>
        </DialogHeader>

        <p className="text-center text-muted-foreground">
          Dein Agency Account wurde aktiviert.
        </p>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Bestellübersicht</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rechnungsnummer</span>
              <span className="font-mono">{orderData.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Produkt</span>
              <span>Agency Account</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Betrag</span>
              <span>{orderData.amount.toFixed(2)} € (160 USDT)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Startdatum</span>
              <span>{formatDate(orderData.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gültig bis</span>
              <span>{formatDate(orderData.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nächste Abrechnung</span>
              <span>{formatDate(orderData.endDate)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            className="w-full"
            onClick={onGoToDashboard}
          >
            Zum Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
