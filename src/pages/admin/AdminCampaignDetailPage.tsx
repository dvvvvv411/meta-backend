import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAdminCampaignDetail } from '@/hooks/useAdminCampaigns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FileText, Layers, Image, User, Calendar, MapPin, Globe, Phone, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const objectiveLabels: Record<string, string> = {
  awareness: 'Awareness',
  traffic: 'Traffic',
  engagement: 'Engagement',
  leads: 'Leads',
  app_promotion: 'App Promotion',
  sales: 'Sales',
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-border last:border-0">
      <span className="text-sm font-medium text-muted-foreground sm:w-48 shrink-0">{label}</span>
      <span className="text-sm">{value || <span className="text-muted-foreground italic">Nicht angegeben</span>}</span>
    </div>
  );
}

export default function AdminCampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: campaign, isLoading } = useAdminCampaignDetail(id || '');

  if (isLoading) {
    return (
      <DashboardLayout isAdmin>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout isAdmin>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Kampagne nicht gefunden</h2>
          <Button onClick={() => navigate('/admin/campaigns')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zur Übersicht
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { campaign_data, adset_data, ad_data } = campaign;

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/campaigns')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary">{objectiveLabels[campaign.objective] || campaign.objective}</Badge>
              <Badge variant="outline">{campaign.buying_type}</Badge>
              <span className="text-sm text-muted-foreground">
                von {campaign.user_email}
              </span>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Erstellt am</span>
                <p className="font-medium">{format(new Date(campaign.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Letzte Änderung</span>
                <p className="font-medium">{format(new Date(campaign.updated_at), 'dd.MM.yyyy HH:mm', { locale: de })}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Setup</span>
                <p className="font-medium capitalize">{campaign.setup}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Benutzer-ID</span>
                <p className="font-medium font-mono text-xs">{campaign.user_id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="campaign" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaign" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Kampagne</span>
            </TabsTrigger>
            <TabsTrigger value="adset" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Ad Set</span>
            </TabsTrigger>
            <TabsTrigger value="ad" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Ad</span>
            </TabsTrigger>
          </TabsList>

          {/* Campaign Tab */}
          <TabsContent value="campaign">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Kampagnen-Einstellungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                <DetailRow label="Kampagnenname" value={campaign_data?.campaignName} />
                <DetailRow label="Budget-Typ" value={campaign_data?.budgetType} />
                <DetailRow label="Budget-Zeitplan" value={campaign_data?.budgetSchedule} />
                <DetailRow label="Budget-Betrag" value={campaign_data?.budgetAmount ? `€${campaign_data.budgetAmount}` : null} />
                <DetailRow label="Gebotsstrategie" value={campaign_data?.bidStrategy} />
                <DetailRow label="Kosten pro Ergebnis" value={campaign_data?.costPerResultGoal} />
                <DetailRow 
                  label="A/B-Test" 
                  value={
                    campaign_data?.abTestEnabled ? (
                      <div className="space-y-1">
                        <Badge>Aktiviert</Badge>
                        <p>Typ: {campaign_data.abTestType}</p>
                        <p>Dauer: {campaign_data.abTestDuration} Tage</p>
                        <p>Metrik: {campaign_data.abTestMetric}</p>
                      </div>
                    ) : (
                      <Badge variant="outline">Deaktiviert</Badge>
                    )
                  } 
                />
                <DetailRow 
                  label="Spezielle Kategorien" 
                  value={
                    campaign_data?.specialCategories?.length > 0 
                      ? campaign_data.specialCategories.join(', ') 
                      : null
                  } 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ad Set Tab */}
          <TabsContent value="adset">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Ad Set-Einstellungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                <DetailRow label="Ad Set Name" value={adset_data?.adSetName} />
                <DetailRow label="Conversion-Ort" value={adset_data?.conversionLocation} />
                <DetailRow label="Performance-Ziel" value={adset_data?.performanceGoal} />
                <DetailRow 
                  label="Startdatum" 
                  value={
                    adset_data?.adSetStartDate 
                      ? format(new Date(adset_data.adSetStartDate), 'dd.MM.yyyy', { locale: de })
                      : null
                  } 
                />
                <DetailRow 
                  label="Enddatum" 
                  value={
                    adset_data?.adSetEndDateEnabled && adset_data?.adSetEndDate
                      ? format(new Date(adset_data.adSetEndDate), 'dd.MM.yyyy', { locale: de })
                      : <Badge variant="outline">Kein Enddatum</Badge>
                  } 
                />
                <DetailRow 
                  label="Standorte" 
                  value={
                    adset_data?.selectedLocations?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {adset_data.selectedLocations.map((loc) => (
                          <Badge key={loc} variant="secondary" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {loc}
                          </Badge>
                        ))}
                      </div>
                    ) : null
                  } 
                />
                <DetailRow label="Begünstigter" value={adset_data?.beneficiary} />
                <DetailRow label="Placement-Typ" value={adset_data?.placementType} />
                <DetailRow 
                  label="Plattformen" 
                  value={
                    adset_data?.selectedPlatforms?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {adset_data.selectedPlatforms.map((platform) => (
                          <Badge key={platform} variant="outline" className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    ) : null
                  } 
                />
                <DetailRow 
                  label="Placements" 
                  value={
                    adset_data?.selectedPlacements?.length > 0 
                      ? `${adset_data.selectedPlacements.length} ausgewählt`
                      : null
                  } 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ad Tab */}
          <TabsContent value="ad">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Ad-Einstellungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                <DetailRow label="Ad Name" value={ad_data?.adName} />
                <DetailRow label="Setup" value={ad_data?.adSetup} />
                <DetailRow label="Creative-Quelle" value={ad_data?.creativeSource} />
                <DetailRow label="Ad-Format" value={ad_data?.adFormat} />
                <DetailRow label="Ziel" value={ad_data?.adDestination} />
                {ad_data?.adDestination === 'website' && (
                  <>
                    <DetailRow 
                      label="Website-URL" 
                      value={
                        ad_data?.websiteUrl ? (
                          <span className="flex items-center gap-1">
                            <LinkIcon className="h-3 w-3" />
                            {ad_data.websiteUrl}
                          </span>
                        ) : null
                      } 
                    />
                    <DetailRow label="Display-Link" value={ad_data?.displayLink} />
                  </>
                )}
                {ad_data?.adDestination === 'phone' && (
                  <DetailRow 
                    label="Telefonnummer" 
                    value={
                      ad_data?.phoneNumber ? (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {ad_data.phoneCountryCode} {ad_data.phoneNumber}
                        </span>
                      ) : null
                    } 
                  />
                )}
                <DetailRow label="Creative-Typ" value={ad_data?.creativeType} />
                
                {/* Ad Creative Data */}
                {ad_data?.adCreativeData && Object.keys(ad_data.adCreativeData).length > 0 && (
                  <>
                    <div className="py-4">
                      <h4 className="font-medium mb-2">Creative-Details</h4>
                    </div>
                    {ad_data.adCreativeData.primaryTexts && (
                      <DetailRow 
                        label="Primäre Texte" 
                        value={
                          <div className="space-y-1">
                            {(ad_data.adCreativeData.primaryTexts as string[]).map((text, i) => (
                              <p key={i} className="text-sm bg-muted p-2 rounded">{text}</p>
                            ))}
                          </div>
                        } 
                      />
                    )}
                    {ad_data.adCreativeData.headlines && (
                      <DetailRow 
                        label="Headlines" 
                        value={
                          <div className="space-y-1">
                            {(ad_data.adCreativeData.headlines as string[]).map((text, i) => (
                              <p key={i} className="text-sm bg-muted p-2 rounded font-medium">{text}</p>
                            ))}
                          </div>
                        } 
                      />
                    )}
                    {ad_data.adCreativeData.description && (
                      <DetailRow label="Beschreibung" value={ad_data.adCreativeData.description as string} />
                    )}
                    {ad_data.adCreativeData.callToAction && (
                      <DetailRow label="Call to Action" value={<Badge>{ad_data.adCreativeData.callToAction as string}</Badge>} />
                    )}
                    {(ad_data.adCreativeData as { images?: { square?: string; vertical?: string; horizontal?: string } }).images && (
                      <div className="py-4 border-b border-border">
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Hochgeladene Bilder</h4>
                        <div className="grid grid-cols-3 gap-4">
                          {(ad_data.adCreativeData as { images?: { square?: string } }).images?.square && (
                            <div className="space-y-1">
                              <img 
                                src={(ad_data.adCreativeData as { images: { square: string } }).images.square} 
                                alt="Square" 
                                className="w-full aspect-square object-cover rounded border"
                              />
                              <p className="text-xs text-center text-muted-foreground">1:1</p>
                            </div>
                          )}
                          {(ad_data.adCreativeData as { images?: { vertical?: string } }).images?.vertical && (
                            <div className="space-y-1">
                              <img 
                                src={(ad_data.adCreativeData as { images: { vertical: string } }).images.vertical} 
                                alt="Vertical" 
                                className="w-full aspect-[9/16] object-cover rounded border"
                              />
                              <p className="text-xs text-center text-muted-foreground">9:16</p>
                            </div>
                          )}
                          {(ad_data.adCreativeData as { images?: { horizontal?: string } }).images?.horizontal && (
                            <div className="space-y-1">
                              <img 
                                src={(ad_data.adCreativeData as { images: { horizontal: string } }).images.horizontal} 
                                alt="Horizontal" 
                                className="w-full aspect-[1.91/1] object-cover rounded border"
                              />
                              <p className="text-xs text-center text-muted-foreground">1.91:1</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
