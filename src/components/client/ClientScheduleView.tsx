import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CalendarDays,
  List
} from 'lucide-react';
import type { SessionTimeslot } from '../../types';
import { PilatesPoseDrawing } from '../common/StudioDrawings';

export const ClientScheduleView: React.FC = () => {
  const { currentUser, sessions, requestReschedule, studioTimeslots } = useApp();

  const [activePanel, setActivePanel] = useState<'calendar' | 'list'>('calendar');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // November (0-indexed)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-06');

  // Reschedule Modal state
  const [rescheduleSession, setRescheduleSession] = useState<SessionTimeslot | null>(null);
  const [newDate, setNewDate] = useState<string>('2026-11-09');
  const [newTime, setNewTime] = useState<string>(() => studioTimeslots[0] || '08:30 AM - 09:25 AM');
  const [rescheduleReason, setRescheduleReason] = useState<string>('Work schedule adjustment');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!currentUser) return null;

  // Filter client's sessions
  const clientSessions = sessions.filter(s => s.clientId === currentUser.id);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getSessionsForDate = (dateStr: string) => {
    return clientSessions.filter(s => s.date === dateStr);
  };

  const selectedDaySessions = getSessionsForDate(selectedDateStr);

  const handleOpenReschedule = (session: SessionTimeslot) => {
    setRescheduleSession(session);
    setNewDate('2026-11-09');
    setNewTime(studioTimeslots[0] || '08:30 AM - 09:25 AM');
    setRescheduleReason('Schedule conflict');
  };

  const handleSubmitReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleSession) return;

    requestReschedule(rescheduleSession.id, newDate, newTime, rescheduleReason);
    setSuccessMsg(`Reschedule request sent for ${newDate}!`);
    setRescheduleSession(null);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="flex-1 p-4 pb-28 space-y-4 max-w-xl mx-auto w-full">
      {/* View Segment Pill (Calendar Grid vs Upcoming List) */}
      <div className="grid grid-cols-2 gap-2 bg-stone-100 dark:bg-[#1C231E] p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800">
        <button
          type="button"
          onClick={() => setActivePanel('calendar')}
          className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activePanel === 'calendar'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Session Calendar</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePanel('list')}
          className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activePanel === 'list'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <List className="w-4 h-4" />
          <span>All Booked Slots ({clientSessions.length})</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-200 text-sm font-bold rounded-2xl border border-emerald-300 dark:border-emerald-800 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* PANEL 1: CALENDAR VIEW */}
      {activePanel === 'calendar' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Calendar Card */}
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-3">
            {/* Month Navigation */}
            <div className="flex items-center justify-between px-1">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentYear(2026);
                    setCurrentMonth(10);
                    setSelectedDateStr('2026-11-06');
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center pt-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-xs font-semibold text-stone-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Month Days Grid with Large Clear Numbers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-11 sm:h-12 rounded-xl" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const monthStr = String(currentMonth + 1).padStart(2, '0');
                const dayStr = String(dayNum).padStart(2, '0');
                const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

                const sessionsOnThisDay = getSessionsForDate(dateStr);
                const hasSession = sessionsOnThisDay.length > 0;
                const isSelected = selectedDateStr === dateStr;
                const isToday = dateStr === '2026-11-06';

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`relative h-12 sm:h-13 rounded-2xl flex flex-col items-center justify-center text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-900 text-white shadow-md scale-105 ring-2 ring-emerald-600'
                        : isToday
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-700'
                        : hasSession
                        ? 'bg-[#FAF8F5] dark:bg-[#242D26] text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{dayNum}</span>

                    {/* Visual Dot for session */}
                    {hasSession && (
                      <span
                        className={`w-2 h-2 rounded-full mt-1 ${
                          isSelected ? 'bg-white' : 'bg-emerald-600 dark:bg-emerald-400'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Session Details (Minimal on screen at one time) */}
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              {selectedDaySessions.length > 0 ? (
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Class Booked
                </span>
              ) : (
                <span className="text-xs text-stone-400 font-medium">No Class</span>
              )}
            </div>

            {selectedDaySessions.length > 0 ? (
              selectedDaySessions.map(slot => (
                <div key={slot.id} className="space-y-4">
                  {/* Artistic Pose Drawing for Session */}
                  <div className="w-full bg-[#FAF8F5] dark:bg-[#242D26] rounded-2xl p-2.5 border border-stone-200/70 dark:border-stone-800 flex items-center justify-center">
                    <PilatesPoseDrawing pose="reformer-flow" className="w-48 h-20 text-emerald-800 dark:text-emerald-300" />
                  </div>

                  {/* Class Title & Timeslot */}
                  <div>
                    <h4 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                      {slot.sessionTitle}
                    </h4>
                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <span>{slot.time}</span>
                    </p>
                  </div>

                  {/* Visual Badges (Location & Status) */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span className="font-semibold text-stone-800 dark:text-stone-200">RC Pilates Studio</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 flex items-center gap-2">
                      <span className="text-emerald-700 dark:text-emerald-400 font-serif font-bold text-sm">RC</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">Instructor {slot.instructorName}</span>
                    </div>
                  </div>

                  {/* Attendance Status */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-[#242D26] border border-stone-200 dark:border-stone-700">
                    <span className="text-xs font-semibold text-stone-500">Status</span>
                    {slot.status === 'present' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Present {slot.markedAt && `(${slot.markedAt})`}</span>
                      </span>
                    )}
                    {slot.status === 'absent' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-3 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Absent</span>
                      </span>
                    )}
                    {slot.status === 'scheduled' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Scheduled</span>
                      </span>
                    )}
                    {slot.status === 'reschedule_requested' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950 px-3 py-1 rounded-full">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Reschedule Pending</span>
                      </span>
                    )}
                  </div>

                  {/* Prominent Reschedule Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenReschedule(slot)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Request Reschedule</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-6 text-center space-y-2">
                <PilatesPoseDrawing pose="stretch" className="w-36 h-24 mx-auto text-emerald-800/60 dark:text-emerald-400/60" />
                <p className="text-sm font-bold text-stone-700 dark:text-stone-300">No session on this date</p>
                <p className="text-xs text-stone-400">Tap any highlighted day above with a green dot to view or reschedule.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PANEL 2: ALL BOOKED SLOTS LIST */}
      {activePanel === 'list' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {clientSessions.map(slot => (
            <div
              key={slot.id}
              className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {slot.date}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-2">
                    {slot.sessionTitle}
                  </h4>
                  <p className="text-xs font-semibold text-stone-600 dark:text-stone-400 mt-0.5">
                    {slot.time} • RC Pilates Studio
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenReschedule(slot)}
                  className="py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-bold text-xs border border-stone-200 dark:border-stone-700"
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 text-stone-900 dark:text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                <h3 className="font-serif font-bold text-base">Request Reschedule</h3>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleSession(null)}
                className="text-stone-400 hover:text-stone-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-stone-50 dark:bg-[#242D26] rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Current Slot</span>
              <p className="font-bold text-sm text-stone-900 dark:text-stone-100">{rescheduleSession.sessionTitle}</p>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {rescheduleSession.date} • {rescheduleSession.time}
              </p>
            </div>

            <form onSubmit={handleSubmitReschedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Requested Date
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] font-medium text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Requested Timeslot
                </label>
                <select
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] font-medium text-stone-900 dark:text-stone-100"
                >
                  {studioTimeslots.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Reason for Adjustment
                </label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={e => setRescheduleReason(e.target.value)}
                  placeholder="e.g. Schedule adjustment"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] font-medium text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleSession(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold shadow-md hover:bg-emerald-900"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
