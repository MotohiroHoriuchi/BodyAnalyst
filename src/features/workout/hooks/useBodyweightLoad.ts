import { useCallback } from 'react';
import { weightRepository } from '../../../db';

/**
 * Hook to fetch the latest body weight before a workout date
 */
export function useBodyweightLoad() {
  const getBodyweightForDate = useCallback(async (workoutDate: Date): Promise<number | null> => {
    try {
      const latestWeight = await weightRepository.findLatestBeforeDate(workoutDate);
      return latestWeight ? latestWeight.weight : null;
    } catch (error) {
      console.error('Error fetching bodyweight for workout:', error);
      return null;
    }
  }, []);

  return {
    getBodyweightForDate,
  };
}
