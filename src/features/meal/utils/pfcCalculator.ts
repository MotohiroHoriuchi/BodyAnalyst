import { FoodMaster, MealItem } from '../../../types/meal';

/**
 * Calculate nutritional values for a given amount of food
 */
export function calculateNutrition(
  food: FoodMaster,
  amountInGrams: number
): Omit<MealItem, 'foodId' | 'foodName' | 'amount'> {
  const multiplier = amountInGrams / 100;

  return {
    calories: Math.round(food.caloriesPer100g * multiplier),
    protein: Math.round(food.proteinPer100g * multiplier * 10) / 10,
    fat: Math.round(food.fatPer100g * multiplier * 10) / 10,
    carbs: Math.round(food.carbsPer100g * multiplier * 10) / 10,
  };
}

/**
 * Calculate total nutrition from meal items
 */
export function calculateMealTotals(items: MealItem[]) {
  return items.reduce(
    (totals, item) => ({
      totalCalories: totals.totalCalories + item.calories,
      totalProtein: Math.round((totals.totalProtein + item.protein) * 10) / 10,
      totalFat: Math.round((totals.totalFat + item.fat) * 10) / 10,
      totalCarbs: Math.round((totals.totalCarbs + item.carbs) * 10) / 10,
    }),
    { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbs: 0 }
  );
}
