import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  subscribeToAuthState,
  subscribeToAdapterChanged,
  isGoogleConnectionValid,
  signIn as dbSignIn,
  signOut as dbSignOut,
  disconnectGoogleAdapter,
  type AuthState,
} from '../db/index';

export type GoogleSyncStatus =
  | 'disconnected'  // 未連携（デフォルト）
  | 'connecting'    // サイレント再認証中
  | 'connected'     // Google Sheets と同期中
  | 'error';        // 連携エラー

export interface AuthContextValue {
  authState: AuthState;
  googleSyncStatus: GoogleSyncStatus;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const defaultAuthState: AuthState = { isSignedIn: false, user: null };

export const AuthContext = createContext<AuthContextValue>({
  authState: defaultAuthState,
  googleSyncStatus: 'disconnected',
  signIn: async () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const [googleSyncStatus, setGoogleSyncStatus] = useState<GoogleSyncStatus>(
    () => isGoogleConnectionValid() ? 'connecting' : 'disconnected'
  );

  useEffect(() => {
    // Subscribe to auth state changes (from gapi sign-in/out events)
    const unsubAuth = subscribeToAuthState((state) => {
      setAuthState(state);
    });

    // Subscribe to adapter changes (IndexedDB ↔ GoogleSheets)
    const unsubAdapter = subscribeToAdapterChanged((adapter) => {
      if (adapter === 'google') {
        setGoogleSyncStatus('connected');
      } else {
        setGoogleSyncStatus('disconnected');
      }
    });

    return () => {
      unsubAuth();
      unsubAdapter();
    };
  }, []);

  const signIn = useCallback(async () => {
    await dbSignIn();
  }, []);

  const signOut = useCallback(() => {
    dbSignOut();
    disconnectGoogleAdapter();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, googleSyncStatus, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
