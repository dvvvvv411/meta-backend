import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  wallet_address: string;
  status: string;
  created_at: string;
  description: string | null;
  user_email?: string;
}

export const useWithdrawals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Create withdrawal request
  const createWithdrawalRequest = useMutation({
    mutationFn: async ({ amount, walletAddress }: { amount: number; walletAddress: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      // First check if user has sufficient balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance_eur')
        .eq('id', user.id)
        .single();

      if (profileError) throw new Error('Could not fetch balance');
      if (!profile || profile.balance_eur < amount) {
        throw new Error('Insufficient balance');
      }

      // Create the withdrawal transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: amount,
          currency: 'EUR',
          status: 'pending',
          wallet_address: walletAddress,
          description: `Auszahlung an ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
          coin_type: 'USDT',
          network: 'ERC20',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['user-balance'] });
    },
  });

  return {
    createWithdrawalRequest,
  };
};

// Admin hook for managing withdrawals
export const useAdminWithdrawals = () => {
  const queryClient = useQueryClient();

  // Fetch all withdrawal requests
  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: async () => {
      // First get all withdrawal transactions
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'withdrawal')
        .order('created_at', { ascending: false });

      if (txError) throw txError;

      // Get unique user IDs
      const userIds = [...new Set(transactions.map(t => t.user_id))];

      // Fetch user emails
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (profileError) throw profileError;

      // Map emails to transactions
      const emailMap = new Map(profiles?.map(p => [p.id, p.email]) || []);

      return transactions.map(t => ({
        ...t,
        user_email: emailMap.get(t.user_id) || 'Unknown',
      })) as Withdrawal[];
    },
  });

  // Approve withdrawal
  const approveWithdrawal = useMutation({
    mutationFn: async (withdrawalId: string) => {
      // Get the withdrawal first
      const { data: withdrawal, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', withdrawalId)
        .single();

      if (fetchError) throw fetchError;
      if (!withdrawal) throw new Error('Withdrawal not found');

      // Deduct from user balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance_eur')
        .eq('id', withdrawal.user_id)
        .single();

      if (profileError) throw profileError;
      if (!profile || profile.balance_eur < withdrawal.amount) {
        throw new Error('Insufficient user balance');
      }

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance_eur: profile.balance_eur - withdrawal.amount })
        .eq('id', withdrawal.user_id);

      if (balanceError) throw balanceError;

      // Update transaction status
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: 'completed' })
        .eq('id', withdrawalId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    },
  });

  // Decline withdrawal
  const declineWithdrawal = useMutation({
    mutationFn: async (withdrawalId: string) => {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', withdrawalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    },
  });

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const completedWithdrawals = withdrawals.filter(w => w.status === 'completed');
  const failedWithdrawals = withdrawals.filter(w => w.status === 'failed');

  return {
    withdrawals,
    pendingWithdrawals,
    completedWithdrawals,
    failedWithdrawals,
    isLoading,
    approveWithdrawal,
    declineWithdrawal,
  };
};