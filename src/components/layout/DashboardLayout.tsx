import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export function DashboardLayout({ children, isAdmin = false }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative">
        <DashboardSidebar isAdmin={isAdmin} />
      </div>
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 lg:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
