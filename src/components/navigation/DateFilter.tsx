import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, ChevronDown, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfQuarter, endOfQuarter, subMonths, addMonths } from 'date-fns';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateFilterProps {
  onDateChange: (dateRange: DateRange) => void;
  currentRange: DateRange;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i);
const QUARTERS = [
  { value: '1', label: 'Q1 (Jan-Mar)' },
  { value: '2', label: 'Q2 (Apr-Jun)' },
  { value: '3', label: 'Q3 (Jul-Sep)' },
  { value: '4', label: 'Q4 (Oct-Dec)' },
];

export default function DateFilter({ onDateChange, currentRange }: DateFilterProps) {
  const [filterType, setFilterType] = useState<'month' | 'year' | 'quarter' | 'custom'>('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState('1');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handleMonthNavigation = (direction: 'prev' | 'next') => {
    const currentStart = currentRange.startDate;
    const newDate = direction === 'prev' 
      ? subMonths(currentStart, 1)
      : addMonths(currentStart, 1);
    
    onDateChange({
      startDate: startOfMonth(newDate),
      endDate: endOfMonth(newDate),
    });
  };

  const handleYearFilter = (year: number) => {
    setSelectedYear(year);
    onDateChange({
      startDate: startOfYear(new Date(year, 0, 1)),
      endDate: endOfYear(new Date(year, 0, 1)),
    });
  };

  const handleQuarterFilter = (year: number, quarter: string) => {
    const quarterNum = parseInt(quarter);
    const quarterStart = new Date(year, (quarterNum - 1) * 3, 1);
    
    onDateChange({
      startDate: startOfQuarter(quarterStart),
      endDate: endOfQuarter(quarterStart),
    });
  };

  const handleCustomRange = () => {
    if (customStart && customEnd) {
      onDateChange({
        startDate: new Date(customStart),
        endDate: new Date(customEnd),
      });
    }
  };

  const getDisplayText = () => {
    if (filterType === 'month') {
      return format(currentRange.startDate, 'MMMM yyyy');
    } else if (filterType === 'year') {
      return selectedYear.toString();
    } else if (filterType === 'quarter') {
      const quarter = QUARTERS.find(q => q.value === selectedQuarter);
      return `${quarter?.label} ${selectedYear}`;
    } else {
      return `${format(currentRange.startDate, 'MMM dd')} - ${format(currentRange.endDate, 'MMM dd, yyyy')}`;
    }
  };

  return (
    <Card className="shadow-gentle bg-gradient-warm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {filterType === 'month' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMonthNavigation('prev')}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-semibold">{getDisplayText()}</h2>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMonthNavigation('next')}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </>
          )}

          {filterType !== 'month' && (
            <div className="flex items-center gap-2 w-full justify-center">
              <Calendar className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold">{getDisplayText()}</h2>
            </div>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <Label>Filter Type</Label>
                  <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                      <SelectItem value="quarter">Quarterly</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filterType === 'year' && (
                  <div>
                    <Label>Year</Label>
                    <Select value={selectedYear.toString()} onValueChange={(value) => handleYearFilter(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {filterType === 'quarter' && (
                  <div className="space-y-2">
                    <div>
                      <Label>Year</Label>
                      <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Quarter</Label>
                      <Select value={selectedQuarter} onValueChange={(value) => {
                        setSelectedQuarter(value);
                        handleQuarterFilter(selectedYear, value);
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {QUARTERS.map(quarter => (
                            <SelectItem key={quarter.value} value={quarter.value}>
                              {quarter.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {filterType === 'custom' && (
                  <div className="space-y-2">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleCustomRange} className="w-full">
                      Apply Range
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}