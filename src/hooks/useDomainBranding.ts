import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DomainBranding {
  id: string;
  name: string;
  logo_url: string | null;
  primary_color: string | null;
}

export function useDomainBranding() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  // Extract base domain (e.g., "metanetwork.agency" from "web.metanetwork.agency")
  const getBaseDomain = (host: string) => {
    const parts = host.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return host;
  };

  return useQuery({
    queryKey: ['domain-branding', hostname],
    queryFn: async (): Promise<DomainBranding | null> => {
      if (!hostname) return null;

      // First try exact domain match
      let { data } = await supabase
        .from('brandings')
        .select('id, name, logo_url, primary_color')
        .eq('domain', hostname)
        .eq('is_active', true)
        .maybeSingle();

      // If not found, try base domain
      if (!data) {
        const baseDomain = getBaseDomain(hostname);
        if (baseDomain !== hostname) {
          const result = await supabase
            .from('brandings')
            .select('id, name, logo_url, primary_color')
            .eq('domain', baseDomain)
            .eq('is_active', true)
            .maybeSingle();
          data = result.data;
        }
      }

      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes cache
  });
}
