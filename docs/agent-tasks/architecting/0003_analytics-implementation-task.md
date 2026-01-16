# Analytics（可視化エンジン）実装タスク

モジュール定義に基づき、可視化エンジンに必要な具体的な Transformers と Components を実装する。

## 1. Transformers (ビジネスロジック)
`src/features/analytics/engine/transformers/definitions/` に純粋関数を作成する。

- [ ] **Weight Trend Transformer** (`weightTrend.ts`)
    - **入力:** `WeightRecord[]`
    - **出力:** 折れ線グラフ用Props (日付 vs 体重/体脂肪率)
    - **ロジック:** 日次/週次の集計、欠損値のスキップ処理。
- [ ] **Workout Volume Transformer** (`workoutVolume.ts`)
    - **入力:** `WorkoutSession[]`
    - **出力:** 棒グラフ/折れ線グラフ用Props (日付 vs 総ボリューム)
    - **ロジック:** 日ごと/週ごとのボリューム合計計算。
- [ ] **PFC Balance Transformer** (`pfcBalance.ts`)
    - **入力:** `MealRecord[]` (日次サマリー)
    - **出力:** 円グラフまたは積み上げ棒グラフ用Props (PFC比率)
    - **ロジック:** グラム数からカロリー比率（%）への換算。
- [ ] **Calorie Trend Transformer** (`calorieTrend.ts`)
    - **入力:** `MealRecord[]`
    - **出力:** 目標ライン付き折れ線グラフ用Props (日付 vs 摂取カロリー)

## 2. Components (UI実装)
`src/features/analytics/components/` にReactコンポーネントを作成する。

### 再利用パーツ (`parts/`)
- [ ] **Custom Tooltip** (`CustomTooltip.tsx`)
    - **スタイル:** Shadcn/UI Card風のデザイン。
    - **機能:** Rechartsからのペイロードを受け取り、ラベルと値を整理して表示する。
- [ ] **Custom Legend** (`CustomLegend.tsx`)
    - **スタイル:** Tailwind CSSを用いたシンプルなFlexレイアウト（色付きドット + ラベル）。
- [ ] **Custom Axis** (`CustomAxis.tsx`)
    - **設定:** フォントサイズ、色、目盛りのフォーマッター（日付形式など）を統一定義。

### チャートブロック (`charts/`)
- [ ] **Line Chart Block** (`LineChartBlock.tsx`)
    - Recharts `<LineChart>` のラッパー。
    - 2軸（例: 体重と体脂肪率）の表示をサポートすること。
- [ ] **Bar Chart Block** (`BarChartBlock.tsx`)
    - Recharts `<BarChart>` のラッパー。
- [ ] **Pie Chart Block** (`PieChartBlock.tsx`)
    - Recharts `<PieChart>` のラッパー。

### エントリポイント
- [ ] **Visualization Block** (`VisualizationBlock.tsx`)
    - `data` と `config` を受け取るコンテナコンポーネントを実装する。
    - **ロジック:** `config.type` に基づき、適切な Transformer と Chart Component を動的に選択して描画する。