# Body Composition Visual Specifications

## 1. Layout Structure

### Header Area
- **Title:** "Body Composition" displayed prominently.
- **Primary Action:** A "Save" button located at the top-right (standard mobile pattern).
    - *State:* Disabled until valid weight input is detected.

### Input Section (Main Canvas)
- **Weight Input (Hero Element):**
    - **Style:** Large, centered text input for weight to emphasize its importance.
    - **Unit:** "kg" label displayed clearly next to the value.
    - **Control:** Specialized numeric keypad or custom stepper for quick, thumb-friendly adjustment.
- **Secondary Metrics:**
    - **Layout:** Horizontal row or grid below the main weight input.
    - **Style:** Smaller input fields for Body Fat % and Muscle Mass.

### History List Section
- **Location:** Below the input section.
- **Style:** Scrollable list.
- **Item Design:**
    - **Row Layout:** Date on left, Weight/Fat% on right.
    - **Trend Indicator:** Small arrow/color (Green/Red) indicating change from the previous record.

## 2. Visual Feedback

### Immediate Trend
- Upon entering a weight value, if a previous record exists, dynamically display the difference (e.g., "▼ 0.5kg") near the input field in real-time.

### Success State
- **Toast/Snackbar:** Unobtrusive popup message "Record Saved" upon successful submission.
- **Animation:** The new entry slides into the History List at the top.

## 3. Component References
- **Numeric Stepper:** Custom component allowing coarse (+1.0) and fine (+0.1) adjustments.
- **Date Picker:** Standard system date picker or bottom-sheet calendar.
