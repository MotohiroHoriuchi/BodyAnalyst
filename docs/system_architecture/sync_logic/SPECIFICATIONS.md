# Synchronization Logic Specifications

## 1. Overview
BodyAnalyst adopts a **"Local-First"** architecture. User operations are immediately reflected in the local database (Dexie.js) and synchronized with the remote Google Spreadsheet in the background. This ensures full functionality in offline environments and data persistence upon returning online.

## 2. Sync Triggers
Synchronization is executed at the following timings:
1.  **On Change:** Immediately after data creation, update, or deletion in the local repository.
2.  **On Launch:** To check for unsynced data and fetch the latest data from the remote source upon application startup.
3.  **On Online:** When the browser's `online` event is detected.
4.  **Manual:** When the user explicitly triggers synchronization (e.g., via a button in Settings).

## 3. Data Schema for Sync
Each data record (Meals, Workouts, Weight, etc.) includes the following common fields for synchronization management:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | string (UUID) | Unique identifier across devices. Used for identifying rows in the spreadsheet (Upsert key). |
| `updatedAt` | number (Timestamp) | Last update timestamp on the client. Used for conflict resolution. |
| `syncStatus` | string | `'synced'`, `'pending'`, `'error'` |
| `lastSyncedAt` | number (Timestamp) | Timestamp of the last successful sync with the remote (Stored in local DB metadata). |

## 4. Sync Algorithms

### 4.1. Upload Pipeline (Local to Remote)
1.  Extract all records where `syncStatus === 'pending'`.
2.  Call the Google Sheets API processing operations in order from the queue.
3.  The API performs an **Upsert** (Update if exists, Insert if not) based on the `id` key to ensure **Idempotency**.
4.  Upon success, update the local DB's `syncStatus` to `'synced'` and `lastSyncedAt` to the current time.

### 4.2. Download Pipeline (Remote to Local)
1.  **Mode Determination:**
    *   **Full Sync:** If `lastSyncedAt` is `null` (e.g., initial install, cache cleared), fetch ALL valid rows from the spreadsheet and rebuild the local database.
    *   **Incremental Sync:** If `lastSyncedAt` exists, fetch only rows updated after that timestamp.
2.  If an `id` collision occurs between fetched data and local data, invoke the `Conflict Resolver`.

## 5. Conflict Resolution Strategy
The **"Last Write Wins"** strategy is adopted.

1.  Compare the local `updatedAt` with the remote `updatedAt`.
2.  **Local is newer:** Overwrite remote (handled in the next upload cycle).
3.  **Remote is newer:** Update local data with remote content.

## 6. Consistency & Atomicity

### 6.1. Local Transactions
Use Dexie.js `db.transaction()` to execute the following operations atomically:
*   Saving/Updating actual data AND updating `syncStatus` to `'pending'`.
This prevents inconsistencies where data changes but remains unsynchronized.

### 6.2. Idempotency & Recovery
If the API transmission succeeds but the local `syncStatus` update fails (e.g., browser crash), the same data will be resent in the next cycle.
*   **Remote Side:** The Upsert logic handles the resent data as an overwrite of the existing row, preventing duplication.
*   **Local Side:** Retry continues until `syncStatus` is successfully updated, ensuring eventual consistency.

## 7. Error Handling
*   **Network Error:** Retry using Exponential Backoff.
*   **Auth Error (401):** Suspend synchronization and prompt the user to re-login.
*   **Fatal Error:** Set `syncStatus` to `'error'`. Display a warning to the user and offer manual resolution (e.g., retry button).
