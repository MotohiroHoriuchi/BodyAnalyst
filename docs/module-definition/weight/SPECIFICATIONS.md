# Weight Module Specifications

## 1. Overview
The Weight module is responsible for recording and managing the user's body composition data, including weight, body fat percentage, and muscle mass. It ensures that daily changes are accurately captured and persisted through the Infrastructure layer.

## 2. Responsibilities
- CRUD operations for body composition records (Weight, Body Fat, Muscle Mass, Timing, Memo).
- Input validation (e.g., preventing non-positive values or unrealistic entries).
- Providing a chronological list of measurement history.
- Exposing the latest measurement data for quick reference.

## 3. Directory Structure
```
src/features/weight/
├── components/          # UI Components
│   ├── WeightInput.tsx     # Form for recording body composition
│   └── WeightHistory.tsx   # List view for measurement history
├── hooks/               # Business Logic
│   └── useWeight.ts        # Orchestrates data fetching, saving, and deletion
├── types/               # Module-specific type definitions
│   └── index.ts
└── index.ts             # Public API (Public API)
```

## 4. Dependencies
- **Infrastructure:** Accesses Dexie.js/Google Sheets via `WeightRepository`.
- **Core:** Utilizes shared UI components (Button, Input, Card).
- **Analytics:** Passes data to the Analytics module for trend visualization.

## 5. Key Data Flows

### 5.1. Saving a Record
1. The user enters values in `WeightInput` and triggers the save action.
2. The `useWeight` hook's save function is invoked.
3. After validation, the data is persisted via the `Infrastructure` layer.
4. Upon successful local save, the `syncStatus` is set to `'pending'`, triggering background synchronization.

### 5.2. Referencing Data
1. the `WeightHistory` component requests data from the `useWeight` hook.
2. The hook fetches data from the `Infrastructure` layer, sorts it by date, and returns it to the UI.

## 6. Public API
```typescript
export { WeightInput } from './components/WeightInput';
export { WeightHistory } from './components/WeightHistory';
export { useWeight } from './hooks/useWeight';
```
