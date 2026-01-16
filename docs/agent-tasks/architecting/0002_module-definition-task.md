# モジュール詳細仕様定義 タスク一覧

`docs/module-definition/` 配下に各モジュールの実装仕様書（ディレクトリ構成、主要コンポーネント、公開API、依存関係など）を作成する。

## ドメイン機能モジュール (Feature Modules)
各機能の責務、ディレクトリ構造、主要ファイル（Components, Hooks）、他モジュールへの依存を定義する。

- [ ] `docs/module-definition/dashboard/SPECIFICATIONS.md` (ダッシュボード機能)
- [x] `docs/module-definition/analytics/SPECIFICATIONS.md` (可視化エンジン - 最重要ロジック)
    - [x] `docs/module-definition/analytics/transformers/SPECIFICATIONS.md` (データ変換ロジック詳細)
    - [x] `docs/module-definition/analytics/components/SPECIFICATIONS.md` (グラフ描画コンポーネント詳細)
- [ ] `docs/module-definition/workout/SPECIFICATIONS.md` (ワークアウト記録)
- [ ] `docs/module-definition/meal/SPECIFICATIONS.md` (食事管理)
- [ ] `docs/module-definition/weight/SPECIFICATIONS.md` (体組成管理)
- [ ] `docs/module-definition/settings/SPECIFICATIONS.md` (設定・ユーザー管理)

## 基盤・共通モジュール (Core & Infrastructure)
機能モジュールを支える下位レイヤーの仕様を定義する。

- [ ] `docs/module-definition/core/SPECIFICATIONS.md` (共通UIコンポーネント、汎用フック)
- [x] `docs/module-definition/infrastructure/SPECIFICATIONS.md` (DB接続、リポジトリパターン、データ型変換)

## 全体整合性確認
- [ ] 全モジュールの定義完了後、Overviewドキュメントとの整合性を確認する。