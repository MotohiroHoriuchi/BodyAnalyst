// Google OAuth2 Authentication
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

// LocalStorage key for token cache
const TOKEN_STORAGE_KEY = 'google_auth_token';

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let gapiInited = false;
let gisInited = false;

/**
 * Token data structure for caching
 */
export interface TokenData {
  accessToken: string;
  expiresAt: number; // Timestamp in milliseconds
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
 * Initialize Google API client
 */
export async function initializeGoogleAPI(): Promise<void> {
  // If environment variables are not set, resolve without initializing
  // The login page will be shown and signIn() will report the error
  if (!CLIENT_ID || !API_KEY) {
    console.warn('Google API credentials not configured. Please set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY in .env file.');
    return;
  }

  return new Promise((resolve, reject) => {
    // Wait for gapi to be available
    const waitForGapi = setInterval(() => {
      if (typeof gapi !== 'undefined') {
        clearInterval(waitForGapi);

        // Load GAPI
        gapi.load('client', async () => {
          try {
            await gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: [DISCOVERY_DOC],
            });
            gapiInited = true;
            maybeEnableButtons();

            // Also wait for Google Identity Services
            const waitForGIS = setInterval(() => {
              if (typeof google !== 'undefined' && google.accounts) {
                clearInterval(waitForGIS);
                tokenClient = google.accounts.oauth2.initTokenClient({
                  client_id: CLIENT_ID,
                  scope: SCOPES,
                  callback: '', // defined at request time
                });
                gisInited = true;
                maybeEnableButtons();

                // Restore session from cached token
                const cachedToken = getToken();
                if (cachedToken) {
                  gapi.client.setToken({
                    access_token: cachedToken.accessToken,
                  });

                  // Validate token by making a test API call
                  validateTokenWithSheetsAPI(cachedToken.accessToken)
                    .then(() => fetchUserInfo(cachedToken.accessToken))
                    .then((userInfo) => {
                      notifyAuthStateChange({
                        isSignedIn: true,
                        user: userInfo,
                      });
                      resolve();
                    })
                    .catch(() => {
                      // Token is invalid (e.g., revoked), clear cache
                      console.warn('Cached token is invalid, clearing...');
                      clearToken();
                      gapi.client.setToken(null);
                      resolve();
                    });
                } else {
                  resolve();
                }
              }
            }, 100);

            // Timeout after 10 seconds
            setTimeout(() => {
              clearInterval(waitForGIS);
              if (!gisInited) {
                reject(new Error('Google Identity Services failed to load'));
              }
            }, 10000);

          } catch (error) {
            reject(error);
          }
        });
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(waitForGapi);
      if (!gapiInited) {
        reject(new Error('Google API failed to load'));
      }
    }, 10000);
  });
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    // Both libraries loaded
    console.log('Google APIs initialized');
  }
}

/**
 * Sign in to Google
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

      // Set the access token to gapi and cache it
      if (response.access_token) {
        gapi.client.setToken({
          access_token: response.access_token,
        });

        // Cache token in LocalStorage
        const expiresAt = Date.now() + (response.expires_in ?? 3600) * 1000;
        saveToken({
          accessToken: response.access_token,
          expiresAt,
        });

        try {
          const userInfo = await fetchUserInfo(response.access_token);
          notifyAuthStateChange({
            isSignedIn: true,
            user: userInfo,
          });
          resolve();
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          reject(error);
        }
      } else {
        reject(new Error('No access token received'));
      }
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
}

/**
 * Sign out from Google
 */
export function signOut(): void {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token, () => {
      gapi.client.setToken(null);
      clearToken();
      notifyAuthStateChange({
        isSignedIn: false,
        user: null,
      });
    });
  }
}

/**
 * Check if user is signed in
 */
export function isSignedIn(): boolean {
  return gapi.client.getToken() !== null;
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  const token = gapi.client.getToken();
  return token ? token.access_token : null;
}

/**
 * Save token data to LocalStorage
 */
export function saveToken(tokenData: TokenData): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
}

/**
 * Get token data from LocalStorage
 * Returns null if token is missing, expired, or invalid
 * Automatically clears expired or invalid tokens
 */
export function getToken(): TokenData | null {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const parsed: TokenData = JSON.parse(stored);
    if (parsed.expiresAt <= Date.now()) {
      clearToken();
      return null;
    }
    return parsed;
  } catch {
    clearToken();
    return null;
  }
}

/**
 * Clear token data from LocalStorage
 */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * Check if the cached token is valid (exists and not expired)
 */
export function isTokenValid(): boolean {
  return getToken() !== null;
}

/**
 * Validate token by making a test Sheets API call
 */
async function validateTokenWithSheetsAPI(accessToken: string): Promise<void> {
  // Try to get spreadsheet metadata to verify token has Sheets API access
  const spreadsheetId = localStorage.getItem('BODYANALYST_SPREADSHEET_ID') ||
    import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

  if (!spreadsheetId) {
    // No spreadsheet configured, skip validation
    return;
  }

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Token validation failed');
  }
}

/**
 * Fetch user info from Google
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
