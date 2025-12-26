# Body Analyst - Vibe Coding プロンプト

## プロジェクト概要

ボディメイクを行う人が体重・食事・トレーニングを記録し、可視化するPWAアプリを作成してください。

### ターゲットユーザー
- 男性トレーニー（初心者〜中級者）
- 女性トレーニー（初心者）
- ダイエッター
- 増量者

### 設計思想
- シンプルで使いやすい
- オフラインファースト
- 課金しないと使えない機能は作らない

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| Framework | React 18 + TypeScript + Vite |
| Database | Dexie.js (IndexedDB wrapper) |
| UI | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| PWA | vite-plugin-pwa |
| Icons | Lucide React |
| Date | date-fns |
| State | Zustand（必要に応じて） |

### セットアップコマンド
```bash
npm create vite@latest body-analyst -- --template react-ts
cd body-analyst
npm install dexie dexie-react-hooks recharts date-fns zustand lucide-react
npm install -D tailwindcss postcss autoprefixer vite-plugin-pwa
npx tailwindcss init -p
npx shadcn-ui@latest init
```

---

## デザインシステム

### カラーパレット
```css
:root {
  /* Primary - Blue */
  --primary-50: #EBF5FF;
  --primary-100: #E1EFFE;
  --primary-200: #C3DDFD;
  --primary-300: #A4CAFE;
  --primary-400: #76A9FA;
  --primary-500: #3F83F8;  /* メインカラー */
  --primary-600: #1C64F2;
  --primary-700: #1A56DB;
  
  /* Neutral */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-500: #6B7280;
  --gray-900: #111827;
  
  /* Semantic */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  
  /* Background */
  --bg-main: #F0F4FF;  /* 薄い青みがかったグレー */
  --bg-card: #FFFFFF;
}
```

### デザイン原則
1. **カードベースUI**: すべてのセクションは角丸（radius: 16-24px）の白カードで表現
2. **青のグラデーション**: ヘッダーやアクセントにブルーグラデーション使用
3. **円形プログレス**: 目標達成率は円形ゲージで表示
4. **絵文字アイコン**: 親しみやすさのため適所に絵文字を使用（🏋️ 💪 🍽️ ⚖️ 📊）
5. **余白を十分に**: padding 16-24px、gap 12-16px
6. **影は控えめ**: shadow-sm または shadow-md
7. **フォント**: システムフォント、見出しは太め（font-semibold/bold）

### レイアウト
- モバイルファースト（max-width: 430px を基準）
- 下部固定ナビゲーション（4タブ）
- ヘッダーは各画面で固定

---

## データモデル (Dexie.js)

```typescript
// src/db/database.ts

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

// ========== 1RM計算式設定 ==========
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
```

---

## 1RM推定計算

### 計算式の定義

```typescript
// src/utils/oneRmCalculations.ts

export type OneRmFormula = 'epley' | 'brzycki' | 'lombardi' | 'oconner';

export interface OneRmFormulaInfo {
  id: OneRmFormula;
  name: string;
  formula: string;           // 数式の文字列表現
  description: string;       // 説明
  calculate: (weight: number, reps: number) => number;
}

export const oneRmFormulas: Record<OneRmFormula, OneRmFormulaInfo> = {
  epley: {
    id: 'epley',
    name: 'Epley式',
    formula: '1RM = weight × (1 + reps ÷ 30)',
    description: '最も一般的に使用される計算式。中〜高レップに適している。',
    calculate: (weight, reps) => {
      if (reps === 1) return weight;
      return weight * (1 + reps / 30);
    }
  },
  brzycki: {
    id: 'brzycki',
    name: 'Brzycki式',
    formula: '1RM = weight × (36 ÷ (37 - reps))',
    description: '低レップ（10回以下）での精度が高いとされる。',
    calculate: (weight, reps) => {
      if (reps === 1) return weight;
      if (reps >= 37) return weight * 36; // 上限を設定
      return weight * (36 / (37 - reps));
    }
  },
  lombardi: {
    id: 'lombardi',
    name: 'Lombardi式',
    formula: '1RM = weight × reps^0.10',
    description: 'シンプルな累乗計算式。幅広いレップ範囲で安定。',
    calculate: (weight, reps) => {
      if (reps === 1) return weight;
      return weight * Math.pow(reps, 0.10);
    }
  },
  oconner: {
    id: 'oconner',
    name: "O'Conner式",
    formula: '1RM = weight × (1 + reps ÷ 40)',
    description: 'Epley式の保守的なバリエーション。',
    calculate: (weight, reps) => {
      if (reps === 1) return weight;
      return weight * (1 + reps / 40);
    }
  }
};

// 1RMを計算して結果を返す
export function calculateOneRm(
  weight: number, 
  reps: number, 
  formula: OneRmFormula = 'epley'
): {
  estimated1RM: number;
  formulaUsed: OneRmFormulaInfo;
  inputWeight: number;
  inputReps: number;
} {
  const formulaInfo = oneRmFormulas[formula];
  const estimated1RM = Math.round(formulaInfo.calculate(weight, reps) * 10) / 10;
  
  return {
    estimated1RM,
    formulaUsed: formulaInfo,
    inputWeight: weight,
    inputReps: reps
  };
}

// すべての計算式で1RMを計算（比較表示用）
export function calculateOneRmAllFormulas(weight: number, reps: number): {
  formula: OneRmFormulaInfo;
  estimated1RM: number;
}[] {
  return Object.values(oneRmFormulas).map(formula => ({
    formula,
    estimated1RM: Math.round(formula.calculate(weight, reps) * 10) / 10
  }));
}
```

