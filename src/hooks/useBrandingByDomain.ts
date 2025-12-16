import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DomainBranding {
  id: string;
  name: string;
  logo_url: string | null;
  primary_color: string | null;
}

/**
 * Extracts the main domain from a hostname
 * e.g., "web.metanetwork.agency" -> "metanetwork.agency"
 * e.g., "metanetwork.agency" -> "metanetwork.agency"
 * e.g., "localhost" -> "localhost"
 */
function extractMainDomain(hostname: string): string {
  // Handle localhost
  if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
    return 'localhost';
  }
  
  // Split hostname into parts
  const parts = hostname.split('.');
  
  // If it's a simple domain (2 parts like "example.com") or IP, return as-is
  if (parts.length <= 2) {
    return hostname;
  }
  
  // For subdomains (3+ parts like "web.metanetwork.agency"), 
  // return the last 2 parts as the main domain
  return parts.slice(-2).join('.');
}

export function useBrandingByDomain() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const mainDomain = extractMainDomain(hostname);

  return useQuery({
    queryKey: ['branding-by-domain', mainDomain],
    queryFn: async (): Promise<DomainBranding | null> => {
      // Try exact hostname match first
      let { data, error } = await supabase
        .from('brandings')
        .select('id, name, logo_url, primary_color')
        .eq('domain', hostname)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching branding by hostname:', error);
      }

      // If no exact match and hostname != mainDomain, try main domain
      if (!data && hostname !== mainDomain) {
        const result = await supabase
          .from('brandings')
          .select('id, name, logo_url, primary_color')
          .eq('domain', mainDomain)
          .eq('is_active', true)
          .maybeSingle();
        
        if (result.error) {
          console.error('Error fetching branding by main domain:', result.error);
        }
        data = result.data;
      }

      return data;
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    retry: 1,
  });
}
