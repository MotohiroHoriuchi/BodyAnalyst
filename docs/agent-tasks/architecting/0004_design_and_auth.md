# デザイン・アーキテクチャ詳細化 タスク一覧

デザイナーとしての活動と、Google Sheets API本格採用に伴い、以下のタスクを追加することを提案する。

## デザインプロトタイプ作成 (Design)
ダッシュボード以外の主要画面についても、実装前にHTML/CSSプロトタイプを作成する。
- [ ] `design_prototypes/meal/` : 食事記録・検索画面のデザイン
- [ ] `design_prototypes/workout/` : ワークアウト記録画面のデザイン
- [ ] `design_prototypes/settings/` : 設定・プロフィール画面のデザイン

## 認証モジュール詳細設計 (Auth)
概要ドキュメントは作成したが、実装に向けた詳細設計が必要。
- [ ] `docs/module-definition/auth/SPECIFICATIONS.md` を作成し、`@react-oauth/google` などのライブラリ選定、`AuthProvider` の構成、LocalStorageへのトークン保存の実装ロジックを定義する。

## ダッシュボード実装仕様の具体化
- [x] デザインプロトタイプ (`design_prototypes/dashboard/`) を元に、`docs/module-definition/dashboard/SPECIFICATIONS.md` を作成・詳細化する。コンポーネント分割、Grid Systemの実装方針を確定する。
