import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export interface Notification {
  id: string;
  type: 'payment' | 'account_expiry' | 'ticket_reply';
  title: string;
  message: string;
  time: string;
  createdAt: Date;
  link?: string;
}

export function useNotifications() {
  const { user } = useAuth();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [depositsRes, accountsRes, ticketMessagesRes] = await Promise.all([
        // Completed deposits in last 7 days
        supabase
          .from('transactions')
          .select('id, amount, created_at')
          .eq('user_id', user.id)
          .eq('type', 'deposit')
          .eq('status', 'completed')
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(10),

        // Accounts expiring in next 7 days
        supabase
          .from('accounts')
          .select('id, name, expire_at')
          .eq('user_id', user.id)
          .gte('expire_at', new Date().toISOString())
          .lte('expire_at', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('expire_at', { ascending: true }),

        // Ticket messages (support replies) in last 7 days
        supabase
          .from('ticket_messages')
          .select(`
            id,
            created_at,
            ticket_id,
            user_id,
            tickets!inner(subject, user_id)
          `)
          .eq('is_internal', false)
          .neq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      const allNotifications: Notification[] = [];

      // Payment notifications
      if (depositsRes.data) {
        for (const deposit of depositsRes.data) {
          allNotifications.push({
            id: `payment-${deposit.id}`,
            type: 'payment',
            title: 'Zahlung erhalten',
            message: `${deposit.amount.toLocaleString('de-DE')} € wurde gutgeschrieben`,
            time: formatDistanceToNow(new Date(deposit.created_at), { addSuffix: true, locale: de }),
            createdAt: new Date(deposit.created_at),
            link: '/advertiser/deposit'
          });
        }
      }

      // Account expiry notifications
      if (accountsRes.data) {
        for (const account of accountsRes.data) {
          const daysRemaining = Math.ceil(
            (new Date(account.expire_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          allNotifications.push({
            id: `expiry-${account.id}`,
            type: 'account_expiry',
            title: 'Account läuft ab',
            message: `${account.name} läuft in ${daysRemaining} ${daysRemaining === 1 ? 'Tag' : 'Tagen'} ab`,
            time: formatDistanceToNow(new Date(account.expire_at), { addSuffix: true, locale: de }),
            createdAt: new Date(account.expire_at),
            link: '/advertiser/rent-account'
          });
        }
      }

      // Ticket reply notifications
      if (ticketMessagesRes.data) {
        const ticketReplies = ticketMessagesRes.data.filter(
          msg => (msg.tickets as any)?.user_id === user.id
        );
        for (const reply of ticketReplies) {
          allNotifications.push({
            id: `ticket-${reply.id}`,
            type: 'ticket_reply',
            title: 'Neue Support-Antwort',
            message: `Antwort auf: ${(reply.tickets as any)?.subject || 'Ticket'}`,
            time: formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: de }),
            createdAt: new Date(reply.created_at),
            link: `/advertiser/support/${reply.ticket_id}`
          });
        }
      }

      // Sort by date (newest first)
      return allNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    enabled: !!user?.id,
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    notifications,
    unreadCount: notifications.length,
    isLoading
  };
}
