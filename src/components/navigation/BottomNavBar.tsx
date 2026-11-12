import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Users,
  Calendar,
  Apple,
  Settings,
  LayoutDashboard,
  User
} from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, setInstructorActiveView } = useApp();

  if (!currentUser) return null;

  const isInstructor = currentUser.role === 'instructor';

  const instructorTabs = [
    { id: 'dashboard', label: "Today's Classes", icon: CalendarCheck },
    { id: 'clients', label: 'Clients & Fees', icon: Users },
    { id: 'profile', label: 'Settings', icon: Settings }
  ];

  const clientTabs = [
    { id: 'dashboard', label: 'Class Info', icon: LayoutDashboard },
    { id: 'diet', label: 'Diet Plan', icon: Apple },
    { id: 'schedule', label: 'Calendar', icon: Calendar },
    { id: 'profile', label: 'Settings', icon: User }
  ];

  const tabs = isInstructor ? instructorTabs : clientTabs;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1C231E]/95 backdrop-blur-lg border-t border-stone-200/90 dark:border-stone-800 px-3 pt-2 shadow-lg transition-colors"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'dashboard' && isInstructor) {
                  setInstructorActiveView('attendance');
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-900 dark:text-emerald-300 font-semibold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 scale-105' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1 tracking-tight font-semibold">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-emerald-800 dark:bg-emerald-400 absolute -bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
