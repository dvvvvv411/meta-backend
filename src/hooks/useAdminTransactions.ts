import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminTransaction {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string | null;
  type: string;
  status: string | null;
  payment_status: string | null;
  description: string | null;
  created_at: string | null;
  coin_type: string | null;
  pay_amount: number | null;
  pay_currency: string | null;
}

export function useAdminTransactions() {
  return useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      // First get all transactions
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (txError) throw txError;

      // Get all profiles for mapping
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email');

      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles?.map(p => [p.id, p.email]) || []);

      return (transactions || []).map(tx => ({
        ...tx,
        user_email: profileMap.get(tx.user_id) || 'Unbekannt',
      })) as AdminTransaction[];
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: transactionsCount },
        { count: accountsCount },
        { count: ticketsCount },
        { data: openTickets },
        { data: recentTransactions },
        { data: recentUsers },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('*', { count: 'exact', head: true }),
        supabase.from('accounts').select('*', { count: 'exact', head: true }),
        supabase.from('tickets').select('*', { count: 'exact', head: true }),
        supabase.from('tickets').select('id, ticket_status').eq('ticket_status', 'open'),
        supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      return {
        usersCount: usersCount || 0,
        transactionsCount: transactionsCount || 0,
        accountsCount: accountsCount || 0,
        ticketsCount: ticketsCount || 0,
        openTicketsCount: openTickets?.length || 0,
        recentTransactions: recentTransactions || [],
        recentUsers: recentUsers || [],
      };
    },
  });
}
