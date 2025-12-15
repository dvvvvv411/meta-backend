import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface CampaignDraftData {
  campaignName: string;
  budgetType: string;
  budgetSchedule: string;
  budgetAmount: number;
  bidStrategy: string;
  costPerResultGoal: string;
  abTestEnabled: boolean;
  abTestType: string;
  abTestDuration: number;
  abTestMetric: string;
  specialCategories: string[];
}

export interface AdSetDraftData {
  adSetName: string;
  conversionLocation: string;
  performanceGoal: string;
  adSetStartDate: string;
  adSetEndDateEnabled: boolean;
  adSetEndDate: string | null;
  selectedLocations: string[];
  beneficiary: string;
  placementType: string;
  selectedPlatforms: string[];
  selectedPlacements: string[];
}

export interface AdDraftData {
  adName: string;
  adSetup: string;
  creativeSource: string;
  adFormat: string;
  adDestination: string;
  websiteUrl: string;
  displayLink: string;
  phoneCountryCode: string;
  phoneNumber: string;
  creativeType: string;
  adCreativeData: Record<string, unknown>;
}

export interface CampaignDraft {
  id?: string;
  user_id: string;
  account_id: string;
  name: string;
  campaign_data: CampaignDraftData;
  adset_data: AdSetDraftData;
  ad_data: AdDraftData;
  buying_type: string;
  objective: string;
  setup: string;
  created_at?: string;
  updated_at?: string;
}

interface DbCampaignDraft {
  id: string;
  user_id: string;
  account_id: string;
  name: string;
  campaign_data: Json;
  adset_data: Json;
  ad_data: Json;
  buying_type: string;
  objective: string;
  setup: string;
  created_at: string;
  updated_at: string;
}

function parseDbDraft(dbDraft: DbCampaignDraft): CampaignDraft {
  return {
    ...dbDraft,
    campaign_data: dbDraft.campaign_data as unknown as CampaignDraftData,
    adset_data: dbDraft.adset_data as unknown as AdSetDraftData,
    ad_data: dbDraft.ad_data as unknown as AdDraftData,
  };
}

export function useCampaignDrafts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const draftsQuery = useQuery({
    queryKey: ['campaign-drafts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('campaign_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data as DbCampaignDraft[]).map(parseDbDraft);
    },
    enabled: !!user?.id,
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (draft: Omit<CampaignDraft, 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('campaign_drafts')
        .upsert({
          id: draft.id,
          user_id: draft.user_id,
          account_id: draft.account_id,
          name: draft.name,
          campaign_data: draft.campaign_data as unknown as Json,
          adset_data: draft.adset_data as unknown as Json,
          ad_data: draft.ad_data as unknown as Json,
          buying_type: draft.buying_type,
          objective: draft.objective,
          setup: draft.setup,
        })
        .select()
        .single();

      if (error) throw error;
      return parseDbDraft(data as DbCampaignDraft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-drafts'] });
      toast({
        title: 'Draft saved',
        description: 'Your campaign draft has been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving draft',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteDraftMutation = useMutation({
    mutationFn: async (draftId: string) => {
      const { error } = await supabase
        .from('campaign_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-drafts'] });
      toast({
        title: 'Draft deleted',
        description: 'Your campaign draft has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting draft',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const loadDraft = async (draftId: string): Promise<CampaignDraft | null> => {
    // Check cache first for instant load
    const cached = queryClient.getQueryData<CampaignDraft>(['campaign-draft', draftId]);
    if (cached) {
      return cached;
    }
    
    const { data, error } = await supabase
      .from('campaign_drafts')
      .select('*')
      .eq('id', draftId)
      .maybeSingle();

    if (error) {
      toast({
        title: 'Error loading draft',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }

    if (!data) return null;
    return parseDbDraft(data as DbCampaignDraft);
  };

  return {
    drafts: draftsQuery.data ?? [],
    isLoading: draftsQuery.isLoading,
    saveDraft: saveDraftMutation.mutate,
    saveDraftAsync: saveDraftMutation.mutateAsync,
    isSaving: saveDraftMutation.isPending,
    deleteDraft: deleteDraftMutation.mutate,
    isDeleting: deleteDraftMutation.isPending,
    loadDraft,
  };
}
