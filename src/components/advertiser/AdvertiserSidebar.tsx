import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Wallet, 
  Megaphone, 
  BarChart3, 
  Code2,
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
import { useAdvertiserAccount } from '@/hooks/useAdvertiserAccount';
import { useDomainBranding } from '@/hooks/useDomainBranding';
import metaLogo from '@/assets/meta-logo.png';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  requiresAccount?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Übersicht', icon: LayoutDashboard, path: '/advertiser' },
  { label: 'Agency Account', icon: Building2, path: '/advertiser/rent-account' },
  { label: 'Guthaben', icon: Wallet, path: '/advertiser/deposit' },
  { label: 'Kampagnen', icon: Megaphone, path: '/advertiser/campaigns', requiresAccount: true },
  { label: 'Statistiken', icon: BarChart3, path: '/advertiser/statistics', requiresAccount: true },
  { label: 'API Dokumentation', icon: Code2, path: '/advertiser/api' },
  { label: 'Einstellungen', icon: Settings, path: '/advertiser/settings' },
  { label: 'Support / Tickets', icon: HelpCircle, path: '/advertiser/support' },
];

interface AdvertiserSidebarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export const AdvertiserSidebar = ({ isMobile = false, onNavigate }: AdvertiserSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { hasActiveAccount, isLoading } = useAdvertiserAccount();
  const { data: branding } = useDomainBranding();

  // Mobile is always expanded
  const isCollapsed = isMobile ? false : collapsed;

  const handleNavigation = (item: NavItem) => {
    if (item.requiresAccount && !hasActiveAccount) {
      return;
    }
    navigate(item.path);
    onNavigate?.();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const logoUrl = branding?.logo_url || metaLogo;

  return (
    <aside 
      className={cn(
        "h-screen glass border-r border-border/50 flex flex-col transition-all duration-300 relative overflow-hidden",
        isMobile ? "w-full" : "sticky top-0",
        !isMobile && (isCollapsed ? "w-20" : "w-72")
      )}
    >
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
      
      {/* Logo / Brand */}
      <div className="h-20 flex items-center justify-center px-4 border-b border-border/50 relative">
        {!isCollapsed && (
          <img 
            src={logoUrl} 
            alt={branding?.name || 'MetaNetwork'} 
            className="max-h-8 w-auto object-contain" 
          />
        )}
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "h-8 w-8 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-200",
              isCollapsed ? "mx-auto" : "absolute right-4"
            )}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isLocked = item.requiresAccount && !isLoading && !hasActiveAccount;
          const Icon = item.icon;

          const navButton = (
            <button
              key={item.path}
              className={cn(
                "w-full flex items-center gap-3 h-12 px-3 rounded-xl transition-all duration-300 group",
                isCollapsed && "justify-center px-2",
                isActive && "gradient-bg shadow-md",
                !isActive && !isLocked && "hover:bg-secondary/80",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleNavigation(item)}
              disabled={isLocked}
            >
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
                isActive ? "bg-primary-foreground/20" : "bg-primary/10 group-hover:bg-primary/20",
                isLocked && "bg-muted"
              )}>
                <div className="relative">
                  <Icon className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive ? "text-primary-foreground" : "text-primary",
                    isLocked && "text-muted-foreground"
                  )} />
                  {isLocked && (
                    <Lock className="h-3 w-3 absolute -top-1 -right-1 text-muted-foreground" />
                  )}
                </div>
              </div>
              {!isCollapsed && (
                <span className={cn(
                  "font-medium text-sm transition-colors duration-200",
                  isActive ? "text-primary-foreground" : "text-foreground"
                )}>
                  {item.label}
                </span>
              )}
            </button>
          );

          if (isCollapsed || isLocked) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  {navButton}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium max-w-xs">
                  {isLocked 
                    ? "Dieses Feature wird freigeschaltet, nachdem du mindestens ein Agency Account gemietet hast." 
                    : item.label
                  }
                </TooltipContent>
              </Tooltip>
            );
          }

          return navButton;
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border/50">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-3 h-12 px-3 rounded-xl transition-all duration-300 group hover:bg-destructive/10",
                isCollapsed && "justify-center px-2"
              )}
              onClick={handleLogout}
            >
              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 group-hover:bg-destructive/20 transition-all duration-300">
                <LogOut className="h-5 w-5 text-destructive" />
              </div>
              {!isCollapsed && (
                <span className="font-medium text-sm text-destructive">Abmelden</span>
              )}
            </button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">Abmelden</TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
};
