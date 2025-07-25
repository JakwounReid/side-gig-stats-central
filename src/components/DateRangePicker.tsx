import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { format, addDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
  className?: string;
}

export const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onDateRangeChange, 
  className 
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!startDate || (startDate && endDate)) {
      // Start a new range
      onDateRangeChange(date, undefined);
    } else {
      // Complete the range
      if (date < startDate) {
        onDateRangeChange(date, startDate);
      } else {
        onDateRangeChange(startDate, date);
      }
      setIsOpen(false);
    }
  };

  const clearRange = () => {
    onDateRangeChange(undefined, undefined);
  };

  const formatDateRange = () => {
    if (!startDate) return 'Select date range';
    if (!endDate) return `${format(startDate, 'MMM d, yyyy')} - Select end date`;
    return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !startDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={startDate}
            selected={{
              from: startDate,
              to: endDate,
            }}
            onSelect={(range) => {
              onDateRangeChange(range?.from, range?.to);
              if (range?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
      
      {(startDate || endDate) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearRange}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}; 