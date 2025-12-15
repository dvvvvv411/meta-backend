import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, Loader2, X, Send } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUploadAttachment } from '@/hooks/useTicketAttachments';

const CATEGORIES = [
  { value: 'technical', label: 'Technisches Problem' },
  { value: 'payment', label: 'Zahlungen & Guthaben' },
  { value: 'account', label: 'Account & Zugang' },
  { value: 'campaign', label: 'Kampagnen & Werbung' },
  { value: 'general', label: 'Allgemeine Anfrage' },
];

export default function NewTicketPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAttachment = useUploadAttachment();

  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const createTicket = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Nicht eingeloggt');

      const { data: ticket, error } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          subject: subject.trim(),
          description: description.trim(),
          category: category || 'general',
          status: 'open',
          priority: 'normal',
        })
        .select()
        .single();

      if (error) throw error;

      // Upload attachment if exists
      if (attachedFile && ticket) {
        await uploadAttachment.mutateAsync({
          ticketId: ticket.id,
          file: attachedFile,
          userId: user.id,
        });
      }

      return ticket;
    },
    onSuccess: (ticket) => {
      toast({
        title: 'Ticket erstellt',
        description: 'Dein Support-Ticket wurde erfolgreich erstellt.',
      });
      navigate(`/advertiser/support/${ticket.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: 'Das Ticket konnte nicht erstellt werden.',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || subject.trim().length < 5) {
      toast({
        title: 'Betreff erforderlich',
        description: 'Bitte gib einen Betreff mit mindestens 5 Zeichen ein.',
        variant: 'destructive',
      });
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      toast({
        title: 'Beschreibung erforderlich',
        description: 'Bitte beschreibe dein Anliegen mit mindestens 20 Zeichen.',
        variant: 'destructive',
      });
      return;
    }

    createTicket.mutate();
  };

  const isSubmitting = createTicket.isPending || uploadAttachment.isPending;

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

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Neues Support-Ticket erstellen</CardTitle>
            <CardDescription>
              Beschreibe dein Anliegen so detailliert wie möglich. Unser Support-Team wird sich
              schnellstmöglich bei dir melden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Kategorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle eine Kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  Betreff <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Kurze Zusammenfassung deines Anliegens"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {subject.length}/200 Zeichen (min. 5)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Beschreibung <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreibe dein Anliegen ausführlich. Je mehr Details du angibst, desto schneller können wir dir helfen."
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {description.length} Zeichen (min. 20)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Anhang (optional)</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                {attachedFile ? (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1 truncate">{attachedFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(attachedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setAttachedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Paperclip className="h-4 w-4" />
                    Datei hinzufügen
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  Max. 10 MB • Bilder, PDF, Word-Dokumente
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/advertiser/support')}
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Wird erstellt...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Ticket erstellen
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
