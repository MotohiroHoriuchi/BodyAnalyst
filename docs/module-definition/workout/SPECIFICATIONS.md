# Workout Module Specifications

## 1. Overview
The Workout module is responsible for recording the user's training activities and tracking performance improvements. It handles complex hierarchical data (Session-Exercise-Set), providing training support features like history reference, 1RM calculation, and bodyweight handling.

## 2. Responsibilities
- **Recording:** Create, update, and delete training sessions (`WorkoutSession`).
- **Master Management:** Search and add exercise types (`ExerciseMaster`). **(Critical: Must verify persistence via remote sync)**
- **Input Support:** Display previous history (weight/reps) during set entry, interval timer.
- **Calculation:** Auto-calculation of 1RM (Estimated One Rep Max) and Total Volume.
- **Bodyweight Support:** Auto-setting load based on the latest body weight data.

## 3. Directory Structure
```
src/features/workout/
├── components/           # UI Components
│   ├── SessionLogger.tsx   # Main logging screen
│   ├── ExercisePicker.tsx  # Exercise selection and search
│   ├── SetInput.tsx        # Input row per set
│   ├── BodyweightToggle.tsx # Toggle for Bodyweight/Weighted
│   └── HistoryView.tsx     # History list view
├── hooks/                # Business Logic
│   ├── useWorkout.ts       # Session CRUD operations
│   ├── useExercise.ts      # Exercise master management (Sync integrated)
│   ├── useBodyweightLoad.ts # Logic to fetch latest body weight
│   └── useOneRM.ts         # 1RM calculation logic
├── utils/                # Utility Functions
│   └── oneRmCalculator.ts  # Calculation functions (Epley formula, etc.)
├── types/                # Module-specific Types
│   └── index.ts
└── index.ts              # Public API
```

## 4. Functional Requirements

### 4.1. Mandatory Features
*   **Full Persistence of Exercises:**
    *   Custom-added exercise data must be **synchronized with the remote (Spreadsheet)** to ensure zero data loss.
    *   Use robust ID management (e.g., UUID) to maintain consistency of exercise IDs across devices.
*   **Bodyweight Training Support:**
    *   Allow selecting "Bodyweight" when entering weight.
    *   When selected, automatically retrieve the "latest body weight record prior to the workout date" from the `Weight` module and record it as the load.
    *   (e.g., Pull-ups -> Today's weight 70kg is recorded as a 70kg load).

### 4.2. Future Features (Roadmap)
*   **Training Menu:**
    *   Create "Menus (Templates)" with predefined exercises and target set counts.
    *   Starting a session from a menu pre-populates the exercise list and set slots (leaving reps/weight empty).
    *   **Manual Creation:** Users can manually register their own routines.
    *   **AI Menu Generation (Premium):** AI proposes and generates optimal menus based on history and goals.

## 5. Key Data Flows

### 5.1. Logging Bodyweight Exercise
1. Toggle the "Bodyweight" checkbox in `SetInput`.
2. `useBodyweightLoad` hook queries `WeightRepository` for the latest weight.
3. The retrieved weight is auto-filled into the `weight` field (adjustable by user, e.g., for weighted pull-ups).
4. Saved as a standard numeric value to ensure historical reproducibility.

### 5.2. Syncing Exercise Master
1. User creates a new exercise.
2. Saved to local DB and simultaneously added to the `SyncManager` priority queue.
3. Immediate remote sync attempt is made to secure master data.

## 6. Public API
```typescript
export { SessionLogger } from './components/SessionLogger';
export { HistoryView } from './components/HistoryView';
export { useWorkout } from './hooks/useWorkout';
export { LastWorkoutSummary } from './components/LastWorkoutSummary';
```
