import { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Receipt, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUserBalance } from '@/hooks/useUserBalance';
import { useDeposits } from '@/hooks/useDeposits';
import { BalanceOverview } from '@/components/advertiser/deposit/BalanceOverview';
import { TransactionHistory } from '@/components/advertiser/deposit/TransactionHistory';
import { DepositModal } from '@/components/advertiser/deposit/DepositModal';
import { WithdrawModal } from '@/components/advertiser/deposit/WithdrawModal';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DepositPage() {
  const { balanceUsd } = useUserBalance();
  const { deposits } = useDeposits();
  const { t, language } = useLanguage();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const dateLocale = language === 'de' ? de : enUS;

  // Calculate stats from deposits
  const completedDeposits = deposits.filter(d => d.status === 'completed');
  const lastDeposit = completedDeposits.length > 0 
    ? format(new Date(completedDeposits[0].created_at), 'dd.MM.yyyy', { locale: dateLocale })
    : '-';
  const totalTransactions = deposits.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.deposit.pageTitle}</h1>
        <p className="text-muted-foreground mt-1">
          {t.deposit.pageSubtitle}
        </p>
      </div>

      {/* Current Balance */}
      <BalanceOverview balanceUsd={balanceUsd} onDepositClick={() => setDepositModalOpen(true)} />

      {/* Action Buttons */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30" onClick={() => setDepositModalOpen(true)}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <ArrowDownToLine className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{t.deposit.depositFunds}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.deposit.depositFundsDesc}
                </p>
                <Button className="mt-4 gradient-bg text-primary-foreground hover:opacity-90">
                  {t.common.deposit}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30" onClick={() => setWithdrawModalOpen(true)}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowUpFromLine className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{t.deposit.withdrawFunds}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.deposit.withdrawFundsDesc}
                </p>
                <Button variant="outline" className="mt-4">
                  {t.common.withdraw}
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
                <p className="text-sm text-muted-foreground">{t.deposit.lastDeposit}</p>
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
                <p className="text-sm text-muted-foreground">{t.deposit.lastWithdrawal}</p>
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
                <p className="text-sm text-muted-foreground">{t.deposit.totalTransactions}</p>
                <p className="font-semibold text-foreground">{totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Transaction History */}
      <TransactionHistory deposits={deposits} />

      {/* Deposit Modal */}
      <DepositModal open={depositModalOpen} onOpenChange={setDepositModalOpen} />
      
      {/* Withdraw Modal */}
      <WithdrawModal open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen} />
    </div>
  );
}
