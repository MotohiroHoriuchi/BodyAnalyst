# Body Analyst アーキテクチャドキュメント

## 技術スタック概要

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  React 18 + TypeScript + Vite 5 + Tailwind CSS 3            │
├─────────────────────────────────────────────────────────────┤
│                      State Management                        │
│  React Hooks (useState, useEffect, useCallback, useRef)     │
│  Custom Hooks (useWeightRecords, useMealRecords, etc.)      │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                              │
│  Dexie.js (IndexedDB Wrapper)                               │
├─────────────────────────────────────────────────────────────┤
│                      Storage                                 │
│  Browser IndexedDB (100% Client-Side)                       │
└─────────────────────────────────────────────────────────────┘
```

## ディレクトリ構成

```
src/
├── main.tsx              # エントリーポイント
├── App.tsx               # ルートコンポーネント（ルーティング定義）
├── index.css             # グローバルCSS（Tailwind imports）
│
├── pages/                # 画面コンポーネント
│   ├── Home.tsx          # ホーム（ダッシュボード）
│   ├── Meals.tsx         # 食事記録
│   ├── Workout.tsx       # トレーニング記録
│   ├── Analytics.tsx     # 分析画面
│   ├── Settings.tsx      # 設定画面
│   └── index.ts          # エクスポート
│
├── components/           # UIコンポーネント
│   ├── common/           # 共通コンポーネント
│   │   ├── Header.tsx          # ページヘッダー
│   │   ├── BottomNav.tsx       # 下部ナビゲーション
│   │   ├── Button.tsx          # ボタン
│   │   ├── Card.tsx            # カード
│   │   ├── Modal.tsx           # モーダル
│   │   ├── Drawer.tsx          # スライドインパネル
│   │   ├── CircularProgress.tsx # 円形プログレス
│   │   ├── DateSelector.tsx    # 日付選択
│   │   ├── NumberStepper.tsx   # 数値ステッパー
│   │   └── EmptyState.tsx      # 空状態表示
│   │
│   ├── weight/           # 体重関連
│   │   └── WeightInput.tsx     # 体重入力フォーム
│   │
│   ├── meals/            # 食事関連
│   │   ├── MealSection.tsx     # 食事セクション
│   │   ├── PFCChart.tsx        # PFCチャート
│   │   ├── FoodSearch.tsx      # 食材検索
│   │   └── AddFoodModal.tsx    # 食材追加モーダル
│   │
│   ├── workout/          # トレーニング関連
│   │   ├── ExerciseSearch.tsx  # 種目検索
│   │   ├── ExerciseCard.tsx    # 種目カード
│   │   ├── SetInput.tsx        # セット入力
│   │   ├── RestTimer.tsx       # レストタイマー
│   │   ├── OneRmDisplay.tsx    # 1RM表示
│   │   ├── WorkoutHistory.tsx  # 履歴
│   │   └── WorkoutEditModal.tsx # 編集モーダル
│   │
│   └── analytics/        # 分析関連
│       ├── AnalyticsWindowCard.tsx     # ウィンドウカード
│       └── AnalyticsWindowEditModal.tsx # 編集モーダル
│
├── hooks/                # カスタムフック
│   ├── useWeightRecords.ts    # 体重記録CRUD
│   ├── useMealRecords.ts      # 食事記録CRUD
│   ├── useWorkoutSessions.ts  # トレーニング記録CRUD
│   ├── useFoodMaster.ts       # 食材マスタ操作
│   ├── useExerciseMaster.ts   # 種目マスタ操作
│   ├── useGoals.ts            # 目標設定
│   ├── useSettings.ts         # ユーザー設定
│   ├── useAnalyticsWindows.ts # 分析ウィンドウ
│   ├── useAnalyticsData.ts    # 分析データ取得
│   └── index.ts               # エクスポート
│
├── db/                   # データベース
│   ├── database.ts       # Dexie DB定義 + 型定義
│   └── seed.ts           # 初期データ（マスタデータ）
│
└── utils/                # ユーティリティ
    ├── calculations.ts   # カロリー計算など
    ├── oneRmCalculations.ts  # 1RM計算式
    ├── dateUtils.ts      # 日付操作
    └── formatters.ts     # フォーマッター
```

## コンポーネント設計

### レイヤー構成

```
┌──────────────────────────────────────────────────────────┐
│                    Pages Layer                            │
│  ・画面全体のレイアウト                                    │
│  ・hooksを使用してデータ取得・操作                         │
│  ・子コンポーネントへデータ/コールバック渡し               │
├──────────────────────────────────────────────────────────┤
│                  Components Layer                         │
│  ・再利用可能なUIコンポーネント                            │
│  ・Propsでデータ受け取り                                   │
│  ・表示ロジックのみ担当                                    │
├──────────────────────────────────────────────────────────┤
│                    Hooks Layer                            │
│  ・ビジネスロジック                                        │
│  ・DBアクセス（CRUD操作）                                  │
│  ・状態管理                                                │
├──────────────────────────────────────────────────────────┤
│                  Database Layer                           │
│  ・Dexie.jsによるIndexedDB操作                            │
│  ・テーブル定義                                            │
│  ・マイグレーション                                        │
└──────────────────────────────────────────────────────────┘
```

### データフロー

```
[User Action]
     │
     ▼
