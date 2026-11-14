import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  checkNotificationPermission,
  requestNotificationPermission,
  syncAllStudioReminders
} from '../../services/notificationService';
import { useApp } from '../../context/AppContext';

export const NotificationDemoCard: React.FC = () => {
  const { sessions, clients, currentUser } = useApp();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    checkNotificationPermission().then(granted => {
      setHasPermission(granted);
    });
  }, []);

  const handleEnableNotifications = async () => {
    setIsPending(true);
    setStatusMessage('');
    try {
      const granted = await requestNotificationPermission();
      setHasPermission(granted);
      if (granted) {
        setStatusMessage('Studio notifications and class reminders active.');
        if (currentUser) {
          syncAllStudioReminders(sessions, clients, currentUser).catch(() => {});
        }
      } else {
        setStatusMessage('Notifications denied. Please allow notifications in device or browser settings.');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-ambient border border-stone-200/80 space-y-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#F2E9DC] text-[#675137] flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif font-bold text-sm text-[#2D251E] truncate">
              Studio Notifications &amp; Reminders
            </h3>
            <p className="text-xs text-stone-500 truncate">
              Class alerts (45m prior) &amp; renewal notices
            </p>
          </div>
        </div>

        {hasPermission ? (
          <button
            type="button"
            disabled
            className="px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-default select-none shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Enabled</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={handleEnableNotifications}
            className="px-3.5 py-2 rounded-2xl bg-[#675137] hover:bg-[#52402B] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{isPending ? 'Enabling...' : 'Enable Notifications'}</span>
          </button>
        )}
      </div>

      {hasPermission ? (
        <div className="text-[11px] text-stone-600 bg-[#FAF8F5] p-3 rounded-2xl border border-stone-100 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Class reminder alerts (45 mins prior) and fee notices are active on this device.</span>
        </div>
      ) : statusMessage ? (
        <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-2xl border border-amber-200 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      ) : (
        <p className="text-[11px] text-stone-500 leading-relaxed">
          Enable notifications to receive timely session alerts and quick attendance confirmations before your classes.
        </p>
      )}
    </div>
  );
};

export const NotificationCard = NotificationDemoCard;
