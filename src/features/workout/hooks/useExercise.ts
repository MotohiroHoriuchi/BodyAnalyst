import { useState, useEffect, useCallback } from 'react';
import { ExerciseMaster } from '../../../types/workout';
import { workoutRepository } from '../../../db';

export function useExercise() {
  const [exercises, setExercises] = useState<ExerciseMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExercises = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutRepository.getAllExercises(forceRefresh);
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exercises');
      console.error('Error loading exercises:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchExercises = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      return await workoutRepository.searchExercises(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search exercises');
      console.error('Error searching exercises:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveExercise = useCallback(async (exercise: ExerciseMaster) => {
    try {
      setLoading(true);
      setError(null);
      await workoutRepository.saveExercise(exercise);
      await loadExercises(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save exercise');
      console.error('Error saving exercise:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadExercises]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  return {
    exercises,
    loading,
    error,
    searchExercises,
    saveExercise,
    refresh: () => loadExercises(true),
  };
}
