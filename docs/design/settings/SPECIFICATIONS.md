# Settings Design Specifications

## 1. Design Concept
The settings screen acts as a "Control Center" for users to optimize the application according to their body and preferences.
The design is guided by three keywords: **"Clarity," "Accessibility," and "Reassurance."**

## 2. User Experience (UX)
*   **Immediate Reflection & Explicit Saving:**
    *   **Toggle Switches** (e.g., Notifications, Theme) reflect changes immediately.
    *   **Text Inputs** (e.g., Profile, Numerical Goals) require a "Save" action to finalize, preventing accidental loss of changes.
*   **Visualization of Data Sync:** The synchronization status with Google Sheets is intuitively displayed via icons or a status bar.
*   **Feedback:**
    *   **Success:** A snackbar appears at the bottom of the screen (e.g., "Profile saved successfully").
    *   **Error:** Displayed in red text directly below the input field, disabling the save button.
    *   **Loading:** A spinner appears within the save button to prevent double submissions.

## 3. Visual Style

### 3.1. Color Palette
*   **Background:** Base background color (`bg-background`).
*   **Group Background:** A slightly lighter color (`bg-surface`) is used to separate sections in a card-like style, improving visibility.
*   **Accent:** Primary color (`text-primary`, `bg-primary`) is used for switches and active icons.
*   **Danger:** Red (`text-error`, `border-error`) is used for logout and data deletion actions to alert the user.

### 3.2. Typography
*   **Section Headers:** Small, bold, slightly muted color (`text-xs font-bold text-muted-foreground uppercase tracking-wider`).
*   **Item Labels:** Standard size (`text-base font-medium`).
*   **Values:** Right-aligned, slightly muted color (`text-sm text-muted-foreground`).

### 3.3. Component Specifics
*   **List Item:**
    *   Height: `min-h-[48px]` (Ensures tap target size).
    *   Layout: `Flex (justify-between, items-center)`.
    *   Left Side: Icon + Label.
    *   Right Side: Current Value + Navigation Icon (Chevron Right) or Toggle Switch.
*   **Separator:** A thin line (`border-b border-border`) is drawn between items, but not after the last item in a section.