import { useLiveQuery } from 'dexie-react-hooks';
import { db, WeightRecord } from '../db/database';
import { getToday, getDateRange } from '../utils/dateUtils';

export function useWeightRecords() {
  const records = useLiveQuery(() =>
    db.weightRecords.orderBy('date').reverse().toArray()
  );

  const todayRecord = useLiveQuery(() =>
    db.weightRecords.where('date').equals(getToday()).first()
  );

  const recentRecords = useLiveQuery(() =>
    db.weightRecords.orderBy('date').reverse().limit(7).toArray()
  );

  const addRecord = async (record: Omit<WeightRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const existingRecord = await db.weightRecords.where('date').equals(record.date).first();

    if (existingRecord) {
      await db.weightRecords.update(existingRecord.id!, {
        ...record,
        updatedAt: now,
      });
      return existingRecord.id;
    }

    return await db.weightRecords.add({
      ...record,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateRecord = async (id: number, updates: Partial<WeightRecord>) => {
    await db.weightRecords.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  };

  const deleteRecord = async (id: number) => {
    await db.weightRecords.delete(id);
  };

  const getRecordByDate = async (date: string) => {
    return await db.weightRecords.where('date').equals(date).first();
  };

  const getRecordsInRange = async (days: number) => {
    const dates = getDateRange(days);
    return await db.weightRecords
      .where('date')
      .anyOf(dates)
      .toArray();
  };

  const getLatestRecord = async () => {
    return await db.weightRecords.orderBy('date').reverse().first();
  };

  return {
    records,
    todayRecord,
    recentRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordByDate,
    getRecordsInRange,
    getLatestRecord,
    isLoading: records === undefined,
  };
}
