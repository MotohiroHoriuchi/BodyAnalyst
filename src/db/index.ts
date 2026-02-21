// Database layer public API
import { AdapterProxy } from './AdapterProxy';
import { IndexedDBAdapter } from './adapters/indexeddb/IndexedDBAdapter';
import { GoogleSheetsAdapter } from './adapters/google_sheets/GoogleSheetsAdapter';
import { WeightRepository } from './repositories/WeightRepository';
import { WorkoutRepository } from './repositories/WorkoutRepository';
import { MealRepository } from './repositories/MealRepository';
import {
  initializeGoogleAPI,
  signIn,
  signOut,
  isSignedIn,
  subscribeToAuthState,
  isGoogleConnectionValid,
  clearConnectionState,
  type AuthState,
} from './adapters/google_sheets/auth';

type AdapterChangedListener = (adapter: 'indexeddb' | 'google') => void;
let adapterChangedListeners: AdapterChangedListener[] = [];

function notifyAdapterChanged(adapter: 'indexeddb' | 'google') {
  adapterChangedListeners.forEach(l => l(adapter));
}

export function subscribeToAdapterChanged(listener: AdapterChangedListener) {
  adapterChangedListeners.push(listener);
  return () => {
    adapterChangedListeners = adapterChangedListeners.filter(l => l !== listener);
  };
}

// Keep a reference to the IndexedDBAdapter initialized at startup.
// Reused when disconnecting from Google to avoid race conditions
// (creating a new adapter and initializing it async while reads are in flight).
const indexedDBAdapter = new IndexedDBAdapter();

// AdapterProxy starts with IndexedDB
const proxy = new AdapterProxy(indexedDBAdapter);

// Repository singletons — always delegate through proxy
export const weightRepository = new WeightRepository(proxy);
export const workoutRepository = new WorkoutRepository(proxy);
export const mealRepository = new MealRepository(proxy);

/**
 * Initialize the database.
 * 1. IndexedDB is initialized immediately (no network required).
 * 2. If a valid Google connection state exists (within 30 days),
 *    silentSignIn() is attempted in the background.
 *    On success: proxy switches to GoogleSheetsAdapter.
 *    On failure: silently stays on IndexedDB.
 */
export async function initializeDatabase(): Promise<void> {
  // 1. Initialize IndexedDB immediately (fast, no network)
  await indexedDBAdapter.initialize();

  // 2. Try background Google reconnection if connection state is valid
  if (isGoogleConnectionValid()) {
    // Fire and forget — do not await
    (async () => {
      try {
        await initializeGoogleAPI();
        if (isSignedIn()) {
          const sheetsAdapter = new GoogleSheetsAdapter();
          await sheetsAdapter.initialize();
          proxy.setCurrent(sheetsAdapter);
          notifyAdapterChanged('google');
        }
      } catch {
        // Silent failure — stay on IndexedDB, user reconnects from Settings
      }
    })();
  }
}

/**
 * Connect to Google Sheets adapter.
 * Called from SettingsPage after successful OAuth + spreadsheet setup.
 */
export async function connectGoogleAdapter(): Promise<void> {
  const sheetsAdapter = new GoogleSheetsAdapter();
  await sheetsAdapter.initialize();
  proxy.setCurrent(sheetsAdapter);
  // Invalidate repository caches so next read fetches from Sheets
  weightRepository.invalidateCache();
  workoutRepository.invalidateCache();
  mealRepository.invalidateCache();
  notifyAdapterChanged('google');
}

/**
 * Disconnect from Google Sheets, revert to IndexedDB.
 * Reuses the already-initialized IndexedDBAdapter from startup to avoid
 * race conditions during async re-initialization.
 */
export function disconnectGoogleAdapter(): void {
  clearConnectionState();
  // indexedDBAdapter is already initialized — safe to switch immediately
  proxy.setCurrent(indexedDBAdapter);
  weightRepository.invalidateCache();
  workoutRepository.invalidateCache();
  mealRepository.invalidateCache();
  notifyAdapterChanged('indexeddb');
}

// Check if database is ready
export function isDatabaseReady(): boolean {
  return proxy.isReady();
}

// Force refresh all data from current adapter (clear all caches)
export function forceSyncAll(): void {
  weightRepository.invalidateCache();
  workoutRepository.invalidateCache();
  mealRepository.invalidateCache();
}

// Re-export auth functions
export {
  initializeGoogleAPI,
  signIn,
  signOut,
  isSignedIn,
  subscribeToAuthState,
  isGoogleConnectionValid,
  type AuthState,
};
