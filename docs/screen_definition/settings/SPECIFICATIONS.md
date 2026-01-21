# Settings Screen Definitions

## 1. Screen List
1.  **Settings Top:** Menu list of setting items.
2.  **Profile Edit:** Editing basic information used for BMR (Basal Metabolic Rate) calculation.
3.  **Goals:** Setting goals for weight, body fat percentage, calorie intake, and PFC balance.
4.  **Data Management:** Import/Export and cloud synchronization settings.

## 2. Detailed Specifications

### 2.1. Settings Top
*   **Layout:** List View
*   **Sections:**
    *   **User Settings:** Profile, Goals
    *   **App Settings:** Theme (Light/Dark), Language
    *   **Data:** Sync Settings, Backup/Restore
    *   **Info:** Version, Terms of Service
*   **Actions:** Logout button (at the bottom, styled in danger color).

### 2.2. Profile Edit
*   **Input Fields:**
    *   Display Name (Text)
    *   Date of Birth (Date Picker) -> Auto-calculate Age
    *   Gender (Select: Male/Female/Other)
    *   Height (Number: cm)
    *   **Activity Level (Select):** Used for TDEE calculation.
        *   **1.2 (Sedentary):** Little to no exercise (mostly desk work).
        *   **1.375 (Lightly Active):** Light exercise (1-3 days/week), standing work.
        *   **1.55 (Moderately Active):** Moderate exercise (3-5 days/week), physical labor.
        *   **1.725 (Very Active):** Hard exercise (6-7 days/week), strenuous physical labor.
        *   **1.9 (Extra Active):** Very hard exercise, professional athlete level.
*   **Logic:** Upon saving, BMR and TDEE are recalculated. The user is asked whether to update the default values in "Goals" based on these new calculations.

### 2.3. Goals
*   **Input Fields:**
    *   Target Weight (kg)
    *   Target Body Fat (%)
    *   Target Calorie Intake (kcal) - Auto-calculate button available.
    *   PFC Balance (Protein, Fat, Carb) - Slider or % input (Total must be 100%).

### 2.4. Data Management
*   **Features:**
    *   **Google Sheets Integration:** Connect button (Starts OAuth flow). Displays sync status (Last synced timestamp).
    *   **JSON Export:** Download all data as a JSON file.
    *   **JSON Import:** Restore data from a backup file (Warning about overwriting existing data is mandatory).
    *   **Delete All Data:** Initialize local DB (IndexedDB). Confirmation dialog is mandatory (Double-lock such as requiring the user to type "DELETE" is recommended).