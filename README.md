# BodyAnalyst Prototype v2

This is a complete rewrite of the BodyAnalyst application following the official specifications in `docs/`.

## Architecture

This prototype implements a **data-centric, Google Sheets-based architecture** as specified in the documentation:

### Key Design Decisions

1. **Data Storage**: Google Drive Spreadsheets (user owns the data)
2. **Authentication**: Google OAuth2 (Google Identity Services)
3. **App Type**: Client-side SPA (Single Page Application)
4. **Architecture Style**: Feature-Based Architecture (see ADR 0002)

### Directory Structure

```
src/
├── components/         # Common UI Components
│   └── layout/        # Layout components (MainLayout, etc.)
├── db/                # Data Layer (Infrastructure)
│   ├── interfaces/    # Abstract interfaces (IStorageAdapter)
│   ├── adapters/      # Implementation (GoogleSheetsAdapter)
│   │   └── google_sheets/
│   ├── repositories/  # Domain repositories with caching
│   └── index.ts       # Public API
├── features/          # Feature modules
│   ├── weight/        # Weight tracking module
│   ├── meal/          # Meal tracking module
│   ├── workout/       # Workout tracking module
│   └── analytics/     # Analytics & Visualization Engine
│       └── engine/    # Pure functional transformers
├── pages/             # Route pages
├── types/             # Shared type definitions
└── utils/             # Shared utilities
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google API

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then fill in your Google API credentials:

- `VITE_GOOGLE_CLIENT_ID`: Your OAuth 2.0 Client ID
- `VITE_GOOGLE_API_KEY`: Your API Key
- `VITE_GOOGLE_SPREADSHEET_ID`: Your target spreadsheet ID

### 3. Prepare Google Sheets

Create a new Google Spreadsheet with the following sheets:

- `Weight` - with headers: id, date, weight, bodyFatPercentage, muscleMass, timing, memo, createdAt, updatedAt
- `WorkoutSessions` - with headers: id, date, startTime, endTime, exercises, totalVolume, memo, createdAt, updatedAt
- `ExerciseMaster` - with headers: id, name, bodyPart, isCompound, isCustom, createdAt
- `MealRecords` - with headers: id, date, mealType, items, totalCalories, totalProtein, totalFat, totalCarbs, memo, createdAt, updatedAt
- `FoodMaster` - with headers: id, name, caloriesPer100g, proteinPer100g, fatPer100g, carbsPer100g, isCustom, createdAt

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Technology Stack

- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Styling
- **React Router 7** - Routing
- **Recharts 3** - Charting (planned)
- **date-fns 4** - Date manipulation
- **Lucide React** - Icons