### 1RM表示コンポーネント

```typescript
// src/components/workout/OneRmDisplay.tsx

import { useState } from 'react';
import { Info } from 'lucide-react';
import { calculateOneRm, calculateOneRmAllFormulas, OneRmFormula } from '@/utils/oneRmCalculations';

interface OneRmDisplayProps {
  weight: number;
  reps: number;
  selectedFormula: OneRmFormula;
}

export function OneRmDisplay({ weight, reps, selectedFormula }: OneRmDisplayProps) {
  const [showDetail, setShowDetail] = useState(false);
  
  const result = calculateOneRm(weight, reps, selectedFormula);
  const allResults = calculateOneRmAllFormulas(weight, reps);
  
  if (reps < 1 || weight <= 0) return null;
  
  return (
    <div className="bg-primary-50 rounded-xl p-4 mt-2">
      {/* メイン表示 */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">推定1RM</span>
          <div className="text-2xl font-bold text-primary-600">
            {result.estimated1RM} kg
          </div>
        </div>
        <button 
          onClick={() => setShowDetail(!showDetail)}
          className="p-2 hover:bg-primary-100 rounded-full transition"
          aria-label="計算式の詳細を表示"
        >
          <Info className="w-5 h-5 text-primary-500" />
        </button>
      </div>
      
      {/* 詳細表示 */}
      {showDetail && (
        <div className="mt-4 pt-4 border-t border-primary-200">
          {/* 使用した計算式 */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              使用した計算式: {result.formulaUsed.name}
            </h4>
            <code className="text-sm bg-white px-2 py-1 rounded text-primary-700">
              {result.formulaUsed.formula}
            </code>
            <p className="text-xs text-gray-500 mt-1">
              {result.formulaUsed.description}
            </p>
          </div>
          
          {/* 計算の内訳 */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">計算</h4>
            <p className="text-sm text-gray-600">
              {weight}kg × {reps}reps → <strong>{result.estimated1RM}kg</strong>
            </p>
          </div>
          
          {/* 他の計算式との比較 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              他の計算式との比較
            </h4>
            <div className="space-y-1">
              {allResults.map(({ formula, estimated1RM }) => (
                <div 
                  key={formula.id}
                  className={`flex justify-between text-sm py-1 px-2 rounded ${
                    formula.id === selectedFormula 
                      ? 'bg-primary-100 font-medium' 
                      : 'bg-white'
                  }`}
                >
                  <span>{formula.name}</span>
                  <span>{estimated1RM} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 画面構成

### ナビゲーション（下部固定タブ）
1. 🏠 **ホーム** - Overview ダッシュボード
2. 🍽️ **食事** - 食事記録・履歴
3. 🏋️ **トレーニング** - ワークアウト記録
4. 📊 **分析** - グラフ・統計

### 各画面の詳細

#### 1. ホーム画面 (/)
```
┌─────────────────────────────┐
│  Body Analyst    [設定⚙️]   │  ← ヘッダー
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │  Today's Progress   │    │  ← 円形プログレス
│  │      [75%]          │    │     カロリー目標達成率
│  │  1,520 / 2,000 kcal │    │
│  └─────────────────────┘    │
│                             │
│  ┌──────┐  ┌──────┐        │
│  │⚖️体重 │  │💪PFC  │        │  ← 2カラムカード
│  │72.5kg│  │P:120g │        │
│  │-0.3  │  │F:45g  │        │
│  └──────┘  │C:180g │        │
│            └──────┘        │
│                             │
│  ┌─────────────────────┐    │
│  │ 🏋️ Today's Workout  │    │  ← ワークアウトサマリー
│  │ Volume: 12,500 kg   │    │
│  │ 胸・三頭            │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 📈 Weekly Trend     │    │  ← ミニ折れ線グラフ
│  │ [体重推移グラフ]     │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
│  🏠   🍽️   🏋️   📊  │  ← ボトムナビ
└─────────────────────────────┘
```

#### 2. 食事画面 (/meals)
```
┌─────────────────────────────┐
│  🍽️ 食事記録                │
│  ◀ 2024/01/15 ▶            │  ← 日付セレクター
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ PFCバランス [円グラフ]│    │
│  │ P:30% F:25% C:45%   │    │
│  └─────────────────────┘    │
│                             │
│  ☀️ 朝食 (450 kcal)  [+]   │  ← 食事タイプごとのセクション
│  ├ 卵 2個 (150kcal)        │
│  └ 食パン 1枚 (160kcal)    │
│                             │
│  🌤️ 昼食 (650 kcal)  [+]   │
│  ├ 鶏むね肉 150g           │
│  └ 白米 200g               │
│                             │
│  🌙 夕食 (----)     [+]    │
│  └ タップして追加           │
│                             │
│  🍪 間食 (----)     [+]    │
└─────────────────────────────┘
```

**食事追加モーダル**
```
┌─────────────────────────────┐
│  食事を追加        [✕]     │
├─────────────────────────────┤
│  🔍 [食材を検索...]         │
│                             │
│  最近使った食材             │
│  ├ 🍗 鶏むね肉              │
│  ├ 🍚 白米                  │
│  └ 🥚 卵                    │
│                             │
│  ── 選択中 ──              │
│  鶏むね肉                   │
│  [    150    ] g           │  ← 数量入力
│                             │
│  P: 35g  F: 2g  C: 0g      │
│  Cal: 165 kcal             │
│                             │
│  [      追加する      ]     │
└─────────────────────────────┘
```

#### 3. トレーニング画面 (/workout)
```
┌─────────────────────────────┐
│  🏋️ トレーニング            │
│  [新しいワークアウト開始]    │  ← メインCTA
├─────────────────────────────┤
│  📅 履歴                    │
│                             │
│  ┌─────────────────────┐    │
│  │ 2024/01/14 (昨日)    │    │
│  │ 胸・三頭              │    │
│  │ Volume: 15,200 kg    │    │
│  │ 45分                  │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 2024/01/12          │    │
│  │ 背中・二頭           │    │
│  │ Volume: 12,800 kg    │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**ワークアウト中画面**
```
┌─────────────────────────────┐
│  ワークアウト中  ⏱️ 32:15   │  ← 経過時間
│                    [終了]   │
├─────────────────────────────┤
│  Volume: 8,500 kg          │
│                             │
│  ┌─────────────────────┐    │
│  │ ベンチプレス (胸)     │    │
│  │ 1. 60kg × 10 ✓       │    │
│  │ 2. 70kg × 8  ✓       │    │
│  │ 3. 75kg × 6  ✓       │    │
│  │                       │    │
│  │ ┌───────────────┐    │    │
│  │ │ 推定1RM: 89kg │ ℹ️ │    │  ← 1RM表示（ベストセット）
│  │ └───────────────┘    │    │
│  │                       │    │
│  │ [+ セット追加]        │    │
│  └─────────────────────┘    │
│                             │
│  [+ 種目を追加]             │
│                             │
│  ── レストタイマー ──      │
│  ┌─────────────────────┐    │
│  │      0:00           │    │  ← 停止中は0:00表示
│  │   [▶ スタート]       │    │  ← 手動開始ボタン
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**セット入力**
```
┌─────────────────────────────┐
│  セット 4                   │
├─────────────────────────────┤
│  重量 (kg)                  │
│  [ - ]  [  75  ]  [ + ]    │  ← ステッパー
│                             │
│  レップ数                   │
│  [ - ]  [   8  ]  [ + ]    │
│                             │
│  RPE (任意)                 │
│  ○1 ○2 ○3 ○4 ○5 ○6 ○7 ●8 ○9 ○10 │
│                             │
│  □ ウォームアップセット     │
│                             │
│  [      記録する      ]     │  ← 押してもタイマーは自動開始しない
└─────────────────────────────┘
```

#### 4. 分析画面 (/analytics)
```
┌─────────────────────────────┐
│  📊 分析                    │
│  [Day] [Week] [Month] [Year]│  ← 期間セレクター
├─────────────────────────────┤
│                             │
│  体重推移                   │
│  ┌─────────────────────┐    │
│  │ [折れ線グラフ]        │    │
│  │ 72.5 → 71.8 (-0.7)  │    │
│  └─────────────────────┘    │
│                             │
│  カロリー推移               │
│  ┌─────────────────────┐    │
│  │ [棒グラフ + 目標線]   │    │
│  └─────────────────────┘    │
│                             │
│  トレーニングボリューム     │
│  ┌─────────────────────┐    │
│  │ [部位別積み上げ棒]    │    │
│  └─────────────────────┘    │
│                             │
│  1RM推移（BIG3）            │
│  ┌─────────────────────┐    │
│  │ [折れ線グラフ]        │    │  ← ベンチ/スクワット/デッドの推定1RM
│  └─────────────────────┘    │
│                             │
│  PFCバランス推移            │
│  ┌─────────────────────┐    │
│  │ [エリアチャート]      │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

