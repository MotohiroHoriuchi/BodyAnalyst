// Google OAuth2 Authentication
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

// LocalStorage key for Google connection state (metadata only — no access token)
const CONNECTION_STATE_KEY = 'google_connection_state';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let gapiInited = false;
let gisInited = false;

/**
 * Google connection state stored in localStorage.
 * Stores user metadata and expiry only — the actual access token is NOT persisted.
 * The access token lives only in gapi.client memory (session lifetime ~1 hour).
 */
export interface GoogleConnectionState {
  email: string;
  name: string;
  picture?: string;
  connectedAt: number;       // Unix timestamp (ms)
  connectionExpiresAt: number; // connectedAt + 30 days
}

export interface AuthState {
  isSignedIn: boolean;
  user: {
    email: string;
    name: string;
    picture?: string;
  } | null;
}

let authStateListeners: Array<(state: AuthState) => void> = [];

export function subscribeToAuthState(listener: (state: AuthState) => void) {
  authStateListeners.push(listener);
  return () => {
    authStateListeners = authStateListeners.filter(l => l !== listener);
  };
}

function notifyAuthStateChange(state: AuthState) {
  authStateListeners.forEach(listener => listener(state));
}

/**
 * Save Google connection state to localStorage (30-day TTL).
 * Does NOT save the access token.
 */
export function saveConnectionState(state: GoogleConnectionState): void {
  localStorage.setItem(CONNECTION_STATE_KEY, JSON.stringify(state));
}

/**
 * Get Google connection state from localStorage.
 * Returns null if missing, expired, or invalid JSON.
 * Automatically removes expired state.
 */
export function getConnectionState(): GoogleConnectionState | null {
  const stored = localStorage.getItem(CONNECTION_STATE_KEY);
  if (!stored) return null;

  try {
    const parsed: GoogleConnectionState = JSON.parse(stored);
    if (parsed.connectionExpiresAt <= Date.now()) {
      clearConnectionState();
      return null;
    }
    return parsed;
  } catch {
    clearConnectionState();
    return null;
  }
}

/**
 * Remove Google connection state from localStorage.
 */
export function clearConnectionState(): void {
  localStorage.removeItem(CONNECTION_STATE_KEY);
}

/**
 * Check whether the stored Google connection state is valid (within 30 days).
 */
export function isGoogleConnectionValid(): boolean {
  return getConnectionState() !== null;
}

/**
 * Attempt silent re-authentication using Google Identity Services.
 * Uses prompt:'' which requires the user to have previously granted consent.
 * Returns a promise that resolves when the token is set in gapi.client.
 */
export function silentSignIn(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('tokenClient not initialized'));
      return;
    }

    tokenClient.callback = async (response: any) => {
      if (response.error !== undefined) {
        reject(new Error(`Silent sign-in failed: ${response.error}`));
        return;
      }

      if (response.access_token) {
        gapi.client.setToken({ access_token: response.access_token });
        try {
          const userInfo = await fetchUserInfo(response.access_token);
          notifyAuthStateChange({ isSignedIn: true, user: userInfo });
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('No access token received in silent sign-in'));
      }
    };

    tokenClient.requestAccessToken({ prompt: '' });
  });
}

/**
 * Initialize Google API client.
 * - gapi and GIS are loaded from <script> tags in index.html.
 * - If a valid connection state exists, silentSignIn() restores the session.
 * - DEV-only: auto silent login even without connection state
 *   (tree-shaken in production by Vite).
 */
