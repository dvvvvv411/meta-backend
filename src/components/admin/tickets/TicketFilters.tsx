import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { TicketFilters as TicketFiltersType, TicketStatus, TicketPriority, defaultTicketFilters } from "@/hooks/useTickets";

interface TicketFiltersProps {
  filters: TicketFiltersType;
  onFiltersChange: (filters: TicketFiltersType) => void;
  adminProfiles?: { id: string; email: string }[];
}

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "Offen" },
  { value: "in_progress", label: "In Bearbeitung" },
  { value: "waiting", label: "Wartend" },
  { value: "resolved", label: "Gelöst" },
  { value: "closed", label: "Geschlossen" },
];

const priorityOptions: { value: TicketPriority; label: string; color: string }[] = [
  { value: "low", label: "Niedrig", color: "bg-green-500" },
  { value: "normal", label: "Normal", color: "bg-blue-500" },
  { value: "high", label: "Hoch", color: "bg-orange-500" },
  { value: "urgent", label: "Dringend", color: "bg-red-500" },
];

export function TicketFilters({ filters, onFiltersChange, adminProfiles = [] }: TicketFiltersProps) {
  const toggleStatus = (status: TicketStatus) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const togglePriority = (priority: TicketPriority) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    onFiltersChange({ ...filters, priority: newPriority });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignedTo ||
    filters.slaStatus !== "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Suche nach Ticket-ID, Betreff..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.assignedTo || "all"}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, assignedTo: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Zugewiesen an" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="unassigned">Nicht zugewiesen</SelectItem>
            {adminProfiles.map((admin) => (
              <SelectItem key={admin.id} value={admin.id}>
                {admin.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.slaStatus}
          onValueChange={(value: "all" | "overdue" | "due_soon" | "on_track") =>
            onFiltersChange({ ...filters, slaStatus: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="SLA Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle SLA</SelectItem>
            <SelectItem value="overdue">🔴 Überfällig</SelectItem>
            <SelectItem value="due_soon">🟠 Bald fällig</SelectItem>
            <SelectItem value="on_track">🟢 Im Zeitplan</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={() => onFiltersChange(defaultTicketFilters)}>
            <X className="h-4 w-4 mr-1" />
            Zurücksetzen
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-2">Status:</span>
        {statusOptions.map((option) => (
          <Badge
            key={option.value}
            variant={filters.status.includes(option.value) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleStatus(option.value)}
          >
            {option.label}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-2">Priorität:</span>
        {priorityOptions.map((option) => (
          <Badge
            key={option.value}
            variant={filters.priority.includes(option.value) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => togglePriority(option.value)}
          >
            <span className={`w-2 h-2 rounded-full ${option.color} mr-1`} />
            {option.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
