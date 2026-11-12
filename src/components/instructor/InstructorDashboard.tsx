import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  RefreshCw,
  Repeat,
  ArrowLeft,
  Sun,
  Moon,
  ChevronRight,
  ExternalLink,
  CalendarCheck,
  Search
} from 'lucide-react';
import type { UserProfile } from '../../types';
import { AVAILABLE_STUDIO_TIMESLOTS } from '../../data/mockData';
import {
  InstructorAlignmentDrawing,
  MorningSunDrawing,
  PeacefulMoonDrawing
} from '../common/StudioDrawings';
import { NotificationDemoCard } from '../common/NotificationDemoCard';
import { DayOfWeekPicker } from '../common/DayOfWeekPicker';
import { StudioTimeslotSelect } from '../common/StudioTimeslotSelect';
import { InstructorBatchesView } from './InstructorBatchesView';
import { InstructorFeesView } from './InstructorFeesView';

interface InstructorDashboardProps {
  onOpenClientDossier: (client: UserProfile, initialTab?: 'diet' | 'attendance') => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ onOpenClientDossier }) => {
  const {
    currentUser,
    clients,
    sessions,
    updateAttendance,
    createOrUpdateSession,
    respondToReschedule,
    switchUser,
    instructorActiveView,
    setInstructorActiveView,
    batchSlots,
    toggleBatchSlotAvailability
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Timeslot form state with alarm-style day picker and starting & ending dates
  const [slotTitle, setSlotTitle] = useState<string>('Pilates Session');
  const [slotDate, setSlotDate] = useState<string>('2026-11-09');
  const [slotEndDate, setSlotEndDate] = useState<string>('2026-12-06');
  const [slotTime, setSlotTime] = useState<string>(AVAILABLE_STUDIO_TIMESLOTS[1]);
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // default Mon-Fri
  const [repeatWeeks, setRepeatWeeks] = useState<number>(4);
  const [successBanner, setSuccessBanner] = useState<string>('');

  const updateDatesFromDuration = (weeks: number, baseStartDate: string = slotDate) => {
    setRepeatWeeks(weeks);
    try {
      const [y, m, d] = baseStartDate.split('-').map(Number);
      const end = new Date(y, m - 1, d);
      end.setDate(end.getDate() + weeks * 7 - 1);
      const ey = end.getFullYear();
      const em = String(end.getMonth() + 1).padStart(2, '0');
      const ed = String(end.getDate()).padStart(2, '0');
      setSlotEndDate(`${ey}-${em}-${ed}`);
    } catch (e) {
      console.error(e);
    }
  };

  if (!currentUser) return null;

  const todayStr = '2026-11-06';
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const pendingReschedules = sessions.filter(s => s.rescheduleRequest?.status === 'pending');
  const notAttendingTodaySessions = todaySessions.filter(s => s.clientConfirmation === 'not_attending');

  // Morning batches & Evening batches
  const morningBatches = batchSlots.filter(s => s.category === 'morning');
  const eveningBatches = batchSlots.filter(s => s.category === 'evening');

  const morningTodaySessions = todaySessions.filter(s => morningBatches.some(b => b.timeSlot === s.time));
  const morningBookedCount = morningTodaySessions.length;
  const morningPresentCount = morningTodaySessions.filter(s => s.status === 'present').length;
  const morningScheduledCount = morningTodaySessions.filter(s => s.status === 'scheduled').length;
  const morningAbsentCount = morningTodaySessions.filter(s => s.status === 'absent').length;

  const eveningTodaySessions = todaySessions.filter(s => eveningBatches.some(b => b.timeSlot === s.time));
  const eveningBookedCount = eveningTodaySessions.length;
  const eveningPresentCount = eveningTodaySessions.filter(s => s.status === 'present').length;
  const eveningScheduledCount = eveningTodaySessions.filter(s => s.status === 'scheduled').length;
  const eveningAbsentCount = eveningTodaySessions.filter(s => s.status === 'absent').length;

  const filteredClients = clients.filter(
    c =>
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const cl = clients.find(c => c.id === selectedClientId) || clients[0];
    createOrUpdateSession({
      sessionTitle: slotTitle || 'Pilates Session',
      startDate: slotDate,
      endDate: slotEndDate,
      time: slotTime,
      clientId: cl.id,
      clientName: cl.displayName,
      status: 'scheduled',
      selectedDays: selectedDays.length > 0 ? selectedDays : undefined,
      repeatWeeks
    });

    const summary = selectedDays.length > 0
      ? `Scheduled classes from ${slotDate} to ${slotEndDate} for ${cl.displayName}!`
      : `Class scheduled for ${cl.displayName}!`;
    setSuccessBanner(summary);
    setInstructorActiveView('attendance');
    setTimeout(() => setSuccessBanner(''), 3000);
  };

  const handleBookBatchSlot = (timeSlot: string) => {
    setSlotTime(timeSlot);
    setInstructorActiveView('new-slot');
  };

  return (
    <div className="flex-1 p-4 pb-28 space-y-4 max-w-xl mx-auto w-full">
      {/* Success banner if any action occurred */}
      {successBanner && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 rounded-2xl border border-emerald-300 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 1: MORNING BATCHES ATTENDANCE (Dedicated Separate Window)
          ═══════════════════════════════════════════════════════════════════ */}
      {instructorActiveView === 'morning' && (
        <div className="space-y-4 animate-window-forward">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setInstructorActiveView('attendance')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100/90 dark:bg-stone-800/80 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs transition-all active:scale-95 duration-150 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>7:00 AM – 12:00 PM</span>
            </span>
          </div>

          {/* Dedicated Morning Header Banner - Light Oat Milk & Warm Sand */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-[#FAF6F0] via-[#F4EFEA] to-[#EAE0D2] text-[#2D251E] shadow-ambient relative overflow-hidden border border-[#D5C0A4]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[#7B6244] font-semibold flex items-center gap-1.5 bg-[#FAF6F0] px-2.5 py-0.5 rounded-full border border-[#D5C0A4]">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>Morning Batches</span>
              </span>
              <span className="text-xs bg-[#FAF6F0] px-2.5 py-0.5 rounded-full text-[#675137] font-bold border border-[#D5C0A4]">
                {morningBatches.length} Slots
              </span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#2D251E]">
              Morning Attendance
            </h3>
            <p className="text-xs text-[#786B5D] font-medium mt-0.5">
              Check in members scheduled between 7:00 AM and 12:00 PM.
            </p>

            {/* Quick Morning Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#D5C0A4]/70 text-center">
              <div className="bg-white/80 rounded-2xl p-2 border border-[#E2D5C3]">
                <p className="text-lg font-serif font-bold text-emerald-800">{morningPresentCount}</p>
                <p className="text-xs text-emerald-900 font-medium">Present</p>
              </div>
              <div className="bg-white/80 rounded-2xl p-2 border border-[#E2D5C3]">
                <p className="text-lg font-serif font-bold text-amber-800">{morningScheduledCount}</p>
                <p className="text-xs text-amber-900 font-medium">Scheduled</p>
              </div>
              <div className="bg-white/80 rounded-2xl p-2 border border-[#E2D5C3]">
                <p className="text-lg font-serif font-bold text-stone-700">{morningAbsentCount}</p>
                <p className="text-xs text-stone-600 font-medium">Absent</p>
              </div>
            </div>

            <MorningSunDrawing className="w-28 h-16 text-[#7B6244]/15 absolute -right-2 -bottom-2 pointer-events-none" />
          </div>

          {/* Morning Slots List */}
          <div className="space-y-3">
            {morningBatches.map(batch => {
              const batchSessions = todaySessions.filter(s => s.time === batch.timeSlot);
              const isUnavailable = !batch.isAvailable;

              if (isUnavailable) {
                return (
                  <div
                    key={batch.id}
                    className="p-3.5 bg-stone-100/70 dark:bg-[#181F1A] rounded-3xl border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between opacity-70"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-stone-500">{batch.timeSlot}</span>
                      <p className="text-[11px] text-stone-400 font-medium">Slot Closed by Instructor</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleBatchSlotAvailability(batch.id)}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] font-bold text-stone-700 dark:text-stone-300"
                    >
                      Open Slot
                    </button>
                  </div>
                );
              }

              if (batchSessions.length === 0) {
                return (
                  <div
                    key={batch.id}
                    className="p-4 bg-white dark:bg-[#1C231E] rounded-3xl border border-stone-200/70 dark:border-stone-800/70 flex items-center justify-between shadow-ambient-sm"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{batch.timeSlot}</span>
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          Open Batch
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 font-medium">{batch.label || 'Studio Flow'} • No bookings today</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleBookBatchSlot(batch.timeSlot)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all active:scale-95 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBatchSlotAvailability(batch.id)}
                        className="px-2 py-1 rounded-xl text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                        title="Mark slot unavailable"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={batch.id} className="space-y-2">
                  {batchSessions.map(slot => (
                    <div
                      key={slot.id}
                      className="bg-white dark:bg-[#1C231E] rounded-3xl p-4 sm:p-5 shadow-ambient border border-stone-200/70 dark:border-stone-800/70 space-y-3 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                              {slot.clientName}
                            </h4>
                            {slot.isRecurring && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                                <Repeat className="w-3 h-3" />
                                <span>Recurring</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 font-medium">
                            {slot.sessionTitle} • <strong className="text-emerald-800 dark:text-emerald-400">{slot.time}</strong>
                          </p>
                        </div>

                        <div>
                          {slot.status === 'present' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </span>
                          )}
                          {slot.status === 'absent' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </span>
                          )}
                          {slot.status === 'scheduled' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Scheduled</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Client 45-Min Notification Response Status Badge */}
                      <div className="pt-0.5">
                        {slot.clientConfirmation === 'attending' && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#EDF6EE] dark:bg-[#16261A] border border-[#CDE5CF] dark:border-[#284A2E] text-xs font-bold text-[#1E5227] dark:text-[#76CE84]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Confirmed Attending (via 45m phone reminder)</span>
                          </div>
                        )}
                        {slot.clientConfirmation === 'not_attending' && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FBF1F0] dark:bg-[#2A1B1A] border border-[#F3D5D3] dark:border-[#522927] text-xs font-bold text-[#9A3531] dark:text-[#E88C88]">
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                            <span>Not Attending (Tapped "Not attending" on 45m alert — Do not wait)</span>
                          </div>
                        )}
                        {!slot.clientConfirmation && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-50 dark:bg-[#242D26] border border-stone-200/80 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 font-medium">
                            <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>Awaiting 45m notification confirmation</span>
                          </div>
                        )}
                      </div>

                      {/* 1-Tap Attendance Check-In Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100 dark:border-stone-800/70">
                        <button
                          type="button"
                          onClick={() => updateAttendance(slot.id, 'present')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                            slot.status === 'present'
                              ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600'
                              : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateAttendance(slot.id, 'absent')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                            slot.status === 'absent'
                              ? 'bg-rose-700 text-white shadow-sm ring-2 ring-rose-500'
                              : 'bg-[#FAF3F2] dark:bg-[#251A19] text-[#9A3531] dark:text-[#E68884] border border-[#F1D4D2] dark:border-[#4A2624] hover:bg-[#F5E6E5]'
                          }`}
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Mark Absent</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 2: EVENING BATCHES ATTENDANCE (Dedicated Separate Window)
          ═══════════════════════════════════════════════════════════════════ */}
      {instructorActiveView === 'evening' && (
        <div className="space-y-4 animate-window-forward">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setInstructorActiveView('attendance')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100/90 dark:bg-stone-800/80 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs transition-all active:scale-95 duration-150 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F4ECE1] dark:bg-[#33271A] text-[#7B6244] dark:text-[#D5C0A4] border border-[#E6D7C3] dark:border-[#52402B] flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-[#A68B69]" />
              <span>4:00 PM – 12:00 AM</span>
            </span>
          </div>

          {/* Dedicated Evening Header Banner - Light Oat Milk & Warm Sand */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-[#FAF6F0] via-[#F4EFEA] to-[#EAE0D2] text-[#2D251E] shadow-ambient relative overflow-hidden border border-[#D5C0A4]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[#7B6244] font-semibold flex items-center gap-1.5 bg-[#FAF6F0] px-2.5 py-0.5 rounded-full border border-[#D5C0A4]">
                <Moon className="w-4 h-4 text-[#7B6244]" />
                <span>Evening Batches</span>
              </span>
              <span className="text-xs bg-[#FAF6F0] px-2.5 py-0.5 rounded-full text-[#675137] font-bold border border-[#D5C0A4]">
                {eveningBatches.length} Slots
              </span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#2D251E]">
              Evening Attendance
            </h3>
            <p className="text-xs text-[#786B5D] font-medium mt-0.5">
              Check in members scheduled between 4:00 PM and 12:00 AM.
            </p>

            {/* Quick Evening Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#D5C0A4]/70 text-center">
              <div className="bg-white/80 rounded-2xl p-2 border border-[#E2D5C3]">
                <p className="text-lg font-serif font-bold text-emerald-800">{eveningPresentCount}</p>
                <p className="text-xs text-emerald-900 font-medium">Present</p>
              </div>
              <div className="bg-white/80 rounded-2xl p-2 border border-[#E2D5C3]">
                <p className="text-lg font-serif font-bold text-amber-800">{eveningScheduledCount}</p>
                <p className="text-xs text-amber-900 font-medium">Scheduled</p>
              </div>
              <div className="bg-white/80 rounded-2xl p-2 border border-[#E2D5C3]">
                <p className="text-lg font-serif font-bold text-stone-700">{eveningAbsentCount}</p>
                <p className="text-xs text-stone-600 font-medium">Absent</p>
              </div>
            </div>

            <PeacefulMoonDrawing className="w-28 h-16 text-[#7B6244]/15 absolute -right-2 -bottom-2 pointer-events-none" />
          </div>

          {/* Evening Slots List */}
          <div className="space-y-3">
            {eveningBatches.map(batch => {
              const batchSessions = todaySessions.filter(s => s.time === batch.timeSlot);
              const isUnavailable = !batch.isAvailable;

              if (isUnavailable) {
                return (
                  <div
                    key={batch.id}
                    className="p-3.5 bg-stone-100/70 dark:bg-[#181F1A] rounded-3xl border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between opacity-70"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-stone-500">{batch.timeSlot}</span>
                      <p className="text-[11px] text-stone-400 font-medium">Slot Closed by Instructor</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleBatchSlotAvailability(batch.id)}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] font-bold text-stone-700 dark:text-stone-300"
                    >
                      Open Slot
                    </button>
                  </div>
                );
              }

              if (batchSessions.length === 0) {
                return (
                  <div
                    key={batch.id}
                    className="p-4 bg-white dark:bg-[#1C231E] rounded-3xl border border-stone-200/70 dark:border-stone-800/70 flex items-center justify-between shadow-ambient-sm"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{batch.timeSlot}</span>
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          Open Batch
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 font-medium">{batch.label || 'Studio Flow'} • No bookings today</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleBookBatchSlot(batch.timeSlot)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all active:scale-95 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBatchSlotAvailability(batch.id)}
                        className="px-2 py-1 rounded-xl text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                        title="Mark slot unavailable"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={batch.id} className="space-y-2">
                  {batchSessions.map(slot => (
                    <div
                      key={slot.id}
                      className="bg-white dark:bg-[#1C231E] rounded-3xl p-4 sm:p-5 shadow-ambient border border-stone-200/70 dark:border-stone-800/70 space-y-3 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                              {slot.clientName}
                            </h4>
                            {slot.isRecurring && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                                <Repeat className="w-3 h-3" />
                                <span>Recurring</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 font-medium">
                            {slot.sessionTitle} • <strong className="text-emerald-800 dark:text-emerald-400">{slot.time}</strong>
                          </p>
                        </div>

                        <div>
                          {slot.status === 'present' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </span>
                          )}
                          {slot.status === 'absent' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </span>
                          )}
                          {slot.status === 'scheduled' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Scheduled</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Client 45-Min Notification Response Status Badge */}
                      <div className="pt-0.5">
                        {slot.clientConfirmation === 'attending' && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#EDF6EE] dark:bg-[#16261A] border border-[#CDE5CF] dark:border-[#284A2E] text-xs font-bold text-[#1E5227] dark:text-[#76CE84]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Confirmed Attending (via 45m phone reminder)</span>
                          </div>
                        )}
                        {slot.clientConfirmation === 'not_attending' && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FBF1F0] dark:bg-[#2A1B1A] border border-[#F3D5D3] dark:border-[#522927] text-xs font-bold text-[#9A3531] dark:text-[#E88C88]">
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                            <span>Not Attending (Tapped "Not attending" on 45m alert — Do not wait)</span>
                          </div>
                        )}
                        {!slot.clientConfirmation && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-50 dark:bg-[#242D26] border border-stone-200/80 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 font-medium">
                            <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>Awaiting 45m notification confirmation</span>
                          </div>
                        )}
                      </div>

                      {/* 1-Tap Attendance Check-In Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100 dark:border-stone-800/70">
                        <button
                          type="button"
                          onClick={() => updateAttendance(slot.id, 'present')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                            slot.status === 'present'
                              ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600'
                              : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateAttendance(slot.id, 'absent')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                            slot.status === 'absent'
                              ? 'bg-rose-700 text-white shadow-sm ring-2 ring-rose-500'
                              : 'bg-[#FAF3F2] dark:bg-[#251A19] text-[#9A3531] dark:text-[#E68884] border border-[#F1D4D2] dark:border-[#4A2624] hover:bg-[#F5E6E5]'
                          }`}
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Mark Absent</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 3: DEFAULT MAIN OVERVIEW (Clean 2-Button Studio Landing)
          ═══════════════════════════════════════════════════════════════════ */}
      {instructorActiveView === 'attendance' && (
        <div className="space-y-4 animate-serene-fade">
          {/* Calm, Serene Studio Welcome Banner */}
          <div className="bg-white dark:bg-[#1A221C] rounded-3xl p-5 sm:p-6 shadow-ambient border border-stone-200/80 dark:border-stone-800 relative overflow-hidden transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md">
                Friday • Nov 06
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {todaySessions.length} Classes Today
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Good day, Radhika
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light mt-1 max-w-sm">
              Tap Morning or Evening below to view attendance &amp; check in members.
            </p>

            <InstructorAlignmentDrawing className="w-28 h-18 text-emerald-800/10 dark:text-emerald-300/10 absolute -right-1 -bottom-2 pointer-events-none" />
          </div>

          {/* Urgent Cancellation Alert (When a client taps 'Not attending' on phone) */}
          {notAttendingTodaySessions.length > 0 && (
            <div className="p-4 bg-rose-50/80 dark:bg-rose-950/60 rounded-3xl border border-rose-200 dark:border-rose-800 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold text-xs">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Notice: Client Tapped "Not attending" on 45m Alert</span>
              </div>
              {notAttendingTodaySessions.map(slot => (
                <p key={slot.id} className="text-xs text-rose-800 dark:text-rose-300 pl-6 leading-relaxed">
                  <strong>{slot.clientName}</strong> ({slot.time}) cancelled in advance. <strong>You do not need to wait at the gym.</strong>
                </p>
              ))}
            </div>
          )}

          {/* Pending Reschedule Requests Pill */}
          {pendingReschedules.length > 0 && (
            <div
              onClick={() => setInstructorActiveView('requests')}
              className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-2xl border border-amber-300 dark:border-amber-800 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                <span>{pendingReschedules.length} Member Reschedule Request Pending</span>
              </div>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <span>Review</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              THE TWO MAIN MINIMALIST BUTTONS: MORNING & EVENING BATCHES
              ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Morning Batches Button */}
            <button
              type="button"
              onClick={() => setInstructorActiveView('morning')}
              className="p-5 rounded-3xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-br from-[#FFFDF8] via-white to-[#F8F2E4] dark:from-[#211B14] dark:via-[#1B1611] dark:to-[#16120E] hover:border-amber-300 dark:hover:border-amber-800/80 transition-all text-left relative overflow-hidden flex flex-col justify-between shadow-ambient active:scale-[0.98] duration-200 group"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/80 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Sun className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100/90 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                  {morningBookedCount} Classes
                </span>
              </div>

              <div className="w-full my-4 h-16 flex items-center justify-center">
                <MorningSunDrawing className="w-28 h-16 text-amber-700/80 dark:text-amber-300/80 group-hover:scale-105 transition-transform duration-200" />
              </div>

              <div className="w-full pt-1 border-t border-amber-200/50 dark:border-amber-900/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 leading-tight">
                    Morning Batches
                  </h3>
                  <span className="text-xs text-amber-800 dark:text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform duration-200">
                    Open &rarr;
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-medium">
                  7:00 AM – 12:00 PM • {morningPresentCount} Present
                </p>
              </div>
            </button>

            {/* 2. Evening Batches Button */}
            <button
              type="button"
              onClick={() => setInstructorActiveView('evening')}
              className="p-5 rounded-3xl border border-[#D5C0A4] dark:border-[#52402B]/60 bg-gradient-to-br from-[#FBF8F4] via-white to-[#F2E8DC] dark:from-[#241E18] dark:via-[#1C1713] dark:to-[#14100D] hover:border-[#BFA483] dark:hover:border-[#7B6244]/80 transition-all text-left relative overflow-hidden flex flex-col justify-between shadow-ambient active:scale-[0.98] duration-200 group"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-12 h-12 rounded-2xl bg-[#EFE3D2] dark:bg-[#382B1D] text-[#7B6244] dark:text-[#D5C0A4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Moon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFE3D2] dark:bg-[#382B1D] text-[#675137] dark:text-[#E6D7C3] border border-[#D5C0A4] dark:border-[#52402B]">
                  {eveningBookedCount} Classes
                </span>
              </div>

              <div className="w-full my-4 h-16 flex items-center justify-center">
                <PeacefulMoonDrawing className="w-28 h-16 text-[#7B6244]/80 dark:text-[#D5C0A4]/80 group-hover:scale-105 transition-transform duration-200" />
              </div>

              <div className="w-full pt-1 border-t border-[#D5C0A4]/40 dark:border-[#52402B]/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 leading-tight">
                    Evening Batches
                  </h3>
                  <span className="text-xs text-[#7B6244] dark:text-[#D5C0A4] font-bold group-hover:translate-x-0.5 transition-transform duration-200">
                    Open &rarr;
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-medium">
                  4:00 PM – 12:00 AM • {eveningPresentCount} Present
                </p>
              </div>
            </button>
          </div>

          {/* Phone Notification Showcase & Demo Card */}
          <NotificationDemoCard />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 4: SCHEDULE NEW CLASS
          ═══════════════════════════════════════════════════════════════════ */}
      {instructorActiveView === 'new-slot' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setInstructorActiveView('attendance')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Attendance</span>
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              New Booking
            </span>
          </div>

          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                Schedule Client Session
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Select active days (Mon-Fri) and dates for this client
              </p>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">Session Title</label>
                <input
                  type="text"
                  value={slotTitle}
                  onChange={e => setSlotTitle(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">Select Client</label>
                <select
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-medium"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.displayName} ({c.membershipTier || 'Member'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-1">
                <DayOfWeekPicker
                  selectedDays={selectedDays}
                  onChange={setSelectedDays}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1">Starting Date</label>
                  <input
                    type="date"
                    value={slotDate}
                    onChange={e => {
                      setSlotDate(e.target.value);
                      updateDatesFromDuration(repeatWeeks, e.target.value);
                    }}
                    className="w-full p-2.5 rounded-2xl bg-stone-50 dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1">Ending Date</label>
                  <input
                    type="date"
                    value={slotEndDate}
                    onChange={e => setSlotEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-stone-50 dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1">Duration Preset</label>
                  <select
                    value={repeatWeeks}
                    onChange={e => updateDatesFromDuration(Number(e.target.value))}
                    className="w-full p-2.5 rounded-2xl bg-stone-50 dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    <option value={1}>1 Week Only</option>
                    <option value={2}>2 Weeks</option>
                    <option value={4}>4 Weeks (1 Month)</option>
                    <option value={6}>6 Weeks</option>
                    <option value={8}>8 Weeks (2 Months)</option>
                    <option value={12}>12 Weeks (3 Months)</option>
                  </select>
                </div>

                <div>
                  <StudioTimeslotSelect
                    value={slotTime}
                    onChange={setSlotTime}
                    isInstructor={true}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Confirm &amp; Schedule Class</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 5: RESCHEDULE REQUESTS
          ═══════════════════════════════════════════════════════════════════ */}
      {instructorActiveView === 'requests' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setInstructorActiveView('attendance')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {pendingReschedules.length} Pending
            </span>
          </div>

          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-2">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Member Reschedule Requests
            </h3>
            <p className="text-xs text-stone-500 font-medium">Review requested time shifts from clients</p>
          </div>

          {pendingReschedules.length === 0 ? (
            <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-8 text-center space-y-3 border border-stone-200 dark:border-stone-800">
              <InstructorAlignmentDrawing className="w-32 h-20 mx-auto text-emerald-800/60 dark:text-emerald-400/60" />
              <h4 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">No Pending Requests</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                All client reschedule requests have been addressed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReschedules.map(slot => (
                <div
                  key={slot.id}
                  className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-amber-300 dark:border-amber-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                        {slot.clientName}
                      </h4>
                      <p className="text-xs text-stone-500 font-medium">{slot.sessionTitle}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                      Pending Action
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-1.5 text-xs">
                    <p className="text-stone-600 dark:text-stone-400">
                      Current: <strong>{slot.date} ({slot.time})</strong>
                    </p>
                    <p className="text-emerald-900 dark:text-emerald-300 font-bold">
                      Requested: {slot.rescheduleRequest?.requestedDate} at {slot.rescheduleRequest?.requestedTime}
                    </p>
                    {slot.rescheduleRequest?.clientReason && (
                      <p className="text-stone-600 dark:text-stone-300 italic pt-1 border-t border-amber-200/50">
                        "{slot.rescheduleRequest.clientReason}"
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => respondToReschedule(slot.id, false)}
                      className="py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => respondToReschedule(slot.id, true)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs"
                    >
                      Approve Shift
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 6: BATCHES & SLOT AVAILABILITY
          ═══════════════════════════════════════════════════════════════════ */}
      {instructorActiveView === 'batches' && (
        <InstructorBatchesView
          onBackToAttendance={() => setInstructorActiveView('attendance')}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 7: FEE MANAGEMENT
          ═══════════════════════════════════════════════════════════════════ */}
      {instructorActiveView === 'fees' && (
        <InstructorFeesView
          onBackToAttendance={() => setInstructorActiveView('attendance')}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 8: CLIENT ROSTER
          ═══════════════════════════════════════════════════════════════════ */}
      {instructorActiveView === 'roster' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setInstructorActiveView('attendance')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {clients.length} Members
            </span>
          </div>

          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                Studio Members Directory
              </h3>
              <p className="text-xs text-stone-500 font-medium">Design diet plans and inspect schedules</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search by client name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50 dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-900 dark:text-stone-100 font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredClients.map(client => (
              <div
                key={client.id}
                className="bg-white dark:bg-[#1C231E] rounded-3xl p-4 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={client.avatarUrl}
                    alt={client.displayName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-600/20"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {client.displayName}
                    </h4>
                    <p className="text-xs text-stone-500">{client.email}</p>
                    <span className="inline-block text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-0.5">
                      {client.dietPlan?.metrics.dailyIntake || '~1,600 kcal/day'} • {client.dietPlan?.planTitle || 'Studio Plan'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => switchUser(client)}
                    className="py-2.5 px-2 rounded-xl bg-stone-50 dark:bg-[#242D26] hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View as Client</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenClientDossier(client, 'diet')}
                    className="py-2.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Edit Diet Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenClientDossier(client, 'attendance')}
                    className="py-2.5 px-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Edit Schedule</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
