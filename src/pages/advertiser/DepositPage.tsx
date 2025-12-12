import { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Shield, Receipt, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUserBalance } from '@/hooks/useUserBalance';
import { useDeposits } from '@/hooks/useDeposits';
import { BalanceOverview } from '@/components/advertiser/deposit/BalanceOverview';
import { TransactionHistory } from '@/components/advertiser/deposit/TransactionHistory';
import { DepositModal } from '@/components/advertiser/deposit/DepositModal';

export default function DepositPage() {
  const { toast } = useToast();
  const { balanceEur } = useUserBalance();
  const { deposits } = useDeposits();
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  const handleWithdraw = () => {
    toast({
      title: 'Funktion in Entwicklung',
      description: 'Die Auszahlungsfunktion wird bald verfügbar sein.',
    });
  };

  // Calculate stats from deposits
  const completedDeposits = deposits.filter(d => d.status === 'completed');
  const lastDeposit = completedDeposits.length > 0 
    ? format(new Date(completedDeposits[0].created_at), 'dd.MM.yyyy', { locale: de })
    : '-';
  const totalTransactions = deposits.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Guthaben verwalten</h1>
        <p className="text-muted-foreground mt-1">
          Verwalte dein Kontoguthaben – Einzahlungen und Auszahlungen.
        </p>
      </div>

      {/* Current Balance */}
      <BalanceOverview balanceEur={balanceEur} />

      {/* Action Buttons */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30" onClick={() => setDepositModalOpen(true)}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <ArrowDownToLine className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">Guthaben einzahlen</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Lade dein Konto auf, um Kampagnen zu schalten und Services zu nutzen.
                </p>
                <Button className="mt-4 gradient-bg text-primary-foreground hover:opacity-90">
                  Einzahlen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30" onClick={handleWithdraw}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowUpFromLine className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">Guthaben auszahlen</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Zahle dein vorhandenes Guthaben auf dein Bankkonto aus.
                </p>
                <Button variant="outline" className="mt-4">
                  Auszahlen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Letzte Einzahlung</p>
                <p className="font-semibold text-foreground">{lastDeposit}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Letzte Auszahlung</p>
                <p className="font-semibold text-foreground">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transaktionen gesamt</p>
                <p className="font-semibold text-foreground">{totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Transaction History */}
      <TransactionHistory deposits={deposits} />

      {/* Security Note */}
      <Card className="bg-muted/30 border-muted">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Sicherheitshinweis</p>
              <p className="mt-1">
                Alle Transaktionen werden sicher verarbeitet. Bei Problemen oder Fragen 
                kontaktiere unseren Support unter{' '}
                <a href="mailto:support@example.com" className="text-primary hover:underline">
                  support@example.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Modal */}
      <DepositModal open={depositModalOpen} onOpenChange={setDepositModalOpen} />
    </div>
  );
}
