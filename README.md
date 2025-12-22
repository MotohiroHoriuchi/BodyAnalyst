# Body Analyst

ボディメイク・フィットネス管理のためのPWAアプリケーション。体重、食事（PFC）、トレーニングを記録・分析し、データドリブンな身体づくりをサポートします。

## 機能

### 体重記録
- 毎日の体重を記録（朝/夜/その他のタイミング選択）
- 体脂肪率のオプション記録
- 体重推移グラフの表示

### 食事記録
- 朝食・昼食・夕食・間食の4区分で記録
- 食材マスタからの検索・追加
- PFC（タンパク質・脂質・炭水化物）バランスの可視化
- カロリー目標に対する進捗表示

### トレーニング記録
- ワークアウトセッションの開始/終了
- 種目別のセット記録（重量×回数×セット数）
- ウォームアップセットの区別
- RPE（主観的運動強度）の記録
- レストタイマー機能
- 1RM推定表示（Epley/Brzycki/Lombardi/O'Conner式）
- トレーニングボリュームの自動計算

### 分析
- 体重推移グラフ（週/月/年）
- カロリー推移グラフ（目標ライン付き）
- トレーニングボリューム推移グラフ

### 設定
- 目標体重・目標カロリーの設定
- PFC目標値の設定
- 1RM計算式の選択

## 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite 5
- **スタイリング**: Tailwind CSS 3
- **データベース**: Dexie.js（IndexedDB）
- **グラフ**: Recharts
- **アイコン**: Lucide React
- **日付処理**: date-fns
- **PWA**: vite-plugin-pwa

## セットアップ

### 必要環境
- Node.js 18以上
- npm 9以上

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## プロジェクト構成

```
src/
├── components/
│   ├── common/          # 共通UIコンポーネント
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── DateSelector.tsx
│   │   ├── NumberStepper.tsx
│   │   └── EmptyState.tsx
│   ├── weight/          # 体重関連コンポーネント
│   │   └── WeightInput.tsx
│   ├── meals/           # 食事関連コンポーネント
│   │   ├── MealSection.tsx
│   │   ├── FoodSearch.tsx
│   │   ├── AddFoodModal.tsx
│   │   └── PFCChart.tsx
│   └── workout/         # トレーニング関連コンポーネント
│       ├── RestTimer.tsx
│       ├── OneRmDisplay.tsx
│       ├── ExerciseSearch.tsx
│       ├── SetInput.tsx
│       ├── ExerciseCard.tsx
│       └── WorkoutHistory.tsx
├── pages/
│   ├── Home.tsx         # ホームダッシュボード
│   ├── Meals.tsx        # 食事記録
│   ├── Workout.tsx      # トレーニング記録
│   ├── Analytics.tsx    # 分析グラフ
│   └── Settings.tsx     # 設定
├── hooks/               # カスタムフック
│   ├── useWeightRecords.ts
│   ├── useMealRecords.ts
│   ├── useWorkoutSessions.ts
│   ├── useGoals.ts
│   ├── useSettings.ts
│   ├── useFoodMaster.ts
│   └── useExerciseMaster.ts
├── db/
│   ├── database.ts      # Dexieデータベース定義
│   └── seed.ts          # 初期データ
├── utils/
│   ├── dateUtils.ts     # 日付ユーティリティ
│   ├── calculations.ts  # 計算ロジック
│   ├── formatters.ts    # フォーマッター
│   └── oneRmCalculations.ts  # 1RM計算式
├── App.tsx
├── main.tsx
└── index.css
```

## オフライン対応

IndexedDB（Dexie.js）を使用したオフラインファーストアーキテクチャにより、ネットワーク接続がなくてもすべての機能が利用可能です。

## 既知の不具合

### 食材検索画面での重複表示
- **症状**: 食事追加モーダルで、検索前のカテゴリ別食品リストに同じ食品が重複して表示される場合がある
- **影響**: 表示上の問題のみ。検索機能および食品の追加機能は正常に動作する
- **回避策**: 検索ボックスに食品名を入力して検索を行う
- **状態**: 調査中

### モーダルの表示問題（暫定対応済み）
- **症状**: ボトムシート形式のモーダルでコンテンツが長い場合、ボタンが画面外に切れて操作できなくなる
- **暫定対応**: モーダルをDrawer（右からスライドイン）形式に変更し、ボタンを上部に配置
- **影響を受けていた画面**: 分析ウィンドウ作成、食事追加、トレーニング編集、目標設定など
- **状態**: 暫定対応済み（根本原因は調査中）

## ライセンス

MIT
