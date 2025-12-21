import { useLiveQuery } from 'dexie-react-hooks';
import { db, UserSettings } from '../db/database';
import { OneRmFormula } from '../utils/oneRmCalculations';

export function useSettings() {
  const settings = useLiveQuery(() =>
    db.userSettings.orderBy('id').first()
  );

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!settings?.id) return;
    await db.userSettings.update(settings.id, {
      ...updates,
      updatedAt: new Date(),
    });
  };

  const setOneRmFormula = async (formula: OneRmFormula) => {
    await updateSettings({ oneRmFormula: formula });
  };

  return {
    settings,
    updateSettings,
    setOneRmFormula,
    isLoading: settings === undefined,
  };
}
