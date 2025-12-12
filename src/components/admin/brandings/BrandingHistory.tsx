import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Clock, User } from 'lucide-react';
import type { Branding } from '@/hooks/useBrandings';

interface BrandingHistoryProps {
  branding: Branding;
}

export function BrandingHistory({ branding }: BrandingHistoryProps) {
  const events = [
    ...(branding.updated_at && branding.updated_by_email
      ? [{
          date: branding.updated_at,
          type: 'update' as const,
          email: branding.updated_by_email,
          description: 'Branding bearbeitet',
        }]
      : []),
    {
      date: branding.created_at,
      type: 'create' as const,
      email: branding.created_by_email,
      description: 'Branding erstellt',
    },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{event.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {format(new Date(event.date), "dd.MM.yyyy 'um' HH:mm 'Uhr'", { locale: de })}
              </span>
              {event.email && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {event.email}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
