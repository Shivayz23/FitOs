import React, { useState } from 'react';
import { UserProfile, FitnessLevel } from '../types';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { saveUser, getTodayString } from '../services/storageService';
import { ArrowRight, Activity, Moon, Battery, CheckCircle2, Trees, Building2, Info, Check, Play } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const GOAL_OPTIONS = [
    { id: 'Fat Loss', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop' },
    { id: 'Muscle Gain', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop' },
    { id: 'Better Sleep', image: 'https://images.unsplash.com/photo-1541781777621-af13943727dd?q=80&w=400&auto=format&fit=crop' },
    { id: 'Clear Skin', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=400&auto=format&fit=crop' },
    { id: 'Reduce Stress', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=400&auto=format&fit=crop' },
    { id: 'Better Diet', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400&auto=format&fit=crop' },
    { id: 'Run 5k', image: 'https://images.unsplash.com/photo-1552674605-469523170273?q=80&w=400&auto=format&fit=crop' },
    { id: 'Just Move', image: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=400&auto=format&fit=crop' },
];

export const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // Start at Step 0 (Welcome)
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    goals: [],
    level: 1,
    xp: 0,
    joinedDate: getTodayString(),
    locationType: 'City', // Default
    lifestyle: { sleepType: 'No fixed routine', screenTime: '3-6h', waterIntake: 'Medium' }
  });

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateLifestyle = (key: string, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      lifestyle: { ...prev.lifestyle!, [key]: value } 
    }));
  };

  const toggleGoal = (goal: string) => {
    const current = formData.goals || [];
    if (current.includes(goal)) {
      updateField('goals', current.filter(g => g !== goal));
    } else {
      updateField('goals', [...current, goal]);
    }
  };

  const finishOnboarding = () => {
    if (formData.name) {
      saveUser(formData as UserProfile);
      onComplete();
    }
  };

  // Step 0: Landing / Intro
  const renderStep0 = () => (
    <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in duration-700">
      <div className="bg-black/30 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-500">
        <Logo size="xl" className="shadow-[0_0_50px_rgba(14,165,233,0.3)]" />
      </div>
      
      {/* Corrected Title: FitOs */}
      <h1 className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
        Fit<span className="text-[#bef264]">Os</span>
      </h1>
      <p className="text-zinc-200 text-lg max-w-xs mx-auto font-medium drop-shadow-md mb-8 leading-relaxed">
        Upgrade your human hardware. <br/> The operating system for your body.
      </p>

      <Button onClick={() => setStep(1)} className="w-64 shadow-[0_0_20px_rgba(190,242,100,0.4)] animate-pulse">
        Initialize System <ArrowRight size={20} className="ml-2" />
      </Button>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 flex flex-col items-center pt-4 text-center">
      <div className="w-full text-left space-y-2 mb-4">
        <h2 className="text-3xl font-black text-white drop-shadow-md">Identify Yourself</h2>
        <p className="text-zinc-300 font-medium">Create your user profile.</p>
      </div>
      
      <div className="space-y-4 w-full text-left">
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-[32px] border border-white/10 space-y-4">
            <div>
            <label className="block text-zinc-300 text-sm mb-1 font-bold ml-1">Name</label>
            <input 
                type="text" 
                className="w-full bg-black/50 border border-white/10 rounded-[20px] p-4 text-white focus:outline-none focus:border-[#bef264] transition-colors placeholder:text-zinc-600"
                placeholder="Enter alias"
                value={formData.name || ''}
                onChange={e => updateField('name', e.target.value)}
                autoFocus
            />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-zinc-300 text-sm mb-1 font-bold ml-1">Age</label>
                <input type="number" className="w-full bg-black/50 border border-white/10 rounded-[20px] p-4 text-white focus:border-[#bef264] focus:outline-none" 
                onChange={e => updateField('age', parseInt(e.target.value))} />
            </div>
            <div>
                <label className="block text-zinc-300 text-sm mb-1 font-bold ml-1">Gender</label>
                <select className="w-full bg-black/50 border border-white/10 rounded-[20px] p-4 text-white focus:border-[#bef264] focus:outline-none appearance-none"
                onChange={e => updateField('gender', e.target.value)}>
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="NB">Non-binary</option>
                </select>
            </div>
            </div>
        </div>

        <div>
          <label className="block text-white text-sm mb-3 font-bold ml-1 drop-shadow-md">Environment</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateField('locationType', 'Village')}
              className={`p-4 rounded-[24px] border flex flex-col items-center gap-2 transition-all backdrop-blur-md ${
                formData.locationType === 'Village' 
                ? 'border-[#bef264] bg-[#bef264]/20 text-[#bef264] shadow-[0_0_15px_rgba(190,242,100,0.2)]' 
                : 'border-white/10 bg-black/40 text-zinc-400 hover:bg-black/60'
              }`}
            >
              <Trees size={24} />
              <span className="font-bold text-sm">Rural</span>
            </button>
            <button
              onClick={() => updateField('locationType', 'City')}
              className={`p-4 rounded-[24px] border flex flex-col items-center gap-2 transition-all backdrop-blur-md ${
                formData.locationType === 'City' 
                ? 'border-blue-400 bg-blue-400/20 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.2)]' 
                : 'border-white/10 bg-black/40 text-zinc-400 hover:bg-black/60'
              }`}
            >
              <Building2 size={24} />
              <span className="font-bold text-sm">Urban</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white drop-shadow-md">Set Targets 🎯</h1>
        <p className="text-zinc-300 font-medium">Configure your objectives.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto no-scrollbar pb-2">
        {GOAL_OPTIONS.map(goal => {
           const isSelected = formData.goals?.includes(goal.id);
           return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`relative h-28 rounded-[24px] overflow-hidden group transition-all duration-300 border-2 ${
                  isSelected
                  ? 'border-[#bef264] shadow-[0_0_15px_rgba(190,242,100,0.4)] scale-[1.02]'
                  : 'border-transparent opacity-80 hover:opacity-100 hover:scale-[1.02]'
                }`}
              >
                 {/* Image */}
                 <img src={goal.image} alt={goal.id} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 
                 {/* Gradient Overlay */}
                 <div className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-black/40' : 'bg-black/60 group-hover:bg-black/50'}`} />
                 
                 {/* Content */}
                 <div className="absolute inset-0 p-3 flex flex-col justify-end items-start">
                    <div className="flex justify-between w-full items-end gap-2">
                       <span className={`font-bold text-sm leading-tight text-left drop-shadow-md ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                         {goal.id}
                       </span>
                       {isSelected && (
                         <div className="bg-[#bef264] text-black rounded-full p-1 animate-in zoom-in">
                            <Check size={10} strokeWidth={4} />
                         </div>
                       )}
                    </div>
                 </div>
              </button>
           );
        })}
      </div>
      
       <div className="bg-black/40 backdrop-blur-md p-5 rounded-[24px] border border-white/10 mt-4">
          <label className="block text-zinc-300 text-sm mb-3 font-bold ml-1">
            Baseline Stats
          </label>
          <div className="flex flex-col gap-2">
            {[FitnessLevel.BEGINNER, FitnessLevel.INTERMEDIATE, FitnessLevel.ADVANCED].map(lvl => (
              <button
                key={lvl}
                onClick={() => updateField('fitnessLevel', lvl)}
                className={`w-full p-4 rounded-[16px] text-left text-sm font-bold transition-all flex justify-between items-center ${
                  formData.fitnessLevel === lvl 
                  ? 'bg-[#bef264] text-black shadow-lg' 
                  : 'bg-black/50 border border-white/10 text-zinc-400 hover:bg-black/70'
                }`}
              >
                {lvl}
                {formData.fitnessLevel === lvl && <CheckCircle2 size={16} />}
              </button>
            ))}
          </div>
        </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white drop-shadow-md">Calibration ✨</h1>
        <p className="text-zinc-300 font-medium">Optimizing for your lifestyle.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-black/40 backdrop-blur-md p-5 rounded-[24px] border border-white/10">
          <div className="flex items-center gap-2 mb-4 text-white font-bold">
            <Moon size={20} className="text-purple-400" /> Sleep Cycle
          </div>
          <div className="flex gap-2">
             {['Early Bird', 'Night Owl', 'Chaos'].map(opt => (
               <button key={opt} onClick={() => updateLifestyle('sleepType', opt)}
                 className={`flex-1 py-3 rounded-[16px] text-xs font-bold border transition-all ${formData.lifestyle?.sleepType === opt ? 'bg-purple-500 border-purple-500 text-white shadow-lg' : 'bg-black/50 border-white/10 text-zinc-400'}`}>
                 {opt}
               </button>
             ))}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-5 rounded-[24px] border border-white/10">
          <div className="flex items-center gap-2 mb-4 text-white font-bold">
            <Activity size={20} className="text-blue-400" /> Digital Exposure
          </div>
          <div className="flex gap-2">
             {['<3h', '3-6h', '6h+'].map(opt => (
               <button key={opt} onClick={() => updateLifestyle('screenTime', opt)}
                 className={`flex-1 py-3 rounded-[16px] text-xs font-bold border transition-all ${formData.lifestyle?.screenTime === opt ? 'bg-blue-500 border-blue-500 text-white shadow-lg' : 'bg-black/50 border-white/10 text-zinc-400'}`}>
                 {opt}
               </button>
             ))}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-5 rounded-[24px] border border-white/10">
           <div className="flex items-center gap-2 mb-4 text-white font-bold">
            <Battery size={20} className="text-[#bef264]" /> Power Output
          </div>
           <input type="range" className="w-full accent-[#bef264] h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" min="1" max="10" />
           <div className="flex justify-between text-xs text-zinc-400 mt-2 font-bold uppercase tracking-wide">
             <span>Low Power</span>
             <span>Max Performance</span>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
         <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-60"
            src="https://assets.mixkit.co/videos/preview/mixkit-man-training-with-kettlebell-in-gym-30960-large.mp4"
         />
         {/* Cinematic overlay gradient */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/80 to-black"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full p-6 pt-12">
        <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
            {step === 0 && renderStep0()}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </div>

        {step > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-bottom-4 duration-500">
            <Button 
                fullWidth 
                onClick={() => step < 3 ? setStep(step + 1) : finishOnboarding()}
                disabled={step === 1 && !formData.name}
                className="backdrop-blur-xl bg-[#bef264]/90 hover:bg-[#bef264]"
            >
                {step === 3 ? "Install OS 🚀" : "Next Step"}
            </Button>
            </div>
        )}
      </div>
    </div>
  );
};