import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useTicket, useUpdateTicket, useAdminProfiles } from "@/hooks/useTickets";
import { TicketChat } from "@/components/admin/tickets/TicketChat";
import { TicketSidebar } from "@/components/admin/tickets/TicketSidebar";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: ticket, isLoading } = useTicket(id || "");
  const { data: adminProfiles } = useAdminProfiles();
  const updateTicket = useUpdateTicket();

  // Mark ticket as read when opened
  useEffect(() => {
    if (ticket && !ticket.is_read) {
      updateTicket.mutate({ id: ticket.id, updates: { is_read: true } });
    }
  }, [ticket?.id, ticket?.is_read]);

  if (isLoading) {
    return (
      <DashboardLayout isAdmin>
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout isAdmin>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Ticket nicht gefunden</p>
          <Button variant="link" onClick={() => navigate("/admin/tickets")}>
            Zurück zur Übersicht
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/tickets")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Zurück
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Ticket #{ticket.id.slice(0, 8)}</h1>
            <p className="text-lg text-muted-foreground">{ticket.subject}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-220px)] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Nachrichten</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <TicketChat ticketId={ticket.id} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <TicketSidebar ticket={ticket} adminProfiles={adminProfiles} />
              </CardContent>
            </Card>

            {ticket.description && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Beschreibung</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
