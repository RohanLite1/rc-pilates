import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Shield,
  ShieldCheck,
  Plus,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { BotanicalBranchDrawing } from '../common/StudioDrawings';

interface InstructorWhitelistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructorWhitelistModal: React.FC<InstructorWhitelistModalProps> = ({
  isOpen,
  onClose
}) => {
  const { instructorWhitelist, addInstructorWhitelist, removeInstructorWhitelist } = useApp();
  const [newEmail, setNewEmail] = useState<string>('');
  const [emailToRemove, setEmailToRemove] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  if (!isOpen) return null;

  const handleAddWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const result = addInstructorWhitelist(newEmail.trim());
    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setNewEmail('');
    } else {
      setFeedback({ type: 'error', message: result.message });
    }

    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const handleConfirmRemove = () => {
    if (!emailToRemove) return;
    const result = removeInstructorWhitelist(emailToRemove);
    setEmailToRemove(null);
    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const isProtectedAdmin = (email: string) => {
    const clean = email.toLowerCase().trim();
    return clean === 'rohan.sethi12126@gmail.com' || clean === 'radhika.instructor@rcpilates.com';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F9F6F0] rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-5 pb-4 bg-white border-b border-stone-200/80 flex items-start justify-between relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Instructor Whitelist Access
              </span>
              <span className="text-[11px] text-stone-500 font-semibold">
                {instructorWhitelist.length} Whitelisted
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D251E] mt-1.5">
              Instructor Whitelist Feature
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Any whitelisted Gmail ID signs in directly with Instructor privileges (not as a client).
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Guidance Banner */}
        <div className="mx-4 mt-4 p-3.5 bg-[#FAF6F0] border border-[#D5C0A4] rounded-2xl flex items-start gap-3">
          <Info className="w-4 h-4 text-[#675137] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#2D251E] leading-relaxed">
            <strong>How it works:</strong> When an instructor adds a Gmail ID here, that user will bypass
            the member onboarding wizard. Upon logging in with Google, they are immediately granted full
            access to Today's Classes, Studio Batches, Member Diet Plans, and Settings.
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mx-4 mt-3 p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            )}
            <span className="flex-1">{feedback.message}</span>
          </div>
        )}

        {/* Add Instructor Gmail Form */}
        <form onSubmit={handleAddWhitelist} className="p-4 bg-white border-b border-stone-200/80 mt-3 space-y-2">
          <label className="block text-xs font-bold text-[#2D251E] flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-[#675137]" />
            <span>Add New Instructor Gmail</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="email"
                required
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="e.g. instructor.priya@gmail.com"
                className="w-full pl-10 pr-3 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-2xl text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#675137]/30 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-[#675137] hover:bg-[#52402b] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Whitelist</span>
            </button>
          </div>
        </form>

        {/* Whitelisted Instructors Roster */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#2D251E]">
              Authorized Instructor Accounts ({instructorWhitelist.length})
            </span>
            <span className="text-[10px] text-stone-500 font-semibold">
              Instant Instructor Privileges
            </span>
          </div>

          {instructorWhitelist.map(email => {
            const isProtected = isProtectedAdmin(email);
            const isRohan = email.toLowerCase().includes('rohan');
            const isRadhika = email.toLowerCase().includes('radhika');

            return (
              <div
                key={email}
                className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-sm flex items-center justify-between gap-3 hover:border-stone-300 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isProtected
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {isProtected ? (
                      <Lock className="w-4 h-4 text-amber-700" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-xs text-[#2D251E] truncate font-mono">
                      {email}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isRohan
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : isRadhika
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {isRohan
                          ? 'Lead Studio Owner'
                          : isRadhika
                          ? 'Founder & Lead Instructor'
                          : 'Certified Instructor'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Whitelisted
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove Action (Disabled for primary studio admins) */}
                {isProtected ? (
                  <span
                    className="text-[10px] font-semibold text-stone-400 bg-stone-100 px-2.5 py-1 rounded-lg shrink-0 cursor-not-allowed"
                    title="Primary Studio Administrator cannot be removed"
                  >
                    Protected
                  </span>
                ) : (
                  <button
                    onClick={() => setEmailToRemove(email)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all active:scale-95 shrink-0"
                    title={`Remove ${email} from whitelist`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#675137]" />
            <span>Changes take effect on their next login</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#2D251E] border border-stone-200 font-bold transition-colors"
          >
            Done
          </button>
        </div>

        {/* Ambient botanical drawing accent */}
        <BotanicalBranchDrawing className="w-20 h-16 text-emerald-800/5 absolute right-2 bottom-12 pointer-events-none" />

        {/* Removal Confirmation Overlay Dialog */}
        {emailToRemove && (
          <div className="absolute inset-0 z-20 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Revoke Instructor Whitelist?
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Are you sure you want to remove <strong className="text-stone-900">{emailToRemove}</strong> from the instructor whitelist?
                </p>
                <p className="text-[11px] text-stone-500 mt-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  On their next sign-in, this account will no longer have instructor privileges and will be treated as a standard member.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEmailToRemove(null)}
                  className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRemove}
                  className="py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
