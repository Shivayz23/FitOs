import React, { useState } from 'react';
import { UserProfile, FitnessLevel } from '../types';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { saveUser, getTodayString } from '../services/storageService';
import { ArrowRight, Activity, Moon, Battery, CheckCircle2, Trees, Building2, Info, Check } from 'lucide-react';

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
  const [step, setStep] = useState(1);
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

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300 flex flex-col items-center pt-4 text-center">
      <Logo size="xl" className="mb-6 animate-bounce" />
      
      <div className="space-y-2 mb-4">
        <h1 className="text-3xl font-black text-white">FitOs <span className="text-[#bef264]">OS</span></h1>
        <p className="text-zinc-400 max-w-xs mx-auto">Your personal health operating system. Let's set it up.</p>
      </div>
      
      <div className="space-y-4 w-full text-left">
        <div>
          <label className="block text-zinc-400 text-sm mb-1">What should we call you?</label>
          <input 
            type="text" 
            className="w-full bg-[#1c1c1e] border border-zinc-800 rounded-[20px] p-4 text-white focus:outline-none focus:border-[#bef264] transition-colors"
            placeholder="Your Name"
            value={formData.name || ''}
            onChange={e => updateField('name', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div>
            <div className="flex items-center gap-2 mb-1">
                <label className="block text-zinc-400 text-sm">Age</label>
            </div>
            <input type="number" className="w-full bg-[#1c1c1e] border border-zinc-800 rounded-[20px] p-4 text-white focus:border-[#bef264] focus:outline-none" 
              onChange={e => updateField('age', parseInt(e.target.value))} />
           </div>
           <div>
            <div className="flex items-center gap-2 mb-1">
                <label className="block text-zinc-400 text-sm">Gender</label>
            </div>
            <select className="w-full bg-[#1c1c1e] border border-zinc-800 rounded-[20px] p-4 text-white focus:border-[#bef264] focus:outline-none appearance-none"
               onChange={e => updateField('gender', e.target.value)}>
               <option value="">Select</option>
               <option value="M">Male</option>
               <option value="F">Female</option>
               <option value="NB">Non-binary</option>
            </select>
           </div>
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-2">Where do you live?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateField('locationType', 'Village')}
              className={`p-4 rounded-[24px] border flex flex-col items-center gap-2 transition-all ${
                formData.locationType === 'Village' 
                ? 'border-[#bef264] bg-[#bef264]/10 text-[#bef264]' 
                : 'border-zinc-800 bg-[#1c1c1e] text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <Trees size={24} />
              <span className="font-bold text-sm">Village / Rural</span>
            </button>
            <button
              onClick={() => updateField('locationType', 'City')}
              className={`p-4 rounded-[24px] border flex flex-col items-center gap-2 transition-all ${
                formData.locationType === 'City' 
                ? 'border-blue-400 bg-blue-400/10 text-blue-400' 
                : 'border-zinc-800 bg-[#1c1c1e] text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <Building2 size={24} />
              <span className="font-bold text-sm">City / Town</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Your <span className="text-[#bef264]">Goals</span> 🎯</h1>
        <p className="text-zinc-400">Pick as many as you want. We'll adjust the algorithm.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GOAL_OPTIONS.map(goal => {
           const isSelected = formData.goals?.includes(goal.id);
           return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`relative h-32 rounded-[24px] overflow-hidden group transition-all duration-300 border-2 ${
                  isSelected
                  ? 'border-[#bef264] shadow-[0_0_15px_rgba(190,242,100,0.3)]'
                  : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                 {/* Image */}
                 <img src={goal.image} alt={goal.id} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 
                 {/* Gradient Overlay */}
                 <div className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-black/30' : 'bg-black/60 group-hover:bg-black/40'}`} />
                 
                 {/* Content */}
                 <div className="absolute inset-0 p-4 flex flex-col justify-end items-start">
                    <div className="flex justify-between w-full items-end gap-2">
                       <span className={`font-bold text-sm leading-tight text-left ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
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
      
       <div className="bg-[#1c1c1e] p-5 rounded-[24px] border border-zinc-800 mt-4">
          <label className="block text-zinc-400 text-sm mb-3 font-bold">
            Current Fitness Level
          </label>
          <div className="flex flex-col gap-2">
            {[FitnessLevel.BEGINNER, FitnessLevel.INTERMEDIATE, FitnessLevel.ADVANCED].map(lvl => (
              <button
                key={lvl}
                onClick={() => updateField('fitnessLevel', lvl)}
                className={`w-full p-4 rounded-[16px] text-left text-sm font-bold transition-all flex justify-between items-center ${
                  formData.fitnessLevel === lvl 
                  ? 'bg-[#bef264] text-black shadow-lg' 
                  : 'bg-black border border-zinc-800 text-zinc-400 hover:bg-zinc-800'
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Vibe Check ✨</h1>
        <p className="text-zinc-400">How does your day usually look?</p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1c1c1e] p-5 rounded-[24px] border border-zinc-800">
          <div className="flex items-center gap-2 mb-4 text-white font-bold">
            <Moon size={20} className="text-purple-400" /> Sleep Type
          </div>
          <div className="flex gap-2">
             {['Early Bird', 'Night Owl', 'Chaos'].map(opt => (
               <button key={opt} onClick={() => updateLifestyle('sleepType', opt)}
                 className={`flex-1 py-3 rounded-[16px] text-xs font-bold border transition-all ${formData.lifestyle?.sleepType === opt ? 'bg-purple-500 border-purple-500 text-white shadow-lg' : 'bg-black border-zinc-800 text-zinc-400'}`}>
                 {opt}
               </button>
             ))}
          </div>
        </div>

        <div className="bg-[#1c1c1e] p-5 rounded-[24px] border border-zinc-800">
          <div className="flex items-center gap-2 mb-4 text-white font-bold">
            <Activity size={20} className="text-blue-400" /> Screen Time
          </div>
          <div className="flex gap-2">
             {['<3h', '3-6h', '6h+'].map(opt => (
               <button key={opt} onClick={() => updateLifestyle('screenTime', opt)}
                 className={`flex-1 py-3 rounded-[16px] text-xs font-bold border transition-all ${formData.lifestyle?.screenTime === opt ? 'bg-blue-500 border-blue-500 text-white shadow-lg' : 'bg-black border-zinc-800 text-zinc-400'}`}>
                 {opt}
               </button>
             ))}
          </div>
        </div>

        <div className="bg-[#1c1c1e] p-5 rounded-[24px] border border-zinc-800">
           <div className="flex items-center gap-2 mb-4 text-white font-bold">
            <Battery size={20} className="text-[#bef264]" /> Daily Energy
          </div>
           <input type="range" className="w-full accent-[#bef264]" min="1" max="10" />
           <div className="flex justify-between text-xs text-zinc-500 mt-2 font-medium uppercase tracking-wide">
             <span>Zombie</span>
             <span>Hyper</span>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full p-6 pt-12">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-900">
        <Button 
          fullWidth 
          onClick={() => step < 3 ? setStep(step + 1) : finishOnboarding()}
          disabled={step === 1 && !formData.name}
        >
          {step === 3 ? "Install OS 🚀" : "Next Step"}
        </Button>
      </div>
    </div>
  );
};