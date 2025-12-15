import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CampaignDraftData, AdSetDraftData, AdDraftData } from './useCampaignDrafts';
import { Json } from '@/integrations/supabase/types';

export interface AdminCampaignDraft {
  id: string;
  name: string;
  objective: string;
  buying_type: string;
  setup: string;
  user_id: string;
  user_email: string;
  account_id: string;
  campaign_data: CampaignDraftData;
  adset_data: AdSetDraftData;
  ad_data: AdDraftData;
  created_at: string;
  updated_at: string;
}

interface DbCampaignDraft {
  id: string;
  name: string;
  objective: string;
  buying_type: string;
  setup: string;
  user_id: string;
  account_id: string;
  campaign_data: Json;
  adset_data: Json;
  ad_data: Json;
  created_at: string;
  updated_at: string;
  profiles: {
    email: string;
  } | null;
}

function parseDbDraft(dbDraft: DbCampaignDraft): AdminCampaignDraft {
  return {
    id: dbDraft.id,
    name: dbDraft.name,
    objective: dbDraft.objective,
    buying_type: dbDraft.buying_type,
    setup: dbDraft.setup,
    user_id: dbDraft.user_id,
    user_email: dbDraft.profiles?.email || 'Unbekannt',
    account_id: dbDraft.account_id,
    campaign_data: dbDraft.campaign_data as unknown as CampaignDraftData,
    adset_data: dbDraft.adset_data as unknown as AdSetDraftData,
    ad_data: dbDraft.ad_data as unknown as AdDraftData,
    created_at: dbDraft.created_at,
    updated_at: dbDraft.updated_at,
  };
}

export function useAdminCampaigns() {
  return useQuery({
    queryKey: ['admin-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_drafts')
        .select(`
          *,
          profiles:user_id (email)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data as unknown as DbCampaignDraft[]).map(parseDbDraft);
    },
  });
}

export function useAdminCampaignDetail(id: string) {
  return useQuery({
    queryKey: ['admin-campaign', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_drafts')
        .select(`
          *,
          profiles:user_id (email)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return parseDbDraft(data as unknown as DbCampaignDraft);
    },
    enabled: !!id,
  });
}
