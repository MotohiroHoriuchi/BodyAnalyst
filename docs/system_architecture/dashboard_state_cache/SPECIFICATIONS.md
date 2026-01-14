# Dashboard State & Persistence Specifications

## 1. Overview
To ensure data accuracy and visual consistency, the dashboard does not cache rendered graph views or React components. Instead, it utilizes a metadata-driven persistence strategy. The system stores the "blueprint" of each dashboard [block](../../system-specific-words/Block/DEFINITIONS.md), allowing the [Visualization Engine](../visualization_engine/SPECIFICATIONS.md) to reconstruct the block dynamically upon every load or state change.

## 2. Persistence Strategy

### No View Caching
- **Rule:** The rendered output (DOM elements, SVG paths, or internal component state of Recharts) must **NEVER** be persisted.
- **Reasoning:** Caching rendered views can lead to stale data visualization, increased storage overhead, and potential UI desynchronization when the underlying data or engine logic changes.

### Metadata-Driven Reconstruction
- The dashboard state consists only of the configuration necessary to invoke the data flow defined in the [Visualization Engine](../visualization_engine/SPECIFICATIONS.md).
- When a user navigates to the dashboard, the system:
    1.  Loads the persisted block metadata.
    2.  Queries the required raw records from the Database/CRUD layer.
    3.  Passes the raw data and metadata to the Visualization Engine.
    4.  Regenerates the graph block from the engine's output.

## 3. Persisted Metadata Schema
Each dashboard block is defined by the following state object:

| Field | Description |
| :--- | :--- |
| `blockId` | Unique identifier for the dashboard block. |
| `layout` | Object containing `x`, `y`, `width`, `height`, and `isVisible`. |
| `dataSource` | References to the domain entities to query (e.g., `weight`, `workout_volume`). |
| `engineConfig` | The `VisConfig` object passed to the Visualization Engine (chart type, aggregation rules, color). |
| `viewType` | The UI wrapper type to be used for rendering (e.g., `StandardChartCard`). |

## 4. Lifecycle & Flow

### On Dashboard Mount:
1.  **Retrieve State:** Fetch the array of block metadata from local storage or user settings.
2.  **Parallel Query:** For each visible block, initiate a data fetch for the specified `dataSource`.
3.  **Engine Transformation:** Call the engine's `transform` function with the fetched data and the persisted `engineConfig`.
4.  **Render:** Spread the resulting `ChartProps` onto the specified `viewType` component.

### On State Change (Resize/Move/Hide):
1.  Update the metadata object in memory.
2.  Persist the updated metadata array to the storage layer.
3.  (If resized) Trigger a re-render of the Recharts component to adjust to the new container dimensions.

## 5. References
- [Visualization Engine Specifications](../visualization_engine/SPECIFICATIONS.md)
- [Dashboard Screen Definitions](../../screen_definition/dashboard/DEFINITIONS.md)