export async function initializeGoogleAPI(): Promise<void> {
  if (!CLIENT_ID || !API_KEY) {
    console.warn('Google API credentials not configured. Please set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY in .env file.');
    return;
  }

  return new Promise((resolve, reject) => {
    const waitForGapi = setInterval(() => {
      if (typeof gapi !== 'undefined') {
        clearInterval(waitForGapi);

        gapi.load('client', async () => {
          try {
            await gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: [DISCOVERY_DOC],
            });
            gapiInited = true;

            const waitForGIS = setInterval(() => {
              if (typeof google !== 'undefined' && google.accounts) {
                clearInterval(waitForGIS);

                tokenClient = google.accounts.oauth2.initTokenClient({
                  client_id: CLIENT_ID,
                  scope: SCOPES,
                  callback: '', // defined at request time
                });
                gisInited = true;

                console.log('Google APIs initialized');

                const connectionState = getConnectionState();
                if (connectionState) {
                  // Restore session silently — access token lives only in memory
                  silentSignIn()
                    .then(() => resolve())
                    .catch(() => {
                      // Silent auth failed (token revoked, third-party cookie blocked, etc.)
                      console.warn('Silent sign-in failed, clearing connection state.');
                      clearConnectionState();
                      gapi.client.setToken(null);
                      resolve();
                    });
                } else {
                  // DEV-only auto login (tree-shaken in production build)
                  if (import.meta.env.DEV) {
                    silentSignIn()
                      .then(() => resolve())
                      .catch(() => {
                        console.info('[DEV] サイレント自動ログイン失敗。設定画面から一度ログインしてください。');
                        resolve();
                      });
                  } else {
                    resolve();
                  }
                }
              }
            }, 100);

            setTimeout(() => {
              clearInterval(waitForGIS);
              if (!gisInited) reject(new Error('Google Identity Services failed to load'));
            }, 10000);

          } catch (error) {
            reject(error);
          }
        });
      }
    }, 100);

    setTimeout(() => {
      clearInterval(waitForGapi);
      if (!gapiInited) reject(new Error('Google API failed to load'));
    }, 10000);
  });
}

/**
 * Sign in to Google (explicit user action, shows consent screen).
 * After success, saves GoogleConnectionState (without access token).
 */
export async function signIn(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID || !API_KEY) {
      reject(new Error('Google APIの認証情報が設定されていません。.envファイルにVITE_GOOGLE_CLIENT_IDとVITE_GOOGLE_API_KEYを設定してください。'));
      return;
    }
    if (!tokenClient) {
      reject(new Error('Google APIの初期化が完了していません。ページを再読み込みしてください。'));
      return;
    }

    tokenClient.callback = async (response: any) => {
      if (response.error !== undefined) {
        console.error('OAuth error:', response);
        reject(new Error(`OAuth error: ${response.error} - ${response.error_description || ''}`));
        return;
      }

      if (response.access_token) {
        gapi.client.setToken({ access_token: response.access_token });

        try {
          const userInfo = await fetchUserInfo(response.access_token);

          // Save connection state (metadata only, no access token)
          const now = Date.now();
          saveConnectionState({
            email: userInfo!.email,
            name: userInfo!.name,
            picture: userInfo!.picture,
            connectedAt: now,
            connectionExpiresAt: now + THIRTY_DAYS_MS,
          });

          notifyAuthStateChange({ isSignedIn: true, user: userInfo });
          resolve();
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          reject(error);
        }
      } else {
        reject(new Error('No access token received'));
      }
    };

    // Always show consent screen for explicit sign-in
    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

/**
 * Sign out from Google and clear connection state.
 */
export function signOut(): void {
  const token = gapi.client.getToken();
  clearConnectionState();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token, () => {
      gapi.client.setToken(null);
      notifyAuthStateChange({ isSignedIn: false, user: null });
    });
  } else {
    notifyAuthStateChange({ isSignedIn: false, user: null });
  }
}

/**
 * Check if user is currently signed in (access token in memory).
 */
export function isSignedIn(): boolean {
  return gapi.client.getToken() !== null;
}

/**
 * Get current access token from gapi.client memory.
 */
export function getAccessToken(): string | null {
  const token = gapi.client.getToken();
  return token ? token.access_token : null;
}

/**
 * Fetch user info from Google OAuth2 API.
 */
async function fetchUserInfo(accessToken: string): Promise<AuthState['user']> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  const data = await response.json();
  return {
    email: data.email,
    name: data.name,
    picture: data.picture,
  };
}
