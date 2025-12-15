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
      // Fetch all campaign drafts
      const { data: drafts, error: draftsError } = await supabase
        .from('campaign_drafts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (draftsError) throw draftsError;

      // Fetch all profiles for email mapping
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email');

      if (profilesError) throw profilesError;

      // Create email lookup map
      const emailMap = new Map<string, string>();
      profiles?.forEach(p => emailMap.set(p.id, p.email));

      // Combine drafts with user emails
      return (drafts || []).map(draft => ({
        id: draft.id,
        name: draft.name,
        objective: draft.objective,
        buying_type: draft.buying_type,
        setup: draft.setup,
        user_id: draft.user_id,
        user_email: emailMap.get(draft.user_id) || 'Unbekannt',
        account_id: draft.account_id,
        campaign_data: draft.campaign_data as unknown as CampaignDraftData,
        adset_data: draft.adset_data as unknown as AdSetDraftData,
        ad_data: draft.ad_data as unknown as AdDraftData,
        created_at: draft.created_at,
        updated_at: draft.updated_at,
      })) as AdminCampaignDraft[];
    },
  });
}

export function useAdminCampaignDetail(id: string) {
  return useQuery({
    queryKey: ['admin-campaign', id],
    queryFn: async () => {
      const { data: draft, error: draftError } = await supabase
        .from('campaign_drafts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (draftError) throw draftError;
      if (!draft) return null;

      // Fetch user email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', draft.user_id)
        .maybeSingle();

      return {
        id: draft.id,
        name: draft.name,
        objective: draft.objective,
        buying_type: draft.buying_type,
        setup: draft.setup,
        user_id: draft.user_id,
        user_email: profile?.email || 'Unbekannt',
        account_id: draft.account_id,
        campaign_data: draft.campaign_data as unknown as CampaignDraftData,
        adset_data: draft.adset_data as unknown as AdSetDraftData,
        ad_data: draft.ad_data as unknown as AdDraftData,
        created_at: draft.created_at,
        updated_at: draft.updated_at,
      } as AdminCampaignDraft;
    },
    enabled: !!id,
  });
}
