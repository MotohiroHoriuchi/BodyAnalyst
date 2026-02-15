import type { WorkoutSession } from '../../../../types/workout';
import type { DataFrame } from '../../../../../proto/visualization-engine/src/types';

/**
 * WorkoutSession[] を VisEngine の DataFrame に変換する。
 * - memo が空 or undefined のセッションはスキップ
 * - notes フィールドに種目名（ユニーク）+ memo テキストをスペース区切りで結合
 *   → TokenizerFilter が一括でトークン化可能
 */
export function transformWorkoutSessionsToDataFrame(
  sessions: WorkoutSession[]
): DataFrame {
  return sessions
    .filter((session) => session.memo != null && session.memo !== '')
    .map((session) => {
      const uniqueExerciseNames = [
        ...new Set(session.exercises.map((e) => e.exerciseName)),
      ];

      const parts = [...uniqueExerciseNames, session.memo!];
      const notes = parts.join(' ');

      return {
        timestamp: new Date(session.date).getTime(),
        attributes: {
          notes,
        },
      };
    });
}
