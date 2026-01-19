# 同期ロジック 依存関係・データフロー図（ドラフト）

この図は、ローカルの Dexie.js データベースとリモートの Google スプレッドシート間のデータ同期プロセスに関与するアーキテクチャ構成要素の概要を示したものです。

## アーキテクチャ・ブロック図

``` mermaid
graph TD
    %% --- ユーザーインターフェース層 ---
    subgraph UI_Layer [UI層]
        Component[Reactコンポーネント]
    end

    %% --- 機能ロジック層 ---
    subgraph Feature_Layer [機能モジュール]
        useWorkout[useWorkout フック]
        useMeal[useMeal フック]
    end

    %% --- データアクセス層 (ローカル) ---
    subgraph Local_Data_Layer [ローカルデータアクセス]
        LocalRepo[ローカルリポジトリ]
        DexieDB[(Dexie.js / IndexedDB)]
    end

    %% --- 同期層 (コアロジック) ---
    subgraph Sync_Layer [同期マネージャーモジュール]
        SyncManager[同期マネージャー]
        ConflictResolver[競合解決エージェント]
        QueueManager[操作キュー管理]
    end

    %% --- インフラストラクチャ層 (リモート) ---
    subgraph Remote_Infra_Layer [インフラ層]
        SheetAdapter[Google Sheets アダプター]
        RemoteAPI[Google Sheets API]
    end

    %% --- データフロー ---
    
    %% 1. ユーザーアクション
    Component -->|1. 保存アクション| useWorkout
    
    %% 2. ローカル保存 (常に最優先)
    useWorkout -->|2. 保存呼び出し| LocalRepo
    LocalRepo -->|3. データを永続化| DexieDB
    
    %% 3. 同期トリガー
    LocalRepo -.->|4. 変更を通知 - Observer| SyncManager
    
    %% 4. 同期プロセス
    SyncManager -->|5. キューまたはネットワークを確認| QueueManager
    SyncManager -->|6. 競合を解決| ConflictResolver
    
    %% 5. リモート実行
    SyncManager -->|7. データをアップロード| SheetAdapter
    SheetAdapter -->|8. HTTPリクエスト| RemoteAPI
    
    %% 6. フィードバックループ
    RemoteAPI -- 9. 成功または失敗 --> SheetAdapter
    SheetAdapter -- 10. 結果を返す --> SyncManager
    SyncManager -->|11. 同期ステータスを更新| DexieDB
```

## 主要コンポーネントの説明

1.  **ローカルリポジトリ (LocalRepo):**
    *   UIにとっての唯一のデータソース。
    *   オフライン機能を保証するため、即座に `DexieDB` にデータを保存。
    *   ネットワークリクエストの完了を待機しない。

2.  **同期マネージャー (SyncManager):**
    *   `DexieDB` の変更を監視（またはトリガーを受信）。
    *   同期プロセス全体をオーケストレートする。
    *   同期のタイミング（即時、デバウンス、定期的など）を決定する。

3.  **操作キュー管理 (QueueManager):**
    *   ネットワークがオフラインの場合や同期が失敗した場合に、保留中の変更（作成、更新、削除）を保持する。
    *   操作が正しい順序で再実行されることを保証する。

4.  **競合解決エージェント (ConflictResolver):**
    *   サーバー上とクライアント上の両方でデータが変更されたシナリオを処理する。
    *   デフォルト戦略: **Last Write Wins** (最後に書き込んだ方を優先)、またはサーバーのタイムスタンプに基づく。

5.  **Google Sheets アダプター:**
    *   Google Sheets API の複雑な処理（OAuth認証、セルのフォーマット、行の追加など）を隠蔽する。