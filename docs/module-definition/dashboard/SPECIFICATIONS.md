# Dashboard Module Specifications

## 1. Overview
The Dashboard module is responsible for rendering the user's home screen, managing the grid layout of widgets (Blocks), and persisting user preferences regarding block arrangement and sizing.

## 2. Architecture & Responsibility

### 2.1 Container vs Presentational
*   **DashboardContainer:**
    *   Fetches the `DashboardLayoutConfig` (user settings).
    *   Calculates the precise pixel dimensions or grid classes for each block based on the current viewport.
    *   Passes `width`, `height`, and `data` to each Block component.
*   **Block Components (e.g., WeightTrendBlock):**
    *   **Passive Rendering:** Strictly renders content within the dimensions provided via Props.
    *   **Internal Responsiveness:** Adjusts font sizes, tick counts, or layout (horizontal vs vertical) based on the received size, but **NEVER** determines its own outer dimensions.

### 2.2 Sizing Authority
**The Dashboard Container (and ultimately the User Configuration) is the sole authority on block sizing.**
Individual blocks do not know "how big they should be" until told by the container.

## 3. Data Model: DashboardLayoutConfig

```typescript
type GridSize = {
  w: number; // Width in grid units (e.g., 1 or 2)
  h: number; // Height in grid units
};

interface BlockInstance {
  id: string;
  type: 'weight_trend' | 'calorie_summary' | 'workout_volume';
  gridSize: GridSize;
  order: number;
  config?: Record<string, any>; // Block-specific settings
}

interface DashboardLayoutConfig {
  blocks: BlockInstance[];
}
```

## 4. Layout Logic (Grid System)

*   **Mobile (Portrait):** 2 Columns.
    *   `w: 1` = 50% width (minus gap).
    *   `w: 2` = 100% width.
*   **Desktop/Tablet:** Responsive (e.g., 4 or 6 Columns).

## 5. Component Structure

```
src/features/dashboard/
├── components/
│   ├── DashboardGrid.tsx       # Main layout container (Grid implementation)
│   ├── BlockWrapper.tsx        # Common wrapper (Title, Menu, Styles)
│   └── blocks/                 # Concrete Block implementations
│       ├── WeightTrendBlock.tsx
│       └── ...
├── hooks/
│   └── useDashboardLayout.ts   # Logic for fetching/updating layout config
└── index.ts
```
