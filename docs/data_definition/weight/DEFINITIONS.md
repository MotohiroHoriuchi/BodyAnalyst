# Weight Data Definition

## Schema

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| id | number | No (Auto) | Unique Identifier |
| date | string | Yes | Measurement date (YYYY-MM-DD) |
| weight | number | Yes | Body weight in kg |
| bodyFatPercentage | number | No | Body fat percentage (%) |
| muscleMass | number | No | Muscle mass in kg |
| timing | string | No | 'morning', 'evening', or 'other' |
| memo | string | No | Optional notes |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

## Example Data

```json
{
  "id": 1,
  "date": "2024-01-15",
  "weight": 72.5,
  "bodyFatPercentage": 15.5,
  "muscleMass": 58.2,
  "timing": "morning",
  "memo": "Feeling light today",
  "createdAt": "2024-01-15T07:00:00.000Z",
  "updatedAt": "2024-01-15T07:00:00.000Z"
}
```
