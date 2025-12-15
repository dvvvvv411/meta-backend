import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { ProductDetail } from '@/components/advertiser/checkout/ProductDetail';
import { CheckoutModal } from '@/components/advertiser/checkout/CheckoutModal';
import { OrderConfirmation } from '@/components/advertiser/checkout/OrderConfirmation';
import { AccountList } from '@/components/advertiser/account/AccountList';
import { useAdvertiserAccounts } from '@/hooks/useAdvertiserAccounts';
import { useUserBalance } from '@/hooks/useUserBalance';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function RentAccountPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [orderData, setOrderData] = useState<{
    invoiceNumber: string;
    amount: number;
    currency: string;
    startDate: Date;
    endDate: Date;
    customerName: string;
    customerEmail: string;
    companyName?: string;
  } | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    accounts, 
    isLoading, 
    createAccount, 
    payWithBalance,
    toggleAutoRenew,
    renameAccount,
  } = useAdvertiserAccounts();
  const { balanceEur, invalidateBalance } = useUserBalance();

  const customerEmail = user?.email ?? '';
  const companyName = user?.user_metadata?.company_name;
  const customerName = companyName || customerEmail;

  const handlePaymentSuccess = async (paymentMethod: 'balance' | 'crypto', transactionId?: string) => {
    try {
      let account;
      
      if (paymentMethod === 'balance') {
        // Pay with balance
        account = await payWithBalance.mutateAsync();
        invalidateBalance();
      } else {
        // Crypto payment - account creation after NOWPayments confirms
        account = await createAccount.mutateAsync({
          pricePaid: 150,
          paymentMethod: 'crypto',
          currency: 'EUR',
          transactionId,
        });
      }

      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      setOrderData({
        invoiceNumber: account.invoice_number ?? '',
        amount: 150,
        currency: 'EUR',
        startDate,
        endDate,
        customerName,
        customerEmail,
        companyName,
      });

      setCheckoutOpen(false);
      setConfirmationOpen(true);

      toast({
        title: 'Account aktiviert!',
        description: 'Dein Agency Account wurde erfolgreich aktiviert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error instanceof Error ? error.message : 'Es gab ein Problem bei der Aktivierung.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleAutoRenew = (accountId: string, autoRenew: boolean) => {
    toggleAutoRenew.mutate(
      { accountId, autoRenew },
      {
        onSuccess: () => {
          toast({
            title: autoRenew ? 'Auto-Verlängerung aktiviert' : 'Auto-Verlängerung deaktiviert',
            description: autoRenew 
              ? 'Dein Account wird automatisch verlängert.' 
              : 'Dein Account wird nicht automatisch verlängert.',
          });
        },
        onError: () => {
          toast({
            title: 'Fehler',
            description: 'Die Einstellung konnte nicht gespeichert werden.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agency Account mieten</h1>
        <p className="text-muted-foreground mt-1">
          Starte jetzt mit deinem professionellen Werbekonto.
        </p>
      </div>

      <ProductDetail onRentClick={() => setCheckoutOpen(true)} />

      {accounts && accounts.length > 0 && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Geteiltes Guthaben</p>
                  <p className="text-sm text-muted-foreground">
                    Alle deine Agency Accounts nutzen dieses Guthaben
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(balanceEur)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <AccountList
        accounts={accounts}
        onToggleAutoRenew={handleToggleAutoRenew}
        isToggling={toggleAutoRenew.isPending}
        onRenameAccount={(accountId, newName) => renameAccount.mutate({ accountId, newName })}
        isRenaming={renameAccount.isPending}
        onAddAccount={scrollToTop}
      />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onPaymentSuccess={handlePaymentSuccess}
        isProcessing={payWithBalance.isPending || createAccount.isPending}
        balanceEur={balanceEur}
      />

      <OrderConfirmation
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        orderData={orderData}
        onGoToDashboard={() => {
          setConfirmationOpen(false);
          navigate('/advertiser');
        }}
      />
    </div>
  );
}
