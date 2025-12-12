import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  user_email?: string;
}

export function useTicketMessages(ticketId: string) {
  return useQuery({
    queryKey: ["ticket-messages", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });
      if (error) throw error;

      const userIds = [...new Set(data?.map((m) => m.user_id).filter(Boolean) || [])];
      let profilesMap: Record<string, string> = {};

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, email")
          .in("id", userIds);
        profilesMap = (profiles || []).reduce((acc, p) => ({ ...acc, [p.id]: p.email }), {});
      }

      return (data || []).map((msg) => ({
        ...msg,
        user_email: profilesMap[msg.user_id] || "",
      })) as TicketMessage[];
    },
    enabled: !!ticketId,
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      ticketId,
      content,
      isInternal,
      userId,
    }: {
      ticketId: string;
      content: string;
      isInternal: boolean;
      userId: string;
    }) => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .insert({
          ticket_id: ticketId,
          user_id: userId,
          content,
          is_internal: isInternal,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-messages", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      toast({ title: "Nachricht gesendet" });
    },
    onError: (error) => {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    },
  });
}
