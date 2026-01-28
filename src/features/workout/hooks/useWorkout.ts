import { useState, useEffect, useCallback } from 'react';
import { WorkoutSession } from '../../../types/workout';
import { workoutRepository } from '../../../db';

export function useWorkout() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutRepository.getAllSessions(forceRefresh);
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workout sessions');
      console.error('Error loading workout sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = useCallback(async (session: WorkoutSession) => {
    try {
      setLoading(true);
      setError(null);
      await workoutRepository.saveSession(session);
      await loadSessions(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workout session');
      console.error('Error saving workout session:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadSessions]);

  const deleteSession = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await workoutRepository.deleteSession(id);
      await loadSessions(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workout session');
      console.error('Error deleting workout session:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadSessions]);

  const getSessionsByDateRange = useCallback(async (start: Date, end: Date) => {
    try {
      setLoading(true);
      setError(null);
      return await workoutRepository.findSessionsByDateRange(start, end);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workout sessions');
      console.error('Error loading workout sessions by date range:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getLatestSession = useCallback((): WorkoutSession | null => {
    return sessions.length > 0 ? sessions[0] : null;
  }, [sessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    loading,
    error,
    saveSession,
    deleteSession,
    getSessionsByDateRange,
    getLatestSession,
    refresh: () => loadSessions(true),
  };
}
