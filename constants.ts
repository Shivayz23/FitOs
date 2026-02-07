import { WorkoutRoutine, MealOption, DailyPlanItem } from './types';

export const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];

export const WORKOUTS: WorkoutRoutine[] = [
  {
    id: 'w1',
    title: 'Morning Glow Up',
    minLevel: 1,
    durationMin: 7,
    tags: ['Morning', 'No Equipment'],
    xpReward: 50,
    exercises: [
      { 
        id: 'e1', 
        name: 'Jumping Jacks', 
        durationSec: 45, 
        description: 'Get the blood flowing!', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop',
        instructions: [
          'Stand upright with legs together, arms at your sides.',
          'Bend your knees slightly, and jump into the air.',
          'As you jump, spread your legs to be about shoulder-width apart.',
          'Stretch your arms out and over your head.',
          'Jump back to starting position.'
        ]
      },
      { id: 'r1', name: 'Rest', durationSec: 15, description: 'Breathe.', isRest: true },
      { 
        id: 'e2', 
        name: 'High Knees', 
        durationSec: 45, 
        description: 'Knees to chest.', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
        instructions: [
          'Stand with feet hip-width apart.',
          'Lift up your left knee to your chest.',
          'Switch to lift your right knee to your chest.',
          'Continue the movement, alternating legs and moving at a sprinting or running pace.'
        ]
      },
      { id: 'r2', name: 'Rest', durationSec: 15, description: 'Chill.', isRest: true },
      { 
        id: 'e3', 
        name: 'Bodyweight Squats', 
        durationSec: 45, 
        description: 'Keep back straight.', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1cddd32e04ca?q=80&w=800&auto=format&fit=crop',
        instructions: [
          'Stand with feet shoulder-width apart.',
          'Lower your hips back and down as if sitting in a chair.',
          'Keep your chest up and back straight.',
          'Push through heels to return to start.'
        ]
      },
      { id: 'r3', name: 'Rest', durationSec: 15, description: 'Shake it out.', isRest: true },
      { 
        id: 'e4', 
        name: 'Plank', 
        durationSec: 30, 
        description: 'Hold it!', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=800&auto=format&fit=crop',
        instructions: [
          'Start on the floor on your hands and knees.',
          'Lower your forearms to the floor with elbows aligned below the shoulders.',
          'Step your feet back one at a time.',
          'Keep your body in a straight line from head to heels.'
        ]
      },
    ]
  },
  {
    id: 'w2',
    title: 'Core Crusher',
    minLevel: 3,
    durationMin: 12,
    tags: ['Core', 'Abs'],
    xpReward: 80,
    exercises: [
      { 
        id: 'c1', 
        name: 'Crunches', 
        durationSec: 45, 
        description: 'Squeeze the abs.', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=800&auto=format&fit=crop',
        instructions: [
            'Lie on your back with knees bent.',
            'Place hands behind head or crossed on chest.',
            'Lift your shoulders off the floor using your abs.',
            'Lower back down slowly.'
        ]
      },
      { 
        id: 'c2', 
        name: 'Leg Raises', 
        durationSec: 45, 
        description: 'Control the descent.', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop',
        instructions: [
            'Lie on your back, legs straight.',
            'Lift your legs upward until they are at a 90-degree angle.',
            'Slowly lower them back down without touching the floor.',
            'Keep your lower back pressed to the ground.'
        ]
      },
      { 
        id: 'c3', 
        name: 'Russian Twists', 
        durationSec: 45, 
        description: 'Twist side to side.', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
        instructions: [
            'Sit on the floor with knees bent and feet lifted.',
            'Lean back slightly until you feel your core engage.',
            'Twist your torso to the right, then to the left.',
            'Keep your movement controlled.'
        ]
      },
      { 
        id: 'c4', 
        name: 'Mountain Climbers', 
        durationSec: 45, 
        description: 'Run on the floor.', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e6d?q=80&w=800&auto=format&fit=crop',
        instructions: [
            'Start in a plank position.',
            'Drive your right knee towards your chest.',
            'Quickly switch and drive your left knee in.',
            'Keep your hips down and run your knees in and out.'
        ]
      },
    ]
  },
  {
    id: 'w3',
    title: 'Full Body Ignite',
    minLevel: 5,
    durationMin: 20,
    tags: ['HIIT', 'Sweat'],
    xpReward: 150,
    exercises: [
      { 
        id: 'f1', 
        name: 'Burpees', 
        durationSec: 45, 
        description: 'Sorry in advance.', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop',
        instructions: [
            'Start standing.',
            'Drop into a squat with hands on the ground.',
            'Kick feet back into a plank.',
            'Jump feet back to hands.',
            'Explode up into a jump.'
        ]
      },
      { 
        id: 'f2', 
        name: 'Pushups', 
        durationSec: 45, 
        description: 'Chest to floor.', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
        instructions: [
            'Start in a plank position.',
            'Lower your body until your chest nearly touches the floor.',
            'Keep elbows tucked at a 45-degree angle.',
            'Push back up to starting position.'
        ]
      },
      { 
        id: 'f3', 
        name: 'Lunges', 
        durationSec: 45, 
        description: 'Alternate legs.', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=800&auto=format&fit=crop',
        instructions: [
            'Stand tall.',
            'Step forward with one leg.',
            'Lower hips until both knees are bent at 90 degrees.',
            'Push off the front foot to return to start.',
            'Switch legs.'
        ]
      },
      { 
        id: 'f4', 
        name: 'Glute Bridges', 
        durationSec: 45, 
        description: 'Squeeze at top.', 
        isRest: false,
        imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop',
        instructions: [
            'Lie on back with knees bent and feet flat.',
            'Lift hips off the floor until knees, hips, and shoulders form a line.',
            'Squeeze glutes hard at the top.',
            'Lower back down slowly.'
        ]
      },
    ]
  }
];

