-- Create enums for ticket priority and status
CREATE TYPE public.ticket_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'waiting', 'resolved', 'closed');

-- Extend tickets table with new columns
ALTER TABLE public.tickets
ADD COLUMN assigned_to UUID REFERENCES public.profiles(id),
ADD COLUMN sla_due_at TIMESTAMPTZ,
ADD COLUMN ticket_priority public.ticket_priority DEFAULT 'normal',
ADD COLUMN ticket_status public.ticket_status DEFAULT 'open',
ADD COLUMN closed_at TIMESTAMPTZ,
ADD COLUMN last_reply_at TIMESTAMPTZ,
ADD COLUMN is_read BOOLEAN DEFAULT FALSE;

-- Create ticket_messages table for chat/notes
CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- RLS for ticket_messages
CREATE POLICY "Admins can manage all messages"
ON public.ticket_messages FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view public messages of own tickets"
ON public.ticket_messages FOR SELECT
USING (
  NOT is_internal 
  AND ticket_id IN (SELECT id FROM public.tickets WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert messages on own tickets"
ON public.ticket_messages FOR INSERT
WITH CHECK (
  ticket_id IN (SELECT id FROM public.tickets WHERE user_id = auth.uid())
  AND is_internal = FALSE
  AND auth.uid() = user_id
);

-- Create ticket_attachments table
CREATE TABLE public.ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.ticket_messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;

-- RLS for ticket_attachments
CREATE POLICY "Admins can manage all attachments"
ON public.ticket_attachments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view attachments of own tickets"
ON public.ticket_attachments FOR SELECT
USING (
  ticket_id IN (SELECT id FROM public.tickets WHERE user_id = auth.uid())
);

CREATE POLICY "Users can upload attachments to own tickets"
ON public.ticket_attachments FOR INSERT
WITH CHECK (
  ticket_id IN (SELECT id FROM public.tickets WHERE user_id = auth.uid())
  AND auth.uid() = uploaded_by
);

-- Create storage bucket for ticket attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('ticket-attachments', 'ticket-attachments', false, 10485760);

-- Storage policies
CREATE POLICY "Authenticated users can upload ticket attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ticket-attachments');

CREATE POLICY "Users can view ticket attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'ticket-attachments');

CREATE POLICY "Users can delete own ticket attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'ticket-attachments' AND auth.uid()::text = owner::text);

-- Function to update last_reply_at
CREATE OR REPLACE FUNCTION public.update_ticket_last_reply()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.tickets
  SET last_reply_at = NOW()
  WHERE id = NEW.ticket_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for last_reply_at
CREATE TRIGGER on_ticket_message_insert
AFTER INSERT ON public.ticket_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_ticket_last_reply();