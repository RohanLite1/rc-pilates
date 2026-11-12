import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, X, Clock } from 'lucide-react';

interface InAppNotificationData {
  title: string;
  body: string;
  type: 'class-reminder' | 'fee-reminder';
  sessionId?: string;
  instructorName?: string;
  time?: string;
}

export const InAppNotificationBanner: React.FC = () => {
  const { updateClientConfirmation } = useApp();
  const [notification, setNotification] = useState<InAppNotificationData | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent<InAppNotificationData>;
      if (customEvent.detail) {
        setNotification(customEvent.detail);
        setFeedback(null);
        setIsClosing(false);
      }
    };

    window.addEventListener('rc-in-app-notification', handleNotification);
    return () => {
      window.removeEventListener('rc-in-app-notification', handleNotification);
    };
  }, []);

  if (!notification) return null;

  const handleAction = (choice: 'attending' | 'not_attending') => {
    const targetSessionId = notification.sessionId || 'slot-2';
    updateClientConfirmation(targetSessionId, choice);

    if (choice === 'attending') {
      setFeedback('Confirmed! You are marked attending. See you at the studio!');
    } else {
      setFeedback('Noted! Instructor Radhika has been notified in advance.');
    }

    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setNotification(null);
      setFeedback(null);
      setIsClosing(false);
    }, 300);
  };

  const isClassReminder = notification.type === 'class-reminder';

  return (
    <div
      className={`fixed top-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-[9998] transition-all duration-300 transform ${
        isClosing ? '-translate-y-8 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'
      }`}
      style={{ top: 'calc(0.75rem + env(safe-area-inset-top, 0px))' }}
    >
      <div className="bg-[#FAF6F0] rounded-3xl p-4 shadow-[0_12px_40px_rgba(90,70,50,0.18)] border border-[#D5C0A4] text-[#2D251E] space-y-3 backdrop-blur-md">
        {/* Banner Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#675137] text-white flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-xs">
              RC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-sm tracking-tight text-[#2D251E] leading-tight">
                  RC Pilates Studio
                </span>
                <span className="text-[10px] font-semibold text-[#7B6244] bg-[#F2E9DC] px-1.5 py-0.2 rounded-md">
                  iOS Alert
                </span>
              </div>
              <p className="text-[11px] text-[#786B5D] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#A68B69]" />
                <span>Starts at {notification.time || '08:00 AM'} with Radhika</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-full text-[#A68B69] hover:text-[#2D251E] hover:bg-[#F2E9DC] transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Banner Message */}
        <p className="text-xs text-[#2D251E] leading-relaxed font-normal bg-white/70 p-2.5 rounded-2xl border border-[#EAE1D4]">
          {notification.body}
        </p>

        {/* Feedback message if user responded */}
        {feedback ? (
          <div className="p-2.5 rounded-2xl bg-[#EEF4EE] border border-[#C5D8C6] text-xs font-bold text-[#3B663F] flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#477B4C] shrink-0" />
            <span>{feedback}</span>
          </div>
        ) : (
          /* Interactive Action Buttons ("Attending" and "Not attending") */
          isClassReminder && (
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleAction('attending')}
                className="py-2.5 px-3 rounded-2xl bg-[#675137] hover:bg-[#52402B] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 duration-150"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E6D7C3]" />
                <span>Attending</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('not_attending')}
                className="py-2.5 px-3 rounded-2xl bg-[#FBF2F1] hover:bg-[#F5E5E3] text-[#A85A52] border border-[#EED4D2] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 duration-150"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Not attending</span>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
