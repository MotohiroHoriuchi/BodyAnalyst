# Data Visualization Engine Specifications

## 1. Overview
The Data Visualization Engine is a specialized, pure-functional layer responsible for transforming raw domain data into render-ready visualization properties. It is designed to be side-effect-free, ensuring high testability, reusability, and predictability.

**Core Philosophy:**
> "Give me data and a configuration, and I will give you the exact blueprint to draw a chart."

## 2. Architecture Principles
*   **Pure Functions:** All transformations must be pure functions. Output is determined solely by input.
*   **Stateless:** The engine retains no state. State is managed by the Frontend layer.
*   **Recharts-Oriented:** The engine's output is specifically optimized for **Recharts**, utilizing its declarative prop structure.
*   **Design-First Customization:** While using Recharts for layout, visual elements (Tooltips, Legends, Axes) will be heavily customized using **Shadcn/UI** patterns and **Tailwind CSS** to achieve a modern, cohesive aesthetic, bypassing default styles.
*   **Configurable:** The engine is driven by configuration objects, allowing users (or the app) to dynamically change visualization types without altering code.

## 3. Data Flow
1.  **Input:**
    *   `RawData`: Array of domain entities (e.g., `WeightRecord[]`, `WorkoutSession[]`).
    *   `VisConfig`: A JSON object defining the chart type, axes, colors, and aggregation rules.
2.  **Process (The Engine):**
    *   **Filtering:** Time range selection, category filtering.
    *   **Aggregation:** Grouping by day/week, summing volumes, averaging weights.
    *   **Formatting:** Date formatting, unit conversion.
    *   **Mapping:** Converting domain fields to Recharts-compatible keys (e.g., `{ name: '1/15', value: 70.5 }`).
3.  **Output:**
    *   `ChartProps`: A structured object containing the `data` array and specific configuration props (axes configurations, customized sub-components) ready to be spread onto a Recharts component.

---

## 4. Implementation Pattern: Functional [Transformer](../../system-specific-words/Transformer/DEFINITIONS.md)

The engine implements the **Functional Transformer** pattern. This pipeline approach uses a single generic interface to orchestrate specialized sub-functions.

### Structure
```typescript
// The main transformer function signature
type TransformFn = <T>(data: T[], config: VisConfig) => RechartsProps;

// Output structure optimized for Recharts
interface RechartsProps {
    data: any[];
    xAxis: { dataKey: string; tickFormatter?: (value: any) => string; /* ... */ };
    yAxis: { domain?: [number, number]; /* ... */ };
    series: { type: 'line' | 'bar'; dataKey: string; color: string; /* ... */ }[];
    tooltip: React.FC<any>; // Custom component reference
}
```

### Mechanism
1.  **`filterData(data, config.range)`**: Reduces the dataset based on the selected time range.
2.  **`aggregateData(filtered, config.grouping)`**: Groups data points (e.g., daily logs into weekly averages) if required.
3.  **`mapToVisuals(aggregated, config.mapping)`**: Transforms domain objects into simple key-value pairs required by Recharts.
4.  **`composeProps(mappedData, config)`**: Assembles the final props object, injecting custom Shadcn/UI-styled components for tooltips and legends.

## 5. Library Selection & Strategy

### Selected Library: **Recharts**
*   **Reasoning:**
    1.  **Simple Data Structure:** Recharts accepts plain arrays of objects, simplifying the Transformer logic compared to libraries requiring complex nested configuration objects.
    2.  **Declarative UI:** Matches React's component structure, ensuring readability and maintainability.
    3.  **Customizability:** Allows for complete replacement of sub-components (Axis, Tooltip, Legend) with custom React components.

### Aesthetic Strategy
To meet the requirement of "beautiful and easy-to-read data":
*   **No Defaults:** We will strictly avoid Recharts' default tooltips and legends.
*   **Shadcn/UI Integration:** Custom Tooltips and Legends will be built using Shadcn/UI cards and typography.
*   **Tailwind CSS:** All styling for these custom components will be handled via Tailwind classes to ensure consistency with the rest of the application.

## 6. Directory Structure
```
src/
└── features/
    └── analytics/
        └── engine/
            ├── transformers/    # Pure functions for specific chart types
            │   ├── weightTransformer.ts
            │   ├── volumeTransformer.ts
            │   └── pfcTransformer.ts
            ├── components/      # Custom Recharts sub-components (Shadcn/UI styled)
            │   ├── CustomTooltip.tsx
            │   ├── CustomLegend.tsx
            │   └── CustomAxis.tsx
            ├── core/            # Shared logic (aggregation, date handling)
            │   ├── aggregator.ts
            │   ├── filter.ts
            │   └── timeUtils.ts
            └── types.ts         # Config and Prop definitions
```
