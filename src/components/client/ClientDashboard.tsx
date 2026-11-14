import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Sparkles,
  XCircle,
  Send,
  X,
  Repeat,
  CalendarCheck,
  CreditCard,
  AlertCircle,
  Bell
} from 'lucide-react';
import { PilatesPoseDrawing } from '../common/StudioDrawings';

export const ClientDashboard: React.FC = () => {
  const { currentUser, sessions, setActiveTab, requestReschedule, studioTimeslots } = useApp();

  // Sub-view toggle to keep screen minimal
  const [activeView, setActiveView] = useState<'today' | 'upcoming'>('today');

  // Reschedule dialog state
  const [rescheduleTargetSlotId, setRescheduleTargetSlotId] = useState<string | null>(null);
  const [requestedDate, setRequestedDate] = useState<string>('2026-11-09');
  const [requestedTime, setRequestedTime] = useState<string>(() => studioTimeslots[0] || '08:30 AM - 09:25 AM');
  const [rescheduleReason, setRescheduleReason] = useState<string>('');
  const [rescheduleSuccessMsg, setRescheduleSuccessMsg] = useState<string>('');

  if (!currentUser) return null;

  // Filter client's sessions sorted by date
  const mySessions = sessions
    .filter(s => s.clientId === currentUser.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Find today's session or next upcoming session
  const todayStr = '2026-11-06';
  const todaySession = mySessions.find(s => s.date === todayStr);
  const nextSession = todaySession || mySessions.find(s => s.date >= todayStr) || mySessions[0];

  // Other upcoming sessions
  const upcomingSessions = mySessions.filter(
    s => s.id !== nextSession?.id && s.date >= todayStr
  );

  const handleOpenReschedule = (sessionId: string) => {
    setRescheduleTargetSlotId(sessionId);
    setRescheduleSuccessMsg('');
    setRescheduleReason('');
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTargetSlotId) return;
    requestReschedule(
      rescheduleTargetSlotId,
      requestedDate,
      requestedTime,
      rescheduleReason || 'Requested schedule adjustment'
    );
    setRescheduleSuccessMsg('Reschedule request sent to instructor!');
    setTimeout(() => {
      setRescheduleTargetSlotId(null);
      setRescheduleSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="flex-1 p-4 pb-28 space-y-4 max-w-xl mx-auto w-full">
      {/* Studio Greeting Header - Light Oat Milk & Warm Sand */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#FAF6F0] via-[#F4EFEA] to-[#EAE0D2] text-[#2D251E] shadow-ambient border border-[#D5C0A4] relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#675137] flex items-center gap-1.5 bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-[#D5C0A4]/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#7B6244]" />
            <span>RC Pilates &amp; Fitness</span>
          </span>
          <span className="text-xs bg-[#FAF6F0] px-3 py-1 rounded-full text-[#675137] font-bold border border-[#D5C0A4]/80 shadow-xs">
            {currentUser.membershipTier || 'Member'}
          </span>
        </div>

        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#2D251E] leading-tight">
          Hi, {currentUser.displayName.split(' ')[0]}
        </h2>
        <p className="text-sm text-[#786B5D] mt-1 font-medium">
          Your scheduled pilates timeslots &amp; attendance check-in.
        </p>

        {/* Studio Drawing Accent */}
        <PilatesPoseDrawing className="w-24 h-24 text-[#7B6244]/15 absolute -right-2 -bottom-2 pointer-events-none" />
      </div>

      {/* Membership & Fee Status Banner */}
      {currentUser.feeRecord && (
        <div
          className={`p-4 rounded-3xl border transition-all ${
            currentUser.feeRecord.status === 'paid'
              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/80'
              : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  currentUser.feeRecord.status === 'paid'
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                }`}
              >
                {currentUser.feeRecord.status === 'paid' ? (
                  <CreditCard className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    {currentUser.feeRecord.packageTitle}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      currentUser.feeRecord.status === 'paid'
                        ? 'bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                        : 'bg-amber-200/90 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    {currentUser.feeRecord.status === 'paid' ? 'Fee Paid' : 'Fee Due'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  {currentUser.feeRecord.amount.startsWith('₹') ? currentUser.feeRecord.amount : `₹${currentUser.feeRecord.amount}`} • {currentUser.feeRecord.status === 'paid' ? `Next due: ${currentUser.feeRecord.dueDate}` : `Due date: ${currentUser.feeRecord.dueDate}`}
                </p>
              </div>
            </div>
          </div>

          {currentUser.feeRecord.status === 'pending' && currentUser.feeRecord.lastReminderSent && (
            <div className="mt-2.5 pt-2.5 border-t border-amber-200/80 dark:border-amber-800/60 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200 bg-amber-100/50 dark:bg-amber-900/30 p-2.5 rounded-xl">
              <Bell className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[11px]">Notice from Radhika Chopra:</p>
                <p className="text-[11px] opacity-90 mt-0.5 italic">
                  "Kindly settle your studio fee of {currentUser.feeRecord.amount.startsWith('₹') ? currentUser.feeRecord.amount : `₹${currentUser.feeRecord.amount}`} for {currentUser.feeRecord.packageTitle}."
                </p>
                <p className="text-[9px] text-amber-700 dark:text-amber-400 mt-1">Reminder sent on {currentUser.feeRecord.lastReminderSent}</p>
              </div>
            </div>
          )}
        </div>
      )}


      {/* Screen Segment Toggle (Minimal on screen at one time) */}
      <div className="grid grid-cols-2 gap-2 bg-stone-100 dark:bg-[#1C231E] p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800">
        <button
          type="button"
          onClick={() => setActiveView('today')}
          className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeView === 'today'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Next Pilates Class</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('upcoming')}
          className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeView === 'upcoming'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>All Upcoming ({upcomingSessions.length})</span>
        </button>
      </div>

      {/* VIEW 1: NEXT CLASS HERO CARD (Large text, visual badges, big buttons) */}
      {activeView === 'today' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {nextSession ? (
            <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-6 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-4 transition-all">
              {/* Date & Recurring pill */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  {nextSession.date === todayStr ? 'Today • ' + nextSession.date : nextSession.date}
                </span>

                {nextSession.isRecurring && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Weekly Recurring</span>
                  </span>
                )}
              </div>

              {/* Serene Line Drawing of Reformer Pose */}
              <div className="w-full bg-[#FAF8F5] dark:bg-[#242D26] rounded-2xl p-3 border border-stone-200/70 dark:border-stone-800/80 flex items-center justify-center">
                <PilatesPoseDrawing pose="reformer-flow" className="w-56 h-28 text-emerald-800 dark:text-emerald-300" />
              </div>

              {/* Class Title in Big Serif Text */}
              <div>
                <h3 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100 leading-tight">
                  {nextSession.sessionTitle}
                </h3>
              </div>

              {/* Visual Timeslot Grid (Large & Clear) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200/80 dark:border-stone-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Class Timeslot</span>
                    <p className="font-bold text-sm text-stone-900 dark:text-stone-100">{nextSession.time}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200/80 dark:border-stone-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Studio Location</span>
                    <p className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      RC Pilates Studio
                    </p>
                    <p className="text-xs text-stone-500 font-medium">Instructor {nextSession.instructorName}</p>
                  </div>
                </div>
              </div>

              {/* Attendance Status (Big Visual Pill) */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">Attendance Status</span>
                  <div className="mt-1">
                    {nextSession.status === 'present' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Present {nextSession.markedAt && `(${nextSession.markedAt})`}</span>
                      </span>
                    )}
                    {nextSession.status === 'absent' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Absent</span>
                      </span>
                    )}
                    {nextSession.status === 'scheduled' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Scheduled</span>
                      </span>
                    )}
                    {nextSession.status === 'reschedule_requested' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Reschedule Pending</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-850 dark:bg-emerald-800 text-emerald-100 flex items-center justify-center font-serif font-bold text-sm shadow-xs ring-2 ring-emerald-600/20">
                    RC
                  </div>
                  <div className="hidden xs:block text-right">
                    <p className="text-xs text-stone-400">Instructor</p>
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{nextSession.instructorName || 'Radhika Chopra'}</p>
                  </div>
                </div>
              </div>

              {/* Big Request Reschedule Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenReschedule(nextSession.id)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <Clock className="w-4 h-4" />
                  <span>Request Reschedule for this Slot</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-8 text-center space-y-3 border border-stone-200 dark:border-stone-800">
              <PilatesPoseDrawing pose="stretch" className="w-44 h-28 mx-auto text-emerald-800/70 dark:text-emerald-400/70" />
              <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">No Class Scheduled</h3>
              <p className="text-sm text-stone-500 max-w-xs mx-auto">
                Your instructor will allocate your next timeslot shortly.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ALL UPCOMING SESSIONS (Clean List View) */}
      {activeView === 'upcoming' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {upcomingSessions.length === 0 ? (
            <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-8 text-center space-y-2 border border-stone-200 dark:border-stone-800">
              <CalendarCheck className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="font-serif font-bold text-base text-stone-700 dark:text-stone-300">No other upcoming sessions</p>
              <p className="text-xs text-stone-400">Your schedule is clear for the week.</p>
            </div>
          ) : (
            upcomingSessions.map(slot => (
              <div
                key={slot.id}
                className="bg-white dark:bg-[#1C231E] p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-ambient space-y-2 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      {slot.date}
                    </span>
                    <h4 className="font-bold text-base text-stone-900 dark:text-stone-100 mt-1">
                      {slot.sessionTitle}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {slot.time} • RC Pilates Studio
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReschedule(slot.id)}
                    className="py-1.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-semibold text-xs border border-stone-200 dark:border-stone-700"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="pt-2 text-center">
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Open Monthly Calendar View &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* Reschedule Request Modal */}
      {rescheduleTargetSlotId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 text-stone-900 dark:text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                <h3 className="font-serif font-bold text-lg">Change Timeslot</h3>
              </div>
              <button
                onClick={() => setRescheduleTargetSlotId(null)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {rescheduleSuccessMsg ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 dark:text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{rescheduleSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmReschedule} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Pick New Date
                  </label>
                  <input
                    type="date"
                    value={requestedDate}
                    onChange={e => setRequestedDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 font-semibold text-sm text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Pick Preferred Timeslot
                  </label>
                  <select
                    value={requestedTime}
                    onChange={e => setRequestedTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 font-semibold text-sm text-stone-900 dark:text-stone-100"
                  >
                    {studioTimeslots.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={rescheduleReason}
                    onChange={e => setRescheduleReason(e.target.value)}
                    placeholder="e.g. Work meeting conflict..."
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleTargetSlotId(null)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
