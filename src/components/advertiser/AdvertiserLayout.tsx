import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AdvertiserSidebar } from './AdvertiserSidebar';
import { AdvertiserHeader } from './AdvertiserHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useDomainBranding } from '@/hooks/useDomainBranding';
import { useLanguage } from '@/contexts/LanguageContext';

export const AdvertiserLayout = () => {
  usePageMeta();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const { data: branding, isLoading: brandingLoading } = useDomainBranding();
  const { setLanguageFromBranding } = useLanguage();

  // Auto-set language from branding if user hasn't manually chosen
  useEffect(() => {
    if (branding?.default_language) {
      setLanguageFromBranding(branding.default_language);
    }
  }, [branding?.default_language, setLanguageFromBranding]);

  if (brandingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
      </div>
    </div>
  );
};
