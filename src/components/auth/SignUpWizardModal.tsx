import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StudioLogo } from '../common/StudioLogo';
import {
  User,
  Mail,
  Lock,
  Phone,
  Scale,
  Ruler,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  X
} from 'lucide-react';

interface SignUpWizardModalProps {
  onCancel: () => void;
}

export const SignUpWizardModal: React.FC<SignUpWizardModalProps> = ({ onCancel }) => {
  const { registerUser } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Step 1: Profile & Contact
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Live in-app Camera stream states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop media stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Step 2: Physical Metrics (Height, Weight, Age, Gender)
  const [height, setHeight] = useState<string>('165 cm');
  const [weight, setWeight] = useState<string>('60 kg');
  const [age, setAge] = useState<string>('28');
  const [gender, setGender] = useState<string>('Female');

  // Step 3: Goals & Experience
  const [fitnessGoal, setFitnessGoal] = useState<string>('Core Strength & Posture');
  const [experienceLevel, setExperienceLevel] = useState<string>('Beginner (First Time)');
  const [dietaryPreference, setDietaryPreference] = useState<string>('Vegetarian');

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

  const validateStep = (step: number): boolean => {
    setErrorMsg('');
    if (step === 1) {
      if (!displayName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return false;
      }
      if (!password || password.length < 4) {
        setErrorMsg('Please choose a password with at least 4 characters.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!height.trim() || !weight.trim()) {
        setErrorMsg('Please specify your height and weight.');
        return false;
      }
      return true;
    }
    return true;
  };

  // Camera stream activation with seamless fallback to file capture
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

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  const handleSubmit = () => {
    const cleanUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
    registerUser(displayName.trim(), email.trim(), cleanUsername, 'client', {
      avatarUrl: avatarUrl || undefined,
      phone: phone.trim(),
      height: height.trim(),
      weight: weight.trim(),
      age: age.trim(),
      gender,
      fitnessGoal,
      experienceLevel,
      dietaryPreference
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#FAF6F0] rounded-3xl shadow-2xl border border-[#D5C0A4] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Wizard Header & Stepper */}
        <div className="p-5 border-b border-[#EAE1D4] bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <StudioLogo size="sm" variant="transparent" withRing className="bg-[#FAF6F0]" />
              <div>
                <h2 className="font-serif font-bold text-base text-[#2D251E] leading-tight">
                  New Member Setup
                </h2>
                <p className="text-[11px] text-[#786B5D]">RC Pilates &amp; Fitness Studio</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F2E9DC] text-[#7B6244] border border-[#E6D7C3]">
              Step {currentStep} of 3
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 1 ? 'bg-[#675137]' : 'bg-[#EAE1D4]'}`} />
            <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 2 ? 'bg-[#675137]' : 'bg-[#EAE1D4]'}`} />
            <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 3 ? 'bg-[#675137]' : 'bg-[#EAE1D4]'}`} />
          </div>
        </div>

        {/* Wizard Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-[#FBF2F1] rounded-2xl border border-[#EED4D2] text-[#A85A52] text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Hidden File Inputs for Gallery & Native Camera Capture */}
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

          {/* ═══════════════════════════════════════════════════════════
              STEP 1: PERSONAL PROFILE & CONTACT
              ═══════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#2D251E]">
                  Create Your Studio Account
                </h3>
                <p className="text-xs text-[#786B5D] mt-0.5">
                  Let’s start with your contact details for class bookings and studio reminders.
                </p>
              </div>

              {/* Profile Photo Selection (Camera or Gallery) */}
              <div className="p-4 rounded-3xl bg-white border border-[#EAE1D4] shadow-xs space-y-3">
                <div className="flex items-center gap-3.5">
                  {/* Photo Preview Circle */}
                  <div className="relative w-20 h-20 rounded-full bg-[#FAF6F0] border-2 border-dashed border-[#D5C0A4] flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#A68B69] p-2 text-center">
                        <User className="w-8 h-8 text-[#A68B69]/60" />
                        <span className="text-[9px] font-bold text-[#A68B69] mt-0.5">Photo</span>
                      </div>
                    )}
                    {avatarUrl && (
                      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                    )}
                  </div>

                  {/* Actions & Guidance */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#2D251E] block">
                          Profile Photo <span className="text-[#A68B69] font-normal">(Optional)</span>
                        </span>
                        <p className="text-[11px] text-[#786B5D] leading-tight">
                          Take a selfie or choose from your gallery.
                        </p>
                      </div>
                      {avatarUrl && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Photo Added
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleOpenCamera}
                        className="px-3 py-1.5 rounded-xl bg-[#675137] hover:bg-[#53402B] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Use Camera</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#F2E9DC] text-[#675137] font-bold text-[11px] flex items-center gap-1.5 border border-[#D5C0A4] shadow-xs transition-all active:scale-95"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>From Gallery</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl('')}
                          className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3E31] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#A68B69]" />
                    <input
                      type="text"
                      placeholder="e.g. Elena Vance"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white border border-[#EAE1D4] text-xs text-[#2D251E] focus:outline-none focus:ring-2 focus:ring-[#675137]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3E31] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#A68B69]" />
                    <input
                      type="email"
                      placeholder="elena@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white border border-[#EAE1D4] text-xs text-[#2D251E] focus:outline-none focus:ring-2 focus:ring-[#675137]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3E31] mb-1">
                    Phone / WhatsApp <span className="text-[#A68B69] font-normal">(for 45m class notifications)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#A68B69]" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white border border-[#EAE1D4] text-xs text-[#2D251E] focus:outline-none focus:ring-2 focus:ring-[#675137]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3E31] mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#A68B69]" />
                    <input
                      type="password"
                      placeholder="At least 4 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white border border-[#EAE1D4] text-xs text-[#2D251E] focus:outline-none focus:ring-2 focus:ring-[#675137]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 2: BODY & PHYSICAL METRICS (HEIGHT, WEIGHT, AGE)
              ═══════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#2D251E]">
                  Physical Metrics &amp; Body Profile
                </h3>
                <p className="text-xs text-[#786B5D] mt-0.5">
                  Instructor Radhika calibrates your Reformer carriage spring tensions and studio nutrition based on these stats.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Height */}
                <div className="p-3.5 bg-white rounded-2xl border border-[#EAE1D4] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A3E31]">
                    <Ruler className="w-4 h-4 text-[#A68B69]" />
                    <span>Height</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 165 cm or 5'5&quot;"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#FAF6F0] border border-[#E6D7C3] text-xs text-[#2D251E] font-semibold focus:outline-none focus:ring-2 focus:ring-[#675137]"
                  />
                  <p className="text-[10px] text-[#A68B69]">Reformer carriage setup</p>
                </div>

                {/* Weight */}
                <div className="p-3.5 bg-white rounded-2xl border border-[#EAE1D4] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A3E31]">
                    <Scale className="w-4 h-4 text-[#A68B69]" />
                    <span>Current Weight</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 60 kg"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#FAF6F0] border border-[#E6D7C3] text-xs text-[#2D251E] font-semibold focus:outline-none focus:ring-2 focus:ring-[#675137]"
                  />
                  <p className="text-[10px] text-[#A68B69]">Spring load resistance</p>
                </div>

                {/* Age */}
                <div className="p-3.5 bg-white rounded-2xl border border-[#EAE1D4] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A3E31]">
                    <Calendar className="w-4 h-4 text-[#A68B69]" />
                    <span>Age</span>
                  </div>
                  <input
                    type="number"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#FAF6F0] border border-[#E6D7C3] text-xs text-[#2D251E] font-semibold focus:outline-none focus:ring-2 focus:ring-[#675137]"
                  />
                  <p className="text-[10px] text-[#A68B69]">Metabolic rate basis</p>
                </div>

                {/* Gender */}
                <div className="p-3.5 bg-white rounded-2xl border border-[#EAE1D4] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A3E31]">
                    <User className="w-4 h-4 text-[#A68B69]" />
                    <span>Gender</span>
                  </div>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#FAF6F0] border border-[#E6D7C3] text-xs text-[#2D251E] font-semibold focus:outline-none focus:ring-2 focus:ring-[#675137]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <p className="text-[10px] text-[#A68B69]">Physiological alignment</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 3: FITNESS GOALS & DIETARY PREFERENCE
              ═══════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#2D251E]">
                  Your Pilates &amp; Wellness Intentions
                </h3>
                <p className="text-xs text-[#786B5D] mt-0.5">
                  Tailoring your class recommendations and nutrition meal plan.
                </p>
              </div>

              {/* Primary Goal */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A3E31]">Primary Fitness Goal</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {fitnessGoalsList.map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setFitnessGoal(goal)}
                      className={`w-full p-2.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        fitnessGoal === goal
                          ? 'bg-[#F2E9DC] text-[#675137] border-[#D5C0A4]'
                          : 'bg-white text-[#2D251E] border-[#EAE1D4] hover:bg-[#F2E9DC]'
                      }`}
                    >
                      <span>{goal}</span>
                      {fitnessGoal === goal && <CheckCircle2 className="w-4 h-4 text-[#675137]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reformer Experience */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-[#4A3E31]">Reformer Experience</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {experienceLevelsList.map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperienceLevel(level)}
                      className={`w-full p-2.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        experienceLevel === level
                          ? 'bg-[#F2E9DC] text-[#675137] border-[#D5C0A4]'
                          : 'bg-white text-[#2D251E] border-[#EAE1D4] hover:bg-[#F2E9DC]'
                      }`}
                    >
                      <span>{level}</span>
                      {experienceLevel === level && <CheckCircle2 className="w-4 h-4 text-[#675137]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Preference */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-[#4A3E31]">Dietary Preference</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {dietaryPreferencesList.map(pref => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setDietaryPreference(pref)}
                      className={`p-2.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        dietaryPreference === pref
                          ? 'bg-[#F2E9DC] text-[#675137] border-[#D5C0A4]'
                          : 'bg-white text-[#2D251E] border-[#EAE1D4] hover:bg-[#F2E9DC]'
                      }`}
                    >
                      <span>{pref}</span>
                      {dietaryPreference === pref && <CheckCircle2 className="w-3.5 h-3.5 text-[#675137]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            WIZARD BOTTOM NAVIGATION BAR: BACK ON LEFT, NEXT ON RIGHT
            ═══════════════════════════════════════════════════════════ */}
        <div className="p-4 border-t border-[#EAE1D4] bg-white/80 backdrop-blur-md flex items-center justify-between">
          {/* Back button on bottom left */}
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#786B5D] hover:text-[#2D251E] hover:bg-[#F2E9DC] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          {/* Next / Complete button on bottom right */}
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#675137] hover:bg-[#52402B] text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <span>{currentStep === 3 ? 'Complete Setup' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
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
                <div className="w-full h-full rounded-full border-2 border-white/80 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>

              <button
                type="button"
                onClick={handleFlipCamera}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#675137] hover:bg-[#F2E9DC] flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Flip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