#### 5. 設定画面 (/settings)
- 目標設定（体重、カロリー、PFC）
- **1RM計算式の選択**（Epley式、Brzycki式、Lombardi式、O'Conner式）
- 食材マスタ管理
- 種目マスタ管理
- データエクスポート（CSV）
- アプリについて

---

## 初期データ

### 食材マスタ（プリセット）
```typescript
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
```

### トレーニング種目マスタ（プリセット）
```typescript
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
```

---

## レストタイマー（手動開始）

```typescript
// src/components/workout/RestTimer.tsx

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface RestTimerProps {
  onRestComplete?: (restTime: number) => void;
}

export function RestTimer({ onRestComplete }: RestTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRestTime, setLastRestTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = useCallback(() => {
    if (seconds > 0) {
      setLastRestTime(seconds);
      onRestComplete?.(seconds);
    }
    setIsRunning(false);
    setSeconds(0);
  }, [seconds, onRestComplete]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2 text-center">
        レストタイマー
      </h3>
      
      {/* タイマー表示 */}
      <div className="text-5xl font-bold text-center text-gray-900 font-mono mb-4">
        {formatTime(seconds)}
      </div>
      
      {/* コントロールボタン */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition"
          >
            <Play className="w-5 h-5" />
            スタート
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
          >
            <Pause className="w-5 h-5" />
            一時停止
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
        >
          <RotateCcw className="w-5 h-5" />
          リセット
        </button>
      </div>
      
      {/* 前回のレスト時間 */}
      {lastRestTime && (
        <p className="text-center text-sm text-gray-400 mt-4">
          前回のレスト: {formatTime(lastRestTime)}
        </p>
      )}
    </div>
  );
}
```

