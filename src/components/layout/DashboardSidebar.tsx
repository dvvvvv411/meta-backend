import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Palette,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Receipt,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useNewTicketCount } from "@/hooks/useTickets";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  badge?: number;
}

const navItems: NavItem[] = [
  { title: "Übersicht", href: "/dashboard", icon: LayoutDashboard },
  { title: "Benutzer", href: "/admin/users", icon: Users, adminOnly: true },
  { title: "Transaktionen", href: "/admin/transactions", icon: Receipt, adminOnly: true },
  { title: "Brandings", href: "/admin/brandings", icon: Palette, adminOnly: true },
  { title: "Tickets", href: "/admin/tickets", icon: MessageSquare, adminOnly: true },
];

interface SidebarContentProps {
  collapsed: boolean;
  isAdmin: boolean;
  onCollapse?: () => void;
}

function SidebarNavContent({ collapsed, isAdmin, onCollapse }: SidebarContentProps) {
  const location = useLocation();
  const { data: newTicketCount } = useNewTicketCount();

  const filteredItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  // Add badge to tickets nav item
  const itemsWithBadge = filteredItems.map((item) => ({
    ...item,
    badge: item.href === "/admin/tickets" ? newTicketCount || 0 : 0,
  }));

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AD</span>
            </div>
            <span className="font-display font-semibold text-lg">AdManager</span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">AD</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {itemsWithBadge.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onCollapse}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "gradient-bg-soft text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge > 0 && (
                    <Badge variant="destructive" className="h-5 min-w-[20px] px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
              {collapsed && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Abmelden</span>}
        </button>
      </div>
    </div>
  );
}

interface DashboardSidebarProps {
  isAdmin?: boolean;
}

export function DashboardSidebar({ isAdmin = false }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <SidebarNavContent collapsed={collapsed} isAdmin={isAdmin} />
        
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-full top-20 -ml-3 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-card shadow-md"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarNavContent collapsed={false} isAdmin={isAdmin} onCollapse={() => {}} />
        </SheetContent>
      </Sheet>
    </>
  );
}
