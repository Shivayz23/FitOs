export type ScreenName = 'onboarding' | 'home' | 'workouts' | 'meals' | 'stats' | 'settings';

export enum FitnessLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  locationType: 'Village' | 'City'; // New field
  fitnessLevel: FitnessLevel;
  goals: string[];
  lifestyle: {
    sleepType: string;
    screenTime: string;
    waterIntake: string;
  };
  xp: number;
  level: number;
  joinedDate: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  workoutsCompleted: number;
  waterIntakeOz: number;
  steps: number;
  screenTimeHours: number;
  junkFoodCravings: number;
  sleepHours: number;
  score: number; // 0-100
}

export interface Exercise {
  id: string;
  name: string;
  durationSec: number;
  reps?: string;
  description: string;
  isRest?: boolean;
  imageUrl?: string;
  instructions?: string[];
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  minLevel: number;
  durationMin: number;
  tags: string[];
  exercises: Exercise[];
  xpReward: number;
}

export interface MealOption {
  id: string;
  name: string;
  calories: number;
  tags: string[]; // 'High Protein', 'Budget', 'Junk Swap'
  type: 'Healthy' | 'Balanced' | 'Budget' | 'Cheat Swap';
  description: string;
}

export interface DailyPlanItem {
  id: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  title: string;
  type: 'workout' | 'meal' | 'habit' | 'tip';
  completed: boolean;
  description: string;
}

export interface DailyInsight {
  date: string;
  vibe: string; // Short motivational quote
  workoutTip: string;
  dietHack: string;
  lifeStyleTip: string;
}