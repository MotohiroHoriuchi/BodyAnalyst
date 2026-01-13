# User Data Definition

## Schema: UserGoal

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| id | number | No (Auto) | Unique Identifier |
| goalType | string | Yes | 'diet', 'bulk', 'maintain' |
| targetWeight | number | No | Target body weight (kg) |
| targetCalories | number | Yes | Daily calorie target |
| targetProtein | number | Yes | Daily protein target (g) |
| targetFat | number | Yes | Daily fat target (g) |
| targetCarbs | number | Yes | Daily carb target (g) |
| startDate | string | Yes | Goal start date (YYYY-MM-DD) |
| targetDate | string | No | Goal target date (YYYY-MM-DD) |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

## Example Data: UserGoal

```json
{
  "id": 1,
  "goalType": "diet",
  "targetWeight": 68.0,
  "targetCalories": 2200,
  "targetProtein": 160,
  "targetFat": 60,
  "targetCarbs": 250,
  "startDate": "2024-01-01",
  "targetDate": "2024-03-31",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Schema: UserSettings

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| id | number | No (Auto) | Unique Identifier |
| oneRmFormula | string | Yes | 'epley', 'brzycki', 'lombardi', 'oconner' |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

## Example Data: UserSettings

```json
{
  "id": 1,
  "oneRmFormula": "epley",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Schema: AnalyticsWindow

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| id | number | No (Auto) | Unique Identifier |
| name | string | Yes | Window name |
| data1 | AnalyticsDataConfig | Yes | Primary data configuration |
| data2 | AnalyticsDataConfig | No | Overlay data configuration |
| periodDays | number | Yes | Display period in days |
| size | string | Yes | '1x1', '2x1', '2x2' |
| order | number | Yes | Display order |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

### Nested: AnalyticsDataConfig

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| dataType | string | Yes | 'weight', 'bodyFat', 'calories', 'totalVolume', etc. |
| exerciseId | number | No | Required if dataType relates to specific exercise |
| exerciseName | string | No | Snapshot of exercise name |
| chartType | string | Yes | 'line' or 'bar' |
| color | string | Yes | Hex color code |

## Example Data: AnalyticsWindow

```json
{
  "id": 1,
  "name": "Weight Trend",
  "data1": {
    "dataType": "weight",
    "chartType": "line",
    "color": "#3b82f6"
  },
  "periodDays": 30,
  "size": "2x1",
  "order": 1,
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```
