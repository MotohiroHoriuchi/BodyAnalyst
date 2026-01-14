# Screen Definition: Body Composition Record

## 1. Overview
The **Body Composition Record** screen is the dedicated interface for tracking physical metrics. It enables users to log, view, update, and delete body composition data, acting as the primary entry point for weight management features.

## 2. Functional Features

### Data Entry
- **Metric Logging:**
    - **Weight (kg):** Mandatory input.
    - **Body Fat (%):** Optional input.
    - **Muscle Mass (kg):** Optional input.
- **Timestamping:**
    - Records date and time.
    - Defaults to current system time.
    - Supports backdating (historical entry).
- **Contextual Metadata:**
    - **Timing Tags:** Categorizes entries (e.g., "Morning", "Evening", "Post-Workout") for consistent comparison.
    - **Memo:** Optional text field for qualitative notes.

### Data Management
- **History View:** Retrieves and lists past records, sorted by date (newest first).
- **CRUD Operations:**
    - **Update:** Users can edit existing records to correct errors.
    - **Delete:** Users can remove erroneous records.

## 3. Interaction Flow

### Logging Flow
1.  **Entry:** User navigates to the screen.
2.  **Initialization:** Form initializes with "Today" and default fields empty.
3.  **Input:** User enters values for Weight (and optionally others).
4.  **Validation:** System checks if `Weight` > 0.
5.  **Submission:** User triggers the "Save" action.
6.  **Persistence:** System writes the `WeightRecord` to the database.
7.  **Feedback:** System confirms success and either clears the form or redirects.

## 4. Data Requirements

### Read/Write Access
- **Source:** [Weight Data Definition](../../data_definition/weight/DEFINITIONS.md)
- **Entity:** `WeightRecord`

### Validation Rules
- `date`: Must be a valid date object.
- `weight`: Must be a positive number (0.1 - 500.0).
- `bodyFatPercentage`: 0 - 100 range.

## 5. Integration
- **Dashboard Updates:** Saving a record triggers an invalidation/refresh of cached dashboard blocks relying on weight data.
- **Design Reference:** See [Visual Specifications](../../design/body_composition/SPECIFICATIONS.md).