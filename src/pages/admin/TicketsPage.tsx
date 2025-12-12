import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TicketFilters } from "@/components/admin/tickets/TicketFilters";
import { TicketsTable } from "@/components/admin/tickets/TicketsTable";
import { useTickets, defaultTicketFilters, TicketFilters as TicketFiltersType, useNewTicketCount, useAdminProfiles } from "@/hooks/useTickets";

export default function TicketsPage() {
  const [filters, setFilters] = useState<TicketFiltersType>(defaultTicketFilters);
  const { data: tickets, isLoading } = useTickets(filters);
  const { data: newTicketCount } = useNewTicketCount();
  const { data: adminProfiles } = useAdminProfiles();

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ticket-Management</h1>
            <p className="text-muted-foreground">
              Verwalten Sie alle Support-Anfragen
            </p>
          </div>
          {newTicketCount && newTicketCount > 0 && (
            <Badge variant="destructive" className="text-lg px-4 py-2">
              {newTicketCount} Neue Tickets
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter</CardTitle>
            <CardDescription>Filtern und durchsuchen Sie Tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <TicketFilters
              filters={filters}
              onFiltersChange={setFilters}
              adminProfiles={adminProfiles}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets ({tickets?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketsTable
              tickets={tickets || []}
              isLoading={isLoading}
              adminProfiles={adminProfiles}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
