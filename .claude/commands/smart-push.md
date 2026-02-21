# Smart Push Command

変更内容を論理的な単位に分割してコミットし、リモートにプッシュします。

## 手順

1. `git status` と `git diff --stat HEAD` を実行して、全変更ファイルを把握する。

2. 変更を以下の基準でグループに分類する:
   - **ビルド設定変更** (package.json, vite.config, postcss, tailwind 等)
   - **プロトタイプ/VisEngine変更** (proto/ 配下)
   - **DBレイヤー変更** (src/db/ 配下)
   - **UIコンポーネント追加・変更** (src/components/, src/lib/)
   - **ページ・ルーティング変更** (src/App.tsx, src/pages/)
   - **ドキュメント追加・更新** (docs/)
   - **Claude設定・スキル変更** (.claude/)
   - **その他** (画像、プロトタイプフォルダ等)
   - 上記に当てはまらない変更は適宜判断して分類する

3. 各グループについて:
   - `git add <specific-files>` で対象ファイルを個別に指定してステージングする (git add -A や git add . は使わない)
   - Conventional Commits形式でコミットメッセージを作成する (feat/fix/refactor/chore/docs)
   - `git commit -m "..."` でコミットを作成する

4. 全コミット完了後、`git push origin <current-branch>` でプッシュする。

## 注意事項

- コミットメッセージは英語で記述する
- 機密ファイル (.env 等) は絶対にコミットしない
- `git add -A` や `git add .` は使用しない — 必ず個別ファイルを指定する
- 各コミットは単一の関心事（1つの機能・修正・変更）のみを含む
- `git push --force` は使用しない
