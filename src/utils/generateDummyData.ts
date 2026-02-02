import { subDays, format, parse } from 'date-fns';
import type { WeightRecord } from '../types/weight';
import type { MealRecord } from '../types/meal';
import type { WorkoutSession, WorkoutExercise, WorkoutSet } from '../types/workout';

/**
 * Generate dummy data for the past N days
 */
export function generateDummyData(days: number = 100) {
  const weightRecords: Omit<WeightRecord, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  const mealRecords: Omit<MealRecord, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  const workoutSessions: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  const today = new Date();
  const startWeight = 75; // kg
  const targetWeight = 70; // kg

  for (let i = 0; i < days; i++) {
    const date = subDays(today, days - i - 1);
    const dateStr = format(date, 'yyyy-MM-dd');
    const progress = i / days;

    // Weight data (gradual decrease with some variation)
    const trendWeight = startWeight - (startWeight - targetWeight) * progress;
    const variation = (Math.random() - 0.5) * 1; // ±0.5kg variation
    const weight = Number((trendWeight + variation).toFixed(1));
    const bodyFatPercentage = Number((18 - progress * 3 + (Math.random() - 0.5) * 0.5).toFixed(1));

    weightRecords.push({
      date: dateStr,
      weight,
      bodyFatPercentage,
      muscleMass: Number((weight * (1 - bodyFatPercentage / 100)).toFixed(1)),
      memo: i % 10 === 0 ? '体調良好' : '',
    });

    // Meal data (3-4 meals per day)
    const mealsPerDay = Math.random() > 0.3 ? 4 : 3;
    const mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'> = [
      'breakfast',
      'lunch',
      'dinner',
    ];
    if (mealsPerDay === 4) mealTypes.push('snack');

    mealTypes.forEach((mealType) => {
      const baseCalories = mealType === 'snack' ? 150 : 500;
      const calorieVariation = (Math.random() - 0.5) * 200;
      const totalCalories = Math.round(baseCalories + calorieVariation);

      // Calculate PFC (Protein/Fat/Carbs)
      const protein = Math.round(totalCalories * 0.25 / 4); // 25% from protein (4 kcal/g)
      const fat = Math.round(totalCalories * 0.25 / 9); // 25% from fat (9 kcal/g)
      const carbs = Math.round(totalCalories * 0.5 / 4); // 50% from carbs (4 kcal/g)

      mealRecords.push({
        date: dateStr,
        mealType,
        items: [], // Empty items for dummy data
        totalCalories,
        totalProtein: protein,
        totalFat: fat,
        totalCarbs: carbs,
        memo: '',
      });
    });

    // Workout data (3-4 times per week)
    const shouldWorkout = i % 2 === 0 || Math.random() > 0.5;
    if (shouldWorkout) {
      const exercises: WorkoutExercise[] = [];

      // Randomly select 3-5 exercises
      const exercisePool = [
        { id: 1, name: 'ベンチプレス', bodyPart: 'chest' },
        { id: 2, name: 'スクワット', bodyPart: 'leg' },
        { id: 3, name: 'デッドリフト', bodyPart: 'back' },
        { id: 4, name: 'ショルダープレス', bodyPart: 'shoulder' },
        { id: 5, name: 'バーベルロウ', bodyPart: 'back' },
        { id: 6, name: 'ラットプルダウン', bodyPart: 'back' },
        { id: 7, name: 'レッグプレス', bodyPart: 'leg' },
      ];

      const numExercises = 3 + Math.floor(Math.random() * 3);
      const selectedExercises = exercisePool
        .sort(() => Math.random() - 0.5)
        .slice(0, numExercises);

      const restTimes: number[] = [];

      selectedExercises.forEach((exercise) => {
        const sets: WorkoutSet[] = [];
        const numSets = 3 + Math.floor(Math.random() * 2); // 3-4 sets
        const baseWeight = 40 + Math.floor(Math.random() * 40) + progress * 10;
        const baseTime = parse(`${dateStr} 18:00`, 'yyyy-MM-dd HH:mm', new Date());

        for (let setIndex = 0; setIndex < numSets; setIndex++) {
          const weightForSet = baseWeight + (Math.random() - 0.5) * 5;
          const reps = 8 + Math.floor(Math.random() * 5); // 8-12 reps
          const restTime = 90 + Math.floor(Math.random() * 60); // 90-150 seconds

          sets.push({
            setNumber: setIndex + 1,
            weight: Number(weightForSet.toFixed(1)),
            reps,
            rpe: 7 + Math.floor(Math.random() * 3), // 7-9 RPE
            isWarmup: setIndex === 0 && Math.random() > 0.7,
            completedAt: new Date(baseTime.getTime() + setIndex * restTime * 1000),
          });

          restTimes.push(restTime);
        }

        exercises.push({
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          bodyPart: exercise.bodyPart,
          sets,
          restTimes,
        });
      });

      // Calculate total volume
      const totalVolume = exercises.reduce((total, exercise) => {
        return (
          total +
          exercise.sets.reduce((setTotal: number, set: WorkoutSet) => {
            return setTotal + set.weight * set.reps;
          }, 0)
        );
      }, 0);

      const startDateTime = parse(`${dateStr} 18:00`, 'yyyy-MM-dd HH:mm', new Date());
      const endDateTime = parse(`${dateStr} 19:30`, 'yyyy-MM-dd HH:mm', new Date());

      workoutSessions.push({
        date: dateStr,
        startTime: startDateTime,
        endTime: endDateTime,
        exercises,
        totalVolume: Math.round(totalVolume),
        memo: i % 15 === 0 ? '調子が良かった！' : undefined,
      });
    }
  }

  return {
    weightRecords,
    mealRecords,
    workoutSessions,
  };
}
