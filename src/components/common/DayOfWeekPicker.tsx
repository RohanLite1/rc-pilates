import React from 'react';

export interface DayOfWeekPickerProps {
  selectedDays: number[]; // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  onChange: (days: number[]) => void;
  className?: string;
}

const DAY_OPTIONS = [
  { dayIndex: 0, label: 'Sun', letter: 'S', fullName: 'Sunday' },
  { dayIndex: 1, label: 'Mon', letter: 'M', fullName: 'Monday' },
  { dayIndex: 2, label: 'Tue', letter: 'T', fullName: 'Tuesday' },
  { dayIndex: 3, label: 'Wed', letter: 'W', fullName: 'Wednesday' },
  { dayIndex: 4, label: 'Thu', letter: 'T', fullName: 'Thursday' },
  { dayIndex: 5, label: 'Fri', letter: 'F', fullName: 'Friday' },
  { dayIndex: 6, label: 'Sat', letter: 'S', fullName: 'Saturday' },
];

export const DayOfWeekPicker: React.FC<DayOfWeekPickerProps> = ({
  selectedDays,
  onChange,
  className = ''
}) => {
  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      onChange(selectedDays.filter(d => d !== dayIndex));
    } else {
      onChange([...selectedDays, dayIndex].sort());
    }
  };

  const setPreset = (preset: 'mon-fri' | 'weekends' | 'all' | 'clear') => {
    switch (preset) {
      case 'mon-fri':
        onChange([1, 2, 3, 4, 5]);
        break;
      case 'weekends':
        onChange([0, 6]);
        break;
      case 'all':
        onChange([0, 1, 2, 3, 4, 5, 6]);
        break;
      case 'clear':
        onChange([]);
        break;
    }
  };

  const getSelectionSummary = () => {
    if (selectedDays.length === 0) return 'Tap circular buttons to choose class days';
    if (selectedDays.length === 7) return 'Every day (7 days / week)';
    if (
      selectedDays.length === 5 &&
      [1, 2, 3, 4, 5].every(d => selectedDays.includes(d))
    ) {
      return 'Monday through Friday (5 days / week)';
    }
    if (selectedDays.length === 2 && selectedDays.includes(0) && selectedDays.includes(6)) {
      return 'Weekends only (Saturday & Sunday)';
    }
    const names = DAY_OPTIONS.filter(d => selectedDays.includes(d.dayIndex)).map(d => d.label);
    return `Every ${names.join(', ')} (${selectedDays.length} days / week)`;
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Alarm-Style Circular Day Buttons */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {DAY_OPTIONS.map(opt => {
          const isSelected = selectedDays.includes(opt.dayIndex);
          return (
            <button
              key={opt.dayIndex}
              type="button"
              onClick={() => toggleDay(opt.dayIndex)}
              title={opt.fullName}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center font-sans font-bold transition-all duration-150 active:scale-95 select-none ${
                isSelected
                  ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-md ring-2 ring-emerald-500/30 scale-105'
                  : 'bg-stone-100 dark:bg-[#242D26] text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700/80 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <span className="text-xs sm:text-[13px] leading-none">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Action Presets & Natural Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">
          {getSelectionSummary()}
        </span>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setPreset('mon-fri')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold hover:bg-emerald-100 transition-colors"
          >
            Mon – Fri
          </button>
          <button
            type="button"
            onClick={() => setPreset('all')}
            className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-200 transition-colors"
          >
            All
          </button>
          {selectedDays.length > 0 && (
            <button
              type="button"
              onClick={() => setPreset('clear')}
              className="px-2 py-1 rounded-lg text-stone-400 hover:text-rose-600 font-medium transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

