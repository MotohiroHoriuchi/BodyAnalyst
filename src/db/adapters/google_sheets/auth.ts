// Google OAuth2 Authentication
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let gapiInited = false;
let gisInited = false;

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
  return new Promise((resolve, reject) => {
    // Load GAPI
    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    // Load GIS (Google Identity Services)
    if (typeof google !== 'undefined' && google.accounts) {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined at request time
      });
      gisInited = true;
      maybeEnableButtons();
    }
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
    if (!tokenClient) {
      reject(new Error('Token client not initialized'));
      return;
    }

    tokenClient.callback = async (response: any) => {
      if (response.error !== undefined) {
        reject(response);
        return;
      }

      // Get user info
      const token = gapi.client.getToken();
      if (token) {
        try {
          const userInfo = await fetchUserInfo(token.access_token);
          notifyAuthStateChange({
            isSignedIn: true,
            user: userInfo,
          });
          resolve();
        } catch (error) {
          reject(error);
        }
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
