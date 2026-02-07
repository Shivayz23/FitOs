import React from 'react';
import { ScreenName } from '../types';
import { Home, Dumbbell, Utensils, BarChart2, Grid } from 'lucide-react';

interface Props {
  current: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const Navbar: React.FC<Props> = ({ current, onNavigate }) => {
  const navItems: { id: ScreenName; icon: any; }[] = [
    { id: 'home', icon: Home },
    { id: 'workouts', icon: Dumbbell },
    { id: 'meals', icon: Utensils },
    { id: 'stats', icon: BarChart2 },
  ];

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/5 px-6 py-4 rounded-[32px] flex items-center gap-8 shadow-2xl pointer-events-auto">
        {navItems.map((item) => {
          const isActive = current === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isActive ? 'bg-[#bef264] text-black shadow-[0_0_15px_rgba(190,242,100,0.3)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </button>
          );
        })}
      </div>
    </div>
  );
};