import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Plus, Trash2, Check, Settings2, X } from 'lucide-react';

interface StudioTimeslotSelectProps {
  value: string;
  onChange: (timeslot: string) => void;
  label?: string;
  isInstructor?: boolean;
}

export const StudioTimeslotSelect: React.FC<StudioTimeslotSelectProps> = ({
  value,
  onChange,
  label = 'Timeslot',
  isInstructor = true
}) => {
  const { studioTimeslots, addStudioTimeslot, removeStudioTimeslot } = useApp();

  const [isAddingCustom, setIsAddingCustom] = useState<boolean>(false);
  const [isManagingSlots, setIsManagingSlots] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__add_custom__') {
      setIsAddingCustom(true);
      return;
    }
    onChange(selected);
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const formatted = customText.trim();
    if (!formatted) return;

    addStudioTimeslot(formatted);
    onChange(formatted);
    setIsAddingCustom(false);
    setCustomText('');
    setFeedback(`Added "${formatted}" to studio schedule!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    if (studioTimeslots.length <= 1) {
      alert('Studio must have at least one timeslot.');
      return;
    }
    removeStudioTimeslot(slotToRemove);
    if (value === slotToRemove) {
      const remaining = studioTimeslots.filter(s => s !== slotToRemove);
      if (remaining.length > 0) {
        onChange(remaining[0]);
      }
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-stone-700 dark:text-stone-300">
          {label}
        </label>
        {isInstructor && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingCustom(prev => !prev);
                setIsManagingSlots(false);
              }}
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingCustom ? 'Cancel' : 'Add Custom'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsManagingSlots(prev => !prev);
                setIsAddingCustom(false);
              }}
              className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              title="Manage available slots"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Select Dropdown */}
      <div className="relative">
        <select
          value={value}
          onChange={handleSelectChange}
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] text-stone-900 dark:text-stone-100 font-semibold appearance-none pr-8 cursor-pointer shadow-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 outline-none transition-all"
        >
          {studioTimeslots.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
          {isInstructor && (
            <option value="__add_custom__">
              + Mention / Add Custom Timeslot...
            </option>
          )}
        </select>
        <Clock className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
      </div>

      {feedback && (
        <p className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px] animate-in fade-in">
          {feedback}
        </p>
      )}

      {/* Inline Custom Timeslot Creator for Instructor */}
      {isInstructor && isAddingCustom && (
        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">
              Set Custom Timeslot
            </span>
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-stone-600 dark:text-stone-300">
            Define your own class slot. It will be added to the studio roster and visible to clients in their dropdown menu.
          </p>

          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-0.5">
                Exact Timeslot (e.g. 09:15 AM - 10:15 AM)
              </label>
              <input
                type="text"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="e.g. 09:15 AM - 10:15 AM"
                className="w-full px-3 py-2 bg-white dark:bg-[#1C231E] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-medium placeholder:text-stone-400 focus:ring-1 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-stone-500 font-semibold">Quick Presets:</span>
              {[
                '09:15 AM - 10:10 AM',
                '01:00 PM - 01:55 PM',
                '04:30 PM - 05:25 PM',
                '06:00 PM - 06:55 PM',
                '07:00 PM - 07:55 PM'
              ].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCustomText(preset)}
                  className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#1C231E] border border-stone-200 dark:border-stone-700 text-[10px] text-stone-700 dark:text-stone-300 hover:border-emerald-600 font-medium transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleAddCustom()}
              className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save &amp; Use Timeslot</span>
            </button>
          </div>
        </div>
      )}

      {/* Instructor Slot Manager (To remove unavailable slots like 8:30-9:25) */}
      {isInstructor && isManagingSlots && (
        <div className="p-3 bg-stone-100 dark:bg-[#242D26] rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-800 dark:text-stone-200 text-xs">
              Manage Studio Timeslots ({studioTimeslots.length})
            </span>
            <button
              type="button"
              onClick={() => setIsManagingSlots(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-stone-500">
            Remove any timeslots that are not available at your studio so clients won't see them.
          </p>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {studioTimeslots.map(slot => (
              <div
                key={slot}
                className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1C231E] border border-stone-200 dark:border-stone-800 text-xs"
              >
                <span className="font-medium text-stone-800 dark:text-stone-200">{slot}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="text-rose-500 hover:text-rose-700 p-1 transition-colors"
                  title="Remove timeslot"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
