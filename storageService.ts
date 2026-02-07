import { UserProfile, DailyStats, DailyPlanItem, DailyInsight } from '../types';
import { DAILY_TEMPLATE, LEVEL_THRESHOLDS } from '../constants';

const KEYS = {
  USER: 'fitos_user',
  STATS: 'fitos_stats',
  PLAN: 'fitos_plan',
  LAST_OPEN: 'fitos_last_open',
  DAILY_INSIGHT: 'fitos_daily_insight',
  EXERCISE_VIDEOS: 'fitos_exercise_videos'
};

export const getTodayString = (): string => new Date().toISOString().split('T')[0];

export const loadUser = (): UserProfile | null => {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const saveUser = (user: UserProfile) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const addXP = (amount: number): UserProfile => {
  const user = loadUser();
  if (!user) throw new Error("No user found");
  
  user.xp += amount;
  
  // Level up logic
  const nextLevelXp = LEVEL_THRESHOLDS[user.level] || 99999;
  if (user.xp >= nextLevelXp) {
    user.level += 1;
  }
  
  saveUser(user);
  return user;
};

export const loadTodayStats = (): DailyStats => {
  const today = getTodayString();
  const allStatsStr = localStorage.getItem(KEYS.STATS);
  const allStats: Record<string, DailyStats> = allStatsStr ? JSON.parse(allStatsStr) : {};

  if (!allStats[today]) {
    // Initialize today
    allStats[today] = {
      date: today,
      workoutsCompleted: 0,
      waterIntakeOz: 0,
      steps: 0,
      screenTimeHours: 0,
      junkFoodCravings: 0,
      sleepHours: 0,
      score: 50, // Start neutral
    };
    localStorage.setItem(KEYS.STATS, JSON.stringify(allStats));
  }
  return allStats[today];
};

export const updateStats = (updater: (prev: DailyStats) => DailyStats) => {
  const today = getTodayString();
  const allStatsStr = localStorage.getItem(KEYS.STATS);
  const allStats: Record<string, DailyStats> = allStatsStr ? JSON.parse(allStatsStr) : {};
  
  const current = allStats[today] || loadTodayStats();
  const updated = updater(current);
  
  // Calculate Score logic (simple)
  let score = 50;
  score += (updated.workoutsCompleted * 15);
  score += (updated.waterIntakeOz >= 64 ? 10 : 0);
  score += (updated.sleepHours >= 7 ? 10 : 0);
  score -= (updated.junkFoodCravings * 5);
  score = Math.min(100, Math.max(0, score));
  updated.score = score;

  allStats[today] = updated;
  localStorage.setItem(KEYS.STATS, JSON.stringify(allStats));
  return updated;
};

export const loadDailyPlan = (): DailyPlanItem[] => {
  const today = getTodayString();
  const lastOpen = localStorage.getItem(KEYS.LAST_OPEN);
  const planStr = localStorage.getItem(KEYS.PLAN);

  if (lastOpen !== today || !planStr) {
    // New day, reset plan
    localStorage.setItem(KEYS.LAST_OPEN, today);
    localStorage.setItem(KEYS.PLAN, JSON.stringify(DAILY_TEMPLATE));
    return DAILY_TEMPLATE;
  }
  
  return JSON.parse(planStr);
};

export const togglePlanItem = (id: string): DailyPlanItem[] => {
  const plan = loadDailyPlan();
  const newPlan = plan.map(item => 
    item.id === id ? { ...item, completed: !item.completed } : item
  );
  localStorage.setItem(KEYS.PLAN, JSON.stringify(newPlan));
  return newPlan;
};

export const getWeeklyStats = (): DailyStats[] => {
    const allStatsStr = localStorage.getItem(KEYS.STATS);
    if (!allStatsStr) return [];
    const allStats: Record<string, DailyStats> = JSON.parse(allStatsStr);
    
    // Convert to array and sort by date descending, take last 7
    return Object.values(allStats)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 7)
        .reverse();
}

export const saveDailyInsight = (insight: DailyInsight) => {
    localStorage.setItem(KEYS.DAILY_INSIGHT, JSON.stringify(insight));
};

export const loadDailyInsight = (): DailyInsight | null => {
    const data = localStorage.getItem(KEYS.DAILY_INSIGHT);
    if (!data) return null;
    const insight = JSON.parse(data);
    if (insight.date !== getTodayString()) return null; // Expired
    return insight;
};

export const saveExerciseVideo = (id: string, url: string) => {
  const videos = JSON.parse(localStorage.getItem(KEYS.EXERCISE_VIDEOS) || '{}');
  videos[id] = url;
  localStorage.setItem(KEYS.EXERCISE_VIDEOS, JSON.stringify(videos));
};

export const getExerciseVideo = (id: string): string | null => {
  const videos = JSON.parse(localStorage.getItem(KEYS.EXERCISE_VIDEOS) || '{}');
  return videos[id] || null;
};