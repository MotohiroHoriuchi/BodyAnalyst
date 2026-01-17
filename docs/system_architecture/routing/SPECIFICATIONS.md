# Routing Specifications

## 1. Overview
The application uses a client-side routing approach to provide a smooth, single-page application (SPA) experience. It manages navigation between the main functional areas: Dashboard, Meals, Workout, Analytics, and Settings.

## 2. Technology Stack
*   **Library:** React Router
*   **Mode:** Browser History API

## 3. Route Definitions

| Path | Component | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | `Home` | Dashboard (Overview of today's progress) | Public |
| `/meals` | `Meals` | Meal tracking and history | Public |
| `/workout` | `Workout` | Workout session logging and history | Public |
| `/analytics` | `Analytics` | Detailed charts and data analysis | Public |
| `/settings` | `Settings` | User profile, goals, and app settings | Public |

## 4. Navigation Flow

### 4.1. Main Navigation (Bottom Navigation)
On mobile devices (primary target), a Bottom Navigation bar allows quick switching between:
*   Home (`/`)
*   Meals (`/meals`)
*   Workout (`/workout`)
*   Analytics (`/analytics`)
*   Settings (`/settings`)

### 4.2. Deep Linking & Modals
While main screens are handled via routes, specific actions like "Add Meal" or "Edit Workout" are handled via **Modals** to maintain context and minimize page reloads.

## 5. Route Guards & Redirection
*   **Catch-all Route:** Any undefined path redirects to the Dashboard (`/`).
*   **Onboarding:** Users who haven't set up their profile may be redirected to the Settings/Onboarding flow (TBD).

## 6. Implementation Notes
*   Routing logic is centralized in `src/App.tsx`.
*   Navigation links use React Router's `NavLink` or `Link` components to avoid full page refreshes.
