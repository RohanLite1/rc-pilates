import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserProfile } from '../../types';
import {
  X,
  Search,
  Trash2,
  AlertTriangle,
  Mail,
  Calendar,
  CheckCircle2,
  Users,
  ShieldAlert
} from 'lucide-react';
import { BotanicalBranchDrawing } from '../common/StudioDrawings';

interface ManageClientAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageClientAccountsModal: React.FC<ManageClientAccountsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { clients, deleteClient } = useApp();
  const [search, setSearch] = useState<string>('');
  const [clientToDelete, setClientToDelete] = useState<UserProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  if (!isOpen) return null;

  const filteredClients = clients.filter(
    c =>
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmDelete = () => {
    if (!clientToDelete) return;
    const email = clientToDelete.email;
    const name = clientToDelete.displayName;
    const result = deleteClient(clientToDelete.id);
    setClientToDelete(null);
    setToastMessage(result.message || `Removed ${name} (${email}) from studio database.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F9F6F0] rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-5 pb-4 bg-white border-b border-stone-200/80 flex items-start justify-between relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-200 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Studio Roster Administration
              </span>
              <span className="text-[11px] text-stone-500 font-semibold">
                {clients.length} Registered {clients.length === 1 ? 'Client' : 'Clients'}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D251E] mt-1.5">
              Remove Client Accounts
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Select any client Gmail account below to delete access, bookings, and records.
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

        {/* Success Toast */}
        {toastMessage && (
          <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-4 pb-2 bg-[#F9F6F0]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter clients by name, username or Gmail ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#675137]/30 transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Client Accounts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-serif font-bold text-stone-700 text-sm">No Client Accounts Found</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                {search
                  ? `No registered clients match "${search}". Try checking the spelling or clear the filter.`
                  : 'There are currently no registered client accounts in the studio roster.'}
              </p>
            </div>
          ) : (
            filteredClients.map(client => (
              <div
                key={client.id}
                className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-sm flex items-center justify-between gap-3 hover:border-stone-300 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Client Avatar */}
                  <div className="w-11 h-11 rounded-full bg-[#FAF6F0] border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                    {client.avatarUrl ? (
                      <img
                        src={client.avatarUrl}
                        alt={client.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-serif text-sm font-bold text-[#675137]">
                        {client.displayName
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </span>
                    )}
                  </div>

                  {/* Client Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-xs text-[#2D251E] truncate">
                        {client.displayName}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-medium">
                        @{client.username}
                      </span>
                    </div>

                    {/* Gmail ID Display */}
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[#675137] font-medium truncate">
                      <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                        {client.membershipTier || 'Studio Member'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {client.joinedDate || 'Nov 2026'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete Client Action */}
                <button
                  onClick={() => setClientToDelete(client)}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-sm"
                  title={`Remove ${client.displayName}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            Showing <strong className="text-stone-800">{filteredClients.length}</strong> of{' '}
            <strong className="text-stone-800">{clients.length}</strong> clients
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#2D251E] border border-stone-200 font-bold transition-colors"
          >
            Done
          </button>
        </div>

        {/* Ambient botanical drawing watermark */}
        <BotanicalBranchDrawing className="w-20 h-16 text-emerald-800/5 absolute right-2 bottom-12 pointer-events-none" />

        {/* Delete Confirmation Overlay Dialog */}
        {clientToDelete && (
          <div className="absolute inset-0 z-20 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Delete Client Account?
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-stone-900">{clientToDelete.displayName}</strong>?
                </p>
                <div className="mt-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-center justify-center gap-1.5 font-mono">
                  <Mail className="w-3 h-3 text-stone-400" />
                  <span>{clientToDelete.email}</span>
                </div>
                <p className="text-[11px] text-rose-700 font-semibold mt-2.5 bg-rose-50 p-2 rounded-xl border border-rose-200 flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>All upcoming classes, attendance logs &amp; diet plan will be erased.</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClientToDelete(null)}
                  className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

