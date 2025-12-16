import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Wallet, Menu, Bell, Search, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useAdvertiserAccounts } from '@/hooks/useAdvertiserAccounts';
import { useUserBalance } from '@/hooks/useUserBalance';
import { useNotifications } from '@/hooks/useNotifications';
import { useDomainBranding } from '@/hooks/useDomainBranding';
import metaLogo from '@/assets/meta-logo.png';

interface AdvertiserHeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export const AdvertiserHeader = ({ onMenuToggle, showMenuButton = false }: AdvertiserHeaderProps) => {
  const { user, signOut } = useAuth();
  const { hasActiveAccount, isLoading: accountsLoading } = useAdvertiserAccounts();
  const { balanceEur, isLoading: balanceLoading } = useUserBalance();
  const { notifications, unreadCount } = useNotifications();
  const { data: branding } = useDomainBranding();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const logoUrl = branding?.logo_url || metaLogo;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleNotificationClick = (link?: string) => {
    if (link) navigate(link);
  };

  return (
    <header className="sticky top-0 z-10 h-16 bg-background/95 backdrop-blur border-b border-border px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left: Menu Button (Mobile) + Logo (Mobile) + Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {showMenuButton && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="shrink-0" aria-label="Navigation öffnen">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}

        {/* Mobile Logo */}
        <div className="sm:hidden shrink-0">
          <img 
            src={logoUrl} 
            alt={branding?.name || 'MetaNetwork'} 
            className="h-7 w-auto object-contain" 
          />
        </div>

        {/* Global Search - Hidden on small screens */}
        <div className="relative hidden md:block max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Kampagnen, Statistiken..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50"
            aria-label="Suche"
          />
        </div>
      </div>

      {/* Right: Balance, Notifications, User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Balance */}
        <Card className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-card/50 border-border/50">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          {balanceLoading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <div className="text-right">
              <p className="text-xs text-muted-foreground leading-none">Guthaben</p>
              <p className="text-sm font-semibold text-foreground leading-none">
                {formatCurrency(balanceEur)}
              </p>
            </div>
          )}
        </Card>

        {/* Notifications Bell */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label={`Benachrichtigungen${unreadCount > 0 ? `, ${unreadCount} ungelesen` : ''}`}>
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center" aria-hidden="true">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-popover" align="end">
            <div className="p-3 border-b border-border">
              <h4 className="font-semibold text-sm">Benachrichtigungen</h4>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="p-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-0"
                    onClick={() => handleNotificationClick(notification.link)}
                  >
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Keine neuen Benachrichtigungen
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-auto py-1.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-tight truncate max-w-[180px]">
                  {user?.email || 'Benutzer'}
                </p>
              {accountsLoading ? (
                  <Skeleton className="h-4 w-12 mt-0.5" />
                ) : (
                  <Badge 
                    variant={hasActiveAccount ? "default" : "secondary"}
                    className="text-[10px] h-4 px-1.5"
                  >
                    {hasActiveAccount ? 'Aktiv' : 'Kein Account'}
                  </Badge>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <div className="px-2 py-1.5 sm:hidden">
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem onClick={() => navigate('/advertiser/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Einstellungen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
