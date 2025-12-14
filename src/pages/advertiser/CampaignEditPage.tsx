import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Folder, LayoutGrid, Square, AlertCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CAMPAIGN_OBJECTIVES } from '@/components/advertiser/campaigns/ObjectiveSelector';
import { useState } from 'react';

type EditorLevel = 'campaign' | 'adset' | 'ad';
type BudgetType = 'campaign' | 'adset';
type BudgetSchedule = 'daily' | 'lifetime';
type BidStrategy = 'highest_volume' | 'cost_per_result' | 'bid_cap';

export default function CampaignEditPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const objective = searchParams.get('objective') || 'traffic';
  const buyingType = searchParams.get('buyingType') || 'auction';
  const setup = searchParams.get('setup') || 'recommended';

  const [activeLevel, setActiveLevel] = useState<EditorLevel>('campaign');
  
  // Names for sidebar
  const [campaignName, setCampaignName] = useState('New Traffic Campaign');
  const [adSetName, setAdSetName] = useState('New Traffic Ad Set');
  const [adName, setAdName] = useState('New Traffic Ad');
  
  // Budget settings
  const [budgetType, setBudgetType] = useState<BudgetType>('campaign');
  const [budgetSchedule, setBudgetSchedule] = useState<BudgetSchedule>('daily');
  const [budgetAmount, setBudgetAmount] = useState(20);
  const [bidStrategy, setBidStrategy] = useState<BidStrategy>('highest_volume');
  const [showBidStrategyEdit, setShowBidStrategyEdit] = useState(false);
  
  // A/B Test
  const [abTestEnabled, setAbTestEnabled] = useState(false);
  
  // Special Ad Categories
  const [specialCategory, setSpecialCategory] = useState<string>('');

  const objectiveConfig = CAMPAIGN_OBJECTIVES.find(obj => obj.id === objective);
  const ObjectiveIcon = objectiveConfig?.icon;

  // Budget calculations
  const dailyBudget = budgetSchedule === 'daily' ? budgetAmount : Math.round(budgetAmount / 30);
  const maxDailySpend = Math.round(dailyBudget * 1.75 * 100) / 100;
  const maxWeeklySpend = dailyBudget * 7;

  const getBidStrategyLabel = (strategy: BidStrategy) => {
    switch (strategy) {
      case 'highest_volume': return 'Highest volume';
      case 'cost_per_result': return 'Cost per result goal';
      case 'bid_cap': return 'Bid cap';
    }
  };

  const getBidStrategyDescription = (strategy: BidStrategy) => {
    switch (strategy) {
      case 'highest_volume': return 'Get the most results for your budget.';
      case 'cost_per_result': return 'Aim for a certain cost per result while maximizing the volume of results.';
      case 'bid_cap': return 'Set a maximum bid for each auction.';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/advertiser/campaigns')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {ObjectiveIcon && (
                <div className={`h-8 w-8 rounded-full ${objectiveConfig?.color} flex items-center justify-center`}>
                  <ObjectiveIcon className="h-4 w-4 text-white" />
                </div>
              )}
              <div>
                <h1 className="font-semibold text-foreground">New Campaign - {objectiveConfig?.label}</h1>
                <p className="text-xs text-muted-foreground capitalize">{buyingType} • {setup === 'recommended' ? 'Recommended Settings' : 'Manual'}</p>
              </div>
            </div>
          </div>
          <Button disabled>
            Save Draft
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Hierarchical Navigation (Meta Ads Manager Style) */}
        <div className="w-72 border-r bg-card/30 p-4 min-h-[calc(100vh-57px)]">
          <div className="space-y-0.5">
            {/* Campaign Level */}
            <button
              onClick={() => setActiveLevel('campaign')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                activeLevel === 'campaign'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <Folder className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium truncate">{campaignName}</span>
            </button>

            {/* Ad Set Level - Indented */}
            <button
              onClick={() => setActiveLevel('adset')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ml-4 ${
                activeLevel === 'adset'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              <LayoutGrid className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium truncate">{adSetName}</span>
            </button>

            {/* Ad Level - Further Indented */}
            <button
              onClick={() => setActiveLevel('ad')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ml-8 ${
                activeLevel === 'ad'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              <Square className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium truncate">{adName}</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 max-w-3xl">
          {activeLevel === 'campaign' && (
            <div className="space-y-6">
              {/* Development Notice */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This page is still in development. Campaigns cannot be saved yet.
                </AlertDescription>
              </Alert>

              {/* Campaign Name */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campaign name</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input 
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Enter a name for your campaign"
                  />
                </CardContent>
              </Card>

              {/* Campaign Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campaign details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Buying type</Label>
                    <p className="font-medium capitalize">{buyingType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Campaign objective</Label>
                    <p className="font-medium">{objectiveConfig?.label}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Budget */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Budget</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={budgetType} onValueChange={(v) => setBudgetType(v as BudgetType)}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="campaign" id="campaign-budget" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="campaign-budget" className="font-medium cursor-pointer">Campaign budget</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically distribute your budget to the best opportunities across your campaign. Also known as Advantage+ campaign budget.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="adset" id="adset-budget" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="adset-budget" className="font-medium cursor-pointer">Ad set budget</Label>
                        <p className="text-sm text-muted-foreground">
                          Set different bid strategies or budget schedules for each ad set.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>

                  {budgetType === 'campaign' && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex gap-3">
                        <Select value={budgetSchedule} onValueChange={(v) => {
                          setBudgetSchedule(v as BudgetSchedule);
                          setBudgetAmount(v === 'daily' ? 20 : 350);
                        }}>
                          <SelectTrigger className="w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily budget</SelectItem>
                            <SelectItem value="lifetime">Lifetime budget</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                          <Input 
                            type="number"
                            value={budgetAmount}
                            onChange={(e) => setBudgetAmount(Number(e.target.value))}
                            className="pl-7"
                          />
                        </div>
                      </div>
                      
                      {budgetSchedule === 'daily' && (
                        <p className="text-sm text-muted-foreground">
                          You'll spend an average of €{budgetAmount.toFixed(2)} per day. Your maximum daily spend is €{maxDailySpend.toFixed(2)} and your maximum weekly spend is €{maxWeeklySpend.toFixed(2)}.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Campaign Bid Strategy */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium">Campaign bid strategy</Label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowBidStrategyEdit(!showBidStrategyEdit)}
                      >
                        Edit
                      </Button>
                    </div>
                    
                    {!showBidStrategyEdit ? (
                      <div>
                        <p className="font-medium">{getBidStrategyLabel(bidStrategy)}</p>
                        <p className="text-sm text-muted-foreground">{getBidStrategyDescription(bidStrategy)}</p>
                      </div>
                    ) : (
                      <RadioGroup value={bidStrategy} onValueChange={(v) => setBidStrategy(v as BidStrategy)} className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="highest_volume" id="highest_volume" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="highest_volume" className="font-medium cursor-pointer">Highest volume</Label>
                            <p className="text-sm text-muted-foreground">Get the most results for your budget.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="cost_per_result" id="cost_per_result" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="cost_per_result" className="font-medium cursor-pointer">Cost per result goal</Label>
                            <p className="text-sm text-muted-foreground">Aim for a certain cost per result while maximizing the volume of results.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="bid_cap" id="bid_cap" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="bid_cap" className="font-medium cursor-pointer flex items-center gap-1">
                              Other options <ChevronDown className="h-3 w-3" />
                            </Label>
                            <p className="text-sm text-muted-foreground">Bid cap</p>
                          </div>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* A/B Test */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Label className="font-medium text-base">A/B test</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Help improve ad performance by comparing versions to see what works best. For accuracy, each one will be shown to separate groups of your audience.
                      </p>
                    </div>
                    <Switch 
                      checked={abTestEnabled} 
                      onCheckedChange={setAbTestEnabled}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Special Ad Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Special Ad Categories</CardTitle>
                  <CardDescription>
                    Declare if your ads are related to financial products and services, employment, housing, social issues, elections or politics to help prevent ad rejections. Requirements differ by country.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Categories</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select the categories that best describe what this campaign will advertise.
                    </p>
                    <Select value={specialCategory} onValueChange={setSpecialCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">
                          <div className="py-1">
                            <div className="font-medium">Financial products and services</div>
                            <div className="text-xs text-muted-foreground max-w-md">
                              Ads for credit cards, long-term financing, checking and savings accounts, investment services, insurance services, or other related financial opportunities.
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="employment">
                          <div className="py-1">
                            <div className="font-medium">Employment</div>
                            <div className="text-xs text-muted-foreground max-w-md">
                              Ads for job offers, internships, professional certification programs or other related opportunities.
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="housing">
                          <div className="py-1">
                            <div className="font-medium">Housing</div>
                            <div className="text-xs text-muted-foreground max-w-md">
                              Ads for real estate listings, homeowners insurance, mortgage loans or other related opportunities.
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="social_politics">
                          <div className="py-1">
                            <div className="font-medium">Social issues, elections or politics</div>
                            <div className="text-xs text-muted-foreground max-w-md">
                              Ads about social issues (such as the economy, or civil and social rights), elections, or political figures or campaigns.
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2">
                      If none of the categories apply to your ad, you may not need to select a Special Ad Category.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeLevel === 'adset' && (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ad set settings are not yet available.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ad set name</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input 
                    value={adSetName}
                    onChange={(e) => setAdSetName(e.target.value)}
                    placeholder="Enter a name for your ad set"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ad Set</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Targeting, budget and schedule will be configured here.
                </CardContent>
              </Card>
            </div>
          )}

          {activeLevel === 'ad' && (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ad settings are not yet available.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ad name</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input 
                    value={adName}
                    onChange={(e) => setAdName(e.target.value)}
                    placeholder="Enter a name for your ad"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ad</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Creatives, copy and call-to-actions will be configured here.
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
