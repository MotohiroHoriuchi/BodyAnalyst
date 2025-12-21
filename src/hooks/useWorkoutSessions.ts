import { useLiveQuery } from 'dexie-react-hooks';
import { db, WorkoutExercise } from '../db/database';
import { getToday } from '../utils/dateUtils';
import { calculateTotalVolume } from '../utils/calculations';

export function useWorkoutSessions() {
  const sessions = useLiveQuery(() =>
    db.workoutSessions.orderBy('date').reverse().toArray()
  );

  const todaySession = useLiveQuery(() =>
    db.workoutSessions.where('date').equals(getToday()).first()
  );

  const recentSessions = useLiveQuery(() =>
    db.workoutSessions.orderBy('date').reverse().limit(10).toArray()
  );

  const startSession = async () => {
    const now = new Date();
    const today = getToday();

    // 同じ日付のセッションがあれば、それを再開する（終了済みでも）
    const existingSession = await db.workoutSessions.where('date').equals(today).first();
    if (existingSession) {
      // 終了済みの場合は再開扱いにする（endTimeをクリア）
      if (existingSession.endTime) {
        await db.workoutSessions.update(existingSession.id!, {
          endTime: undefined,
          updatedAt: now,
        });
      }
      return existingSession.id;
    }

    return await db.workoutSessions.add({
      date: today,
      startTime: now,
      exercises: [],
      totalVolume: 0,
      createdAt: now,
      updatedAt: now,
    });
  };

  const endSession = async (id: number) => {
    await db.workoutSessions.update(id, {
      endTime: new Date(),
      updatedAt: new Date(),
    });
  };

  const addExercise = async (sessionId: number, exercise: WorkoutExercise) => {
    const session = await db.workoutSessions.get(sessionId);
    if (!session) return;

    const updatedExercises = [...session.exercises, exercise];
    const totalVolume = calculateTotalVolume(updatedExercises);

    await db.workoutSessions.update(sessionId, {
      exercises: updatedExercises,
      totalVolume,
      updatedAt: new Date(),
    });
  };

  const updateExercise = async (
    sessionId: number,
    exerciseIndex: number,
    exercise: WorkoutExercise
  ) => {
    const session = await db.workoutSessions.get(sessionId);
    if (!session) return;

    const updatedExercises = [...session.exercises];
    updatedExercises[exerciseIndex] = exercise;
    const totalVolume = calculateTotalVolume(updatedExercises);

    await db.workoutSessions.update(sessionId, {
      exercises: updatedExercises,
      totalVolume,
      updatedAt: new Date(),
    });
  };

  const removeExercise = async (sessionId: number, exerciseIndex: number) => {
    const session = await db.workoutSessions.get(sessionId);
    if (!session) return;

    const updatedExercises = session.exercises.filter((_, i) => i !== exerciseIndex);
    const totalVolume = calculateTotalVolume(updatedExercises);

    await db.workoutSessions.update(sessionId, {
      exercises: updatedExercises,
      totalVolume,
      updatedAt: new Date(),
    });
  };

  const updateMemo = async (sessionId: number, memo: string) => {
    await db.workoutSessions.update(sessionId, {
      memo,
      updatedAt: new Date(),
    });
  };

  const deleteSession = async (id: number) => {
    await db.workoutSessions.delete(id);
  };

  const getSessionByDate = async (date: string) => {
    return await db.workoutSessions.where('date').equals(date).first();
  };

  return {
    sessions,
    todaySession,
    recentSessions,
    startSession,
    endSession,
    addExercise,
    updateExercise,
    removeExercise,
    updateMemo,
    deleteSession,
    getSessionByDate,
    isLoading: sessions === undefined,
  };
}
