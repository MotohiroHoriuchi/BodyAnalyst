import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import {
  db,
  AnalyticsWindow,
  AnalyticsDataConfig,
  AnalyticsDataType,
  WindowSize,
} from '../db/database';

// データタイプのラベル
export const dataTypeLabels: Record<AnalyticsDataType, string> = {
  weight: '体重',
  bodyFat: '体脂肪率',
  calories: '摂取カロリー',
  protein: 'タンパク質',
  fat: '脂質',
  carbs: '炭水化物',
  totalVolume: '総ボリューム',
  exercise_volume: '種目別ボリューム',
  exercise_1rm: '種目別1RM',
  exercise_maxWeight: '種目別最大重量',
};

// デフォルトの色
export const defaultColors = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
];

// データタイプからデフォルト名を生成
export function getDefaultWindowName(dataType: AnalyticsDataType, exerciseName?: string): string {
  if (dataType.startsWith('exercise_') && exerciseName) {
    const metricLabel = dataType === 'exercise_volume' ? 'ボリューム' :
                        dataType === 'exercise_1rm' ? '1RM' : '最大重量';
    return `${exerciseName} - ${metricLabel}`;
  }
  return dataTypeLabels[dataType];
}

export function useAnalyticsWindows() {
  const windows = useLiveQuery(() =>
    db.analyticsWindows.orderBy('order').toArray()
  );

  const addWindow = useCallback(async (
    data1: AnalyticsDataConfig,
    data2?: AnalyticsDataConfig,
    name?: string,
    size: WindowSize = '1x1',
    periodDays: number = 30
  ) => {
    const now = new Date();
    const maxOrder = windows?.reduce((max, w) => Math.max(max, w.order), -1) ?? -1;

    const windowName = name || getDefaultWindowName(data1.dataType, data1.exerciseName);

    return await db.analyticsWindows.add({
      name: windowName,
      data1,
      data2,
      periodDays,
      size,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    });
  }, [windows]);

  const updateWindow = useCallback(async (
    id: number,
    updates: Partial<Omit<AnalyticsWindow, 'id' | 'createdAt'>>
  ) => {
    await db.analyticsWindows.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  }, []);

  const deleteWindow = useCallback(async (id: number) => {
    await db.analyticsWindows.delete(id);
  }, []);

  const reorderWindows = useCallback(async (orderedIds: number[]) => {
    const updates = orderedIds.map((id, index) =>
      db.analyticsWindows.update(id, { order: index, updatedAt: new Date() })
    );
    await Promise.all(updates);
  }, []);

  const duplicateWindow = useCallback(async (id: number) => {
    const original = await db.analyticsWindows.get(id);
    if (!original) return;

    const now = new Date();
    const maxOrder = windows?.reduce((max, w) => Math.max(max, w.order), -1) ?? -1;

    return await db.analyticsWindows.add({
      name: `${original.name} (コピー)`,
      data1: original.data1,
      data2: original.data2,
      periodDays: original.periodDays,
      size: original.size,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    });
  }, [windows]);

  return {
    windows,
    addWindow,
    updateWindow,
    deleteWindow,
    reorderWindows,
    duplicateWindow,
    isLoading: windows === undefined,
  };
}
