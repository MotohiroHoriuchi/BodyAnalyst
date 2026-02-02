import { useState, useEffect, useCallback } from 'react';
import { MealRecord } from '../../../types/meal';
import { mealRepository } from '../../../db';

export function useMeal() {
  const [records, setRecords] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await mealRepository.getAllMeals(forceRefresh);
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meal records');
      console.error('Error loading meal records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveMeal = useCallback(async (meal: MealRecord) => {
    try {
      setLoading(true);
      setError(null);
      await mealRepository.saveMeal(meal);
      await loadRecords(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save meal record');
      console.error('Error saving meal record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRecords]);

  const deleteMeal = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await mealRepository.deleteMeal(id);
      await loadRecords(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete meal record');
      console.error('Error deleting meal record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRecords]);

  const getMealsByDate = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      return await mealRepository.findMealsByDate(date);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meals by date');
      console.error('Error loading meals by date:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getMealsByDateRange = useCallback(async (start: Date, end: Date) => {
    try {
      setLoading(true);
      setError(null);
      return await mealRepository.findMealsByDateRange(start, end);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meals by date range');
      console.error('Error loading meals by date range:', err);
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
    saveMeal,
    deleteMeal,
    getMealsByDate,
    getMealsByDateRange,
    refresh: () => loadRecords(true),
  };
}
