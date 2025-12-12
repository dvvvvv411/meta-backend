import { useQuery } from '@tanstack/react-query';
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
}

export const useAdvertiserAccount = () => {
  const { user } = useAuth();

  const { data: account, isLoading, error } = useQuery({
    queryKey: ['advertiser-account', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('account_status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data as AdvertiserAccount | null;
    },
    enabled: !!user?.id,
  });

  const hasActiveAccount = !!account && account.account_status === 'active';
  const balanceEur = account?.balance_eur ?? 0;
  const balanceUsdt = account?.balance_usdt ?? 0;

  return {
    account,
    hasActiveAccount,
    balanceEur,
    balanceUsdt,
    isLoading,
    error,
  };
};
