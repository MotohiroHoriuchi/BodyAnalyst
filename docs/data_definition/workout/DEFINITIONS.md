# Workout Data Definition

## Schema: ExerciseMaster

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| id | number | No (Auto) | Unique Identifier |
| name | string | Yes | Name of the exercise |
| bodyPart | string | Yes | 'chest', 'back', 'shoulder', 'arm', 'leg', 'core', 'other' |
| isCompound | boolean | Yes | Whether it is a compound movement |
| isCustom | boolean | Yes | Whether added by user |
| createdAt | Date | Yes | Creation timestamp |

## Example Data: ExerciseMaster

```json
{
  "id": 1,
  "name": "Bench Press",
  "bodyPart": "chest",
  "isCompound": true,
  "isCustom": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Schema: WorkoutSession

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| id | number | No (Auto) | Unique Identifier |
| date | string | Yes | Workout date (YYYY-MM-DD) |
| startTime | Date | Yes | Session start time |
| endTime | Date | No | Session end time |
| exercises | WorkoutExercise[] | Yes | List of exercises performed |
| totalVolume | number | Yes | Total volume (weight * reps) |
| memo | string | No | Optional notes |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

### Nested: WorkoutExercise

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| exerciseId | number | Yes | Reference to ExerciseMaster ID |
| exerciseName | string | Yes | Snapshot of exercise name |
| bodyPart | string | Yes | Snapshot of body part |
| sets | WorkoutSet[] | Yes | List of sets |
| restTimes | number[] | Yes | Rest time (seconds) after each set |

### Nested: WorkoutSet

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| setNumber | number | Yes | Order of the set |
| weight | number | Yes | Weight in kg |
| reps | number | Yes | Number of repetitions |
| rpe | number | No | Rate of Perceived Exertion (1-10) |
| isWarmup | boolean | Yes | Whether it is a warmup set |
| completedAt | Date | Yes | Completion timestamp |

## Example Data: WorkoutSession

```json
{
  "id": 201,
  "date": "2024-01-15",
  "startTime": "2024-01-15T18:00:00.000Z",
  "endTime": "2024-01-15T19:30:00.000Z",
  "totalVolume": 8500,
  "memo": "Great chest pump",
  "exercises": [
    {
      "exerciseId": 1,
      "exerciseName": "Bench Press",
      "bodyPart": "chest",
      "restTimes": [180, 180, 180],
      "sets": [
        {
          "setNumber": 1,
          "weight": 60,
          "reps": 10,
          "rpe": 7,
          "isWarmup": true,
          "completedAt": "2024-01-15T18:10:00.000Z"
        },
        {
          "setNumber": 2,
          "weight": 80,
          "reps": 8,
          "rpe": 8,
          "isWarmup": false,
          "completedAt": "2024-01-15T18:15:00.000Z"
        },
        {
          "setNumber": 3,
          "weight": 80,
          "reps": 7,
          "rpe": 9,
          "isWarmup": false,
          "completedAt": "2024-01-15T18:20:00.000Z"
        }
      ]
    }
  ],
  "createdAt": "2024-01-15T18:00:00.000Z",
  "updatedAt": "2024-01-15T19:30:00.000Z"
}
```