---

## 主要コンポーネント

### 必須コンポーネント一覧
```
src/
├── components/
│   ├── common/
│   │   ├── BottomNav.tsx        # 下部ナビゲーション
│   │   ├── Header.tsx           # ページヘッダー
│   │   ├── Card.tsx             # カードコンテナ
│   │   ├── CircularProgress.tsx # 円形プログレス
│   │   ├── DateSelector.tsx     # 日付選択
│   │   └── NumberStepper.tsx    # 数値増減入力
│   │
│   ├── weight/
│   │   ├── WeightInput.tsx      # 体重入力フォーム
│   │   └── WeightCard.tsx       # 体重表示カード
│   │
│   ├── meals/
│   │   ├── MealSection.tsx      # 食事タイプセクション
│   │   ├── FoodSearch.tsx       # 食材検索
│   │   ├── MealItemInput.tsx    # 食事アイテム入力
│   │   ├── PFCChart.tsx         # PFC円グラフ
│   │   └── AddFoodModal.tsx     # 食材追加モーダル
│   │
│   ├── workout/
│   │   ├── WorkoutSession.tsx   # ワークアウト中画面
│   │   ├── ExerciseCard.tsx     # 種目カード
│   │   ├── SetInput.tsx         # セット入力
│   │   ├── RestTimer.tsx        # レストタイマー（手動開始）
│   │   ├── ExerciseSearch.tsx   # 種目検索
│   │   ├── WorkoutHistory.tsx   # 履歴一覧
│   │   └── OneRmDisplay.tsx     # 1RM推定表示
│   │
│   ├── analytics/
│   │   ├── WeightChart.tsx      # 体重推移グラフ
│   │   ├── CalorieChart.tsx     # カロリー推移グラフ
│   │   ├── VolumeChart.tsx      # ボリューム推移グラフ
│   │   ├── OneRmChart.tsx       # 1RM推移グラフ（BIG3）
│   │   └── PeriodSelector.tsx   # 期間選択タブ
│   │
│   └── settings/
│       ├── GoalSetting.tsx      # 目標設定
│       ├── OneRmFormulaSetting.tsx  # 1RM計算式選択
│       ├── FoodMasterList.tsx   # 食材マスタ管理
│       └── ExerciseMasterList.tsx # 種目マスタ管理
│
├── pages/
│   ├── Home.tsx
│   ├── Meals.tsx
│   ├── Workout.tsx
│   ├── Analytics.tsx
│   └── Settings.tsx
│
├── hooks/
│   ├── useWeightRecords.ts
│   ├── useMealRecords.ts
│   ├── useWorkoutSessions.ts
│   ├── useGoals.ts
│   ├── useRestTimer.ts
│   └── useOneRm.ts
│
├── db/
│   ├── database.ts              # Dexieセットアップ
│   └── seed.ts                  # 初期データ投入
│
└── utils/
    ├── calculations.ts          # PFC計算、ボリューム計算
    ├── oneRmCalculations.ts     # 1RM計算式
    ├── dateUtils.ts             # 日付ユーティリティ
    └── formatters.ts            # 表示フォーマット
```

