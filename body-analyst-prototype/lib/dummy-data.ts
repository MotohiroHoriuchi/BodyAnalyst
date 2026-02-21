// Goal Trajectory data
export const goalTrajectoryData = [
  { week: "W1", actual: 60, projected: null, goal: 100 },
  { week: "W2", actual: 62, projected: null, goal: 100 },
  { week: "W3", actual: 63.5, projected: null, goal: 100 },
  { week: "W4", actual: 65, projected: null, goal: 100 },
  { week: "W5", actual: 66, projected: null, goal: 100 },
  { week: "W6", actual: 68, projected: null, goal: 100 },
  { week: "W7", actual: 69.5, projected: null, goal: 100 },
  { week: "W8", actual: 71, projected: null, goal: 100 },
  { week: "W9", actual: 72, projected: null, goal: 100 },
  { week: "W10", actual: 74, projected: 74, goal: 100 },
  { week: "W11", actual: null, projected: 76, goal: 100 },
  { week: "W12", actual: null, projected: 78, goal: 100 },
  { week: "W13", actual: null, projected: 80.5, goal: 100 },
  { week: "W14", actual: null, projected: 83, goal: 100 },
  { week: "W15", actual: null, projected: 85, goal: 100 },
  { week: "W16", actual: null, projected: 87.5, goal: 100 },
  { week: "W17", actual: null, projected: 90, goal: 100 },
  { week: "W18", actual: null, projected: 92, goal: 100 },
]

// Scatter plot: Frequency vs Gains
export const frequencyGainsData = [
  { restDays: 1, gain: 0.5 },
  { restDays: 1, gain: -0.2 },
  { restDays: 2, gain: 1.5 },
  { restDays: 2, gain: 2.0 },
  { restDays: 2, gain: 1.8 },
  { restDays: 3, gain: 2.5 },
  { restDays: 3, gain: 2.2 },
  { restDays: 3, gain: 1.0 },
  { restDays: 4, gain: 1.2 },
  { restDays: 4, gain: 0.8 },
  { restDays: 5, gain: 0.5 },
  { restDays: 5, gain: -0.5 },
  { restDays: 1, gain: 0.8 },
  { restDays: 2, gain: 1.2 },
  { restDays: 3, gain: 2.8 },
  { restDays: 4, gain: 1.5 },
  { restDays: 6, gain: -0.3 },
  { restDays: 3, gain: 1.9 },
]

// Bubble chart: Volume vs Intensity
export const volumeIntensityData = [
  { volume: 5000, maxWeight: 80, rpe: 6, name: "Mon" },
  { volume: 8000, maxWeight: 90, rpe: 8, name: "Tue" },
  { volume: 12000, maxWeight: 75, rpe: 7, name: "Wed" },
  { volume: 6000, maxWeight: 95, rpe: 9, name: "Thu" },
  { volume: 10000, maxWeight: 85, rpe: 7, name: "Fri" },
  { volume: 15000, maxWeight: 70, rpe: 5, name: "Sat" },
  { volume: 7000, maxWeight: 100, rpe: 10, name: "Sun" },
  { volume: 9000, maxWeight: 88, rpe: 8, name: "Mon" },
]

// Performance tags
export const performanceTags = [
  { label: "Sleep 8h+", score: 0.9 },
  { label: "Creatine", score: 0.85 },
  { label: "Caffeine", score: 0.75 },
  { label: "Hydrated", score: 0.8 },
  { label: "Low Stress", score: 0.7 },
  { label: "High Stress", score: 0.15 },
  { label: "Poor Sleep", score: 0.1 },
  { label: "Dehydrated", score: 0.2 },
  { label: "Fasted", score: 0.45 },
  { label: "Pre-workout", score: 0.65 },
  { label: "Rest Day", score: 0.55 },
  { label: "Alcohol", score: 0.05 },
]

// Workout data
export const workoutExercises = [
  {
    id: 1,
    name: "Bench Press",
    sets: [
      { set: 1, prevWeight: 70, prevReps: 10, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
      { set: 2, prevWeight: 75, prevReps: 8, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
      { set: 3, prevWeight: 80, prevReps: 6, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
      { set: 4, prevWeight: 80, prevReps: 5, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
    ],
  },
  {
    id: 2,
    name: "Incline Dumbbell Press",
    sets: [
      { set: 1, prevWeight: 26, prevReps: 12, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
      { set: 2, prevWeight: 28, prevReps: 10, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
      { set: 3, prevWeight: 30, prevReps: 8, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
    ],
  },
  {
    id: 3,
    name: "Cable Flyes",
    sets: [
      { set: 1, prevWeight: 15, prevReps: 15, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
      { set: 2, prevWeight: 17.5, prevReps: 12, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
      { set: 3, prevWeight: 17.5, prevReps: 12, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
    ],
  },
  {
    id: 4,
    name: "Tricep Pushdown",
    sets: [
      { set: 1, prevWeight: 25, prevReps: 15, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
      { set: 2, prevWeight: 30, prevReps: 12, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
      { set: 3, prevWeight: 30, prevReps: 10, weight: null as number | null, reps: null as number | null, rpe: null as number | null, completed: false },
    ],
  },
]

// Meal data
export const mealData = {
  target: { calories: 2400, protein: 180, fat: 80, carbs: 260 },
  current: { calories: 1650, protein: 132, fat: 52, carbs: 178 },
  meals: {
    breakfast: [
      { name: "Oatmeal with Banana", cal: 350, protein: 12, fat: 8, carbs: 58 },
      { name: "Protein Shake", cal: 200, protein: 40, fat: 3, carbs: 8 },
    ],
    lunch: [
      { name: "Chicken Rice Bowl", cal: 550, protein: 45, fat: 12, carbs: 62 },
      { name: "Side Salad", cal: 80, protein: 3, fat: 5, carbs: 8 },
    ],
    dinner: [
      { name: "Salmon Fillet", cal: 320, protein: 28, fat: 20, carbs: 2 },
      { name: "Brown Rice", cal: 150, protein: 4, fat: 4, carbs: 40 },
    ],
    snack: [],
  },
}

// Weight history
export const weightHistory = [
  { date: "Feb 19", weight: 72.5, bodyFat: 14.2, muscle: 33.1 },
  { date: "Feb 17", weight: 73.0, bodyFat: 14.4, muscle: 33.0 },
  { date: "Feb 15", weight: 72.8, bodyFat: 14.3, muscle: 33.0 },
  { date: "Feb 13", weight: 73.2, bodyFat: 14.5, muscle: 32.9 },
  { date: "Feb 11", weight: 73.5, bodyFat: 14.6, muscle: 32.8 },
  { date: "Feb 9", weight: 73.1, bodyFat: 14.5, muscle: 32.8 },
  { date: "Feb 7", weight: 73.8, bodyFat: 14.8, muscle: 32.7 },
]
