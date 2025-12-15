import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Pencil, Eye, Trash2, ExternalLink, Mail, Building2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Skeleton } from '@/components/ui/skeleton';
import { BrandingFormModal } from './BrandingFormModal';
import { BrandingDeleteModal } from './BrandingDeleteModal';
import { useBrandings, type Branding } from '@/hooks/useBrandings';
import { cn } from '@/lib/utils';

export function BrandingsTable() {
  const navigate = useNavigate();
  const { data: brandings, isLoading, error } = useBrandings();
  const [editingBranding, setEditingBranding] = useState<Branding | null>(null);
  const [deletingBranding, setDeletingBranding] = useState<Branding | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-destructive">Fehler beim Laden der Brandings</p>
      </div>
    );
  }

  if (!brandings || brandings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Keine Brandings vorhanden</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Erstellen Sie Ihr erstes Branding, um loszulegen.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24">Logo</TableHead>
              <TableHead>Unternehmen</TableHead>
              <TableHead className="hidden md:table-cell">Domain</TableHead>
              <TableHead className="hidden lg:table-cell">E-Mail</TableHead>
              <TableHead className="hidden sm:table-cell">Erstellt</TableHead>
              <TableHead className="w-20">Status</TableHead>
              <TableHead className="w-32 text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brandings.map((branding) => (
              <TableRow key={branding.id} className="group">
                <TableCell>
                  <div className="h-10 w-20 flex items-center">
                    {branding.logo_url ? (
                      <img 
                        src={branding.logo_url} 
                        alt={branding.name}
                        className="max-h-10 max-w-20 object-contain"
                      />
                    ) : (
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-xs font-medium"
                        style={{ backgroundColor: branding.primary_color + '20', color: branding.primary_color }}
                      >
                        {branding.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{branding.name}</div>
                  <div className="text-xs text-muted-foreground md:hidden">{branding.domain}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <ExternalLink className="h-3 w-3" />
                    {branding.domain}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="truncate max-w-[180px]">{branding.email}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(branding.created_at), 'dd.MM.yyyy', { locale: de })}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={branding.is_active ? 'default' : 'secondary'}
                    className={cn(
                      'text-xs',
                      branding.is_active && 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                    )}
                  >
                    {branding.is_active ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingBranding(branding)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => navigate(`/admin/brandings/${branding.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeletingBranding(branding)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BrandingFormModal
        open={!!editingBranding}
        onOpenChange={(open) => !open && setEditingBranding(null)}
        branding={editingBranding}
      />

      <BrandingDeleteModal
        open={!!deletingBranding}
        onOpenChange={(open) => !open && setDeletingBranding(null)}
        branding={deletingBranding}
      />
    </>
  );
}
