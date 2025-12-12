import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  message_id: string | null;
  file_name: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string;
  created_at: string;
}

export function useTicketAttachments(ticketId: string) {
  return useQuery({
    queryKey: ["ticket-attachments", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_attachments")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TicketAttachment[];
    },
    enabled: !!ticketId,
  });
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      ticketId,
      messageId,
      file,
      userId,
    }: {
      ticketId: string;
      messageId?: string;
      file: File;
      userId: string;
    }) => {
      const fileName = `${ticketId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from("ticket-attachments")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("ticket-attachments")
        .getPublicUrl(fileName);

      const { data, error } = await supabase
        .from("ticket_attachments")
        .insert({
          ticket_id: ticketId,
          message_id: messageId || null,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          file_type: file.type,
          uploaded_by: userId,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-attachments", ticketId] });
      toast({ title: "Datei hochgeladen" });
    },
    onError: (error) => {
      toast({ title: "Fehler beim Hochladen", description: error.message, variant: "destructive" });
    },
  });
}
