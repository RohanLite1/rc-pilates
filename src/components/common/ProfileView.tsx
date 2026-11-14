import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  ShieldCheck,
  UserX,
  ChevronRight,
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
import { ManageClientAccountsModal } from '../instructor/ManageClientAccountsModal';
import { InstructorWhitelistModal } from '../instructor/InstructorWhitelistModal';

export const ProfileView: React.FC = () => {
  const { currentUser, clients, instructorWhitelist, logout } = useApp();
  const [showManageClients, setShowManageClients] = useState<boolean>(false);
  const [showWhitelist, setShowWhitelist] = useState<boolean>(false);

  if (!currentUser) return null;

  const isInstructor = currentUser.role === 'instructor';

  return (
    <div className="flex-1 p-4 pb-24 space-y-4">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-ambient border border-stone-200/80 text-center relative overflow-hidden transition-colors">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 p-1 bg-stone-100 ring-4 ring-[#675137]/20 flex items-center justify-center">
          {currentUser.avatarUrl && currentUser.role !== 'instructor' ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : currentUser.role === 'instructor' ? (
            <StudioLogo size="2xl" variant="transparent" className="w-full h-full p-1 bg-[#FAF6F0]" />
          ) : (
            <div className="w-full h-full rounded-full bg-[#675137] text-white flex items-center justify-center font-serif text-2xl font-bold tracking-wider shadow-inner">
              {currentUser.displayName ? currentUser.displayName.split(' ').map(n => n[0]).join('') : 'RC'}
            </div>
          )}
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#2D251E] leading-tight">
          {currentUser.displayName}
        </h2>
        <p className="text-xs text-stone-500 font-medium">@{currentUser.username}</p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2E9DC] text-[#675137] border border-[#D5C0A4] text-xs font-semibold mt-3">
          {currentUser.role === 'instructor' ? (
            <Shield className="w-3.5 h-3.5 text-[#675137]" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#675137]" />
          )}
          <span>{currentUser.membershipTier || 'Studio Member'}</span>
        </div>

        {currentUser.bio && (
          <p className="text-xs text-stone-600 italic mt-3 max-w-sm mx-auto leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-stone-100">
            "{currentUser.bio}"
          </p>
        )}

        {/* Botanical watermark */}
        <BotanicalBranchDrawing className="w-24 h-20 text-[#675137]/10 absolute -right-2 -bottom-2 pointer-events-none" />
      </div>

      {/* Instructor Studio Controls (The Two Requested Settings Features) */}
      {isInstructor && (
        <div className="bg-white rounded-3xl p-5 shadow-ambient border border-stone-200/80 space-y-3.5 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#EADCC9] text-[#675137] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#2D251E]">
                  Studio Instructor Administration
                </h3>
                <p className="text-xs text-stone-500">
                  Client deletion &amp; instructor access whitelisting
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#675137] border border-[#D5C0A4]">
              Instructor Admin
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-1">
            {/* Option 1: Remove Clients Gmail IDs / Accounts Button */}
            <button
              type="button"
              onClick={() => setShowManageClients(true)}
              className="w-full p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-stone-200 text-left flex items-center justify-between group transition-all active:scale-[0.99] shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 shadow-inner">
                  <UserX className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2D251E] group-hover:text-rose-800 transition-colors">
                      Remove Client Accounts
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {clients.length} Registered
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 truncate">
                    Inspect and delete client Gmail accounts, sessions &amp; records
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors shrink-0 ml-2" />
            </button>

            {/* Option 2: Whitelist Instructor Feature Button */}
            <button
              type="button"
              onClick={() => setShowWhitelist(true)}
              className="w-full p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-stone-200 text-left flex items-center justify-between group transition-all active:scale-[0.99] shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2D251E] group-hover:text-emerald-900 transition-colors">
                      Instructor Access Whitelist
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {instructorWhitelist.length} Whitelisted
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 truncate">
                    Add Gmail IDs that automatically log in as Instructors
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors shrink-0 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Native Notifications & Alarms Demo */}
      <NotificationDemoCard />

      {/* Member Physical Profile & Wellness Metrics */}
      <div className="bg-white rounded-3xl p-5 shadow-ambient border border-stone-200/80 space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#EADCC9] text-[#675137] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#2D251E]">
                Physical Metrics &amp; Setup
              </h3>
              <p className="text-xs text-stone-500">
                Tailored body stats &amp; reformer alignment
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F2E9DC] text-[#675137] border border-[#D5C0A4]">
            Verified
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center gap-2.5">
            <Ruler className="w-4 h-4 text-[#675137] shrink-0" />
            <div>
              <p className="text-[10px] text-stone-500 font-semibold">Height</p>
              <p className="text-xs font-bold text-[#2D251E]">{currentUser.height || '165 cm'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-[#675137] shrink-0" />
            <div>
              <p className="text-[10px] text-stone-500 font-semibold">Weight</p>
              <p className="text-xs font-bold text-[#2D251E]">{currentUser.weight || '58 kg'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#675137] shrink-0" />
            <div>
              <p className="text-[10px] text-stone-500 font-semibold">Age</p>
              <p className="text-xs font-bold text-[#2D251E]">{currentUser.age ? `${currentUser.age} yrs` : '29 yrs'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#675137] shrink-0" />
            <div>
              <p className="text-[10px] text-stone-500 font-semibold">Gender</p>
              <p className="text-xs font-bold text-[#2D251E]">{currentUser.gender || 'Female'}</p>
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
          <CheckCircle2 className="w-4 h-4 text-[#675137] shrink-0" />
        </div>
      </div>

      {/* Client Membership & Fee Details (Clients only) */}
      {!isInstructor && currentUser.feeRecord && (
        <div className="bg-white rounded-3xl p-5 shadow-ambient border border-stone-200/80 space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#EADCC9] text-[#675137] flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#2D251E]">
                Membership &amp; Fee Status
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                currentUser.feeRecord.status === 'paid'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {currentUser.feeRecord.status === 'paid' ? 'Paid' : 'Payment Due'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-100">
              <span className="text-stone-600">Package / Plan</span>
              <span className="font-bold text-[#2D251E]">{currentUser.feeRecord.packageTitle}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-100">
              <span className="text-stone-600">Plan Amount</span>
              <span className="font-bold text-[#2D251E]">
                {currentUser.feeRecord.amount.startsWith('₹') ? currentUser.feeRecord.amount : `₹${currentUser.feeRecord.amount}`}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-100">
              <span className="text-stone-600">Next Due Date</span>
              <span className="font-bold text-[#2D251E]">{currentUser.feeRecord.dueDate}</span>
            </div>

            {currentUser.feeRecord.lastPaidDate && (
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-100">
                <span className="text-stone-600">Last Cleared On</span>
                <span className="font-semibold text-[#2D251E]">{currentUser.feeRecord.lastPaidDate}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Details Card */}
      <div className="bg-white rounded-3xl p-5 shadow-ambient border border-stone-200/80 space-y-3 transition-colors">
        <h3 className="font-serif font-bold text-sm text-[#2D251E]">
          Account Information
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-100">
            <div className="flex items-center gap-2 text-stone-600">
              <Mail className="w-4 h-4 text-stone-400" />
              <span>Email / Gmail Account</span>
            </div>
            <span className="font-semibold text-[#2D251E] font-mono">{currentUser.email}</span>
          </div>

          {currentUser.phone && (
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-100">
              <div className="flex items-center gap-2 text-stone-600">
                <Phone className="w-4 h-4 text-stone-400" />
                <span>Contact Phone</span>
              </div>
              <span className="font-semibold text-[#2D251E]">{currentUser.phone}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-100">
            <div className="flex items-center gap-2 text-stone-600">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>Member Since</span>
            </div>
            <span className="font-semibold text-[#2D251E]">{currentUser.joinedDate}</span>
          </div>
        </div>
      </div>

      {/* Studio Location & Contact */}
      <div className="bg-white rounded-3xl p-5 shadow-ambient border border-stone-200/80 flex items-center gap-4 text-xs transition-colors">
        <StudioLogo size="lg" variant="transparent" withRing className="bg-[#FAF6F0]" />
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-sm text-[#2D251E]">
            RC Pilates &amp; Fitness Studio
          </h3>
          <p className="text-stone-600 leading-relaxed text-[11px]">
            Estd 2025 • Classical &amp; contemporary reformer training, posture correction, and tailored nutrition.
          </p>
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={logout}
        className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out of RC Pilates</span>
      </button>

      {/* Modals for Instructor Studio Administration */}
      {showManageClients && (
        <ManageClientAccountsModal
          isOpen={showManageClients}
          onClose={() => setShowManageClients(false)}
        />
      )}

      {showWhitelist && (
        <InstructorWhitelistModal
          isOpen={showWhitelist}
          onClose={() => setShowWhitelist(false)}
        />
      )}
    </div>
  );
};
