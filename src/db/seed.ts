import { db, FoodMaster, ExerciseMaster, UserGoal, UserSettings } from './database';

// 食材マスタ（プリセット）
export const defaultFoods: Omit<FoodMaster, 'id' | 'createdAt'>[] = [
  // タンパク質源
  { name: '鶏むね肉（皮なし）', caloriesPer100g: 108, proteinPer100g: 22.3, fatPer100g: 1.5, carbsPer100g: 0, isCustom: false },
  { name: '鶏もも肉（皮なし）', caloriesPer100g: 116, proteinPer100g: 18.8, fatPer100g: 3.9, carbsPer100g: 0, isCustom: false },
  { name: '豚ロース', caloriesPer100g: 263, proteinPer100g: 19.3, fatPer100g: 19.2, carbsPer100g: 0.2, isCustom: false },
  { name: '牛もも肉', caloriesPer100g: 182, proteinPer100g: 21.2, fatPer100g: 9.6, carbsPer100g: 0.5, isCustom: false },
  { name: 'サーモン', caloriesPer100g: 233, proteinPer100g: 22.3, fatPer100g: 14.8, carbsPer100g: 0.1, isCustom: false },
  { name: 'マグロ赤身', caloriesPer100g: 125, proteinPer100g: 26.4, fatPer100g: 1.4, carbsPer100g: 0.1, isCustom: false },
  { name: '卵（全卵）', caloriesPer100g: 151, proteinPer100g: 12.3, fatPer100g: 10.3, carbsPer100g: 0.3, isCustom: false },
  { name: '卵白', caloriesPer100g: 47, proteinPer100g: 10.5, fatPer100g: 0, carbsPer100g: 0.4, isCustom: false },
  { name: '木綿豆腐', caloriesPer100g: 72, proteinPer100g: 6.6, fatPer100g: 4.2, carbsPer100g: 1.6, isCustom: false },
  { name: '納豆', caloriesPer100g: 200, proteinPer100g: 16.5, fatPer100g: 10, carbsPer100g: 12.1, isCustom: false },
  // 炭水化物源
  { name: '白米（炊飯後）', caloriesPer100g: 168, proteinPer100g: 2.5, fatPer100g: 0.3, carbsPer100g: 37.1, isCustom: false },
  { name: '玄米（炊飯後）', caloriesPer100g: 165, proteinPer100g: 2.8, fatPer100g: 1, carbsPer100g: 35.6, isCustom: false },
  { name: 'オートミール', caloriesPer100g: 380, proteinPer100g: 13.7, fatPer100g: 5.7, carbsPer100g: 69.1, isCustom: false },
  { name: '食パン', caloriesPer100g: 264, proteinPer100g: 9.3, fatPer100g: 4.4, carbsPer100g: 46.7, isCustom: false },
  { name: 'パスタ（乾麺）', caloriesPer100g: 379, proteinPer100g: 13, fatPer100g: 2.2, carbsPer100g: 73, isCustom: false },
  { name: 'さつまいも', caloriesPer100g: 132, proteinPer100g: 1.2, fatPer100g: 0.2, carbsPer100g: 31.5, isCustom: false },
  { name: 'バナナ', caloriesPer100g: 86, proteinPer100g: 1.1, fatPer100g: 0.2, carbsPer100g: 22.5, isCustom: false },
  // 脂質源
  { name: 'オリーブオイル', caloriesPer100g: 921, proteinPer100g: 0, fatPer100g: 100, carbsPer100g: 0, isCustom: false },
  { name: 'アーモンド', caloriesPer100g: 587, proteinPer100g: 18.6, fatPer100g: 51.4, carbsPer100g: 19.7, isCustom: false },
  { name: 'アボカド', caloriesPer100g: 160, proteinPer100g: 2, fatPer100g: 14.7, carbsPer100g: 8.5, isCustom: false },
  // 野菜
  { name: 'ブロッコリー', caloriesPer100g: 33, proteinPer100g: 4.3, fatPer100g: 0.5, carbsPer100g: 5.2, isCustom: false },
  { name: 'ほうれん草', caloriesPer100g: 20, proteinPer100g: 2.2, fatPer100g: 0.4, carbsPer100g: 3.1, isCustom: false },
  // サプリメント
  { name: 'プロテインパウダー（ホエイ）', caloriesPer100g: 400, proteinPer100g: 80, fatPer100g: 6, carbsPer100g: 8, isCustom: false },
];

