import type { UserProfile, SessionTimeslot, StudioDietPlan, StudioBatchSlot } from '../types';

export const DEFAULT_STUDIO_DIET_PLAN: StudioDietPlan = {
  id: 'diet-plan-sandeep-1600',
  planTitle: 'Short-Term Maximum Safe Fat-Loss Plan',
  clientName: 'Sandeep Kaur',
  assignedDate: 'Nov 2026',
  status: 'active',
  metrics: {
    ageSex: '52 / Female',
    heightWeight: '5\'7" / 80 kg',
    targetWeight: 'Goal 72 kg',
    estimatedBMI: '27.6',
    estimatedMaintenance: '~1,900–2,000 kcal/day',
    dailyIntake: '~1,600 kcal/day',
    dailyIntakeNote: 'NOT a 1,600-kcal deficit (controlled healthy reduction)',
    proteinTarget: '~90–105 g/day',
    fibreTarget: '~25–30 g/day',
    constraints: 'Egg-free + wheat-free',
    teaSugarAllowance: '2 sweetened teas/day (~1 tsp sugar each)',
    activity: 'Pilates ~5–6 pm + walking'
  },
  strategy: {
    safetyBoundary: 'I am not making this a starvation/crash diet. This is the most aggressive short-term version I would use from the available information: about 1,600 kcal/day. Very-low-calorie diets around 800 kcal/day require medical supervision, and rapid loss can increase gallstone risk.',
    specialRules: 'No cheat days, no sugary drinks/juice, no alcohol, no dehydration, no all-day fasting. Keep the two daily teas with ~1 tsp sugar each, exclude wheat and eggs, and keep protein high.',
    stepsTarget: 'Aim 8,000–10,000/day if comfortable; increase gradually.',
    pilatesTarget: 'Keep the 5–6 pm session; do not add punishing cardio.',
    waterTarget: '2–2.5 L/day; never restrict water for a lower scale number.',
    oilAllowance: 'Measure cooking oil; roughly 3–4 tsp/day across meals.',
    fruitAllowance: '1–2 whole portions/day; no juice.',
    saltGuideline: 'Keep intake consistent; avoid very salty restaurant/fried meals in the final week.',
    sleepTarget: 'Aim for 7+ hours.',
    trackingGuideline: 'Use 3–4 morning weigh-ins/week and compare the weekly average.',
    medicalDisclaimer: 'Do not alter thyroid medication for weight loss; medication/TSH should be managed by her clinician. Educational meal-planning template; not a medical prescription.'
  },
  currentWaterLiters: 1.8,
  instructorNotes: 'Stick strictly to your 7-day rotation. Bring your water bottle to afternoon reformer class and ensure adequate hydration before starting.',
  days: [
    {
      dayNumber: 1,
      dayLabel: 'Day 1',
      focusTag: 'Moong Dal Chilla & High Protein',
      totalCalories: 1580,
      meals: [
        {
          id: 'd1-m1',
          time: '8:00 AM',
          mealName: 'Breakfast',
          foodDescription: '2 moong-dal chillas from ~70 g dry dal + 100 g curd + vegetables',
          caloriesKcal: 390
        },
        {
          id: 'd1-m2',
          time: '10:30 AM',
          mealName: 'Tea 1',
          foodDescription: '150 ml milk tea + 1 tsp sugar',
          caloriesKcal: 80
        },
        {
          id: 'd1-m3',
          time: '1:00 PM',
          mealName: 'Lunch',
          foodDescription: '120 g chicken + 100 g cooked dal + 100 g cooked rice + large salad',
          caloriesKcal: 500
        },
        {
          id: 'd1-m4',
          time: '4:00 PM',
          mealName: 'Tea 2 + snack',
          foodDescription: 'Tea + 1 tsp sugar + 15 g roasted chana',
          caloriesKcal: 140
        },
        {
          id: 'd1-m5',
          time: '7:30 PM',
          mealName: 'Dinner',
          foodDescription: '150 g tofu/lower-fat paneer + 250 g vegetables + 100 g curd',
          caloriesKcal: 470
        }
      ]
    },
    {
      dayNumber: 2,
      dayLabel: 'Day 2',
      focusTag: 'Vegetable Poha & Besan Chilla',
      totalCalories: 1580,
      meals: [
        {
          id: 'd2-m1',
          time: '8:00 AM',
          mealName: 'Breakfast',
          foodDescription: '220 g cooked vegetable poha + 150 g Greek yogurt/curd',
          caloriesKcal: 390
        },
        {
          id: 'd2-m2',
          time: '10:30 AM',
          mealName: 'Tea 1',
          foodDescription: '150 ml milk tea + 1 tsp sugar',
          caloriesKcal: 80
        },
        {
          id: 'd2-m3',
          time: '1:00 PM',
          mealName: 'Lunch',
          foodDescription: '150 g fish/chicken + 120 g cooked rice + 250 g vegetables + salad',
          caloriesKcal: 500
        },
        {
          id: 'd2-m4',
          time: '4:00 PM',
          mealName: 'Tea 2 + snack',
          foodDescription: 'Tea + 1 tsp sugar + 15 g makhana',
          caloriesKcal: 130
        },
        {
          id: 'd2-m5',
          time: '7:30 PM',
          mealName: 'Dinner',
          foodDescription: '2 besan chillas from ~70 g besan + 150 g curd + vegetables',
          caloriesKcal: 480
        }
      ]
    },
    {
      dayNumber: 3,
      dayLabel: 'Day 3',
      focusTag: 'Rajma & Besan Chilla Balance',
      totalCalories: 1580,
      meals: [
        {
          id: 'd3-m1',
          time: '8:00 AM',
          mealName: 'Breakfast',
          foodDescription: '2 besan chillas from ~70 g besan + 100 g curd + chutney',
          caloriesKcal: 390
        },
        {
          id: 'd3-m2',
          time: '10:30 AM',
          mealName: 'Tea 1',
          foodDescription: '150 ml milk tea + 1 tsp sugar',
          caloriesKcal: 80
        },
        {
          id: 'd3-m3',
          time: '1:00 PM',
          mealName: 'Lunch',
          foodDescription: '160 g cooked rajma + 100 g cooked rice + 250 g vegetables + 100 g curd',
          caloriesKcal: 500
        },
        {
          id: 'd3-m4',
          time: '4:00 PM',
          mealName: 'Tea 2 + snack',
          foodDescription: 'Tea + 1 tsp sugar + 15 g roasted chana',
          caloriesKcal: 140
        },
        {
          id: 'd3-m5',
          time: '7:30 PM',
          mealName: 'Dinner',
          foodDescription: '150 g chicken/tofu + 250–300 g vegetables + 100 g curd',
          caloriesKcal: 470
        }
      ]
    },
    {
      dayNumber: 4,
      dayLabel: 'Day 4',
      focusTag: 'Fresh Fruit & Lean Protein',
      totalCalories: 1580,
      meals: [
        {
          id: 'd4-m1',
          time: '8:00 AM',
          mealName: 'Breakfast',
          foodDescription: '2 moong chillas + 150 g Greek yogurt/curd + vegetables',
          caloriesKcal: 400
        },
        {
          id: 'd4-m2',
          time: '10:30 AM',
          mealName: 'Tea 1',
          foodDescription: '150 ml milk tea + 1 tsp sugar',
          caloriesKcal: 80
        },
        {
          id: 'd4-m3',
          time: '1:00 PM',
          mealName: 'Lunch',
          foodDescription: '150 g chicken + 100 g cooked dal + 100 g cooked rice + salad',
          caloriesKcal: 500
        },
        {
          id: 'd4-m4',
          time: '4:00 PM',
          mealName: 'Tea 2 + snack',
          foodDescription: 'Tea + 1 tsp sugar + 1 small apple/guava',
          caloriesKcal: 150
        },
        {
          id: 'd4-m5',
          time: '7:30 PM',
          mealName: 'Dinner',
          foodDescription: '150 g tofu/lower-fat paneer + 300 g vegetables + 100 g curd',
          caloriesKcal: 450
        }
      ]
    },
    {
      dayNumber: 5,
      dayLabel: 'Day 5',
      focusTag: 'Vegetable Upma & Chole Rice',
      totalCalories: 1590,
      meals: [
        {
          id: 'd5-m1',
          time: '8:00 AM',
          mealName: 'Breakfast',
          foodDescription: '220 g cooked vegetable upma + 150 g curd + 10 g peanuts',
          caloriesKcal: 400
        },
        {
          id: 'd5-m2',
          time: '10:30 AM',
          mealName: 'Tea 1',
          foodDescription: '150 ml milk tea + 1 tsp sugar',
          caloriesKcal: 80
        },
        {
          id: 'd5-m3',
          time: '1:00 PM',
          mealName: 'Lunch',
          foodDescription: '160 g cooked chole + 100 g cooked rice + 250 g vegetables/salad',
          caloriesKcal: 500
        },
        {
          id: 'd5-m4',
          time: '4:00 PM',
          mealName: 'Tea 2 + snack',
          foodDescription: 'Tea + 1 tsp sugar + 15 g makhana',
          caloriesKcal: 130
        },
        {
          id: 'd5-m5',
          time: '7:30 PM',
          mealName: 'Dinner',
          foodDescription: '150 g fish/chicken/tofu + 250–300 g vegetables + 100 g curd',
          caloriesKcal: 480
        }
      ]
    },
    {
      dayNumber: 6,
      dayLabel: 'Day 6',
      focusTag: 'Millet Roti & Roasted Chana',
      totalCalories: 1580,
      meals: [
        {
          id: 'd6-m1',
          time: '8:00 AM',
          mealName: 'Breakfast',
          foodDescription: '2 besan chillas + 150 g curd + vegetables',
          caloriesKcal: 390
        },
        {
          id: 'd6-m2',
          time: '10:30 AM',
          mealName: 'Tea 1',
          foodDescription: '150 ml milk tea + 1 tsp sugar',
          caloriesKcal: 80
        },
        {
          id: 'd6-m3',
          time: '1:00 PM',
          mealName: 'Lunch',
          foodDescription: '150 g chicken/fish + 1 small millet roti + 100 g cooked dal + salad',
          caloriesKcal: 500
        },
        {
          id: 'd6-m4',
          time: '4:00 PM',
          mealName: 'Tea 2 + snack',
          foodDescription: 'Tea + 1 tsp sugar + 15 g roasted chana',
          caloriesKcal: 140
        },
        {
          id: 'd6-m5',
          time: '7:30 PM',
          mealName: 'Dinner',
          foodDescription: '150 g tofu/lower-fat paneer + 250 g vegetables + 150 g curd',
          caloriesKcal: 470
        }
      ]
    },
    {
      dayNumber: 7,
      dayLabel: 'Day 7',
      focusTag: 'Poha & Chilla Weekend Reset',
      totalCalories: 1570,
      meals: [
        {
          id: 'd7-m1',
          time: '8:00 AM',
          mealName: 'Breakfast',
          foodDescription: '220 g cooked vegetable poha + 150 g Greek yogurt/curd',
          caloriesKcal: 390
        },
        {
          id: 'd7-m2',
          time: '10:30 AM',
          mealName: 'Tea 1',
          foodDescription: '150 ml milk tea + 1 tsp sugar',
          caloriesKcal: 80
        },
        {
          id: 'd7-m3',
          time: '1:00 PM',
          mealName: 'Lunch',
          foodDescription: '150 g fish/chicken + 120 g cooked rice + 250 g vegetables + salad',
          caloriesKcal: 500
        },
        {
          id: 'd7-m4',
          time: '4:00 PM',
          mealName: 'Tea 2 + snack',
          foodDescription: 'Tea + 1 tsp sugar + 1 small apple/guava',
          caloriesKcal: 150
        },
        {
          id: 'd7-m5',
          time: '7:30 PM',
          mealName: 'Dinner',
          foodDescription: '2 moong/besan chillas + 150 g curd + 250 g vegetables',
          caloriesKcal: 470
        }
      ]
    }
  ]
};

