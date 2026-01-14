# Dashboard Design Specifications

## 1. Design Concept
The dashboard serves as a "personal cockpit" for users to grasp their activity status at a glance. Inspired by the **iOS Home Screen**, it provides an organized layout based on a grid system and an interface that prioritizes information visibility.

## 2. Layout System (Grid System)

### Grid Structure
- **Mobile First:** On mobile devices, the horizontal screen space is divided into a **2-column grid**.
    - The minimum block size (1x1) occupies approximately 50% of the screen width.
    - For prominent data visualizations, blocks can span 2 horizontal grids (full width).
- **Spacing:** Maintains an optimal balance for gutters between blocks (e.g., 10px ~ 16px) to ensure distinct separation.

## 3. Edit Mode

### Entry Point
- Users transition to "Edit Mode" by tapping the **Settings button** (e.g., gear icon).
- Visual feedback, such as blocks slightly shaking (jiggling), is used to indicate that the dashboard is in an editable state.

### Operations and Animations
1.  **Reorder (Drag and Drop):**
    - Blocks are moved via intuitive drag-and-drop interactions.
    - As a block is dragged, existing blocks at the destination animate as if being **pushed away** in real-time, fluidly clearing space for the new arrangement.
2.  **Resize:**
    - Users can change dimensions by dragging a resize handle (typically located at the bottom-right of the block).
    - The block size **dynamically changes** in sync with the pointer movement, rendered with smooth animations until it snaps to the nearest grid unit.
3.  **Add:**
    - New blocks are added via a dedicated **Add button** (e.g., a "+" icon).
4.  **Delete:**
    - Users can delete a block by **long-pressing** it or by tapping the **delete icon (X button at the top-right)** that appears during edit mode.
    - Deletion is accompanied by an animation where the block shrinks and disappears.

## 4. Style and Colors

### Color Palette
Background colors are based on achromatic tones to maximize the visibility of data within the blocks.
- **Light Mode Background:** Light Gray `#F2F2F7` (Equivalent to iOS System Gray 6).
- **Dark Mode Background:** Deep Black `#1C1C1E` (Equivalent to iOS System Gray 6 Dark).

### Block Appearance
- **Corner Radius:** Apply large rounded corners (e.g., 20px) to match the modern, widget-like aesthetic.
- **Shadows:** Soft, subtle drop shadows are used to provide a sense of depth, making blocks appear to float above the background.

## 5. Interactions (General)
- **Scrolling:** Standard vertical scrolling.
- **Overscroll:** Native-like bounce effects are applied at the top and bottom of the dashboard.

## 6. Related Documents
- [Dashboard Block Visual Specifications](../dashboard_blocks/SPECIFICATIONS.md)
- [Dashboard Screen Definitions](../../screen_definition/dashboard/SPECIFICATIONS.md)
