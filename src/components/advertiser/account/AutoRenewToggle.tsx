import { RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface AutoRenewToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function AutoRenewToggle({ checked, onCheckedChange, disabled }: AutoRenewToggleProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="auto-renew" className="text-sm font-normal cursor-pointer">
          {t.accountList.autoRenewal}
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