export const INSTRUCTOR_WHITELISTED_EMAILS = [
  'rohan.sethi12126@gmail.com',
  'radhika.instructor@rcpilates.com',
  'radhika@rcpilates.com'
];

export const INITIAL_INSTRUCTOR: UserProfile = {
  id: 'instructor-1',
  email: 'rohan.sethi12126@gmail.com',
  username: 'rohan_instructor',
  displayName: 'Radhika Chopra',
  role: 'instructor',
  avatarUrl: '',
  phone: '+91 98765 43210',
  membershipTier: 'Founder & Master Instructor',
  bio: 'Founder & Lead Instructor at RC Pilates & Fitness Studio. Classical & contemporary reformer specialist focused on postural alignment, core restoration, and mindful fitness.',
  joinedDate: 'Jan 2021',
  isOnboarded: true
};

export const INITIAL_CLIENTS: UserProfile[] = [
  {
    id: 'client-1',
    email: 'elena.vance@gmail.com',
    username: 'elena_vance',
    displayName: 'Elena Vance',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 341-9921',
    membershipTier: 'Reformer Unlimited',
    bio: 'Balancing corporate work with deep core stabilization & spine decompression.',
    joinedDate: 'Mar 2024',
    isOnboarded: true,
    fitnessGoal: 'Postural Alignment & Deep Core',
    experienceLevel: 'Intermediate',
    dietaryPreference: 'High Protein / Balanced',
    feeRecord: {
      clientId: 'client-1',
      status: 'paid',
      amount: '₹12,000',
      packageTitle: 'Reformer Unlimited (Monthly)',
      dueDate: 'Nov 28, 2026',
      lastPaidDate: 'Oct 28, 2026'
    },
    dietPlan: {
      ...DEFAULT_STUDIO_DIET_PLAN,
      clientName: 'Elena Vance'
    }
  },
  {
    id: 'client-2',
    email: 'marcus.reid@gmail.com',
    username: 'marcus_reid',
    displayName: 'Marcus Reid',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 872-1104',
    membershipTier: 'Private Duet',
    bio: 'Post-injury athlete focusing on shoulder girdle and hamstring length.',
    joinedDate: 'Jun 2023',
    isOnboarded: true,
    fitnessGoal: 'Rehabilitation & Hamstring Length',
    experienceLevel: 'Advanced',
    dietaryPreference: 'Lactose-Sensitive',
    feeRecord: {
      clientId: 'client-2',
      status: 'pending',
      amount: '₹16,000',
      packageTitle: 'Private Duet (Monthly)',
      dueDate: 'Nov 05, 2026',
      lastReminderSent: 'Yesterday at 04:30 PM'
    },
    dietPlan: {
      ...DEFAULT_STUDIO_DIET_PLAN,
      id: 'diet-plan-marcus-1850',
      clientName: 'Marcus Reid',
      planTitle: 'ATHLETIC LEAN MASS & RECOVERY NUTRITION PLAN',
      metrics: {
        ...DEFAULT_STUDIO_DIET_PLAN.metrics,
        ageSex: '34 / Male',
        heightWeight: '6\'1" / 84 kg',
        targetWeight: 'Goal 79 kg',
        estimatedBMI: '24.2',
        estimatedMaintenance: '~2,300–2,450 kcal/day',
        dailyIntake: '~1,950 kcal/day',
        proteinTarget: '~130–145 g/day',
        constraints: 'Lactose-sensitive'
      }
    }
  },
  {
    id: 'client-3',
    email: 'sophia.chen@gmail.com',
    username: 'sophia_chen',
    displayName: 'Sophia Chen',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 492-7718',
    membershipTier: 'Mindful Core 8-Pack',
    bio: 'Dancer transitioning into classical pilates strength & joint longevity.',
    joinedDate: 'Feb 2024',
    isOnboarded: true,
    fitnessGoal: 'Joint Longevity & Spine Mobility',
    experienceLevel: 'Intermediate',
    dietaryPreference: 'Vegetarian',
    feeRecord: {
      clientId: 'client-3',
      status: 'paid',
      amount: '₹8,500',
      packageTitle: 'Mindful Core 8-Pack',
      dueDate: 'Dec 02, 2026',
      lastPaidDate: 'Nov 02, 2026'
    },
    dietPlan: {
      ...DEFAULT_STUDIO_DIET_PLAN,
      id: 'diet-plan-sophia-1600',
      clientName: 'Sophia Chen'
    }
  }
];

