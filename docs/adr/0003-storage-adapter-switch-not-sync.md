# ADR-0003: ストレージはアダプター切り替え方式（同期なし）で実装する

- **日付:** 2026-02-21
- **ステータス:** 採用済み

## コンテキスト

`feature/storage-integration` では、以下の設計方針でストレージ層を実装した：

- **デフォルト:** IndexedDB（Dexie.js）でオフラインファースト
- **オプション:** Google Sheets アダプターへの切り替え（Settings 画面から手動連携）
- **仕組み:** `AdapterProxy` が現在のアダプターを保持し、全 Repository は Proxy 経由でアクセスする

## 決定

現時点では「**アダプター切り替え（Switch）**」を採用し、「**双方向同期（Local-First Sync）**」は実装しない。

### 理由

1. **スコープの明確化:** 今回の計画は「Google 連携を任意のバックアップとして提供する」ことが目的であり、リアルタイム同期は別フェーズのタスクとして分離した。
2. **UX の単純化:** IndexedDB と Google Sheets の両方にデータが分散する状態を避けることで、ユーザーへの混乱を減らす。
3. **実装コストの削減:** 競合解決（Conflict Resolution）・差分検出・オフライン書き込みキューなどの複雑な実装を後回しにする。

## 技術負債と将来への影響

### 既知の課題

1. **データ断絶のリスク:**
   未連携状態で IndexedDB にデータを書き込み、後から Google Sheets に連携した場合、既存のローカルデータは Sheets に自動移行されない。
   → 初回 Google 連携時に「ローカルデータをアップロードしますか？」の確認フローが必要。

2. **切断後のデータアクセス:**
   Google 連携を解除した後、IndexedDB には連携前のデータしか存在しない（連携中に Sheets に書き込んだデータは IndexedDB に存在しない）。
   → 切断フロー時に「Sheets のデータをローカルにダウンロードしますか？」のフローが必要。

3. **Local-First Sync の未実装:**
   `docs/system_architecture/sync_logic/SPECIFICATIONS.md` で定義された "Local-First" アーキテクチャ（常に IndexedDB に書き込み、バックグラウンドで Sheets と差分同期）は実装されていない。

### 将来の実装に向けた方針

以下のいずれかのアプローチを検討する：

- **Option A: 二重書き込み方式**
  各 Repository の `create/update/delete` を IndexedDB と Google Sheets の両方に書き込む。Sheets が失敗した場合はリトライキューに積む。

- **Option B: SyncManager 層の追加**
  `IndexedDB` を唯一の真実の源（source of truth）とし、`SyncManager` が定期的に Sheets との差分を検出・反映する。

実装は次のフェーズ（`feature/sync-integration`）で行う予定。

## 参照

- `docs/system_architecture/sync_logic/SPECIFICATIONS.md`
- `src/db/AdapterProxy.ts`
- `src/db/index.ts`
