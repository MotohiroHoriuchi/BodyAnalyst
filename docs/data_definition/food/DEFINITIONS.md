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