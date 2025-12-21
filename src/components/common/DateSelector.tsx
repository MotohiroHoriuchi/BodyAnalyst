import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateWithDay, addDaysToDate, getToday } from '../../utils/dateUtils';

interface DateSelectorProps {
  date: string;
  onChange: (date: string) => void;
}

export function DateSelector({ date, onChange }: DateSelectorProps) {
  const today = getToday();
  const isToday = date === today;

  const handlePrev = () => {
    onChange(addDaysToDate(date, -1));
  };

  const handleNext = () => {
    onChange(addDaysToDate(date, 1));
  };

  const handleToday = () => {
    onChange(today);
  };

  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <button
        onClick={handlePrev}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="前日"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleToday}
        className={`px-4 py-2 rounded-xl font-medium transition-colors ${
          isToday
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {formatDateWithDay(date)}
      </button>

      <button
        onClick={handleNext}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="翌日"
        disabled={isToday}
      >
        <ChevronRight className={`w-5 h-5 ${isToday ? 'opacity-30' : ''}`} />
      </button>
    </div>
  );
}
