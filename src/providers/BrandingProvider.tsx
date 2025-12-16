import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useBrandingByDomain, DomainBranding } from '@/hooks/useBrandingByDomain';

interface BrandingContextType {
  branding: DomainBranding | null | undefined;
  isLoading: boolean;
}

const BrandingContext = createContext<BrandingContextType | null>(null);

const DEFAULT_TITLE = "Agency Platform";
const DEFAULT_DESCRIPTION = "Verwalten Sie Ihre Werbekampagnen professionell. Analysieren Sie Performance, optimieren Sie Budgets und steigern Sie Ihren ROI.";

export function BrandingProvider({ children }: { children: ReactNode }) {
  const { data: branding, isLoading } = useBrandingByDomain();

  useEffect(() => {
    const brandName = branding?.name;
    
    // Update title
    if (brandName) {
      document.title = `${brandName} | Agency Platform`;
    } else if (!isLoading) {
      document.title = DEFAULT_TITLE;
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      if (brandName) {
        metaDesc.setAttribute('content', `${brandName} - ${DEFAULT_DESCRIPTION}`);
      } else if (!isLoading) {
        metaDesc.setAttribute('content', DEFAULT_DESCRIPTION);
      }
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      if (brandName) {
        ogTitle.setAttribute('content', `${brandName} | Agency Platform`);
      } else if (!isLoading) {
        ogTitle.setAttribute('content', DEFAULT_TITLE);
      }
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      if (brandName) {
        ogDesc.setAttribute('content', `${brandName} - ${DEFAULT_DESCRIPTION}`);
      } else if (!isLoading) {
        ogDesc.setAttribute('content', DEFAULT_DESCRIPTION);
      }
    }
  }, [branding, isLoading]);

  return (
    <BrandingContext.Provider value={{ branding, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within BrandingProvider');
  }
  return context;
}
