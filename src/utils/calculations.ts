import { MealItem, WorkoutExercise, WorkoutSet } from '../db/database';

// PFC計算
export function calculatePFCFromItems(items: MealItem[]): {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
} {
  return items.reduce(
    (acc, item) => ({
      totalCalories: acc.totalCalories + item.calories,
      totalProtein: acc.totalProtein + item.protein,
      totalFat: acc.totalFat + item.fat,
      totalCarbs: acc.totalCarbs + item.carbs,
    }),
    { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbs: 0 }
  );
}

// 食材から栄養素を計算
export function calculateNutrition(
  caloriesPer100g: number,
  proteinPer100g: number,
  fatPer100g: number,
  carbsPer100g: number,
  amount: number
): {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
} {
  const ratio = amount / 100;
  return {
    calories: Math.round(caloriesPer100g * ratio),
    protein: Math.round(proteinPer100g * ratio * 10) / 10,
    fat: Math.round(fatPer100g * ratio * 10) / 10,
    carbs: Math.round(carbsPer100g * ratio * 10) / 10,
  };
}

// トレーニングボリューム計算
export function calculateSetVolume(set: WorkoutSet): number {
  if (set.isWarmup) return 0;
  return set.weight * set.reps;
}

export function calculateExerciseVolume(exercise: WorkoutExercise): number {
  return exercise.sets.reduce((acc, set) => acc + calculateSetVolume(set), 0);
}

export function calculateTotalVolume(exercises: WorkoutExercise[]): number {
  return exercises.reduce((acc, exercise) => acc + calculateExerciseVolume(exercise), 0);
}

// PFCバランス割合計算
export function calculatePFCRatio(
  protein: number,
  fat: number,
  carbs: number
): {
  proteinRatio: number;
  fatRatio: number;
  carbsRatio: number;
} {
  const proteinCal = protein * 4;
  const fatCal = fat * 9;
  const carbsCal = carbs * 4;
  const total = proteinCal + fatCal + carbsCal;

  if (total === 0) {
    return { proteinRatio: 0, fatRatio: 0, carbsRatio: 0 };
  }

  return {
    proteinRatio: Math.round((proteinCal / total) * 100),
    fatRatio: Math.round((fatCal / total) * 100),
    carbsRatio: Math.round((carbsCal / total) * 100),
  };
}

// 目標達成率計算
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

// 体重変動計算
export function calculateWeightChange(
  currentWeight: number,
  previousWeight: number
): {
  change: number;
  isGain: boolean;
  isLoss: boolean;
} {
  const change = Math.round((currentWeight - previousWeight) * 10) / 10;
  return {
    change,
    isGain: change > 0,
    isLoss: change < 0,
  };
}