[Page Component]
     │
     ├──▶ [Custom Hook] ──▶ [Dexie DB] ──▶ [IndexedDB]
     │         │
     │         ▼
     │    [State Update]
     │         │
     ▼         ▼
[UI Component] ◀──────────
```

## データベース設計

### テーブル一覧

| テーブル名 | 説明 | 主なフィールド |
|-----------|------|---------------|
| `weightRecords` | 体重記録 | date, weight, bodyFatPercentage, timing |
| `foodMaster` | 食材マスタ | name, caloriesPer100g, proteinPer100g, isCustom |
| `mealRecords` | 食事記録 | date, mealType, items[], totalCalories |
| `exerciseMaster` | 種目マスタ | name, bodyPart, isCompound, isCustom |
| `workoutSessions` | トレーニング記録 | date, exercises[], totalVolume |
| `userGoals` | 目標設定 | goalType, targetCalories, targetProtein |
| `userSettings` | ユーザー設定 | oneRmFormula |
| `analyticsWindows` | 分析ウィンドウ | name, data1, data2, periodDays, size |

### ER図（概念）

```
┌─────────────────┐       ┌─────────────────┐
│  FoodMaster     │       │  ExerciseMaster │
│  (食材マスタ)    │       │  (種目マスタ)    │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ name            │       │ name            │
│ caloriesPer100g │       │ bodyPart        │
│ proteinPer100g  │       │ isCompound      │
│ fatPer100g      │       │ isCustom        │
│ carbsPer100g    │       └────────┬────────┘
│ isCustom        │                │
└────────┬────────┘                │
         │ 参照                     │ 参照
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│  MealRecord     │       │  WorkoutSession │
│  (食事記録)      │       │  (トレ記録)      │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ date            │       │ date            │
│ mealType        │       │ startTime       │
│ items[]         │◀──────│ exercises[]     │
│   └ foodId      │       │   └ exerciseId  │
│   └ amount      │       │   └ sets[]      │
│ totalCalories   │       │ totalVolume     │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  WeightRecord   │       │  UserGoal       │
│  (体重記録)      │       │  (目標設定)      │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ date            │       │ goalType        │
│ weight          │       │ targetWeight    │
│ bodyFatPercent  │       │ targetCalories  │
│ timing          │       │ targetProtein   │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  UserSettings   │       │ AnalyticsWindow │
│  (設定)         │       │  (分析ウィンドウ) │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ oneRmFormula    │       │ name            │
└─────────────────┘       │ data1 (config)  │
                          │ data2 (config)  │
                          │ periodDays      │
                          │ size            │
                          │ order           │
                          └─────────────────┘
