import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { WizardProgress } from './WizardProgress';
import { StepCampaignName } from './StepCampaignName';
import { StepBudget } from './StepBudget';
import { StepTargeting } from './StepTargeting';
import { StepCreatives } from './StepCreatives';
import { StepReview } from './StepReview';

interface MockFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
}

interface CampaignWizardProps {
  hasActiveAccount: boolean;
  onClose?: () => void;
}

const WIZARD_STEPS = [
  { id: 1, title: 'Name', icon: '📝' },
  { id: 2, title: 'Budget', icon: '💰' },
  { id: 3, title: 'Zielgruppe', icon: '🎯' },
  { id: 4, title: 'Creatives', icon: '🎨' },
  { id: 5, title: 'Vorschau', icon: '✅' },
];

export function CampaignWizard({ hasActiveAccount, onClose }: CampaignWizardProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [budget, setBudget] = useState(50);
  const [budgetType, setBudgetType] = useState<'daily' | 'total'>('daily');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [location, setLocation] = useState('de');
  const [ageRange, setAgeRange] = useState('18-65+');
  const [gender, setGender] = useState('all');
  const [interests, setInterests] = useState('ecommerce');
  const [files, setFiles] = useState<MockFile[]>([]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return budget > 0 && startDate && endDate;
      case 3:
        return location && ageRange && gender;
      case 4:
        return true; // Files are optional
      case 5:
        return hasActiveAccount;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onClose) {
      onClose();
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleSave = () => {
    toast({
      title: 'Demo-Modus',
      description: 'Diese Funktion ist noch in Entwicklung. Kampagnen können aktuell nicht gespeichert werden.',
    });
  };

  const campaignData = {
    name,
    notes,
    budget,
    budgetType,
    startDate,
    endDate,
    location,
    ageRange,
    gender,
    interests,
    files,
  };

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <WizardProgress
        steps={WIZARD_STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <StepCampaignName
            name={name}
            notes={notes}
            onNameChange={setName}
            onNotesChange={setNotes}
          />
        )}

        {currentStep === 2 && (
          <StepBudget
            budget={budget}
            budgetType={budgetType}
            startDate={startDate}
            endDate={endDate}
            onBudgetChange={setBudget}
            onBudgetTypeChange={setBudgetType}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        )}

        {currentStep === 3 && (
          <StepTargeting
            location={location}
            ageRange={ageRange}
            gender={gender}
            interests={interests}
            onLocationChange={setLocation}
            onAgeRangeChange={setAgeRange}
            onGenderChange={setGender}
            onInterestsChange={setInterests}
          />
        )}

        {currentStep === 4 && (
          <StepCreatives
            files={files}
            onFilesChange={setFiles}
          />
        )}

        {currentStep === 5 && (
          <StepReview
            campaignData={campaignData}
            onEditStep={setCurrentStep}
            onSave={handleSave}
            hasActiveAccount={hasActiveAccount}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 5 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 1 ? 'Abbrechen' : 'Zurück'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            Weiter
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
