# Dashboard Block Specifications

## 1. Overview
A **Dashboard Block** is a modular, independent functional unit. Users can instantiate, configure, and arrange these blocks to compose their personal dashboard.

## 2. Block Types

| Type | Description | Functional Role |
| :--- | :--- | :--- |
| **Chart Block** | Renders data visualizations via the [Visualization Engine](../../system_architecture/visualization_engine/SPECIFICATIONS.md). | Visualizes trends, distributions, and comparisons over time. |
| **Summary Block** | Displays scalar values or key metrics. | Provides instant status updates (e.g., "Remaining Calories"). |
| **Action Block** | Triggers specific application commands. | Acts as a shortcut for high-frequency tasks (e.g., "Log Weight"). |

## 3. Functional Behavior

### Interaction Logic
- **Primary Trigger:** The entire block area functions as a single interactive element.
- **Context Menu:** Activating a block triggers a context menu (popover) containing block-specific operations.
- **Link Navigation:** Blocks configured as simple links (Action Blocks) may navigate directly upon activation, bypassing the menu.

### Sizing & Grid Logic
- **Grid System:** The dashboard uses a flexible grid. The base unit is defined by the column count.
    - **Mobile (Standard):** 2 Columns.
- **Unit Dimensions:**
    - **1x1 (Square):** Occupies 1 column width (approx. 50% screen width - gutter). Aspect ratio is 1:1.
    - **2x1 (Wide):** Occupies 2 columns width (100% screen width). Height equals 1 row unit.
    - **2x2 (Large Square):** Occupies 2 columns width and 2 rows height.
- **Arbitrary Resizing:** While blocks snap to these grid units (1x1, 2x1, 2x2, etc.), the internal content must adapt responsively to any provided pixel dimension.
- **No Constraints:** There are no logic-enforced minimum or maximum size limits per block type; the block logic must handle any provided dimension gracefully (e.g., hiding labels if too small).

## 4. Configuration Options
Through the context menu, users can modify:
- **Time Range:** (e.g., 7 days, 30 days, Year-to-Date).
- **Visualization Type:** (e.g., Line Chart, Bar Chart) - *Applies to Chart Blocks*.
- **Data Source:** The underlying metric being displayed.

## 5. Data States
- **Loading:** The block initiates data fetching upon mounting.
- **Empty Data:** The block detects if the returned dataset is empty and provides a state indicating no data is available.
- **Error:** Handles API failures gracefully.

## 6. Design References
For visual guidelines, layout philosophy, and UI rendering details, refer to:
- [Visual Specifications](../../design/dashboard_blocks/SPECIFICATIONS.md)
