# Core Module Specifications

## 1. Overview
The Core Module provides foundational building blocks for the BodyAnalyst application. It encompasses reusable UI components and general-purpose utility functions. Its primary goal is to ensure visual consistency across the application and to accelerate development by providing robust, tested primitives.

## 2. Directory Structure

```
src/
├── components/
│   └── common/           # Reusable UI Components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── ...
│       └── index.ts      # Public API for UI components
└── utils/                # General Utilities
    ├── dateUtils.ts      # Date manipulation
    ├── formatters.ts     # Data formatting
    └── ...
```

## 3. Sub-Specifications

Detailed specifications for components and utilities are maintained in separate documents:

*   **[UI Components Specification](./components/SPECIFICATIONS.md)**
    *   Defines reusable UI elements like Buttons, Cards, Modals, etc.
    *   Located in: `src/components/common/`

*   **[Utilities Specification](./utils/SPECIFICATIONS.md)**
    *   Defines helper functions for date manipulation, formatting, etc.
    *   Located in: `src/utils/`

## 4. Dependencies
*   **React**: Core library.
*   **Tailwind CSS**: For styling all components.
*   **date-fns**: For date manipulation logic.