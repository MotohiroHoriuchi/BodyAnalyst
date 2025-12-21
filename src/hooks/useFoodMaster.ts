import { useLiveQuery } from 'dexie-react-hooks';
import { db, FoodMaster } from '../db/database';

export function useFoodMaster() {
  const foods = useLiveQuery(() =>
    db.foodMaster.orderBy('name').toArray()
  );

  const searchFoods = async (query: string) => {
    if (!query.trim()) {
      return await db.foodMaster.orderBy('name').limit(20).toArray();
    }
    return await db.foodMaster
      .filter(food => food.name.toLowerCase().includes(query.toLowerCase()))
      .limit(20)
      .toArray();
  };

  const addFood = async (food: Omit<FoodMaster, 'id' | 'createdAt'>) => {
    return await db.foodMaster.add({
      ...food,
      isCustom: true,
      createdAt: new Date(),
    });
  };

  const updateFood = async (id: number, updates: Partial<FoodMaster>) => {
    await db.foodMaster.update(id, updates);
  };

  const deleteFood = async (id: number) => {
    await db.foodMaster.delete(id);
  };

  const getFoodById = async (id: number) => {
    return await db.foodMaster.get(id);
  };

  return {
    foods,
    searchFoods,
    addFood,
    updateFood,
    deleteFood,
    getFoodById,
    isLoading: foods === undefined,
  };
}
