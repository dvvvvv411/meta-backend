import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Wallet, 
  Megaphone, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useAdvertiserAccounts } from '@/hooks/useAdvertiserAccounts';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  requiresAccount?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Übersicht', icon: LayoutDashboard, path: '/advertiser' },
  { label: 'Agency Account mieten', icon: Building2, path: '/advertiser/rent-account' },
  { label: 'Guthaben einzahlen', icon: Wallet, path: '/advertiser/deposit' },
  { label: 'Kampagnen erstellen', icon: Megaphone, path: '/advertiser/campaigns', requiresAccount: true },
  { label: 'Statistiken', icon: BarChart3, path: '/advertiser/statistics', requiresAccount: true },
  { label: 'Einstellungen', icon: Settings, path: '/advertiser/settings' },
  { label: 'Support / Tickets', icon: HelpCircle, path: '/advertiser/support' },
];

export const AdvertiserSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { hasActiveAccount } = useAdvertiserAccounts();

  const handleNavigation = (item: NavItem) => {
    if (item.requiresAccount && !hasActiveAccount) {
      return;
    }
    navigate(item.path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <aside 
      className={cn(
        "sticky top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo / Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <span className="font-bold text-lg text-foreground">Dashboard</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isLocked = item.requiresAccount && !hasActiveAccount;
          const Icon = item.icon;

          const button = (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                collapsed && "justify-center px-2",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleNavigation(item)}
              disabled={isLocked}
            >
              <div className="relative">
                <Icon className="h-5 w-5 shrink-0" />
                {isLocked && (
                  <Lock className="h-3 w-3 absolute -top-1 -right-1 text-muted-foreground" />
                )}
              </div>
              {!collapsed && <span>{item.label}</span>}
            </Button>
          );

          if (collapsed || isLocked) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  {button}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {isLocked 
                    ? "Bitte miete zuerst ein Agency Account." 
                    : item.label
                  }
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10",
                collapsed && "justify-center px-2"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Abmelden</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">Abmelden</TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
};
