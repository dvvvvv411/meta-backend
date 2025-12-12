import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AdvertiserAccount {
  id: string;
  name: string;
  platform: string;
  balance_eur: number;
  balance_usdt: number;
  account_status: 'active' | 'expired' | 'canceled' | 'suspended' | null;
  expire_at: string | null;
  start_date: string | null;
  auto_renew: boolean;
  price_paid: number;
  invoice_number: string | null;
  created_at: string;
}

export const useAdvertiserAccounts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ['advertiser-accounts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AdvertiserAccount[];
    },
    enabled: !!user?.id,
  });

  const activeAccounts = accounts?.filter(a => a.account_status === 'active') ?? [];
  const hasActiveAccount = activeAccounts.length > 0;
  const totalBalanceEur = accounts?.reduce((sum, a) => sum + (a.balance_eur ?? 0), 0) ?? 0;
  const totalBalanceUsdt = accounts?.reduce((sum, a) => sum + (a.balance_usdt ?? 0), 0) ?? 0;

  const createAccount = useMutation({
    mutationFn: async (paymentData: { 
      pricePaid: number; 
      paymentMethod: 'crypto' | 'fiat';
      currency: string;
    }) => {
      if (!user?.id) throw new Error('Nicht eingeloggt');

      const now = new Date();
      const expireAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      const invoiceNumber = `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(Date.now()).slice(-6)}`;

      // Create account
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .insert({
          user_id: user.id,
          name: `Agency Account #${(accounts?.length ?? 0) + 1}`,
          platform: 'meta',
          account_status: 'active',
          start_date: now.toISOString(),
          expire_at: expireAt.toISOString(),
          auto_renew: true,
          price_paid: paymentData.pricePaid,
          invoice_number: invoiceNumber,
          balance_eur: 0,
          balance_usdt: 0,
        })
        .select()
        .single();

      if (accountError) throw accountError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: account.id,
          type: 'rental',
          amount: paymentData.pricePaid,
          currency: paymentData.currency,
          status: 'completed',
          description: `Agency Account Miete - 30 Tage (${invoiceNumber})`,
        });

      if (transactionError) throw transactionError;

      return account as AdvertiserAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertiser-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['advertiser-account'] });
    },
  });

  const toggleAutoRenew = useMutation({
    mutationFn: async ({ accountId, autoRenew }: { accountId: string; autoRenew: boolean }) => {
      const { error } = await supabase
        .from('accounts')
        .update({ auto_renew: autoRenew })
        .eq('id', accountId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertiser-accounts'] });
    },
  });

  return {
    accounts: accounts ?? [],
    activeAccounts,
    hasActiveAccount,
    totalBalanceEur,
    totalBalanceUsdt,
    isLoading,
    error,
    createAccount,
    toggleAutoRenew,
  };
};
