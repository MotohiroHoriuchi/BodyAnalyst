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
