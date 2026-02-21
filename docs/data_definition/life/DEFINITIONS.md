# Life Data Definition

**Scope:** Daily physiological and lifestyle metrics, combining body composition and nutrition totals.

## Schema: DailyLifeMetric

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| id | number | No (Auto) | Unique Identifier |
| date | string | Yes | Data date (YYYY-MM-DD) |
| weight | number | Yes | Body weight in kg |
| calorieIntake | number | No | Total daily calories (kcal) |
| protein | number | No | Daily protein intake (g) |
| fat | number | No | Daily fat intake (g) |
| carbohydrate | number | No | Daily carbohydrate intake (g) |
| bodyFatPercentage | number | No | Optional body fat percentage (%) |
| memo | string | No | Optional daily notes |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

## Example Data

```json
{
  "id": 1,
  "date": "2024-02-21",
  "weight": 75.0,
  "calorieIntake": 2800,
  "protein": 180,
  "fat": 70,
  "carbohydrate": 350,
  "bodyFatPercentage": 15.0,
  "memo": "Slightly over calorie goal today",
  "createdAt": "2024-02-21T07:00:00.000Z",
  "updatedAt": "2024-02-21T22:00:00.000Z"
}
```

## Analytical Note
- This data is used as the **X-axis** in correlation analyses for SBD progress.
- Users input these values directly in the "Life" screen. No individual food items are stored.
