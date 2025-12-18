import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Clock,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow, format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SupportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const dateLocale = language === 'de' ? de : enUS;

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['user-tickets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary">{t.support.open}</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600">{t.support.inProgress}</Badge>;
      case 'waiting':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{t.support.waiting}</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500 hover:bg-green-600">{t.support.resolved}</Badge>;
      case 'closed':
        return <Badge variant="outline">{t.support.closed}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      technical: t.support.categoryTechnical,
      payment: t.support.categoryBilling,
      account: t.support.categoryAccount,
      campaign: language === 'de' ? 'Kampagnen & Werbung' : 'Campaigns & Advertising',
      general: t.support.categoryOther,
    };
    return categories[category] || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.support.pageTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {t.support.pageSubtitle}
          </p>
        </div>
        <Button onClick={() => navigate('/advertiser/support/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          {t.support.createTicket}
        </Button>
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-16 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : tickets && tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
              onClick={() => navigate(`/advertiser/support/${ticket.id}`)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {ticket.subject}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>
                            {format(new Date(ticket.created_at!), 'dd.MM.yyyy, HH:mm', {
                              locale: dateLocale,
                            })}
                          </span>
                          {ticket.category && (
                            <>
                              <span>•</span>
                              <span>{getCategoryLabel(ticket.category)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(ticket.status || 'open')}
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    {ticket.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {ticket.description}
                      </p>
                    )}

                    {ticket.last_reply_at && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          {t.support.lastResponse}{' '}
                          {formatDistanceToNow(new Date(ticket.last_reply_at), {
                            addSuffix: true,
                            locale: dateLocale,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{t.support.noTickets}</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              {t.support.noTicketsDesc}
            </p>
            <Button onClick={() => navigate('/advertiser/support/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              {t.support.createTicket}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
