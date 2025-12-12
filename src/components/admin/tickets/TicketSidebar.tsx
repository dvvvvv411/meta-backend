import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format } from "date-fns";
import { de } from "date-fns/locale";
import { User, Calendar, Clock, Paperclip, AlertTriangle } from "lucide-react";
import { Ticket, TicketStatus, TicketPriority, useUpdateTicket } from "@/hooks/useTickets";
import { useTicketAttachments } from "@/hooks/useTicketAttachments";

interface TicketSidebarProps {
  ticket: Ticket;
  adminProfiles?: { id: string; email: string }[];
}

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: "Niedrig", className: "bg-green-100 text-green-800" },
  normal: { label: "Normal", className: "bg-blue-100 text-blue-800" },
  high: { label: "Hoch", className: "bg-orange-100 text-orange-800" },
  urgent: { label: "Dringend", className: "bg-red-100 text-red-800" },
};

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: "Offen", className: "bg-emerald-100 text-emerald-800" },
  in_progress: { label: "In Bearbeitung", className: "bg-yellow-100 text-yellow-800" },
  waiting: { label: "Wartend", className: "bg-purple-100 text-purple-800" },
  resolved: { label: "Gelöst", className: "bg-sky-100 text-sky-800" },
  closed: { label: "Geschlossen", className: "bg-gray-100 text-gray-800" },
};

function getSlaInfo(slaDueAt: string | null) {
  if (!slaDueAt) return null;
  const now = new Date();
  const slaDue = new Date(slaDueAt);
  const hoursUntilDue = (slaDue.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilDue < 0) {
    return { label: "Überfällig", isOverdue: true, time: format(slaDue, "dd.MM.yyyy HH:mm") };
  }
  if (hoursUntilDue <= 2) {
    return { label: `${Math.round(hoursUntilDue * 60)} Minuten`, isWarning: true, time: format(slaDue, "dd.MM.yyyy HH:mm") };
  }
  return { label: `${Math.round(hoursUntilDue)} Stunden`, time: format(slaDue, "dd.MM.yyyy HH:mm") };
}

export function TicketSidebar({ ticket, adminProfiles = [] }: TicketSidebarProps) {
  const updateTicket = useUpdateTicket();
  const { data: attachments } = useTicketAttachments(ticket.id);

  const priority = ticket.ticket_priority || "normal";
  const status = ticket.ticket_status || "open";
  const slaInfo = getSlaInfo(ticket.sla_due_at);

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicket.mutate({ id: ticket.id, updates: { ticket_status: newStatus } });
  };

  const handlePriorityChange = (newPriority: TicketPriority) => {
    updateTicket.mutate({ id: ticket.id, updates: { ticket_priority: newPriority } });
  };

  const handleAssignChange = (assignedTo: string) => {
    const value = assignedTo === "unassigned" ? null : assignedTo;
    updateTicket.mutate({ id: ticket.id, updates: { assigned_to: value } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <Badge className={statusConfig[status].className}>
              {statusConfig[status].label}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Priorität</h3>
        <Select value={priority} onValueChange={handlePriorityChange}>
          <SelectTrigger>
            <Badge className={priorityConfig[priority].className}>
              {priorityConfig[priority].label}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(priorityConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Zugewiesen an</h3>
        <Select
          value={ticket.assigned_to || "unassigned"}
          onValueChange={handleAssignChange}
        >
          <SelectTrigger>
            <SelectValue>
              {ticket.assigned_email || "Nicht zugewiesen"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Nicht zugewiesen</SelectItem>
            {adminProfiles.map((admin) => (
              <SelectItem key={admin.id} value={admin.id}>
                {admin.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {slaInfo && (
        <div className={`p-3 rounded-lg ${slaInfo.isOverdue ? "bg-red-50 dark:bg-red-950" : slaInfo.isWarning ? "bg-orange-50 dark:bg-orange-950" : "bg-muted"}`}>
          <div className="flex items-center gap-2 mb-1">
            {(slaInfo.isOverdue || slaInfo.isWarning) && (
              <AlertTriangle className={`h-4 w-4 ${slaInfo.isOverdue ? "text-red-500" : "text-orange-500"}`} />
            )}
            <span className="text-sm font-medium">SLA-Frist</span>
          </div>
          <div className="text-sm">{slaInfo.time}</div>
          <div className={`text-xs ${slaInfo.isOverdue ? "text-red-600" : slaInfo.isWarning ? "text-orange-600" : "text-muted-foreground"}`}>
            {slaInfo.isOverdue ? "Überfällig" : `Noch ${slaInfo.label}`}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Erstellt von:</span>
          <span>{ticket.user_email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Erstellt:</span>
          <span>
            {ticket.created_at && format(new Date(ticket.created_at), "dd.MM.yyyy HH:mm")}
          </span>
        </div>
        {ticket.last_reply_at && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Letzte Antwort:</span>
            <span>
              {formatDistanceToNow(new Date(ticket.last_reply_at), {
                addSuffix: true,
                locale: de,
              })}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Anhänge:</span>
          <span>{attachments?.length || 0} Dateien</span>
        </div>
      </div>

      {attachments && attachments.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Anhänge</h3>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <Button
                  key={attachment.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  asChild
                >
                  <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                    <Paperclip className="h-4 w-4 mr-2" />
                    <span className="truncate">{attachment.file_name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