```

### インデックス設計

```typescript
// database.ts より
this.version(2).stores({
  weightRecords: '++id, date',           // 日付で検索
  foodMaster: '++id, name, isCustom',    // 名前検索、カスタムフラグ
  mealRecords: '++id, date, mealType',   // 日付+食事タイプ
  exerciseMaster: '++id, name, bodyPart, isCustom',
  workoutSessions: '++id, date',         // 日付で検索
  userGoals: '++id, goalType',
  userSettings: '++id',
  analyticsWindows: '++id, order'        // 表示順
});
```

## カスタムフック詳細

### useWeightRecords

```typescript
interface UseWeightRecords {
  records: WeightRecord[] | undefined;    // 全記録
  todayRecords: WeightRecord[];           // 今日の記録
  isLoading: boolean;
  addRecord: (data: Partial<WeightRecord>) => Promise<number>;
  updateRecord: (id: number, data: Partial<WeightRecord>) => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  getRecordsByDateRange: (start: string, end: string) => Promise<WeightRecord[]>;
}
```

### useMealRecords

```typescript
interface UseMealRecords {
  records: MealRecord[] | undefined;      // 全記録
  todayRecords: MealRecord[];             // 今日の記録
  addMeal: (date: string, mealType: string, items: MealItem[]) => Promise<void>;
  updateMeal: (id: number, items: MealItem[]) => Promise<void>;
  deleteMeal: (id: number) => Promise<void>;
  addItemToMeal: (mealId: number, item: MealItem) => Promise<void>;
  removeItemFromMeal: (mealId: number, foodId: number) => Promise<void>;
}
```

### useWorkoutSessions

```typescript
interface UseWorkoutSessions {
  sessions: WorkoutSession[] | undefined;
  activeSession: WorkoutSession | null;   // 進行中のセッション
  startSession: () => Promise<number>;
  endSession: (id: number) => Promise<void>;
  addExercise: (sessionId: number, exercise: ExerciseMaster) => Promise<void>;
  addSet: (sessionId: number, exerciseIndex: number, set: WorkoutSet) => Promise<void>;
  updateSession: (id: number, data: Partial<WorkoutSession>) => Promise<void>;
  deleteSession: (id: number) => Promise<void>;
}
```

### useAnalyticsWindows

```typescript
interface UseAnalyticsWindows {
  windows: AnalyticsWindow[] | undefined;
  addWindow: (data1: AnalyticsDataConfig, data2?: AnalyticsDataConfig,
              name?: string, size?: WindowSize, periodDays?: number) => Promise<number>;
  updateWindow: (id: number, data: Partial<AnalyticsWindow>) => Promise<void>;
  deleteWindow: (id: number) => Promise<void>;
  reorderWindows: (orderedIds: number[]) => Promise<void>;
  duplicateWindow: (id: number) => Promise<number>;
}
```

## 状態管理パターン

### ローカルステート

- `useState`: コンポーネント固有のUI状態
- `useRef`: DOM参照、前回値の保持

### 派生ステート

```typescript
// 例: 今日の記録をフィルタリング
const todayRecords = useMemo(() => {
  if (!records) return [];
  const today = format(new Date(), 'yyyy-MM-dd');
  return records.filter(r => r.date === today);
}, [records]);
```

### 非同期状態

```typescript
// Dexie React Hooks を使用
const records = useLiveQuery(() => db.weightRecords.toArray());
// → recordsはundefined（ローディング中）またはWeightRecord[]
```

## UIコンポーネントパターン

### Compound Components

```tsx
// 例: Card コンポーネント
<Card>
  <Card.Header>タイトル</Card.Header>
  <Card.Body>コンテンツ</Card.Body>
</Card>
```

### Controlled Components

```tsx
// 例: NumberStepper
<NumberStepper
  value={weight}
  onChange={setWeight}
  min={30}
  max={200}
  step={0.1}
/>
```

### Render Props / Children Props

```tsx
// 例: Modal
<Modal isOpen={show} onClose={handleClose} title="編集">
  {children}
</Modal>
```

## アニメーション実装

### FLIPアニメーション（Analytics.tsx）

```typescript
function useFlipAnimation(windows) {
  const positionsRef = useRef<Map<number, DOMRect>>(new Map());

  // 1. First: 変更前の位置を記録
  const capturePositions = () => {
    items.forEach(item => {
      positionsRef.current.set(id, item.getBoundingClientRect());
    });
  };

  // 2. Last + Invert + Play: useLayoutEffect内で実行
  useLayoutEffect(() => {
    items.forEach(item => {
      const oldRect = positionsRef.current.get(id);
      const newRect = item.getBoundingClientRect();

      // Invert: 差分を計算
      const deltaX = oldRect.left - newRect.left;
      const deltaY = oldRect.top - newRect.top;

      // Play: アニメーション適用
      el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      el.style.transition = 'none';

      requestAnimationFrame(() => {
        el.style.transition = 'transform 300ms ease-out';
        el.style.transform = '';
      });
    });
  }, [windows]);
}
```

## PWA設定

### vite.config.ts

```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Body Analyst',
        short_name: 'BodyAnalyst',
        theme_color: '#6366f1',
        icons: [...]
      }
    })
  ]
});
```

## パフォーマンス考慮事項

### メモ化

```typescript
// 重い計算をメモ化
const mergedData = useMemo(() => {
  // データ統合処理
}, [dataset1, dataset2]);

// コールバックをメモ化
const handleResize = useCallback((id, size) => {
  updateWindow(id, { size });
}, [updateWindow]);
```

### 遅延読み込み

```typescript
// 将来的に実装可能
const Analytics = lazy(() => import('./pages/Analytics'));
```

### IndexedDBのインデックス活用

```typescript
// 日付範囲クエリを高速化
db.weightRecords.where('date').between(startDate, endDate);
```

## テスト戦略（将来実装）

```
Unit Tests:
  - utils/calculations.ts
  - utils/oneRmCalculations.ts
  - utils/dateUtils.ts

Integration Tests:
  - hooks/useWeightRecords.ts
  - hooks/useMealRecords.ts

E2E Tests:
  - 体重記録フロー
  - 食事記録フロー
  - トレーニング記録フロー
```

## 既知の制限事項

1. **モーダルボタン表示問題**: iOSなど一部環境でモーダル下部が切れる
   - 暫定対応: Drawer（スライドインパネル）方式に変更

2. **データ同期なし**: 現在はローカル保存のみ
   - 将来: クラウド同期機能を検討

3. **バックアップ機能なし**: ブラウザデータ削除で消失
   - 将来: エクスポート/インポート機能を検討
