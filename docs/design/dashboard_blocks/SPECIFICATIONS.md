# Dashboard Block Visual Specifications

## 1. Design Philosophy
The visual design mimics **iOS Home Screen Widgets**:
- **Content-First:** Data (charts/numbers) takes absolute priority.
- **Minimal Chrome:** Administrative UI elements (headers, footers, borders) are removed or minimized to reduce visual noise.
- **Immersive:** The UI element itself is the interface.

## 2. Component Structure

### Layout & Hierarchy
- **Main Area:** Occupies 90%+ of the block. Dedicated entirely to the graph or summary metric.
- **Titles:**
    - Displayed unobtrusively (e.g., small font size at the top-left).
    - May use semi-transparent overlays to avoid cutting into the graph area.
    - *Constraint:* Must not obscure the latest data point.
- **No Footer/Header Bars:** Dedicated distinct bars for titles or dates are prohibited to maximize space.

### Interaction Feedback
- **Touch Target:** The entire card surface is the touch target.
- **Feedback:** Standard touch feedback (e.g., slight scale-down or opacity change) indicates interactivity.
- **Popover Menu:** Appears as a floating bubble pointing to the source block, overlaying the dashboard.

## 3. Visual States

### Loading State
- **Skeleton UI:** Use a shimmering skeleton shape that mimics the expected content (e.g., a bar chart skeleton for a chart block) rather than a generic spinner.

### Empty State (Call to Action)
- **Visuals:** Instead of an empty grid, display a prominent "Add Data" icon or button centered in the block.
- **Style:** Use a muted or dashed border style to suggest a "placeholder" waiting to be filled.

### Responsiveness
- **Adaptive Rendering:**
    - On small blocks (1x1), hide axes labels and legends.
    - On large blocks, progressively reveal more detail (grid lines, axis values, legends).
