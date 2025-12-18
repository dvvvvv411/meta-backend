import { CheckCircle2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';


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
  const { t, language } = useLanguage();
  
  if (!orderData) return null;

  const dateLocale = language === 'de' ? de : enUS;
  const formatDate = (date: Date) => format(date, 'dd.MM.yyyy', { locale: dateLocale });


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl">
            {t.rentAccount.paymentSuccessful}
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-muted-foreground">
          {t.rentAccount.orderConfirmedDesc}
        </p>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">
            {t.rentAccount.orderSummary}
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.rentAccount.invoiceNumber}</span>
              <span className="font-mono">{orderData.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.rentAccount.product}</span>
              <span>Agency Account</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.rentAccount.amount}</span>
              <span>{orderData.amount.toFixed(2)} € (160 USDT)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.rentAccount.startDate}</span>
              <span>{formatDate(orderData.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.rentAccount.validUntil}</span>
              <span>{formatDate(orderData.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.rentAccount.nextBilling}</span>
              <span>{formatDate(orderData.endDate)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            className="w-full"
            onClick={onGoToDashboard}
          >
            {t.rentAccount.goToDashboard}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
