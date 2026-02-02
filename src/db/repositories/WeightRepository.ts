import { BaseRepository } from './BaseRepository';
import { WeightRecord } from '../../types/weight';
import { IStorageAdapter } from '../interfaces/IStorageAdapter';

const COLLECTION_NAME = 'Weight';

export class WeightRepository extends BaseRepository<WeightRecord> {
  constructor(adapter: IStorageAdapter) {
    super(adapter);
  }

  async getAll(forceRefresh = false): Promise<WeightRecord[]> {
    const records = await this.fetchWithCache(COLLECTION_NAME, undefined, forceRefresh);
    return records.map(this.mapToWeightRecord).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async findByDateRange(start: Date, end: Date): Promise<WeightRecord[]> {
    const all = await this.getAll();
    return all.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });
  }

  async findLatestBeforeDate(date: Date): Promise<WeightRecord | null> {
    const all = await this.getAll();
    const filtered = all.filter(record => new Date(record.date) <= date);
    return filtered.length > 0 ? filtered[0] : null;
  }

  async save(record: WeightRecord): Promise<void> {
    const data = {
      ...record,
      createdAt: record.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (record.id) {
      await this.adapter.update(COLLECTION_NAME, String(record.id), data);
    } else {
      await this.adapter.create(COLLECTION_NAME, data);
    }

    this.invalidateCache(COLLECTION_NAME);
  }

  async delete(id: number): Promise<void> {
    await this.adapter.delete(COLLECTION_NAME, String(id));
    this.invalidateCache(COLLECTION_NAME);
  }

  private mapToWeightRecord(data: any): WeightRecord {
    return {
      id: data.id ? Number(data.id) : undefined,
      date: data.date,
      weight: Number(data.weight),
      bodyFatPercentage: data.bodyFatPercentage ? Number(data.bodyFatPercentage) : undefined,
      muscleMass: data.muscleMass ? Number(data.muscleMass) : undefined,
      timing: data.timing,
      memo: data.memo,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }
}
