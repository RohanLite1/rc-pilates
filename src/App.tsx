import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNavBar } from './components/navigation/BottomNavBar';
import { AppDrawer } from './components/navigation/AppDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { ClientDashboard } from './components/client/ClientDashboard';
import { ClientDietView } from './components/client/ClientDietView';
import { ClientScheduleView } from './components/client/ClientScheduleView';
import { ClientOnboardingModal } from './components/client/ClientOnboardingModal';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { InstructorClientsView } from './components/instructor/InstructorClientsView';
import { InstructorScheduleView } from './components/instructor/InstructorScheduleView';
import { ClientDossierModal } from './components/instructor/ClientDossierModal';
import { ProfileView } from './components/common/ProfileView';
import { StartupAnimation } from './components/common/StartupAnimation';
import { InAppNotificationBanner } from './components/common/InAppNotificationBanner';
import type { UserProfile } from './types';
import { initializeNotificationChannels, requestNotificationPermission } from './services/notificationService';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    isDrawerOpen,
    setIsDrawerOpen,
    instructorActiveView,
    setInstructorActiveView
  } = useApp();

  const [dossierClient, setDossierClient] = useState<UserProfile | null>(null);
  const [dossierInitialTab, setDossierInitialTab] = useState<'diet' | 'attendance'>('diet');

  // Prompt notification access ONLY when app starts
  useEffect(() => {
    requestNotificationPermission().then(() => {
      initializeNotificationChannels();
    });
  }, []);

  const isInstructor = currentUser?.role === 'instructor';

  // Hardware & Phone Back Navigation Handling
  useEffect(() => {
    const handleBackStep = () => {
      // 1. If Drawer is open, close it
      if (isDrawerOpen) {
        setIsDrawerOpen(false);
        return true;
      }

      // 2. If Client Dossier modal is open, close it
      if (dossierClient) {
        setDossierClient(null);
        return true;
      }

      // 3. For Instructor:
      if (isInstructor) {
        // If inside a sub-window (e.g. 'morning', 'evening', 'new-slot', etc.), return to 'attendance' (Today's Classes)
        if (instructorActiveView !== 'attendance') {
          setInstructorActiveView('attendance');
          return true;
        }

        // If on another tab (e.g. 'clients', 'profile', 'schedule'), return to 'dashboard'
        if (activeTab !== 'dashboard') {
          setActiveTab('dashboard');
          return true;
        }

        // Already on root overview
        return false;
      }

      // 4. For Client:
      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
        return true;
      }

      return false;
    };

    // A. Native Capacitor Android Hardware Back Button
    let capBackListener: any = null;
    if (Capacitor.isNativePlatform()) {
      CapApp.addListener('backButton', () => {
        const handled = handleBackStep();
        if (!handled) {
          // If already at root screen and nothing left to go back to, exit app
          CapApp.exitApp();
        }
      }).then(listener => {
        capBackListener = listener;
      });
    }

    // B. Web / Mobile Browser History PopState (Swiping back in browser)
    const handlePopState = () => {
      handleBackStep();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (capBackListener) {
        capBackListener.remove();
      }
    };
  }, [
    isDrawerOpen,
    dossierClient,
    isInstructor,
    instructorActiveView,
    activeTab,
    setIsDrawerOpen,
    setInstructorActiveView,
    setActiveTab
  ]);

  // Keep browser history in sync with in-app sub-views so swipe-back works on mobile web too
  useEffect(() => {
    const isRoot =
      activeTab === 'dashboard' &&
      (!isInstructor || instructorActiveView === 'attendance') &&
      !isDrawerOpen &&
      !dossierClient;

    if (!isRoot) {
      window.history.pushState(
        { tab: activeTab, view: instructorActiveView, drawer: isDrawerOpen, dossier: !!dossierClient },
        ''
      );
    }
  }, [activeTab, instructorActiveView, isDrawerOpen, dossierClient, isInstructor]);

  // When not logged in, render the full-screen Landing & Login Page directly
  if (!currentUser) {
    return <LoginModal />;
  }

  const handleOpenDossier = (client: UserProfile, initialTab: 'diet' | 'attendance' = 'diet') => {
    setDossierClient(client);
    setDossierInitialTab(initialTab);
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F6F0] text-[#2D251E] flex flex-col relative select-none transition-colors duration-200">
      {/* Top Header with studio brand and quick persona switcher */}
      <Header />

      {/* Navigation Drawer Menu (Burger Menu) */}
      <AppDrawer />

      {/* Main Tab Viewport with smooth Crossfade Transition */}
      <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto overflow-x-hidden">
        <div key={activeTab} className="flex-1 flex flex-col animate-tab-fade w-full">
          {isInstructor ? (
            <>
              {activeTab === 'dashboard' && (
                <InstructorDashboard
                  onOpenClientDossier={handleOpenDossier}
                />
              )}
              {activeTab === 'clients' && (
                <InstructorClientsView
                  onOpenDossier={handleOpenDossier}
                />
              )}
              {activeTab === 'schedule' && <InstructorScheduleView />}
              {activeTab === 'profile' && <ProfileView />}
            </>
          ) : (
            <>
              {activeTab === 'dashboard' && <ClientDashboard />}
              {activeTab === 'diet' && <ClientDietView />}
              {activeTab === 'schedule' && <ClientScheduleView />}
              {activeTab === 'profile' && <ProfileView />}
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />

      {/* New Client Onboarding & Setup Wizard (Appears for any new client on first login) */}
      <ClientOnboardingModal />

      {/* Instructor's Client Dossier Modal (Diet Plan & Schedule Editor) */}
      {dossierClient && (
        <ClientDossierModal
          client={dossierClient}
          initialTab={dossierInitialTab}
          onClose={() => setDossierClient(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <StartupAnimation />
      <InAppNotificationBanner />
      <MainAppContent />
    </AppProvider>
  );
}
