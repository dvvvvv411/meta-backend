import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  account_id: string;
  user_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
  user_email?: string;
}

export function useAccountAuditLogs(accountId: string) {
  return useQuery({
    queryKey: ['account-audit-logs', accountId],
    queryFn: async () => {
      const { data: logs, error } = await supabase
        .from('account_audit_logs')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user emails
      const userIds = [...new Set(logs?.map(l => l.user_id) || [])];
      
      let profiles: { id: string; email: string }[] = [];
      if (userIds.length > 0) {
        const { data } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);
        profiles = data || [];
      }

      const profileMap = new Map(profiles.map(p => [p.id, p.email]));

      return logs?.map(log => ({
        ...log,
        details: (log.details || {}) as Record<string, unknown>,
        user_email: profileMap.get(log.user_id),
      })) as AuditLog[];
    },
    enabled: !!accountId,
  });
}
