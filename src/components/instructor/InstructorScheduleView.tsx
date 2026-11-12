import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  MapPin,
  Repeat,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  AVAILABLE_STUDIO_TIMESLOTS
} from '../../data/mockData';
import {
  PilatesPoseDrawing
} from '../common/StudioDrawings';
import { DayOfWeekPicker } from '../common/DayOfWeekPicker';
import { StudioTimeslotSelect } from '../common/StudioTimeslotSelect';

export const InstructorScheduleView: React.FC = () => {
  const { sessions, updateAttendance, deleteSession, createOrUpdateSession, clients } = useApp();

  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [filter, setFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-06');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // November

  // Form states with alarm-style circular day selector and starting & ending dates
  const [sessionTitle, setSessionTitle] = useState<string>('Pilates Session');
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [modalDate, setModalDate] = useState<string>('2026-11-09');
  const [modalEndDate, setModalEndDate] = useState<string>('2026-12-06');
  const [selectedTime, setSelectedTime] = useState<string>(AVAILABLE_STUDIO_TIMESLOTS[1]);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // default Mon-Fri
  const [repeatWeeks, setRepeatWeeks] = useState<number>(4);

  const updateDatesFromDuration = (weeks: number, baseStartDate: string = modalDate) => {
    setRepeatWeeks(weeks);
    try {
      const [y, m, d] = baseStartDate.split('-').map(Number);
      const end = new Date(y, m - 1, d);
      end.setDate(end.getDate() + weeks * 7 - 1);
      const ey = end.getFullYear();
      const em = String(end.getMonth() + 1).padStart(2, '0');
      const ed = String(end.getDate()).padStart(2, '0');
      setModalEndDate(`${ey}-${em}-${ed}`);
    } catch (e) {
      console.error(e);
    }
  };

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
    return sessions.filter(s => s.date === dateStr);
  };

  const daySessions = getSessionsForDate(selectedDate);

  const filteredSessions = sessions.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'today') return s.date === '2026-11-06';
    if (filter === 'recurring') return s.isRecurring;
    return s.status === filter;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cl = clients.find(c => c.id === selectedClientId) || clients[0];
    createOrUpdateSession({
      sessionTitle: sessionTitle || 'Pilates Session',
      startDate: modalDate,
      endDate: modalEndDate,
      time: selectedTime,
      clientId: cl.id,
      clientName: cl.displayName,
      status: 'scheduled',
      selectedDays: selectedDays.length > 0 ? selectedDays : undefined,
      repeatWeeks
    });
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 p-4 pb-28 space-y-4 max-w-xl mx-auto w-full">
      {/* Header Card */}
      <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200/80 dark:border-stone-800 flex items-center justify-between transition-colors">
        <div>
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md">
            RC Pilates Timetable
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Studio Timeslots
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Manage member bookings, recurring schedules &amp; attendance
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Timeslot</span>
        </button>
      </div>

      {/* View Segment Pill */}
      <div className="grid grid-cols-2 gap-2 bg-stone-100 dark:bg-[#1C231E] p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800">
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'calendar'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Studio Calendar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'list'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <List className="w-4 h-4" />
          <span>All Scheduled ({sessions.length})</span>
        </button>
      </div>

      {/* VIEW 1: STUDIO CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Calendar Grid Card */}
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-3">
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
                    setSelectedDate('2026-11-06');
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

            <div className="grid grid-cols-7 gap-1 text-center pt-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-xs font-semibold text-stone-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-11 sm:h-12 rounded-xl" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const monthStr = String(currentMonth + 1).padStart(2, '0');
                const dayStr = String(dayNum).padStart(2, '0');
                const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

                const sessionsOnDay = getSessionsForDate(dateStr);
                const count = sessionsOnDay.length;
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === '2026-11-06';

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`relative h-12 sm:h-13 rounded-2xl flex flex-col items-center justify-center text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-900 text-white shadow-md scale-105 ring-2 ring-emerald-600'
                        : isToday
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-700'
                        : count > 0
                        ? 'bg-[#FAF8F5] dark:bg-[#242D26] text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold mt-0.5 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bookings on Selected Date */}
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                {daySessions.length} Bookings
              </span>
            </div>

            {daySessions.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <PilatesPoseDrawing pose="stretch" className="w-32 h-20 mx-auto text-emerald-800/60 dark:text-emerald-400/60" />
                <p className="text-sm font-bold text-stone-700 dark:text-stone-300">No classes on this day</p>
                <p className="text-xs text-stone-400">Tap "New Timeslot" above to schedule a class.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {daySessions.map(slot => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200/80 dark:border-stone-700 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                            {slot.clientName}
                          </h4>
                          {slot.isRecurring && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                              <Repeat className="w-3 h-3" />
                              <span>Recurring</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-stone-500 mt-0.5">
                          {slot.sessionTitle} • {slot.time}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        {slot.status === 'present' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Present</span>
                          </span>
                        )}
                        {slot.status === 'absent' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                            <XCircle className="w-3 h-3" />
                            <span>Absent</span>
                          </span>
                        )}
                        {slot.status === 'scheduled' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            <Clock className="w-3 h-3" />
                            <span>Scheduled</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-700 text-xs">
                      <div className="flex items-center gap-1 text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>RC Pilates Studio</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateAttendance(slot.id, 'present')}
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                            slot.status === 'present'
                              ? 'bg-emerald-800 text-white'
                              : 'bg-white dark:bg-[#1C231E] border border-emerald-300 text-emerald-900 dark:text-emerald-300'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => updateAttendance(slot.id, 'absent')}
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                            slot.status === 'absent'
                              ? 'bg-rose-700 text-white'
                              : 'bg-white dark:bg-[#1C231E] border border-rose-300 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSession(slot.id)}
                          className="p-1 text-stone-400 hover:text-rose-600"
                          title="Delete slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: ALL SCHEDULED CLASSES */}
      {activeTab === 'list' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'today', label: 'Today' },
              { id: 'recurring', label: 'Recurring' },
              { id: 'present', label: 'Present' },
              { id: 'absent', label: 'Absent' },
              { id: 'scheduled', label: 'Scheduled' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`px-3 py-1.5 rounded-xl capitalize font-bold transition-all whitespace-nowrap ${
                  filter === item.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white dark:bg-[#1C231E] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredSessions.map(slot => (
              <div
                key={slot.id}
                className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      {slot.date}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-1">
                      {slot.clientName}
                    </h4>
                    <p className="text-xs text-stone-500 font-semibold">{slot.sessionTitle}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{slot.time} • RC Pilates Studio</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateAttendance(slot.id, slot.status === 'present' ? 'scheduled' : 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        slot.status === 'present'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {slot.status === 'present' ? 'Present ✓' : 'Check In'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSession(slot.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Timeslot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-stone-200 dark:border-stone-800 animate-in zoom-in-95 text-stone-900 dark:text-stone-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif font-bold text-lg">Schedule New Class</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Member
                </label>
                <select
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] text-stone-900 dark:text-stone-100 font-medium"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.displayName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  required
                  value={sessionTitle}
                  onChange={e => setSessionTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>

              {/* Circular Day-of-Week Picker (Alarm app style) */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Repeat on Days
                </label>
                <DayOfWeekPicker
                  selectedDays={selectedDays}
                  onChange={setSelectedDays}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Starting Date
                  </label>
                  <input
                    type="date"
                    required
                    value={modalDate}
                    onChange={e => {
                      const val = e.target.value;
                      setModalDate(val);
                      updateDatesFromDuration(repeatWeeks, val);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] text-stone-900 dark:text-stone-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Ending Date
                  </label>
                  <input
                    type="date"
                    required
                    value={modalEndDate}
                    min={modalDate}
                    onChange={e => setModalEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] text-stone-900 dark:text-stone-100 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Quick Duration Preset
                  </label>
                  <select
                    value={repeatWeeks}
                    onChange={e => updateDatesFromDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] text-stone-900 dark:text-stone-100 font-semibold"
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
                    value={selectedTime}
                    onChange={setSelectedTime}
                    isInstructor={true}
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 text-white font-bold shadow-md hover:bg-emerald-900"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
