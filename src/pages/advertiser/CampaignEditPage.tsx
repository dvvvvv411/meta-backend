import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Folder, LayoutGrid, Square, AlertCircle, ChevronDown, CreditCard, Briefcase, Home, Megaphone, Palette, Users, MapPin, Settings, Globe, Smartphone, MessageCircle, Instagram, Phone, CalendarIcon, Search, Check, Info, ChevronsUpDown, Image as ImageIcon, Video, Pencil, Save, Loader2, Send } from 'lucide-react';
import { useUserBalance } from '@/hooks/useUserBalance';
import { toast } from 'sonner';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { CAMPAIGN_OBJECTIVES } from '@/components/advertiser/campaigns/ObjectiveSelector';
import { AdCreativeModal, AdCreativeData, CALL_TO_ACTION_OPTIONS } from '@/components/advertiser/campaigns/AdCreativeModal';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCampaignDrafts, CampaignDraft } from '@/hooks/useCampaignDrafts';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
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

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', disabled: false },
  { value: 'instagram', label: 'Instagram', disabled: false },
  { value: 'audience_network', label: 'Audience Network', disabled: false },
  { value: 'messenger', label: 'Messenger', disabled: false },
  { value: 'whatsapp', label: 'WhatsApp', disabled: true },
  { value: 'threads', label: 'Threads', disabled: false },
];

const PLACEMENT_GROUPS = [
  {
    title: 'Feeds',
    description: 'Get high visibility for your business with ads in feeds',
    placements: [
      { value: 'fb_feed', label: 'Facebook Feed' },
      { value: 'fb_profile_feed', label: 'Facebook profile feed' },
      { value: 'ig_feed', label: 'Instagram feed' },
      { value: 'ig_profile_feed', label: 'Instagram profile feed' },
      { value: 'fb_marketplace', label: 'Facebook Marketplace' },
      { value: 'fb_right_column', label: 'Facebook right column' },
      { value: 'ig_explore', label: 'Instagram Explore' },
      { value: 'ig_explore_home', label: 'Instagram Explore home' },
      { value: 'fb_business_explore', label: 'Facebook Business Explore' },
      { value: 'threads_feed', label: 'Threads feed' },
      { value: 'fb_notifications', label: 'Facebook Notifications' },
    ]
  },
  {
    title: 'Stories, Status, Reels',
    description: 'Tell a rich, visual story with immersive, fullscreen vertical ads',
    placements: [
      { value: 'ig_stories', label: 'Instagram Stories' },
      { value: 'fb_stories', label: 'Facebook Stories' },
      { value: 'messenger_stories', label: 'Messenger Stories' },
      { value: 'ig_reels', label: 'Instagram Reels' },
      { value: 'fb_reels', label: 'Facebook Reels' },
      { value: 'whatsapp_status', label: 'WhatsApp Status' },
    ]
  },
  {
    title: 'In-stream ads for reels',
    description: 'Reach people before, during or after they watch a reel',
    placements: [
      { value: 'fb_instream_reels', label: 'Facebook in-stream reels' },
      { value: 'fb_reels_ads', label: 'Ads on Facebook Reels' },
    ]
  },
  {
    title: 'Search results',
    description: 'Get visibility for your business as people search',
    placements: [
      { value: 'fb_search', label: 'Facebook search results' },
      { value: 'ig_search', label: 'Instagram search results' },
    ]
  },
  {
    title: 'Apps and sites',
    description: 'Expand your reach with ads in external apps and websites',
    placements: [
      { value: 'an_native', label: 'Audience Network native, banner and interstitial' },
      { value: 'an_rewarded', label: 'Audience Network rewarded videos' },
    ]
  },
];

const ALL_PLACEMENTS = PLACEMENT_GROUPS.flatMap(group => group.placements.map(p => p.value));

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

const AD_SETUP_OPTIONS = [
  { value: 'create_ad', label: 'Create ad', disabled: false },
  { value: 'use_existing_post', label: 'Use existing post', disabled: true },
  { value: 'use_creative_hub', label: 'Use Creative Hub mockup', disabled: true },
];

