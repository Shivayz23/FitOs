import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DailyStats, DailyInsight } from "../types";
import { getTodayString } from "./storageService";

export const generateDailyCoachInsight = async (
  user: UserProfile, 
  prevStats: DailyStats | null
): Promise<DailyInsight> => {
  
  // Initialize the API client inside the function to ensure process.env.API_KEY is available
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are FitOs, a Gen Z lifestyle coach. You are authentic, concise, and use minimal slang but good vibes. 
    Your goal is to give a daily briefing based on the user's goals, stats, and living environment.
    Do not be generic. Be specific to their location (Village vs City).
  `;

  const prompt = `
    User: ${user.name}, Level ${user.level} (${user.fitnessLevel}).
    Location Environment: ${user.locationType} (CRITICAL: Adjust advice based on this).
    Goals: ${user.goals.join(', ')}.
    Lifestyle: Sleep is ${user.lifestyle.sleepType}, Screen time is ${user.lifestyle.screenTime}.
    
    Stats yesterday (if any):
    Steps: ${prevStats ? prevStats.steps : 'N/A'}
    Water: ${prevStats ? prevStats.waterIntakeOz : 'N/A'}
    Sleep: ${prevStats ? prevStats.sleepHours : 'N/A'}

    INSTRUCTIONS FOR LOCATION:
    - If user is in a VILLAGE: Suggest outdoor activities (running in fields, using farm equipment/heavy objects for lifting), eating fresh local produce/dairy, rising with the sun.
    - If user is in a CITY: Suggest gym workouts, park runs, stair climbing, meal prep for busy schedule, managing pollution/stress.

    Generate a daily briefing for today (${getTodayString()}) in JSON format containing:
    1. 'vibe': A short, punchy 1-sentence motivation.
    2. 'workoutTip': A specific training focus for today (tailored to Village/City).
    3. 'dietHack': A specific nutritional suggestion (tailored to Village/City availability).
    4. 'lifeStyleTip': A habit correction based on their screen time or sleep.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vibe: { type: Type.STRING },
            workoutTip: { type: Type.STRING },
            dietHack: { type: Type.STRING },
            lifeStyleTip: { type: Type.STRING },
          },
          required: ["vibe", "workoutTip", "dietHack", "lifeStyleTip"],
        },
      },
    });

    const json = JSON.parse(response.text || "{}");
    
    return {
        date: getTodayString(),
        vibe: json.vibe || "Let's get after it today.",
        workoutTip: json.workoutTip || "Focus on form.",
        dietHack: json.dietHack || "Drink water before meals.",
        lifeStyleTip: json.lifeStyleTip || "Put the phone down 30 mins before bed.",
    };

  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback if API fails or key is missing
    return {
        date: getTodayString(),
        vibe: "System offline. Manually override your limits.",
        workoutTip: "Stick to the basics. Consistency is key.",
        dietHack: "Eat real food. Mostly plants.",
        lifeStyleTip: "Breathe. You got this."
    };
  }
};