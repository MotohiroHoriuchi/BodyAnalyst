# Core Components Specifications

## 1. Overview
This document defines the reusable UI components located in `src/components/common/`. These components are designed to be domain-agnostic, providing a consistent visual language across the application.

## 2. Component Definitions

### 2.1. Button (`Button.tsx`)
A versatile button component supporting multiple variants and sizes.

*   **Props:**
    *   `variant`: `'primary' | 'secondary' | 'ghost'` (Controls color and emphasis)
    *   `size`: `'sm' | 'md' | 'lg'`
    *   `fullWidth`: `boolean` (If true, takes up 100% of container width)
    *   `onClick`: `() => void`
    *   `disabled`: `boolean`
    *   `type`: `'button' | 'submit'`

### 2.2. Card (`Card.tsx`)
A container component with standard styling (background, shadow, border radius).

*   **Props:**
    *   `padding`: `'sm' | 'md' | 'lg'` (Controls internal spacing)
    *   `onClick`: `() => void` (If provided, applies hover effects and interactive cursor)

### 2.3. Structural Components
*   **Header (`Header.tsx`)**: Application top bar.
*   **BottomNav (`BottomNav.tsx`)**: Mobile-first navigation bar.
*   **Drawer (`Drawer.tsx`)**: Side menu or overlay panel.
*   **Modal (`Modal.tsx`)**: Dialog overlay for critical actions or forms.

### 2.4. Input & Feedback
*   **DateSelector (`DateSelector.tsx`)**: UI for picking dates (often wraps native inputs or custom logic).
*   **NumberStepper (`NumberStepper.tsx`)**: Input for incrementing/decrementing values.
*   **CircularProgress (`CircularProgress.tsx`)**: Loading or progress indication.
*   **EmptyState (`EmptyState.tsx`)**: Placeholder UI when no data is available.

## 3. Usage Guidelines
*   Components should not contain business logic specific to a single feature (e.g., "Add Workout Logic").
*   Styles should primarily use Tailwind CSS classes.
