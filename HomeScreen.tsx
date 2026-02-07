import React, { useEffect, useState } from 'react';
import { UserProfile, DailyPlanItem, DailyStats, DailyInsight } from '../types';
import { loadDailyPlan, togglePlanItem, loadDailyInsight, saveDailyInsight, getWeeklyStats } from '../services/storageService';
import { generateDailyCoachInsight } from '../services/aiService';
import { Sun, Moon, Coffee, Plus, ArrowRight, Sparkles, BrainCircuit, Droplets, Footprints, Flame, Play } from 'lucide-react';

interface Props {
  user: UserProfile;
  stats: DailyStats;
  onNavigate: (screen: any) => void;
  refreshStats: () => void;
}

export const HomeScreen: React.FC<Props> = ({ user, stats, onNavigate, refreshStats }) => {
  const [plan, setPlan] = useState<DailyPlanItem[]>([]);
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    setPlan(loadDailyPlan());
    const existingInsight = loadDailyInsight();
    setInsight(existingInsight);
  }, []);

  const handleGenerateInsight = async () => {
    setGeneratingAI(true);
    const weekly = getWeeklyStats();
    const prevStats = weekly.length > 1 ? weekly[1] : null; 
    const newInsight = await generateDailyCoachInsight(user, prevStats);
    setInsight(newInsight);
    saveDailyInsight(newInsight);
    setGeneratingAI(false);
  };

  return (
    <div className="flex flex-col h-full p-6 pb-28 overflow-y-auto bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pt-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-full h-full" />
            </div>
            <div>
                <h1 className="text-xl font-bold leading-none">Hey, {user.name.split(' ')[0]}</h1>
                <p className="text-zinc-500 text-xs mt-1 font-medium">{user.fitnessLevel} • Lvl {user.level}</p>
            </div>
        </div>
        <button className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
            <BrainCircuit size={18} onClick={handleGenerateInsight} className={generatingAI ? "animate-spin text-[#bef264]" : ""} />
        </button>
      </div>

      {/* Stats Grid - 3 Columns */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#1c1c1e] rounded-[24px] p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Droplets size={20} className="text-blue-400 mb-1" />
            <span className="text-2xl font-bold">{stats.waterIntakeOz}<span className="text-xs text-zinc-500 font-normal ml-0.5">oz</span></span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Water</span>
        </div>
        <div className="bg-[#1c1c1e] rounded-[24px] p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Footprints size={20} className="text-orange-400 mb-1" />
            <span className="text-2xl font-bold">{stats.steps}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Steps</span>
        </div>
        <div className="bg-[#1c1c1e] rounded-[24px] p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#bef264]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Flame size={20} className="text-[#bef264] mb-1" />
            <span className="text-2xl font-bold">{Math.round(stats.score)}%</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Score</span>
        </div>
      </div>

      {/* Main Feature Card - "Living Room" style */}
      <div className="bg-[#1c1c1e] rounded-[32px] p-6 mb-4 relative overflow-hidden min-h-[180px] flex flex-col justify-between group cursor-pointer" onClick={() => onNavigate('workouts')}>
         {/* Background Image with Overlay */}
         <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500" 
                alt="Workout"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-[#1c1c1e]/50 to-transparent"></div>
         </div>

         <div className="relative z-10 flex justify-between items-start">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-wide">Ready to Train</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                <ArrowRight size={14} />
            </div>
         </div>

         <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-1">Morning Glow Up</h3>
            <p className="text-zinc-400 text-sm">7 min • No Equipment</p>
         </div>
      </div>

      {/* Quick Actions Title */}
      <h3 className="text-zinc-400 font-bold text-sm mb-3 px-1">Quick Actions</h3>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
            onClick={() => onNavigate('workouts')}
            className="bg-[#1c1c1e] hover:bg-[#2c2c2e] active:scale-95 transition-all rounded-[24px] p-4 flex items-center justify-between group"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-zinc-700">
                    <Play size={18} fill="currentColor" />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-sm">Start</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Workout</span>
                </div>
            </div>
        </button>

        <button 
            onClick={() => onNavigate('meals')}
            className="bg-[#1c1c1e] hover:bg-[#2c2c2e] active:scale-95 transition-all rounded-[24px] p-4 flex items-center justify-between group"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-zinc-700">
                    <Plus size={18} />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-sm">Log</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Meal</span>
                </div>
            </div>
        </button>
      </div>

      {/* Recent Activity / Plan */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-zinc-400 font-bold text-sm">Your Plan</h3>
        <button className="text-[#bef264] text-xs font-bold">View All</button>
      </div>

      <div className="bg-[#1c1c1e] rounded-[32px] p-2 space-y-1">
          {plan.slice(0, 4).map((item) => (
             <div key={item.id} className="p-3 rounded-[20px] hover:bg-white/5 flex items-center justify-between group transition-colors">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.completed ? 'bg-[#bef264]/20 text-[#bef264]' : 'bg-zinc-800 text-zinc-500'}`}>
                        {item.timeOfDay === 'Morning' ? <Sun size={18} /> : 
                         item.timeOfDay === 'Night' ? <Moon size={18} /> : <Coffee size={18} />}
                    </div>
                    <div>
                        <h4 className={`font-bold text-sm ${item.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>{item.title}</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{item.timeOfDay}</p>
                    </div>
                </div>
                <div className="pr-2">
                    <button 
                        onClick={() => togglePlanItem(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            item.completed 
                            ? 'bg-[#bef264] border-[#bef264]' 
                            : 'border-zinc-700 hover:border-[#bef264]'
                        }`}
                    >
                        {item.completed && <div className="w-2 h-2 bg-black rounded-full" />}
                    </button>
                </div>
             </div>
          ))}
      </div>

    </div>
  );
};