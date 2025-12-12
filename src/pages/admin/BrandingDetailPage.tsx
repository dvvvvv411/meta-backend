import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArrowLeft, Pencil, ExternalLink, Mail, Calendar, User, CheckCircle2, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { BrandingFormModal } from '@/components/admin/brandings/BrandingFormModal';
import { BrandingHistory } from '@/components/admin/brandings/BrandingHistory';
import { useBranding } from '@/hooks/useBrandings';
import { cn } from '@/lib/utils';

export default function BrandingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: branding, isLoading, error } = useBranding(id);
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !branding) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive">Branding nicht gefunden</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/brandings')}>
            Zurück zur Übersicht
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={() => navigate('/admin/brandings')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 rounded-xl border-2 border-border">
                <AvatarImage src={branding.logo_url || undefined} alt={branding.name} />
                <AvatarFallback
                  className="rounded-xl text-lg font-semibold"
                  style={{ backgroundColor: branding.primary_color + '20', color: branding.primary_color }}
                >
                  {branding.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{branding.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="h-3.5 w-3.5" />
                  {branding.domain}
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => setEditModalOpen(true)} className="gap-2">
            <Pencil className="h-4 w-4" />
            Bearbeiten
          </Button>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Unternehmensname
                  </p>
                  <p className="font-medium">{branding.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant={branding.is_active ? 'default' : 'secondary'}
                    className={cn(
                      'gap-1',
                      branding.is_active && 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                    )}
                  >
                    {branding.is_active ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Aktiv
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        Inaktiv
                      </>
                    )}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Domain
                  </p>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`https://${branding.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {branding.domain}
                    </a>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    E-Mail
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${branding.email}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {branding.email}
                    </a>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Primärfarbe
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-5 w-5 rounded border border-border"
                      style={{ backgroundColor: branding.primary_color }}
                    />
                    <span className="font-mono text-sm">{branding.primary_color}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Erstellt am</p>
                    <p className="text-sm font-medium">
                      {format(new Date(branding.created_at), "dd.MM.yyyy 'um' HH:mm 'Uhr'", { locale: de })}
                    </p>
                  </div>
                </div>
                {branding.created_by_email && (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Erstellt von</p>
                      <p className="text-sm font-medium">{branding.created_by_email}</p>
                    </div>
                  </div>
                )}
                {branding.updated_at && (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Zuletzt geändert</p>
                      <p className="text-sm font-medium">
                        {format(new Date(branding.updated_at), "dd.MM.yyyy 'um' HH:mm 'Uhr'", { locale: de })}
                      </p>
                    </div>
                  </div>
                )}
                {branding.updated_by_email && (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Geändert von</p>
                      <p className="text-sm font-medium">{branding.updated_by_email}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Änderungsverlauf</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandingHistory branding={branding} />
            </CardContent>
          </Card>
        </div>

        {/* Edit Modal */}
        <BrandingFormModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          branding={branding}
        />
      </div>
    </DashboardLayout>
  );
}
