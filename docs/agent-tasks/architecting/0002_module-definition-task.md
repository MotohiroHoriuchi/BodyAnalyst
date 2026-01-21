# モジュール詳細仕様定義 タスク一覧

`docs/module-definition/` 配下に各モジュールの実装仕様書（ディレクトリ構成、主要コンポーネント、公開API、依存関係など）を作成する。

## ドメイン機能モジュール (Feature Modules)
各機能の責務、ディレクトリ構造、主要ファイル（Components, Hooks）、他モジュールへの依存を定義する。

- [ ] `docs/module-definition/dashboard/SPECIFICATIONS.md` (ダッシュボード機能)
- [x] `docs/module-definition/analytics/SPECIFICATIONS.md` (可視化エンジン - 最重要ロジック)
    - [x] `docs/module-definition/analytics/transformers/SPECIFICATIONS.md` (データ変換ロジック詳細)
    - [x] `docs/module-definition/analytics/components/SPECIFICATIONS.md` (グラフ描画コンポーネント詳細)
- [x] `docs/module-definition/workout/SPECIFICATIONS.md` (ワークアウト記録)
- [x] `docs/module-definition/meal/SPECIFICATIONS.md` (食事管理)
- [x] `docs/module-definition/weight/SPECIFICATIONS.md` (体組成管理)
- [ ] `docs/module-definition/settings/SPECIFICATIONS.md` (設定・ユーザー管理)

## 基盤・共通モジュール (Core & Infrastructure)
機能モジュールを支える下位レイヤーの仕様を定義する。

- [x] `docs/module-definition/core/SPECIFICATIONS.md` (共通UIコンポーネント、汎用フック)
    - [x] `docs/module-definition/core/SPECIFICATIONS.md` (概要)
    - [x] `docs/module-definition/core/components/SPECIFICATIONS.md` (UIコンポーネント詳細 - 分割・移動)
    - [x] `docs/module-definition/core/utils/SPECIFICATIONS.md` (ユーティリティ詳細 - 分割・移動)
- [x] `docs/module-definition/infrastructure/SPECIFICATIONS.md` (DB接続、リポジトリパターン、データ型変換)
- [x] `docs/module-definition/visualization-engine/SPECIFICATIONS.md` ([[BodyAnalyst/docs/system_architecture/visualization_engine/SPECIFICATIONS]]の詳細化)
	- [x] Pipe & Filterで構築する旨を明記
	- [x] パイプラインを流れるデータモデルを定義する
	- [x] フィルターでデータの演算を行う機能を定義する
		- [x] 具体例として、ベンチプレスの重量を体重で正規化する演算など、データ同士、またはデータと任意の数値で演算処理をパイプし、最終的にグラフPropとして出力する仕様を記載
	- [x] Engineは任意の数のフィルターをパイプしてグラフを作成できる機能をUI層に提供する
	- [x] 作成したフィルターを保存できる機能を定義する
	- [x] 上記機能仕様書を実装者の単位に分割し、仕様書として作成する
		- [x] 実装者は他実装者のインターフェースのみに依存する単位で分割できる

## 全体整合性確認
- [ ] 全モジュールの定義完了後、Overviewドキュメントとの整合性を確認する。\n## アーキテクチャ設計 (System Architecture)
システム全体の共通ルールや非機能要件を定義する。

- [x] `docs/system_architecture/routing/SPECIFICATIONS.md` (ルーティング設計：URL、遷移、ガード)
- [x] `docs/system_architecture/error-handling/SPECIFICATIONS.md` (エラーハンドリング戦略：境界、通知)
- [x] `docs/system_architecture/sync_logic/SPECIFICATIONS.md` (同期ロジック設計：トリガー、競合解決、再試行)
- [x] `docs/system_architecture/testing/SPECIFICATIONS.md` (テスト戦略：範囲、 ツール、カバレッジ)
    - [x] `docs/Inbox/testing_strategy_draft.md` (v1向けドラフトの一時保存と議論)
    - [x] `docs/technology-research/persistence-layer-comparison.md` (技術解説 ：IndexedDB vs Google Spreadsheet)
            - [x] `docs/technology-research/dexie-js-overview.md` (技術解説：Dexie.jsとは・競合比較)
            - [x] `docs/technology-research/pwa-tech-stack.md` (技術解説：PWA実現のための技術スタック)
            - [x] `docs/technology-research/vite-overview.md` (技術解説：Viteとは・Webpackとの違い)
            - [ ] `docs/technology-research/testing-tools-comparison.md` (技術解説：TypeScriptテストツール比較)
            - [ ] ユーザーによる技術ドキュメント確認とテスト戦略の議論・決定
