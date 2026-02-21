import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';

// Mock the db/index module (external boundary: Google API / adapter logic)
vi.mock('../db/index', () => ({
  subscribeToAuthState: vi.fn(() => () => {}),
  subscribeToAdapterChanged: vi.fn(() => () => {}),
  isGoogleConnectionValid: vi.fn(() => false),
  connectGoogleAdapter: vi.fn(),
  disconnectGoogleAdapter: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

import {
  subscribeToAuthState,
  subscribeToAdapterChanged,
  isGoogleConnectionValid,
  signIn as mockSignIn,
  signOut as mockSignOut,
  disconnectGoogleAdapter as mockDisconnect,
} from '../db/index';

// Helper component that exposes auth context values via data-testid
function AuthConsumer() {
  const { authState, googleSyncStatus } = useAuth();
  return (
    <div>
      <span data-testid="is-signed-in">{String(authState.isSignedIn)}</span>
      <span data-testid="sync-status">{googleSyncStatus}</span>
      <span data-testid="user-email">{authState.user?.email ?? 'none'}</span>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: no valid connection
    vi.mocked(isGoogleConnectionValid).mockReturnValue(false);
    vi.mocked(subscribeToAuthState).mockReturnValue(() => {});
    vi.mocked(subscribeToAdapterChanged).mockReturnValue(() => {});
  });

  describe('初期状態', () => {
    it('接続状態なし → disconnected 状態でマウントされること', () => {
      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('is-signed-in').textContent).toBe('false');
      expect(screen.getByTestId('sync-status').textContent).toBe('disconnected');
      expect(screen.getByTestId('user-email').textContent).toBe('none');
    });

    it('subscribeToAuthState が登録・解除されること', () => {
      const unsubscribe = vi.fn();
      vi.mocked(subscribeToAuthState).mockReturnValue(unsubscribe);

      const { unmount } = render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(subscribeToAuthState).toHaveBeenCalledTimes(1);

      unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('subscribeToAdapterChanged が登録・解除されること', () => {
      const unsubscribe = vi.fn();
      vi.mocked(subscribeToAdapterChanged).mockReturnValue(unsubscribe);

      const { unmount } = render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(subscribeToAdapterChanged).toHaveBeenCalledTimes(1);

      unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('認証状態の変化', () => {
    it('subscribeToAuthState のコールバックでサインイン状態が更新されること', async () => {
      let authCallback: ((state: any) => void) | null = null;
      vi.mocked(subscribeToAuthState).mockImplementation((cb) => {
        authCallback = cb;
        return () => {};
      });

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('is-signed-in').textContent).toBe('false');

      // Simulate auth state change (sign in)
      await act(async () => {
        authCallback?.({
          isSignedIn: true,
          user: { email: 'test@gmail.com', name: 'テストユーザー' },
        });
      });

      expect(screen.getByTestId('is-signed-in').textContent).toBe('true');
      expect(screen.getByTestId('user-email').textContent).toBe('test@gmail.com');
    });

    it('subscribeToAdapterChanged(google) で connected 状態になること', async () => {
      let adapterCallback: ((adapter: string) => void) | null = null;
      vi.mocked(subscribeToAdapterChanged).mockImplementation((cb) => {
        adapterCallback = cb;
        return () => {};
      });

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('sync-status').textContent).toBe('disconnected');

      await act(async () => {
        adapterCallback?.('google');
      });

      expect(screen.getByTestId('sync-status').textContent).toBe('connected');
    });

    it('subscribeToAdapterChanged(indexeddb) で disconnected 状態になること', async () => {
      let adapterCallback: ((adapter: string) => void) | null = null;
      vi.mocked(subscribeToAdapterChanged).mockImplementation((cb) => {
        adapterCallback = cb;
        return () => {};
      });

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      // まず connected にする
      await act(async () => {
        adapterCallback?.('google');
      });
      expect(screen.getByTestId('sync-status').textContent).toBe('connected');

      // IndexedDB に戻す
      await act(async () => {
        adapterCallback?.('indexeddb');
      });
      expect(screen.getByTestId('sync-status').textContent).toBe('disconnected');
    });
  });

  describe('signIn / signOut', () => {
    it('signIn() が db/index の signIn を呼び出すこと', async () => {
      vi.mocked(mockSignIn).mockResolvedValue(undefined);

      function SignInButton() {
        const { signIn } = useAuth();
        return <button onClick={() => signIn()}>サインイン</button>;
      }

      render(
        <AuthProvider>
          <SignInButton />
        </AuthProvider>
      );

      await act(async () => {
        screen.getByRole('button', { name: 'サインイン' }).click();
      });

      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });

    it('signOut() が db/index の signOut と disconnectGoogleAdapter を呼び出すこと', async () => {
      function SignOutButton() {
        const { signOut } = useAuth();
        return <button onClick={() => signOut()}>サインアウト</button>;
      }

      render(
        <AuthProvider>
          <SignOutButton />
        </AuthProvider>
      );

      await act(async () => {
        screen.getByRole('button', { name: 'サインアウト' }).click();
      });

      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('バックグラウンド接続中', () => {
    it('isGoogleConnectionValid() が true のとき connecting 状態でマウントされること', () => {
      vi.mocked(isGoogleConnectionValid).mockReturnValue(true);

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('sync-status').textContent).toBe('connecting');
    });
  });
});
