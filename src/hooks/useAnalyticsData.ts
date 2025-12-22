import { useState, useEffect, useCallback } from 'react';
import { db, AnalyticsDataConfig } from '../db/database';
import { getDateRange, formatDate } from '../utils/dateUtils';
import { calculateOneRm, OneRmFormula } from '../utils/oneRmCalculations';

export interface DataPoint {
  date: string;
  dateRaw: string;  // YYYY-MM-DD format for sorting
  value: number;
}

export interface ChartDataset {
  data: DataPoint[];
  config: AnalyticsDataConfig;
}

export function useAnalyticsData(
  data1: AnalyticsDataConfig | undefined,
  data2: AnalyticsDataConfig | undefined,
  periodDays: number,
  oneRmFormula: OneRmFormula = 'epley'
) {
  const [dataset1, setDataset1] = useState<ChartDataset | null>(null);
  const [dataset2, setDataset2] = useState<ChartDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (config: AnalyticsDataConfig): Promise<DataPoint[]> => {
    const dates = getDateRange(periodDays);
    const dataPoints: DataPoint[] = [];

    switch (config.dataType) {
      case 'weight': {
        const records = await db.weightRecords
          .where('date')
          .anyOf(dates)
          .toArray();
        records.forEach(r => {
          dataPoints.push({
            date: formatDate(r.date, 'M/d'),
            dateRaw: r.date,
            value: r.weight,
          });
        });
        break;
      }

      case 'bodyFat': {
        const records = await db.weightRecords
          .where('date')
          .anyOf(dates)
          .toArray();
        records.forEach(r => {
          if (r.bodyFatPercentage !== undefined) {
            dataPoints.push({
              date: formatDate(r.date, 'M/d'),
              dateRaw: r.date,
              value: r.bodyFatPercentage,
            });
          }
        });
        break;
      }

      case 'calories':
      case 'protein':
      case 'fat':
      case 'carbs': {
        const meals = await db.mealRecords
          .where('date')
          .anyOf(dates)
          .toArray();

        // 日付ごとに集計
        const dailyTotals: Record<string, number> = {};
        meals.forEach(meal => {
          if (!dailyTotals[meal.date]) {
            dailyTotals[meal.date] = 0;
          }
          switch (config.dataType) {
            case 'calories':
              dailyTotals[meal.date] += meal.totalCalories;
              break;
            case 'protein':
              dailyTotals[meal.date] += meal.totalProtein;
              break;
            case 'fat':
              dailyTotals[meal.date] += meal.totalFat;
              break;
            case 'carbs':
              dailyTotals[meal.date] += meal.totalCarbs;
              break;
          }
        });

        Object.entries(dailyTotals).forEach(([date, value]) => {
          dataPoints.push({
            date: formatDate(date, 'M/d'),
            dateRaw: date,
            value: Math.round(value * 10) / 10,
          });
        });
        break;
      }

      case 'totalVolume': {
        const workouts = await db.workoutSessions
          .where('date')
          .anyOf(dates)
          .toArray();
        workouts.forEach(w => {
          if (w.totalVolume > 0) {
            dataPoints.push({
              date: formatDate(w.date, 'M/d'),
              dateRaw: w.date,
              value: w.totalVolume,
            });
          }
        });
        break;
      }

      case 'exercise_volume':
      case 'exercise_1rm':
      case 'exercise_maxWeight': {
        if (!config.exerciseId) break;

        const workouts = await db.workoutSessions
          .where('date')
          .anyOf(dates)
          .toArray();

        workouts.forEach(session => {
          const exercise = session.exercises.find(e => e.exerciseId === config.exerciseId);
          if (!exercise || exercise.sets.length === 0) return;

          const workingSets = exercise.sets.filter(s => !s.isWarmup);
          if (workingSets.length === 0) return;

          let value = 0;

          switch (config.dataType) {
            case 'exercise_volume':
              value = workingSets.reduce((sum, set) => sum + set.weight * set.reps, 0);
              break;
            case 'exercise_1rm':
              value = Math.max(
                ...workingSets.map(set =>
                  calculateOneRm(set.weight, set.reps, oneRmFormula).estimated1RM
                )
              );
              break;
            case 'exercise_maxWeight':
              value = Math.max(...workingSets.map(set => set.weight));
              break;
          }

          if (value > 0) {
            dataPoints.push({
              date: formatDate(session.date, 'M/d'),
              dateRaw: session.date,
              value: Math.round(value * 10) / 10,
            });
          }
        });
        break;
      }
    }

    // 日付でソート
    dataPoints.sort((a, b) => a.dateRaw.localeCompare(b.dateRaw));
    return dataPoints;
  }, [periodDays, oneRmFormula]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      if (data1) {
        const points = await fetchData(data1);
        setDataset1({ data: points, config: data1 });
      } else {
        setDataset1(null);
      }

      if (data2) {
        const points = await fetchData(data2);
        setDataset2({ data: points, config: data2 });
      } else {
        setDataset2(null);
      }

      setIsLoading(false);
    };

    loadData();
  }, [data1, data2, fetchData]);

  return {
    dataset1,
    dataset2,
    isLoading,
  };
}

// 利用可能な種目リストを取得
export function useExerciseOptions() {
  const [exercises, setExercises] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      // 全ワークアウトセッションから種目を収集
      const sessions = await db.workoutSessions.toArray();
      const exerciseMap = new Map<number, string>();

      sessions.forEach(session => {
        session.exercises.forEach(exercise => {
          if (!exerciseMap.has(exercise.exerciseId)) {
            exerciseMap.set(exercise.exerciseId, exercise.exerciseName);
          }
        });
      });

      setExercises(
        Array.from(exerciseMap.entries()).map(([id, name]) => ({ id, name }))
      );
    };

    load();
  }, []);

  return exercises;
}
