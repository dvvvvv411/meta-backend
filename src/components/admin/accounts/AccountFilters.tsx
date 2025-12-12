import { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { AccountFilters as AccountFiltersType, AccountStatus } from '@/hooks/useAccounts';

interface AccountFiltersProps {
  filters: AccountFiltersType;
  onFiltersChange: (filters: AccountFiltersType) => void;
}

const statusOptions: { value: AccountStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Aktiv', color: 'bg-green-500' },
  { value: 'expired', label: 'Abgelaufen', color: 'bg-red-500' },
  { value: 'canceled', label: 'Gekündigt', color: 'bg-muted' },
  { value: 'suspended', label: 'Gesperrt', color: 'bg-orange-500' },
];

export function AccountFilters({ filters, onFiltersChange }: AccountFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters, onFiltersChange]);

  const handleStatusChange = (status: AccountStatus, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleReset = () => {
    setSearchValue('');
    onFiltersChange({
      search: '',
      status: [],
      dateFrom: null,
      dateTo: null,
    });
  };

  const hasActiveFilters = filters.search || filters.status.length > 0 || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Suche nach Nutzer, Account-ID..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Status
              {filters.status.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-3">
              <p className="text-sm font-medium">Status filtern</p>
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={filters.status.includes(option.value)}
                    onCheckedChange={(checked) => handleStatusChange(option.value, checked as boolean)}
                  />
                  <Label htmlFor={`status-${option.value}`} className="flex items-center gap-2 cursor-pointer">
                    <span className={`h-2 w-2 rounded-full ${option.color}`} />
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date From Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              {filters.dateFrom ? format(filters.dateFrom, 'dd.MM.yyyy', { locale: de }) : 'Von'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={filters.dateFrom || undefined}
              onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date || null })}
              locale={de}
            />
          </PopoverContent>
        </Popover>

        {/* Date To Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              {filters.dateTo ? format(filters.dateTo, 'dd.MM.yyyy', { locale: de }) : 'Bis'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={filters.dateTo || undefined}
              onSelect={(date) => onFiltersChange({ ...filters, dateTo: date || null })}
              locale={de}
            />
          </PopoverContent>
        </Popover>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-9">
            <X className="mr-1 h-4 w-4" />
            Zurücksetzen
          </Button>
        )}
      </div>
    </div>
  );
}