---

## 実装優先順位

### Phase 1: MVP（1-2週間）
1. プロジェクトセットアップ + DB初期化
2. 下部ナビゲーション + ルーティング
3. 体重記録（入力・表示・履歴）
4. 食事記録（基本機能）
5. トレーニング記録（基本機能）
6. ホーム画面ダッシュボード

### Phase 2: 完成度向上（1週間）
7. 目標設定機能
8. 分析画面（グラフ）
9. レストタイマー（手動開始）
10. 1RM推定表示 + 計算式選択
11. PWA対応（オフライン）

### Phase 3: 磨き込み（1週間）
12. 任意フィールド追加（体脂肪率、RPE等）
13. 食材・種目のカスタム追加
14. 1RM推移グラフ（BIG3）
15. データエクスポート
16. UI/UXの細かい調整

---

## PWA設定

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Body Analyst',
        short_name: 'BodyAnalyst',
        description: 'ボディメイク記録アプリ',
        theme_color: '#3F83F8',
        background_color: '#F0F4FF',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
});
```

---

## 注意事項

1. **モバイルファースト**: 常にスマートフォン表示を優先してデザイン
2. **タッチ操作**: ボタンは最低44x44px、タップしやすいサイズ
3. **入力の簡素化**: 数値入力はステッパー（+/-ボタン）を用意
4. **即座の保存**: 入力したら自動保存（明示的な保存ボタン不要）
5. **キーボード対応**: 数値入力時はnumericキーボードを表示
6. **ローディング状態**: データ取得中はスケルトン表示
7. **空状態**: データがない場合は優しいメッセージと追加導線
8. **レストタイマー**: 手動開始（セット記録時に自動開始しない）
9. **1RM表示**: 計算式を確認できるようにする（ℹ️アイコンで詳細表示）

---

このプロンプトに従って、Body Analystアプリを実装してください。
まずPhase 1のMVP機能から始め、動作確認しながら段階的に機能を追加していきます。
