import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";

export interface TicketFilters {
  search: string;
  status: TicketStatus[];
  priority: TicketPriority[];
  assignedTo: string | null;
  slaStatus: "all" | "overdue" | "due_soon" | "on_track";
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string | null;
  priority: string | null;
  status: string | null;
  ticket_priority: TicketPriority | null;
  ticket_status: TicketStatus | null;
  user_id: string;
  assigned_to: string | null;
  sla_due_at: string | null;
  closed_at: string | null;
  last_reply_at: string | null;
  is_read: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  user_email?: string;
  assigned_email?: string;
}

export const defaultTicketFilters: TicketFilters = {
  search: "",
  status: [],
  priority: [],
  assignedTo: null,
  slaStatus: "all",
  dateFrom: null,
  dateTo: null,
};

export function useTickets(filters: TicketFilters = defaultTicketFilters) {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: async () => {
      let query = supabase.from("tickets").select("*").order("created_at", { ascending: false });

      if (filters.search) {
        query = query.or(`subject.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
      }

      if (filters.status.length > 0) {
        query = query.in("ticket_status", filters.status);
      }

      if (filters.priority.length > 0) {
        query = query.in("ticket_priority", filters.priority);
      }

      if (filters.assignedTo === "unassigned") {
        query = query.is("assigned_to", null);
      } else if (filters.assignedTo) {
        query = query.eq("assigned_to", filters.assignedTo);
      }

      if (filters.dateFrom) {
        query = query.gte("created_at", filters.dateFrom.toISOString());
      }

      if (filters.dateTo) {
        query = query.lte("created_at", filters.dateTo.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch user emails
      const userIds = [...new Set(data?.map((t) => t.user_id).filter(Boolean) || [])];
      const assignedIds = [...new Set(data?.map((t) => t.assigned_to).filter(Boolean) || [])];
      const allIds = [...new Set([...userIds, ...assignedIds])];

      let profilesMap: Record<string, string> = {};
      if (allIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, email")
          .in("id", allIds);
        profilesMap = (profiles || []).reduce((acc, p) => ({ ...acc, [p.id]: p.email }), {});
      }

      // Filter by SLA status
      let filteredData = (data || []).map((ticket) => ({
        ...ticket,
        user_email: profilesMap[ticket.user_id] || "",
        assigned_email: ticket.assigned_to ? profilesMap[ticket.assigned_to] || "" : "",
      }));

      if (filters.slaStatus !== "all") {
        const now = new Date();
        filteredData = filteredData.filter((ticket) => {
          if (!ticket.sla_due_at) return filters.slaStatus === "on_track";
          const slaDue = new Date(ticket.sla_due_at);
          const hoursUntilDue = (slaDue.getTime() - now.getTime()) / (1000 * 60 * 60);
          if (filters.slaStatus === "overdue") return hoursUntilDue < 0;
          if (filters.slaStatus === "due_soon") return hoursUntilDue >= 0 && hoursUntilDue <= 2;
          return hoursUntilDue > 2;
        });
      }

      return filteredData as Ticket[];
    },
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("tickets").select("*").eq("id", id).single();
      if (error) throw error;

      let userEmail = "";
      let assignedEmail = "";

      if (data.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", data.user_id)
          .single();
        userEmail = profile?.email || "";
      }

      if (data.assigned_to) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", data.assigned_to)
          .single();
        assignedEmail = profile?.email || "";
      }

      return { ...data, user_email: userEmail, assigned_email: assignedEmail } as Ticket;
    },
    enabled: !!id,
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<{
        ticket_status: TicketStatus;
        ticket_priority: TicketPriority;
        assigned_to: string | null;
        is_read: boolean;
      }>;
    }) => {
      const updateData: Record<string, unknown> = { ...updates };
      if (updates.ticket_status === "closed") {
        updateData.closed_at = new Date().toISOString();
      }
      const { error } = await supabase.from("tickets").update(updateData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
      toast({ title: "Ticket aktualisiert" });
    },
    onError: (error) => {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    },
  });
}

export function useBulkUpdateTickets() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      ids,
      updates,
    }: {
      ids: string[];
      updates: Partial<{
        ticket_status: TicketStatus;
        ticket_priority: TicketPriority;
        assigned_to: string | null;
      }>;
    }) => {
      const updateData: Record<string, unknown> = { ...updates };
      if (updates.ticket_status === "closed") {
        updateData.closed_at = new Date().toISOString();
      }
      const { error } = await supabase.from("tickets").update(updateData).in("id", ids);
      if (error) throw error;
    },
    onSuccess: (_, { ids }) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast({ title: `${ids.length} Tickets aktualisiert` });
    },
    onError: (error) => {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    },
  });
}

export function useAdminProfiles() {
  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (rolesError) throw rolesError;

      const adminIds = adminRoles?.map((r) => r.user_id) || [];
      if (adminIds.length === 0) return [];

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", adminIds);
      if (error) throw error;

      return profiles || [];
    },
  });
}

export function useNewTicketCount() {
  return useQuery({
    queryKey: ["new-ticket-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000,
  });
}
