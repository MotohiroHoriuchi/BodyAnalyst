import { useState, useEffect, useCallback } from 'react';
import { FoodMaster } from '../../../types/meal';
import { mealRepository } from '../../../db';

export function useFoodMaster() {
  const [foods, setFoods] = useState<FoodMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFoods = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await mealRepository.getAllFoods(forceRefresh);
      setFoods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load foods');
      console.error('Error loading foods:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFoods = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      return await mealRepository.searchFoods(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search foods');
      console.error('Error searching foods:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFood = useCallback(async (food: FoodMaster) => {
    try {
      setLoading(true);
      setError(null);
      await mealRepository.saveFood(food);
      await loadFoods(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save food');
      console.error('Error saving food:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadFoods]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  return {
    foods,
    loading,
    error,
    searchFoods,
    saveFood,
    refresh: () => loadFoods(true),
  };
}
