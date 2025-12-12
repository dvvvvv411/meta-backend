import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Clock, Ban, RefreshCw, UserCheck, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccountAuditLogs, AuditLog } from '@/hooks/useAccountAudit';

interface AccountAuditLogProps {
  accountId: string;
}

const actionConfig: Record<string, { icon: typeof Clock; label: string; color: string }> = {
  extend: { icon: Clock, label: 'Verlängert', color: 'text-blue-500' },
  suspend: { icon: Ban, label: 'Gesperrt', color: 'text-red-500' },
  refund: { icon: RefreshCw, label: 'Refund', color: 'text-amber-500' },
  reactivate: { icon: UserCheck, label: 'Reaktiviert', color: 'text-green-500' },
};

function AuditLogItem({ log }: { log: AuditLog }) {
  const config = actionConfig[log.action] || { icon: History, label: log.action, color: 'text-muted-foreground' };
  const Icon = config.icon;

  const formatDetails = () => {
    const details = log.details;
    const parts: string[] = [];

    if (details.old_expire_at && details.new_expire_at) {
      const oldDate = format(new Date(details.old_expire_at as string), 'dd.MM.yyyy', { locale: de });
      const newDate = format(new Date(details.new_expire_at as string), 'dd.MM.yyyy', { locale: de });
      parts.push(`${oldDate} → ${newDate}`);
    }

    if (details.amount && details.currency) {
      parts.push(`${details.amount} ${details.currency}`);
    }

    if (details.reason) {
      parts.push(`Grund: ${details.reason}`);
    }

    if (details.note) {
      parts.push(`Notiz: ${details.note}`);
    }

    return parts.join(' • ');
  };

  return (
    <div className="flex gap-3 py-3 border-b last:border-0">
      <div className={`mt-0.5 ${config.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-sm">{config.label}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(log.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{log.user_email || 'Unbekannt'}</p>
        {formatDetails() && (
          <p className="text-xs text-muted-foreground mt-1">{formatDetails()}</p>
        )}
      </div>
    </div>
  );
}

export function AccountAuditLog({ accountId }: AccountAuditLogProps) {
  const { data: logs, isLoading } = useAccountAuditLogs(accountId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Audit-Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5" />
          Audit-Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs && logs.length > 0 ? (
          <div className="divide-y">
            {logs.map((log) => (
              <AuditLogItem key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Keine Aktivitäten vorhanden.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
