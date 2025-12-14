import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Folder, LayoutGrid, Square, AlertCircle, ChevronDown, CreditCard, Briefcase, Home, Megaphone, Palette, Users, MapPin, Settings, Globe, Smartphone, MessageCircle, Instagram, Phone, CalendarIcon, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { CAMPAIGN_OBJECTIVES } from '@/components/advertiser/campaigns/ObjectiveSelector';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type EditorLevel = 'campaign' | 'adset' | 'ad';
type BudgetType = 'campaign' | 'adset';
type BudgetSchedule = 'daily' | 'lifetime';
type BidStrategy = 'highest_volume' | 'cost_per_result' | 'bid_cap';
type ABTestType = 'creative' | 'audience' | 'placement' | 'custom';

const COST_PER_RESULT_OPTIONS = [
  { value: 'cpc', label: 'CPC (cost per link click)', recommended: true },
  { value: 'cpm_accounts', label: 'Cost per 1,000 Accounts Center accounts reached' },
  { value: 'purchase', label: 'Cost per purchase' },
  { value: '3s_video', label: 'Cost per 3-second video play' },
  { value: 'achievement', label: 'Cost per achievement unlocked' },
  { value: 'payment_info', label: 'Cost per add of payment info' },
  { value: 'add_to_cart', label: 'Cost per add to cart' },
  { value: 'add_to_wishlist', label: 'Cost per add to wishlist' },
  { value: 'app_activation', label: 'Cost per app activation' },
  { value: 'app_install', label: 'Cost per app install' },
  { value: 'checkout_initiated', label: 'Cost per checkout initiated' },
  { value: 'content_view', label: 'Cost per content view' },
  { value: 'credit_spend', label: 'Cost per credit spend' },
  { value: 'custom_event', label: 'Cost per custom event' },
  { value: 'ad_recall_lift', label: 'Cost per estimated ad recall lift (people)' },
  { value: 'event_response', label: 'Cost per event response' },
  { value: 'landing_page_view', label: 'Cost per landing page view' },
  { value: 'lead', label: 'Cost per lead' },
  { value: 'level_achieved', label: 'Cost per level achieved' },
  { value: 'like', label: 'Cost per like' },
  { value: 'd2_retention', label: 'Cost per mobile app D2 retention' },
  { value: 'd7_retention', label: 'Cost per mobile app D7 retention' },
  { value: 'messaging_contact', label: 'Cost per new messaging contact' },
  { value: 'offline_conversion', label: 'Cost per offline other conversion' },
  { value: 'post_engagement', label: 'Cost per post engagement' },
  { value: 'rating', label: 'Cost per rating submitted' },
  { value: 'registration', label: 'Cost per registration completed' },
  { value: 'search', label: 'Cost per search' },
  { value: 'tutorial', label: 'Cost per tutorial completed' },
];

type ConversionLocation = 'website' | 'app' | 'messages' | 'instagram_facebook' | 'calls';

const CONVERSION_LOCATIONS = [
  { value: 'website' as ConversionLocation, label: 'Website', description: 'Send traffic to your website.', icon: Globe, disabled: false },
  { value: 'app' as ConversionLocation, label: 'App', description: 'Send traffic to your app.', icon: Smartphone, disabled: true },
  { value: 'messages' as ConversionLocation, label: 'Message destinations', description: 'Send traffic to Messenger, Instagram and WhatsApp.', icon: MessageCircle, disabled: true },
  { value: 'instagram_facebook' as ConversionLocation, label: 'Instagram or Facebook', description: 'Send traffic to an Instagram profile, Facebook Page or both.', icon: Instagram, disabled: true },
  { value: 'calls' as ConversionLocation, label: 'Calls', description: 'Get people to call your phone number, Messenger or WhatsApp.', icon: Phone, disabled: false },
];

const PERFORMANCE_GOALS = [
  { value: 'landing_page_views', label: 'Maximize number of landing page views', description: "We'll try to show your ads to the people most likely to open the app or website linked in your ad.", group: 'main' },
  { value: 'link_clicks', label: 'Maximize number of link clicks', description: "We'll try to show your ads to the people most likely to click on them.", group: 'main' },
  { value: 'daily_unique_reach', label: 'Maximize daily unique reach', description: "We'll try to show your ads to people up to once per day.", group: 'other' },
  { value: 'conversations', label: 'Maximize number of conversations', description: "We'll try to show your ads to people most likely to have a conversation with you through messaging.", group: 'other' },
  { value: 'impressions', label: 'Maximize number of impressions', description: "We'll try to show your ads to people as many times as possible.", group: 'other' },
];

