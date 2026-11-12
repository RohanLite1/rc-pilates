import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Mail,
  Phone,
  Calendar,
  LogOut,
  Sparkles,
  CreditCard,
  Scale,
  Ruler,
  Activity,
  Palette,
  CheckCircle2
} from 'lucide-react';
import { BotanicalBranchDrawing } from './StudioDrawings';
import { NotificationDemoCard } from './NotificationDemoCard';
import { StudioLogo } from './StudioLogo';

export const ProfileView: React.FC = () => {
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  return (
    <div className="flex-1 p-4 pb-24 space-y-4">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-ambient border border-stone-200/80 text-center relative overflow-hidden transition-colors">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 p-1 bg-stone-100 ring-4 ring-emerald-600/10 flex items-center justify-center">
          {currentUser.avatarUrl && currentUser.role !== 'instructor' ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : currentUser.role === 'instructor' ? (
            <StudioLogo size="2xl" variant="transparent" className="w-full h-full p-1 bg-[#FAF6F0]" />
          ) : (
            <div className="w-full h-full rounded-full bg-emerald-800 text-white flex items-center justify-center font-serif text-2xl font-bold tracking-wider shadow-inner">
              {currentUser.displayName ? currentUser.displayName.split(' ').map(n => n[0]).join('') : 'RC'}
            </div>
          )}
        </div>

        <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight">
          {currentUser.displayName}
        </h2>
        <p className="text-xs text-stone-500 font-medium">@{currentUser.username}</p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold mt-3">
          {currentUser.role === 'instructor' ? (
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          )}
          <span>{currentUser.membershipTier || 'Studio Member'}</span>
        </div>

        {currentUser.bio && (
          <p className="text-xs text-stone-600 italic mt-3 max-w-sm mx-auto leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-stone-100">
            "{currentUser.bio}"
          </p>
        )}

        {/* Botanical watermark */}
        <BotanicalBranchDrawing className="w-24 h-20 text-emerald-800/10 absolute -right-2 -bottom-2 pointer-events-none" />
      </div>

      {/* Native Notifications & Alarms Demo */}
      <NotificationDemoCard />

      {/* Member Physical Profile & Wellness Metrics */}
      <div className="bg-white rounded-3xl p-5 shadow-ambient border border-stone-200/80 space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Physical Metrics &amp; Setup
              </h3>
              <p className="text-xs text-stone-500">
                Tailored body stats &amp; reformer alignment
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Verified
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center gap-2.5">
            <Ruler className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <p className="text-[10px] text-stone-500 font-semibold">Height</p>
              <p className="text-xs font-bold text-stone-900">{currentUser.height || '165 cm'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <p className="text-[10px] text-stone-500 font-semibold">Weight</p>
              <p className="text-xs font-bold text-stone-900">{currentUser.weight || '58 kg'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <p className="text-[10px] text-stone-500 font-semibold">Age</p>
              <p className="text-xs font-bold text-stone-900">{currentUser.age ? `${currentUser.age} yrs` : '29 yrs'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <p className="text-[10px] text-stone-500 font-semibold">Gender</p>
              <p className="text-xs font-bold text-stone-900">{currentUser.gender || 'Female'}</p>
            </div>
          </div>
        </div>

        {/* Studio Signature Palette Tag */}
        <div className="p-3 rounded-2xl bg-[#F6F1EA] border border-[#E3D7C7] flex items-center gap-2.5">
          <Palette className="w-4 h-4 text-[#7B6244] shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#4A3B2C]">Studio Palette: Oat Milk &amp; Warm Sand</p>
            <p className="text-[10px] text-[#786B5D]">Permanent light aesthetic curated for mindful studio focus</p>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
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
      <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200/80 dark:border-stone-800 flex items-center gap-4 text-xs transition-colors">
        <StudioLogo size="lg" variant="transparent" withRing className="bg-[#FAF6F0]" />
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
            RC Pilates &amp; Fitness Studio
          </h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-[11px]">
            Estd 2025 • Classical &amp; contemporary reformer training, posture correction, and tailored nutrition.
          </p>
        </div>
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
