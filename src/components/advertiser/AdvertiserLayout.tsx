import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdvertiserSidebar } from './AdvertiserSidebar';
import { AdvertiserHeader } from './AdvertiserHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { LegalFooter } from '@/components/ui/legal-footer';
import { useIsMobile } from '@/hooks/use-mobile';

export const AdvertiserLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && <AdvertiserSidebar />}
      
      {/* Mobile Drawer */}
      {isMobile && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <AdvertiserSidebar isMobile onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <AdvertiserHeader 
          onMenuToggle={() => setMobileOpen(true)} 
          showMenuButton={isMobile} 
        />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <LegalFooter />
      </div>
    </div>
  );
};
