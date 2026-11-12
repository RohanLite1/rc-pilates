import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  ArrowLeft,
  Plus,
  Shield,
  Info
} from 'lucide-react';

interface InstructorBatchesViewProps {
  onBackToAttendance: () => void;
}

export const InstructorBatchesView: React.FC<InstructorBatchesViewProps> = ({
  onBackToAttendance
}) => {
  const {
    batchSlots,
    toggleBatchSlotAvailability,
    sessions,
    addStudioTimeslot
  } = useApp();

  const [customSlotTime, setCustomSlotTime] = useState<string>('');
  const [showAddCustom, setShowAddCustom] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const morningBatches = batchSlots.filter(s => s.category === 'morning');
  const eveningBatches = batchSlots.filter(s => s.category === 'evening');

  // Today's date to count bookings per slot
  const todayStr = '2026-11-06';
  const getBookingsCount = (timeSlot: string) => {
    return sessions.filter(s => s.date === todayStr && s.time === timeSlot).length;
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSlotTime.trim()) return;
    addStudioTimeslot(customSlotTime.trim());
    setFeedback(`Added "${customSlotTime.trim()}" to studio roster!`);
    setCustomSlotTime('');
    setShowAddCustom(false);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Navigation & Return */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToAttendance}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Attendance</span>
        </button>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>Batch Controls</span>
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200/80 dark:border-stone-800 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
              Studio Batches &amp; Timeslot Availability
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Toggle slots on or off. Unavailable slots cannot be chosen by clients.
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#FAF8F5] dark:bg-[#242D26] rounded-2xl border border-stone-200 dark:border-stone-700/80 flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-300">
          <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Marking a batch slot as <strong>Unavailable</strong> hides it from the client reschedule menu and marks the slot as closed on your schedule. You can re-enable it at any time.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 rounded-2xl text-xs font-bold border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
          {feedback}
        </div>
      )}

      {/* 1. MORNING BATCHES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <Sun className="w-4 h-4 text-amber-500" />
            <h4 className="font-serif font-bold text-base">Morning Batches</h4>
            <span className="text-xs font-medium text-stone-400">(7:00 AM – 12:00 PM)</span>
          </div>
          <span className="text-[11px] font-bold text-stone-500">
            {morningBatches.filter(b => b.isAvailable).length} of {morningBatches.length} Available
          </span>
        </div>

        <div className="space-y-2">
          {morningBatches.map(batch => {
            const bookings = getBookingsCount(batch.timeSlot);
            return (
              <div
                key={batch.id}
                className={`p-4 rounded-3xl border transition-all shadow-ambient flex items-center justify-between ${
                  batch.isAvailable
                    ? 'bg-white dark:bg-[#1C231E] border-stone-200 dark:border-stone-800'
                    : 'bg-stone-50/70 dark:bg-[#181F1A] border-stone-200/50 dark:border-stone-800/50 opacity-75'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {batch.timeSlot}
                    </span>
                    {batch.isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Available</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                        <XCircle className="w-3 h-3" />
                        <span>Closed / Off</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 font-medium">
                    {batch.label} • {bookings > 0 ? `${bookings} member booked today` : 'No bookings today'}
                  </p>
                </div>

                {/* Availability Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleBatchSlotAvailability(batch.id)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    batch.isAvailable ? 'bg-emerald-800' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle availability"
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      batch.isAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. EVENING BATCHES */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <Moon className="w-4 h-4 text-emerald-600" />
            <h4 className="font-serif font-bold text-base">Evening Batches</h4>
            <span className="text-xs font-medium text-stone-400">(4:00 PM – 12:00 AM)</span>
          </div>
          <span className="text-[11px] font-bold text-stone-500">
            {eveningBatches.filter(b => b.isAvailable).length} of {eveningBatches.length} Available
          </span>
        </div>

        <div className="space-y-2">
          {eveningBatches.map(batch => {
            const bookings = getBookingsCount(batch.timeSlot);
            return (
              <div
                key={batch.id}
                className={`p-4 rounded-3xl border transition-all shadow-ambient flex items-center justify-between ${
                  batch.isAvailable
                    ? 'bg-white dark:bg-[#1C231E] border-stone-200 dark:border-stone-800'
                    : 'bg-stone-50/70 dark:bg-[#181F1A] border-stone-200/50 dark:border-stone-800/50 opacity-75'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {batch.timeSlot}
                    </span>
                    {batch.isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Available</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                        <XCircle className="w-3 h-3" />
                        <span>Closed / Off</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 font-medium">
                    {batch.label} • {bookings > 0 ? `${bookings} member booked today` : 'No bookings today'}
                  </p>
                </div>

                {/* Availability Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleBatchSlotAvailability(batch.id)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    batch.isAvailable ? 'bg-emerald-800' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle availability"
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      batch.isAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Custom Slot Adder */}
      <div className="pt-2">
        {showAddCustom ? (
          <form
            onSubmit={handleAddCustom}
            className="p-4 bg-white dark:bg-[#1C231E] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-ambient"
          >
            <h5 className="font-serif font-bold text-sm">Add Extra Custom Slot</h5>
            <input
              type="text"
              required
              value={customSlotTime}
              onChange={e => setCustomSlotTime(e.target.value)}
              placeholder="e.g. 02:00 PM - 03:00 PM"
              className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="flex-1 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-xs"
              >
                Save Slot
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddCustom(true)}
            className="w-full py-3 px-4 rounded-2xl bg-stone-100 dark:bg-[#1C231E] hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Additional Custom Timeslot</span>
          </button>
        )}
      </div>
    </div>
  );
};

