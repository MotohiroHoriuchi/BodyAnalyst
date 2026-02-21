# v0.dev Prompt: BodyAnalyst Prototype

**Goal:** Create a high-fidelity, functional React prototype for a fitness tracking application named "BodyAnalyst".
**Theme:** "Monochrome Minimalist Dark Mode" with iOS-like widget aesthetics.
**Core Concept:** A "Self-Analyst" tool. Shift focus from simple progress bars to **analytical charts** that reveal relationships between metrics (Correlation & Causality).

## Tech Stack & Libraries
*   **Framework:** React
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Charts:** Recharts (Required for graphs - Scatter, Composed, etc.)
*   **Components:** Shadcn UI (Radix UI primitives)

## Design System (Critical)

1.  **Color Palette (Monochrome & Minimal):**
    *   **Background:** Deep Black (`#000000` or `bg-zinc-950`).
    *   **Surface/Cards:** Dark Gray (`#18181b` or `bg-zinc-900`).
    *   **Text:**
        *   Primary: White (`text-zinc-50`).
        *   Secondary: Muted Gray (`text-zinc-400`).
    *   **Borders:** Very subtle (`border-zinc-800`).
    *   **Functional Colors:** Use **Low Saturation** colors for semantic meaning.
        *   *Error/Warning:* Desaturated Red (e.g., `text-red-400/80`).
        *   *Success:* Desaturated Green (e.g., `text-emerald-400/80`).
    *   **Dynamic Color System:**
        *   The app should rely on a primary accent color (e.g., a muted Blue or Slate) for active states and key charts.
        *   *Requirement:* Accept a single primary color variable and generate a consistent monochromatic palette (shades/tints) for charts and UI elements.

2.  **Typography & Shape:**
    *   Clean Sans-serif (Inter).
    *   **Rounded Corners:** Generous radii (e.g., `rounded-2xl` or `rounded-3xl`) for cards and buttons to mimic iOS widgets.

3.  **Navigation:**
    *   **Fixed Bottom Navigation Bar:**
        *   5 Tabs: **Dashboard** (Home), **Workout**, **Meal**, **Weight**, **Settings**.
        *   *Active State:* White Icon + Label.
        *   *Inactive State:* Dark Gray Icon.

---

## Screen Requirements

### 1. Dashboard (The "Analyst" Cockpit)
*   **Concept:** "Correlation & Causality". Allow users to construct hypotheses (e.g., "Eating more carbs boosts my squat").
*   **Header:** Simple greeting or date. "Edit" button (icon) at top-right.
*   **Content (Widgets):**
    *   **Widget A (Primary - Large):** "Goal Trajectory". A composed chart showing:
        *   **Historical Data:** Solid line (Past performance).
        *   **Projected Future:** Dashed line (Predicted growth based on current pace).
        *   **Goal Line:** A horizontal reference line for the target (e.g., 100kg Bench).
    *   **Widget B (Medium - Analysis):** "Frequency vs. Gains" (Scatter Plot).
        *   X-Axis: Days Rested (Since last session).
        *   Y-Axis: Strength Gain (Weight delta).
        *   *Insight:* Reveals optimal rest days for performance.
    *   **Widget C (Medium - Analysis):** "Volume vs. Intensity" (Bubble Chart).
        *   X-Axis: Total Volume.
        *   Y-Axis: Max Weight.
        *   Bubble Size: RPE (Exertion).
    *   **Widget D (Small - Qualitative):** "Performance Nebula".
        *   A visualization of **User Tags** (e.g., "Sleep+", "Stress-", "Caffeine").
        *   **Center:** Tags associated with "Best Lifts" float near the center.
        *   **Outer Edge:** Tags associated with "Poor Performance" drift to the edges.
        *   *Animation:* Use particle-like floating animation for tags.
    *   **Action:** "Create New Analysis" button. Opens a modal with dropdowns for Metric A (X-Axis) vs Metric B (Y-Axis) to generate custom charts.

### 2. Workout (Training Log - Hardcore Mode)
*   **Focus:** Speed & Error Prevention in Gym Environment.
*   **Header:** "Chest Day" (Editable Title), Timer Display (e.g., "00:45:30"), "Finish" Button.
*   **Content (Exercise List):**
    *   **Cards:** Each exercise is a card (`bg-zinc-900`).
    *   **Table inside Card:** Columns: Set #, Prev (Ghost text), Weight (kg), Reps, RPE, Checkbox (Hidden).
    *   **Input UX:**
        *   **Ghost Text:** Display previous session's weight/reps as placeholders. Tapping auto-fills.
        *   **Swipe to Complete:** Instead of a checkbox, implement a **"Swipe Right" interaction on the row** to mark the set as complete (green background reveal).
*   **Floating Action Button (FAB):** Large "+" button at bottom-right.

### 3. Meal (Nutrition Log)
*   **Focus:** Rapid PFC (Protein, Fat, Carbs) Awareness.
*   **Header:**
    *   Date Navigator.
    *   **Summary:** A linear progress bar for Total Calories. Below it, 3 thinner bars for Protein, Fat, Carbs.
*   **Content:**
    *   Sections for Breakfast, Lunch, Dinner, Snack.
    *   "Add Food" button at the bottom of each section.

### 4. Weight (Body Composition)
*   **Focus:** Quick Data Entry.
*   **Hero Section:**
    *   Massive, centered input for Weight (e.g., "72.5"). Unit "kg" smaller.
    *   Smaller inputs below for "Body Fat %" and "Muscle Mass".
*   **History:**
    *   A simple list below the inputs showing past records.
    *   "▼ 0.5kg" trend indicator (Green if down, Red if up - low saturation).

### 5. Settings
*   **Style:** Grouped Lists (iOS Settings style).
*   **Groups:**
    *   **Account:** Profile, Data Sync Status.
    *   **Preferences:** Theme (Primary Color Picker), Notifications.
    *   **System:** Version, Terms.

---

## Interactive Elements
*   **Animation:** On load, animate numbers counting up (`0 -> 72.5`) and charts growing/rendering from zero.
*   **Data:** Use realistic dummy data to populate charts (Scatter, Line, Bubble) so the analytical potential is visible.