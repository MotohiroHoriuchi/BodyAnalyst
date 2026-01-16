# Analytics Transformers Detailed Specifications

## 1. Overview
Transformers are pure functions that convert raw domain entities (e.g., `WeightRecord[]`) into flat object arrays and style definitions (Props) expected by Recharts.
This directory serves as the **extension point** for adding new visualization types.

**Note for Agents:** Individual specifications for each defined transformer (e.g., `weightTrend.md`) can be found by traversing this directory: `@docs/module-definition/analytics/transformers/**`. Always refer to these sub-documents for specific logic requirements of a particular metric.

## 2. Directory & Naming Conventions
To ensure consistency and enable automated implementation by agents, strict naming conventions are enforced.

### Directory Structure
```
src/features/analytics/engine/transformers/
├── index.ts             # Registry: Exports logic and maps IDs
└── definitions/         # Individual implementations
    ├── [feature]Trend.ts   # e.g., weightTrend.ts
    ├── [feature]Volume.ts  # e.g., workoutVolume.ts
    └── [feature]Ratio.ts   # e.g., pfcRatio.ts
```

### Naming Rules
*   **File Name:** CamelCase description of the metric (e.g., `weightTrend.ts`).
*   **Function Name:** `transform[MetricName]` (e.g., `transformWeightTrend`).
*   **Test File:** `[MetricName].test.ts` located in the same directory (or `__tests__`).

## 3. Core Interface
All Transformers must implement the `TransformFn` interface.

```typescript
type TransformFn = <T>(data: T[], config: VisConfig) => RechartsProps;

interface RechartsProps {
  data: any[];        // Flattened array for chart (e.g., [{ name: '1/1', value: 70 }])
  xAxis: XAxisConfig; // Axis configuration
  yAxis: YAxisConfig; // Axis configuration
  series: SeriesConfig[]; // Visual settings for lines/bars
  tooltip: React.ComponentType<any>; // Reference to custom tooltip component
}
```

## 4. Implementation Pipeline
Transformers should process data in the following standardized pipeline:

1.  **Filter:** Exclude data outside the `config.range`.
2.  **Aggregate:** Use `aggregator.ts` to convert granularity (e.g., Daily -> Weekly).
3.  **Map:** Convert aggregated data into `{ name: string, value: number, ... }`.
4.  **Compose:** Assemble the final `RechartsProps`, applying colors from `config.color`.

## 5. Aggregation Rules (Reference)
*   **Average:** For continuous metrics (Weight, Body Fat).
*   **Sum:** For cumulative metrics (Volume, Calories).
*   **Missing Values:** Periods with no data must be **skipped** (not zero-filled) to accurately reflect data gaps.

## 6. Extension Guide (For Agents)
When adding a new chart type:
1.  **Create File:** Add `definitions/[metricName].ts`.
2.  **Implement:** Write the pure function adhering to `TransformFn`.
3.  **Register:** Add the function to `TRANSFORMER_REGISTRY` in `index.ts` with a unique ID string.
4.  **Test:** Create corresponding unit tests verifying boundary conditions and aggregation accuracy.
