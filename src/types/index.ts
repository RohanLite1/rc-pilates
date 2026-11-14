export type UserRole = 'instructor' | 'client';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'scheduled' | 'excused' | 'reschedule_requested';

export type AppTheme = 'system' | 'light' | 'dark';

export interface RescheduleRequest {
  requestedDate: string;
  requestedTime: string;
  clientReason?: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'declined';
}

export interface DietProfileMetrics {
  ageSex: string; // e.g. "52 / Female"
  heightWeight: string; // e.g. "5'7\" / 80 kg"
  targetWeight: string; // e.g. "Goal 72 kg"
  estimatedBMI: string; // e.g. "27.6"
  estimatedMaintenance: string; // e.g. "~1,900–2,000 kcal/day"
  dailyIntake: string; // e.g. "~1,600 kcal/day"
  dailyIntakeNote?: string; // e.g. "NOT a 1,600-kcal deficit"
  proteinTarget: string; // e.g. "~90–105 g/day"
  fibreTarget: string; // e.g. "~25–30 g/day"
  constraints: string; // e.g. "Egg-free + wheat-free"
  teaSugarAllowance?: string; // e.g. "2 sweetened teas/day"
  activity: string; // e.g. "Pilates ~5–6 pm + walking"
}

export interface DietMealSlot {
  id: string;
  time: string; // e.g. "8:00 AM"
  mealName: string; // e.g. "Breakfast", "Tea 1", "Lunch", "Tea 2 + snack", "Dinner"
  foodDescription: string; // e.g. "2 moong-dal chillas from ~70 g dry dal + 100 g curd + vegetables"
  caloriesKcal: number; // e.g. 390
}

export interface DietDayPlan {
  dayNumber: number; // 1 to 7
  dayLabel: string; // "Day 1", "Day 2", etc.
  focusTag?: string; // e.g. "Moong Dal Chilla & High Protein"
  totalCalories: number; // e.g. 1580
  meals: DietMealSlot[];
}

export interface DietStrategyRules {
  safetyBoundary: string;
  specialRules: string;
  stepsTarget: string;
  pilatesTarget: string;
  waterTarget: string;
  oilAllowance: string;
  fruitAllowance: string;
  saltGuideline: string;
  sleepTarget: string;
  trackingGuideline: string;
  medicalDisclaimer: string;
}

export interface StudioDietPlan {
  id: string;
  planTitle: string; // e.g. "SHORT-TERM MAXIMUM-SAFE FAT-LOSS PLAN"
  clientName: string;
  assignedDate: string;
  status: 'active' | 'archived';
  metrics: DietProfileMetrics;
  strategy: DietStrategyRules;
  days: DietDayPlan[];
  currentWaterLiters: number;
  instructorNotes: string;
}

export interface SessionTimeslot {
  id: string;
  sessionTitle: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "08:30 AM - 09:25 AM"
  room?: string;
  apparatus?: string;
  instructorName: string;
  instructorId: string;
  clientId: string;
  clientName: string;
  status: AttendanceStatus;
  markedAt?: string;
  notes?: string;
  rescheduleRequest?: RescheduleRequest;
  clientConfirmation?: 'attending' | 'not_attending';
  clientConfirmedAt?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  recurringGroupId?: string;
}

export interface ClientFeeRecord {
  clientId: string;
  status: 'paid' | 'pending';
  amount: string; // e.g. "₹6,000" or "₹16,000"
  packageTitle: string; // e.g. "1 Month Studio Package" or "3 Month Studio Package"
  dueDate: string; // e.g. "Dec 14, 2026"
  startDate?: string;
  endDate?: string;
  selectedDays?: number[]; // [0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat]
  lastPaidDate?: string; // e.g. "Oct 10, 2026"
  lastReminderSent?: string; // e.g. "Today, 10:30 AM"
  notes?: string;
}

export interface StudioBatchSlot {
  id: string;
  timeSlot: string; // e.g. "08:00 AM - 09:00 AM"
  category: 'morning' | 'evening';
  isAvailable: boolean;
  label?: string; // e.g. "Early Morning Flow"
}

export interface ImportedDietPdf {
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  notes?: string;
  fileUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  height?: string;
  weight?: string;
  age?: string;
  gender?: string;
  membershipTier?: 'Reformer Unlimited' | 'Private Duet' | 'Mindful Core 8-Pack' | 'Senior Master Instructor' | 'Founder & Master Instructor' | string;
  bio?: string;
  dietPlan?: StudioDietPlan;
  importedDietPdf?: ImportedDietPdf;
  feeRecord?: ClientFeeRecord;
  joinedDate: string;
  startDate?: string;
  endDate?: string;
  preferredTimeSlot?: string;
  selectedDays?: number[]; // e.g. [1, 2, 3, 4, 5] for Mon-Fri
  isExistingCustomer?: boolean;
  fitnessGoal?: string;
  experienceLevel?: string;
  dietaryPreference?: string;
  isOnboarded?: boolean;
}
