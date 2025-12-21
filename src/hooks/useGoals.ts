import { useLiveQuery } from 'dexie-react-hooks';
import { db, UserGoal } from '../db/database';

export function useGoals() {
  const goals = useLiveQuery(() => db.userGoals.toArray());

  const currentGoal = useLiveQuery(() =>
    db.userGoals.orderBy('id').reverse().first()
  );

  const updateGoal = async (id: number, updates: Partial<UserGoal>) => {
    await db.userGoals.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  };

  const setNewGoal = async (goal: Omit<UserGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    return await db.userGoals.add({
      ...goal,
      createdAt: now,
      updatedAt: now,
    });
  };

  return {
    goals,
    currentGoal,
    updateGoal,
    setNewGoal,
    isLoading: currentGoal === undefined,
  };
}
