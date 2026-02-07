import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutRoutine } from '../types';
import { WORKOUTS } from '../constants';
import { addXP, updateStats, saveExerciseVideo, getExerciseVideo } from '../services/storageService';
import { generateVeoVideo, checkApiKey, requestApiKey } from '../services/veoService';
import { Button } from '../components/Button';
import { Play, Timer, ArrowLeft, Trophy, Pause, Maximize2, X, List, Clock, Activity, Sparkles, Wand2, Loader2, Video as VideoIcon } from 'lucide-react';

const DEFAULT_EXERCISE_IMAGE = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop";

const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Image conversion failed", error);
    throw error;
  }
};

const Confetti = () => {
  const [particles] = useState(() => 
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      color: ['#bef264', '#3b82f6', '#a855f7', '#facc15'][Math.floor(Math.random() * 4)],
      size: 6 + Math.random() * 6,
      rotation: Math.random() * 360
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute rounded-sm opacity-80"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s infinite`
          }}
        />
      ))}
    </div>
  );
};

interface Props {
  user: UserProfile;
  refreshUser: () => void;
  onBack: () => void;
}

export const WorkoutScreen: React.FC<Props> = ({ user, refreshUser, onBack }) => {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutRoutine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Video Generation States
  const [cachedVideoUrl, setCachedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const recommendedWorkouts = WORKOUTS.filter(w => user.level >= w.minLevel);

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      handleNextExercise();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Load video when exercise changes
  useEffect(() => {
    if (activeWorkout) {
      const currentEx = activeWorkout.exercises[currentExerciseIndex];
      const savedVideo = getExerciseVideo(currentEx.id);
      setCachedVideoUrl(savedVideo);
    }
  }, [currentExerciseIndex, activeWorkout]);

  const startWorkout = (workout: WorkoutRoutine) => {
    setActiveWorkout(workout);
    setIsPlaying(true);
    setCurrentExerciseIndex(0);
    setTimeLeft(workout.exercises[0].durationSec);
    setIsCompleted(false);
    setShowDetails(false);
  };

  const handleNextExercise = () => {
    if (!activeWorkout) return;
    if (currentExerciseIndex < activeWorkout.exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeLeft(activeWorkout.exercises[nextIndex].durationSec);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    if (activeWorkout) {
      addXP(activeWorkout.xpReward);
      updateStats(prev => ({ ...prev, workoutsCompleted: prev.workoutsCompleted + 1 }));
      refreshUser();
    }
  };

  const handleCloseSummary = () => {
    setActiveWorkout(null);
    setIsCompleted(false);
  };

  const handleGenerateDemo = async (imageUrl: string, exerciseName: string, exerciseId: string) => {
    try {
      const hasKey = await checkApiKey();
      if (!hasKey) {
        await requestApiKey();
        // We continue optimistically or let the user click again if the prompt blocks
      }

      setIsGeneratingVideo(true);
      const base64 = await imageUrlToBase64(imageUrl);
      // Prompt engineered for fitness demonstration
      const prompt = `A 3D animated fitness character performing ${exerciseName} with perfect form, 4k render, unreal engine style, cinematic lighting, neutral studio background. Loopable movement.`;
      
      const videoUrl = await generateVeoVideo(base64, prompt);
      
      if (videoUrl) {
        saveExerciseVideo(exerciseId, videoUrl);
        setCachedVideoUrl(videoUrl);
      }
    } catch (err: any) {
       console.error(err);
       if (err.message?.includes("Requested entity was not found") || err.message?.includes("404")) {
           // Key issue
           await requestApiKey();
       } else {
           alert("Failed to generate demo. Please try again.");
       }
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  if (isCompleted && activeWorkout) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-black animate-in fade-in duration-500 relative overflow-hidden">
        <Confetti />
        
        <div className="relative mb-8 group z-10">
            <div className="absolute inset-0 bg-[#bef264]/30 blur-3xl rounded-full animate-pulse"></div>
            <Trophy size={100} className="text-[#bef264] relative z-10 animate-bounce drop-shadow-[0_0_20px_rgba(190,242,100,0.5)]" />
        </div>
        
        <h2 className="text-4xl font-black text-white mb-2">Workout Crushed!</h2>
        <p className="text-zinc-400 mb-8 z-10">System Upgraded. <span className="text-white font-bold">+{activeWorkout.xpReward} XP</span> earned.</p>

        <div className="bg-[#1c1c1e] border border-zinc-800 rounded-[32px] p-6 w-full max-w-sm mb-8 shadow-2xl z-10">
             <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                 <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Routine</span>
                 <span className="text-white font-bold">{activeWorkout.title}</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-black p-3 rounded-2xl border border-zinc-800 flex flex-col items-center">
                    <Clock size={20} className="text-blue-400 mb-1" />
                    <span className="text-2xl font-black text-white">{activeWorkout.durationMin}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Minutes</span>
                </div>
                <div className="bg-black p-3 rounded-2xl border border-zinc-800 flex flex-col items-center">
                    <Activity size={20} className="text-[#bef264] mb-1" />
                    <span className="text-2xl font-black text-white">{activeWorkout.exercises.length}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Exercises</span>
                </div>
             </div>
        </div>

        <Button onClick={handleCloseSummary} fullWidth className="z-10 shadow-[0_0_20px_rgba(190,242,100,0.3)]">Close Summary</Button>
      </div>
    );
  }

  if (activeWorkout) {
    const currentEx = activeWorkout.exercises[currentExerciseIndex];
    const displayImage = currentEx.imageUrl || DEFAULT_EXERCISE_IMAGE;

    return (
      <div className="h-full flex flex-col p-6 bg-black relative">
        {showDetails && (
            <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col p-6 animate-in slide-in-from-bottom-10 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Exercise Details</h3>
                    <button onClick={() => setShowDetails(false)} className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-white">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {!currentEx.isRest && (
                        <div className="relative w-full h-64 rounded-[32px] overflow-hidden mb-6 border-2 border-zinc-800 bg-zinc-900">
                           {cachedVideoUrl ? (
                              <video src={cachedVideoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                           ) : (
                              <img src={displayImage} alt={currentEx.name} className="w-full h-full object-cover" />
                           )}
                        </div>
                    )}
                    <h2 className="text-3xl font-black text-white mb-4">{currentEx.name}</h2>
                    <p className="text-zinc-400 mb-6 text-lg">{currentEx.description}</p>
                    {currentEx.instructions && (
                        <div className="space-y-4">
                            <h4 className="text-[#bef264] font-bold uppercase tracking-wider flex items-center gap-2">
                                <List size={16} /> Instructions
                            </h4>
                            <ul className="space-y-4">
                                {currentEx.instructions.map((step, i) => (
                                    <li key={i} className="flex gap-4 p-4 bg-[#1c1c1e] rounded-2xl">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#bef264]/20 text-[#bef264] flex items-center justify-center font-bold text-xs">{i + 1}</span>
                                        <span className="text-zinc-300 text-sm leading-relaxed">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        )}

        <div className="flex justify-between items-center mb-6 pt-4">
            <button onClick={() => { setActiveWorkout(null); setIsPlaying(false); }} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                <ArrowLeft size={20} />
            </button>
            <div className="text-white font-bold text-lg">{activeWorkout.title}</div>
            <div className="w-10"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center">
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full ${currentEx.isRest ? 'bg-blue-500/20 text-blue-400' : 'bg-[#bef264]/20 text-[#bef264]'}`}>
            {currentEx.isRest ? 'REST PERIOD' : 'ACTIVE'}
          </div>
          
          <div 
            onClick={() => !currentEx.isRest && setShowDetails(true)} 
            className={`group cursor-pointer text-center ${!currentEx.isRest ? 'active:scale-95 transition-transform' : ''}`}
          >
             <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
                {currentEx.name} 
                {!currentEx.isRest && <Maximize2 size={16} className="text-zinc-600 group-hover:text-[#bef264] transition-colors" />}
             </h2>
             {!currentEx.isRest && <p className="text-xs text-zinc-500 mb-6">(Tap for details)</p>}
          </div>

          {!currentEx.isRest ? (
             <div className="relative w-full max-w-xs aspect-square rounded-[40px] overflow-hidden mb-8 border border-zinc-800 shadow-2xl bg-zinc-900 group">
                {cachedVideoUrl ? (
                   <div className="absolute inset-0 z-10">
                      <video 
                        src={cachedVideoUrl} 
                        autoPlay 
                        loop 
                        controls
                        playsInline
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 text-[#bef264] pointer-events-none">
                         <VideoIcon size={10} /> AI Demo
                      </div>
                   </div>
                ) : (
                   <>
                      <img src={displayImage} alt={currentEx.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Overlay Controls */}
                      <div className="absolute inset-0 pointer-events-none">
                         {isGeneratingVideo ? (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in fade-in z-20 pointer-events-auto">
                               <Loader2 size={32} className="animate-spin text-[#bef264] mb-3" />
                               <p className="text-white font-bold text-sm">Generating 3D Demo...</p>
                               <p className="text-zinc-500 text-xs mt-1">Creating character animation</p>
                            </div>
                         ) : (
                            <>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 p-3 rounded-full pointer-events-auto cursor-pointer" onClick={() => setShowDetails(true)}>
                                    <Maximize2 className="text-white drop-shadow-lg" size={24} />
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleGenerateDemo(displayImage, currentEx.name, currentEx.id); }}
                                  className="absolute bottom-4 right-4 bg-[#bef264] text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all pointer-events-auto z-20 cursor-pointer border border-[#a3e635]"
                                >
                                  <Wand2 size={14} /> 3D AI Demo
                                </button>
                            </>
                         )}
                      </div>
                   </>
                )}
            </div>
          ) : (
             <div className="w-full h-32 flex items-center justify-center mb-6">
                 <p className="text-zinc-400 text-xl font-light">Breathe In. Breathe Out.</p>
             </div>
          )}
          
          <div className="mb-8 relative flex justify-center items-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="#27272a" strokeWidth="8" fill="transparent" />
              <circle cx="64" cy="64" r="58" stroke={currentEx.isRest ? '#3b82f6' : '#bef264'} strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * timeLeft) / currentEx.durationSec} className="transition-all duration-1000 ease-linear" />
            </svg>
            <span className="absolute text-4xl font-black tabular-nums text-white">{timeLeft}</span>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-zinc-900 bg-black pb-4">
          <Button variant={isPlaying ? "outline" : "primary"} fullWidth onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <span className="flex items-center justify-center gap-2"><Pause size={18} /> Pause</span> : <span className="flex items-center justify-center gap-2"><Play size={18} /> Resume</span>}
          </Button>
          <Button variant="secondary" className="px-8 bg-zinc-900" onClick={handleNextExercise}>Skip</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 pb-28 overflow-y-auto bg-black text-white">
      <div className="flex items-center justify-between mb-8 pt-4">
         <h2 className="text-2xl font-black">Train</h2>
         <span className="text-[#bef264] font-bold text-sm bg-[#bef264]/10 px-3 py-1 rounded-full">Lvl {user.level}</span>
      </div>
      
      <div className="space-y-4">
        {recommendedWorkouts.map(workout => (
          <div key={workout.id} className="bg-[#1c1c1e] rounded-[32px] p-6 hover:bg-[#2c2c2e] transition-colors cursor-pointer group" onClick={() => startWorkout(workout)}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{workout.title}</h3>
                <div className="flex gap-2">
                  {workout.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wide bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#bef264] flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  <Play size={18} fill="currentColor" />
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-zinc-500 text-sm mb-6">
              <span className="flex items-center gap-1.5"><Timer size={16} /> {workout.durationMin} min</span>
              <span className="flex items-center gap-1.5"><Activity size={16} /> {workout.exercises.length} Exercises</span>
              <span className="text-[#bef264]">+{workout.xpReward} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};