import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { DemoTooltip } from './DemoTooltip';

interface StepBudgetProps {
  budget: number;
  budgetType: 'daily' | 'total';
  startDate: Date | undefined;
  endDate: Date | undefined;
  onBudgetChange: (budget: number) => void;
  onBudgetTypeChange: (type: 'daily' | 'total') => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export function StepBudget({
  budget,
  budgetType,
  startDate,
  endDate,
  onBudgetChange,
  onBudgetTypeChange,
  onStartDateChange,
  onEndDateChange,
}: StepBudgetProps) {
  const days = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 30;
  
  const estimatedSpend = budgetType === 'daily' ? budget * days : budget;
  const dailyBudget = budgetType === 'total' ? budget / days : budget;

  return (
    <Card className="animate-in fade-in-50 slide-in-from-right-5 duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          Budget & Zeitraum
        </CardTitle>
        <DemoTooltip />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Type */}
        <div className="space-y-3">
          <Label>Budgetart</Label>
          <RadioGroup
            value={budgetType}
            onValueChange={(value) => onBudgetTypeChange(value as 'daily' | 'total')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="cursor-pointer">Tagesbudget</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="total" id="total" />
              <Label htmlFor="total" className="cursor-pointer">Gesamtbudget</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Budget Amount */}
        <div className="space-y-2">
          <Label htmlFor="budget">
            {budgetType === 'daily' ? 'Tagesbudget' : 'Gesamtbudget'}
          </Label>
          <div className="relative">
            <Input
              id="budget"
              type="number"
              min={1}
              step={0.01}
              value={budget || ''}
              onChange={(e) => onBudgetChange(parseFloat(e.target.value) || 0)}
              className="h-12 text-lg pr-12"
              placeholder="0,00"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              €
            </span>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Startdatum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'dd.MM.yyyy', { locale: de }) : 'Datum wählen'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={onStartDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Enddatum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'dd.MM.yyyy', { locale: de }) : 'Datum wählen'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={onEndDateChange}
                  disabled={(date) => date < (startDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Estimated Spend */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Geschätzter Spend:</span>
            <span className="font-semibold text-foreground">
              ~{estimatedSpend.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € über {days} Tage
            </span>
          </div>
          {budgetType === 'total' && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Täglicher Durchschnitt:</span>
              <span className="text-foreground">
                ~{dailyBudget.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €/Tag
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
