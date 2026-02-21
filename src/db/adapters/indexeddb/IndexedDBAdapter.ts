import Dexie, { type Table } from 'dexie';
import { IStorageAdapter } from '../../interfaces/IStorageAdapter';

// Dexie database definition
class BodyAnalystDB extends Dexie {
  Weight!: Table;
  WorkoutSessions!: Table;
  ExerciseMaster!: Table;
  MealRecords!: Table;
  FoodMaster!: Table;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      Weight: '++id, date, weight, bodyFatPercentage, muscleMass, timing, memo, createdAt, updatedAt',
      WorkoutSessions: '++id, date, startTime, endTime, exercises, totalVolume, memo, createdAt, updatedAt',
      ExerciseMaster: '++id, name, bodyPart, isCompound, isCustom, createdAt',
      MealRecords: '++id, date, mealType, items, totalCalories, totalProtein, totalFat, totalCarbs, memo, createdAt, updatedAt',
      FoodMaster: '++id, name, caloriesPer100g, proteinPer100g, fatPer100g, carbsPer100g, isCustom, createdAt',
    });
  }
}

export class IndexedDBAdapter implements IStorageAdapter {
  private db: BodyAnalystDB;
  private ready = false;

  constructor(dbName = 'BodyAnalystDB') {
    this.db = new BodyAnalystDB(dbName);
  }

  async initialize(): Promise<void> {
    if (this.ready) return;
    // Open the database (creates it if it doesn't exist)
    await this.db.open();
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  async read<T = any>(collection: string, query?: any): Promise<T[]> {
    const table = this.getTable(collection);
    let records: T[];

    if (query && Object.keys(query).length > 0) {
      records = (await table.filter((item: any) => {
        return Object.keys(query).every(key => item[key] === query[key]);
      }).toArray()) as T[];
    } else {
      records = (await table.toArray()) as T[];
    }

    // Convert Dexie auto-increment id (number) to string for IStorageAdapter compatibility
    return records.map((r: any) => ({ ...r, id: String(r.id) })) as T[];
  }

  async create(collection: string, data: any): Promise<string> {
    const table = this.getTable(collection);
    // Remove id if present to let Dexie auto-increment
    const { id: _id, ...dataWithoutId } = data;
    const newId = await table.add(dataWithoutId);
    return String(newId);
  }

  async createBatch(collection: string, dataArray: any[]): Promise<string[]> {
    if (dataArray.length === 0) return [];
    const table = this.getTable(collection);
    const ids: string[] = [];
    // Use bulkAdd for performance
    const items = dataArray.map(({ id: _id, ...rest }) => rest);
    const firstId = await table.bulkAdd(items, { allKeys: true });
    // bulkAdd returns the keys; convert to strings
    const keys = Array.isArray(firstId) ? firstId : [firstId];
    keys.forEach(k => ids.push(String(k)));
    return ids;
  }

  async update(collection: string, id: string, data: any): Promise<void> {
    const table = this.getTable(collection);
    const numericId = Number(id);
    const existing = await table.get(numericId);
    if (!existing) {
      throw new Error(`Record with id ${id} not found in ${collection}`);
    }
    await table.update(numericId, data);
  }

  async delete(collection: string, id: string): Promise<void> {
    const table = this.getTable(collection);
    const numericId = Number(id);
    const existing = await table.get(numericId);
    if (!existing) {
      throw new Error(`Record with id ${id} not found in ${collection}`);
    }
    await table.delete(numericId);
  }

  private getTable(collection: string): Table {
    const table = (this.db as any)[collection] as Table | undefined;
    if (!table) {
      throw new Error(`Unknown collection: ${collection}`);
    }
    return table;
  }
}