export const INITIAL_TIMESLOTS: SessionTimeslot[] = [
  {
    id: 'slot-1',
    sessionTitle: 'Morning Pilates Alignment',
    date: '2026-11-06',
    time: '08:00 AM - 09:00 AM',
    instructorName: 'Radhika Chopra',
    instructorId: 'instructor-1',
    clientId: 'client-1',
    clientName: 'Elena Vance',
    status: 'present',
    markedAt: '08:05 AM',
    clientConfirmation: 'attending',
    clientConfirmedAt: '07:18 AM (via notification)',
    notes: 'Elena arrived early, excellent spinal alignment and posture today.',
    isRecurring: true,
    recurringPattern: 'Weekly on Fridays (4 weeks)'
  },
  {
    id: 'slot-2',
    sessionTitle: 'Pilates Core & Posture',
    date: '2026-11-06',
    time: '10:00 AM - 11:00 AM',
    instructorName: 'Radhika Chopra',
    instructorId: 'instructor-1',
    clientId: 'client-2',
    clientName: 'Marcus Reid',
    status: 'absent',
    clientConfirmation: 'not_attending',
    clientConfirmedAt: '09:16 AM (via notification)',
    notes: 'Client tapped "Not attending" on 45m reminder. Instructor notified in advance.'
  },
  {
    id: 'slot-3',
    sessionTitle: 'Gentle Restorative Pilates',
    date: '2026-11-06',
    time: '11:00 AM - 12:00 PM',
    instructorName: 'Radhika Chopra',
    instructorId: 'instructor-1',
    clientId: 'client-3',
    clientName: 'Sophia Chen',
    status: 'scheduled',
    notes: 'Gentle core decompression and pelvic stabilization.'
  },
  {
    id: 'slot-4',
    sessionTitle: 'Evening Pilates Precision',
    date: '2026-11-06',
    time: '05:00 PM - 06:00 PM',
    instructorName: 'Radhika Chopra',
    instructorId: 'instructor-1',
    clientId: 'client-1',
    clientName: 'Elena Vance',
    status: 'scheduled',
    notes: 'Focus on hip decompression and thoracic rotation.'
  },
  {
    id: 'slot-5',
    sessionTitle: 'Sunset Core Conditioning',
    date: '2026-11-05',
    time: '06:00 PM - 07:00 PM',
    instructorName: 'Radhika Chopra',
    instructorId: 'instructor-1',
    clientId: 'client-2',
    clientName: 'Marcus Reid',
    status: 'absent',
    markedAt: '06:15 PM',
    notes: 'Notified with 1 hour notice (work conflict).'
  }
];

