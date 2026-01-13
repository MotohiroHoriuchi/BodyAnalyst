# BodyAnalyst Project Guide

## Project Overview
BodyAnalyst is a data-centric application focused on simple recording and flexible visualization of training data.
The core value proposition is enabling users to visualize their training data in their preferred format.

### Key Architecture Decisions
- **Data Storage:** Google Drive Spreadsheets (User owns the data).
- **Authentication:** Google OAuth2 (Google Identity Services).
- **App Type:** Client-side heavy web application (Single Page Application).

## Development Guidelines

### Workflow
- **Git Worktree:** MUST be used for all development tasks to ensure clean context switching and isolation.
- **Spec-Driven Development (SDD):** All features must be defined in `docs/SPECIFICATION.md` (or equivalent) before implementation.
- **Test-Driven Development (TDD):** Tests must be written before the implementation code.

### Tech Stack (Official Version)
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui (assumed based on prototype preference)
- **State Management:** Zustand (or React Context)
- **Data Layer:** Google Sheets API v4
- **Testing:** Vitest, React Testing Library
- **Linting/Formatting:** ESLint, Prettier

## Commands

### Development
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run test`: Run tests (Vitest)
- `npm run lint`: Run linting

### Git Worktree Cheatsheet
- `git worktree add ../<branch-name> <branch-name>`: Create a new worktree
- `git worktree list`: List worktrees
- `git worktree remove <path>`: Remove a worktree
- `git worktree prune`: Prune stale worktree information

## Directory Structure (Planned)
```
src/
├── api/          # Google Sheets API integration
├── auth/         # Google OAuth2 logic
├── components/   # UI Components
├── domain/       # Domain logic (Workout, Meal, Weight models)
├── hooks/        # Custom React Hooks
├── pages/        # Route pages
└── utils/        # Helper functions
```

## Domain Concepts
- **Workouts:** Exercises, Sets, Reps, Weight, RPE, Rest times.
- **Meals:** PFC (Protein, Fat, Carbs) tracking, Calories, Ingredients.
- **Weight:** Daily weight logs, Body fat percentage.
- **Visualization:** Flexible charting (Line, Bar, Pie) based on user configuration.

## Documentation
- **Specs:** `docs/SPECIFICATION.md` (and others in `docs/`) are the source of truth for features.
- **ADRs:** `docs/system_architecture/ADR*.md` record architectural decisions. They are for historical context and do not need to be actively consulted for every task unless relevant to an architectural change.

## Transition from Prototype
The current codebase in `src/` is a prototype using Dexie.js (IndexedDB).
**The Official Version will discard this implementation.**
- **Action:** New development will start from scratch.
- **Reference:** The prototype serves as a visual and functional reference for the domain model, but not for the data layer.