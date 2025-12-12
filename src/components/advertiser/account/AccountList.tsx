import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AccountCard } from './AccountCard';
import type { AdvertiserAccount } from '@/hooks/useAdvertiserAccounts';

interface AccountListProps {
  accounts: AdvertiserAccount[];
  onToggleAutoRenew: (accountId: string, autoRenew: boolean) => void;
  isToggling?: boolean;
  onAddAccount: () => void;
  customerName: string;
  customerEmail: string;
  companyName?: string;
}

export function AccountList({ 
  accounts, 
  onToggleAutoRenew, 
  isToggling,
  onAddAccount,
  customerName,
  customerEmail,
  companyName,
}: AccountListProps) {
  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Bereits gemietete Accounts
      </h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onToggleAutoRenew={onToggleAutoRenew}
            isToggling={isToggling}
            customerName={customerName}
            customerEmail={customerEmail}
            companyName={companyName}
          />
        ))}

        <Card 
          className="border-dashed cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          onClick={onAddAccount}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium">Weiteren Account mieten</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
