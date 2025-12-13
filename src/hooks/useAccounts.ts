import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export type AccountStatus = 'active' | 'expired' | 'canceled' | 'suspended';

export interface AccountFilters {
  search: string;
  status: AccountStatus[];
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface Account {
  id: string;
  name: string;
  platform: string;
  status: string;
  account_status: AccountStatus;
  monthly_budget: number | null;
  user_id: string | null;
  start_date: string | null;
  expire_at: string | null;
  balance_eur: number;
  balance_usdt: number;
  created_at: string;
  updated_at: string | null;
  updated_by: string | null;
  branding_id: string | null;
  assigned_to: string | null;
  user_email?: string;
  user_company?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string | null;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description: string | null;
  created_at: string;
}

const defaultFilters: AccountFilters = {
  search: '',
  status: [],
  dateFrom: null,
  dateTo: null,
};

export function useAccounts(filters: AccountFilters = defaultFilters) {
  return useQuery({
    queryKey: ['accounts', filters],
    queryFn: async () => {
      let query = supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
      }

      if (filters.status.length > 0) {
        query = query.in('account_status', filters.status);
      }

      if (filters.dateFrom) {
        query = query.gte('start_date', filters.dateFrom.toISOString());
      }

      if (filters.dateTo) {
        query = query.lte('expire_at', filters.dateTo.toISOString());
      }

      const { data: accounts, error } = await query;

      if (error) throw error;

      // Fetch user emails for accounts with user_id
      const userIds = [...new Set(accounts?.filter(a => a.user_id).map(a => a.user_id))];
      
      let profiles: { id: string; email: string; company_name: string | null }[] = [];
      if (userIds.length > 0) {
        const { data } = await supabase
          .from('profiles')
          .select('id, email, company_name')
          .in('id', userIds);
        profiles = data || [];
      }

      const profileMap = new Map(profiles.map(p => [p.id, p]));

      return accounts?.map(account => ({
        ...account,
        account_status: (account.account_status || 'active') as AccountStatus,
        balance_eur: account.balance_eur || 0,
        balance_usdt: account.balance_usdt || 0,
        user_email: account.user_id ? profileMap.get(account.user_id)?.email : undefined,
        user_company: account.user_id ? profileMap.get(account.user_id)?.company_name : undefined,
      })) as Account[];
    },
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      const { data: account, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!account) return null;

      let userEmail: string | undefined;
      let userCompany: string | undefined;

      if (account.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, company_name')
          .eq('id', account.user_id)
          .maybeSingle();
        
        userEmail = profile?.email;
        userCompany = profile?.company_name || undefined;
      }

      return {
        ...account,
        account_status: (account.account_status || 'active') as AccountStatus,
        balance_eur: account.balance_eur || 0,
        balance_usdt: account.balance_usdt || 0,
        user_email: userEmail,
        user_company: userCompany,
      } as Account;
    },
    enabled: !!id,
  });
}

export function useAccountTransactions(accountId: string) {
  return useQuery({
    queryKey: ['account-transactions', accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!accountId,
  });
}

export function useExtendAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      accountId, 
      newExpireAt, 
      note 
    }: { 
      accountId: string; 
      newExpireAt: Date; 
      note?: string 
    }) => {
      const { data: oldAccount, error: fetchError } = await supabase
        .from('accounts')
        .select('expire_at')
        .eq('id', accountId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('accounts')
        .update({ 
          expire_at: newExpireAt.toISOString(),
          updated_by: user?.id,
        })
        .eq('id', accountId);

      if (updateError) throw updateError;

      // Create audit log
      const { error: auditError } = await supabase
        .from('account_audit_logs')
        .insert({
          account_id: accountId,
          user_id: user?.id,
          action: 'extend',
          details: {
            old_expire_at: oldAccount.expire_at,
            new_expire_at: newExpireAt.toISOString(),
            note,
          },
        });

      if (auditError) throw auditError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['account-audit-logs'] });
      toast({ title: 'Account verlängert', description: 'Das Ablaufdatum wurde aktualisiert.' });
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Account konnte nicht verlängert werden.', variant: 'destructive' });
    },
  });
}

export function useSuspendAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      accountId, 
      reason 
    }: { 
      accountId: string; 
      reason: string 
    }) => {
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ 
          account_status: 'suspended',
          updated_by: user?.id,
        })
        .eq('id', accountId);

      if (updateError) throw updateError;

      const { error: auditError } = await supabase
        .from('account_audit_logs')
        .insert({
          account_id: accountId,
          user_id: user?.id,
          action: 'suspend',
          details: { reason },
        });

      if (auditError) throw auditError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['account-audit-logs'] });
      toast({ title: 'Account gesperrt', description: 'Der Account wurde erfolgreich gesperrt.' });
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Account konnte nicht gesperrt werden.', variant: 'destructive' });
    },
  });
}

export function useRefundAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      amount, 
      reason 
    }: { 
      userId: string; 
      amount: number; 
      reason: string 
    }) => {
      // Get current user balance
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('balance_eur')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      // Update user balance (add refund amount)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance_eur: (profile.balance_eur || 0) + amount })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Create refund transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          amount: amount,
          currency: 'EUR',
          type: 'refund',
          status: 'completed',
          description: `Refund: ${reason}`,
        });

      if (transactionError) throw transactionError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['account-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['user-balance'] });
      toast({ title: 'Refund durchgeführt', description: 'Der Betrag wurde dem Nutzer-Guthaben gutgeschrieben.' });
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Refund konnte nicht durchgeführt werden.', variant: 'destructive' });
    },
  });
}

export function useReactivateAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      accountId, 
      note 
    }: { 
      accountId: string; 
      note?: string 
    }) => {
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ 
          account_status: 'active',
          updated_by: user?.id,
        })
        .eq('id', accountId);

      if (updateError) throw updateError;

      const { error: auditError } = await supabase
        .from('account_audit_logs')
        .insert({
          account_id: accountId,
          user_id: user?.id,
          action: 'reactivate',
          details: { note },
        });

      if (auditError) throw auditError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['account-audit-logs'] });
      toast({ title: 'Account reaktiviert', description: 'Der Account ist wieder aktiv.' });
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Account konnte nicht reaktiviert werden.', variant: 'destructive' });
    },
  });
}
