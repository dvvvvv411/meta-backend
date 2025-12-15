import { useState } from 'react';
import { Building2, Calendar, Check, X } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { AdvertiserAccount } from '@/hooks/useAdvertiserAccounts';

interface AccountDetailModalProps {
  account: AdvertiserAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (accountId: string, newName: string) => void;
  isRenaming?: boolean;
}

export function AccountDetailModal({
  account,
  open,
  onOpenChange,
  onRename,
  isRenaming,
}: AccountDetailModalProps) {
  const [newName, setNewName] = useState(account.name);

  const expireDate = account.expire_at ? new Date(account.expire_at) : null;
  const startDate = account.start_date ? new Date(account.start_date) : null;
  const daysRemaining = expireDate ? differenceInDays(expireDate, new Date()) : 0;
  const isExpired = daysRemaining <= 0;

  const getStatusBadge = () => {
    if (account.account_status === 'active' && !isExpired) {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Aktiv</Badge>;
    }
    if (daysRemaining <= 7 && daysRemaining > 0) {
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Bald fällig</Badge>;
    }
    if (isExpired || account.account_status === 'expired') {
      return <Badge variant="destructive">Abgelaufen</Badge>;
    }
    return <Badge variant="secondary">{account.account_status}</Badge>;
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

  const handleSave = () => {
    if (newName.trim() && newName !== account.name) {
      onRename(account.id, newName.trim());
    }
  };

  const hasChanges = newName.trim() !== account.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Account Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account Name & Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{account.name}</h3>
            {getStatusBadge()}
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Plattform</p>
              <p className="font-medium capitalize">{account.platform}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{account.account_status}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Startdatum</p>
              <p className="font-medium">
                {startDate ? format(startDate, 'dd.MM.yyyy', { locale: de }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Ablaufdatum</p>
              <p className="font-medium">
                {expireDate ? format(expireDate, 'dd.MM.yyyy', { locale: de }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Verbleibend</p>
              <p className="font-medium">{Math.max(0, daysRemaining)} Tage</p>
            </div>
            <div>
              <p className="text-muted-foreground">Bezahlter Preis</p>
              <p className="font-medium">{formatCurrency(account.price_paid ?? 150)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Auto-Verlängerung</p>
              <p className="font-medium flex items-center gap-1">
                {account.auto_renew ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Aktiv
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-muted-foreground" />
                    Inaktiv
                  </>
                )}
              </p>
            </div>
          </div>

          <Separator />

          {/* Rename Section */}
          <div className="space-y-3">
            <Label htmlFor="account-name">Account umbenennen</Label>
            <div className="flex gap-2">
              <Input
                id="account-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Account Name"
                className="flex-1"
              />
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isRenaming}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRenaming ? 'Speichern...' : 'Speichern'}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Schließen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
