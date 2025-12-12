import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Ticket, TicketPriority, TicketStatus } from "@/hooks/useTickets";
import { TicketBulkActions } from "./TicketBulkActions";

interface TicketsTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  adminProfiles?: { id: string; email: string }[];
}

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: "Niedrig", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
  normal: { label: "Normal", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
  high: { label: "Hoch", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
  urgent: { label: "Dringend", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" },
};

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: "Offen", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100" },
  in_progress: { label: "In Bearbeitung", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" },
  waiting: { label: "Wartend", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
  resolved: { label: "Gelöst", className: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100" },
  closed: { label: "Geschlossen", className: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100" },
};

function getSlaStatus(slaDueAt: string | null): { label: string; className: string } | null {
  if (!slaDueAt) return null;
  const now = new Date();
  const slaDue = new Date(slaDueAt);
  const hoursUntilDue = (slaDue.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilDue < 0) {
    return { label: "Überfällig", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" };
  }
  if (hoursUntilDue <= 2) {
    return { label: `${Math.round(hoursUntilDue * 60)}min`, className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" };
  }
  return { label: `${Math.round(hoursUntilDue)}h`, className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" };
}

export function TicketsTable({ tickets, isLoading, adminProfiles = [] }: TicketsTableProps) {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === tickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tickets.map((t) => t.id));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Keine Tickets gefunden
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <TicketBulkActions
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
          adminProfiles={adminProfiles}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === tickets.length && tickets.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Betreff</TableHead>
              <TableHead>Priorität</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Erstellt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const priority = ticket.ticket_priority || "normal";
              const status = ticket.ticket_status || "open";
              const sla = getSlaStatus(ticket.sla_due_at);

              return (
                <TableRow
                  key={ticket.id}
                  className={`cursor-pointer hover:bg-muted/50 ${!ticket.is_read ? "bg-primary/5" : ""}`}
                  onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(ticket.id)}
                      onCheckedChange={() => toggleSelect(ticket.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    #{ticket.id.slice(0, 8)}
                    {!ticket.is_read && (
                      <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block" />
                    )}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {ticket.user_email}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate font-medium">
                    {ticket.subject}
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityConfig[priority].className}>
                      {priorityConfig[priority].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[status].className}>
                      {statusConfig[status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sla && (
                      <Badge className={sla.className}>{sla.label}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {ticket.created_at &&
                      formatDistanceToNow(new Date(ticket.created_at), {
                        addSuffix: true,
                        locale: de,
                      })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
