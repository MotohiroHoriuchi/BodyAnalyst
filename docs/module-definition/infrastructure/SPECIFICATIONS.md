# Infrastructure Layer Specifications

## 1. Overview
The Infrastructure Layer is responsible for communication between the application and external data stores (currently Google Sheets) and for data persistence.
By adopting the **Repository Pattern** and **Adapter Pattern**, it hides the implementation details of the data store from the domain layer and ensures extensibility for future data source changes.

## 2. Directory Structure

```
src/db/
├── interfaces/          # Abstracted interface definitions
│   ├── IStorageAdapter.ts   # Common interface for data store operations
│   └── IRepository.ts       # (Optional) Common base interface for repositories
├── adapters/            # Implementations for specific data sources
│   └── google_sheets/
│       ├── GoogleSheetsAdapter.ts  # Implementation of IStorageAdapter
│       ├── auth.ts                 # OAuth2 token management
│       └── mapper.ts               # Type conversion for API responses
├── repositories/        # Domain-specific repository implementations
│   ├── BaseRepository.ts    # Base class containing cache logic
│   ├── WeightRepository.ts
│   ├── WorkoutRepository.ts
│   └── MealRepository.ts
└── index.ts             # Entry point for public APIs
```

## 3. Key Components & Responsibilities

### 3.1 Storage Adapter (Abstracted)
Defines an interface and implementation to abstract the data source.

*   **Interface: `IStorageAdapter`**
    *   Defines CRUD methods independent of specific technologies (e.g., Google Sheets API).
    *   `read(collection: string, query?: any): Promise<any[]>`
    *   `create(collection: string, data: any): Promise<string>` (returns ID)
    *   `update(collection: string, id: string, data: any): Promise<void>`
    *   `delete(collection: string, id: string): Promise<void>`
    *   *(Note: For Google Sheets, `collection` corresponds to the sheet name)*

*   **Implementation: `GoogleSheetsAdapter`**
    *   Implements `IStorageAdapter` and internally calls Google Sheets API v4.
    *   Manages authentication tokens internally, ensuring they do not leak outside the interface.

### 3.2 Repositories & Caching
Performs read/write operations on domain objects using the Adapter and caches data for performance.

*   **BaseRepository / Cache Logic**
    *   **In-Memory Caching:** Retains data in memory once fetched to reduce network calls on subsequent requests.
    *   **Cache Invalidation:** Invalidates or updates relevant cache entries when `create`, `update`, or `delete` operations are performed to maintain data consistency.
    *   **Force Refresh:** Provides an option to explicitly fetch the latest data.

*   **Domain Repositories (Weight, Workout, etc.)**
    *   Receives `IStorageAdapter` via constructor (Dependency Injection).
    *   **Mapping:** Converts generic data formats (arrays/JSON) returned from the Adapter into strongly-typed domain entities (e.g., `WeightRecord`).

## 4. Public Interfaces

Each repository provides methods tailored to the domain's characteristics.

**Example: WeightRepository**
```typescript
class WeightRepository {
  constructor(private adapter: IStorageAdapter) {}

  // Fetch all records (Cache preferred)
  async getAll(): Promise<WeightRecord[]> { ... }

  // Fetch by date range
  async findByDateRange(start: Date, end: Date): Promise<WeightRecord[]> { ... }

  // Save new record (includes cache update)
  async save(record: WeightRecord): Promise<void> { ... }
}
```

## 5. TDD Test Case Scenarios

### 5.1 External API Integration Test (Risk Verification)
**Target:** `GoogleSheetsAdapter` (Real API Connection)
*   **[Critical] Connectivity Check:**
    *   Verify that the application can successfully authenticate and establish a connection with a test Google Sheet using a valid OAuth token.
*   **[Critical] Read/Write Verification:**
    *   Write a test row to a temporary sheet.
    *   Immediately read the row back and verify the content matches.
    *   Delete the test row and verify it is gone.
    *   *Note: These tests require real network access and valid credentials. They should be run selectively (e.g., manual trigger or specific CI pipeline).*

### 5.2 GoogleSheetsAdapter (Unit Test / Mocking API)
*   **[Contract] Interface Compliance:**
    *   Verify that all methods defined in `IStorageAdapter` are implemented.
*   **[Normal] CRUD Operations:**
    *   Verify that `create` adds data that can be retrieved by a subsequent `read` (using Mock API).
    *   Verify that `delete` removes data so it is no longer returned by `read`.

### 5.3 Repository & Caching (Unit Test)
*   **[Normal] Mapping:**
    *   Verify that raw data (e.g., arrays) from the Adapter is correctly converted into domain objects.
*   **[Normal] Cache Behavior:**
    *   Verify that the Adapter's `read` method is called on the first `getAll()` invocation.
    *   Verify that the Adapter's `read` method is **NOT** called on the second `getAll()` invocation (Cache Hit).
*   **[Normal] Cache Invalidation:**
    *   Verify that calling `save()` triggers a re-fetch (or cache update) on the next `getAll()`.
