# Workout Record Visual Specifications

## 1. Design Concept
The UI prioritizes **speed of entry** and **information density**. In a gym environment, users need large tap targets, clear readability, and minimal friction to log sets between physical exertion.

## 2. Layout Structure

### Header
- **Session Info:** Date and elapsed time counter.
- **Finish Button:** Prominent action button (top-right) to close the session.

### Main Content (Exercise List)
- **Card-Based Layout:** Each added exercise is a distinct card.
- **Set Table:** Within each card, sets are listed in a table format.
    - **Columns:** Set #, Previous Log (Ghost Text), Weight, Reps, RPE, Checkbox.
- **Add Set Button:** A large footer button within the card to append a new row.

### Floating Action Button (FAB)
- **"Add Exercise":** A persistent "+" button fixed at the bottom-right to add new exercises to the session.

## 3. Component Details

### Input Fields
- **Smart Input:** Clicking a weight/rep field selects the entire text for instant overwriting.
- **Numeric Pad:** Triggers a number-only keyboard.
- **RPE Help Button:** A small "?" icon next to the RPE column header.
    - **Interaction:** Tapping the icon opens a popover or modal explaining RPE.
    - **Content (Summary):**
        > **RPE（主観的運動強度）**
        > 「あと何回できるか」の感覚値です。
        > - **10:** 限界（あと0回）
        > - **9:** あと1回できる
        > - **8:** あと2回できる
        > - **7:** あと3回できる
        >
        > ※日頃のトレーニングではRPE 7~9を目安にし、毎回限界(10)まで追い込まないことが重要です。厳密すぎず、感覚で記録して構いません。

### Rest Timer Overlay
- **Mini-Player Style:** When running, the timer appears as a small floating pill or bottom bar, accessible from anywhere in the screen.
- **Full View:** Tapping the pill expands to a modal for adjusting time or skipping.

### History Preview
- **Accordion/Drawer:** Tapping an "Info" or "History" icon on the exercise card header expands a section showing past performance graphs or logs without leaving the current screen.
