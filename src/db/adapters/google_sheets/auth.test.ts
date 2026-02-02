import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import {
  saveToken,
  getToken,
  clearToken,
  isTokenValid,
  type TokenData,
} from './auth';

describe('Token Cache Management', () => {
  const STORAGE_KEY = 'google_auth_token';

  // Setup localStorage mock
  beforeAll(() => {
    const localStorageMock = {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] || null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value.toString();
      },
      removeItem(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };

    global.localStorage = localStorageMock as any;
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset time mocks
    vi.useRealTimers();
  });

  describe('saveToken', () => {
    it('accessTokenとexpiresAtをLocalStorageに保存できること', () => {
      const tokenData: TokenData = {
        accessToken: 'ya29.a0test123',
        expiresAt: Date.now() + 3600000, // 1時間後
      };

      saveToken(tokenData);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.accessToken).toBe(tokenData.accessToken);
        expect(parsed.expiresAt).toBe(tokenData.expiresAt);
      }
    });

    it('既存のトークンを上書きできること', () => {
      const oldToken: TokenData = {
        accessToken: 'old_token',
        expiresAt: Date.now() + 1000,
      };

      const newToken: TokenData = {
        accessToken: 'new_token',
        expiresAt: Date.now() + 5000,
      };

      saveToken(oldToken);
      saveToken(newToken);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.accessToken).toBe(newToken.accessToken);
        expect(parsed.expiresAt).toBe(newToken.expiresAt);
      }
    });
  });

  describe('getToken', () => {
    it('保存されたトークンを取得できること', () => {
      const tokenData: TokenData = {
        accessToken: 'ya29.a0test123',
        expiresAt: Date.now() + 3600000, // 1時間後
      };

      saveToken(tokenData);
      const retrieved = getToken();

      expect(retrieved).not.toBeNull();
      expect(retrieved?.accessToken).toBe(tokenData.accessToken);
      expect(retrieved?.expiresAt).toBe(tokenData.expiresAt);
    });

    it('トークンがない場合はnullを返すこと', () => {
      const retrieved = getToken();
      expect(retrieved).toBeNull();
    });

    it('有効期限が切れている場合はnullを返し、LocalStorageからクリアすること', () => {
      const expiredToken: TokenData = {
        accessToken: 'ya29.a0expired',
        expiresAt: Date.now() - 1000, // 過去の時刻（期限切れ）
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(expiredToken));

      const retrieved = getToken();
      expect(retrieved).toBeNull();

      // LocalStorageからも削除されていることを確認
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeNull();
    });

    it('不正なJSONデータの場合はnullを返し、クリアすること', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      const retrieved = getToken();
      expect(retrieved).toBeNull();

      // LocalStorageからも削除されていることを確認
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeNull();
    });
  });

  describe('clearToken', () => {
    it('LocalStorageからトークンを削除できること', () => {
      const tokenData: TokenData = {
        accessToken: 'ya29.a0test123',
        expiresAt: Date.now() + 3600000,
      };

      saveToken(tokenData);
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

      clearToken();

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeNull();
    });

    it('トークンがない場合でもエラーにならないこと', () => {
      expect(() => clearToken()).not.toThrow();
    });
  });

  describe('isTokenValid', () => {
    it('有効なトークンの場合はtrueを返すこと', () => {
      const validToken: TokenData = {
        accessToken: 'ya29.a0valid',
        expiresAt: Date.now() + 3600000, // 1時間後
      };

      saveToken(validToken);

      const isValid = isTokenValid();
      expect(isValid).toBe(true);
    });

    it('期限切れのトークンの場合はfalseを返すこと', () => {
      const expiredToken: TokenData = {
        accessToken: 'ya29.a0expired',
        expiresAt: Date.now() - 1000, // 過去の時刻
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(expiredToken));

      const isValid = isTokenValid();
      expect(isValid).toBe(false);
    });

    it('トークンがない場合はfalseを返すこと', () => {
      const isValid = isTokenValid();
      expect(isValid).toBe(false);
    });
  });

  describe('Token Lifecycle (統合テスト)', () => {
    it('ログイン→セッション復元→ログアウトのフローが正しく動作すること', () => {
      // 1. ログイン時: トークンを保存
      const loginToken: TokenData = {
        accessToken: 'ya29.a0login_token',
        expiresAt: Date.now() + 3600000,
      };
      saveToken(loginToken);

      // 2. アプリ初期化時: 有効なトークンを復元
      const restoredToken = getToken();
      expect(restoredToken).not.toBeNull();
      expect(restoredToken?.accessToken).toBe(loginToken.accessToken);
      expect(isTokenValid()).toBe(true);

      // 3. ログアウト時: トークンを削除
      clearToken();
      expect(getToken()).toBeNull();
      expect(isTokenValid()).toBe(false);
    });

    it('有効期限切れトークンは自動的にクリアされること', () => {
      // 期限切れのトークンを保存
      const expiredToken: TokenData = {
        accessToken: 'ya29.a0expired_token',
        expiresAt: Date.now() - 1000,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expiredToken));

      // 取得時に自動クリアされる
      const token = getToken();
      expect(token).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

      // 有効性チェックもfalse
      expect(isTokenValid()).toBe(false);
    });
  });
});
