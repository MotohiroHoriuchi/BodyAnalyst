// Meal Data Types
export interface FoodMaster {
  id?: number;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number; // g
  fatPer100g: number; // g
  carbsPer100g: number; // g
  isCustom: boolean;
  createdAt: Date;
}

export interface MealItem {
  foodId: number;
  foodName: string;
  amount: number; // grams
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface MealRecord {
  id?: number;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}
