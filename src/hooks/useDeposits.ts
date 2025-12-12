import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CRYPTO_CONFIG, DEPOSIT_FEE_PERCENT } from '@/lib/crypto-config';

export interface Deposit {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  coin_type: string;
  network: string | null;
  gross_amount: number | null;
  fee_amount: number | null;
  confirmations: number;
  confirmations_required: number;
  wallet_address: string | null;
  tx_hash: string | null;
  created_at: string;
}

export const useDeposits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: deposits, isLoading } = useQuery({
    queryKey: ['deposits', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .in('type', ['deposit', 'rental', 'withdrawal'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Deposit[];
    },
    enabled: !!user?.id,
  });

  const createDeposit = useMutation({
    mutationFn: async ({
      coinType,
      grossAmount,
      eurAmount,
    }: {
      coinType: string;
      grossAmount: number;
      eurAmount: number;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const coinConfig = CRYPTO_CONFIG[coinType];
      const feeAmount = grossAmount * (DEPOSIT_FEE_PERCENT / 100);
      const netAmount = grossAmount - feeAmount;

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: eurAmount * (1 - DEPOSIT_FEE_PERCENT / 100), // Net EUR amount
          currency: 'EUR',
          status: 'pending',
          description: `Einzahlung via ${coinType}`,
          coin_type: coinType,
          network: coinConfig.network,
          gross_amount: grossAmount,
          fee_amount: feeAmount,
          confirmations: 0,
          confirmations_required: coinConfig.confirmationsRequired,
          wallet_address: coinConfig.address,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] });
      queryClient.invalidateQueries({ queryKey: ['advertiser-accounts'] });
    },
  });

  const pendingDeposits = deposits?.filter((d) => d.status === 'pending') || [];
  const completedDeposits = deposits?.filter((d) => d.status === 'completed') || [];
  const totalDeposited = completedDeposits.reduce((sum, d) => sum + d.amount, 0);

  return {
    deposits: deposits || [],
    pendingDeposits,
    completedDeposits,
    totalDeposited,
    isLoading,
    createDeposit,
  };
};