export const MEALS: MealOption[] = [
  {
    id: 'm1',
    name: 'Overnight Oats',
    type: 'Healthy',
    calories: 350,
    tags: ['Budget', 'Quick', 'High Fiber'],
    description: 'Oats soaked in milk/yogurt overnight. Add banana & honey.'
  },
  {
    id: 'm2',
    name: 'Masala Omelette & Toast',
    type: 'Balanced',
    calories: 400,
    tags: ['High Protein', 'Savory'],
    description: '2 eggs, onions, chilies, turmeric. Whole wheat toast.'
  },
  {
    id: 'm3',
    name: 'Paneer/Chicken Wrap',
    type: 'Healthy',
    calories: 500,
    tags: ['High Protein', 'Lunch'],
    description: 'Grilled protein in a roti with veggies and mint chutney.'
  },
  {
    id: 'm4',
    name: 'Air Fried Fries',
    type: 'Cheat Swap',
    calories: 200,
    tags: ['Craving Killer', 'Low Oil'],
    description: 'Potato wedges with peri-peri, air fried instead of deep fried.'
  }
];

export const DAILY_TEMPLATE: DailyPlanItem[] = [
  { id: 'dp1', timeOfDay: 'Morning', title: 'Hydrate First', type: 'habit', completed: false, description: 'Drink 1 glass of water before checking phone.' },
  { id: 'dp2', timeOfDay: 'Morning', title: 'Morning Movement', type: 'workout', completed: false, description: 'Complete a quick workout.' },
  { id: 'dp3', timeOfDay: 'Afternoon', title: 'Stand Up', type: 'tip', completed: false, description: 'You have been sitting too long. Stretch for 2 mins.' },
  { id: 'dp4', timeOfDay: 'Evening', title: 'No Sugar Crash', type: 'meal', completed: false, description: 'Choose a fruit over a candy bar.' },
  { id: 'dp5', timeOfDay: 'Night', title: 'Digital Sunset', type: 'habit', completed: false, description: 'Blue light filter ON. Phone away 30m before bed.' },
];
