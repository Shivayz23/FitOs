import React, { useState } from 'react';
import { MEALS } from '../constants';
import { updateStats } from '../services/storageService';
import { Plus, Flame, Tag } from 'lucide-react';

export const MealScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [logged, setLogged] = useState<string[]>([]);

  const filterTypes = ['All', 'Healthy', 'Balanced', 'Budget', 'Cheat Swap'];

  const handleLogMeal = (id: string, isCheat: boolean) => {
    if (!logged.includes(id)) {
        setLogged([...logged, id]);
        updateStats(prev => ({
            ...prev,
            junkFoodCravings: isCheat ? prev.junkFoodCravings - 1 : prev.junkFoodCravings 
        }));
    }
  };

  const filteredMeals = selectedType === 'All' ? MEALS : MEALS.filter(m => m.type === selectedType);

  return (
    <div className="h-full p-6 pb-28 overflow-y-auto bg-black text-white">
      <h2 className="text-2xl font-black mb-2 pt-4">Fuel</h2>
      <p className="text-zinc-500 mb-6 text-sm font-medium">Smart choices, better energy.</p>

      <div className="flex gap-2 overflow-x-auto pb-6 mb-2 no-scrollbar">
        {filterTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedType === type 
              ? 'bg-[#bef264] text-black' 
              : 'bg-[#1c1c1e] text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredMeals.map(meal => (
          <div key={meal.id} className="bg-[#1c1c1e] p-5 rounded-[32px] flex flex-col gap-3 group hover:bg-[#2c2c2e] transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-white font-bold text-lg mb-1">{meal.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-bold">
                        <Flame size={12} className={meal.calories > 400 ? "text-orange-400" : "text-zinc-500"} />
                        {meal.calories} kcal
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide
                    ${meal.type === 'Healthy' ? 'bg-green-500/10 text-green-400' : 
                      meal.type === 'Cheat Swap' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {meal.type}
                </div>
            </div>
            
            <p className="text-zinc-400 text-sm leading-relaxed">{meal.description}</p>
            
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                <div className="flex gap-2">
                    {meal.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-zinc-600 bg-black px-2 py-1 rounded-md">#{tag}</span>
                    ))}
                </div>
                <button 
                    disabled={logged.includes(meal.id)}
                    onClick={() => handleLogMeal(meal.id, meal.type === 'Cheat Swap')}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${logged.includes(meal.id) ? 'bg-zinc-800 text-zinc-500' : 'bg-[#bef264] text-black hover:scale-105'}`}>
                    <Plus size={20} />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};