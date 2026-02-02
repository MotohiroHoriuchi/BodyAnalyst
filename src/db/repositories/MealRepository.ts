import { BaseRepository } from './BaseRepository';
import { MealRecord, FoodMaster } from '../../types/meal';
import { IStorageAdapter } from '../interfaces/IStorageAdapter';

const MEALS_COLLECTION = 'MealRecords';
const FOODS_COLLECTION = 'FoodMaster';

export class MealRepository extends BaseRepository<MealRecord> {
  constructor(adapter: IStorageAdapter) {
    super(adapter);
  }

  async getAllMeals(forceRefresh = false): Promise<MealRecord[]> {
    const records = await this.fetchWithCache(MEALS_COLLECTION, undefined, forceRefresh);
    return records.map(this.mapToMealRecord).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async findMealsByDateRange(start: Date, end: Date): Promise<MealRecord[]> {
    const all = await this.getAllMeals();
    return all.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
    });
  }

  async findMealsByDate(date: string): Promise<MealRecord[]> {
    const all = await this.getAllMeals();
    return all.filter(meal => meal.date === date);
  }

  async saveMeal(meal: MealRecord): Promise<void> {
    const data = {
      ...meal,
      items: JSON.stringify(meal.items),
      createdAt: meal.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (meal.id) {
      await this.adapter.update(MEALS_COLLECTION, String(meal.id), data);
    } else {
      await this.adapter.create(MEALS_COLLECTION, data);
    }

    this.invalidateCache(MEALS_COLLECTION);
  }

  async deleteMeal(id: number): Promise<void> {
    await this.adapter.delete(MEALS_COLLECTION, String(id));
    this.invalidateCache(MEALS_COLLECTION);
  }

  // Food Master operations
  async getAllFoods(forceRefresh = false): Promise<FoodMaster[]> {
    const records = await this.fetchWithCache(FOODS_COLLECTION, undefined, forceRefresh);
    return records.map(this.mapToFoodMaster);
  }

  async searchFoods(query: string): Promise<FoodMaster[]> {
    const all = await this.getAllFoods();
    const lowerQuery = query.toLowerCase();
    return all.filter(food =>
      food.name.toLowerCase().includes(lowerQuery)
    );
  }

  async saveFood(food: FoodMaster): Promise<void> {
    const data = {
      ...food,
      createdAt: food.createdAt || new Date(),
    };

    if (food.id) {
      await this.adapter.update(FOODS_COLLECTION, String(food.id), data);
    } else {
      await this.adapter.create(FOODS_COLLECTION, data);
    }

    this.invalidateCache(FOODS_COLLECTION);
  }

  private mapToMealRecord(data: any): MealRecord {
    let items = [];
    try {
      items = typeof data.items === 'string'
        ? JSON.parse(data.items)
        : data.items || [];
    } catch (e) {
      console.error('Error parsing meal items:', e);
    }

    return {
      id: data.id ? Number(data.id) : undefined,
      date: data.date,
      mealType: data.mealType,
      items,
      totalCalories: Number(data.totalCalories || 0),
      totalProtein: Number(data.totalProtein || 0),
      totalFat: Number(data.totalFat || 0),
      totalCarbs: Number(data.totalCarbs || 0),
      memo: data.memo,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  private mapToFoodMaster(data: any): FoodMaster {
    return {
      id: data.id ? Number(data.id) : undefined,
      name: data.name,
      caloriesPer100g: Number(data.caloriesPer100g),
      proteinPer100g: Number(data.proteinPer100g),
      fatPer100g: Number(data.fatPer100g),
      carbsPer100g: Number(data.carbsPer100g),
      isCustom: data.isCustom === 'true' || data.isCustom === true,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };
  }
}
