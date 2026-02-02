// Database layer public API
import { GoogleSheetsAdapter } from './adapters/google_sheets/GoogleSheetsAdapter';
import { WeightRepository } from './repositories/WeightRepository';
import { WorkoutRepository } from './repositories/WorkoutRepository';
import { MealRepository } from './repositories/MealRepository';

// Create singleton adapter instance
const adapter = new GoogleSheetsAdapter();

// Create repository instances
export const weightRepository = new WeightRepository(adapter);
export const workoutRepository = new WorkoutRepository(adapter);
export const mealRepository = new MealRepository(adapter);

// Export auth functions
export {
  initializeGoogleAPI,
  signIn,
  signOut,
  isSignedIn,
  subscribeToAuthState,
  type AuthState,
} from './adapters/google_sheets/auth';

// Initialize the adapter
export async function initializeDatabase(): Promise<void> {
  await adapter.initialize();
}

// Check if database is ready
export function isDatabaseReady(): boolean {
  return adapter.isReady();
}
