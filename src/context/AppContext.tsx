import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserProfile,
  SessionTimeslot,
  AttendanceStatus,
  StudioDietPlan,
  AppTheme,
  StudioBatchSlot
} from '../types';
import {
  INITIAL_INSTRUCTOR,
  INITIAL_CLIENTS,
  INITIAL_TIMESLOTS,
  DEFAULT_STUDIO_DIET_PLAN,
  AVAILABLE_STUDIO_TIMESLOTS,
  INITIAL_BATCH_SLOTS,
  INSTRUCTOR_WHITELISTED_EMAILS
} from '../data/mockData';
import { setupNotificationListeners } from '../services/notificationService';

export interface CreateSessionOptions extends Partial<SessionTimeslot> {
  id?: string;
  isRecurring?: boolean;
  repeatWeeks?: number;
  selectedDays?: number[]; // [0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat]
  startDate?: string;
  endDate?: string;
}

export type InstructorView = 'attendance' | 'morning' | 'evening' | 'requests' | 'roster' | 'new-slot' | 'batches' | 'fees';

interface AppContextType {
  currentUser: UserProfile | null;
  instructor: UserProfile;
  clients: UserProfile[];
  sessions: SessionTimeslot[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (val: boolean) => void;
  selectedClient: UserProfile | null;
  setSelectedClient: (client: UserProfile | null) => void;

  // Burger Menu Drawer State
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;

  // Instructor Focus View
  instructorActiveView: InstructorView;
  setInstructorActiveView: (view: InstructorView) => void;

  // Studio Batches & Timeslot Availability
  batchSlots: StudioBatchSlot[];
  toggleBatchSlotAvailability: (slotId: string) => void;
  setBatchSlotAvailability: (slotId: string, isAvailable: boolean) => void;
  
  // Studio Timeslots (customizable by instructor)
  studioTimeslots: string[];
  addStudioTimeslot: (timeslot: string) => void;
  removeStudioTimeslot: (timeslot: string) => void;

  // Fee Management
  updateClientFeeStatus: (clientId: string, status: 'paid' | 'pending', amount?: string, dueDate?: string) => void;
  sendFeeReminder: (clientId: string) => void;

  // Theme & Appearance
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;

  // Auth
  loginWithGoogle: (email: string, name?: string, avatarUrl?: string) => void;
  loginWithCredentials: (usernameOrEmail: string, password: string) => { success: boolean; error?: string };
  registerUser: (
    name: string,
    email: string,
    username: string,
    role: 'instructor' | 'client',
    extraData?: Partial<UserProfile>
  ) => void;
  completeClientOnboarding: (data: {
    avatarUrl?: string;
    displayName?: string;
    phone?: string;
    height?: string;
    weight?: string;
    age?: string;
    gender?: string;
    fitnessGoal?: string;
    experienceLevel?: string;
    dietaryPreference?: string;
  }) => void;
  logout: () => void;
  switchUser: (user: UserProfile) => void;
  
  // Instructor actions
  updateAttendance: (sessionId: string, status: AttendanceStatus, notes?: string) => void;
  updateClientConfirmation: (sessionId: string, confirmation: 'attending' | 'not_attending') => void;
  createOrUpdateSession: (session: CreateSessionOptions) => void;
  deleteSession: (sessionId: string) => void;
  requestReschedule: (sessionId: string, newDate: string, newTime: string, reason?: string) => void;
  respondToReschedule: (sessionId: string, approve: boolean) => void;
  updateClientDietPlan: (clientId: string, diet: StudioDietPlan) => void;
  importDietPlanPdf: (clientId: string, pdfData?: { fileName: string; fileSize: string; uploadedAt: string; notes?: string; fileUrl?: string } | null) => void;
  addWaterLog: (clientId: string, amountLiters: number) => void;
  refreshState: () => void;
}

const STORAGE_KEY_CLIENTS = 'rc_pilates_clients_v4';
const STORAGE_KEY_SESSIONS = 'rc_pilates_sessions_v4';
const STORAGE_KEY_CURRENT_USER = 'rc_pilates_current_user_v4';
const STORAGE_KEY_THEME = 'rc_pilates_theme_v1';
const STORAGE_KEY_TIMESLOTS = 'rc_pilates_studio_timeslots_v2';
const STORAGE_KEY_BATCH_SLOTS = 'rc_pilates_batch_slots_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [instructor] = useState<UserProfile>(INITIAL_INSTRUCTOR);

