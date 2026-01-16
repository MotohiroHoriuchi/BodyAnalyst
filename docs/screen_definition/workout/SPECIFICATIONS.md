# Screen Definition: Workout Record

## 1. Overview
The **Workout Record** screen is the dedicated interface for logging strength training and physical exercises. It is designed to efficiently track "which exercise" was performed at "what intensity" (weight/reps), supporting the user's journey of Progressive Overload.

## 2. Functional Requirements

### Session Management
- **Start/End Session:**
    - Initiates a new `WorkoutSession` upon entry.
    - Finalizes the session upon "Finish Workout", calculating total volume and duration.
- **Timestamping:**
    - Defaults to current date/time.
    - Supports backdating for historical logs.
- **Session Memo:** Text field for recording overall condition or notes.

### Exercise Management
- **Add Exercise:**
    - Search and select from `ExerciseMaster`.
    - Filter by body part (Chest, Back, Legs, etc.).
- **Custom Exercise:**
    - Create and register new exercises not present in the master list.

### Set Tracking
- **Input Fields (Per Set):**
    - **Weight (kg):** Required. Supports copying from previous sets/history.
    - **Reps:** Required.
    - **RPE (Rate of Perceived Exertion):** Optional (1-10 scale).
    - **Warm-up Flag:** Excludes the set from max calculations or specific volume metrics.
- **Set Operations:**
    - Add, delete, and duplicate sets.
    - **Completion Check:** Marking a set as complete triggers the Rest Timer.

### Assistive Features
- **RPE Explanation:**
    - Provides a help button or tooltip (e.g., "?") to explain the concept of RPE (Rating of Perceived Exertion).
    - Explanation includes a guide for beginners: RPE 10 (no more reps possible), RPE 9 (1 more rep possible), RPE 8 (2 more reps possible), etc.
    - Emphasizes that strict accuracy isn't required and advises against hitting RPE 9-10 in daily training.
- **History Reference:**
    - Displays the last ~5 logs for the currently selected exercise to aid in weight selection.
- **1RM Calculator:**
    - Real-time display of estimated 1RM based on current weight/rep input.
- **Rest Timer:**
    - Automatically starts upon set completion.
    - Configurable duration (e.g., 90s, 3min).
    - In-app alerts upon completion.

## 3. Data Requirements

### Entities
- **Source:** [Workout Data Definition](../../data_definition/workout/DEFINITIONS.md)
- **Primary:** `WorkoutSession` -> `WorkoutExercise` -> `WorkoutSet`
- **Reference:** `ExerciseMaster`

### ValidationRules
- Weight and Reps must be positive numbers.
- A valid session must contain at least one exercise.

## 4. Interaction Flow
1.  **Entry:** User taps "Start Workout" from Dashboard.
2.  **Selection:** User selects the first exercise via modal.
3.  **Logging:** User inputs sets (Weight/Reps) and checks them off.
4.  **Expansion:** User adds more exercises as needed.
5.  **Completion:** User taps "Finish", saves data, and returns to Dashboard.

## 5. Related Documents
- [Visual Specifications](../../design/workout/SPECIFICATIONS.md)
