import { useState } from 'react';
import { Building2, AlertTriangle, Info, Pencil, Check, X } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AutoRenewToggle } from './AutoRenewToggle';
import { AccountDetailModal } from './AccountDetailModal';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AdvertiserAccount } from '@/hooks/useAdvertiserAccounts';

interface AccountCardProps {
  account: AdvertiserAccount;
  onToggleAutoRenew: (accountId: string, autoRenew: boolean) => void;
  isToggling?: boolean;
  onRenameAccount: (accountId: string, newName: string) => void;
  isRenaming?: boolean;
}

export function AccountCard({ 
  account, 
  onToggleAutoRenew, 
  isToggling,
  onRenameAccount,
  isRenaming,
}: AccountCardProps) {
  const { t, language } = useLanguage();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(account.name);

  const dateLocale = language === 'de' ? de : enUS;

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== account.name) {
      onRenameAccount(account.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(account.name);
    setIsEditing(false);
  };

  const expireDate = account.expire_at ? new Date(account.expire_at) : null;
  const startDate = account.start_date ? new Date(account.start_date) : null;
  const daysRemaining = expireDate ? differenceInDays(expireDate, new Date()) : 0;
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  const getStatusBadge = () => {
    if (account.account_status === 'active' && !isExpired) {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{t.common.active}</Badge>;
    }
    if (isExpiringSoon) {
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">{t.accountList.expiringSoon}</Badge>;
    }
    if (isExpired || account.account_status === 'expired') {
      return <Badge variant="destructive">{language === 'de' ? 'Abgelaufen' : 'Expired'}</Badge>;
    }
    return <Badge variant="secondary">{account.account_status}</Badge>;
  };

  return (
    <>
      <Card className={cn(
        "transition-all",
        isExpiringSoon && "border-amber-500/50",
        isExpired && "border-destructive/50 opacity-75"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Building2 className="h-5 w-5 text-primary shrink-0" />
              
              {isEditing ? (
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-7 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 shrink-0"
                    onClick={handleSaveEdit}
                    disabled={isRenaming}
                  >
                    <Check className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 shrink-0"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              ) : (
                <>
                  <CardTitle className="text-base truncate">{account.name}</CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </>
              )}
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isExpiringSoon && (
            <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-500/10 p-2 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span>
                {language === 'de' 
                  ? `Account läuft in ${daysRemaining} Tagen ab!` 
                  : `Account expires in ${daysRemaining} days!`}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">{t.accountList.daysRemaining}</p>
              <p className="font-medium">{Math.max(0, daysRemaining)} {t.common.days}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{language === 'de' ? 'Nächste Abrechnung' : 'Next billing'}</p>
              <p className="font-medium">
                {expireDate ? format(expireDate, 'dd.MM.yyyy', { locale: dateLocale }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">{t.accountList.startDate}</p>
              <p className="font-medium">
                {startDate ? format(startDate, 'dd.MM.yyyy', { locale: dateLocale }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">{t.accountList.platform}</p>
              <p className="font-medium capitalize">{account.platform}</p>
            </div>
          </div>

          <Separator />

          <AutoRenewToggle
            checked={account.auto_renew ?? true}
            onCheckedChange={(checked) => onToggleAutoRenew(account.id, checked)}
            disabled={isToggling || isExpired}
          />

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setDetailsOpen(true)}
          >
            <Info className="mr-1 h-3 w-3" />
            {t.accountList.details}
          </Button>
        </CardContent>
      </Card>

      <AccountDetailModal
        account={account}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onRename={onRenameAccount}
        isRenaming={isRenaming}
      />
    </>
  );
}
