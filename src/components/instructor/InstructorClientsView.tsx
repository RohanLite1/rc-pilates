import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserProfile } from '../../types';
import { Search, ChevronRight, Plus, ExternalLink, Apple, CreditCard, Send, Check, FileText } from 'lucide-react';
import { InstructorAlignmentDrawing, BotanicalBranchDrawing } from '../common/StudioDrawings';
import { StudioLogo } from '../common/StudioLogo';

interface InstructorClientsViewProps {
  onOpenDossier: (client: UserProfile, initialTab?: 'diet' | 'attendance') => void;
}

export const InstructorClientsView: React.FC<InstructorClientsViewProps> = ({ onOpenDossier }) => {
  const { clients, switchUser, registerUser, updateClientFeeStatus, sendFeeReminder } = useApp();
  const [search, setSearch] = useState<string>('');
  const [showAddClient, setShowAddClient] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [feeToast, setFeeToast] = useState<string>('');

  const filtered = clients.filter(
    c =>
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    registerUser(newName, newEmail, newEmail.split('@')[0], 'client');
    setShowAddClient(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="flex-1 p-4 pb-28 space-y-4 max-w-xl mx-auto w-full">
      {feeToast && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 rounded-2xl border border-emerald-300 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{feeToast}</span>
        </div>
      )}

      {/* Studio Member Header with Artwork */}
      <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200/80 dark:border-stone-800 flex items-center justify-between transition-colors relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StudioLogo size="xs" variant="transparent" />
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md">
              RC Pilates Roster
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Studio Members ({clients.length})
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Manage attendance, profile goals, and custom studio diet plans
          </p>
        </div>

        <button
          onClick={() => setShowAddClient(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0 z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>

        {/* Ambient botanical drawing accent */}
        <BotanicalBranchDrawing className="w-24 h-20 text-emerald-800/10 dark:text-emerald-300/10 absolute -right-2 -bottom-2 pointer-events-none" />
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter members by name or email..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-[#1C231E] border border-stone-200 dark:border-stone-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-700 shadow-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
        />
      </div>

      {/* Clients List Cards */}
      <div className="space-y-3">
        {filtered.map(c => (
          <div
            key={c.id}
            className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all space-y-3.5"
          >
            {/* Top row: Avatar, Name, Tier */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-[#D5C0A4] shadow-xs bg-[#FAF6F0]">
                  <img
                    src={c.avatarUrl}
                    alt={c.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
                      {c.displayName}
                    </h4>
                    <span className="text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                      {c.membershipTier || 'Member'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-0.5 truncate">{c.email}</p>
                  {(c.phone || c.fitnessGoal) && (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {c.phone && (
                        <span className="text-[11px] text-stone-500 font-medium whitespace-nowrap">{c.phone}</span>
                      )}
                      {c.fitnessGoal && (
                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold truncate max-w-full">
                          Goal: {c.fitnessGoal}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 shrink-0 whitespace-nowrap">
                {c.dietPlan?.metrics.dailyIntake || '~1,600 kcal'}
              </span>
            </div>

            {/* Fee Status & Actions Row */}
            {c.feeRecord && (
              <div className="p-3 bg-stone-50 dark:bg-[#242D26] rounded-2xl border border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {c.feeRecord.amount} / mo
                    </span>
                    <span className="text-[11px] text-stone-500 ml-1.5">
                      ({c.feeRecord.status === 'paid' ? `Paid • Next due: ${c.feeRecord.dueDate}` : `Due: ${c.feeRecord.dueDate}`})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const next = c.feeRecord?.status === 'paid' ? 'pending' : 'paid';
                      updateClientFeeStatus(c.id, next);
                      setFeeToast(`Updated ${c.displayName}: Fee ${next === 'paid' ? 'Paid' : 'Due'}`);
                      setTimeout(() => setFeeToast(''), 2500);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                      c.feeRecord.status === 'paid'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300'
                    }`}
                  >
                    {c.feeRecord.status === 'paid' ? 'Fee Paid' : 'Fee Due'}
                  </button>

                  {c.feeRecord.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => {
                        sendFeeReminder(c.id);
                        setFeeToast(`Payment reminder sent to ${c.displayName}!`);
                        setTimeout(() => setFeeToast(''), 2500);
                      }}
                      className="px-2 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Remind</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Diet Plan Summary Chip */}
            <div className="p-3 bg-[#FAF8F5] dark:bg-[#242D26] rounded-2xl border border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-semibold truncate">
                <Apple className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="truncate max-w-[170px] sm:max-w-xs">{c.dietPlan?.planTitle || 'Studio Fat-Loss Plan'}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {c.importedDietPdf ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-emerald-700" />
                    <span>PDF Attached</span>
                  </span>
                ) : (
                  <span className="text-stone-500 font-medium">
                    {c.dietPlan?.metrics.targetWeight || 'Goal: 72 kg'}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons: 3 clean actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-stone-100 dark:border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => switchUser(c)}
                className="py-2.5 px-2 rounded-xl bg-stone-50 dark:bg-[#242D26] hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-bold flex items-center justify-center gap-1.5 transition-colors"
                title="Switch and view app as this client"
              >
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                <span>View as Client</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenDossier(c, 'diet')}
                className="py-2.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-800" />
                <span>Diet &amp; PDF</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenDossier(c, 'attendance')}
                className="py-2.5 px-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <span>Edit Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-8 text-center space-y-3 border border-stone-200 dark:border-stone-800 shadow-ambient">
            <InstructorAlignmentDrawing className="w-28 h-24 mx-auto text-emerald-800/60 dark:text-emerald-400/60" />
            <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              No Studio Members Found
            </h4>
            <p className="text-xs text-stone-500">
              Try adjusting your search query or tap "+ Add Member" to register a new client.
            </p>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-stone-200 dark:border-stone-800 animate-in zoom-in-95 text-stone-900 dark:text-stone-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif font-bold text-lg">Add Studio Member</h3>
              <button
                onClick={() => setShowAddClient(false)}
                className="text-stone-400 hover:text-stone-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Clara Oswald"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="e.g. clara@example.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#242D26] text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClient(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold shadow-md hover:bg-emerald-900"
                >
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};