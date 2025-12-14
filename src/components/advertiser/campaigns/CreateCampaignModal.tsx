import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Zap, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAdvertiserAccounts } from '@/hooks/useAdvertiserAccounts';
import { ObjectiveSelector } from './ObjectiveSelector';

export type BuyingType = 'auction' | 'reservation';
export type CampaignObjective = 'awareness' | 'traffic' | 'engagement' | 'leads' | 'app_promotion' | 'sales';
export type CampaignSetup = 'recommended' | 'manual';

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignModal({ open, onOpenChange }: CreateCampaignModalProps) {
  const navigate = useNavigate();
  const { activeAccounts } = useAdvertiserAccounts();
  
  const [step, setStep] = useState(1);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [buyingType, setBuyingType] = useState<BuyingType>('auction');
  const [objective, setObjective] = useState<CampaignObjective>('awareness');
  const [campaignSetup, setCampaignSetup] = useState<CampaignSetup>('recommended');

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Navigate to edit page with query params
      const params = new URLSearchParams({
        account: selectedAccountId,
        buyingType,
        objective,
        setup: campaignSetup,
      });
      onOpenChange(false);
      navigate(`/advertiser/campaigns/edit/new?${params.toString()}`);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const canContinue = step === 1 
    ? selectedAccountId && buyingType && objective
    : campaignSetup;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[700px] overflow-y-auto lg:rounded-none">
          <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 2 && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {step === 1 ? 'Kampagne erstellen' : 'Campaign Setup'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-6">
            {/* Agency Account Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Agency Account auswählen
              </label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Account auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {activeAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Buying Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                Choose a buying type
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Your buying type is how you pay for ads in your campaign.
                  </TooltipContent>
                </Tooltip>
              </label>
              <Select value={buyingType} onValueChange={(v) => {
                setBuyingType(v as BuyingType);
                // Reset objective if switching to reservation and current objective not available
                if (v === 'reservation' && !['awareness', 'engagement'].includes(objective)) {
                  setObjective('awareness');
                }
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auction">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Auction</span>
                      <span className="text-xs text-muted-foreground">Buy in real-time with cost effective bidding.</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="reservation">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Reservation</span>
                      <span className="text-xs text-muted-foreground">Buy in advance for more predictable outcomes.</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campaign Objective Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Choose a campaign objective
              </label>
              <ObjectiveSelector 
                buyingType={buyingType}
                selectedObjective={objective}
                onSelectObjective={setObjective}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              Choose a campaign setup
            </label>
            
            <div className="space-y-3">
              <button
                onClick={() => setCampaignSetup('recommended')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  campaignSetup === 'recommended'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Recommended Settings</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Schnellere Einrichtung mit optimierten Standardeinstellungen
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setCampaignSetup('manual')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  campaignSetup === 'manual'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Manual traffic campaign</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Vollständige Kontrolle über alle Einstellungen
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!canContinue}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