export const INITIAL_BATCH_SLOTS: StudioBatchSlot[] = [
  // Morning slots
  { id: 'batch-m1', timeSlot: '07:00 AM - 08:00 AM', category: 'morning', isAvailable: true, label: 'Early Morning Flow' },
  { id: 'batch-m2', timeSlot: '08:00 AM - 09:00 AM', category: 'morning', isAvailable: true, label: 'Morning Core Alignment' },
  { id: 'batch-m3', timeSlot: '09:00 AM - 10:00 AM', category: 'morning', isAvailable: true, label: 'Classical Reformer Flow' },
  { id: 'batch-m4', timeSlot: '10:00 AM - 11:00 AM', category: 'morning', isAvailable: true, label: 'Spine & Posture Precision' },
  { id: 'batch-m5', timeSlot: '11:00 AM - 12:00 PM', category: 'morning', isAvailable: true, label: 'Midday Restorative Session' },
  
  // Evening slots
  { id: 'batch-e1', timeSlot: '04:00 PM - 05:00 PM', category: 'evening', isAvailable: true, label: 'Late Afternoon Reset' },
  { id: 'batch-e2', timeSlot: '05:00 PM - 06:00 PM', category: 'evening', isAvailable: true, label: 'Evening Core Power' },
  { id: 'batch-e3', timeSlot: '06:00 PM - 07:00 PM', category: 'evening', isAvailable: true, label: 'Sunset Decompression' },
  { id: 'batch-e4', timeSlot: '11:00 PM - 12:00 AM', category: 'evening', isAvailable: true, label: 'Late Night Studio Flow' }
];

