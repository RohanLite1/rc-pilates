import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  STUDIO_PACKAGES,
  calculateEndDateFromStart,
  formatDateReadable,
  countSelectedDaysBetween,
  type StudioPackageId
} from '../../data/packagePlans';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
  Sun,
  Moon,
  CalendarCheck,
  Bell,
  Info,
  RotateCcw
} from 'lucide-react';
import { DayOfWeekPicker } from './DayOfWeekPicker';

export interface PackageSelectionState {
  packageChoice: StudioPackageId;
  startDate: string;
  endDate: string;
  preferredTimeSlot: string;
  isExistingCustomer?: boolean;
  selectedDays?: number[]; // [0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat]
}

interface PackageAndScheduleSelectorProps {
  value: PackageSelectionState;
  onChange: (val: PackageSelectionState) => void;
  showExistingCustomerToggle?: boolean;
}

export const PackageAndScheduleSelector: React.FC<PackageAndScheduleSelectorProps> = ({
  value,
  onChange,
  showExistingCustomerToggle = true
}) => {
  const { batchSlots, studioTimeslots } = useApp();

  const currentPkg = STUDIO_PACKAGES.find(p => p.id === value.packageChoice) || STUDIO_PACKAGES[0];
  const activeSelectedDays = value.selectedDays && value.selectedDays.length > 0
    ? value.selectedDays
    : [1, 2, 3, 4, 5]; // Default Mon-Fri

  const handleSelectPackage = (pkgId: StudioPackageId) => {
    const pkg = STUDIO_PACKAGES.find(p => p.id === pkgId) || STUDIO_PACKAGES[0];
    const newEndDate = value.isExistingCustomer
      ? value.endDate
      : calculateEndDateFromStart(value.startDate, pkg.durationMonths);

    onChange({
      ...value,
      packageChoice: pkgId,
      endDate: newEndDate,
      selectedDays: activeSelectedDays
    });
  };

  const handleStartDateChange = (newStart: string) => {
    const newEndDate = value.isExistingCustomer
      ? value.endDate
      : calculateEndDateFromStart(newStart, currentPkg.durationMonths);

    onChange({
      ...value,
      startDate: newStart,
      endDate: newEndDate,
      selectedDays: activeSelectedDays
    });
  };

  const handleEndDateChange = (newEnd: string) => {
    onChange({
      ...value,
      endDate: newEnd,
      selectedDays: activeSelectedDays
    });
  };

  const handleToggleExistingCustomer = (isExisting: boolean) => {
    const newEndDate = isExisting
      ? value.endDate
      : calculateEndDateFromStart(value.startDate, currentPkg.durationMonths);

    onChange({
      ...value,
      isExistingCustomer: isExisting,
      endDate: newEndDate,
      selectedDays: activeSelectedDays
    });
  };

  const handleResetAutoDates = () => {
    onChange({
      ...value,
      endDate: calculateEndDateFromStart(value.startDate, currentPkg.durationMonths),
      selectedDays: activeSelectedDays
    });
  };

  const handleDaysChange = (days: number[]) => {
    onChange({
      ...value,
      selectedDays: days
    });
  };

  const morningBatches = batchSlots.filter(s => s.category === 'morning');
  const eveningBatches = batchSlots.filter(s => s.category === 'evening');

  const estimatedSessionsCount = countSelectedDaysBetween(
    value.startDate,
    value.endDate,
    activeSelectedDays
  );

  return (
    <div className="space-y-4 text-[#2D251E] animate-in fade-in duration-200">
      {/* 1. Choose Your Package Cards */}
      <div className="space-y-2">
        <label className="block font-serif font-bold text-sm text-[#2D251E] flex items-center justify-between">
          <span>1. Select Studio Package</span>
          <span className="text-[11px] font-sans font-semibold text-[#675137]">
            2 Curated Tiers
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STUDIO_PACKAGES.map(pkg => {
            const isSelected = value.packageChoice === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg.id)}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FAF6F0] border-[#675137] shadow-md ring-2 ring-[#675137]/15'
                    : 'bg-white border-stone-200/80 hover:border-stone-300 shadow-sm'
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-2.5 right-3 bg-[#675137] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{pkg.badge}</span>
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-[#2D251E]">
                      {pkg.title}
                    </h4>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-[#675137] bg-[#675137] text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-serif text-2xl font-bold text-[#675137]">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      / {pkg.durationMonths === 1 ? '1 month' : '3 months'}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 mt-2 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Duration: {pkg.durationMonths * 30} Days</span>
                  {pkg.savings && (
                    <span className="font-bold text-emerald-800">{pkg.savings}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Alarm App Style Day-of-Week Picker (Repeat on Days) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="font-serif font-bold text-sm text-[#2D251E] flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#675137]" />
            <span>2. Choose Class Days (Repeat on Days)</span>
          </label>
          <span className="text-[11px] font-sans font-semibold text-[#675137] bg-[#FAF6F0] px-2 py-0.5 rounded-full border border-[#D5C0A4]">
            Alarm-Style Schedule
          </span>
        </div>
        <p className="text-xs text-stone-500">
          Tap the circular day buttons to choose which days of the week you will attend the studio.
        </p>

        <div className="pt-1">
          <DayOfWeekPicker
            selectedDays={activeSelectedDays}
            onChange={handleDaysChange}
          />
        </div>
      </div>

      {/* 3. Program Dates & Duration (With Existing Member Toggle for App Launch) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-serif font-bold text-sm text-[#2D251E] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#675137]" />
            <span>3. Program Dates &amp; Duration</span>
          </label>

          {showExistingCustomerToggle && (
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#675137] bg-[#FAF6F0] px-2.5 py-1 rounded-xl border border-[#D5C0A4] hover:bg-[#F2E9DC] transition-colors">
              <input
                type="checkbox"
                checked={!!value.isExistingCustomer}
                onChange={e => handleToggleExistingCustomer(e.target.checked)}
                className="w-4 h-4 rounded text-[#675137] focus:ring-[#675137] border-stone-300"
              />
              <span>I am an existing customer</span>
            </label>
          )}
        </div>

        {value.isExistingCustomer ? (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Existing Member Setup:</strong> Since you already attend the studio, you can specify your original joining date and current package expiry date.
            </span>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-[11px] text-stone-600 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              Your starting date defaults to today (<strong>{formatDateReadable(value.startDate)}</strong>), and your ending date is auto-calculated for <strong>{currentPkg.durationMonths} {currentPkg.durationMonths === 1 ? 'Month' : 'Months'}</strong>.
            </span>
          </div>
        )}

        {/* Date Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Starting Date */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <span>Starting Date (Date of Joining)</span>
              {!value.isExistingCustomer && <Lock className="w-3 h-3 text-stone-400" />}
            </label>
            {value.isExistingCustomer ? (
              <input
                type="date"
                value={value.startDate}
                onChange={e => handleStartDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#675137]/30"
              />
            ) : (
              <div className="w-full px-3 py-2.5 bg-stone-100/90 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 flex items-center justify-between select-none">
                <span>{formatDateReadable(value.startDate)}</span>
                <span className="text-[10px] text-stone-500 font-normal">Day 1</span>
              </div>
            )}
            <p className="text-[10px] text-stone-500 mt-1">
              {formatDateReadable(value.startDate)}
            </p>
          </div>

          {/* Ending Date */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700 flex items-center gap-1">
                <span>Ending Date (Package Expiry)</span>
                {!value.isExistingCustomer && <Lock className="w-3 h-3 text-stone-400" />}
              </label>
              {value.isExistingCustomer && (
                <button
                  type="button"
                  onClick={handleResetAutoDates}
                  className="text-[10px] font-semibold text-[#675137] hover:underline flex items-center gap-0.5"
                  title="Auto-calculate ending date from starting date"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Auto-calculate</span>
                </button>
              )}
            </div>

            {value.isExistingCustomer ? (
              <input
                type="date"
                value={value.endDate}
                min={value.startDate}
                onChange={e => handleEndDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#675137]/30"
              />
            ) : (
              <div className="w-full px-3 py-2.5 bg-stone-100/90 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 flex items-center justify-between select-none">
                <span>{formatDateReadable(value.endDate)}</span>
                <span className="text-[10px] text-stone-500 font-normal">
                  +{currentPkg.durationMonths} {currentPkg.durationMonths === 1 ? 'Month' : 'Months'}
                </span>
              </div>
            )}
            <p className="text-[10px] text-stone-500 mt-1">
              {formatDateReadable(value.endDate)}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Dropdown Menu for Time Slots (Batches and Availability) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-2">
        <label className="block font-serif font-bold text-sm text-[#2D251E] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#675137]" />
            <span>4. Preferred Training Timeslot</span>
          </div>
          <span className="text-[11px] font-sans font-semibold text-[#675137]">
            Daily Studio Batch
          </span>
        </label>
        <p className="text-xs text-stone-500">
          Select your dedicated daily reformer class batch from the studio schedule.
        </p>

        <div className="relative mt-2">
          <select
            value={value.preferredTimeSlot}
            onChange={e => onChange({ ...value, preferredTimeSlot: e.target.value, selectedDays: activeSelectedDays })}
            className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-stone-200 rounded-2xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#675137]/30 transition-all shadow-xs"
          >
            {/* Morning Batches */}
            <optgroup label="🌅 Morning Batches">
              {morningBatches.map(batch => (
                <option key={batch.id} value={batch.timeSlot}>
                  {batch.timeSlot} — {batch.label || 'Morning Batch'}{' '}
                  {batch.isAvailable ? '• (Available)' : '• (High Demand / Waitlist)'}
                </option>
              ))}
            </optgroup>

            {/* Evening Batches */}
            <optgroup label="🌆 Evening Batches">
              {eveningBatches.map(batch => (
                <option key={batch.id} value={batch.timeSlot}>
                  {batch.timeSlot} — {batch.label || 'Evening Batch'}{' '}
                  {batch.isAvailable ? '• (Available)' : '• (High Demand / Waitlist)'}
                </option>
              ))}
            </optgroup>

            {/* Custom Studio Timeslots if any */}
            {studioTimeslots.filter(t => !batchSlots.some(b => b.timeSlot === t)).length > 0 && (
              <optgroup label="⭐ Additional Studio Slots">
                {studioTimeslots
                  .filter(t => !batchSlots.some(b => b.timeSlot === t))
                  .map(slot => (
                    <option key={slot} value={slot}>
                      {slot} • (Available)
                    </option>
                  ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* Live Booking Feedback Card */}
        <div className="mt-3 p-3 rounded-2xl bg-[#FAF6F0] border border-[#E3D7C7] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {value.preferredTimeSlot.toLowerCase().includes('pm') ? (
                <Moon className="w-4 h-4 text-[#675137]" />
              ) : (
                <Sun className="w-4 h-4 text-[#675137]" />
              )}
              <span className="font-bold text-[#2D251E]">
                Reserved Batch: {value.preferredTimeSlot}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Confirmed Slot
            </span>
          </div>

          <div className="pt-2 border-t border-[#D5C0A4]/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
            <span className="flex items-center gap-1 font-medium">
              <CalendarCheck className="w-3.5 h-3.5 text-[#675137]" />
              <span>
                {activeSelectedDays.length} Days/Week ({formatDateReadable(value.startDate)} → {formatDateReadable(value.endDate)})
              </span>
            </span>
            <span className="font-bold text-[#675137] bg-white/80 px-2 py-0.5 rounded-lg border border-[#D5C0A4]">
              ~{estimatedSessionsCount} Classes Scheduled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
