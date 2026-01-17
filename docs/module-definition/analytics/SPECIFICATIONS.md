# Analytics Module ([Visualization Engine](../../system-specific-words/Visualization_Engine/DEFINITIONS.md)) Specifications

## 1. Overview
The Analytics Module is responsible for transforming domain data (e.g., weight, workout logs) into a format interpretable by visualization libraries (Recharts) and rendering it.
This module encapsulates the application's most critical business logic and serves as the central point for future feature expansions.

## 2. Directory Structure

```
src/features/analytics/
├── engine/              # Core Logic (Pure Functions)
│   ├── transformers/    # Chart Transformation Logic (Extension Point)
│   │   ├── definitions/ # Implementations of specific transformers
│   │   └── index.ts     # Transformer Registry
│   ├── core/            # Shared Logic
│   │   ├── aggregator.ts # Data aggregation (daily -> weekly, etc.)
│   │   └── timeUtils.ts  # Time axis manipulation
│   └── types.ts         # Type Definitions (VisConfig, etc.)
├── components/          # UI Rendering (Recharts Wrapper)
│   ├── charts/          # Components per chart type
│   ├── parts/           # Chart elements (Tooltip, Legend)
│   └── VisualizationBlock.tsx # Main Entry Component
└── index.ts             # Public API
```

## 3. Key Sub-Modules

### 3.1 [Transformers](../../system-specific-words/Transformer/DEFINITIONS.md) (Engine Core)
A collection of pure functions that transform domain data into Recharts Props.
Since this is the area where functional additions occur most frequently, extension rules and detailed specifications are defined in a separate document.
*   **Detailed Specifications:** [Transformers Specifications](./transformers/SPECIFICATIONS.md)

### 3.2 Components (Visual Presentation)
React components responsible for rendering the transformed data. Handles integration with Shadcn/UI and custom design application.
*   **Detailed Specifications:** [Components Specifications](./components/SPECIFICATIONS.md)

## 4. Data Flow Overview
1.  **Input:** Raw Data (Domain Entities) + Visualization Config
2.  **Transformer:** `TransformFn(data, config) => RechartsProps`
3.  **Render:** `<VisualizationBlock props={RechartsProps} />`

## 5. Shared Core Logic Specifications
Specifications for shared logic located in `engine/core/`.

*   **Aggregator:**
    *   Handles data granularity conversion (e.g., daily to weekly averages).
    *   **Missing Value Handling:** Periods with no data are **skipped** (not zero-filled or interpolated) to accurately represent data gaps.

## 6. Public Interfaces
```typescript
export { VisualizationBlock } from './components/VisualizationBlock';
export type { VisConfig } from './engine/types';
// Publicly expose available chart type definitions for configuration UI
export { AVAILABLE_CHART_TYPES } from './engine/transformers';
```
