import { RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AutoRenewToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function AutoRenewToggle({ checked, onCheckedChange, disabled }: AutoRenewToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="auto-renew" className="text-sm font-normal cursor-pointer">
          Auto-Verlängerung
        </Label>
      </div>
      <Switch
        id="auto-renew"
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}
