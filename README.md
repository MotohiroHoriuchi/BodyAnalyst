# MySBDCoach

**Break your plateaus. Master the BIG3.**

MySBDCoach is a specialized performance analytics tool for powerlifters and strength enthusiasts focusing on the BIG3 lifts: **Squat, Bench Press, and Deadlift**. 

Unlike general fitness trackers, MySBDCoach analyzes the relationship between your training volume, body weight, nutrition, and recovery to identify exactly why your progress has stalled.

## Core Features

- **1RM Trend Analysis:** Track your estimated 1RM (Squat/Bench/Deadlift) with high-precision charts.
- **Plateau Detection:** Automatic identification of stagnant progress using rule-based analysis.
- **Bottleneck Analysis (Pro):** Correlation ranking of factors (Volume, PFC, Body Weight) to find the cause of plateaus.
- **Rule-Based Action Plans (Pro):** Receive specific, actionable advice (e.g., "Increase calories by 10%") to break your personal records.
- **Minimalist Logging:** Optimized for the gym floor. Log your SBD sets and daily life metrics in seconds.

## Architecture

MySBDCoach follows a **Spec-Driven Development (SDD)** approach. The source of truth resides in the `docs/` directory.

- **Data-Centric Architecture**: Leveraging Google Sheets for user-owned data persistence.
- **Feature-Based Module System**: Decoupled modules for BIG3 Analysis, Training Log, and Life Metrics.

## Project Structure

```
docs/
├── data_definition/    # Data schemas (SBD, Weight, PFC)
├── design/             # UI/UX specifications and prototypes
└── screen_definition/  # Screen layouts and user flows
src/
├── features/           
│   ├── big3/          # Analysis engine & Dashboard
│   ├── training/      # Workout logging
│   └── life/          # Weight & Nutrition
```

## Getting Started

### 1. Documentation First
Always refer to `docs/` before making changes. This project follows strict specification-led implementation.

### 2. Setup
```bash
npm install
cp .env.example .env
# Fill in your Google API credentials
npm run dev
```

## Technology Stack

- **React / TypeScript / Vite**
- **Tailwind CSS** (Monochrome Dark Theme)
- **Recharts** (High-precision performance charts)
- **Google Sheets API** (Data persistence)
