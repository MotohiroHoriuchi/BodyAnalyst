import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import {
  saveConnectionState,
  getConnectionState,
  clearConnectionState,
  isGoogleConnectionValid,
  type GoogleConnectionState,
} from './auth';

describe('Google Connection State Management', () => {
  const STORAGE_KEY = 'google_connection_state';
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  // Setup localStorage mock
  beforeAll(() => {
    const localStorageMock = {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
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
    localStorage.clear();
    vi.useRealTimers();
  });

  describe('saveConnectionState()', () => {
    it('接続状態をLocalStorageに保存できること', () => {
      const now = Date.now();
      const state: GoogleConnectionState = {
        email: 'test@gmail.com',
        name: 'テストユーザー',
        picture: 'https://example.com/avatar.png',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };

      saveConnectionState(state);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.email).toBe('test@gmail.com');
      expect(parsed.name).toBe('テストユーザー');
    });

    it('accessToken を保存しないこと', () => {
      const now = Date.now();
      const state: GoogleConnectionState = {
        email: 'test@gmail.com',
        name: 'テストユーザー',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };

      saveConnectionState(state);

      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed).not.toHaveProperty('accessToken');
    });

    it('connectionExpiresAt が connectedAt + 30日 であること', () => {
      const now = Date.now();
      const state: GoogleConnectionState = {
        email: 'test@gmail.com',
        name: 'テストユーザー',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };

      saveConnectionState(state);

      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed.connectionExpiresAt).toBe(now + THIRTY_DAYS_MS);
    });

    it('既存の接続状態を上書きできること', () => {
      const now = Date.now();
      const state1: GoogleConnectionState = {
        email: 'first@gmail.com',
        name: 'First User',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };
      const state2: GoogleConnectionState = {
        email: 'second@gmail.com',
        name: 'Second User',
        connectedAt: now + 1000,
        connectionExpiresAt: now + 1000 + THIRTY_DAYS_MS,
      };

      saveConnectionState(state1);
      saveConnectionState(state2);

      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed.email).toBe('second@gmail.com');
    });
  });

  describe('getConnectionState()', () => {
    it('保存された接続状態を取得できること', () => {
      const now = Date.now();
      const state: GoogleConnectionState = {
        email: 'test@gmail.com',
        name: 'テストユーザー',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };

      saveConnectionState(state);
      const retrieved = getConnectionState();

      expect(retrieved).not.toBeNull();
      expect(retrieved?.email).toBe('test@gmail.com');
      expect(retrieved?.name).toBe('テストユーザー');
    });

    it('接続状態がない場合は null を返すこと', () => {
      const retrieved = getConnectionState();
      expect(retrieved).toBeNull();
    });

    it('30日以内の接続状態は正常に返すこと', () => {
      vi.useFakeTimers();
      const now = Date.now();
      const state: GoogleConnectionState = {
        email: 'test@gmail.com',
        name: 'テストユーザー',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };

      saveConnectionState(state);

      // 29日後
      vi.setSystemTime(now + 29 * 24 * 60 * 60 * 1000);
      const retrieved = getConnectionState();
      expect(retrieved).not.toBeNull();
    });

    it('30日経過した接続状態は null を返し、LocalStorage から削除されること', () => {
      vi.useFakeTimers();
      const now = Date.now();
      const state: GoogleConnectionState = {
        email: 'test@gmail.com',
        name: 'テストユーザー',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };

      saveConnectionState(state);

      // 31日後（期限切れ）
      vi.setSystemTime(now + 31 * 24 * 60 * 60 * 1000);
      const retrieved = getConnectionState();
      expect(retrieved).toBeNull();

      // LocalStorage からも削除されていること
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('不正なJSONデータの場合は null を返し、クリアすること', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json data');
      const retrieved = getConnectionState();
      expect(retrieved).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('clearConnectionState()', () => {
    it('LocalStorage から接続状態を削除できること', () => {
      const now = Date.now();
      const state: GoogleConnectionState = {
        email: 'test@gmail.com',
        name: 'テストユーザー',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };

      saveConnectionState(state);
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

      clearConnectionState();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('接続状態がない場合でもエラーにならないこと', () => {
      expect(() => clearConnectionState()).not.toThrow();
    });
  });

  describe('isGoogleConnectionValid()', () => {
    it('有効な接続状態の場合は true を返すこと', () => {
      const now = Date.now();
      const state: GoogleConnectionState = {
        email: 'test@gmail.com',
        name: 'テストユーザー',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };

      saveConnectionState(state);
      expect(isGoogleConnectionValid()).toBe(true);
    });

    it('接続状態がない場合は false を返すこと', () => {
      expect(isGoogleConnectionValid()).toBe(false);
    });

    it('期限切れの接続状態の場合は false を返すこと', () => {
      vi.useFakeTimers();
      const now = Date.now();
      const state: GoogleConnectionState = {
        email: 'test@gmail.com',
        name: 'テストユーザー',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };

      saveConnectionState(state);

      // 31日後（期限切れ）
      vi.setSystemTime(now + 31 * 24 * 60 * 60 * 1000);
      expect(isGoogleConnectionValid()).toBe(false);
    });
  });

  describe('Connection State Lifecycle（統合テスト）', () => {
    it('接続 → 状態確認 → 切断のフローが正しく動作すること', () => {
      const now = Date.now();

      // 1. 接続時: 接続状態を保存
      const state: GoogleConnectionState = {
        email: 'user@gmail.com',
        name: 'ユーザー',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };
      saveConnectionState(state);

      // 2. 接続状態確認
      expect(isGoogleConnectionValid()).toBe(true);
      const retrieved = getConnectionState();
      expect(retrieved?.email).toBe('user@gmail.com');

      // 3. 切断時: 接続状態を削除
      clearConnectionState();
      expect(isGoogleConnectionValid()).toBe(false);
      expect(getConnectionState()).toBeNull();
    });

    it('30日TTLは正確に機能すること', () => {
      vi.useFakeTimers();
      const now = Date.now();
      const state: GoogleConnectionState = {
        email: 'user@gmail.com',
        name: 'ユーザー',
        connectedAt: now,
        connectionExpiresAt: now + THIRTY_DAYS_MS,
      };
      saveConnectionState(state);

      // 29日23時間後はまだ有効
      vi.setSystemTime(now + THIRTY_DAYS_MS - 3600000);
      expect(isGoogleConnectionValid()).toBe(true);

      // 30日後は無効
      vi.setSystemTime(now + THIRTY_DAYS_MS + 1);
      expect(isGoogleConnectionValid()).toBe(false);
    });
  });
});
