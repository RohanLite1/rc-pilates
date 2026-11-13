import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserProfile, StudioDietPlan, DietDayPlan, DietMealSlot } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Apple,
  Calendar,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  Shield,
  RotateCcw,
  Target,
  Utensils,
  FileText,
  FileUp,
  Download,
  BookOpen
} from 'lucide-react';
import {
  AVAILABLE_STUDIO_TIMESLOTS,
  DEFAULT_STUDIO_DIET_PLAN,
  SAMPLE_MEAL_TYPES,
  SAMPLE_STUDIO_FOODS
} from '../../data/mockData';
import { DayOfWeekPicker } from '../common/DayOfWeekPicker';
import { StudioTimeslotSelect } from '../common/StudioTimeslotSelect';
import {
  PilatesReformerDrawing,
  InstructorAlignmentDrawing,
  WholesomeBowlDrawing,
  MindfulTeaDrawing,
  BotanicalBranchDrawing,
  WaterCarafeDrawing,
  GentleWalkingPathDrawing,
  PeacefulMoonDrawing,
  WholeFruitHarvestDrawing
} from '../common/StudioDrawings';

interface ClientDossierModalProps {
  client: UserProfile;
  initialTab?: 'diet' | 'attendance';
  onClose: () => void;
}

export const ClientDossierModal: React.FC<ClientDossierModalProps> = ({
  client,
  initialTab = 'diet',
  onClose
}) => {
  const {
    sessions,
    updateAttendance,
    createOrUpdateSession,
    updateClientDietPlan,
    switchUser,
    importDietPlanPdf
  } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'diet' | 'attendance'>(initialTab);
  const [dietSubPanel, setDietSubPanel] = useState<'targets' | 'meals' | 'habits' | 'pdf'>('meals');
  const [editingDayNum, setEditingDayNum] = useState<number>(1);
  const [savedFeedback, setSavedFeedback] = useState<string>('');
  const [pdfNotes, setPdfNotes] = useState<string>(client.importedDietPdf?.notes || '');
  const pdfFileInputRef = useRef<HTMLInputElement | null>(null);

  // Local state clone for Diet Plan
  const initialPlan = client.dietPlan || {
    ...DEFAULT_STUDIO_DIET_PLAN,
    clientName: client.displayName
  };

  const [planTitle, setPlanTitle] = useState<string>(initialPlan.planTitle);
  const [metrics, setMetrics] = useState(initialPlan.metrics);
  const [strategy, setStrategy] = useState(initialPlan.strategy);
  const [days, setDays] = useState<DietDayPlan[]>(initialPlan.days);

  // New Timeslot state for this specific client (Multi-day alarm style with Starting & Ending dates)
  const [newSlotTitle, setNewSlotTitle] = useState<string>('Pilates Session');
  const [newSlotDate, setNewSlotDate] = useState<string>('2026-11-09');
  const [newSlotEndDate, setNewSlotEndDate] = useState<string>('2026-12-06');
  const [newSlotTime, setNewSlotTime] = useState<string>(AVAILABLE_STUDIO_TIMESLOTS[1]);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // default Mon-Fri
  const [newSlotRepeatWeeks, setNewSlotRepeatWeeks] = useState<number>(4);
  const [showAddSlot, setShowAddSlot] = useState<boolean>(false);

  // Helper to adjust ending date when duration or start date changes
  const updateDatesFromDuration = (weeks: number, baseStartDate: string = newSlotDate) => {
    setNewSlotRepeatWeeks(weeks);
    try {
      const [y, m, d] = baseStartDate.split('-').map(Number);
      const end = new Date(y, m - 1, d);
      end.setDate(end.getDate() + weeks * 7 - 1);
      const ey = end.getFullYear();
      const em = String(end.getMonth() + 1).padStart(2, '0');
      const ed = String(end.getDate()).padStart(2, '0');
      setNewSlotEndDate(`${ey}-${em}-${ed}`);
    } catch (e) {
      console.error(e);
    }
  };

  const clientSessions = sessions.filter(s => s.clientId === client.id);

  // Load standard studio 1600 kcal fat loss template
  const handleLoadStudioTemplate = () => {
    setPlanTitle('Short-Term Maximum Safe Fat-Loss Plan');
    setMetrics({
      ...DEFAULT_STUDIO_DIET_PLAN.metrics,
      ageSex: client.bio?.includes('Male') ? '34 / Male' : '52 / Female'
    });
    setStrategy({ ...DEFAULT_STUDIO_DIET_PLAN.strategy });
    setDays([...DEFAULT_STUDIO_DIET_PLAN.days]);
    setSavedFeedback('Loaded 1,600 kcal Studio Preset!');
    setTimeout(() => setSavedFeedback(''), 2500);
  };

  // Save Diet Plan
  const handleSaveDietPlan = () => {
    const updatedPlan: StudioDietPlan = {
      id: client.dietPlan?.id || `diet-${Date.now()}`,
      planTitle,
      clientName: client.displayName,
      assignedDate: 'Updated Nov 2026',
      status: 'active',
      metrics,
      strategy,
      days,
      currentWaterLiters: client.dietPlan?.currentWaterLiters || 1.8,
      instructorNotes: client.dietPlan?.instructorNotes || DEFAULT_STUDIO_DIET_PLAN.instructorNotes
    };

    updateClientDietPlan(client.id, updatedPlan);
    setSavedFeedback('Plan Saved & Assigned to ' + client.displayName + '!');
    setTimeout(() => setSavedFeedback(''), 3000);
  };

  // PDF Plan Management Handlers (Instructor Side)
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1000 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    importDietPlanPdf(client.id, {
      fileName: file.name,
      fileSize: sizeStr,
      uploadedAt: nowStr,
      notes: pdfNotes || `Prescribed for ${client.displayName} by Lead Instructor Radhika Chopra`
    });

    setSavedFeedback(`Attached "${file.name}" to ${client.displayName}'s profile!`);
    setTimeout(() => setSavedFeedback(''), 3000);
  };

  const handleAttachOfficialStudioPdf = () => {
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    importDietPlanPdf(client.id, {
      fileName: `RC_Pilates_1600kcal_Nutrition_${client.displayName.replace(/\s+/g, '_')}.pdf`,
      fileSize: '342 KB',
      uploadedAt: nowStr,
      notes: pdfNotes || `Official 1,600 kcal Reformer Protocol tailored for ${client.displayName}`
    });

    setSavedFeedback(`Attached Studio Nutrition PDF to ${client.displayName}!`);
    setTimeout(() => setSavedFeedback(''), 3000);
  };

  const handleRemovePdf = () => {
    importDietPlanPdf(client.id, null);
    setSavedFeedback(`Removed PDF from ${client.displayName}'s profile.`);
    setTimeout(() => setSavedFeedback(''), 2500);
  };

  const handleDownloadPdf = () => {
    const content = `RC PILATES & FITNESS STUDIO - TAILORED NUTRITION BLUEPRINT\n\nMember: ${client.displayName}\nAssigned Date: ${new Date().toLocaleDateString()}\nLead Instructor: Radhika Chopra\n\n1. Calorie Floor: 1,600 kcal strict daily baseline\n2. Protein: ~90g lean protein\n3. Cooking Oil: Max 3-4 tsp per day\n4. Hydration: 2.5 - 3 Liters minimum\n5. Timing: Eat light complex carbs 90 mins prior to Reformer session.\n\nNotes from Radhika: ${pdfNotes || client.importedDietPdf?.notes || 'Follow 7-day meal rotation alongside Reformer classes.'}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = client.importedDietPdf?.fileName || `${client.displayName.replace(/\s+/g, '_')}_Diet_Plan.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Day Meals Helpers
  const currentEditingDay = days.find(d => d.dayNumber === editingDayNum) || days[0];

  const handleUpdateMeal = (mealId: string, updates: Partial<DietMealSlot>) => {
    setDays(prev =>
      prev.map(d => {
        if (d.dayNumber === editingDayNum) {
          const updatedMeals = d.meals.map(m => (m.id === mealId ? { ...m, ...updates } : m));
          const totalCals = updatedMeals.reduce((sum, m) => sum + (Number(m.caloriesKcal) || 0), 0);
          return {
            ...d,
            meals: updatedMeals,
            totalCalories: totalCals
          };
        }
        return d;
      })
    );
  };

  const handleAddMealToDay = () => {
    const newMeal: DietMealSlot = {
      id: `meal-${Date.now()}`,
      time: '12:00 PM',
      mealName: 'Lunch',
      foodDescription: '150 g chicken/fish + 120 g cooked rice + 250 g vegetables + salad',
      caloriesKcal: 480
    };

    setDays(prev =>
      prev.map(d => {
        if (d.dayNumber === editingDayNum) {
          const updated = [...d.meals, newMeal];
          return {
            ...d,
            meals: updated,
            totalCalories: updated.reduce((sum, m) => sum + m.caloriesKcal, 0)
          };
        }
        return d;
      })
    );
  };

  const handleDeleteMeal = (mealId: string) => {
    setDays(prev =>
      prev.map(d => {
        if (d.dayNumber === editingDayNum) {
          const updated = d.meals.filter(m => m.id !== mealId);
          return {
            ...d,
            meals: updated,
            totalCalories: updated.reduce((sum, m) => sum + m.caloriesKcal, 0)
          };
        }
        return d;
      })
    );
  };

  // Timeslot handler (multi-day alarm-style schedule with start and end dates)
  const handleAssignSlot = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdateSession({
      sessionTitle: newSlotTitle || 'Pilates Session',
      startDate: newSlotDate,
      endDate: newSlotEndDate,
      time: newSlotTime,
      clientId: client.id,
      clientName: client.displayName,
      status: 'scheduled',
      selectedDays: selectedDays.length > 0 ? selectedDays : undefined,
      repeatWeeks: newSlotRepeatWeeks
    });
    setShowAddSlot(false);
    const summary = selectedDays.length > 0
      ? `Scheduled classes from ${newSlotDate} to ${newSlotEndDate}!`
      : `Class scheduled for ${newSlotDate}!`;
    setSavedFeedback(summary);
    setTimeout(() => setSavedFeedback(''), 3000);
  };

  const renderMealDrawing = (mealName: string) => {
    const lower = mealName.toLowerCase();
    if (lower.includes('breakfast') || lower.includes('tea')) {
      return <MindfulTeaDrawing className="w-10 h-10 text-emerald-800/40 dark:text-emerald-300/40 shrink-0" />;
    }
    if (lower.includes('snack') || lower.includes('fruit')) {
      return <WholeFruitHarvestDrawing className="w-10 h-10 text-emerald-800/40 dark:text-emerald-300/40 shrink-0" />;
    }
    return <WholesomeBowlDrawing className="w-10 h-10 text-emerald-800/40 dark:text-emerald-300/40 shrink-0" />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FAF8F5] dark:bg-[#131814] rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-stone-900 dark:text-[#EDF3EC] transition-colors">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-white dark:bg-[#1C231E] border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-[#D5C0A4] shadow-xs bg-[#FAF6F0]">
              <img
                src={client.avatarUrl}
                alt={client.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg leading-tight">
                  {client.displayName}
                </h3>
                <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  {client.membershipTier || 'Member'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">{client.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                switchUser(client);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors"
              title="View as this client immediately"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">View as Client</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400 font-bold text-base transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Switcher: Diet Plan Protocol vs Timeslots */}
        <div className="px-5 pt-3 bg-white dark:bg-[#1C231E] border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveMainTab('diet')}
              className={`py-2.5 px-3.5 text-sm font-bold rounded-t-2xl transition-all flex items-center gap-2 border-b-2 ${
                activeMainTab === 'diet'
                  ? 'border-emerald-800 text-emerald-900 dark:text-emerald-300 bg-[#FAF8F5] dark:bg-[#131814]'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>Studio Diet Designer</span>
            </button>

            <button
              onClick={() => setActiveMainTab('attendance')}
              className={`py-2.5 px-3.5 text-sm font-bold rounded-t-2xl transition-all flex items-center gap-2 border-b-2 ${
                activeMainTab === 'attendance'
                  ? 'border-emerald-800 text-emerald-900 dark:text-emerald-300 bg-[#FAF8F5] dark:bg-[#131814]'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Classes ({clientSessions.length})</span>
            </button>
          </div>

          {activeMainTab === 'diet' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDietSubPanel('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  dietSubPanel === 'pdf'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                }`}
                title="Attach or manage PDF nutrition plan"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>{client.importedDietPdf ? 'Manage PDF' : 'Attach PDF'}</span>
              </button>

              <button
                type="button"
                onClick={handleLoadStudioTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 rounded-xl border border-emerald-300 dark:border-emerald-700"
                title="Load 1,600 kcal template preset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Load Preset</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDietPlan}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>

        {/* Feedback message banner */}
        {savedFeedback && (
          <div className="bg-emerald-100 dark:bg-emerald-950 px-5 py-2.5 text-sm font-bold text-emerald-950 dark:text-emerald-200 border-b border-emerald-300 dark:border-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{savedFeedback}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeMainTab === 'diet' ? (
            <div className="space-y-4 text-sm">
              {/* Diet Sub-Panels (Minimal content on screen at one time) */}
              <div className="grid grid-cols-4 gap-1.5 bg-stone-100 dark:bg-[#1C231E] p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setDietSubPanel('meals')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    dietSubPanel === 'meals'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Meals</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDietSubPanel('targets')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    dietSubPanel === 'targets'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Targets</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDietSubPanel('habits')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    dietSubPanel === 'habits'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Rules</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDietSubPanel('pdf')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 relative ${
                    dietSubPanel === 'pdf'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF Plan</span>
                  {client.importedDietPdf && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-2" />
                  )}
                </button>
              </div>

              {/* SUB-PANEL 1: 7-DAY MEALS EDITOR */}
              {dietSubPanel === 'meals' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Day Picker Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {days.map(d => (
                      <button
                        key={d.dayNumber}
                        type="button"
                        onClick={() => setEditingDayNum(d.dayNumber)}
                        className={`py-2 px-3.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                          editingDayNum === d.dayNumber
                            ? 'bg-emerald-800 text-white shadow-md'
                            : 'bg-white dark:bg-[#1C231E] border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {d.dayLabel} ({d.totalCalories} kcal)
                      </button>
                    ))}
                  </div>

                  {/* Day Focus Header & Add Button */}
                  <div className="bg-white dark:bg-[#1C231E] p-4 rounded-3xl border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold text-stone-500 mb-1">
                        {currentEditingDay.dayLabel} Focus Title
                      </label>
                      <input
                        type="text"
                        value={currentEditingDay.focusTag || ''}
                        onChange={e =>
                          setDays(prev =>
                            prev.map(d =>
                              d.dayNumber === editingDayNum ? { ...d, focusTag: e.target.value } : d
                            )
                          )
                        }
                        placeholder="e.g. Moong Dal Chilla & High Protein"
                        className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-sm"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddMealToDay}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold text-xs shadow-xs self-end"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Meal</span>
                    </button>
                  </div>

                  {/* Meal Cards for Selected Day */}
                  <div className="space-y-3">
                    {currentEditingDay.meals.map(meal => (
                      <div
                        key={meal.id}
                        className="p-4 bg-white dark:bg-[#1C231E] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-ambient"
                      >
                        <div className="flex items-center gap-3">
                          {renderMealDrawing(meal.mealName)}
                          <div className="flex-1">
                            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                              {meal.mealName}
                            </span>
                            <p className="text-xs text-stone-500 font-semibold">{meal.time}</p>
                          </div>
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                            {meal.caloriesKcal} kcal
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {/* Time */}
                          <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1">Time</label>
                            <input
                              type="text"
                              value={meal.time}
                              onChange={e => handleUpdateMeal(meal.id, { time: e.target.value })}
                              placeholder="e.g. 8:00 AM"
                              className="w-full p-2 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold"
                            />
                          </div>

                          {/* Meal Type Dropdown */}
                          <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1">Meal Type</label>
                            <select
                              value={meal.mealName}
                              onChange={e => handleUpdateMeal(meal.id, { mealName: e.target.value })}
                              className="w-full p-2 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold"
                            >
                              {SAMPLE_MEAL_TYPES.map(mt => (
                                <option key={mt} value={mt}>
                                  {mt}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Calories */}
                          <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1">Calories (kcal)</label>
                            <input
                              type="number"
                              value={meal.caloriesKcal}
                              onChange={e =>
                                handleUpdateMeal(meal.id, { caloriesKcal: Number(e.target.value) || 0 })
                              }
                              className="w-full p-2 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-emerald-800 dark:text-emerald-300"
                            />
                          </div>
                        </div>

                        {/* Food Description with Studio Suggestions Dropdown */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-stone-500">
                              Food &amp; Portion Size
                            </label>
                            <select
                              onChange={e => {
                                if (e.target.value) {
                                  handleUpdateMeal(meal.id, { foodDescription: e.target.value });
                                }
                              }}
                              className="text-xs bg-[#FAF8F5] dark:bg-[#242D26] text-emerald-800 dark:text-emerald-300 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1 font-semibold"
                            >
                              <option value="">(Choose Studio Dish...)</option>
                              {SAMPLE_STUDIO_FOODS.map(f => (
                                <option key={f} value={f}>
                                  {f.slice(0, 42)}...
                                </option>
                              ))}
                            </select>
                          </div>
                          <input
                            type="text"
                            value={meal.foodDescription}
                            onChange={e => handleUpdateMeal(meal.id, { foodDescription: e.target.value })}
                            placeholder="e.g. 2 moong-dal chillas from ~70 g dry dal + 100 g curd + vegetables"
                            className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl text-sm"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteMeal(meal.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Meal</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-PANEL 2: TARGETS & CONSTRAINTS */}
              {dietSubPanel === 'targets' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Live Visual Metric Preview Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
                      <WholesomeBowlDrawing className="w-7 h-7 mx-auto text-emerald-800 dark:text-emerald-300 mb-1" />
                      <span className="block text-[11px] text-stone-500 font-semibold">Daily Intake</span>
                      <span className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-200">
                        {metrics.dailyIntake}
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
                      <BotanicalBranchDrawing className="w-7 h-7 mx-auto text-emerald-800 dark:text-emerald-300 mb-1" />
                      <span className="block text-[11px] text-stone-500 font-semibold">Protein Target</span>
                      <span className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-200">
                        {metrics.proteinTarget}
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
                      <GentleWalkingPathDrawing className="w-7 h-7 mx-auto text-emerald-800 dark:text-emerald-300 mb-1" />
                      <span className="block text-[11px] text-stone-500 font-semibold">Goal Weight</span>
                      <span className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-200">
                        {metrics.targetWeight}
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
                      <WaterCarafeDrawing className="w-7 h-7 mx-auto text-emerald-800 dark:text-emerald-300 mb-1" />
                      <span className="block text-[11px] text-stone-500 font-semibold">Hydration</span>
                      <span className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-200">
                        2.5L / Day
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1C231E] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
                    <h4 className="font-serif font-bold text-base flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                      <span>Member Profile Parameters</span>
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1">
                          Plan Title
                        </label>
                        <input
                          type="text"
                          value={planTitle}
                          onChange={e => setPlanTitle(e.target.value)}
                          className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-serif font-bold text-base"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">
                            Current Height &amp; Weight
                          </label>
                          <input
                            type="text"
                            value={metrics.heightWeight}
                            onChange={e => setMetrics({ ...metrics, heightWeight: e.target.value })}
                            placeholder="e.g. 5'7&quot; / 80 kg"
                            className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">
                            Goal Target Weight
                          </label>
                          <input
                            type="text"
                            value={metrics.targetWeight}
                            onChange={e => setMetrics({ ...metrics, targetWeight: e.target.value })}
                            placeholder="e.g. Goal 72 kg"
                            className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-emerald-800 dark:text-emerald-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">
                            Daily Caloric Intake
                          </label>
                          <input
                            type="text"
                            value={metrics.dailyIntake}
                            onChange={e => setMetrics({ ...metrics, dailyIntake: e.target.value })}
                            placeholder="e.g. ~1,600 kcal/day"
                            className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-emerald-800 dark:text-emerald-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">
                            Protein Goal
                          </label>
                          <select
                            value={metrics.proteinTarget}
                            onChange={e => setMetrics({ ...metrics, proteinTarget: e.target.value })}
                            className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold"
                          >
                            <option value="~90–105 g/day">~90–105 g/day (Studio PDF Standard)</option>
                            <option value="~80–90 g/day">~80–90 g/day</option>
                            <option value="~110–125 g/day">~110–125 g/day</option>
                            <option value="~130–145 g/day">~130–145 g/day</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">
                            Dietary Constraints (Dropdown)
                          </label>
                          <select
                            value={metrics.constraints}
                            onChange={e => setMetrics({ ...metrics, constraints: e.target.value })}
                            className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold"
                          >
                            <option value="Egg-free + wheat-free">Egg-free + wheat-free (Studio PDF Standard)</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Gluten-free & Dairy-free">Gluten-free &amp; Dairy-free</option>
                            <option value="Lactose-sensitive">Lactose-sensitive</option>
                            <option value="No constraints / Standard Non-Veg">No constraints / Standard Non-Veg</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">
                            Sweetened Teas Allowance
                          </label>
                          <input
                            type="text"
                            value={metrics.teaSugarAllowance || '2 sweetened teas/day'}
                            onChange={e => setMetrics({ ...metrics, teaSugarAllowance: e.target.value })}
                            placeholder="e.g. 2 sweetened teas/day (~1 tsp sugar each)"
                            className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-PANEL 3: RULES & HABITS */}
              {dietSubPanel === 'habits' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Visual Habit Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-3xl bg-white dark:bg-[#1C231E] border border-stone-200 dark:border-stone-800 flex items-center gap-3 shadow-ambient">
                      <GentleWalkingPathDrawing className="w-11 h-11 text-emerald-800/70 dark:text-emerald-400/70 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                          Daily Steps Target
                        </span>
                        <p className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                          {strategy.stepsTarget}
                        </p>
                        <p className="text-[11px] text-stone-400">Steady movement for active recovery</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-3xl bg-white dark:bg-[#1C231E] border border-stone-200 dark:border-stone-800 flex items-center gap-3 shadow-ambient">
                      <WaterCarafeDrawing className="w-11 h-11 text-emerald-800/70 dark:text-emerald-400/70 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                          Hydration Goal
                        </span>
                        <p className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                          2.5 – 3.0 Liters
                        </p>
                        <p className="text-[11px] text-stone-400">Essential for metabolism & digestion</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-3xl bg-white dark:bg-[#1C231E] border border-stone-200 dark:border-stone-800 flex items-center gap-3 shadow-ambient">
                      <PeacefulMoonDrawing className="w-11 h-11 text-emerald-800/70 dark:text-emerald-400/70 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                          Sleep &amp; Recovery
                        </span>
                        <p className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                          7.5+ Hours Nightly
                        </p>
                        <p className="text-[11px] text-stone-400">Deep muscular restoration</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-3xl bg-white dark:bg-[#1C231E] border border-stone-200 dark:border-stone-800 flex items-center gap-3 shadow-ambient">
                      <BotanicalBranchDrawing className="w-11 h-11 text-emerald-800/70 dark:text-emerald-400/70 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                          Oil Allowance
                        </span>
                        <p className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                          {strategy.oilAllowance}
                        </p>
                        <p className="text-[11px] text-stone-400">Pure olive or cold-pressed mustard oil</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1C231E] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
                    <h4 className="font-serif font-bold text-base flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                      <span>Studio Strategy &amp; Rules</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">
                        Safety Boundary
                      </label>
                      <textarea
                        rows={2}
                        value={strategy.safetyBoundary}
                        onChange={e => setStrategy({ ...strategy, safetyBoundary: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">
                        Studio Rules (No cheat days, no alcohol, etc.)
                      </label>
                      <textarea
                        rows={2}
                        value={strategy.specialRules}
                        onChange={e => setStrategy({ ...strategy, specialRules: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1">Steps Target</label>
                        <input
                          type="text"
                          value={strategy.stepsTarget}
                          onChange={e => setStrategy({ ...strategy, stepsTarget: e.target.value })}
                          className="w-full p-2 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1">Cooking Oil</label>
                        <input
                          type="text"
                          value={strategy.oilAllowance}
                          onChange={e => setStrategy({ ...strategy, oilAllowance: e.target.value })}
                          className="w-full p-2 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-PANEL 4: IMPORT / ATTACH PDF PLAN (INSTRUCTOR SIDE) */}
              {dietSubPanel === 'pdf' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <input
                    ref={pdfFileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />

                  {client.importedDietPdf ? (
                    <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 shadow-ambient border border-stone-200 dark:border-stone-800 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#F2E9DC] text-[#675137] flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-[#7B6244]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                                {client.importedDietPdf.fileName}
                              </h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                                Active PDF for {client.displayName}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Size: {client.importedDietPdf.fileSize} • Uploaded: {client.importedDietPdf.uploadedAt}
                            </p>
                          </div>
                        </div>
                      </div>

                      {client.importedDietPdf.notes && (
                        <div className="p-3 bg-[#FAF8F5] dark:bg-[#242D26] rounded-xl border border-stone-200/80 dark:border-stone-700/80">
                          <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">Instructor Guidance Note:</span>
                          <p className="text-xs text-stone-700 dark:text-stone-300 italic mt-0.5">"{client.importedDietPdf.notes}"</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          className="py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                          <span>Download</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => pdfFileInputRef.current?.click()}
                          className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
                        >
                          <FileUp className="w-3.5 h-3.5" />
                          <span>Replace PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemovePdf}
                          className="py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* Simulated Document Preview */}
                      <div className="rounded-2xl border border-stone-300 dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#242D26] p-4 text-stone-800 dark:text-stone-200 space-y-3 shadow-inner">
                        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                            <span className="font-serif font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300">
                              Document Blueprint Preview
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-500 font-semibold">Page 1 of 1</span>
                        </div>

                        <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                          <div className="p-3 bg-white dark:bg-[#1C231E] rounded-xl border border-stone-200/70 dark:border-stone-700 space-y-1">
                            <p className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                              RC Pilates Nutrition Plan — {client.displayName}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              Prescribed by Radhika Chopra • Studio Lead &amp; Reformer Specialist
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 text-center">
                            <div className="p-2 bg-white dark:bg-[#1C231E] rounded-xl border border-stone-200/60 dark:border-stone-700">
                              <p className="text-[10px] text-stone-500 font-bold uppercase">Calorie Baseline</p>
                              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">1,600 kcal</p>
                            </div>
                            <div className="p-2 bg-white dark:bg-[#1C231E] rounded-xl border border-stone-200/60 dark:border-stone-700">
                              <p className="text-[10px] text-stone-500 font-bold uppercase">Daily Water</p>
                              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">2.5–3.0 L</p>
                            </div>
                            <div className="p-2 bg-white dark:bg-[#1C231E] rounded-xl border border-stone-200/60 dark:border-stone-700">
                              <p className="text-[10px] text-stone-500 font-bold uppercase">Reformer Meal</p>
                              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">-90 Mins</p>
                            </div>
                          </div>

                          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-[11px] flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                            <span>This document is synchronized with {client.displayName}'s member portal and app view.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Upload Dropzone & Instructions */
                    <div className="space-y-4">
                      <div
                        onClick={() => pdfFileInputRef.current?.click()}
                        className="w-full bg-white dark:bg-[#1C231E] rounded-3xl p-8 border-2 border-dashed border-[#D5C0A4] dark:border-stone-700 hover:border-emerald-700 hover:bg-[#FAF8F5] dark:hover:bg-[#242D26] cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-3 shadow-ambient group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-[#F2E9DC] dark:bg-[#2A231C] group-hover:bg-[#EAE0D2] text-[#675137] flex items-center justify-center transition-colors">
                          <FileUp className="w-7 h-7 text-[#7B6244]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                            Upload Nutrition Plan (PDF) for {client.displayName}
                          </h4>
                          <p className="text-xs text-stone-500 max-w-sm mx-auto">
                            Attach a personalized diet plan PDF from your files or clinical nutrition records. {client.displayName} will see and download it directly in their app.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-[#675137] bg-[#F2E9DC] px-3.5 py-1 rounded-full border border-[#D5C0A4]">
                          Select .pdf from your device
                        </span>
                      </div>

                      {/* Instructor Guidance Notes for Client */}
                      <div className="bg-white dark:bg-[#1C231E] p-4 rounded-3xl border border-stone-200/90 dark:border-stone-700 space-y-2">
                        <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                          Instructor Guidance Note for {client.displayName} (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={pdfNotes}
                          onChange={e => setPdfNotes(e.target.value)}
                          placeholder="e.g. Ensure hydration before morning reformer; consume light complex carbs 90 mins prior."
                          className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100"
                        />
                      </div>

                      {/* Studio Preset PDF Attachment */}
                      <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-4 shadow-ambient border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                        <div>
                          <h5 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">
                            Attach Studio Standard Protocol?
                          </h5>
                          <p className="text-[11px] text-stone-500">
                            Attach Radhika Chopra's official 1,600 kcal studio diet PDF.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAttachOfficialStudioPdf}
                          className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs shrink-0"
                        >
                          Attach Studio PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Big Bottom Save Bar */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveDietPlan}
                  className="w-full py-4 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-base shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save &amp; Assign Diet Plan</span>
                </button>
              </div>
            </div>
          ) : (
            /* Attendance & Timeslots Tab */
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between bg-white dark:bg-[#1C231E] p-4 rounded-3xl border border-stone-200 dark:border-stone-800">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    Client Classes ({clientSessions.length})
                  </h4>
                  <p className="text-xs text-stone-500">Book new timeslots or mark check-ins</p>
                </div>
                <button
                  onClick={() => setShowAddSlot(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Class</span>
                </button>
              </div>

              {clientSessions.length === 0 ? (
                <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-8 text-center space-y-3 border border-stone-200 dark:border-stone-800 shadow-ambient">
                  <PilatesReformerDrawing className="w-28 h-20 mx-auto text-emerald-800/60 dark:text-emerald-400/60" />
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    No Scheduled Sessions Yet
                  </h4>
                  <p className="text-xs text-stone-500">
                    Tap "Assign Class" above to book this member into an upcoming Reformer or Tower session.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clientSessions.map(slot => (
                    <div
                      key={slot.id}
                      className="p-4 bg-white dark:bg-[#1C231E] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-2 shadow-ambient"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <InstructorAlignmentDrawing className="w-10 h-10 text-emerald-800/50 dark:text-emerald-300/50 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 dark:text-stone-100">{slot.date}</span>
                              <span className="text-stone-300">•</span>
                              <span className="text-emerald-800 dark:text-emerald-400 font-bold">{slot.time}</span>
                              {slot.isRecurring && (
                                <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                                  Recurring
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-bold text-stone-800 dark:text-stone-200 mt-1">{slot.sessionTitle}</p>
                            <p className="text-xs text-stone-500 font-medium">RC Pilates Studio</p>
                          </div>
                        </div>

                        <div>
                          {slot.status === 'present' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </span>
                          )}
                          {slot.status === 'absent' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </span>
                          )}
                          {slot.status === 'scheduled' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Scheduled</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                        <button
                          type="button"
                          onClick={() => updateAttendance(slot.id, 'present')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold"
                        >
                          Mark Present
                        </button>
                        <button
                          type="button"
                          onClick={() => updateAttendance(slot.id, 'absent')}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold"
                        >
                          Mark Absent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Multi-Day Alarm-Style Schedule Inside */}
              {showAddSlot && (
                <div className="bg-white dark:bg-[#1C231E] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-ambient animate-in fade-in">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-2">
                    <h5 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                      Schedule Classes for {client.displayName}
                    </h5>
                    <p className="text-xs text-stone-500 font-medium">
                      Select days of the week, class time, and repeat duration
                    </p>
                  </div>

                  <form onSubmit={handleAssignSlot} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        Session Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newSlotTitle}
                        onChange={e => setNewSlotTitle(e.target.value)}
                        placeholder="e.g. Pilates Session"
                        className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-stone-100"
                      />
                    </div>

                    {/* Circular Day-of-Week Picker (Alarm app style) */}
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                        Repeat on Days
                      </label>
                      <DayOfWeekPicker
                        selectedDays={selectedDays}
                        onChange={setSelectedDays}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                          Starting Date
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type="date"
                            required
                            value={newSlotDate}
                            onChange={e => {
                              const val = e.target.value;
                              setNewSlotDate(val);
                              updateDatesFromDuration(newSlotRepeatWeeks, val);
                            }}
                            className="w-full pl-9 pr-2.5 py-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-2xl font-medium text-xs text-left min-h-[44px] text-stone-900 dark:text-stone-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                          Ending Date
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type="date"
                            required
                            value={newSlotEndDate}
                            min={newSlotDate}
                            onChange={e => setNewSlotEndDate(e.target.value)}
                            className="w-full pl-9 pr-2.5 py-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-2xl font-medium text-xs text-left min-h-[44px] text-stone-900 dark:text-stone-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                          Quick Duration Preset
                        </label>
                        <select
                          value={newSlotRepeatWeeks}
                          onChange={e => updateDatesFromDuration(Number(e.target.value))}
                          className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-stone-100"
                        >
                          <option value={1}>1 Week Only</option>
                          <option value={2}>2 Weeks</option>
                          <option value={4}>4 Weeks (1 Month)</option>
                          <option value={6}>6 Weeks</option>
                          <option value={8}>8 Weeks (2 Months)</option>
                          <option value={12}>12 Weeks (3 Months)</option>
                        </select>
                      </div>

                      <div>
                        <StudioTimeslotSelect
                          value={newSlotTime}
                          onChange={setNewSlotTime}
                          isInstructor={true}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddSlot(false)}
                        className="flex-1 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-2xl bg-emerald-800 text-white font-bold shadow-md hover:bg-emerald-900 transition-colors"
                      >
                        Confirm &amp; Schedule
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
