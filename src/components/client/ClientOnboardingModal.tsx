import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  Shield,
  Bell
} from 'lucide-react';
import { PilatesReformerDrawing } from '../common/StudioDrawings';

export const ClientOnboardingModal: React.FC = () => {
  const { currentUser, completeClientOnboarding } = useApp();

  const [step, setStep] = useState<number>(1);
  const [displayName, setDisplayName] = useState<string>(currentUser?.displayName || 'Studio Member');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '+91 98123 45678');
  const [fitnessGoal, setFitnessGoal] = useState<string>('Core Alignment & Posture');
  const [experienceLevel, setExperienceLevel] = useState<string>('First Timer (New to Reformer)');
  const [dietaryPreference, setDietaryPreference] = useState<string>('Vegetarian');

  if (!currentUser || currentUser.role !== 'client' || currentUser.isOnboarded) {
    return null;
  }

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    completeClientOnboarding({
      displayName: displayName.trim() || currentUser.displayName,
      phone: phone.trim() || '+91 98123 45678',
      fitnessGoal,
      experienceLevel,
      dietaryPreference
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] dark:bg-[#1A221C] text-stone-900 dark:text-[#EDF3EC] rounded-3xl w-full max-w-md shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header - Light Oat Milk & Warm Sand */}
        <div className="p-5 bg-gradient-to-br from-[#FAF6F0] via-[#F4EFEA] to-[#EAE0D2] text-[#2D251E] border-b border-[#D5C0A4] relative overflow-hidden shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[#675137] border border-[#D5C0A4]">
              New Member Setup • Step {step} of 3
            </span>
            <span className="text-xs text-[#786B5D] font-medium">RC Pilates Studio</span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2D251E] leading-tight">
            Welcome to RC Pilates
          </h2>
          <p className="text-xs text-[#786B5D] font-medium mt-1">
            Let's tailor your studio experience with instructor Radhika Chopra.
          </p>

          <PilatesReformerDrawing className="w-24 h-16 text-[#7B6244]/20 absolute -right-2 -bottom-2 pointer-events-none" />
        </div>

        {/* Step Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  Your Profile &amp; Contact
                </h3>
                <p className="text-stone-500 font-medium">
                  We use your phone number for studio schedule updates and WhatsApp alerts.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 font-medium text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 font-medium text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div className="p-3 bg-stone-100/80 dark:bg-[#242D26] rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-1">
                  <p className="font-bold text-[11px] text-stone-700 dark:text-stone-300">
                    Connected Google Account:
                  </p>
                  <p className="text-stone-500 font-medium text-[11px]">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Goals & Experience */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  Goals &amp; Fitness Focus
                </h3>
                <p className="text-stone-500 font-medium">
                  Helps Radhika design your customized reformer flow &amp; meal plan.
                </p>
              </div>

              {/* Fitness Goal */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                  Primary Fitness Goal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Core Alignment & Posture',
                    'Mindful Fat Loss & Toning',
                    'Post-Injury Rehabilitation',
                    'Spine Decompression & Flexibility'
                  ].map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setFitnessGoal(goal)}
                      className={`p-2.5 rounded-2xl border text-left text-[11px] font-bold transition-all ${
                        fitnessGoal === goal
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-600 text-emerald-950 dark:text-emerald-200 shadow-xs'
                          : 'bg-white dark:bg-[#242D26] border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                  Reformer Pilates Experience
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    'First Timer (New)',
                    'Beginner (1-5 classes)',
                    'Intermediate / Adv'
                  ].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`py-2 px-2 rounded-2xl border text-center text-[10px] font-bold transition-all ${
                        experienceLevel === lvl
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-600 text-emerald-950 dark:text-emerald-200 shadow-xs'
                          : 'bg-white dark:bg-[#242D26] border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Focus */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                  Dietary Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Vegetarian',
                    'Egg-free / Wheat-free',
                    'High Protein / Balanced',
                    'Vegan'
                  ].map(diet => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => setDietaryPreference(diet)}
                      className={`p-2.5 rounded-2xl border text-left text-[11px] font-bold transition-all ${
                        dietaryPreference === diet
                          ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-600 text-amber-950 dark:text-amber-200 shadow-xs'
                          : 'bg-white dark:bg-[#242D26] border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Studio Welcome & 45-Min Alert Overview */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  Studio Welcome &amp; Notifications
                </h3>
                <p className="text-stone-500 font-medium">
                  Here is what to expect as an RC Pilates Studio member.
                </p>
              </div>

              {/* Membership Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-900 to-stone-900 text-white space-y-2 shadow-ambient relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-emerald-200">
                    Welcome Package
                  </span>
                  <span className="font-serif font-bold text-sm">₹8,500 / mo</span>
                </div>
                <h4 className="font-serif text-xl font-bold">Mindful Core 8-Pack</h4>
                <p className="text-[11px] text-stone-300 font-light">
                  8 Reformer Sessions with Radhika Chopra • Personalized Diet Plan • Posture Assessments
                </p>
              </div>

              {/* 45-Minute Notification Feature Showcase */}
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-3xl border border-emerald-300 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-950 dark:text-emerald-200">
                  <Bell className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>Automated 45-Min Phone Alert</span>
                </div>
                <p className="text-[11px] text-emerald-900/90 dark:text-emerald-300 leading-relaxed">
                  Before every class, you will receive a phone notification with <strong>"Attending"</strong> and <strong>"Not attending"</strong> buttons. One tap confirms your spot so your instructor knows whether you're on your way!
                </p>
              </div>

              <div className="p-3 bg-stone-100/80 dark:bg-[#242D26] rounded-2xl border border-stone-200/80 dark:border-stone-700 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                  Instructor Radhika Chopra will be notified of your new profile immediately.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white/80 dark:bg-[#1C231E]/80 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="py-2.5 px-5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="py-3 px-5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Setup &amp; Enter Studio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
