import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type TimeRange = '7d' | '30d' | '90d';

interface StatisticsFiltersProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  selectedCampaign: string;
  onCampaignChange: (campaign: string) => void;
  campaigns: { id: string; name: string }[];
}

export function StatisticsFilters({
  timeRange,
  onTimeRangeChange,
  selectedCampaign,
  onCampaignChange,
  campaigns,
}: StatisticsFiltersProps) {
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 Tage' },
    { value: '30d', label: '30 Tage' },
    { value: '90d', label: '90 Tage' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex gap-2">
        {timeRanges.map((range) => (
          <Button
            key={range.value}
            variant={timeRange === range.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTimeRangeChange(range.value)}
            className={cn(
              'transition-all duration-200',
              timeRange === range.value && 'shadow-md'
            )}
          >
            {range.label}
          </Button>
        ))}
      </div>

      <Select value={selectedCampaign} onValueChange={onCampaignChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Alle Kampagnen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Kampagnen</SelectItem>
          {campaigns.map((campaign) => (
            <SelectItem key={campaign.id} value={campaign.id}>
              {campaign.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
