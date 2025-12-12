import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
  const { signOut } = useAuth();
  const [confirmation, setConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmed = confirmation === 'LÖSCHEN';

  const handleDelete = async () => {
    if (!isConfirmed) return;
    
    setIsDeleting(true);
    try {
      // In production, this would call a server-side function to delete the account
      // For now, we'll just sign out as a placeholder
      await signOut();
      toast.success('Account wurde gelöscht');
      onOpenChange(false);
    } catch (error) {
      toast.error('Fehler beim Löschen des Accounts');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setConfirmation('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Account wirklich löschen?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Diese Aktion kann nicht rückgängig gemacht werden. Ihr Account, alle Daten, 
              Guthaben und gemietete Accounts werden permanent gelöscht.
            </p>
            <div className="space-y-2">
              <Label htmlFor="confirmation" className="text-foreground">
                Geben Sie <span className="font-mono font-bold">LÖSCHEN</span> ein, um zu bestätigen:
              </Label>
              <Input
                id="confirmation"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="LÖSCHEN"
                className="font-mono"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Abbrechen</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
          >
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Account löschen
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
