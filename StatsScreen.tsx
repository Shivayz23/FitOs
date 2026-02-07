import React, { useState } from 'react';
import { DailyStats } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { updateStats, getWeeklyStats } from '../services/storageService';
import { Droplets, Footprints, Smartphone, Moon, Plus, Minus } from 'lucide-react';
import { VitalityVisualizer } from '../components/VitalityVisualizer';

interface Props {
  stats: DailyStats;
  refreshStats: () => void;
}

export const StatsScreen: React.FC<Props> = ({ stats, refreshStats }) => {
  const weeklyData = getWeeklyStats();
  const chartData = weeklyData.map(d => ({
    day: new Date(d.date).toLocaleDateString('en-US', {weekday: 'short'}),
    score: d.score
  }));

  const updateMetric = (key: keyof DailyStats, delta: number) => {
    updateStats(prev => ({
        ...prev,
        [key]: Math.max(0, (prev[key] as number) + delta)
    }));
    refreshStats();
  };

  return (
    <div className="h-full p-6 pb-28 overflow-y-auto bg-black text-white">
      <h2 className="text-2xl font-black mb-6 pt-4">Performance</h2>

      <VitalityVisualizer score={stats.score} />

      <div className="bg-[#1c1c1e] rounded-[32px] p-6 mb-8 h-72">
        <h3 className="text-zinc-400 text-xs font-bold mb-6 uppercase tracking-wider">Weekly Consistency</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData}>
            <XAxis dataKey="day" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <Tooltip 
                cursor={{fill: '#27272a', radius: 4}}
                contentStyle={{backgroundColor: '#18181b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'}}
                itemStyle={{color: '#fff'}}
            />
            <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={32}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#bef264' : '#27272a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-zinc-400 text-xs font-bold mb-4 uppercase tracking-wider">Quick Logs</h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Water */}
        <div className="bg-[#1c1c1e] p-5 rounded-[28px] flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
                <button onClick={() => updateMetric('waterIntakeOz', 8)} className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#bef264] hover:text-black flex items-center justify-center transition-colors">
                    <Plus size={16} />
                </button>
            </div>
            <Droplets size={24} className="text-blue-400" />
            <div>
                <div className="text-2xl font-bold">{stats.waterIntakeOz}<span className="text-sm text-zinc-500 font-normal ml-1">oz</span></div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Water Intake</div>
            </div>
        </div>

        {/* Sleep */}
         <div className="bg-[#1c1c1e] p-5 rounded-[28px] flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 flex gap-2">
                <button onClick={() => updateMetric('sleepHours', -1)} className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-colors"><Minus size={14}/></button>
                <button onClick={() => updateMetric('sleepHours', 1)} className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#bef264] hover:text-black flex items-center justify-center transition-colors"><Plus size={14}/></button>
            </div>
            <Moon size={24} className="text-purple-400" />
            <div>
                <div className="text-2xl font-bold">{stats.sleepHours}<span className="text-sm text-zinc-500 font-normal ml-1">h</span></div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Sleep Duration</div>
            </div>
        </div>
        
        {/* Screen Time */}
         <div className="bg-[#1c1c1e] p-5 rounded-[28px] flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 flex gap-2">
                <button onClick={() => updateMetric('screenTimeHours', -1)} className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#bef264] hover:text-black flex items-center justify-center transition-colors"><Minus size={14}/></button>
                <button onClick={() => updateMetric('screenTimeHours', 1)} className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-colors"><Plus size={14}/></button>
            </div>
            <Smartphone size={24} className="text-red-400" />
            <div>
                <div className="text-2xl font-bold">{stats.screenTimeHours}<span className="text-sm text-zinc-500 font-normal ml-1">h</span></div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Screen Time</div>
            </div>
        </div>

        {/* Steps */}
        <div className="bg-[#1c1c1e] p-5 rounded-[28px] flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
                <button onClick={() => updateMetric('steps', 500)} className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#bef264] hover:text-black flex items-center justify-center transition-colors">
                    <Plus size={16} />
                </button>
            </div>
            <Footprints size={24} className="text-orange-400" />
            <div>
                <div className="text-2xl font-bold">{stats.steps}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Daily Steps</div>
            </div>
        </div>
      </div>
    </div>
  );
};