import { useLiveQuery } from 'dexie-react-hooks';
import { db, MealRecord, MealItem } from '../db/database';
import { getToday } from '../utils/dateUtils';
import { calculatePFCFromItems } from '../utils/calculations';

export function useMealRecords() {
  const todayMeals = useLiveQuery(() =>
    db.mealRecords.where('date').equals(getToday()).toArray()
  );

  const getMealsByDate = async (date: string) => {
    return await db.mealRecords.where('date').equals(date).toArray();
  };

  const addMeal = async (
    date: string,
    mealType: MealRecord['mealType'],
    items: MealItem[],
    memo?: string
  ) => {
    const now = new Date();
    const totals = calculatePFCFromItems(items);

    const existingMeal = await db.mealRecords
      .where({ date, mealType })
      .first();

    if (existingMeal) {
      const updatedItems = [...existingMeal.items, ...items];
      const updatedTotals = calculatePFCFromItems(updatedItems);

      await db.mealRecords.update(existingMeal.id!, {
        items: updatedItems,
        ...updatedTotals,
        memo: memo || existingMeal.memo,
        updatedAt: now,
      });
      return existingMeal.id;
    }

    return await db.mealRecords.add({
      date,
      mealType,
      items,
      ...totals,
      memo,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateMeal = async (id: number, items: MealItem[], memo?: string) => {
    const totals = calculatePFCFromItems(items);
    await db.mealRecords.update(id, {
      items,
      ...totals,
      memo,
      updatedAt: new Date(),
    });
  };

  const removeMealItem = async (mealId: number, itemIndex: number) => {
    const meal = await db.mealRecords.get(mealId);
    if (!meal) return;

    const updatedItems = meal.items.filter((_, i) => i !== itemIndex);
    if (updatedItems.length === 0) {
      await db.mealRecords.delete(mealId);
    } else {
      await updateMeal(mealId, updatedItems, meal.memo);
    }
  };

  const deleteMeal = async (id: number) => {
    await db.mealRecords.delete(id);
  };

  const getTodayTotals = () => {
    if (!todayMeals) return { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbs: 0 };

    return todayMeals.reduce(
      (acc, meal) => ({
        totalCalories: acc.totalCalories + meal.totalCalories,
        totalProtein: acc.totalProtein + meal.totalProtein,
        totalFat: acc.totalFat + meal.totalFat,
        totalCarbs: acc.totalCarbs + meal.totalCarbs,
      }),
      { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbs: 0 }
    );
  };

  return {
    todayMeals,
    getMealsByDate,
    addMeal,
    updateMeal,
    removeMealItem,
    deleteMeal,
    getTodayTotals,
    isLoading: todayMeals === undefined,
  };
}
