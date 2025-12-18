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
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewTicketPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAttachment = useUploadAttachment();

  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const CATEGORIES = [
    { value: 'technical', label: t.support.categoryTechnical },
    { value: 'payment', label: t.support.categoryBilling },
    { value: 'account', label: t.support.categoryAccount },
    { value: 'campaign', label: language === 'de' ? 'Kampagnen & Werbung' : 'Campaigns & Advertising' },
    { value: 'general', label: t.support.categoryOther },
  ];

  const createTicket = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error(language === 'de' ? 'Nicht eingeloggt' : 'Not logged in');

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
        title: t.support.ticketCreated,
        description: t.support.ticketCreatedDesc,
      });
      navigate(`/advertiser/support/${ticket.id}`);
    },
    onError: (error) => {
      toast({
        title: t.common.error,
        description: language === 'de' ? 'Das Ticket konnte nicht erstellt werden.' : 'The ticket could not be created.',
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
        title: language === 'de' ? 'Datei zu groß' : 'File too large',
        description: language === 'de' ? 'Die maximale Dateigröße beträgt 10 MB.' : 'Maximum file size is 10 MB.',
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
        title: language === 'de' ? 'Betreff erforderlich' : 'Subject required',
        description: language === 'de' ? 'Bitte gib einen Betreff mit mindestens 5 Zeichen ein.' : 'Please enter a subject with at least 5 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      toast({
        title: language === 'de' ? 'Beschreibung erforderlich' : 'Description required',
        description: language === 'de' ? 'Bitte beschreibe dein Anliegen mit mindestens 20 Zeichen.' : 'Please describe your issue with at least 20 characters.',
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
        {t.support.backToTickets}
      </Button>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t.support.newTicketTitle}</CardTitle>
            <CardDescription>
              {t.support.newTicketSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">{t.support.category}</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.support.categoryPlaceholder} />
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
                  {t.support.subject} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t.support.subjectPlaceholder}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {subject.length}/200 {language === 'de' ? 'Zeichen (min. 5)' : 'characters (min. 5)'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t.support.description} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.support.descriptionPlaceholder}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {description.length} {language === 'de' ? 'Zeichen (min. 20)' : 'characters (min. 20)'}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t.support.attachment}</Label>
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
                    {t.support.attachFile}
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  {t.support.attachmentHint}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/advertiser/support')}
                >
                  {t.common.cancel}
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.support.submitting}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t.support.submitTicket}
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
