import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Apple,
  Droplets,
  Plus,
  Minus,
  Flame,
  Shield,
  Clock,
  Sparkles,
  Scale,
  Footprints,
  HeartPulse,
  Coffee,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Target,
  CheckCircle2,
  ListFilter,
  FileText,
  FileUp,
  Download,
  BookOpen
} from 'lucide-react';
import { DEFAULT_STUDIO_DIET_PLAN } from '../../data/mockData';
import {
  MindfulTeaDrawing,
  WholesomeBowlDrawing,
  WaterCarafeDrawing,
  BotanicalBranchDrawing,
  GentleWalkingPathDrawing,
  PeacefulMoonDrawing,
  WholeFruitHarvestDrawing
} from '../common/StudioDrawings';

export const ClientDietView: React.FC = () => {
  const { currentUser, addWaterLog, importDietPlanPdf } = useApp();
  const [activePanel, setActivePanel] = useState<'meals' | 'targets' | 'habits' | 'rules' | 'pdf'>('meals');
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!currentUser) return null;

  const diet = currentUser.dietPlan || DEFAULT_STUDIO_DIET_PLAN;
  const currentWater = diet.currentWaterLiters || 0;
  const waterGoal = 2.5;
  const waterPct = Math.min(100, Math.round((currentWater / waterGoal) * 100));

  const currentDay = diet.days.find(d => d.dayNumber === selectedDayNum) || diet.days[0];
  const activeMeal = currentDay.meals[selectedMealIndex] || currentDay.meals[0];

  // Helper icon for meal types
  const getMealIcon = (mealName: string) => {
    const lower = mealName.toLowerCase();
    if (lower.includes('tea') || lower.includes('coffee')) return Coffee;
    if (lower.includes('breakfast')) return Apple;
    if (lower.includes('lunch')) return Utensils;
    if (lower.includes('snack')) return Sparkles;
    return Flame;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1000 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    importDietPlanPdf(currentUser.id, {
      fileName: file.name,
      fileSize: sizeStr,
      uploadedAt: nowStr,
      notes: 'Custom nutritionist prescribed nutrition protocol'
    });

    setUploadSuccessMsg(`Imported "${file.name}" successfully!`);
    setTimeout(() => setUploadSuccessMsg(''), 4000);
  };

  const handleLoadOfficialSample = () => {
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    importDietPlanPdf(currentUser.id, {
      fileName: 'RC_Pilates_Official_Studio_Nutrition_Plan.pdf',
      fileSize: '342 KB',
      uploadedAt: nowStr,
      notes: 'Lead Instructor Radhika Chopra approved studio protocol'
    });

    setUploadSuccessMsg('Imported official studio PDF plan successfully!');
    setTimeout(() => setUploadSuccessMsg(''), 4000);
  };

  const handleDownloadSamplePdf = () => {
    const content = `RC PILATES & FITNESS STUDIO - NUTRITION BLUEPRINT\n\nClient: ${currentUser.displayName}\nDate: ${new Date().toLocaleDateString()}\nLead Instructor: Radhika Chopra\n\n1. Calorie Floor: 1,600 kcal strict daily baseline\n2. Protein: ~90g lean protein\n3. Cooking Oil: Max 3-4 tsp per day\n4. Hydration: 2.5 - 3 Liters minimum\n5. Timing: Eat light complex carbs 90 mins prior to Reformer session.`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentUser.importedDietPdf?.fileName || 'RC_Pilates_Nutrition_Plan.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-4 pb-28 space-y-4 max-w-xl mx-auto w-full">
      {/* Studio Header Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white shadow-ambient relative overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>RC Pilates Nutrition</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActivePanel('pdf')}
              className="text-xs bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-stone-100 font-semibold flex items-center gap-1 transition-all"
            >
              <FileUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>{currentUser.importedDietPdf ? 'PDF Loaded' : 'Import PDF'}</span>
            </button>
            <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-stone-200 font-semibold">
              ~{diet.metrics.dailyIntake}
            </span>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold tracking-tight text-white leading-tight">
          {diet.planTitle}
        </h2>
        <p className="text-sm text-stone-300 mt-1 font-light">
          Prepared for <strong className="text-white font-semibold">{currentUser.displayName}</strong>
        </p>

        {/* Botanical drawing accent */}
        <BotanicalBranchDrawing className="w-24 h-20 text-emerald-300/20 absolute -right-1 -bottom-1 pointer-events-none" />
      </div>

      {uploadSuccessMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Visual Navigation Panels (Only 1 active at a time to prevent clutter) */}
      <div className="grid grid-cols-5 gap-1 bg-[#F2E9DC] p-1.5 rounded-2xl border border-stone-200/80">
        <button
          type="button"
          onClick={() => setActivePanel('meals')}
          className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
            activePanel === 'meals'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Meals</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePanel('targets')}
          className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
            activePanel === 'targets'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Targets</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePanel('habits')}
          className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
            activePanel === 'habits'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Habits</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePanel('rules')}
          className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
            activePanel === 'rules'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePanel('pdf')}
          className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 relative ${
            activePanel === 'pdf'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PDF Plan</span>
          {currentUser.importedDietPdf && (
            <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-2" />
          )}
        </button>
      </div>

      {/* PANEL 1: 7-DAY MEALS (Ultra-clean, Minimal on Screen, Visual Stepper) */}
      {activePanel === 'meals' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Day Selector (Big tap targets) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {diet.days.map(d => {
              const isSelected = selectedDayNum === d.dayNumber;
              return (
                <button
                  key={d.dayNumber}
                  type="button"
                  onClick={() => {
                    setSelectedDayNum(d.dayNumber);
                    setSelectedMealIndex(0);
                  }}
                  className={`py-2 px-3.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-md scale-105'
                      : 'bg-white dark:bg-[#1C231E] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                  }`}
                >
                  {d.dayLabel}
                </button>
              );
            })}
          </div>

          {/* Current Day Header Card */}
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-4 shadow-ambient border border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                {currentDay.dayLabel} Menu
              </p>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {currentDay.focusTag || 'Balanced Day'}
              </h3>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                ~{currentDay.totalCalories} kcal
              </span>
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'single' ? 'all' : 'single')}
                className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
                title={viewMode === 'single' ? 'Show All Meals' : 'Show Single Meal'}
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VIEW MODE A: SINGLE MEAL FOCUS (Minimal content on screen at one time) */}
          {viewMode === 'single' ? (
            <div className="space-y-3">
              {/* Meal Selector Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {currentDay.meals.map((meal, idx) => {
                  const isSelected = selectedMealIndex === idx;
                  return (
                    <button
                      key={meal.id}
                      type="button"
                      onClick={() => setSelectedMealIndex(idx)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-emerald-900 text-white shadow-sm'
                          : 'bg-[#FAF8F5] dark:bg-[#242D26] text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      {meal.mealName.split(' ')[0]} ({meal.time.split(' ')[0]})
                    </button>
                  );
                })}
              </div>

              {/* Active Focused Meal Card */}
              <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-6 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-4">
                {/* Meal Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      {React.createElement(getMealIcon(activeMeal.mealName), { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                        {activeMeal.mealName}
                      </h4>
                      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-4 h-4 text-stone-400" />
                        <span>{activeMeal.time}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    ~{activeMeal.caloriesKcal} kcal
                  </span>
                </div>

                {/* Handcrafted Meal Illustration */}
                <div className="w-full bg-[#FAF8F5] dark:bg-[#242D26] rounded-2xl p-2 border border-stone-200/70 dark:border-stone-800/80 flex items-center justify-center">
                  {activeMeal.mealName.toLowerCase().includes('tea') || activeMeal.mealName.toLowerCase().includes('coffee') ? (
                    <MindfulTeaDrawing className="w-32 h-20 text-amber-800 dark:text-amber-300 drop-shadow-xs" />
                  ) : (
                    <WholesomeBowlDrawing className="w-32 h-20 text-emerald-800 dark:text-emerald-300 drop-shadow-xs" />
                  )}
                </div>

                {/* Structured Food Items List (Visual, Bulleted, Readable) */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2.5">
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    Recommended Items
                  </span>
                  <div className="space-y-2">
                    {activeMeal.foodDescription.split('+').map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200/80 dark:border-stone-700/80 flex items-center gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                          {item.trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stepper Buttons (Prev / Next Meal) */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    disabled={selectedMealIndex === 0}
                    onClick={() => setSelectedMealIndex(prev => Math.max(0, prev - 1))}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Meal</span>
                  </button>

                  <span className="text-xs text-stone-400 font-semibold">
                    {selectedMealIndex + 1} of {currentDay.meals.length}
                  </span>

                  <button
                    type="button"
                    disabled={selectedMealIndex === currentDay.meals.length - 1}
                    onClick={() => setSelectedMealIndex(prev => Math.min(currentDay.meals.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-900"
                  >
                    <span>Next Meal</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW MODE B: ALL MEALS STACKED */
            <div className="space-y-3">
              {currentDay.meals.map(meal => {
                const MealIcon = getMealIcon(meal.mealName);
                return (
                  <div
                    key={meal.id}
                    className="bg-white dark:bg-[#1C231E] rounded-3xl p-4 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          <MealIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-stone-900 dark:text-stone-100 leading-tight">
                            {meal.mealName}
                          </h4>
                          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{meal.time}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200 bg-[#FAF8F5] dark:bg-[#242D26] px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                        ~{meal.caloriesKcal} kcal
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800 space-y-1">
                      {meal.foodDescription.split('+').map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PANEL 2: TARGETS (Visual Metric Cards with Big Numbers) */}
      {activePanel === 'targets' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
              <span>Target Metrics</span>
            </h3>

            {/* 4 Big Visual Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 text-center space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Daily Intake</span>
                <p className="font-serif text-3xl font-bold text-emerald-800 dark:text-emerald-300">
                  {diet.metrics.dailyIntake}
                </p>
                <p className="text-xs text-stone-500 font-medium">Controlled floor</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 text-center space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Protein Goal</span>
                <p className="font-serif text-3xl font-bold text-emerald-800 dark:text-emerald-300">
                  {diet.metrics.proteinTarget}
                </p>
                <p className="text-xs text-stone-500 font-medium">Muscle tone</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 text-center space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Target Weight</span>
                <p className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {diet.metrics.targetWeight}
                </p>
                <p className="text-xs text-stone-500 font-medium">Current: {diet.metrics.heightWeight}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 text-center space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Daily Fibre</span>
                <p className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {diet.metrics.fibreTarget}
                </p>
                <p className="text-xs text-stone-500 font-medium">Fullness &amp; gut ease</p>
              </div>
            </div>

            {/* 3 Visual Direction Chips (Zero clutter) */}
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                <Coffee className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Sweetened Teas</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {diet.metrics.teaSugarAllowance || '2 sweetened teas / day (1 tsp sugar each)'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Diet Constraints</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {diet.metrics.constraints}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 flex items-center gap-3">
                <Footprints className="w-5 h-5 text-sky-700 dark:text-sky-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-sky-800 dark:text-sky-300">Daily Movement</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {diet.metrics.activity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 3: HABITS & HYDRATION (Visual Tracker & Big Metric Cards) */}
      {activePanel === 'habits' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Water Tracker Card with Carafe Drawing */}
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                    Daily Water Intake
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">Target: 2.0 to 2.5 Liters</p>
                </div>
              </div>

              {/* Water Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addWaterLog(currentUser.id, -0.25)}
                  className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center hover:bg-stone-200 active:scale-95 font-bold"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => addWaterLog(currentUser.id, 0.25)}
                  className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center hover:bg-sky-700 active:scale-95 font-bold shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawing + Progress */}
            <div className="flex items-center gap-4 pt-1">
              <div className="w-20 h-20 bg-sky-50 dark:bg-sky-950/40 rounded-2xl p-1.5 border border-sky-100 dark:border-sky-900 flex items-center justify-center shrink-0">
                <WaterCarafeDrawing className="w-full h-full text-sky-700 dark:text-sky-300" />
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-sky-800 dark:text-sky-300">
                    {currentWater.toFixed(1)} L
                  </span>
                  <span className="text-sm font-bold text-stone-600 dark:text-stone-400">
                    {waterPct}% of 2.5L
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${waterPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Visual Direction Habit Cards with Studio Drawings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#1C231E] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="w-full bg-[#FAF8F5] dark:bg-[#242D26] rounded-xl p-2 border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-center">
                <GentleWalkingPathDrawing className="w-full h-14 text-emerald-800 dark:text-emerald-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Daily Steps</p>
                <p className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">8k–10k</p>
                <p className="text-xs text-stone-500 font-medium">Comfortable walk</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1C231E] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="w-full bg-[#FAF8F5] dark:bg-[#242D26] rounded-xl p-2 border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-center">
                <BotanicalBranchDrawing className="w-full h-14 text-amber-800 dark:text-amber-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Cooking Oil</p>
                <p className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">3–4 tsp</p>
                <p className="text-xs text-stone-500 font-medium">Daily allowance</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1C231E] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="w-full bg-[#FAF8F5] dark:bg-[#242D26] rounded-xl p-2 border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-center">
                <WholeFruitHarvestDrawing className="w-full h-14 text-rose-800 dark:text-rose-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Fresh Fruit</p>
                <p className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">1–2 Servings</p>
                <p className="text-xs text-stone-500 font-medium">Whole fruits only</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1C231E] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="w-full bg-[#FAF8F5] dark:bg-[#242D26] rounded-xl p-2 border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-center">
                <PeacefulMoonDrawing className="w-full h-14 text-indigo-800 dark:text-indigo-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Rest &amp; Sleep</p>
                <p className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">7+ Hours</p>
                <p className="text-xs text-stone-500 font-medium">Muscle recovery</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 4: STUDIO RULES (Visual Cards with Clear Rules) */}
      {activePanel === 'rules' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                1,600 kcal Calorie Floor
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 font-medium mt-1 leading-snug">
                Strict baseline. Do not reduce calories below this floor to safeguard lean muscle and vital metabolic function.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Weekly Weigh-Ins Only
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 font-medium mt-1 leading-snug">
                Weigh once per week on Friday morning, fasting. Avoid day-to-day scale fluctuations.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 flex items-center justify-center shrink-0">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Medical &amp; Energy Routine
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 font-medium mt-1 leading-snug">
                Maintain thyroid medication schedule (30m before breakfast). Safe fat loss is 0.5–1 kg/week.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 5: IMPORT DIET PLAN FROM PDF */}
      {activePanel === 'pdf' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* If a PDF is already imported */}
          {currentUser.importedDietPdf ? (
            <div className="bg-white rounded-3xl p-5 shadow-ambient border border-stone-200/90 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F2E9DC] text-emerald-900 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-emerald-800" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-base text-stone-900">
                        {currentUser.importedDietPdf.fileName}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Active PDF
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Size: {currentUser.importedDietPdf.fileSize} • Uploaded: {currentUser.importedDietPdf.uploadedAt}
                    </p>
                  </div>
                </div>
              </div>

              {currentUser.importedDietPdf.notes && (
                <p className="text-xs text-stone-600 bg-[#FAF8F5] p-3 rounded-xl border border-stone-200/70 italic">
                  Note: "{currentUser.importedDietPdf.notes}"
                </p>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadSamplePdf}
                  className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xs"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Replace PDF</span>
                </button>
              </div>

              {/* Simulated PDF Document Reader Preview */}
              <div className="rounded-2xl border border-stone-300 bg-[#FAF8F5] p-4 text-stone-800 space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-800" />
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-stone-700">
                      Document Overview
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-semibold">Page 1 of 1</span>
                </div>

                <div className="space-y-2 text-xs leading-relaxed text-stone-700">
                  <div className="p-3 bg-white rounded-xl border border-stone-200/70 space-y-1">
                    <p className="font-serif font-bold text-sm text-stone-900">
                      RC Pilates Nutrition Plan — {currentUser.displayName}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Prescribed by Radhika Chopra • Studio Lead &amp; Reformer Specialist
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-2 bg-white rounded-xl border border-stone-200/60">
                      <p className="text-[10px] text-stone-500 font-bold uppercase">Calorie Target</p>
                      <p className="text-sm font-bold text-emerald-900">1,600 kcal</p>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-stone-200/60">
                      <p className="text-[10px] text-stone-500 font-bold uppercase">Daily Water</p>
                      <p className="text-sm font-bold text-emerald-900">2.5–3.0 L</p>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-stone-200/60">
                      <p className="text-[10px] text-stone-500 font-bold uppercase">Reformer Meal</p>
                      <p className="text-sm font-bold text-emerald-900">-90 Mins</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Synchronized with your studio reformer profile &amp; morning batches.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Dropzone / Quick Load Area */
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white rounded-3xl p-8 border-2 border-dashed border-[#D5C0A4] hover:border-emerald-700 hover:bg-[#FAF8F5] cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-3 shadow-ambient group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F2E9DC] group-hover:bg-emerald-100 text-emerald-900 flex items-center justify-center transition-colors">
                  <FileUp className="w-7 h-7 text-emerald-800" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Import Diet Plan (PDF)
                  </h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Click to select a nutrition PDF from your nutritionist, doctor, or personal records.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Accepts .pdf up to 10MB
                </span>
              </div>

              {/* Alternative: Load Official Studio Template */}
              <div className="bg-white rounded-3xl p-4 shadow-ambient border border-stone-200 flex items-center justify-between">
                <div>
                  <h5 className="font-serif font-bold text-xs text-stone-900">
                    Need the Studio Nutrition Blueprint?
                  </h5>
                  <p className="text-[11px] text-stone-500">
                    Load Radhika's official 1,600 kcal reformer meal protocol.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadOfficialSample}
                  className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  Load Studio PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
