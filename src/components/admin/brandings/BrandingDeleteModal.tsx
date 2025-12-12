import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteBranding, type Branding } from '@/hooks/useBrandings';

interface BrandingDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branding: Branding | null;
}

export function BrandingDeleteModal({ open, onOpenChange, branding }: BrandingDeleteModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const deleteBranding = useDeleteBranding();

  const handleDelete = async () => {
    if (!branding || confirmText !== 'DELETE') return;

    try {
      await deleteBranding.mutateAsync(branding.id);
      onOpenChange(false);
      setConfirmText('');
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Branding löschen</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            Sind Sie sicher, dass Sie das Branding <strong>"{branding?.name}"</strong> unwiderruflich löschen möchten?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle verknüpften Daten werden ebenfalls gelöscht.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">
              Geben Sie <span className="font-mono font-bold">DELETE</span> ein, um fortzufahren:
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="font-mono"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== 'DELETE' || deleteBranding.isPending}
          >
            {deleteBranding.isPending ? 'Wird gelöscht...' : 'Endgültig löschen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
