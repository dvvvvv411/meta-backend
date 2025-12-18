import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Plus, AlertCircle, FileText, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdvertiserAccount } from '@/hooks/useAdvertiserAccount';
import { CreateCampaignModal } from '@/components/advertiser/campaigns/CreateCampaignModal';
import { useCampaignDrafts } from '@/hooks/useCampaignDrafts';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CampaignsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const { hasActiveAccount, isLoading: isAccountLoading } = useAdvertiserAccount();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { drafts, isLoading: isDraftsLoading, deleteDraft, isDeleting } = useCampaignDrafts();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const dateLocale = language === 'de' ? de : enUS;

  // Show loading state while checking account status
  if (isAccountLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.campaigns.pageTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {t.campaigns.pageSubtitle}
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const handleDeleteDraft = (draftId: string) => {
    setDeletingId(draftId);
    deleteDraft(draftId, {
      onSettled: () => setDeletingId(null),
    });
  };

  const handleContinueDraft = (draft: typeof drafts[0]) => {
    // Prefetch draft data into cache for instant load on edit page
    if (draft.id) {
      queryClient.setQueryData(['campaign-draft', draft.id], draft);
    }
    
    const params = new URLSearchParams({
      account: draft.account_id,
      buyingType: draft.buying_type,
      objective: draft.objective,
      setup: draft.setup,
      draftId: draft.id || '',
    });
    navigate(`/advertiser/campaigns/edit/new?${params.toString()}`);
  };

  if (!hasActiveAccount) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.campaigns.pageTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {t.campaigns.pageSubtitle}
          </p>
        </div>

        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              {language === 'de' ? 'Account erforderlich' : 'Account required'}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? 'Bitte miete zuerst ein Agency Account um Kampagnen zu erstellen.' 
                : 'Please rent an agency account first to create campaigns.'}
            </CardDescription>
          </CardHeader>
        </Card>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.campaigns.pageTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {t.campaigns.pageSubtitle}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t.campaigns.createCampaign}
        </Button>
      </div>

      {/* Drafts Section */}
      {isDraftsLoading ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t.campaigns.drafts}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? 'Setze deine gespeicherten Kampagnen-Entwürfe fort.' 
                : 'Continue your saved campaign drafts.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : drafts.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t.campaigns.drafts}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? 'Setze deine gespeicherten Kampagnen-Entwürfe fort.' 
                : 'Continue your saved campaign drafts.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {drafts.map((draft) => (
                <div 
                  key={draft.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{draft.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.dashboard.lastEdited} {draft.updated_at ? format(new Date(draft.updated_at), 'dd.MM.yyyy HH:mm', { locale: dateLocale }) : '-'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContinueDraft(draft)}
                    >
                      {t.campaigns.continueDraft}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => draft.id && handleDeleteDraft(draft.id)}
                      disabled={isDeleting && deletingId === draft.id}
                    >
                      {isDeleting && deletingId === draft.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Megaphone className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {t.campaigns.noCampaigns}
          </h3>
          <p className="text-muted-foreground text-center max-w-sm mb-4">
            {t.campaigns.noCampaignsDesc}
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t.campaigns.createNew}
          </Button>
        </CardContent>
      </Card>

      <CreateCampaignModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </div>
  );
}
