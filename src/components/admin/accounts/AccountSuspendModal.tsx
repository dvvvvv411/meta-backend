import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Account, useSuspendAccount } from '@/hooks/useAccounts';

interface AccountSuspendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account;
}

export function AccountSuspendModal({ open, onOpenChange, account }: AccountSuspendModalProps) {
  const [reason, setReason] = useState('');
  
  const suspendMutation = useSuspendAccount();

  const handleSubmit = () => {
    if (!reason.trim()) return;
    
    suspendMutation.mutate(
      { accountId: account.id, reason: reason.trim() },
      { onSuccess: () => { onOpenChange(false); setReason(''); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Account sperren
          </DialogTitle>
          <DialogDescription>
            Sind Sie sicher, dass Sie den Account <strong>{account.name}</strong> ({account.user_email || 'Kein Nutzer'}) sperren möchten?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
            <p className="text-sm text-destructive">
              Der Nutzer verliert sofort den Zugriff auf diesen Account. Diese Aktion wird protokolliert.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Grund (Pflichtfeld)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Warum wird der Account gesperrt?"
              rows={3}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSubmit} 
            disabled={suspendMutation.isPending || !reason.trim()}
          >
            {suspendMutation.isPending ? 'Wird gesperrt...' : 'Sperren'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
