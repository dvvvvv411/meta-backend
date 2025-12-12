import { useCallback } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { generateCSV, downloadCSV, formatDateForCSV, formatCurrencyForCSV, CSVColumn } from '@/lib/csv-export';
import { Account, Transaction } from './useAccounts';
import { useToast } from '@/hooks/use-toast';

export function useExportAccountsCSV() {
  const { toast } = useToast();

  const exportAccounts = useCallback((accounts: Account[]) => {
    const columns: CSVColumn<Account>[] = [
      { header: 'Account-ID', accessor: 'id' },
      { header: 'Name', accessor: 'name' },
      { header: 'Nutzer E-Mail', accessor: (a) => a.user_email || '' },
      { header: 'Firma', accessor: (a) => a.user_company || '' },
      { header: 'Plattform', accessor: 'platform' },
      { header: 'Startdatum', accessor: (a) => formatDateForCSV(a.start_date) },
      { header: 'Ablaufdatum', accessor: (a) => formatDateForCSV(a.expire_at) },
      { header: 'Status', accessor: 'account_status' },
      { header: 'Guthaben EUR', accessor: (a) => formatCurrencyForCSV(a.balance_eur) },
      { header: 'Guthaben USDT', accessor: (a) => formatCurrencyForCSV(a.balance_usdt) },
      { header: 'Monatl. Budget', accessor: (a) => formatCurrencyForCSV(a.monthly_budget) },
    ];

    const csv = generateCSV(accounts, columns);
    const filename = `accounts_export_${format(new Date(), 'yyyy-MM-dd_HHmm', { locale: de })}.csv`;
    
    downloadCSV(csv, filename);
    
    toast({
      title: 'Export erfolgreich',
      description: `${accounts.length} Accounts wurden exportiert.`,
    });
  }, [toast]);

  return { exportAccounts };
}

export function useExportTransactionsCSV() {
  const { toast } = useToast();

  const exportTransactions = useCallback((transactions: Transaction[], accountName?: string) => {
    const columns: CSVColumn<Transaction>[] = [
      { header: 'Transaktions-ID', accessor: 'id' },
      { header: 'Datum', accessor: (t) => formatDateForCSV(t.created_at) },
      { header: 'Typ', accessor: 'type' },
      { header: 'Betrag', accessor: (t) => formatCurrencyForCSV(t.amount) },
      { header: 'Währung', accessor: 'currency' },
      { header: 'Status', accessor: 'status' },
      { header: 'Beschreibung', accessor: (t) => t.description || '' },
    ];

    const csv = generateCSV(transactions, columns);
    const prefix = accountName ? `transactions_${accountName}` : 'transactions';
    const filename = `${prefix}_${format(new Date(), 'yyyy-MM-dd_HHmm', { locale: de })}.csv`;
    
    downloadCSV(csv, filename);
    
    toast({
      title: 'Export erfolgreich',
      description: `${transactions.length} Transaktionen wurden exportiert.`,
    });
  }, [toast]);

  return { exportTransactions };
}
