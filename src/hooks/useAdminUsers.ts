import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  company_name: string | null;
  balance_eur: number | null;
  created_at: string | null;
  accounts_count: number;
  branding_id: string | null;
  branding_name: string | null;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get all profiles and brandings in parallel
      const [profilesResult, accountsResult, brandingsResult] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('accounts').select('user_id'),
        supabase.from('brandings').select('id, name'),
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (accountsResult.error) throw accountsResult.error;

      const accountsCountMap = new Map<string, number>();
      accountsResult.data?.forEach(acc => {
        if (acc.user_id) {
          accountsCountMap.set(acc.user_id, (accountsCountMap.get(acc.user_id) || 0) + 1);
        }
      });

      const brandingsMap = new Map<string, string>(
        brandingsResult.data?.map(b => [b.id, b.name]) || []
      );

      return (profilesResult.data || []).map(profile => ({
        ...profile,
        accounts_count: accountsCountMap.get(profile.id) || 0,
        branding_name: profile.branding_id ? brandingsMap.get(profile.branding_id) || null : null,
      })) as AdminUser[];
    },
  });
}

export function useAdminUserDetail(userId: string | undefined) {
  return useQuery({
    queryKey: ['admin-user-detail', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');

      const [
        { data: profile, error: profileError },
        { data: transactions, error: txError },
        { data: drafts, error: draftsError },
        { data: accounts, error: accountsError },
        { data: userRole, error: roleError },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('campaign_drafts').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
        supabase.from('accounts').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('user_roles').select('role').eq('user_id', userId).single(),
      ]);

      if (profileError) throw profileError;

      return {
        profile,
        transactions: transactions || [],
        drafts: drafts || [],
        accounts: accounts || [],
        role: userRole?.role || 'werbetreibender',
      };
    },
  });
}
