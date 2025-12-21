import { useLiveQuery } from 'dexie-react-hooks';
import { db, ExerciseMaster } from '../db/database';

export function useExerciseMaster() {
  const exercises = useLiveQuery(() =>
    db.exerciseMaster.orderBy('bodyPart').toArray()
  );

  const exercisesByBodyPart = useLiveQuery(async () => {
    const all = await db.exerciseMaster.toArray();
    const grouped: Record<string, ExerciseMaster[]> = {};

    all.forEach(exercise => {
      if (!grouped[exercise.bodyPart]) {
        grouped[exercise.bodyPart] = [];
      }
      grouped[exercise.bodyPart].push(exercise);
    });

    return grouped;
  });

  const searchExercises = async (query: string) => {
    if (!query.trim()) {
      return await db.exerciseMaster.orderBy('name').limit(20).toArray();
    }
    return await db.exerciseMaster
      .filter(exercise => exercise.name.toLowerCase().includes(query.toLowerCase()))
      .limit(20)
      .toArray();
  };

  const addExercise = async (exercise: Omit<ExerciseMaster, 'id' | 'createdAt' | 'isCustom'>) => {
    return await db.exerciseMaster.add({
      ...exercise,
      isCustom: true,
      createdAt: new Date(),
    });
  };

  const updateExercise = async (id: number, updates: Partial<ExerciseMaster>) => {
    await db.exerciseMaster.update(id, updates);
  };

  const deleteExercise = async (id: number) => {
    await db.exerciseMaster.delete(id);
  };

  const getExerciseById = async (id: number) => {
    return await db.exerciseMaster.get(id);
  };

  return {
    exercises,
    exercisesByBodyPart,
    searchExercises,
    addExercise,
    updateExercise,
    deleteExercise,
    getExerciseById,
    isLoading: exercises === undefined,
  };
}
