import { useEffect } from 'react';
import { useDomainBranding } from './useDomainBranding';

const DEFAULT_BRAND = 'MetaNetwork';
const DEFAULT_DESCRIPTION = 'Professionelle Agency Accounts für Meta Ads. Verwalten Sie Kampagnen, Budgets und steigern Sie Ihren ROI.';

export function usePageMeta(pageTitle?: string) {
  const { data: branding } = useDomainBranding();
  
  const brandName = branding?.name || DEFAULT_BRAND;

  useEffect(() => {
    // Set title immediately
    const title = pageTitle 
      ? `${pageTitle} | ${brandName}`
      : `${brandName} - Agency Platform`;
    
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', DEFAULT_DESCRIPTION);
    }
  }, [brandName, pageTitle]);

  return { brandName };
}
