import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CreditCard,
  Smartphone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  triggerDemoNotification,
  checkNotificationPermission,
  requestNotificationPermission,
  syncAllStudioReminders
} from '../../services/notificationService';
import { useApp } from '../../context/AppContext';

export const NotificationDemoCard: React.FC = () => {
  const { sessions, clients, currentUser, updateClientConfirmation } = useApp();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    checkNotificationPermission().then(setHasPermission);
  }, []);

  const handleTestClassReminder = async () => {
    setIsPending(true);
    setStatusMessage('Scheduling 45-min class reminder alert...');
    const result = await triggerDemoNotification('class-reminder', 2);
    setIsPending(false);
    setStatusMessage(result.message);
    setHasPermission(true);
  };

  const handleTestFeeReminder = async () => {
    setIsPending(true);
    setStatusMessage('Scheduling fee due reminder alert...');
    const result = await triggerDemoNotification('fee-reminder', 2);
    setIsPending(false);
    setStatusMessage(result.message);
    setHasPermission(true);
  };

  const handleSyncAll = async () => {
    if (!currentUser) return;
    setIsPending(true);
    setStatusMessage('Syncing all studio class & fee alarms with phone...');
    const result = await syncAllStudioReminders(sessions, clients, currentUser);
    setIsPending(false);
    setStatusMessage(
      `Alarms set: ${result.classesScheduled} class reminders (45m prior) & ${result.feesScheduled} fee notices (1d prior).`
    );
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      setStatusMessage('Notification permissions granted on this device!');
    } else {
      setStatusMessage('Permission was denied. Please allow notifications in phone settings.');
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-4 sm:p-5 shadow-ambient border border-stone-200/80 dark:border-stone-800 space-y-3 transition-all">
      {/* Header with expand toggle */}
      <div
        onClick={() => setIsExpanded(prev => !prev)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                Phone Notifications &amp; Reminders
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Android Shade
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              45m class alerts with "Attending / Not attending" buttons &amp; fee dues
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          aria-label="Toggle notifications panel"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="font-medium text-[11px] leading-snug">{statusMessage}</p>
        </div>
      )}

      {/* Permission warning if needed */}
      {hasPermission === false && (
        <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs flex items-center justify-between text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] font-medium">Allow phone notifications</span>
          </div>
          <button
            type="button"
            onClick={handleRequestPermission}
            className="px-2.5 py-1 rounded-xl bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700"
          >
            Enable
          </button>
        </div>
      )}

      {/* Expanded controls & demo showcase */}
      {isExpanded && (
        <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800/80 animate-in fade-in duration-150">
          <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed bg-[#FAF8F5] dark:bg-[#242D26] p-2.5 rounded-2xl border border-stone-100 dark:border-stone-800">
            <Smartphone className="w-3.5 h-3.5 inline mr-1 text-emerald-800 dark:text-emerald-400" />
            <strong>Inbuilt Response Buttons:</strong> When the 45-minute reminder fires, the client gets two interactive buttons right inside Android's notification shade: <strong>"Attending"</strong> or <strong>"Not attending"</strong>. When tapped, the instructor's schedule is updated instantly so she doesn't travel or wait in vain!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Test Button 1: Class Reminder */}
            <button
              type="button"
              disabled={isPending}
              onClick={handleTestClassReminder}
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800 text-left flex items-start gap-2.5 transition-all active:scale-[0.99] disabled:opacity-60"
            >
              <div className="p-1.5 rounded-xl bg-emerald-800 text-white shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-emerald-950 dark:text-emerald-200 text-xs">
                  Trigger Phone Shade Alert
                </p>
                <p className="text-[10px] text-emerald-800/80 dark:text-emerald-400 mt-0.5">
                  Fires alert with "Attending" &amp; "Not attending" in 2s
                </p>
              </div>
            </button>

            {/* Test Button 2: Fee Reminder */}
            <button
              type="button"
              disabled={isPending}
              onClick={handleTestFeeReminder}
              className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-300 dark:border-amber-800 text-left flex items-start gap-2.5 transition-all active:scale-[0.99] disabled:opacity-60"
            >
              <div className="p-1.5 rounded-xl bg-amber-700 text-white shrink-0 mt-0.5">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-amber-950 dark:text-amber-200 text-xs">
                  Trigger Fee Due Alert
                </p>
                <p className="text-[10px] text-amber-800/80 dark:text-amber-400 mt-0.5">
                  Fires 1-day fee notice in phone shade in 2s
                </p>
              </div>
            </button>
          </div>

          {/* Instant Client Response Simulation for Demo */}
          <div className="p-3 rounded-2xl bg-stone-100/80 dark:bg-[#242D26] border border-stone-200/80 dark:border-stone-700 space-y-2">
            <p className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
              Interactive Test: Simulate Client Response
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  updateClientConfirmation('slot-2', 'attending');
                  setStatusMessage('Marcus Reid confirmed "Attending" via notification! Schedule updated.');
                }}
                className="py-2 px-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs"
              >
                <span>✅ Tap "Attending"</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateClientConfirmation('slot-2', 'not_attending');
                  setStatusMessage('Marcus Reid tapped "Not attending"! Instructor alerted in advance.');
                }}
                className="py-2 px-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs"
              >
                <span>❌ Tap "Not attending"</span>
              </button>
            </div>
          </div>

          {/* Sync All Button */}
          <button
            type="button"
            disabled={isPending}
            onClick={handleSyncAll}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            <Bell className="w-3.5 h-3.5 text-stone-500" />
            <span>Schedule All Upcoming Alarms in Background</span>
          </button>
        </div>
      )}
    </div>
  );
};

