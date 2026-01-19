# Testing Specifications

## 1. Overview
The primary goal of the testing strategy is to ensure **Data Accuracy** and **Persistence Reliability**. In an application where user motivation depends on long-term data tracking, any data loss is considered a critical failure. This strategy prioritizes the verification of synchronization logic between local storage (Dexie.js) and cloud storage (Google Sheets).

## 2. Test Stack

### 2.1. Logic & Component Validation
*   **Vitest:** The primary test runner for unit and integration tests. Chosen for its speed and native integration with the Vite build tool.
*   **React Testing Library:** Used for testing UI components from the user's perspective.

### 2.2. E2E & UI Validation
*   **Playwright:** Used for End-to-End (E2E) testing in real browser environments. Crucial for verifying PWA features (Service Workers, offline caching) and the complete data persistence flow.
*   **Playwright MCP (Model Context Protocol):**
    *   Leverages AI agents to create and maintain test scenarios using natural language.
    *   Reduces the maintenance burden of E2E tests and enables complex scenario testing (e.g., "log data while offline and verify sync after reconnecting").

## 3. Testing Layers

### 3.1. Sync Logic Tests (Highest Priority)
Ensures data consistency between local cache and cloud storage.
*   **Scope:** `src/features/sync/` (Sync Manager, Conflict Resolution logic).
*   **Verification Points:**
    *   **Differential Sync:** Only new or modified local data is extracted and sent to the API.
    *   **Conflict Resolution:** Resolving discrepancies between server and local data based on defined rules (e.g., Last Write Wins).
    *   **Resilience:** Verifying that data remains in the local retry queue during network failures or API timeouts.

### 3.2. Data Access Layer (Local DB)
Ensures the reliability of the local IndexedDB.
*   **Scope:** `src/db/` (Dexie.js schemas and CRUD operations).
*   **Verification Points:**
    *   Successful CRUD operations using an in-memory database during tests.
    *   **Migration Testing:** Ensuring existing data remains intact when the database schema is updated.

### 3.3. E2E User Flows
Validates the system as a whole from the user's perspective.
*   **Scenario Examples:**
    *   **Persistence:** Log a meal -> Reload app -> Verify data is still present.
    *   **Offline Experience:** Toggle offline mode -> Log workout -> Toggle online -> Verify data successfully synced to the cloud.
    *   **Responsive UI:** Visual regression checks across different device sizes (mobile vs. desktop).

## 4. Data Loss Prevention Policies

1.  **Exhaustive Sync Unit Testing:** Every edge case in the synchronization state machine (offline, partial failure, auth expiration) must be covered by automated unit tests.
2.  **Service Worker Verification:** Use Playwright to ensure the Service Worker correctly intercepts requests and provides offline support as defined in the PWA specifications.
3.  **Cloud Integration Verification:** Maintain a dedicated "Test Google Spreadsheet" to verify actual API writes during integration test suites, ensuring the cloud backup is functional.
