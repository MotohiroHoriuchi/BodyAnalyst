# Storage Module Specifications

> **作成日:** 2026-02-21 — `feature/storage-integration`

## 1. Overview

Storage モジュールは `IStorageAdapter` インターフェースによる抽象化を通じ、IndexedDB と Google Sheets の両方のストレージバックエンドをサポートする。

**設計方針:**
- IndexedDB（Dexie.js）がデフォルト。Google 連携は任意のオプション機能。
- アプリは常にすぐ使える状態で起動（認証不要）
- `AdapterProxy` で実行時にアダプターを切り替え可能

## 2. Architecture

```
IStorageAdapter (interface)
├── IndexedDBAdapter   ← デフォルト、Dexie.js v4、オフライン動作
└── GoogleSheetsAdapter ← オプション、Google OAuth2 必須

AdapterProxy
└── 現在の IStorageAdapter を保持・委譲

db/index.ts
├── proxy (AdapterProxy)
├── weightRepository (WeightRepository)
├── workoutRepository (WorkoutRepository)
├── mealRepository (MealRepository)
├── initializeDatabase()     ← IndexedDB 即時初期化 + バックグラウンド Google 接続
├── connectGoogleAdapter()   ← Settings からの手動連携
└── disconnectGoogleAdapter() ← Google 切断、IndexedDB に戻す
```

## 3. IStorageAdapter インターフェース

```typescript
interface IStorageAdapter {
  initialize(): Promise<void>;
  isReady(): boolean;
  read<T>(collection: string, query?: any): Promise<T[]>;
  create(collection: string, data: any): Promise<string>;
  createBatch?(collection: string, dataArray: any[]): Promise<string[]>;
  update(collection: string, id: string, data: any): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}
```

## 4. IndexedDBAdapter

### 4.1 DB 定義
- **ライブラリ:** Dexie.js v4.2.1
- **DB 名:** `BodyAnalystDB`（テスト時は一意名を使用）
- **バージョン:** 1

### 4.2 コレクション（Google Sheets の sheet 名と共通）

| コレクション | インデックス |
|------------|------------|
| `Weight` | `++id, date, weight, bodyFatPercentage, muscleMass, timing, memo, createdAt, updatedAt` |
| `WorkoutSessions` | `++id, date, startTime, endTime, exercises, totalVolume, memo, createdAt, updatedAt` |
| `ExerciseMaster` | `++id, name, bodyPart, isCompound, isCustom, createdAt` |
| `MealRecords` | `++id, date, mealType, items, totalCalories, totalProtein, totalFat, totalCarbs, memo, createdAt, updatedAt` |
| `FoodMaster` | `++id, name, caloriesPer100g, proteinPer100g, fatPer100g, carbsPer100g, isCustom, createdAt` |

### 4.3 ID 戦略
- Dexie の `++id` オートインクリメント（数値）
- `IStorageAdapter` との互換性のため、外部には `String(id)` として返す

### 4.4 テスト環境
- `fake-indexeddb/auto` を `src/test/setup.ts` で import（jsdom 環境での Dexie テスト用）

## 5. AdapterProxy

```typescript
class AdapterProxy implements IStorageAdapter {
  private current: IStorageAdapter;
  getCurrent(): IStorageAdapter
  setCurrent(adapter: IStorageAdapter): void
  // 全 IStorageAdapter メソッドを current に委譲
  // createBatch: current に実装がない場合、sequential create にフォールバック
}
```

### 5.1 切り替えのタイミング

| イベント | 切り替え先 |
|---------|-----------|
| アプリ起動 | IndexedDB（即時） |
| バックグラウンド silentSignIn 成功 | GoogleSheetsAdapter |
| Settings から手動連携完了 | GoogleSheetsAdapter |
| Settings から連携解除 | IndexedDB（起動時の同一インスタンスを再利用） |

### 5.2 レースコンディション対策
`disconnectGoogleAdapter()` は起動時に初期化済みの `IndexedDBAdapter` インスタンス（`indexedDBAdapter` シングルトン）を再利用する。
新しいインスタンスを非同期で初期化する実装は避けること（初期化完了前に読み取りが発生するリスクがある）。

## 6. 技術負債

**ADR-0003 参照:** 現在の実装はアダプター切り替え（Switch）であり、Local-First Sync（双方向同期）ではない。

課題の詳細と将来の実装方針は `docs/adr/0003-storage-adapter-switch-not-sync.md` を参照。

## 7. TDD テストシナリオ（IndexedDBAdapter）

### 7.1 initialize()
- 正常に完了する
- 複数回呼んでもエラーにならない

### 7.2 isReady()
- initialize() 前: false
- initialize() 後: true

### 7.3 create() / read()
- create() でレコードを作成し read() で取得できる
- 複数レコードを作成できる
- 異なるコレクションは独立している

### 7.4 update()
- フィールドが部分更新される（未変更フィールドは保持）
- 存在しない id はエラー

### 7.5 delete()
- レコードが削除される
- 存在しない id はエラー
- 一部のみ削除できる

### 7.6 read() フィルタリング
- query でフィルタリングできる
- query なしは全件返す

### 7.7 createBatch()
- 複数レコードを一括作成できる
- 空配列は空配列を返す
