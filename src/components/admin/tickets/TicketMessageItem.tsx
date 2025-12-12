import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Lock, User } from "lucide-react";
import { TicketMessage } from "@/hooks/useTicketMessages";

interface TicketMessageItemProps {
  message: TicketMessage;
}

export function TicketMessageItem({ message }: TicketMessageItemProps) {
  const isInternal = message.is_internal;

  return (
    <div
      className={`rounded-lg p-4 ${
        isInternal
          ? "bg-yellow-50 border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
          : "bg-muted"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {isInternal ? (
          <Lock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="font-medium text-sm">{message.user_email}</span>
        {isInternal && (
          <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 rounded">
            Intern
          </span>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {formatDistanceToNow(new Date(message.created_at), {
            addSuffix: true,
            locale: de,
          })}
        </span>
      </div>
      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
    </div>
  );
}
