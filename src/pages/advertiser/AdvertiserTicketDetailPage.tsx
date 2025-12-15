import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, Send, Loader2, Clock, Calendar, User, X, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTicketMessages, useCreateMessage } from '@/hooks/useTicketMessages';
import { useTicketAttachments, useUploadAttachment } from '@/hooks/useTicketAttachments';
import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export default function AdvertiserTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const { data: ticket, isLoading: isLoadingTicket } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: messages, isLoading: isLoadingMessages } = useTicketMessages(id || '');
  const { data: attachments } = useTicketAttachments(id || '');
  const createMessage = useCreateMessage();
  const uploadAttachment = useUploadAttachment();

  // Filter out internal messages (only visible to admins)
  const visibleMessages = messages?.filter((m) => !m.is_internal) || [];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Datei zu groß',
        description: 'Die maximale Dateigröße beträgt 10 MB.',
        variant: 'destructive',
      });
      return;
    }

    setAttachedFile(file);
  };

  const handleSend = async () => {
    if (!message.trim() && !attachedFile) return;
    if (!user?.id || !id) return;

    try {
      if (message.trim()) {
        await createMessage.mutateAsync({
          ticketId: id,
          content: message.trim(),
          isInternal: false,
          userId: user.id,
        });
      }

      if (attachedFile) {
        await uploadAttachment.mutateAsync({
          ticketId: id,
          file: attachedFile,
          userId: user.id,
        });
      }

      setMessage('');
      setAttachedFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary">Offen</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Bearbeitung</Badge>;
      case 'waiting':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Wartet auf Antwort</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500 hover:bg-green-600">Gelöst</Badge>;
      case 'closed':
        return <Badge variant="outline">Geschlossen</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isSending = createMessage.isPending || uploadAttachment.isPending;
  const isLoading = isLoadingTicket || isLoadingMessages;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/advertiser/support')}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zu Tickets
        </Button>
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Ticket nicht gefunden.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/advertiser/support')}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zu Tickets
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{ticket.subject}</h1>
          <p className="text-sm text-muted-foreground">
            Ticket #{ticket.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        {getStatusBadge(ticket.status || 'open')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[600px]">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base">Nachrichten</CardTitle>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Initial ticket description */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] space-y-1">
                    <div className="bg-primary text-primary-foreground rounded-lg rounded-br-sm p-3">
                      <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {format(new Date(ticket.created_at!), 'PPp', { locale: de })}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                {visibleMessages.map((msg) => {
                  const isOwnMessage = msg.user_id === user?.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] space-y-1 ${isOwnMessage ? '' : ''}`}>
                        {!isOwnMessage && (
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Support-Team
                          </p>
                        )}
                        <div
                          className={`rounded-lg p-3 ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-muted rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <p
                          className={`text-xs text-muted-foreground ${
                            isOwnMessage ? 'text-right' : 'text-left'
                          }`}
                        >
                          {formatDistanceToNow(new Date(msg.created_at), {
                            addSuffix: true,
                            locale: de,
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t space-y-3">
              {attachedFile && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1 truncate">{attachedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setAttachedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Schreibe eine Nachricht... (Strg+Enter zum Senden)"
                  className="min-h-[80px] resize-none"
                  disabled={isSending}
                />
                <Button
                  onClick={handleSend}
                  disabled={isSending || (!message.trim() && !attachedFile)}
                  className="self-end"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ticket-Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-0.5">{getStatusBadge(ticket.status || 'open')}</div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Erstellt am</p>
                  <p className="text-sm font-medium">
                    {format(new Date(ticket.created_at!), 'PPP', { locale: de })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Letzte Aktivität</p>
                  <p className="text-sm font-medium">
                    {formatDistanceToNow(
                      new Date(ticket.last_reply_at || ticket.updated_at || ticket.created_at!),
                      { addSuffix: true, locale: de }
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Anhänge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1 truncate">{attachment.file_name}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
