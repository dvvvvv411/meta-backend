import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useBulkUpdateTickets, TicketStatus, TicketPriority } from "@/hooks/useTickets";

interface TicketBulkActionsProps {
  selectedIds: string[];
  onClear: () => void;
  adminProfiles?: { id: string; email: string }[];
}

export function TicketBulkActions({ selectedIds, onClear, adminProfiles = [] }: TicketBulkActionsProps) {
  const bulkUpdate = useBulkUpdateTickets();

  const handleStatusChange = (status: TicketStatus) => {
    bulkUpdate.mutate({ ids: selectedIds, updates: { ticket_status: status } }, { onSuccess: onClear });
  };

  const handlePriorityChange = (priority: TicketPriority) => {
    bulkUpdate.mutate({ ids: selectedIds, updates: { ticket_priority: priority } }, { onSuccess: onClear });
  };

  const handleAssign = (assignedTo: string) => {
    const value = assignedTo === "unassigned" ? null : assignedTo;
    bulkUpdate.mutate({ ids: selectedIds, updates: { assigned_to: value } }, { onSuccess: onClear });
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      <span className="text-sm font-medium">{selectedIds.length} ausgewählt</span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleStatusChange("closed")}
        disabled={bulkUpdate.isPending}
      >
        Schließen
      </Button>

      <Select onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Offen</SelectItem>
          <SelectItem value="in_progress">In Bearbeitung</SelectItem>
          <SelectItem value="waiting">Wartend</SelectItem>
          <SelectItem value="resolved">Gelöst</SelectItem>
          <SelectItem value="closed">Geschlossen</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={handlePriorityChange}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Priorität" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Niedrig</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="high">Hoch</SelectItem>
          <SelectItem value="urgent">Dringend</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={handleAssign}>
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="Zuweisen" />
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

      <Button variant="ghost" size="sm" onClick={onClear}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
