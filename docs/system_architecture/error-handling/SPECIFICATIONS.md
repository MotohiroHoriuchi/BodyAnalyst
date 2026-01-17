# Error Handling Specifications

## 1. Overview
The goal is to provide consistent error handling across the application to improve user experience (clear feedback) and maintainability (easier debugging).

## 2. Error Classifications and Handling Policies

| Error Type | Description | User Notification | Action |
| :--- | :--- | :--- | :--- |
| **Validation Error** | Invalid user input | Inline messages | Prompt user for correction |
| **API/DB Error** | Data fetching or saving failure | Toast notification / Empty State | Provide retry button or auto-retry |
| **Auth Error** | Session expired, lack of permission | Dialog / Redirect to login | Guide to re-login |
| **Unexpected Runtime Error** | JS exceptions, component crashes | Error Boundary (Global/Local) | Reload app or contact support |
| **Network Error** | Offline status | Banner notification | Wait for connectivity |

## 3. Handling in Component Hierarchy (React)

### 3.1. Global Error Boundary
Placed at the top level in `src/App.tsx`. Displays a fallback screen if the entire application crashes.

### 3.2. Local Error Boundary
Wrapped around independent functional units (e.g., dashboard cards, charts). Ensures that a failure in one component doesn't break the entire page.

## 4. Notification Interfaces

-   **Toast:** Notifies failure of asynchronous operations (e.g., saving). Dismisses automatically.
-   **Inline Error:** Displayed directly under form input fields.
-   **Modal/Dialog:** Used for critical errors requiring user intervention (e.g., potential data loss).

## 5. Implementation Standards

-   **Custom Error Classes:** Create an `AppError` class to encapsulate error codes and user-friendly messages.
-   **Async Handling:** Catch errors in `try-catch` blocks and propagate error states via Hooks to the UI.
-   **Logging:** Use `console.error` in development. Consider integrating external services like Sentry in the future.
