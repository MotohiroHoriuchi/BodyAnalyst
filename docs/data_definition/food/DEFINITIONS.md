# Food Data Definition

## Schema: FoodMaster

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| id | number | No (Auto) | Unique Identifier |
| name | string | Yes | Name of the food |
| caloriesPer100g | number | Yes | Calories per 100g |
| proteinPer100g | number | Yes | Protein per 100g (g) |
| fatPer100g | number | Yes | Fat per 100g (g) |
| carbsPer100g | number | Yes | Carbs per 100g (g) |
| isCustom | boolean | Yes | Whether added by user |
| createdAt | Date | Yes | Creation timestamp |

## Example Data: FoodMaster

```json
{
  "id": 1,
  "name": "Chicken Breast (Skinless)",
  "caloriesPer100g": 108,
  "proteinPer100g": 22.3,
  "fatPer100g": 1.5,
  "carbsPer100g": 0,
  "isCustom": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Schema: MealRecord

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| id | number | No (Auto) | Unique Identifier |
| date | string | Yes | Meal date (YYYY-MM-DD) |
| mealType | string | Yes | 'breakfast', 'lunch', 'dinner', 'snack' |
| items | MealItem[] | Yes | List of food items |
| totalCalories | number | Yes | Total calories for the meal |
| totalProtein | number | Yes | Total protein (g) |
| totalFat | number | Yes | Total fat (g) |
| totalCarbs | number | Yes | Total carbs (g) |
| memo | string | No | Optional notes |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

### Nested: MealItem

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| foodId | number | Yes | Reference to FoodMaster ID |
| foodName | string | Yes | Snapshot of food name |
| amount | number | Yes | Amount consumed in grams |
| calories | number | Yes | Calculated calories |
| protein | number | Yes | Calculated protein |
| fat | number | Yes | Calculated fat |
| carbs | number | Yes | Calculated carbs |

## Example Data: MealRecord

```json
{
  "id": 101,
  "date": "2024-01-15",
  "mealType": "lunch",
  "items": [
    {
      "foodId": 1,
      "foodName": "Chicken Breast (Skinless)",
      "amount": 150,
      "calories": 162,
      "protein": 33.45,
      "fat": 2.25,
      "carbs": 0
    },
    {
      "foodId": 50,
      "foodName": "White Rice (Cooked)",
      "amount": 200,
      "calories": 336,
      "protein": 5.0,
      "fat": 0.6,
      "carbs": 74.2
    }
  ],
  "totalCalories": 498,
  "totalProtein": 38.45,
  "totalFat": 2.85,
  "totalCarbs": 74.2,
  "memo": "Post workout meal",
  "createdAt": "2024-01-15T12:30:00.000Z",
  "updatedAt": "2024-01-15T12:30:00.000Z"
}
```
