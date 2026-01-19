# Meal Module Specifications

## 1. Overview
The Meal module is responsible for recording the user's dietary intake and managing nutritional status. It handles food searches from the master data, registration of custom foods, input of intake amounts, and automatic calculation of Calorie and PFC (Protein, Fat, Carbohydrate) balance.

## 2. Responsibilities
- **Recording:** Create, update, and delete meal records (`MealRecord`).
- **Search:** Search for food items from the food master (`FoodMaster`) by name.
- **Management:** Register and persist user-defined custom food data.
- **Calculation:** Automatically calculate calories and PFC based on intake amount.
- **Display:** Manage history categorized by Breakfast, Lunch, Dinner, and Snack.

## 3. Directory Structure
```
src/features/meal/
├── components/           # UI Components
│   ├── MealLogger.tsx      # Main form for meal logging
│   ├── FoodSearch.tsx      # UI for searching and selecting foods
│   ├── CustomFoodForm.tsx  # Form for registering new custom foods
│   ├── MealItemEdit.tsx    # Adjusting portion size for selected food
│   └── MealHistoryList.tsx # List view of past meal records
├── hooks/                # Business Logic
│   ├── useMeal.ts          # CRUD operations for meal records
│   ├── useFoodMaster.ts    # Operations for searching and registering food master data
│   └── useFoodSearch.ts    # Search logic (filtering, sorting)
├── utils/                # Calculation Logic
│   └── pfcCalculator.ts    # Calculates Calories/PFC from gram amounts
├── types/                # Module-specific type definitions
│   └── index.ts
└── index.ts              # Public API
```

## 4. Functional Requirements

### 4.1. Mandatory Features
*   **Add Custom Food:** Users can register new food items that do not exist in the database (e.g., homemade dishes, niche products).
*   **Master Persistence:** Registered custom foods are saved to the local storage (Dexie.js) and persisted.
    *   *Option:* Users can choose whether to backup custom foods to their personal remote spreadsheet via settings.
*   **Name Search:** Users can search for registered foods (both preset and custom) using partial name matching.

### 4.2. Future Features (Roadmap)
*   **External DB Integration:** Connect to a shared external food database API to retrieve general food data or support barcode scanning.

## 5. Key Data Flows

### 5.1. Registering Custom Food
1. If a food item is not found, the user selects "Add Food".
2. Enter the name and nutritional values (Calories, PFC per 100g) in `CustomFoodForm`.
3. `useFoodMaster` adds a new record to the local `FoodMaster` table.
4. The new item becomes immediately available in search results.

### 5.2. Logging a Meal
1. The user searches for and selects a food item in `FoodSearch`.
2. Enter the portion size (g) in `MealItemEdit`.
3. `pfcCalculator` calculates nutrients based on the master data and portion size.
4. Upon saving, a `MealRecord` containing multiple food items is created and sent to the `Infrastructure` layer.

## 6. Public API
```typescript
export { MealLogger } from './components/MealLogger';
export { MealHistoryList } from './components/MealHistoryList';
export { useMeal } from './hooks/useMeal';
// Access to custom food registration
export { CustomFoodForm } from './components/CustomFoodForm';
```
