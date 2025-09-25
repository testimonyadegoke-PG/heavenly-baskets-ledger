import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthSelectorProps {
  currentMonth: string;
  currentYear: number;
  onMonthChange: (month: string, year: number) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthSelector({ currentMonth, currentYear, onMonthChange }: MonthSelectorProps) {
  const currentMonthIndex = MONTHS.indexOf(currentMonth);
  
  const goToPreviousMonth = () => {
    if (currentMonthIndex === 0) {
      onMonthChange(MONTHS[11], currentYear - 1);
    } else {
      onMonthChange(MONTHS[currentMonthIndex - 1], currentYear);
    }
  };

  const goToNextMonth = () => {
    if (currentMonthIndex === 11) {
      onMonthChange(MONTHS[0], currentYear + 1);
    } else {
      onMonthChange(MONTHS[currentMonthIndex + 1], currentYear);
    }
  };

  const isCurrentMonth = () => {
    const now = new Date();
    const nowMonth = MONTHS[now.getMonth()];
    const nowYear = now.getFullYear();
    return currentMonth === nowMonth && currentYear === nowYear;
  };

  const isFutureMonth = () => {
    const now = new Date();
    const nowMonth = MONTHS[now.getMonth()];
    const nowYear = now.getFullYear();
    return currentYear > nowYear || (currentYear === nowYear && currentMonthIndex > MONTHS.indexOf(nowMonth));
  };

  return (
    <Card className="shadow-gentle bg-gradient-warm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">
              {currentMonth} {currentYear}
            </h2>
            {isCurrentMonth() && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Current
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            disabled={isFutureMonth()}
            className="h-8 w-8 p-0 hover:bg-primary/10 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}