import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Mail,
  Phone,
  Calendar,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Check,
  CreditCard
} from 'lucide-react';
import type { AppTheme } from '../../types';
import { BotanicalBranchDrawing } from './StudioDrawings';
import { NotificationDemoCard } from './NotificationDemoCard';

export const ProfileView: React.FC = () => {
  const { currentUser, logout, theme, setTheme } = useApp();

  if (!currentUser) return null;

  const themeOptions: { id: AppTheme; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'system',
      label: 'System Theme',
      desc: 'Automatically matches your device OS setting',
      icon: Laptop
    },
    {
      id: 'light',
      label: 'Light Mode',
      desc: 'Serene warm ambient cream & sage',
      icon: Sun
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      desc: 'Ambient dark forest & slate for evening ease',
      icon: Moon
    }
  ];

  return (
    <div className="flex-1 p-4 pb-24 space-y-4">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-6 shadow-ambient border border-stone-200/80 dark:border-stone-800 text-center relative overflow-hidden transition-colors">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 p-1 bg-stone-100 dark:bg-stone-800 ring-4 ring-emerald-600/10 flex items-center justify-center">
          {currentUser.avatarUrl && currentUser.role !== 'instructor' ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-emerald-800 text-white flex items-center justify-center font-serif text-2xl font-bold tracking-wider shadow-inner">
              {currentUser.displayName ? currentUser.displayName.split(' ').map(n => n[0]).join('') : 'RC'}
            </div>
          )}
        </div>

        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
          {currentUser.displayName}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">@{currentUser.username}</p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mt-3">
          {currentUser.role === 'instructor' ? (
            <Shield className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          )}
          <span>{currentUser.membershipTier || 'Studio Member'}</span>
        </div>

        {currentUser.bio && (
          <p className="text-xs text-stone-600 dark:text-stone-300 italic mt-3 max-w-sm mx-auto leading-relaxed bg-[#FAF8F5] dark:bg-[#242D26] p-3 rounded-2xl border border-stone-100 dark:border-stone-800">
            "{currentUser.bio}"
          </p>
        )}

        {/* Botanical watermark */}
        <BotanicalBranchDrawing className="w-24 h-20 text-emerald-800/10 dark:text-emerald-300/10 absolute -right-2 -bottom-2 pointer-events-none" />
      </div>

      {/* Native Notifications & Alarms Demo */}
      <NotificationDemoCard />

      {/* Appearance & Dark Mode Settings Card */}
      <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200/80 dark:border-stone-800 space-y-3 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Appearance &amp; Theme
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Customize how RC Pilates looks on your device
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 pt-1">
          {themeOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-600 shadow-xs'
                    : 'bg-[#FAF8F5] dark:bg-[#242D26] border-stone-200/70 dark:border-stone-800 hover:bg-stone-100/60 dark:hover:bg-stone-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'bg-white dark:bg-[#1C231E] text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold leading-tight ${
                        isSelected
                          ? 'text-emerald-950 dark:text-emerald-200'
                          : 'text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {opt.label}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{opt.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-emerald-800 border-emerald-800 text-white'
                      : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-[#1C231E]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Client Membership & Fee Details */}
      {currentUser.role === 'client' && currentUser.feeRecord && (
        <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200/80 dark:border-stone-800 space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                Membership &amp; Fee Status
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                currentUser.feeRecord.status === 'paid'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300'
              }`}
            >
              {currentUser.feeRecord.status === 'paid' ? 'Paid' : 'Payment Due'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-100 dark:border-stone-800">
              <span className="text-stone-600 dark:text-stone-400">Package / Plan</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">{currentUser.feeRecord.packageTitle}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-100 dark:border-stone-800">
              <span className="text-stone-600 dark:text-stone-400">Plan Amount</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">
                {currentUser.feeRecord.amount.startsWith('₹') ? currentUser.feeRecord.amount : `₹${currentUser.feeRecord.amount}`}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-100 dark:border-stone-800">
              <span className="text-stone-600 dark:text-stone-400">Next Due Date</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">{currentUser.feeRecord.dueDate}</span>
            </div>

            {currentUser.feeRecord.lastPaidDate && (
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-100 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">Last Cleared On</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">{currentUser.feeRecord.lastPaidDate}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Details Card */}
      <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200/80 dark:border-stone-800 space-y-3 transition-colors">
        <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
          Account Information
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
              <Mail className="w-4 h-4 text-stone-400" />
              <span>Email / Account</span>
            </div>
            <span className="font-semibold text-stone-900 dark:text-stone-100">{currentUser.email}</span>
          </div>

          {currentUser.phone && (
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Phone className="w-4 h-4 text-stone-400" />
                <span>Contact Phone</span>
              </div>
              <span className="font-semibold text-stone-900 dark:text-stone-100">{currentUser.phone}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>Member Since</span>
            </div>
            <span className="font-semibold text-stone-900 dark:text-stone-100">{currentUser.joinedDate}</span>
          </div>
        </div>
      </div>

      {/* Studio Location & Contact */}
      <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200/80 dark:border-stone-800 space-y-2 text-xs transition-colors">
        <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
          RC Pilates &amp; Fitness Studio
        </h3>
        <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-[11px]">
          Classical &amp; contemporary reformer training, posture correction, and tailored nutrition.
        </p>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={logout}
        className="w-full py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-semibold text-xs border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out of RC Pilates</span>
      </button>
    </div>
  );
};
