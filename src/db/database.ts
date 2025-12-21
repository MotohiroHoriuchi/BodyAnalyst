import Dexie, { Table } from 'dexie';

// ========== 体重記録 ==========
export interface WeightRecord {
  id?: number;
  date: string;           // YYYY-MM-DD
  weight: number;         // kg
  bodyFatPercentage?: number;  // %（任意）
  muscleMass?: number;    // kg（任意）
  timing?: 'morning' | 'evening' | 'other';  // 計測タイミング（任意）
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========== 食材マスタ ==========
export interface FoodMaster {
  id?: number;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
  isCustom: boolean;      // ユーザー追加かどうか
  createdAt: Date;
}

// ========== 食事記録 ==========
export interface MealRecord {
  id?: number;
  date: string;           // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealItem {
  foodId: number;
  foodName: string;
  amount: number;         // グラム
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

// ========== トレーニング種目マスタ ==========
export interface ExerciseMaster {
  id?: number;
  name: string;
  bodyPart: 'chest' | 'back' | 'shoulder' | 'arm' | 'leg' | 'core' | 'other';
  isCompound: boolean;    // コンパウンド種目か
  isCustom: boolean;
  createdAt: Date;
}

// ========== トレーニング記録 ==========
export interface WorkoutSession {
  id?: number;
  date: string;           // YYYY-MM-DD
  startTime: Date;
  endTime?: Date;
  exercises: WorkoutExercise[];
  totalVolume: number;    // 総ボリューム（自動計算）
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutExercise {
  exerciseId: number;
  exerciseName: string;
  bodyPart: string;
  sets: WorkoutSet[];
  restTimes: number[];    // 各セット後のレスト秒数
}

export interface WorkoutSet {
  setNumber: number;
  weight: number;         // kg
  reps: number;
  rpe?: number;           // 1-10（任意）
  isWarmup: boolean;
  completedAt: Date;
}

// ========== 目標設定 ==========
export interface UserGoal {
  id?: number;
  goalType: 'diet' | 'bulk' | 'maintain';
  targetWeight?: number;
  targetCalories: number;
  targetProtein: number;
  targetFat: number;
  targetCarbs: number;
  startDate: string;
  targetDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========== ユーザー設定 ==========
export interface UserSettings {
  id?: number;
  oneRmFormula: 'epley' | 'brzycki' | 'lombardi' | 'oconner';
  createdAt: Date;
  updatedAt: Date;
}

// ========== Database Class ==========
export class BodyAnalystDB extends Dexie {
  weightRecords!: Table<WeightRecord>;
  foodMaster!: Table<FoodMaster>;
  mealRecords!: Table<MealRecord>;
  exerciseMaster!: Table<ExerciseMaster>;
  workoutSessions!: Table<WorkoutSession>;
  userGoals!: Table<UserGoal>;
  userSettings!: Table<UserSettings>;

  constructor() {
    super('BodyAnalystDB');
    this.version(1).stores({
      weightRecords: '++id, date',
      foodMaster: '++id, name, isCustom',
      mealRecords: '++id, date, mealType',
      exerciseMaster: '++id, name, bodyPart, isCustom',
      workoutSessions: '++id, date',
      userGoals: '++id, goalType',
      userSettings: '++id'
    });
  }
}

export const db = new BodyAnalystDB();

// 重複セッションを統合する関数
export async function mergeDuplicateSessions(): Promise<void> {
  const allSessions = await db.workoutSessions.toArray();

  // 日付ごとにセッションをグループ化
  const sessionsByDate: Record<string, WorkoutSession[]> = {};
  allSessions.forEach(session => {
    if (!sessionsByDate[session.date]) {
      sessionsByDate[session.date] = [];
    }
    sessionsByDate[session.date].push(session);
  });

  // 重複がある日付を処理
  for (const [date, sessions] of Object.entries(sessionsByDate)) {
    if (sessions.length <= 1) continue;

    // IDでソートして最初のセッションを基準にする
    sessions.sort((a, b) => (a.id || 0) - (b.id || 0));
    const primarySession = sessions[0];
    const duplicateSessions = sessions.slice(1);

    // 全ての種目を統合
    const mergedExercises: WorkoutExercise[] = [...primarySession.exercises];
    let mergedVolume = primarySession.totalVolume;

    for (const dup of duplicateSessions) {
      mergedExercises.push(...dup.exercises);
      mergedVolume += dup.totalVolume;
    }

    // 最も遅い終了時間を使用
    const endTimes = sessions.map(s => s.endTime).filter(Boolean) as Date[];
    const latestEndTime = endTimes.length > 0
      ? new Date(Math.max(...endTimes.map(d => new Date(d).getTime())))
      : undefined;

    // 基準セッションを更新
    await db.workoutSessions.update(primarySession.id!, {
      exercises: mergedExercises,
      totalVolume: mergedVolume,
      endTime: latestEndTime,
      updatedAt: new Date(),
    });

    // 重複セッションを削除
    for (const dup of duplicateSessions) {
      await db.workoutSessions.delete(dup.id!);
    }

    console.log(`Merged ${sessions.length} sessions for date ${date}`);
  }
}
