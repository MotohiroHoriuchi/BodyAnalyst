# Core Utilities Specifications

## 1. Overview
This document defines general-purpose utility functions located in `src/utils/`. These helpers provide standard behavior for data manipulation, formatting, and calculations throughout the application.

## 2. Utility Definitions

### 2.1. Date Utilities (`dateUtils.ts`)
A wrapper around `date-fns` configured with the Japanese locale (`ja`).

*   **Key Functions:**
    *   `formatDate(date, formatStr)`: Formats date string/object.
    *   `getRelativeDateLabel(date)`: Returns "今日", "昨日", or formatted date.
    *   `getWeekRange(date)` / `getMonthRange(date)`: Returns start/end dates for periods.

### 2.2. Formatters (`formatters.ts`)
Functions for formatting numbers, currency, or specific data types for display.

### 2.3. Calculations (`calculations.ts`)
General mathematical helpers or shared calculation logic (e.g., BMI calculation if not domain-specific enough to reside in a feature module).

## 3. Usage Guidelines
*   Utilities should be pure functions whenever possible.
*   Avoid importing UI components or React hooks into utility files.
