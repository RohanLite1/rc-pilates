import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { StudioLogo } from '../common/StudioLogo';
import {
  CalendarCheck,
  Clock,
  Users,
  Plus,
  Settings,
  LogOut,
  X,
  Shield,
  Apple,
  ChevronRight,
  Sun,
  Moon,
  RefreshCw,
  Calendar
} from 'lucide-react';

export const AppDrawer: React.FC = () => {
  const {
    currentUser,
    isDrawerOpen,
    setIsDrawerOpen,
    instructorActiveView,
    setInstructorActiveView,
    activeTab,
    setActiveTab,
    sessions,
    clients,
    logout
  } = useApp();

  const [isRendered, setIsRendered] = useState<boolean>(isDrawerOpen);
  const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);

  // Smooth open & close animation coordinator
  useEffect(() => {
    if (isDrawerOpen) {
      setIsRendered(true);
      setIsAnimatingOut(false);
    } else if (isRendered) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsAnimatingOut(false);
      }, 240); // Matches drawerSlideOut duration (0.24s)
      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen, isRendered]);

  if (!isRendered || !currentUser) return null;

  const isInstructor = currentUser.role === 'instructor';
  const pendingRequestsCount = sessions.filter(s => s.rescheduleRequest?.status === 'pending').length;
  const pendingFeesCount = clients.filter(c => c.feeRecord?.status === 'pending').length;

  const handleSelectInstructorView = (view: typeof instructorActiveView) => {
    setActiveTab('dashboard');
    setInstructorActiveView(view);
    setIsDrawerOpen(false);
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsDrawerOpen(false);
  };

  // Mobile swipe-left to close drawer gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      // If user swiped left by 45px or more, close drawer with smooth animation
      if (deltaX < -45) {
        setIsDrawerOpen(false);
      }
      touchStartXRef.current = null;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isAnimatingOut ? 'pointer-events-none' : ''
      }`}
    >
      {/* Backdrop with smooth blur and fade */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity ${
          isAnimatingOut ? 'animate-drawer-backdrop-out' : 'animate-drawer-backdrop-in'
        }`}
      />

      {/* Slide-over Menu Panel with hardware-accelerated spring-ease glide */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full max-w-xs bg-[#F9F6F0] dark:bg-[#1C1916] text-[#2D251E] dark:text-[#F7F3ED] h-full shadow-[8px_0_36px_rgba(0,0,0,0.18)] dark:shadow-[8px_0_40px_rgba(0,0,0,0.65)] flex flex-col z-10 border-r border-[#EAE1D4] dark:border-[#383129] ${
          isAnimatingOut ? 'animate-drawer-panel-out' : 'animate-drawer-panel-in'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#EAE1D4] dark:border-[#383129] bg-white/80 dark:bg-[#26211C]/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <StudioLogo size="sm" variant="transparent" withRing className="bg-[#FAF6F0]" />
              <div>
                <span className="font-serif font-bold text-base tracking-tight leading-none block text-[#2D251E] dark:text-[#F7F3ED]">
                  RC Pilates
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  Fitness Studio
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-all duration-200 hover:rotate-90 active:scale-90"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#F2E9DC]/80 dark:bg-[#302A24]/80 border border-[#E6D7C3] dark:border-[#3D352D]">
            <div className="w-7 h-7 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-serif font-bold text-xs">
              {currentUser.role === 'instructor' ? 'RC' : currentUser.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-[#2D251E] dark:text-[#F7F3ED]">{currentUser.displayName}</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                {isInstructor && <Shield className="w-3 h-3" />}
                <span className="capitalize">{currentUser.role}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Drawer Navigation List with gentle cascading entrances */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          {isInstructor ? (
            <>
              <p
                className={`px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                }`}
                style={{ animationDelay: '30ms' }}
              >
                Daily Classes &amp; Attendance
              </p>

              {/* 1. Today's Overview */}
              <button
                type="button"
                onClick={() => handleSelectInstructorView('attendance')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'dashboard' && instructorActiveView === 'attendance'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '60ms' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      activeTab === 'dashboard' && instructorActiveView === 'attendance'
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Today's Overview</p>
                    <p className="text-[11px] opacity-80 font-normal">Morning &amp; evening cards</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* 2. Morning Batches */}
              <button
                type="button"
                onClick={() => handleSelectInstructorView('morning')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'dashboard' && instructorActiveView === 'morning'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '90ms' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      activeTab === 'dashboard' && instructorActiveView === 'morning'
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Morning Batches</p>
                    <p className="text-[11px] opacity-80 font-normal">7:00 AM – 12:00 PM</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* 3. Evening Batches */}
              <button
                type="button"
                onClick={() => handleSelectInstructorView('evening')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'dashboard' && instructorActiveView === 'evening'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '120ms' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      activeTab === 'dashboard' && instructorActiveView === 'evening'
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Evening Batches</p>
                    <p className="text-[11px] opacity-80 font-normal">4:00 PM – 12:00 AM</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <p
                className={`px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                }`}
                style={{ animationDelay: '150ms' }}
              >
                Members &amp; Studio Management
              </p>

              {/* 4. Unified Clients & Fees */}
              <button
                type="button"
                onClick={() => handleSelectTab('clients')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'clients'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '180ms' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      activeTab === 'clients'
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm">Clients &amp; Fees</p>
                      {pendingFeesCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                          {pendingFeesCount} Due
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-80 font-normal">Roster, diets, fee status &amp; schedules</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* 5. Slot Hours & Availability */}
              <button
                type="button"
                onClick={() => handleSelectInstructorView('batches')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'dashboard' && instructorActiveView === 'batches'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '210ms' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      activeTab === 'dashboard' && instructorActiveView === 'batches'
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Slot Hours &amp; Availability</p>
                    <p className="text-[11px] opacity-80 font-normal">Open or close defined hours</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* 6. Schedule New Class */}
              <button
                type="button"
                onClick={() => handleSelectInstructorView('new-slot')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'dashboard' && instructorActiveView === 'new-slot'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '240ms' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      activeTab === 'dashboard' && instructorActiveView === 'new-slot'
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Schedule Class</p>
                    <p className="text-[11px] opacity-80 font-normal">Book client with alarm days</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* 7. Reschedule Requests (Always accessible from burger menu) */}
              <button
                type="button"
                onClick={() => handleSelectInstructorView('requests')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'dashboard' && instructorActiveView === 'requests'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '270ms' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl relative ${
                      activeTab === 'dashboard' && instructorActiveView === 'requests'
                        ? 'bg-white/20 text-white'
                        : pendingRequestsCount > 0
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    {pendingRequestsCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm">Reschedule Requests</p>
                      {pendingRequestsCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                          {pendingRequestsCount} new
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-80 font-normal">
                      {pendingRequestsCount > 0 ? 'Review & accept shifts' : 'No pending shifts'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* 8. Settings */}
              <button
                type="button"
                onClick={() => handleSelectTab('profile')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'profile'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '300ms' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      activeTab === 'profile'
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Studio Settings</p>
                    <p className="text-[11px] opacity-80 font-normal">Profile &amp; studio preferences</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </>
          ) : (
            <>
              <p
                className={`px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                }`}
                style={{ animationDelay: '30ms' }}
              >
                Member Hub
              </p>

              <button
                type="button"
                onClick={() => handleSelectTab('dashboard')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '60ms' }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Class Info</p>
                    <p className="text-[11px] opacity-80 font-normal">Today's session &amp; timeslots</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('diet')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'diet'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '90ms' }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <Apple className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Diet Plan</p>
                    <p className="text-[11px] opacity-80 font-normal">Studio meal rotation &amp; water log</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('schedule')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'schedule'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '120ms' }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Calendar &amp; Reschedule</p>
                    <p className="text-[11px] opacity-80 font-normal">Request slot changes</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('profile')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-left transition-all duration-150 active:scale-[0.98] ${
                  !isAnimatingOut ? 'animate-drawer-item' : ''
                } ${
                  activeTab === 'profile'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                style={{ animationDelay: '150ms' }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Membership &amp; Profile</p>
                    <p className="text-[11px] opacity-80 font-normal">Fee status &amp; physical metrics</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </>
          )}
        </div>

        {/* Drawer Bottom Actions */}
        <div
          className={`p-4 border-t border-stone-200/80 dark:border-stone-800/80 bg-white/60 dark:bg-[#1C231E]/60 space-y-2 ${
            !isAnimatingOut ? 'animate-drawer-item' : ''
          }`}
          style={{ animationDelay: isInstructor ? '330ms' : '180ms' }}
        >
          <button
            type="button"
            onClick={() => {
              setIsDrawerOpen(false);
              logout();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};