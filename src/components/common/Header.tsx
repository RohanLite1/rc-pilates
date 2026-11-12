import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, ChevronDown, Shield, User, Menu } from 'lucide-react';
import { StudioLogo } from './StudioLogo';

export const Header: React.FC = () => {
  const { currentUser, logout, switchUser, instructor, clients, toggleDrawer, isDrawerOpen } = useApp();
  const [showSwitchMenu, setShowSwitchMenu] = useState<boolean>(false);

  if (!currentUser) return null;

  return (
    <header
      className="sticky top-0 z-40 bg-[#F9F6F0]/95 dark:bg-[#1C1916]/95 backdrop-blur-md px-4 pb-3 border-b border-[#EAE1D4] dark:border-[#383129] transition-colors shadow-xs"
      style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top, 0px))' }}
    >
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {/* Left Side: Burger Menu + Studio Branding */}
        <div className="flex items-center gap-2.5">
          {/* Prominent Burger Menu Button with 3-line design and fluid animation */}
          <button
            type="button"
            onClick={toggleDrawer}
            className="p-2 -ml-1 rounded-2xl bg-white dark:bg-[#26211C] hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-center transition-all duration-200 active:scale-90"
            aria-label="Open Studio Navigation Menu"
            title="Menu"
          >
            <Menu
              className={`w-5 h-5 text-emerald-900 dark:text-emerald-300 transition-transform duration-300 ease-out ${
                isDrawerOpen ? 'rotate-90 scale-95' : 'hover:scale-105'
              }`}
            />
          </button>

          {/* Studio Branding */}
          <div className="flex items-center gap-2">
            <StudioLogo size="sm" variant="transparent" withRing className="bg-[#FAF6F0]" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg tracking-tight text-stone-900 dark:text-[#EDF3EC] leading-none">
                  RC Pilates
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/60">
                  Studio
                </span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">Fitness &amp; Reformer</p>
            </div>
          </div>
        </div>

        {/* Profile Pill & Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowSwitchMenu(!showSwitchMenu)}
            className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-white/90 dark:bg-[#26211C]/90 hover:bg-white dark:hover:bg-[#26211C] border border-[#EAE1D4] dark:border-[#383129] shadow-sm transition-all"
          >
            <div className="text-right hidden xs:block">
              <p className="text-xs font-bold text-stone-800 dark:text-stone-200 leading-tight">
                {currentUser.displayName}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold capitalize flex items-center justify-end gap-1">
                {currentUser.role === 'instructor' && <Shield className="w-3 h-3 inline" />}
                {currentUser.role}
              </p>
            </div>
            {currentUser.avatarUrl && currentUser.role !== 'instructor' ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-600/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-serif font-bold text-xs ring-2 ring-emerald-600/20 shadow-xs">
                {currentUser.displayName ? currentUser.displayName.split(' ').map(n => n[0]).join('') : 'RC'}
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 mr-1" />
          </button>

          {/* Quick Dropdown Menu */}
          {showSwitchMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#26211C] rounded-2xl shadow-xl border border-[#EAE1D4] dark:border-[#383129] py-2 z-50 animate-in fade-in zoom-in-95 text-stone-800 dark:text-stone-200">
              <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                <p className="text-[11px] text-stone-400 dark:text-stone-500 font-medium">Logged in as</p>
                <p className="text-xs font-bold text-stone-800 dark:text-stone-100">{currentUser.displayName}</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">{currentUser.email}</p>
              </div>

              <div className="py-1">
                <div className="px-3 py-1 text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Switch Persona
                </div>

                <button
                  onClick={() => {
                    switchUser(instructor);
                    setShowSwitchMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors ${
                    currentUser.role === 'instructor'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span className="flex-1">Radhika Chopra (Instructor)</span>
                  {currentUser.role === 'instructor' && <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Active</span>}
                </button>

                {clients.map(cl => (
                  <button
                    key={cl.id}
                    onClick={() => {
                      switchUser(cl);
                      setShowSwitchMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors ${
                      currentUser.id === cl.id
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span className="flex-1 truncate">{cl.displayName} (Client)</span>
                    {currentUser.id === cl.id && <span className="text-[10px] text-stone-500 dark:text-stone-400">Active</span>}
                  </button>
                ))}
              </div>

              <div className="pt-1 mt-1 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => {
                    setShowSwitchMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
