import { useState, useEffect, useCallback } from 'react';
import { WeightRecord } from '../../../types/weight';
import { weightRepository } from '../../../db';

export function useWeight() {
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await weightRepository.getAll(forceRefresh);
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weight records');
      console.error('Error loading weight records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRecord = useCallback(async (record: WeightRecord) => {
    try {
      setLoading(true);
      setError(null);
      await weightRepository.save(record);
      await loadRecords(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save weight record');
      console.error('Error saving weight record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRecords]);

  const deleteRecord = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await weightRepository.delete(id);
      await loadRecords(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete weight record');
      console.error('Error deleting weight record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRecords]);

  const getLatestRecord = useCallback((): WeightRecord | null => {
    return records.length > 0 ? records[0] : null;
  }, [records]);

  const getRecordsByDateRange = useCallback(async (start: Date, end: Date) => {
    try {
      setLoading(true);
      setError(null);
      return await weightRepository.findByDateRange(start, end);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weight records');
      console.error('Error loading weight records by date range:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return {
    records,
    loading,
    error,
    saveRecord,
    deleteRecord,
    getLatestRecord,
    getRecordsByDateRange,
    refresh: () => loadRecords(true),
  };
}
