import { useState } from 'react';
import { format, addMonths } from 'date-fns';
import { de } from 'date-fns/locale';
import { Clock } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Account, useExtendAccount } from '@/hooks/useAccounts';

interface AccountExtendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account;
}

type ExtendOption = '1' | '3' | '6' | '12' | 'custom';

export function AccountExtendModal({ open, onOpenChange, account }: AccountExtendModalProps) {
  const [option, setOption] = useState<ExtendOption>('1');
  const [customDate, setCustomDate] = useState<Date | undefined>();
  const [note, setNote] = useState('');
  
  const extendMutation = useExtendAccount();

  const baseDate = account.expire_at ? new Date(account.expire_at) : new Date();

  const getNewExpireDate = (): Date => {
    if (option === 'custom' && customDate) {
      return customDate;
    }
    return addMonths(baseDate, parseInt(option));
  };

  const newExpireAt = getNewExpireDate();

  const handleSubmit = () => {
    extendMutation.mutate(
      { accountId: account.id, newExpireAt, note: note || undefined },
      { onSuccess: () => { onOpenChange(false); setNote(''); setOption('1'); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Account verlängern
          </DialogTitle>
          <DialogDescription>
            {account.name} ({account.user_email || 'Kein Nutzer'})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Aktuelles Ablaufdatum</p>
            <p className="font-medium">
              {account.expire_at 
                ? format(new Date(account.expire_at), 'dd. MMMM yyyy', { locale: de })
                : 'Nicht gesetzt'}
            </p>
          </div>

          <div className="space-y-3">
            <Label>Verlängern um</Label>
            <RadioGroup value={option} onValueChange={(v) => setOption(v as ExtendOption)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="1-month" />
                <Label htmlFor="1-month" className="cursor-pointer">1 Monat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="3-months" />
                <Label htmlFor="3-months" className="cursor-pointer">3 Monate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6" id="6-months" />
                <Label htmlFor="6-months" className="cursor-pointer">6 Monate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12" id="12-months" />
                <Label htmlFor="12-months" className="cursor-pointer">12 Monate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="cursor-pointer">Benutzerdefiniert</Label>
              </div>
            </RadioGroup>

            {option === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {customDate 
                      ? format(customDate, 'dd.MM.yyyy', { locale: de })
                      : 'Datum wählen...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    disabled={(date) => date < new Date()}
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground">Neues Ablaufdatum</p>
            <p className="font-medium text-lg">
              {format(newExpireAt, 'dd. MMMM yyyy', { locale: de })}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Bemerkung (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Grund für die Verlängerung..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={extendMutation.isPending || (option === 'custom' && !customDate)}
          >
            {extendMutation.isPending ? 'Wird verlängert...' : 'Verlängern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
