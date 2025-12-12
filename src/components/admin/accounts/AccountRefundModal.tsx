import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Account, useRefundAccount } from '@/hooks/useAccounts';

interface AccountRefundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account;
}

export function AccountRefundModal({ open, onOpenChange, account }: AccountRefundModalProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'EUR' | 'USDT'>('EUR');
  const [reason, setReason] = useState('');
  
  const refundMutation = useRefundAccount();

  const formatCurrency = (amount: number, curr: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: curr === 'USDT' ? 'USD' : curr,
    }).format(amount);
  };

  const maxAmount = currency === 'EUR' ? account.balance_eur : account.balance_usdt;
  const parsedAmount = parseFloat(amount) || 0;
  const isValidAmount = parsedAmount > 0 && parsedAmount <= maxAmount;

  const handleSubmit = () => {
    if (!isValidAmount || !reason.trim()) return;
    
    refundMutation.mutate(
      { accountId: account.id, amount: parsedAmount, currency, reason: reason.trim() },
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
          <div className="grid grid-cols-2 gap-4 rounded-md bg-muted p-3">
            <div>
              <p className="text-sm text-muted-foreground">EUR Guthaben</p>
              <p className="font-medium">{formatCurrency(account.balance_eur, 'EUR')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">USDT Guthaben</p>
              <p className="font-medium">{formatCurrency(account.balance_usdt, 'USD')}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="amount">Refund-Betrag</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                max={maxAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Währung</Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as 'EUR' | 'USDT')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {parsedAmount > maxAmount && (
            <p className="text-sm text-destructive">
              Betrag übersteigt das verfügbare Guthaben ({formatCurrency(maxAmount, currency)})
            </p>
          )}

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
              Diese Aktion erstellt eine negative Transaktion und wird im Audit-Log protokolliert.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={refundMutation.isPending || !isValidAmount || !reason.trim()}
          >
            {refundMutation.isPending ? 'Wird erstattet...' : 'Refund durchführen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