// トレーニング種目マスタ（プリセット）
export const defaultExercises: Omit<ExerciseMaster, 'id' | 'createdAt'>[] = [
  // 胸
  { name: 'ベンチプレス', bodyPart: 'chest', isCompound: true, isCustom: false },
  { name: 'インクラインベンチプレス', bodyPart: 'chest', isCompound: true, isCustom: false },
  { name: 'ダンベルフライ', bodyPart: 'chest', isCompound: false, isCustom: false },
  { name: 'ケーブルクロスオーバー', bodyPart: 'chest', isCompound: false, isCustom: false },
  { name: 'ディップス', bodyPart: 'chest', isCompound: true, isCustom: false },
  // 背中
  { name: 'デッドリフト', bodyPart: 'back', isCompound: true, isCustom: false },
  { name: '懸垂', bodyPart: 'back', isCompound: true, isCustom: false },
  { name: 'ラットプルダウン', bodyPart: 'back', isCompound: true, isCustom: false },
  { name: 'バーベルロウ', bodyPart: 'back', isCompound: true, isCustom: false },
  { name: 'シーテッドロウ', bodyPart: 'back', isCompound: true, isCustom: false },
  // 肩
  { name: 'オーバーヘッドプレス', bodyPart: 'shoulder', isCompound: true, isCustom: false },
  { name: 'サイドレイズ', bodyPart: 'shoulder', isCompound: false, isCustom: false },
  { name: 'フロントレイズ', bodyPart: 'shoulder', isCompound: false, isCustom: false },
  { name: 'リアレイズ', bodyPart: 'shoulder', isCompound: false, isCustom: false },
  { name: 'フェイスプル', bodyPart: 'shoulder', isCompound: false, isCustom: false },
  // 腕
  { name: 'バーベルカール', bodyPart: 'arm', isCompound: false, isCustom: false },
  { name: 'ハンマーカール', bodyPart: 'arm', isCompound: false, isCustom: false },
  { name: 'トライセプスプッシュダウン', bodyPart: 'arm', isCompound: false, isCustom: false },
  { name: 'スカルクラッシャー', bodyPart: 'arm', isCompound: false, isCustom: false },
  // 脚
  { name: 'スクワット', bodyPart: 'leg', isCompound: true, isCustom: false },
  { name: 'レッグプレス', bodyPart: 'leg', isCompound: true, isCustom: false },
  { name: 'ルーマニアンデッドリフト', bodyPart: 'leg', isCompound: true, isCustom: false },
  { name: 'レッグカール', bodyPart: 'leg', isCompound: false, isCustom: false },
  { name: 'レッグエクステンション', bodyPart: 'leg', isCompound: false, isCustom: false },
  { name: 'カーフレイズ', bodyPart: 'leg', isCompound: false, isCustom: false },
  // 体幹
  { name: 'プランク', bodyPart: 'core', isCompound: false, isCustom: false },
  { name: 'クランチ', bodyPart: 'core', isCompound: false, isCustom: false },
  { name: 'レッグレイズ', bodyPart: 'core', isCompound: false, isCustom: false },
];

// デフォルトの目標設定
export const defaultGoal: Omit<UserGoal, 'id' | 'createdAt' | 'updatedAt'> = {
  goalType: 'maintain',
  targetWeight: 70,
  targetCalories: 2000,
  targetProtein: 120,
  targetFat: 55,
  targetCarbs: 250,
  startDate: new Date().toISOString().split('T')[0],
};

// デフォルトのユーザー設定
export const defaultSettings: Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'> = {
  oneRmFormula: 'epley',
};

// データベース初期化
export async function seedDatabase(): Promise<void> {
  const now = new Date();

  // 食材マスタが空の場合のみ初期データを投入
  const foodCount = await db.foodMaster.count();
  if (foodCount === 0) {
    const foodsWithDate = defaultFoods.map(food => ({
      ...food,
      createdAt: now,
    }));
    await db.foodMaster.bulkAdd(foodsWithDate);
    console.log('食材マスタを初期化しました');
  }

  // 種目マスタが空の場合のみ初期データを投入
  const exerciseCount = await db.exerciseMaster.count();
  if (exerciseCount === 0) {
    const exercisesWithDate = defaultExercises.map(exercise => ({
      ...exercise,
      createdAt: now,
    }));
    await db.exerciseMaster.bulkAdd(exercisesWithDate);
    console.log('種目マスタを初期化しました');
  }

  // 目標設定が空の場合のみ初期データを投入
  const goalCount = await db.userGoals.count();
  if (goalCount === 0) {
    await db.userGoals.add({
      ...defaultGoal,
      createdAt: now,
      updatedAt: now,
    });
    console.log('目標設定を初期化しました');
  }

  // ユーザー設定が空の場合のみ初期データを投入
  const settingsCount = await db.userSettings.count();
  if (settingsCount === 0) {
    await db.userSettings.add({
      ...defaultSettings,
      createdAt: now,
      updatedAt: now,
    });
    console.log('ユーザー設定を初期化しました');
  }
}
