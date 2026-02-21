# Auth Module Specifications

> **更新履歴:** 2026-02-21 — `feature/storage-integration` にて TokenData を廃止し GoogleConnectionState に移行。セキュリティ改善。

## 1. Overview

Auth モジュールは Google OAuth2 認証、セッション管理、および Google 連携状態の永続化を担当する。

**設計方針の変更（v2）:**
- アクセストークンを localStorage に保存しない（セキュリティ改善）
- アクセストークンは `gapi.client` のメモリ内のみで保持（セッション中 ~1時間）
- localStorage には接続メタデータのみ（メール・名前・期限）を 30日間保存
- 起動時は `silentSignIn()` でサイレント再認証によりトークンをメモリに復元

## 2. Architecture & Responsibility

### 2.1 Scope
- **Protocol:** Google OAuth2 (Google Identity Services Token Model)
- **App Type:** SPA — サーバーサイドコンポーネントなし
- **Security Boundary:** アクセストークンは localStorage に保存しない。接続メタデータのみ保存。

### 2.2 Dependencies
- **Google API Client Library (gapi):** API アクセスとメモリ内トークン管理
- **Google Identity Services (GIS):** OAuth 同意フローとアクセストークン取得

## 3. Data Model

### 3.1 GoogleConnectionState

```typescript
interface GoogleConnectionState {
  email: string;               // ユーザーのメールアドレス
  name: string;                // ユーザー名
  picture?: string;            // プロフィール画像 URL（optional）
  connectedAt: number;         // 接続時刻（Unix ms）
  connectionExpiresAt: number; // connectedAt + 30 * 24 * 60 * 60 * 1000
}
```

- **Storage Key:** `google_connection_state`（旧 `google_auth_token` は廃止）
- **Storage Location:** `localStorage`
- **Format:** JSON string
- **含まれないもの:** `accessToken`（実トークンは localStorage に保存しない）

### 3.2 AuthState

```typescript
interface AuthState {
  isSignedIn: boolean;
  user: {
    email: string;
    name: string;
    picture?: string;
  } | null;
}
```

## 4. Token / Connection Lifecycle

```
localStorage
  google_connection_state → 30日間有効（メタデータのみ）

gapi.client (メモリ)
  access_token → セッション中のみ（~1時間）
  タブを閉じると消える（意図的）

起動時フロー:
  initializeGoogleAPI()
    → getConnectionState() で 30日以内か確認
    → 有効: silentSignIn() でトークンをメモリに復元
    → 無効/失敗: IndexedDB のまま継続（ユーザーは Settings から再接続）

DEV 環境のみ:
  import.meta.env.DEV が true の場合、
  接続状態がなくても silentSignIn() を試行（本番ビルドで tree-shaken）
```

### 4.1 初回ログイン（Settings から明示的操作）
1. `signIn()` で OAuth 同意画面を表示（`prompt: 'consent'`）
2. コールバックでアクセストークンを受け取り `gapi.client.setToken()` でセット
3. `fetchUserInfo()` でユーザー情報を取得
4. `saveConnectionState()` でメタデータを localStorage に保存（トークンは保存しない）
5. `AuthState` をリスナーに broadcast

### 4.2 起動時サイレント再認証
1. `initializeGoogleAPI()` で gapi + GIS を初期化
2. `getConnectionState()` で 30日TTL を確認
3. 有効な接続状態あり: `silentSignIn()` でトークンを取得（`prompt: ''`）
4. 成功: `gapi.client.setToken()` + `fetchUserInfo()` + `AuthState` broadcast
5. 失敗: `clearConnectionState()` → IndexedDB のまま継続

### 4.3 ログアウト
1. `signOut()` で `google.accounts.oauth2.revoke()` を呼び出し
2. `clearConnectionState()` で localStorage から接続状態を削除
3. `gapi.client.setToken(null)` でメモリのトークンを削除
4. `AuthState` に `isSignedIn: false` を broadcast

## 5. Public API

### 5.1 Connection State 管理

| 関数 | シグネチャ | 説明 |
|------|----------|------|
| `saveConnectionState` | `(state: GoogleConnectionState) => void` | 接続メタデータを localStorage に保存 |
| `getConnectionState` | `() => GoogleConnectionState \| null` | 取得。期限切れなら `null` + 自動削除 |
| `clearConnectionState` | `() => void` | localStorage から削除 |
| `isGoogleConnectionValid` | `() => boolean` | 30日以内の有効な接続状態があるか |
| `silentSignIn` | `() => Promise<void>` | `prompt: ''` でサイレント再認証 |

### 5.2 認証関数

| 関数 | シグネチャ | 説明 |
|------|----------|------|
| `initializeGoogleAPI` | `() => Promise<void>` | gapi + GIS 初期化。有効な接続状態あれば silentSignIn |
| `signIn` | `() => Promise<void>` | OAuth 同意フロー。成功時に接続状態を保存 |
| `signOut` | `() => void` | トークン失効・接続状態削除・AuthState リセット |
| `isSignedIn` | `() => boolean` | `gapi.client` のトークンの有無で判定 |
| `getAccessToken` | `() => string \| null` | メモリ内のアクセストークンを返す |

### 5.3 Auth State 購読

| 関数 | シグネチャ | 説明 |
|------|----------|------|
| `subscribeToAuthState` | `(listener: (state: AuthState) => void) => () => void` | 認証状態変化を購読。unsubscribe 関数を返す |

## 6. Component Structure

```
src/db/adapters/google_sheets/
├── auth.ts         # OAuth2 認証 + 接続状態管理
└── auth.test.ts    # GoogleConnectionState のユニット・統合テスト

src/auth/
├── AuthContext.tsx # React Context: GoogleSyncStatus 管理
├── useAuth.ts      # useContext フック
└── AuthContext.test.tsx
```

## 7. セキュリティ設計

| 保存場所 | 内容 | 保持期間 |
|---------|------|---------|
| `localStorage` | `GoogleConnectionState`（メール・名前・写真・期限） | 30日 |
| `gapi.client`（メモリ） | OAuth アクセストークン | セッション中（~1時間） |
| URL / console | **保存しない** | — |

## 8. TDD テストシナリオ

### 8.1 saveConnectionState
- **[正常] 保存:** email, name, picture, connectedAt, connectionExpiresAt が JSON で保存される
- **[正常] 上書き:** 既存の接続状態を上書きできる
- **[セキュリティ] トークン不在:** `accessToken` フィールドが JSON に含まれない

### 8.2 getConnectionState
- **[正常] 取得:** 保存済みの接続状態を取得できる
- **[正常] 未保存:** `null` を返す
- **[TTL] 29日後:** まだ有効、`null` でない
- **[TTL] 31日後:** `null` を返し localStorage からも削除される
- **[エラー] 不正 JSON:** `null` を返し localStorage をクリア

### 8.3 clearConnectionState
- **[正常] 削除:** localStorage から削除される
- **[エラー] 未保存:** エラーにならない

### 8.4 isGoogleConnectionValid
- **[正常] 有効:** `true`
- **[正常] 未保存:** `false`
- **[TTL] 期限切れ:** `false`

### 8.5 Connection State Lifecycle（統合テスト）
- **[重要] フロー:** 接続 → 状態確認 → 切断 が正しく動作する
- **[重要] TTL:** 30日境界で正確に有効/無効が切り替わる
