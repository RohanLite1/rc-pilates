import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  X,
  Scale,
  Ruler,
  Calendar
} from 'lucide-react';
import { StudioLogo } from '../common/StudioLogo';
import {
  PackageAndScheduleSelector,
  type PackageSelectionState
} from '../common/PackageAndScheduleSelector';
import { getTodayDateString, calculateEndDateFromStart } from '../../data/packagePlans';

export const ClientOnboardingModal: React.FC = () => {
  const { currentUser, completeClientOnboarding } = useApp();

  const [step, setStep] = useState<number>(1);
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser?.avatarUrl || '');
  const [displayName, setDisplayName] = useState<string>(currentUser?.displayName || 'Studio Member');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '+91 98123 45678');

  // Step 2: Physical Vitals
  const [height, setHeight] = useState<string>(currentUser?.height || '165 cm');
  const [weight, setWeight] = useState<string>(currentUser?.weight || '60 kg');
  const [age, setAge] = useState<string>(currentUser?.age || '28');
  const [gender, setGender] = useState<string>(currentUser?.gender || 'Female');

  // Step 3: Goals & Experience
  const [fitnessGoal, setFitnessGoal] = useState<string>(currentUser?.fitnessGoal || 'Core Strength & Posture');
  const [experienceLevel, setExperienceLevel] = useState<string>(currentUser?.experienceLevel || 'Beginner (First Time on Reformer)');
  const [dietaryPreference, setDietaryPreference] = useState<string>(currentUser?.dietaryPreference || 'Vegetarian');

  // Step 4: Package & Schedule Selection
  const initialStartDate = currentUser?.startDate || getTodayDateString();
  const initialEndDate = currentUser?.endDate || calculateEndDateFromStart(initialStartDate, 1);
  const [packageSelection, setPackageSelection] = useState<PackageSelectionState>({
    packageChoice: currentUser?.membershipTier?.includes('3 Month') ? '3_month' : '1_month',
    startDate: initialStartDate,
    endDate: initialEndDate,
    preferredTimeSlot: currentUser?.preferredTimeSlot || '08:00 AM - 09:00 AM',
    isExistingCustomer: currentUser?.isExistingCustomer || false
  });

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Compute BMI
  const numHeight = parseFloat(height) || 165;
  const numWeight = parseFloat(weight) || 60;
  const bmi = (numWeight / ((numHeight / 100) * (numHeight / 100))).toFixed(1);

  const startCameraStream = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraLoading(true);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera streaming not supported.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setCameraLoading(false);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.warn(e));
        }
      }, 50);
    } catch (err) {
      console.warn('Camera stream error, falling back to device camera capture:', err);
      setCameraLoading(false);
      setIsCameraActive(false);
      cameraInputRef.current?.click();
    }
  };

  const handleOpenCamera = () => {
    startCameraStream('user');
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 400, video.videoHeight || 400);
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const sx = ((video.videoWidth || 400) - size) / 2;
      const sy = ((video.videoHeight || 400) - size) / 2;
      if (facingMode === 'user') {
        ctx.translate(400, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, sx, sy, size, size, 0, 0, 400, 400);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setAvatarUrl(dataUrl);
    }
    stopCamera();
  };

  const handleFlipCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCameraStream(nextMode);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const rawDataUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const size = Math.min(img.width, img.height);
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(dataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!currentUser || currentUser.role !== 'client' || currentUser.isOnboarded) {
    return null;
  }

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    completeClientOnboarding({
      avatarUrl: avatarUrl || undefined,
      displayName: displayName.trim() || currentUser.displayName,
      phone: phone.trim() || '+91 98123 45678',
      height: height.trim(),
      weight: weight.trim(),
      age: age.trim(),
      gender,
      fitnessGoal,
      experienceLevel,
      dietaryPreference,
      packageChoice: packageSelection.packageChoice,
      startDate: packageSelection.startDate,
      endDate: packageSelection.endDate,
      preferredTimeSlot: packageSelection.preferredTimeSlot,
      isExistingCustomer: packageSelection.isExistingCustomer
    });
  };

  const fitnessGoalsList = [
    'Core Strength & Posture',
    'Flexibility & Mobility',
    'Spine Alignment & Back Care',
    'Postnatal Recovery',
    'Athletic Conditioning'
  ];

  const experienceLevelsList = [
    'Beginner (First Time on Reformer)',
    'Intermediate (Some Reformer experience)',
    'Advanced (Classical Pilates practitioner)'
  ];

  const dietaryPreferencesList = [
    'Vegetarian',
    'Vegan',
    'Eggitarian',
    'Non-Vegetarian',
    'Jain / Satvic'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-[#FAF6F0] text-[#2D251E] rounded-3xl w-full max-w-md shadow-2xl border border-[#D5C0A4] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header - Light Oat Milk & Warm Sand */}
        <div className="p-5 bg-gradient-to-br from-[#FAF6F0] via-[#F4EFEA] to-[#EAE0D2] text-[#2D251E] border-b border-[#D5C0A4] relative overflow-hidden shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[#675137] border border-[#D5C0A4]">
              New Member Setup • Step {step} of 4
            </span>
            <div className="flex items-center gap-1.5">
              <StudioLogo size="xs" variant="transparent" />
              <span className="text-xs text-[#786B5D] font-bold">RC Pilates Studio</span>
            </div>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2D251E]">
            Welcome to RC Pilates
          </h2>
          <p className="text-xs text-[#786B5D] font-light mt-0.5">
            Let's configure your profile, reformer preferences, and wellness baseline.
          </p>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2 pt-3">
            <div className={`h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-[#675137]' : 'bg-[#D5C0A4]/40'}`} />
            <div className={`h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-[#675137]' : 'bg-[#D5C0A4]/40'}`} />
            <div className={`h-1.5 rounded-full transition-colors ${step >= 3 ? 'bg-[#675137]' : 'bg-[#D5C0A4]/40'}`} />
            <div className={`h-1.5 rounded-full transition-colors ${step >= 4 ? 'bg-[#675137]' : 'bg-[#D5C0A4]/40'}`} />
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Hidden File Inputs */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* STEP 1: Personal Details & Photo */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#2D251E]">
                  Your Profile &amp; Contact
                </h3>
                <p className="text-xs text-[#786B5D] font-medium">
                  We use your photo and phone number for reformer check-in and class reminders.
                </p>
              </div>

              {/* Profile Photo Selection (Camera or Gallery) */}
              <div className="p-4 rounded-3xl bg-white border border-[#E6D7C3] shadow-xs space-y-3">
                <div className="flex items-center gap-3.5">
                  {/* Photo Preview Circle */}
                  <div className="relative w-16 h-16 rounded-full bg-[#FAF6F0] border-2 border-dashed border-[#D5C0A4] flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#A68B69] p-2 text-center">
                        <User className="w-6 h-6 text-[#A68B69]/60" />
                      </div>
                    )}
                  </div>

                  {/* Actions & Guidance */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2D251E] block">
                        Profile Photo <span className="text-[#A68B69] font-normal">(Optional)</span>
                      </span>
                      {avatarUrl && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F2E9DC] text-[#675137] border border-[#D5C0A4]">
                          Added
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleOpenCamera}
                        className="px-2.5 py-1.5 rounded-xl bg-[#675137] hover:bg-[#53402B] text-white font-bold text-[10px] flex items-center gap-1 shadow-xs transition-all active:scale-95"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Use Camera</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#F2E9DC] text-[#675137] font-bold text-[10px] flex items-center gap-1 border border-[#D5C0A4] shadow-xs transition-all active:scale-95"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Gallery</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl('')}
                          className="p-1 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#4A3B2C] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-[#A68B69]" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-[#E6D7C3] font-medium text-xs text-[#2D251E] focus:outline-none focus:ring-1 focus:ring-[#675137]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A3B2C] mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-[#A68B69]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-[#E6D7C3] font-medium text-xs text-[#2D251E] focus:outline-none focus:ring-1 focus:ring-[#675137]"
                    />
                  </div>
                </div>

                {currentUser.email && (
                  <div className="p-3 bg-white/70 rounded-2xl border border-[#E6D7C3] space-y-0.5">
                    <p className="font-bold text-[11px] text-[#675137]">
                      Connected Studio Account:
                    </p>
                    <p className="text-[#786B5D] font-medium text-[11px]">
                      {currentUser.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Physical Vitals & Body Metrics */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#2D251E]">
                  Physical Vitals &amp; Metrics
                </h3>
                <p className="text-xs text-[#786B5D] font-medium">
                  Assists Radhika in customizing spring resistance, reformer settings, and nutrition targets.
                </p>
              </div>

              {/* Dynamic BMI Card */}
              <div className="p-4 rounded-3xl bg-white border border-[#E6D7C3] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#786B5D] uppercase tracking-wider">
                    Calculated Baseline BMI
                  </p>
                  <p className="font-serif text-2xl font-bold text-[#2D251E] mt-0.5">
                    {bmi} <span className="text-xs font-sans font-normal text-[#786B5D]">kg/m²</span>
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-[#F2E9DC] border border-[#D5C0A4] text-xs font-bold text-[#675137]">
                  {parseFloat(bmi) < 18.5
                    ? 'Delicate Frame'
                    : parseFloat(bmi) < 25
                    ? 'Healthy Alignment'
                    : 'Conditioning Focus'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Height */}
                <div>
                  <label className="block text-[11px] font-bold text-[#4A3B2C] mb-1">
                    Height
                  </label>
                  <div className="relative">
                    <Ruler className="w-4 h-4 absolute left-3 top-3 text-[#A68B69]" />
                    <input
                      type="text"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      placeholder="e.g. 165 cm"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-[#E6D7C3] font-medium text-xs text-[#2D251E] focus:outline-none focus:ring-1 focus:ring-[#675137]"
                    />
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-[11px] font-bold text-[#4A3B2C] mb-1">
                    Weight
                  </label>
                  <div className="relative">
                    <Scale className="w-4 h-4 absolute left-3 top-3 text-[#A68B69]" />
                    <input
                      type="text"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="e.g. 60 kg"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-[#E6D7C3] font-medium text-xs text-[#2D251E] focus:outline-none focus:ring-1 focus:ring-[#675137]"
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-[11px] font-bold text-[#4A3B2C] mb-1">
                    Age
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#A68B69]" />
                    <input
                      type="text"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-[#E6D7C3] font-medium text-xs text-[#2D251E] focus:outline-none focus:ring-1 focus:ring-[#675137]"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[11px] font-bold text-[#4A3B2C] mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white border border-[#E6D7C3] font-medium text-xs text-[#2D251E] focus:outline-none focus:ring-1 focus:ring-[#675137]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Studio Questionnaire & Preferences */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#2D251E]">
                  Goals &amp; Nutrition Focus
                </h3>
                <p className="text-xs text-[#786B5D] font-medium">
                  Tailors your reformer class sequence and custom studio nutrition plan.
                </p>
              </div>

              {/* Primary Fitness Goal */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#4A3B2C]">
                  Primary Fitness Goal
                </label>
                <div className="space-y-1.5">
                  {fitnessGoalsList.map(goal => {
                    const isSelected = fitnessGoal === goal;
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setFitnessGoal(goal)}
                        className={`w-full p-2.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#F2E9DC] text-[#675137] border-[#D5C0A4] shadow-xs'
                            : 'bg-white text-[#2D251E] border-[#E6D7C3] hover:border-[#D5C0A4]'
                        }`}
                      >
                        <span>{goal}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#675137]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reformer Experience */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold text-[#4A3B2C]">
                  Reformer Experience
                </label>
                <div className="space-y-1.5">
                  {experienceLevelsList.map(lvl => {
                    const isSelected = experienceLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setExperienceLevel(lvl)}
                        className={`w-full p-2.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#F2E9DC] text-[#675137] border-[#D5C0A4] shadow-xs'
                            : 'bg-white text-[#2D251E] border-[#E6D7C3] hover:border-[#D5C0A4]'
                        }`}
                      >
                        <span>{lvl}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#675137]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary Focus */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold text-[#4A3B2C]">
                  Dietary Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryPreferencesList.map(diet => {
                    const isSelected = dietaryPreference === diet;
                    return (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => setDietaryPreference(diet)}
                        className={`p-2.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#F2E9DC] text-[#675137] border-[#D5C0A4] shadow-xs'
                            : 'bg-white text-[#2D251E] border-[#E6D7C3] hover:border-[#D5C0A4]'
                        }`}
                      >
                        <span>{diet}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#675137]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Choose Studio Package & Timeslot */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <PackageAndScheduleSelector
                value={packageSelection}
                onChange={setPackageSelection}
                showExistingCustomerToggle={true}
              />
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white/90 backdrop-blur-md border-t border-[#E6D7C3] flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#786B5D] hover:bg-[#F2E9DC] transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="py-2.5 px-5 rounded-2xl bg-[#675137] hover:bg-[#52402B] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="py-3 px-5 rounded-2xl bg-[#675137] hover:bg-[#52402B] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Setup &amp; Enter Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
          <div className="relative w-full max-w-sm bg-[#FAF6F0] rounded-3xl overflow-hidden shadow-2xl border border-[#D5C0A4] flex flex-col text-[#2D251E]">
            {/* Camera Header */}
            <div className="p-4 flex items-center justify-between border-b border-[#EAE1D4] bg-white/90">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#675137]" />
                <span className="font-serif font-bold text-sm text-[#2D251E]">Take Profile Photo</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFlipCamera}
                  className="p-1.5 rounded-xl bg-[#F2E9DC] hover:bg-[#EAE0D2] text-[#675137] transition-colors"
                  title="Flip Camera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="p-1.5 rounded-xl bg-[#F2E9DC] hover:bg-[#EAE0D2] text-[#675137] transition-colors"
                  title="Close Camera"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewfinder Video Area */}
            <div className="relative aspect-square w-full bg-black overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
              />

              {/* Circular Alignment Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-60 h-60 rounded-full border-2 border-dashed border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
              </div>

              {cameraLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-semibold gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D5C0A4]" />
                  <span>Starting Camera...</span>
                </div>
              )}
            </div>

            {/* Camera Controls Bar */}
            <div className="p-5 flex items-center justify-around bg-white border-t border-[#EAE1D4]">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#786B5D] hover:text-[#2D251E]"
              >
                Cancel
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="w-16 h-16 rounded-full bg-[#675137] hover:bg-[#52402B] p-1.5 shadow-lg flex items-center justify-center transition-transform active:scale-90"
                title="Capture Photo"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white" />
                </div>
              </button>

              <button
                type="button"
                onClick={handleFlipCamera}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#786B5D] hover:text-[#2D251E]"
              >
                Flip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
