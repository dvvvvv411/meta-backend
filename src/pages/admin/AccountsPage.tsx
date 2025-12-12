import { useState } from 'react';
import { Download, CreditCard } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AccountsTable } from '@/components/admin/accounts/AccountsTable';
import { AccountFilters } from '@/components/admin/accounts/AccountFilters';
import { useAccounts, AccountFilters as AccountFiltersType } from '@/hooks/useAccounts';
import { useExportAccountsCSV } from '@/hooks/useExportCSV';

export default function AccountsPage() {
  const [filters, setFilters] = useState<AccountFiltersType>({
    search: '',
    status: [],
    dateFrom: null,
    dateTo: null,
  });

  const { data: accounts, isLoading } = useAccounts(filters);
  const { exportAccounts } = useExportAccountsCSV();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Accounts & Billing
            </h1>
            <p className="text-muted-foreground">
              Verwalten Sie alle Agency-Accounts und Transaktionen
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => accounts && exportAccounts(accounts)}
            disabled={!accounts?.length}
          >
            <Download className="mr-2 h-4 w-4" />
            CSV Export
          </Button>
        </div>

        {/* Filters */}
        <AccountFilters filters={filters} onFiltersChange={setFilters} />

        {/* Table */}
        <AccountsTable accounts={accounts} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
