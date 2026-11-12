import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ClientFeeRecord } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Search,
  Shield,
  Calendar,
  Send
} from 'lucide-react';

interface InstructorFeesViewProps {
  onBackToAttendance: () => void;
}

export const InstructorFeesView: React.FC<InstructorFeesViewProps> = ({
  onBackToAttendance
}) => {
  const { clients, updateClientFeeStatus, sendFeeReminder } = useApp();

  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const paidCount = clients.filter(c => c.feeRecord?.status === 'paid').length;
  const pendingCount = clients.filter(c => c.feeRecord?.status === 'pending').length;

  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    return c.feeRecord?.status === filter;
  });

  const handleToggleFeeStatus = (clientId: string, currentStatus?: 'paid' | 'pending') => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    updateClientFeeStatus(clientId, newStatus);
    const client = clients.find(c => c.id === clientId);
    setToastMessage(`Updated ${client?.displayName || 'client'} to: ${newStatus === 'paid' ? 'Fee Paid' : 'Fee Pending'}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSendReminder = (clientId: string, clientName: string) => {
    sendFeeReminder(clientId);
    setToastMessage(`Gentle payment reminder sent to ${clientName}!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Navigation & Return */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToAttendance}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Attendance</span>
        </button>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>Fee Records</span>
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200/80 dark:border-stone-800 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
              Client Fee Management
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Track monthly studio packages, mark dues as paid, and send reminders.
            </p>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-center">
          <div className="bg-[#FAF8F5] dark:bg-[#242D26] p-2.5 rounded-2xl border border-stone-100 dark:border-stone-700/60">
            <p className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">{clients.length}</p>
            <p className="text-[11px] font-semibold text-stone-500">Members</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <p className="text-xl font-serif font-bold text-emerald-700 dark:text-emerald-300">{paidCount}</p>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Fees Paid</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/60 p-2.5 rounded-2xl border border-amber-200 dark:border-amber-800">
            <p className="text-xl font-serif font-bold text-amber-700 dark:text-amber-300">{pendingCount}</p>
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">Pending Dues</p>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 rounded-2xl text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search member by name..."
            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#1C231E] border border-stone-200 dark:border-stone-800 rounded-2xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="flex bg-stone-100 dark:bg-[#1C231E] p-1 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('paid')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'paid'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Paid
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'pending'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Client Fee Cards */}
      <div className="space-y-3">
        {filteredClients.map(client => {
          const fee: ClientFeeRecord = client.feeRecord || {
            clientId: client.id,
            status: 'paid',
            amount: '₹12,000',
            packageTitle: client.membershipTier || 'Reformer Unlimited',
            dueDate: 'Nov 10, 2026',
            lastPaidDate: 'Oct 28, 2026'
          };
          const isPaid = fee.status === 'paid';

          return (
            <div
              key={client.id}
              className="bg-white dark:bg-[#1C231E] rounded-3xl p-4 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={client.avatarUrl}
                    alt={client.displayName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-600/20 shrink-0"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {client.displayName}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">{client.email}</p>
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-0.5">
                      {fee.packageTitle} • <span className="font-bold">{fee.amount.startsWith('₹') ? fee.amount : `₹${fee.amount}`}/mo</span>
                    </p>
                  </div>
                </div>

                <div>
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Fee Paid</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Pending Due</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Fee Date & Reminder Metadata */}
              <div className="p-3 bg-[#FAF8F5] dark:bg-[#242D26] rounded-2xl border border-stone-100 dark:border-stone-800 text-xs flex items-center justify-between text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    {isPaid
                      ? `Paid on: ${fee.lastPaidDate || 'Oct 28, 2026'}`
                      : `Due Date: ${fee.dueDate || 'Nov 10, 2026'}`}
                  </span>
                </div>

                {fee.lastReminderSent ? (
                  <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    Reminder: {fee.lastReminderSent}
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-400">No reminder sent yet</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleToggleFeeStatus(client.id, fee.status)}
                  className={`py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                    isPaid
                      ? 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isPaid ? 'Mark as Pending' : 'Mark as Paid'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendReminder(client.id, client.displayName)}
                  className="py-2.5 px-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reminder</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