  // Burger Menu Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  // Instructor Focus View (Default: 'attendance' - clear & uncluttered)
  const [instructorActiveView, setInstructorActiveView] = useState<InstructorView>('attendance');

  // Studio Batches State (Morning: 7-8, 8-9, 9-10, 10-11, 11-12; Evening: 4-5, 5-6, 6-7, 11-12)
  const [batchSlots, setBatchSlots] = useState<StudioBatchSlot[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BATCH_SLOTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BATCH_SLOTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BATCH_SLOTS, JSON.stringify(batchSlots));
    } catch (e) {
      console.error(e);
    }
  }, [batchSlots]);

  const toggleBatchSlotAvailability = (slotId: string) => {
    setBatchSlots(prev =>
      prev.map(slot => (slot.id === slotId ? { ...slot, isAvailable: !slot.isAvailable } : slot))
    );
  };

  const setBatchSlotAvailability = (slotId: string, isAvailable: boolean) => {
    setBatchSlots(prev =>
      prev.map(slot => (slot.id === slotId ? { ...slot, isAvailable } : slot))
    );
  };

  // Studio Timeslots state (customizable by instructor, visible to clients)
  const [studioTimeslots, setStudioTimeslots] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TIMESLOTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return AVAILABLE_STUDIO_TIMESLOTS;
  });

  // Keep studioTimeslots synced with batchSlots availability
  useEffect(() => {
    const availableBatchSlots = batchSlots.filter(s => s.isAvailable).map(s => s.timeSlot);
    setStudioTimeslots(prev => {
      const batchTimeSlotNames = batchSlots.map(s => s.timeSlot);
      const customSlots = prev.filter(t => !batchTimeSlotNames.includes(t));
      const combined = [...availableBatchSlots, ...customSlots];
      try {
        localStorage.setItem(STORAGE_KEY_TIMESLOTS, JSON.stringify(combined));
      } catch (e) {
        console.error(e);
      }
      return combined;
    });
  }, [batchSlots]);

  const addStudioTimeslot = (newSlot: string) => {
    const trimmed = newSlot.trim();
    if (!trimmed) return;
    setStudioTimeslots(prev => {
      if (prev.includes(trimmed)) return prev;
      const updated = [...prev, trimmed];
      try {
        localStorage.setItem(STORAGE_KEY_TIMESLOTS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const removeStudioTimeslot = (slotToRemove: string) => {
    setStudioTimeslots(prev => {
      const updated = prev.filter(t => t !== slotToRemove);
      try {
        localStorage.setItem(STORAGE_KEY_TIMESLOTS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Clients state
  const [clients, setClients] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLIENTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CLIENTS;
  });

  // Sessions state
  const [sessions, setSessions] = useState<SessionTimeslot[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TIMESLOTS;
  });

  // Current logged in user (defaults to null so user sees the Landing/Login page on first open)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role === 'instructor') {
          return {
            ...parsed,
            displayName: 'Radhika Chopra',
            avatarUrl: '',
            email: 'radhika.instructor@rcpilates.com',
            username: 'radhika_instructor',
            bio: 'Founder & Lead Instructor at RC Pilates & Fitness Studio. Classical & contemporary reformer specialist focused on postural alignment, core restoration, and mindful fitness.'
          };
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Theme: Strict Light Mode per client requirements (Oat Milk & Warm Sand)
  const theme: AppTheme = 'light';
  const setTheme = (_newTheme: AppTheme) => {
    // Permanent light mode
  };

  // Enforce light mode on root element and remove dark classes
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    const metaThemeColor = document.getElementById('theme-color-meta');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#F9F6F0');
    try {
      localStorage.removeItem(STORAGE_KEY_THEME);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<UserProfile | null>(INITIAL_CLIENTS[0]);

  // Persist clients
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.error(e);
    }
  }, [clients]);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error(e);
    }
  }, [sessions]);

  // Persist current user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Keep currentUser in sync if client profile is edited
  useEffect(() => {
    if (currentUser && currentUser.role === 'client') {
      const updated = clients.find(c => c.id === currentUser.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) {
        setCurrentUser(updated);
      }
    }
  }, [clients]);

  // Google Sign-In with Instructor Whitelisting & Profile Photo
  const loginWithGoogle = (email: string, name?: string, avatarUrl?: string) => {
    const cleanEmail = email.toLowerCase().trim();

    // Whitelist check: rohan.sethi12126@gmail.com is granted Master Instructor access
    const isWhitelistedInstructor =
      cleanEmail === 'rohan.sethi12126@gmail.com' ||
      INSTRUCTOR_WHITELISTED_EMAILS.some(e => e.toLowerCase() === cleanEmail) ||
      cleanEmail === INITIAL_INSTRUCTOR.email.toLowerCase();

    if (isWhitelistedInstructor) {
      const instructorUser: UserProfile = {
        ...INITIAL_INSTRUCTOR,
        email: cleanEmail,
        avatarUrl: avatarUrl || INITIAL_INSTRUCTOR.avatarUrl
      };
      setCurrentUser(instructorUser);
      setActiveTab('dashboard');
      return;
    }

    // Check existing clients
    const existingClient = clients.find(c => c.email.toLowerCase() === cleanEmail);
    if (existingClient) {
      const updatedClient =
        avatarUrl && !existingClient.avatarUrl?.startsWith('data:')
          ? { ...existingClient, avatarUrl }
          : existingClient;
      setCurrentUser(updatedClient);
      setActiveTab('dashboard');
      return;
    }

    // Create new client with Google Profile (Onboarding required)
    const clientDisplayName = name || cleanEmail.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    const newClient: UserProfile = {
      id: `client-g-${Date.now()}`,
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      displayName: clientDisplayName,
      role: 'client',
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${cleanEmail}&backgroundColor=eaf0e9`,
      membershipTier: 'Mindful Core 8-Pack (Welcome Tier)',
      joinedDate: 'Nov 2026',
      bio: 'New member connected via Google Account at RC Pilates & Fitness Studio.',
      isOnboarded: false, // triggers the New Client Setup Wizard!
      fitnessGoal: 'Core Strength & Posture',
      experienceLevel: 'Beginner',
      dietaryPreference: 'Vegetarian',
      feeRecord: {
        clientId: `client-g-${Date.now()}`,
        status: 'pending',
        amount: '₹8,500',
        packageTitle: 'Mindful Core 8-Pack (Welcome Tier)',
        dueDate: 'Nov 30, 2026'
      },
      dietPlan: {
        ...DEFAULT_STUDIO_DIET_PLAN,
        id: `diet-${Date.now()}`,
        clientName: clientDisplayName
      }
    };

    const welcomeSession: SessionTimeslot = {
      id: `slot-welcome-${Date.now()}`,
      sessionTitle: 'Reformer Postural Assessment & Induction',
      date: '2026-11-09',
      time: '09:00 AM - 10:00 AM',
      instructorName: 'Radhika Chopra',
      instructorId: 'instructor-1',
      clientId: newClient.id,
      clientName: clientDisplayName,
      status: 'scheduled',
      notes: 'Initial reformer postural alignment & core induction session.'
    };

    setSessions(prev => [welcomeSession, ...prev]);
    setClients(prev => [newClient, ...prev]);
    setCurrentUser(newClient);
    setActiveTab('dashboard');
  };

  // Complete Onboarding for New Client
  const completeClientOnboarding = (data: {
    avatarUrl?: string;
    displayName?: string;
    phone?: string;
    height?: string;
    weight?: string;
    age?: string;
    gender?: string;
    fitnessGoal?: string;
    experienceLevel?: string;
    dietaryPreference?: string;
  }) => {
    if (!currentUser) return;
    const resolvedHeight = data.height || currentUser.height || '165 cm';
    const resolvedWeight = data.weight || currentUser.weight || '60 kg';
    const resolvedAge = data.age || currentUser.age || '28';
    const resolvedGender = data.gender || currentUser.gender || 'Female';

    const updatedUser: UserProfile = {
      ...currentUser,
      avatarUrl: data.avatarUrl || currentUser.avatarUrl,
      displayName: data.displayName || currentUser.displayName,
      phone: data.phone || currentUser.phone || '+91 98000 12345',
      height: resolvedHeight,
      weight: resolvedWeight,
      age: resolvedAge,
      gender: resolvedGender,
      fitnessGoal: data.fitnessGoal || currentUser.fitnessGoal || 'Core Strength & Posture',
      experienceLevel: data.experienceLevel || currentUser.experienceLevel || 'Beginner',
      dietaryPreference: data.dietaryPreference || currentUser.dietaryPreference || 'Vegetarian',
      isOnboarded: true,
      dietPlan: currentUser.dietPlan ? {
        ...currentUser.dietPlan,
        metrics: {
          ...currentUser.dietPlan.metrics,
          heightWeight: `${resolvedHeight} / ${resolvedWeight}`,
          ageSex: `${resolvedAge} / ${resolvedGender}`
        }
      } : undefined
    };

    setCurrentUser(updatedUser);
    setClients(prev => prev.map(c => (c.id === updatedUser.id ? updatedUser : c)));
  };

  // Username and Password Login
  const loginWithCredentials = (usernameOrEmail: string, password: string) => {
    const query = usernameOrEmail.trim().toLowerCase();

    // Check instructor (matches rohan.sethi12126@gmail.com, radhika_instructor, or whitelisted emails)
    const isInstructorMatch =
      query === 'rohan.sethi12126@gmail.com' ||
      query === 'rohan_instructor' ||
      INSTRUCTOR_WHITELISTED_EMAILS.some(e => e.toLowerCase() === query) ||
      query === INITIAL_INSTRUCTOR.username.toLowerCase() ||
      query === INITIAL_INSTRUCTOR.email.toLowerCase() ||
      query === 'radhika' ||
      query === 'radhika_chopra' ||
      query === 'radhika_instructor';

    if (isInstructorMatch && (password === 'password123' || password.length >= 4)) {
      setCurrentUser(INITIAL_INSTRUCTOR);
      setActiveTab('dashboard');
      return { success: true };
    }

    // Check clients
    const client = clients.find(
      c => c.username.toLowerCase() === query || c.email.toLowerCase() === query
    );

    if (client) {
      if (password === 'password123' || password.length >= 4) {
        setCurrentUser(client);
        setActiveTab('dashboard');
        return { success: true };
      }
      return { success: false, error: 'Incorrect password. (Hint: use password123)' };
    }

    return {
      success: false,
      error: 'User not found. Try "radhika_instructor" or "elena_vance", or sign up with a new account.'
    };
  };

  const registerUser = (
    name: string,
    email: string,
    username: string,
    role: 'instructor' | 'client',
    extraData?: Partial<UserProfile>
  ) => {
    const newUser: UserProfile = {
      id: `${role}-${Date.now()}`,
      displayName: name,
      email,
      username,
      role,
      avatarUrl: extraData?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${username}&backgroundColor=f4ece1`,
      membershipTier: role === 'instructor' ? 'Senior Master Instructor' : 'Reformer Unlimited',
      joinedDate: 'Today',
      bio: role === 'instructor' ? 'RC Pilates & Fitness Studio instructor.' : 'Passionate RC Pilates studio member.',
      height: extraData?.height || '165 cm',
      weight: extraData?.weight || '60 kg',
      age: extraData?.age || '28',
      gender: extraData?.gender || 'Female',
      phone: extraData?.phone,
      fitnessGoal: extraData?.fitnessGoal || 'Core Strength & Posture',
      experienceLevel: extraData?.experienceLevel || 'Beginner',
      dietaryPreference: extraData?.dietaryPreference || 'Vegetarian',
      isOnboarded: true,
      dietPlan: {
        ...DEFAULT_STUDIO_DIET_PLAN,
        id: `diet-${Date.now()}`,
        clientName: name,
        metrics: {
          ...DEFAULT_STUDIO_DIET_PLAN.metrics,
          heightWeight: `${extraData?.height || '165 cm'} / ${extraData?.weight || '60 kg'}`,
          ageSex: `${extraData?.age || '28'} / ${extraData?.gender || 'Female'}`
        }
      },
      ...extraData
    };

    if (role === 'client') {
      setClients(prev => [newUser, ...prev]);
    }

    // Only switch currentUser if registering as a self user (not when an instructor adds a member from roster)
    if (!currentUser || currentUser.role !== 'instructor') {
      setCurrentUser(newUser);
      setActiveTab('dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'client') {
      setSelectedClient(user);
    }
    setActiveTab('dashboard');
  };

  // Instructor Attendance update
  const updateAttendance = (sessionId: string, status: AttendanceStatus, notes?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            status,
            markedAt: status === 'scheduled' ? undefined : (s.markedAt || timeStr),
            notes: notes !== undefined ? notes : s.notes
          };
        }
        return s;
      })
    );
  };

  // Client 45-Min Notification Response ("Attending" or "Not attending")
  const updateClientConfirmation = (sessionId: string, confirmation: 'attending' | 'not_attending') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            clientConfirmation: confirmation,
            clientConfirmedAt: `${timeStr} (via notification)`,
            status: confirmation === 'attending' ? 'present' : 'absent',
            notes:
              confirmation === 'not_attending'
                ? 'Client marked "Not attending" on 45m reminder. Instructor notified in advance.'
                : 'Client confirmed "Attending" on 45m reminder.'
          };
        }
        return s;
      })
    );
  };

  // Listen for native Android notification action button taps
  useEffect(() => {
    setupNotificationListeners((sessionId, confirmation) => {
      updateClientConfirmation(sessionId, confirmation);
    });
  }, []);

  // Create or Update Session Timeslot (with Starting Date, Ending Date, Multi-Day Alarm-style & Recurring Classes support)
  const createOrUpdateSession = (sessionData: CreateSessionOptions) => {
    if (sessionData.id) {
      setSessions(prev =>
        prev.map(s => (s.id === sessionData.id ? ({ ...s, ...sessionData } as SessionTimeslot) : s))
      );
      return;
    }

    const baseDate = sessionData.startDate || sessionData.date || new Date().toISOString().split('T')[0];
    const [by, bm, bd] = baseDate.split('-').map(Number);
    const startDay = new Date(by, bm - 1, bd);

    let endDay: Date;
    if (sessionData.endDate) {
      const [ey, em, ed] = sessionData.endDate.split('-').map(Number);
      endDay = new Date(ey, em - 1, ed);
      if (endDay < startDay) {
        endDay = new Date(startDay);
      }
    } else {
      const repeatWeeks = Math.max(1, Math.min(12, sessionData.repeatWeeks || (sessionData.isRecurring ? 4 : 1)));
      endDay = new Date(startDay);
      endDay.setDate(startDay.getDate() + (repeatWeeks * 7 - 1));
    }

    const recurringGroupId = `recgroup-${Date.now()}`;
    const newSessionsToCreate: SessionTimeslot[] = [];
    const diffDays = Math.round((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24));

    // Multi-Day circular alarm-style selection
    if (sessionData.selectedDays && sessionData.selectedDays.length > 0) {
      for (let i = 0; i <= diffDays; i++) {
        const current = new Date(startDay);
        current.setDate(startDay.getDate() + i);
        if (sessionData.selectedDays.includes(current.getDay())) {
          const y = current.getFullYear();
          const m = String(current.getMonth() + 1).padStart(2, '0');
          const d = String(current.getDate()).padStart(2, '0');
          const sessionDate = `${y}-${m}-${d}`;

          newSessionsToCreate.push({
            id: `slot-${Date.now()}-${newSessionsToCreate.length}`,
            sessionTitle: sessionData.sessionTitle || 'Pilates Session',
            date: sessionDate,
            time: sessionData.time || '10:00 AM - 10:55 AM',
            instructorName: INITIAL_INSTRUCTOR.displayName,
            instructorId: INITIAL_INSTRUCTOR.id,
            clientId: sessionData.clientId || clients[0].id,
            clientName: sessionData.clientName || clients[0].displayName,
            status: (sessionData.status as AttendanceStatus) || 'scheduled',
            notes: sessionData.notes || '',
            isRecurring: diffDays > 0,
            recurringPattern: diffDays > 0 ? `Scheduled from ${baseDate} to ${sessionData.endDate || ''}` : undefined,
            recurringGroupId
          });
        }
      }
    } else {
      // Single day or weekly on same day between startDay and endDay
      const isRecurring = diffDays > 0 || !!sessionData.isRecurring;
      const targetDayOfWeek = startDay.getDay();

      for (let i = 0; i <= diffDays; i++) {
        const current = new Date(startDay);
        current.setDate(startDay.getDate() + i);
        if (diffDays === 0 || current.getDay() === targetDayOfWeek) {
          const y = current.getFullYear();
          const m = String(current.getMonth() + 1).padStart(2, '0');
          const d = String(current.getDate()).padStart(2, '0');
          const sessionDate = `${y}-${m}-${d}`;

          newSessionsToCreate.push({
            id: `slot-${Date.now()}-${newSessionsToCreate.length}`,
            sessionTitle: sessionData.sessionTitle || 'Pilates Session',
            date: sessionDate,
            time: sessionData.time || '10:00 AM - 10:55 AM',
            instructorName: INITIAL_INSTRUCTOR.displayName,
            instructorId: INITIAL_INSTRUCTOR.id,
            clientId: sessionData.clientId || clients[0].id,
            clientName: sessionData.clientName || clients[0].displayName,
            status: (sessionData.status as AttendanceStatus) || 'scheduled',
            notes: sessionData.notes || '',
            isRecurring,
            recurringPattern: isRecurring ? `Weekly from ${baseDate} to ${sessionData.endDate || ''}` : undefined,
            recurringGroupId
          });
        }
      }
    }

    if (newSessionsToCreate.length === 0) {
      // Fallback: at least create for startDay if no matching day in range
      newSessionsToCreate.push({
        id: `slot-${Date.now()}-0`,
        sessionTitle: sessionData.sessionTitle || 'Pilates Session',
        date: baseDate,
        time: sessionData.time || '10:00 AM - 10:55 AM',
        instructorName: INITIAL_INSTRUCTOR.displayName,
        instructorId: INITIAL_INSTRUCTOR.id,
        clientId: sessionData.clientId || clients[0].id,
        clientName: sessionData.clientName || clients[0].displayName,
        status: (sessionData.status as AttendanceStatus) || 'scheduled',
        notes: sessionData.notes || ''
      });
    }

    setSessions(prev => [...newSessionsToCreate, ...prev]);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // Client Reschedule Request
  const requestReschedule = (
    sessionId: string,
    newDate: string,
    newTime: string,
    reason?: string
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            status: 'reschedule_requested' as AttendanceStatus,
            rescheduleRequest: {
              requestedDate: newDate,
              requestedTime: newTime,
              clientReason: reason || 'Schedule adjustment requested by member',
              requestedAt: timeStr,
              status: 'pending'
            }
          };
        }
        return s;
      })
    );
  };

  // Instructor Responds to Reschedule Request
  const respondToReschedule = (sessionId: string, approve: boolean) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId && s.rescheduleRequest) {
          if (approve) {
            return {
              ...s,
              date: s.rescheduleRequest.requestedDate,
              time: s.rescheduleRequest.requestedTime,
              status: 'scheduled' as AttendanceStatus,
              rescheduleRequest: {
                ...s.rescheduleRequest,
                status: 'approved'
              },
              notes: `Reschedule approved: moved to ${s.rescheduleRequest.requestedDate} (${s.rescheduleRequest.requestedTime})`
            };
          } else {
            return {
              ...s,
              status: 'scheduled' as AttendanceStatus,
              rescheduleRequest: {
                ...s.rescheduleRequest,
                status: 'declined'
              },
              notes: 'Reschedule request declined: original timeslot maintained.'
            };
          }
        }
        return s;
      })
    );
  };

  // Update Client Studio Diet Plan
  const updateClientDietPlan = (clientId: string, diet: StudioDietPlan) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          return { ...c, dietPlan: diet };
        }
        return c;
      })
    );
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(prev => (prev ? { ...prev, dietPlan: diet } : null));
    }
  };

  // Import Studio Diet Plan from PDF
  const importDietPlanPdf = (
    clientId: string,
    pdfData?: { fileName: string; fileSize: string; uploadedAt: string; notes?: string; fileUrl?: string } | null
  ) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            importedDietPdf: pdfData || undefined
          };
        }
        return c;
      })
    );
    if (currentUser && currentUser.id === clientId) {
      setCurrentUser(prev => (prev ? { ...prev, importedDietPdf: pdfData || undefined } : null));
    }
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(prev => (prev ? { ...prev, importedDietPdf: pdfData || undefined } : null));
    }
  };

  // Fee Management Actions
  const updateClientFeeStatus = (
    clientId: string,
    status: 'paid' | 'pending',
    amount?: string,
    dueDate?: string
  ) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          const existing = c.feeRecord || {
            clientId,
            status: 'paid',
            amount: amount || '₹12,000',
            packageTitle: c.membershipTier || 'Reformer Unlimited',
            dueDate: dueDate || 'Nov 10, 2026'
          };
          return {
            ...c,
            feeRecord: {
              ...existing,
              status,
              amount: amount || existing.amount,
              dueDate: dueDate || existing.dueDate,
              lastPaidDate:
                status === 'paid'
                  ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : existing.lastPaidDate
            }
          };
        }
        return c;
      })
    );
  };

  const sendFeeReminder = (clientId: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId && c.feeRecord) {
          return {
            ...c,
            feeRecord: {
              ...c.feeRecord,
              lastReminderSent: `Today at ${nowStr}`
            }
          };
        }
        return c;
      })
    );
  };

  // Water log
  const addWaterLog = (clientId: string, amountLiters: number) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId && c.dietPlan) {
          const newAmount = Math.max(0, Math.min(6, +(c.dietPlan.currentWaterLiters + amountLiters).toFixed(2)));
          return {
            ...c,
            dietPlan: { ...c.dietPlan, currentWaterLiters: newAmount }
          };
        }
        return c;
      })
    );
  };

  const refreshState = () => {
    localStorage.removeItem(STORAGE_KEY_CLIENTS);
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    localStorage.removeItem(STORAGE_KEY_THEME);
    localStorage.removeItem(STORAGE_KEY_BATCH_SLOTS);
    localStorage.removeItem(STORAGE_KEY_TIMESLOTS);
    setClients(INITIAL_CLIENTS);
    setSessions(INITIAL_TIMESLOTS);
    setBatchSlots(INITIAL_BATCH_SLOTS);
    setStudioTimeslots(AVAILABLE_STUDIO_TIMESLOTS);
    setCurrentUser(INITIAL_INSTRUCTOR);
    setSelectedClient(INITIAL_CLIENTS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        instructor,
        clients,
        sessions,
        activeTab,
        setActiveTab,
        isDeviceFrame,
        setIsDeviceFrame,
        selectedClient,
        setSelectedClient,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer,
        instructorActiveView,
        setInstructorActiveView,
        batchSlots,
        toggleBatchSlotAvailability,
        setBatchSlotAvailability,
        studioTimeslots,
        addStudioTimeslot,
        removeStudioTimeslot,
        updateClientFeeStatus,
        sendFeeReminder,
        theme,
        setTheme,
        loginWithGoogle,
        loginWithCredentials,
        registerUser,
        completeClientOnboarding,
        logout,
        switchUser,
        updateAttendance,
        updateClientConfirmation,
        createOrUpdateSession,
        deleteSession,
        requestReschedule,
        respondToReschedule,
        updateClientDietPlan,
        importDietPlanPdf,
        addWaterLog,
        refreshState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
