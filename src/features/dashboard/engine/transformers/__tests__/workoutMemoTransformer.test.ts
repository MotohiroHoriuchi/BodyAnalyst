// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { transformWorkoutSessionsToDataFrame } from '../workoutMemoTransformer';
import type { WorkoutSession } from '../../../../../types/workout';

function createSession(
  overrides: Partial<WorkoutSession> & { date: string }
): WorkoutSession {
  return {
    date: overrides.date,
    startTime: new Date(`${overrides.date}T18:00:00`),
    endTime: new Date(`${overrides.date}T19:30:00`),
    exercises: overrides.exercises ?? [],
    totalVolume: overrides.totalVolume ?? 0,
    memo: overrides.memo,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('transformWorkoutSessionsToDataFrame', () => {
  it('memoと種目名を結合してnotesフィールドに格納する', () => {
    const sessions: WorkoutSession[] = [
      createSession({
        date: '2024-01-15',
        memo: '腰痛 好調',
        exercises: [
          {
            exerciseId: 1,
            exerciseName: 'ベンチプレス',
            bodyPart: 'chest',
            sets: [],
            restTimes: [],
          },
        ],
      }),
    ];

    const result = transformWorkoutSessionsToDataFrame(sessions);

    expect(result).toHaveLength(1);
    // 種目名がnotesの先頭に結合される
    expect(result[0].attributes.notes).toBe('ベンチプレス 腰痛 好調');
  });

  it('timestampをセッションのdateから算出する', () => {
    const sessions: WorkoutSession[] = [
      createSession({ date: '2024-01-15', memo: 'テスト' }),
    ];

    const result = transformWorkoutSessionsToDataFrame(sessions);

    expect(result[0].timestamp).toBe(new Date('2024-01-15').getTime());
  });

  it('memoがないセッションはスキップする', () => {
    const sessions: WorkoutSession[] = [
      createSession({ date: '2024-01-15', memo: undefined }),
      createSession({ date: '2024-01-16', memo: '' }),
      createSession({ date: '2024-01-17', memo: '今日は好調' }),
    ];

    const result = transformWorkoutSessionsToDataFrame(sessions);

    expect(result).toHaveLength(1);
    expect(result[0].attributes.notes).toBe('今日は好調');
  });

  it('複数の種目名をスペース区切りでnotesの先頭に結合する', () => {
    const sessions: WorkoutSession[] = [
      createSession({
        date: '2024-01-15',
        memo: '好調',
        exercises: [
          {
            exerciseId: 1,
            exerciseName: 'ベンチプレス',
            bodyPart: 'chest',
            sets: [],
            restTimes: [],
          },
          {
            exerciseId: 2,
            exerciseName: 'スクワット',
            bodyPart: 'leg',
            sets: [],
            restTimes: [],
          },
        ],
      }),
    ];

    const result = transformWorkoutSessionsToDataFrame(sessions);

    expect(result[0].attributes.notes).toBe('ベンチプレス スクワット 好調');
  });

  it('種目がない場合はmemoのみがnotesになる', () => {
    const sessions: WorkoutSession[] = [
      createSession({ date: '2024-01-15', memo: 'メモのみ', exercises: [] }),
    ];

    const result = transformWorkoutSessionsToDataFrame(sessions);

    expect(result[0].attributes.notes).toBe('メモのみ');
  });

  it('空の配列を渡すと空のDataFrameを返す', () => {
    const result = transformWorkoutSessionsToDataFrame([]);

    expect(result).toEqual([]);
  });

  it('重複する種目名はユニークにしてnotesに結合する', () => {
    const sessions: WorkoutSession[] = [
      createSession({
        date: '2024-01-15',
        memo: 'スーパーセット',
        exercises: [
          {
            exerciseId: 1,
            exerciseName: 'ベンチプレス',
            bodyPart: 'chest',
            sets: [],
            restTimes: [],
          },
          {
            exerciseId: 1,
            exerciseName: 'ベンチプレス',
            bodyPart: 'chest',
            sets: [],
            restTimes: [],
          },
        ],
      }),
    ];

    const result = transformWorkoutSessionsToDataFrame(sessions);

    expect(result[0].attributes.notes).toBe('ベンチプレス スーパーセット');
  });
});
