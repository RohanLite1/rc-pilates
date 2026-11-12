import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  Shield,
  Bell,
  Camera,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  X
} from 'lucide-react';
import { PilatesReformerDrawing } from '../common/StudioDrawings';
import { StudioLogo } from '../common/StudioLogo';

export const ClientOnboardingModal: React.FC = () => {
  const { currentUser, completeClientOnboarding } = useApp();

  const [step, setStep] = useState<number>(1);
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser?.avatarUrl || '');
  const [displayName, setDisplayName] = useState<string>(currentUser?.displayName || 'Studio Member');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '+91 98123 45678');
  const [fitnessGoal, setFitnessGoal] = useState<string>('Core Alignment & Posture');
  const [experienceLevel, setExperienceLevel] = useState<string>('First Timer (New to Reformer)');
  const [dietaryPreference, setDietaryPreference] = useState<string>('Vegetarian');

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
            <div className="flex items-center gap-1.5">
              <StudioLogo size="xs" variant="transparent" />
              <span className="text-xs text-[#786B5D] font-bold">RC Pilates Studio</span>
            </div>
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
          {/* Hidden File Inputs for Gallery & Camera */}
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

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  Your Profile &amp; Contact
                </h3>
                <p className="text-stone-500 font-medium">
                  We use your photo and phone number for reformer check-in and WhatsApp schedule updates.
                </p>
              </div>

              {/* Profile Photo Selection (Camera or Gallery) */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#242D26] border border-stone-200 dark:border-stone-700 shadow-xs space-y-3">
                <div className="flex items-center gap-3.5">
                  {/* Photo Preview Circle */}
                  <div className="relative w-16 h-16 rounded-full bg-[#FAF6F0] dark:bg-[#1A221C] border-2 border-dashed border-[#D5C0A4] flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
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
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                        Profile Photo <span className="text-[#A68B69] font-normal">(Optional)</span>
                      </span>
                      {avatarUrl && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
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
                        className="px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#1C231E] hover:bg-[#F2E9DC] text-[#675137] dark:text-[#EAE0D2] font-bold text-[10px] flex items-center gap-1 border border-[#D5C0A4] shadow-xs transition-all active:scale-95"
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
