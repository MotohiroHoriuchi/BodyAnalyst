# Screen Definition: Dashboard (TOP)

## Overview
The Dashboard is the customizable home screen of the application. Unlike a fixed layout, it serves as a canvas where users can arrange and resize various "[Graph Blocks](../../system-specific-words/Block/DEFINITIONS.md)" to visualize their data according to their preferences.

## Key Features

### 1. Flexible Grid Layout
- **No Fixed Structure:** The dashboard does not enforce a rigid layout. It is composed of a grid system where users can freely place "Graph Blocks".
- **Block-Based Composition:** The entire screen content is divided into modular blocks.

### 2. Customizable Block Sizing
- **User Control:** Users can configure how many grid blocks a specific graph occupies.
- **Prioritization:** This allows users to enlarge critical data for better visibility while keeping less critical "glanceable" information smaller.
- **Direct Manipulation:** Block sizes can be adjusted intuitively via touch or mouse interactions directly on the dashboard, without opening a separate settings window.

### 3. Intuitive Arrangement
- **Drag and Drop:** The position of graph blocks can be changed intuitively via touch or mouse operations (e.g., drag and drop).

### 4. Visibility Management
- **Hide/Show:** Blocks can be hidden from the view.
- **Non-Destructive:** Hiding a block does not delete its underlying data or configuration.
- **Restoration:** Hidden blocks can be re-enabled and placed back onto the dashboard at any time.
- **State Persistence:** The logic for caching and persisting this state (visible/hidden, layout positions) is detailed in a separate specification.
    - *Reference:* [Dashboard State & Cache Logic](../../system_architecture/dashboard_state_cache/SPECIFICATIONS.md)

## Initial Setup (Default Preset)
When the application is launched for the first time, the following default layout should be applied:

1.  **Primary Block:**
    *   **Data:** Total Training Volume vs. Body Weight (Dual-axis Line Chart).
    *   **Size:** A square block. The side length should be determined by the shorter dimension of the user's device screen (responsive).
2.  **Secondary Block:**
    *   **Data:** Calorie Intake vs. Body Weight (Dual-axis Line Chart).
    *   **Size:** 1x1 Grid Unit.
    *   **Placement:** Placed in the available space adjacent to or below the primary block.

## Component Specifications

### Graph Blocks
The specific technical details, behavior, and data capabilities of the individual Graph Blocks are defined in a separate specification document.
- *Reference:* [Graph Block Specifications](../dashboard_blocks/SPECIFICATIONS.md)

## Data Requirements
- User layout preferences (persisted state).
- Dashboard block configurations (type, size, position).
- Aggregated data for display (Volume, Weight, Calories, etc., sourced from respective definitions).