const COUNTRIES = [
  { code: 'WORLDWIDE', name: 'Worldwide' },
  { code: 'DE', name: 'Germany' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LV', name: 'Latvia' },
  { code: 'EE', name: 'Estonia' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'RU', name: 'Russia' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'IL', name: 'Israel' },
  { code: 'TH', name: 'Thailand' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'CN', name: 'China' },
  { code: 'TW', name: 'Taiwan' },
];

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
  const [costPerResultGoal, setCostPerResultGoal] = useState('cpc');
  
  // A/B Test
  const [abTestEnabled, setAbTestEnabled] = useState(false);
  const [abTestType, setAbTestType] = useState<ABTestType>('creative');
  const [abTestDuration, setAbTestDuration] = useState(7);
  const [abTestMetric, setAbTestMetric] = useState('cpc');
  
  // Special Ad Categories
  const [specialCategories, setSpecialCategories] = useState<string[]>([]);

  // Ad Set specific state
  const [conversionLocation, setConversionLocation] = useState<ConversionLocation>('website');
  const [performanceGoal, setPerformanceGoal] = useState('landing_page_views');
  const [adSetStartDate, setAdSetStartDate] = useState<Date>(new Date());
  const [adSetEndDateEnabled, setAdSetEndDateEnabled] = useState(false);
  const [adSetEndDate, setAdSetEndDate] = useState<Date | undefined>(undefined);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['DE']);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  const handleLocationToggle = (code: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations([...selectedLocations, code]);
    } else {
      setSelectedLocations(selectedLocations.filter(c => c !== code));
    }
  };

  const getLocationLabel = () => {
    if (selectedLocations.length === 0) return 'Select locations';
    if (selectedLocations.length === 1) {
      const country = COUNTRIES.find(c => c.code === selectedLocations[0]);
      return country?.name || selectedLocations[0];
    }
    return `${selectedLocations.length} locations selected`;
  };

  const handleCategoryToggle = (category: string, checked: boolean) => {
    if (checked) {
      setSpecialCategories([...specialCategories, category]);
    } else {
      setSpecialCategories(specialCategories.filter(c => c !== category));
    }
  };

  const getCategoryLabel = (count: number) => {
    if (count === 0) return 'Declare category if applicable';
    if (count === 1) {
      const cat = specialCategories[0];
      if (cat === 'financial') return 'Financial products and services';
      if (cat === 'employment') return 'Employment';
      if (cat === 'housing') return 'Housing';
      if (cat === 'social_politics') return 'Social issues, elections or politics';
    }
    return `${count} categories selected`;
  };

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

                    {/* Cost per result dropdown when that strategy is selected */}
                    {bidStrategy === 'cost_per_result' && (
                      <div className="mt-4 pt-4 border-t">
                        <Label className="text-sm font-medium mb-2 block">Cost per result</Label>
                        <Select value={costPerResultGoal} onValueChange={setCostPerResultGoal}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {COST_PER_RESULT_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <span>{option.label}</span>
                                  {option.recommended && (
                                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Recommended</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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

                  {/* A/B Test Options when enabled */}
                  {abTestEnabled && (
                    <div className="mt-6 pt-4 border-t space-y-6">
                      {/* What do you want to test? */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">What do you want to test?</Label>
                        <Select value={abTestType} onValueChange={(v) => setAbTestType(v as ABTestType)}>
                          <SelectTrigger>
                            <SelectValue className="text-left">
                              {abTestType === 'creative' && 'Creative'}
                              {abTestType === 'audience' && 'Audience'}
                              {abTestType === 'placement' && 'Placement'}
                              {abTestType === 'custom' && 'Custom'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="creative">
                              <div className="flex items-center gap-3 py-1">
                                <Palette className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">Creative</div>
                                  <div className="text-xs text-muted-foreground">Find out which images, videos or ad text work best.</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="audience">
                              <div className="flex items-center gap-3 py-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">Audience</div>
                                  <div className="text-xs text-muted-foreground">See how targeting a new audience can impact performance.</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="placement">
                              <div className="flex items-center gap-3 py-1">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">Placement</div>
                                  <div className="text-xs text-muted-foreground">Discover the most effective places to show your ads.</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="custom">
                              <div className="flex items-center gap-3 py-1">
                                <Settings className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">Custom</div>
                                  <div className="text-xs text-muted-foreground">Learn how changing multiple variables can affect results.</div>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* How long should the test run? */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">How long should the test run?</Label>
                        <p className="text-xs text-muted-foreground mb-2">Test duration</p>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            value={abTestDuration}
                            onChange={(e) => setAbTestDuration(Number(e.target.value))}
                            className="w-24"
                            min={1}
                            max={30}
                          />
                          <span className="text-sm text-muted-foreground">days</span>
                        </div>
                      </div>

                      {/* How do you want to compare performance? */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">How do you want to compare performance?</Label>
                        <Select value={abTestMetric} onValueChange={setAbTestMetric}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {COST_PER_RESULT_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <span>{option.label}</span>
                                  {option.recommended && (
                                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Recommended</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between font-normal hover:bg-blue-50">
                          <span className={specialCategories.length === 0 ? 'text-muted-foreground' : ''}>
                            {getCategoryLabel(specialCategories.length)}
                          </span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[500px] p-0" align="start">
                        <div 
                          className="flex items-start gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b"
                          onClick={() => handleCategoryToggle('financial', !specialCategories.includes('financial'))}
                        >
                          <Checkbox 
                            checked={specialCategories.includes('financial')}
                            onCheckedChange={(checked) => handleCategoryToggle('financial', !!checked)}
                            className="mt-1"
                          />
                          <CreditCard className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                          <div>
                            <div className="font-medium">Financial products and services</div>
                            <div className="text-xs text-muted-foreground">
                              Ads for credit cards, long-term financing, checking and savings accounts, investment services, insurance services, or other related financial opportunities.
                            </div>
                          </div>
                        </div>
                        <div 
                          className="flex items-start gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b"
                          onClick={() => handleCategoryToggle('employment', !specialCategories.includes('employment'))}
                        >
                          <Checkbox 
                            checked={specialCategories.includes('employment')}
                            onCheckedChange={(checked) => handleCategoryToggle('employment', !!checked)}
                            className="mt-1"
                          />
                          <Briefcase className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                          <div>
                            <div className="font-medium">Employment</div>
                            <div className="text-xs text-muted-foreground">
                              Ads for job offers, internships, professional certification programs or other related opportunities.
                            </div>
                          </div>
                        </div>
                        <div 
                          className="flex items-start gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b"
                          onClick={() => handleCategoryToggle('housing', !specialCategories.includes('housing'))}
                        >
                          <Checkbox 
                            checked={specialCategories.includes('housing')}
                            onCheckedChange={(checked) => handleCategoryToggle('housing', !!checked)}
                            className="mt-1"
                          />
                          <Home className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                          <div>
                            <div className="font-medium">Housing</div>
                            <div className="text-xs text-muted-foreground">
                              Ads for real estate listings, homeowners insurance, mortgage loans or other related opportunities.
                            </div>
                          </div>
                        </div>
                        <div 
                          className="flex items-start gap-3 p-3 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleCategoryToggle('social_politics', !specialCategories.includes('social_politics'))}
                        >
                          <Checkbox 
                            checked={specialCategories.includes('social_politics')}
                            onCheckedChange={(checked) => handleCategoryToggle('social_politics', !!checked)}
                            className="mt-1"
                          />
                          <Megaphone className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                          <div>
                            <div className="font-medium">Social issues, elections or politics</div>
                            <div className="text-xs text-muted-foreground">
                              Ads about social issues (such as the economy, or civil and social rights), elections, or political figures or campaigns.
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground mt-2">
                      If none of the categories apply to your ad, you may not need to select a Special Ad Category.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Next Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={() => setActiveLevel('adset')} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {activeLevel === 'adset' && (
            <div className="space-y-6">
              {/* Development Notice */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This page is still in development. Ad sets cannot be saved yet.
                </AlertDescription>
              </Alert>

              {/* Ad set name */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ad set name</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input 
                    value={adSetName}
                    onChange={(e) => setAdSetName(e.target.value)}
                    placeholder="New Traffic Ad Set"
                  />
                </CardContent>
              </Card>

              {/* Conversion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Conversion location */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Label className="text-sm font-medium">Conversion location</Label>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose where you want to drive traffic. <span className="text-primary cursor-pointer hover:underline">About conversion locations</span>
                    </p>
                    <RadioGroup 
                      value={conversionLocation} 
                      onValueChange={(v) => setConversionLocation(v as ConversionLocation)}
                      className="space-y-2"
                    >
                      {CONVERSION_LOCATIONS.map((location) => {
                        const IconComponent = location.icon;
                        return (
                          <div 
                            key={location.value}
                            className={cn(
                              "flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                              location.disabled 
                                ? "opacity-50 cursor-not-allowed bg-muted/30" 
                                : "hover:bg-blue-50",
                              conversionLocation === location.value && !location.disabled && "border-primary bg-blue-50"
                            )}
                            onClick={() => !location.disabled && setConversionLocation(location.value)}
                          >
                            <RadioGroupItem 
                              value={location.value} 
                              id={location.value} 
                              className="mt-0.5" 
                              disabled={location.disabled}
                            />
                            <IconComponent className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <Label 
                                htmlFor={location.value} 
                                className={cn(
                                  "font-medium cursor-pointer",
                                  location.disabled && "cursor-not-allowed"
                                )}
                              >
                                {location.label}
                              </Label>
                              <p className="text-sm text-muted-foreground">{location.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  {/* Performance goal */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-1">
                      <Label className="text-sm font-medium">Performance goal</Label>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      How you measure success for your ads. <span className="text-primary cursor-pointer hover:underline">About performance goals</span>
                    </p>
                    <Select value={performanceGoal} onValueChange={setPerformanceGoal}>
                      <SelectTrigger className="hover:bg-blue-50">
                        <SelectValue>
                          {PERFORMANCE_GOALS.find(g => g.value === performanceGoal)?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {PERFORMANCE_GOALS.filter(g => g.group === 'main').map((goal) => (
                            <SelectItem key={goal.value} value={goal.value} className="hover:bg-blue-50">
                              <div className="py-1">
                                <div className="font-medium">{goal.label}</div>
                                <div className="text-xs text-muted-foreground">{goal.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-xs text-muted-foreground">Other goals</SelectLabel>
                          {PERFORMANCE_GOALS.filter(g => g.group === 'other').map((goal) => (
                            <SelectItem key={goal.value} value={goal.value} className="hover:bg-blue-50">
                              <div className="py-1">
                                <div className="font-medium">{goal.label}</div>
                                <div className="text-xs text-muted-foreground">{goal.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Budget & schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Budget & schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Budget info */}
                  <div>
                    <Label className="text-sm font-medium">Budget</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      You set a daily Advantage+ campaign budget of €{budgetAmount.toFixed(2)}.
                    </p>
                  </div>

                  {/* Start date */}
                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium mb-2 block">Start date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                        className={cn(
                          "w-[280px] justify-start text-left font-normal hover:bg-blue-50 hover:text-foreground",
                          !adSetStartDate && "text-muted-foreground"
                        )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {adSetStartDate ? format(adSetStartDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={adSetStartDate}
                          onSelect={(date) => date && setAdSetStartDate(date)}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End date */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <Checkbox
                        id="end-date-toggle"
                        checked={adSetEndDateEnabled}
                        onCheckedChange={(checked) => setAdSetEndDateEnabled(!!checked)}
                      />
                      <Label htmlFor="end-date-toggle" className="text-sm font-medium cursor-pointer">
                        Set an end date
                      </Label>
                    </div>
                    
                    {adSetEndDateEnabled && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[280px] justify-start text-left font-normal hover:bg-blue-50",
                              !adSetEndDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {adSetEndDate ? format(adSetEndDate, "PPP") : <span>Pick an end date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={adSetEndDate}
                            onSelect={setAdSetEndDate}
                            initialFocus
                            disabled={(date) => date <= adSetStartDate}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Audience controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audience controls</CardTitle>
                  <CardDescription>
                    Set criteria for where ads for this campaign can be delivered. <span className="text-primary cursor-pointer hover:underline">Learn more</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Locations</Label>
                    <div className="flex items-start gap-2">
                      <div className="flex-1 px-3 py-2 border rounded-md text-sm">
                        {selectedLocations.length === 0 ? (
                          <span className="text-muted-foreground">Select locations</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {selectedLocations.map((code) => {
                              const country = COUNTRIES.find(c => c.code === code);
                              return <span key={code}>{country?.name || code}</span>;
                            })}
                          </div>
                        )}
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="hover:bg-blue-50">
                            Edit
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0" align="end">
                          <div className="p-3 border-b">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search locations..."
                                value={locationSearchQuery}
                                onChange={(e) => setLocationSearchQuery(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto p-2">
                            {filteredCountries.map((country) => (
                              <div
                                key={country.code}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 cursor-pointer rounded-md"
                                onClick={() => handleLocationToggle(country.code, !selectedLocations.includes(country.code))}
                              >
                                <Checkbox
                                  checked={selectedLocations.includes(country.code)}
                                  onCheckedChange={(checked) => handleLocationToggle(country.code, !!checked)}
                                />
                                <span className="text-sm">{country.name}</span>
                                {selectedLocations.includes(country.code) && (
                                  <Check className="h-4 w-4 text-primary ml-auto" />
                                )}
                              </div>
                            ))}
                            {filteredCountries.length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No locations found
                              </p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Button to Ad */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setActiveLevel('campaign')} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setActiveLevel('ad')} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
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