const COUNTRY_CODES = [
  { code: '+1', country: 'United States' },
  { code: '+1', country: 'Canada' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+49', country: 'Germany' },
  { code: '+43', country: 'Austria' },
  { code: '+41', country: 'Switzerland' },
  { code: '+33', country: 'France' },
  { code: '+34', country: 'Spain' },
  { code: '+39', country: 'Italy' },
  { code: '+31', country: 'Netherlands' },
  { code: '+32', country: 'Belgium' },
  { code: '+48', country: 'Poland' },
  { code: '+351', country: 'Portugal' },
  { code: '+46', country: 'Sweden' },
  { code: '+47', country: 'Norway' },
  { code: '+45', country: 'Denmark' },
  { code: '+358', country: 'Finland' },
  { code: '+353', country: 'Ireland' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+30', country: 'Greece' },
  { code: '+36', country: 'Hungary' },
  { code: '+40', country: 'Romania' },
  { code: '+359', country: 'Bulgaria' },
  { code: '+385', country: 'Croatia' },
  { code: '+421', country: 'Slovakia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+370', country: 'Lithuania' },
  { code: '+371', country: 'Latvia' },
  { code: '+372', country: 'Estonia' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+356', country: 'Malta' },
  { code: '+357', country: 'Cyprus' },
  { code: '+61', country: 'Australia' },
  { code: '+64', country: 'New Zealand' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+65', country: 'Singapore' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+91', country: 'India' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+54', country: 'Argentina' },
  { code: '+27', country: 'South Africa' },
  { code: '+971', country: 'United Arab Emirates' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+90', country: 'Turkey' },
  { code: '+7', country: 'Russia' },
  { code: '+380', country: 'Ukraine' },
  { code: '+972', country: 'Israel' },
  { code: '+66', country: 'Thailand' },
  { code: '+60', country: 'Malaysia' },
  { code: '+63', country: 'Philippines' },
  { code: '+62', country: 'Indonesia' },
  { code: '+84', country: 'Vietnam' },
  { code: '+86', country: 'China' },
  { code: '+886', country: 'Taiwan' },
];

export default function CampaignEditPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveDraftAsync, isSaving, loadDraft } = useCampaignDrafts();
  const { balanceUsd } = useUserBalance();
  const isMobile = useIsMobile();
  
  const MINIMUM_PUBLISH_BALANCE = 1000;
  
  const objective = searchParams.get('objective') || 'traffic';
  const buyingType = searchParams.get('buyingType') || 'auction';
  const setup = searchParams.get('setup') || 'recommended';
  const accountId = searchParams.get('account') || '';
  const draftId = searchParams.get('draftId') || null;

  const [activeLevel, setActiveLevel] = useState<EditorLevel>('campaign');
  
  // Helper function to change level and scroll to top
  const handleLevelChange = (level: EditorLevel) => {
    setActiveLevel(level);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
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
  const [beneficiary, setBeneficiary] = useState('');
  
  // Placements
  const [placementType, setPlacementType] = useState<'advantage' | 'manual'>('advantage');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram', 'audience_network', 'messenger', 'threads']);
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>(ALL_PLACEMENTS);

  // Ad level state
  const [adSetup, setAdSetup] = useState('create_ad');
  const [creativeSource, setCreativeSource] = useState('manual_upload');
  const [adFormat, setAdFormat] = useState('single');
  const [adDestination, setAdDestination] = useState<'website' | 'phone'>('website');
  const [websiteUrl, setWebsiteUrl] = useState('http://www.example.com/page');
  const [displayLink, setDisplayLink] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+49');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCodeOpen, setCountryCodeOpen] = useState(false);
  const [countryCodeSearch, setCountryCodeSearch] = useState('');

  // Ad Creative state
  const [creativeType, setCreativeType] = useState<'image' | 'video' | null>(null);
  const [creativeModalOpen, setCreativeModalOpen] = useState(false);
  const [adCreativeData, setAdCreativeData] = useState<AdCreativeData | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(!!draftId);

  // Load draft if draftId is present
  useEffect(() => {
    const loadDraftData = async () => {
      if (!draftId) {
        setIsLoadingDraft(false);
        return;
      }
      
      const draft = await loadDraft(draftId);
      if (!draft) {
        setIsLoadingDraft(false);
        return;
      }

      // Campaign data
      setCampaignName(draft.campaign_data.campaignName || 'New Traffic Campaign');
      setBudgetType((draft.campaign_data.budgetType as BudgetType) || 'campaign');
      setBudgetSchedule((draft.campaign_data.budgetSchedule as BudgetSchedule) || 'daily');
      setBudgetAmount(draft.campaign_data.budgetAmount || 20);
      setBidStrategy((draft.campaign_data.bidStrategy as BidStrategy) || 'highest_volume');
      setCostPerResultGoal(draft.campaign_data.costPerResultGoal || 'cpc');
      setAbTestEnabled(draft.campaign_data.abTestEnabled || false);
      setAbTestType((draft.campaign_data.abTestType as ABTestType) || 'creative');
      setAbTestDuration(draft.campaign_data.abTestDuration || 7);
      setAbTestMetric(draft.campaign_data.abTestMetric || 'cpc');
      setSpecialCategories(draft.campaign_data.specialCategories || []);

      // AdSet data
      setAdSetName(draft.adset_data.adSetName || 'New Traffic Ad Set');
      setConversionLocation((draft.adset_data.conversionLocation as ConversionLocation) || 'website');
      setPerformanceGoal(draft.adset_data.performanceGoal || 'landing_page_views');
      if (draft.adset_data.adSetStartDate) {
        setAdSetStartDate(new Date(draft.adset_data.adSetStartDate));
      }
      setAdSetEndDateEnabled(draft.adset_data.adSetEndDateEnabled || false);
      if (draft.adset_data.adSetEndDate) {
        setAdSetEndDate(new Date(draft.adset_data.adSetEndDate));
      }
      setSelectedLocations(draft.adset_data.selectedLocations || ['DE']);
      setBeneficiary(draft.adset_data.beneficiary || '');
      setPlacementType((draft.adset_data.placementType as 'advantage' | 'manual') || 'advantage');
      setSelectedPlatforms(draft.adset_data.selectedPlatforms || ['facebook', 'instagram', 'audience_network', 'messenger', 'threads']);
      setSelectedPlacements(draft.adset_data.selectedPlacements || ALL_PLACEMENTS);

      // Ad data
      setAdName(draft.ad_data.adName || 'New Traffic Ad');
      setAdSetup(draft.ad_data.adSetup || 'create_ad');
      setCreativeSource(draft.ad_data.creativeSource || 'manual_upload');
      setAdFormat(draft.ad_data.adFormat || 'single');
      setAdDestination((draft.ad_data.adDestination as 'website' | 'phone') || 'website');
      setWebsiteUrl(draft.ad_data.websiteUrl || 'http://www.example.com/page');
      setDisplayLink(draft.ad_data.displayLink || '');
      setPhoneCountryCode(draft.ad_data.phoneCountryCode || '+49');
      setPhoneNumber(draft.ad_data.phoneNumber || '');
      setCreativeType((draft.ad_data.creativeType as 'image' | 'video' | null) || null);
      if (draft.ad_data.adCreativeData) {
        setAdCreativeData(draft.ad_data.adCreativeData as unknown as AdCreativeData);
      }
      
      setIsLoadingDraft(false);
    };

    loadDraftData();
  }, [draftId]);

  const handleSaveDraft = async () => {
    if (!user?.id || !accountId) return;

    const draft: Omit<CampaignDraft, 'created_at' | 'updated_at'> = {
      id: draftId || undefined,
      user_id: user.id,
      account_id: accountId,
      name: campaignName,
      buying_type: buyingType,
      objective,
      setup,
      campaign_data: {
        campaignName,
        budgetType,
        budgetSchedule,
        budgetAmount,
        bidStrategy,
        costPerResultGoal,
        abTestEnabled,
        abTestType,
        abTestDuration,
        abTestMetric,
        specialCategories,
      },
      adset_data: {
        adSetName,
        conversionLocation,
        performanceGoal,
        adSetStartDate: adSetStartDate.toISOString(),
        adSetEndDateEnabled,
        adSetEndDate: adSetEndDate?.toISOString() || null,
        selectedLocations,
        beneficiary,
        placementType,
        selectedPlatforms,
        selectedPlacements,
      },
      ad_data: {
        adName,
        adSetup,
        creativeSource,
        adFormat,
        adDestination,
        websiteUrl,
        displayLink,
        phoneCountryCode,
        phoneNumber,
        creativeType: creativeType || '',
        adCreativeData: adCreativeData as unknown as Record<string, unknown> || {},
      },
    };

    await saveDraftAsync(draft);
    navigate('/advertiser/campaigns');
  };

  const validateAllFields = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Campaign validation
    if (!campaignName.trim()) errors.push('Campaign name is required');
    if (budgetType === 'campaign' && budgetAmount <= 0) errors.push('Budget must be greater than 0');
    
    // Ad Set validation
    if (!adSetName.trim()) errors.push('Ad set name is required');
    if (!beneficiary.trim()) errors.push('Beneficiary is required');
    if (selectedLocations.length === 0) errors.push('At least one location is required');
    
    // Ad validation
    if (!adName.trim()) errors.push('Ad name is required');
    if (adDestination === 'website' && !websiteUrl.trim()) errors.push('Website URL is required');
    if (adDestination === 'phone' && !phoneNumber.trim()) errors.push('Phone number is required');
    if (!adCreativeData) errors.push('Ad creative is required');
    if (adCreativeData && (!adCreativeData.primaryTexts[0]?.trim())) errors.push('At least one primary text is required');
    if (adCreativeData && (!adCreativeData.headlines[0]?.trim())) errors.push('At least one headline is required');
    
    return { isValid: errors.length === 0, errors };
  };

  const handlePublish = async () => {
    // Zuerst Guthaben prüfen
    if (balanceUsd < MINIMUM_PUBLISH_BALANCE) {
      toast.error('Unzureichendes Guthaben', {
        description: 'Du benötigst mindestens $1,000 Guthaben, um eine Kampagne zu veröffentlichen.'
      });
      return;
    }

    const { isValid, errors } = validateAllFields();
    
    if (!isValid) {
      toast.error('Please fill in all required fields', {
        description: errors.slice(0, 3).join(', ') + (errors.length > 3 ? `... and ${errors.length - 3} more` : '')
      });
      return;
    }
    
    // Save as draft (hardcoded behavior for now)
    await handleSaveDraft();
    
    toast.success('Campaign published!', {
      description: 'Your campaign has been saved and is ready for review.'
    });
  };

  const filteredCountryCodes = COUNTRY_CODES.filter(item => {
    const searchTerm = countryCodeSearch.toLowerCase().replace('+', '');
    return (
      item.country.toLowerCase().includes(searchTerm) ||
      item.code.replace('+', '').includes(searchTerm)
    );
  });

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

  // Show loading state while draft is being loaded
  if (isLoadingDraft) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
                <h1 className="font-semibold text-foreground text-sm md:text-base">New Campaign - {objectiveConfig?.label}</h1>
                <p className="text-xs text-muted-foreground capitalize hidden sm:block">{buyingType} • {setup === 'recommended' ? 'Recommended Settings' : 'Manual'}</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSaveDraft} 
            disabled={isSaving}
            className="gap-2"
            size={isMobile ? 'sm' : 'default'}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Draft</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Level Navigation */}
      <div className="md:hidden border-b bg-card/50 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => handleLevelChange('campaign')}
            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeLevel === 'campaign' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
            }`}
          >
            <Folder className="h-4 w-4" />
            <span className="text-xs font-medium">Campaign</span>
          </button>
          
          <button
            onClick={() => handleLevelChange('adset')}
            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeLevel === 'adset' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="text-xs font-medium">Ad Set</span>
          </button>
          
          <button
            onClick={() => handleLevelChange('ad')}
            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeLevel === 'ad' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
            }`}
          >
            <Square className="h-4 w-4" />
            <span className="text-xs font-medium">Ad</span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Hierarchical Navigation (Meta Ads Manager Style) - Hidden on Mobile */}
        <div className="hidden md:block w-72 border-r bg-card/30 p-4 min-h-[calc(100vh-57px)]">
          <div className="space-y-0.5">
            {/* Campaign Level */}
            <button
              onClick={() => handleLevelChange('campaign')}
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
            <div className="pl-4">
              <button
                onClick={() => handleLevelChange('adset')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeLevel === 'adset'
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <LayoutGrid className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium truncate">{adSetName}</span>
              </button>
            </div>

            {/* Ad Level - Further Indented */}
            <div className="pl-8">
              <button
                onClick={() => handleLevelChange('ad')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
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
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto">
          {activeLevel === 'campaign' && (
            <div className="space-y-6">
              {/* Development Notice */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This campaign is a draft. Click "Save Draft" to save your progress.
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
                <Button onClick={() => handleLevelChange('adset')} className="gap-2">
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

              {/* Beneficiary and payer */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Beneficiary and payer</CardTitle>
                  <CardDescription>
                    Beneficiary and payer information is required for ad sets with audiences in the European Union and is saved in Advertising settings. This information will be publicly available in the Meta Ad Library for a year but not shown on any ads.{' '}
                    <span className="text-primary cursor-pointer hover:underline">Learn more</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Beneficiary <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      placeholder="Enter a person or organization"
                      value={beneficiary}
                      onChange={(e) => setBeneficiary(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the person or organization benefiting from the ads in this ad set.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Placements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Placements</CardTitle>
                  <CardDescription>
                    Choose where your ad appears across Meta technologies.{' '}
                    <span className="text-primary cursor-pointer hover:underline">Learn more</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Label className="text-sm font-medium">Placement selection</Label>
                  
                  {/* Advantage+ Option */}
                  <div 
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-colors",
                      placementType === 'advantage' ? 'border-primary bg-blue-50' : 'hover:bg-blue-50'
                    )}
                    onClick={() => setPlacementType('advantage')}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center",
                        placementType === 'advantage' ? 'border-primary' : 'border-muted-foreground'
                      )}>
                        {placementType === 'advantage' && (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Advantage+ placements (recommended)</p>
                        <p className="text-sm text-muted-foreground">
                          Use Advantage+ placements to maximize your budget and help show your ads to more people. Facebook's delivery system will allocate your ad set's budget across multiple placements based on where they're likely to perform best.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Manual Option */}
                  <div 
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-colors",
                      placementType === 'manual' ? 'border-primary bg-blue-50' : 'hover:bg-blue-50'
                    )}
                    onClick={() => setPlacementType('manual')}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center",
                        placementType === 'manual' ? 'border-primary' : 'border-muted-foreground'
                      )}>
                        {placementType === 'manual' && (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Manual placements</p>
                        <p className="text-sm text-muted-foreground">
                          Manually choose the places to show your ad. The more placements you select, the more opportunities you'll have to reach your target audience and achieve your business goals.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Manual Placements Details */}
                  {placementType === 'manual' && (
                    <div className="space-y-6 pt-4 border-t">
                      {/* Devices */}
                      <div className="flex justify-between items-center">
                        <div>
                          <Label className="font-medium">Devices</Label>
                          <p className="text-sm text-muted-foreground">All devices</p>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                      
                      {/* Platforms */}
                      <div className="space-y-3">
                        <Label className="font-medium">Platforms</Label>
                        <div className="space-y-2">
                          {PLATFORMS.map(platform => (
                            <div key={platform.value} className="flex items-center gap-2">
                              <Checkbox 
                                id={`platform-${platform.value}`}
                                checked={selectedPlatforms.includes(platform.value)}
                                disabled={platform.disabled}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedPlatforms([...selectedPlatforms, platform.value]);
                                  } else {
                                    setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.value));
                                  }
                                }}
                              />
                              <label 
                                htmlFor={`platform-${platform.value}`}
                                className={cn("text-sm cursor-pointer", platform.disabled && 'opacity-50')}
                              >
                                {platform.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Asset customization */}
                      <div>
                        <Label className="font-medium">Asset customization</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedPlacements.length} / 21 placements that support asset customization
                        </p>
                      </div>
                      
                      {/* Placements header */}
                      <div>
                        <Label className="font-medium">Placements</Label>
                      </div>
                      
                      {/* Warning Banner */}
                      <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          The Facebook video feeds placement is no longer available. Please use the Facebook Reels placement instead.
                        </AlertDescription>
                      </Alert>
                      
                      {/* Placement Groups */}
                      {PLACEMENT_GROUPS.map(group => (
                        <div key={group.title} className="space-y-3">
                          <div>
                            <Label className="font-medium">{group.title}</Label>
                            <p className="text-xs text-muted-foreground">{group.description}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                            {group.placements.map(placement => (
                              <div key={placement.value} className="flex items-center gap-2">
                                <Checkbox 
                                  id={`placement-${placement.value}`}
                                  checked={selectedPlacements.includes(placement.value)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedPlacements([...selectedPlacements, placement.value]);
                                    } else {
                                      setSelectedPlacements(selectedPlacements.filter(p => p !== placement.value));
                                    }
                                  }}
                                />
                                <label 
                                  htmlFor={`placement-${placement.value}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {placement.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Next Button to Ad */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => handleLevelChange('campaign')} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => handleLevelChange('ad')} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {activeLevel === 'ad' && (
            <div className="space-y-6">
              {/* Ad name */}
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

              {/* Ad setup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ad setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ad setup dropdown */}
                  <Select value={adSetup} onValueChange={setAdSetup}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AD_SETUP_OPTIONS.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          disabled={option.disabled}
                          className={option.disabled ? 'opacity-50' : ''}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Creative source */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Creative source</Label>
                      <p className="text-sm text-muted-foreground">Choose how you'd like to provide the media for your ad.</p>
                    </div>
                    <RadioGroup value={creativeSource} onValueChange={setCreativeSource} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="manual_upload" id="creative-manual" className="h-5 w-5 shrink-0" />
                        <Label htmlFor="creative-manual" className="cursor-pointer">Manual upload</Label>
                      </div>
                      <div className="flex items-start space-x-3 opacity-50">
                        <RadioGroupItem value="catalog" id="creative-catalog" className="h-5 w-5 shrink-0 mt-0.5" disabled />
                        <div>
                          <Label htmlFor="creative-catalog" className="cursor-not-allowed">Advantage+ catalog ads</Label>
                          <p className="text-sm text-muted-foreground">Achieve your goals using product information by showing relevant product media from your catalog</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Format */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Format</Label>
                      <p className="text-sm text-muted-foreground">Choose an ad creative layout.</p>
                    </div>
                    <RadioGroup value={adFormat} onValueChange={setAdFormat} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="single" id="format-single" className="h-5 w-5 shrink-0" />
                        <Label htmlFor="format-single" className="cursor-pointer">Single image or video</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="carousel" id="format-carousel" className="h-5 w-5 shrink-0" />
                        <Label htmlFor="format-carousel" className="cursor-pointer">Carousel</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Destination */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Destination</CardTitle>
                  <CardDescription>
                    Tell us where to send people immediately after they tap or click your ad.{' '}
                    <button className="text-primary hover:underline">Learn more</button>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={adDestination} onValueChange={(val) => setAdDestination(val as 'website' | 'phone')} className="space-y-4">
                    {/* Website option */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="website" id="dest-website" className="h-5 w-5 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="dest-website" className="cursor-pointer font-medium">Website</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">Send people to your website.</p>
                        </div>
                      </div>
                      
                      {adDestination === 'website' && (
                        <div className="ml-8 space-y-4 border-l-2 border-muted pl-4">
                          <div className="space-y-2">
                            <Label className="text-sm">
                              Website URL <span className="text-destructive">*</span>
                            </Label>
                            <Input 
                              value={websiteUrl}
                              onChange={(e) => setWebsiteUrl(e.target.value)}
                              placeholder="http://www.example.com/page"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Display link</Label>
                            <Input 
                              value={displayLink}
                              onChange={(e) => setDisplayLink(e.target.value)}
                              placeholder="Enter the link you want to show on your ad"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone call option */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="phone" id="dest-phone" className="h-5 w-5 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="dest-phone" className="cursor-pointer font-medium">Phone call</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">Let people call you directly.</p>
                        </div>
                      </div>
                      
                      {adDestination === 'phone' && (
                        <div className="ml-8 space-y-4 border-l-2 border-muted pl-4">
                          <div className="flex gap-3">
                            <div className="w-40">
                              <Label className="text-sm mb-2 block">Country Code</Label>
                              <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={countryCodeOpen}
                                    className="w-full h-14 justify-between"
                                  >
                                    <div className="flex flex-col items-start">
                                      <span className="font-medium">{phoneCountryCode}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {COUNTRY_CODES.find(c => c.code === phoneCountryCode)?.country || 'Select'}
                                      </span>
                                    </div>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-0" align="start">
                                  <Command>
                                    <CommandInput 
                                      placeholder="Search country or code..." 
                                      value={countryCodeSearch}
                                      onValueChange={setCountryCodeSearch}
                                    />
                                    <CommandList className="max-h-64">
                                      <CommandEmpty>No country found.</CommandEmpty>
                                      {filteredCountryCodes.map((item, index) => (
                                        <CommandItem
                                          key={`${item.code}-${item.country}-${index}`}
                                          value={`${item.code} ${item.country}`}
                                          onSelect={() => {
                                            setPhoneCountryCode(item.code);
                                            setCountryCodeOpen(false);
                                            setCountryCodeSearch('');
                                          }}
                                          className="flex items-center justify-between"
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium">{item.code}</span>
                                            <span className="text-xs text-muted-foreground">{item.country}</span>
                                          </div>
                                          {phoneCountryCode === item.code && (
                                            <Check className="h-4 w-4" />
                                          )}
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="flex-1">
                              <Label className="text-sm mb-2 block">Phone number</Label>
                              <Input 
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={phoneNumber}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, '');
                                  setPhoneNumber(value);
                                }}
                                placeholder="123456789"
                                className="h-14"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Ad creative */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ad creative</CardTitle>
                  <CardDescription>
                    Select and optimize your ad text, media and enhancements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Creative Type Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Set up creative</Label>
                    <Select 
                      value={creativeType || ''} 
                      onValueChange={(val) => {
                        setCreativeType(val as 'image' | 'video');
                        setCreativeModalOpen(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose creative type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Image ad
                          </div>
                        </SelectItem>
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Video ad
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Creative Summary (shown after Done) */}
                  {adCreativeData && (
                    <div className="border rounded-lg p-4 space-y-4">
                      {/* Image Preview Row */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {adCreativeData.type === 'video' && adCreativeData.videoThumbnailUrl ? (
                            <img 
                              src={adCreativeData.videoThumbnailUrl} 
                              alt="Video thumbnail" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img 
                              src={adCreativeData.mediaUrl} 
                              alt="Ad preview" 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {adCreativeData.type === 'video' ? 'added video...' : 'added images...'}
                        </span>
                      </div>

                      {/* Editable Fields */}
                      <TooltipProvider>
                        <div className="space-y-5">
                          {/* Primary Text */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Label className="text-sm font-normal text-foreground">Primary text</Label>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p>Add up to 5 texts.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            {adCreativeData.primaryTexts.map((text, index) => (
                              <Input
                                key={index}
                                value={text}
                                onChange={(e) => {
                                  const newTexts = [...adCreativeData.primaryTexts];
                                  newTexts[index] = e.target.value;
                                  setAdCreativeData({ ...adCreativeData, primaryTexts: newTexts });
                                }}
                                placeholder="Enter primary text..."
                                className="border-gray-200 bg-white focus:border-blue-400 focus:ring-0 shadow-none"
                              />
                            ))}
                          </div>

                          {/* Headline */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Label className="text-sm font-normal text-foreground">Headline</Label>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p>Add up to 5 brief headlines to let people know what your ad is about. Each headline can have a maximum up to 255 characters.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            {adCreativeData.headlines.map((headline, index) => (
                              <Input
                                key={index}
                                value={headline}
                                onChange={(e) => {
                                  const newHeadlines = [...adCreativeData.headlines];
                                  newHeadlines[index] = e.target.value;
                                  setAdCreativeData({ ...adCreativeData, headlines: newHeadlines });
                                }}
                                placeholder="Enter headline..."
                                className="border-gray-200 bg-white focus:border-blue-400 focus:ring-0 shadow-none"
                              />
                            ))}
                          </div>

                          {/* Description */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Label className="text-sm font-normal text-foreground">Description</Label>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p>The description is additional text that appears in some placements. Its position on the ad varies by placement.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Input
                              value={adCreativeData.description}
                              onChange={(e) => setAdCreativeData({ ...adCreativeData, description: e.target.value })}
                              placeholder="Enter description..."
                              className="border-gray-200 bg-white focus:border-blue-400 focus:ring-0 shadow-none"
                            />
                          </div>

                          {/* Call to Action */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Label className="text-sm font-normal text-foreground">Call to action</Label>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p>Show a button or a link on your ad that represents the action you want people to take.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Select 
                              value={adCreativeData.callToAction} 
                              onValueChange={(val) => setAdCreativeData({ ...adCreativeData, callToAction: val })}
                            >
                              <SelectTrigger className="border-gray-200 bg-white focus:border-blue-400 focus:ring-0 shadow-none">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CALL_TO_ACTION_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TooltipProvider>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ad Creative Modal */}
              {creativeType && (
                <AdCreativeModal
                  open={creativeModalOpen}
                  onOpenChange={setCreativeModalOpen}
                  creativeType={creativeType}
                  onComplete={(data) => {
                    setAdCreativeData(data);
                    setCreativeModalOpen(false);
                  }}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => handleLevelChange('adset')} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={handleSaveDraft} 
                    disabled={isSaving}
                    className="gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Draft
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handlePublish} 
                    disabled={isSaving}
                    className="gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Publish
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
