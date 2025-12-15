import { useState } from 'react';
import { Plus, Palette } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { BrandingsTable } from '@/components/admin/brandings/BrandingsTable';
import { BrandingFormModal } from '@/components/admin/brandings/BrandingFormModal';

export default function BrandingsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Brandings verwalten</h1>
              <p className="text-sm text-muted-foreground">
                Verwalten Sie alle White-Label-Konfigurationen
              </p>
            </div>
          </div>
          <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Neues Branding
          </Button>
        </div>

        {/* Table */}
        <BrandingsTable />

        {/* Create Modal */}
        <BrandingFormModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
        />
      </div>
    </DashboardLayout>
  );
}
