# Meal Record Visual Specifications

## 1. Design Concept
Since meal logging occurs multiple times a day, the UI prioritizes **"Rapid Search"** and **"Intuitive PFC (Protein, Fat, Carbs) Awareness."** The interface is designed to reduce the friction of data entry while providing a clear picture of daily nutritional progress.

## 2. Layout Structure

### Header Area (Daily Summary)
- **Date Selector:** Displays the current date with navigation (left/right arrows) or a tap-to-open calendar.
- **Progress Dashboard:** 
    - **Calorie Gauge:** A prominent circular or horizontal progress bar showing total calories consumed vs. daily goal.
    - **PFC Bars:** Three distinct horizontal bars representing Protein, Fat, and Carbohydrates, showing current intake relative to target values.

### Main Content (Meal Type Cards)
- **Sections:** Four distinct cards for Breakfast, Lunch, Dinner, and Snacks.
- **Card Design:**
    - **Header:** Displays the meal type name and the subtotal calories for that specific meal.
    - **Item List:** A clean list of logged food items, showing name, amount (e.g., "150g"), and calories.
    - **"Add Food" Button:** A subtle but accessible button at the bottom of each card to trigger the search modal.

### Floating Action Button (FAB)
- **"Quick Log":** A persistent button at the bottom-right to provide one-tap access to recently eaten foods or favorites.

## 3. Component Details

### Food Search & Entry Modal
- **Real-time Search:** Displays matches instantly as the user types.
- **History & Favorites Tabs:** Allows users to select frequently consumed items without searching.
- **Amount Adjustment:** 
    - A numeric input field paired with common presets (e.g., "1 serving", "100g").
    - **Real-time Feedback:** PFC and calorie values update dynamically within the modal as the amount is changed.

### Custom Food Entry
- A simplified form for registering foods not found in the master database.
- The field order (Calories -> Protein -> Fat -> Carbs) matches standard nutrition labels for easy transcription.

## 4. Visual Feedback

### Balanced Intake Visualization
- **PFC Balance Chart:** A small, color-coded donut chart showing the current ratio of Protein, Fat, and Carbs compared to the ideal target ratio.

### Over-Target Indicators
- **Soft Warnings:** If a calorie or fat goal is exceeded, the numerical value changes to a warning color (e.g., Amber/Orange) to inform the user without being overly discouraging.

## 5. Related Documents
- [Meal Record Screen Definitions](../../screen_definition/meal/SPECIFICATIONS.md)
- [Food Data Definitions](../../data_definition/food/DEFINITIONS.md)
