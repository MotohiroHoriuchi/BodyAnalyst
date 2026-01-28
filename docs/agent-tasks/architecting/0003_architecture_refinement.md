# アーキテクチャ・設計の整合性確保 タスク一覧

現状のドキュメント構造と実装方針の整合性を高めるため、以下の修正・定義タスクを実施する。

## データ定義のリファクタリング
- [ ] `docs/data_definition/food/DEFINITIONS.md` に混在している `MealRecord` の定義を、新設する `docs/data_definition/meal/DEFINITIONS.md` に移動し、ドメインごとの定義を明確化する。

## テスト戦略の確定
Geminiのメモリには「Vitest使用」とあるが、`package.json` にはテストツールが含まれていないため、方針を再定義する。

- [ ] `docs/technology-research/testing-tools-comparison.md` を更新・完了させ、採用ツール（Vitest推奨）と設定方針を確定する。
- [ ] `docs/system_architecture/testing/SPECIFICATIONS.md` に具体的なテスト実行コマンドやディレクトリ構成のルールを追記する。