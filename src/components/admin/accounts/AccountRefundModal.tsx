import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Account, useRefundAccount } from '@/hooks/useAccounts';
import { supabase } from '@/integrations/supabase/client';

interface AccountRefundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account;
}

export function AccountRefundModal({ open, onOpenChange, account }: AccountRefundModalProps) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  
  const refundMutation = useRefundAccount();

  // Fetch central user balance
  const { data: userBalance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['user-balance', account.user_id],
    queryFn: async () => {
      if (!account.user_id) return 0;
      const { data, error } = await supabase
        .from('profiles')
        .select('balance_eur')
        .eq('id', account.user_id)
        .maybeSingle();
      if (error) throw error;
      return data?.balance_eur ?? 0;
    },
    enabled: open && !!account.user_id,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const parsedAmount = parseFloat(amount) || 0;
  const isValidAmount = parsedAmount > 0;

  const handleSubmit = () => {
    if (!isValidAmount || !reason.trim() || !account.user_id) return;
    
    refundMutation.mutate(
      { userId: account.user_id, amount: parsedAmount, reason: reason.trim() },
      { onSuccess: () => { onOpenChange(false); setAmount(''); setReason(''); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Manuelles Refund
          </DialogTitle>
          <DialogDescription>
            {account.name} ({account.user_email || 'Kein Nutzer'})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md bg-muted p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Zentrales Nutzer-Guthaben</p>
              <p className="text-lg font-bold">
                {isLoadingBalance ? '...' : formatCurrency(userBalance ?? 0)}
              </p>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p>Refunds werden dem zentralen Guthaben des Nutzers gutgeschrieben.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Refund-Betrag (EUR)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="refund-reason">Grund (Pflichtfeld)</Label>
            <Textarea
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Warum wird der Betrag erstattet?"
              rows={3}
              required
            />
          </div>

          <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Diese Aktion erhöht das Nutzer-Guthaben und wird im Audit-Log protokolliert.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={refundMutation.isPending || !isValidAmount || !reason.trim() || !account.user_id}
          >
            {refundMutation.isPending ? 'Wird erstattet...' : 'Refund durchführen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
