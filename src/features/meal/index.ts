// Meal Module Public API
export { useMeal } from './hooks/useMeal';
export { useFoodMaster } from './hooks/useFoodMaster';
export { MealInput } from './components/MealInput';
export { MealHistory } from './components/MealHistory';
export { calculateNutrition, calculateMealTotals } from './utils/pfcCalculator';
export type { MealRecord, MealItem, FoodMaster } from './types';