export const AVAILABLE_STUDIO_TIMESLOTS = INITIAL_BATCH_SLOTS.map(b => b.timeSlot);

export const AVAILABLE_APPARATUS: string[] = [];
export const AVAILABLE_ROOMS: string[] = [];

export const SAMPLE_MEAL_TYPES = [
  'Breakfast',
  'Tea 1',
  'Mid-Morning Snack',
  'Lunch',
  'Tea 2 + snack',
  'Pre-Pilates Fuel',
  'Post-Pilates Recovery',
  'Dinner'
];

export const SAMPLE_STUDIO_FOODS = [
  '2 moong-dal chillas from ~70 g dry dal + 100 g curd + vegetables',
  '220 g cooked vegetable poha + 150 g Greek yogurt/curd',
  '2 besan chillas from ~70 g besan + 100 g curd + chutney',
  '220 g cooked vegetable upma + 150 g curd + 10 g peanuts',
  '150 ml milk tea + 1 tsp sugar',
  'Tea + 1 tsp sugar + 15 g roasted chana',
  'Tea + 1 tsp sugar + 15 g makhana',
  'Tea + 1 tsp sugar + 1 small apple/guava',
  '120 g chicken + 100 g cooked dal + 100 g cooked rice + large salad',
  '150 g fish/chicken + 120 g cooked rice + 250 g vegetables + salad',
  '160 g cooked rajma + 100 g cooked rice + 250 g vegetables + 100 g curd',
  '160 g cooked chole + 100 g cooked rice + 250 g vegetables/salad',
  '150 g chicken/fish + 1 small millet roti + 100 g cooked dal + salad',
  '150 g tofu/lower-fat paneer + 250 g vegetables + 100 g curd',
  '150 g chicken/tofu + 250–300 g vegetables + 100 g curd',
  '150 g tofu/lower-fat paneer + 300 g vegetables + 100 g curd',
  '2 moong/besan chillas + 150 g curd + 250 g vegetables'
];
