# v0.dev Prompt: MySBDCoach Prototype

**Goal:** Create a high-fidelity, functional React prototype for a specialized fitness tracking application named "MySBDCoach".
**Theme:** "Hardcore Analytic Dark Mode" with a focus on precision and performance.
**Core Concept:** A "Plateau-Breaker" for the BIG3 (Squat, Bench Press, Deadlift). Shift focus from general fitness to **1RM progression and bottleneck analysis**.

## Tech Stack & Libraries
*   **Framework:** React
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Charts:** Recharts (Essential for 1RM Trends and Correlation Analysis)
*   **Components:** Shadcn UI

## Design System

1.  **Color Palette (Monochrome & Performance):**
    *   **Background:** True Black (`#000000`).
    *   **Surface/Cards:** Dark Zinc (`bg-zinc-900/50`).
    *   **Accent:** High-contrast White or a sharp Electric Blue for key metrics.
    *   **Status Colors (Low Saturation):**
        *   *Progressing:* Muted Emerald (`text-emerald-400/80`).
        *   *Plateaued:* Muted Orange/Amber (`text-amber-400/80`).

2.  **Typography:**
    *   Mono-spaced fonts for numerical data (Weight, Reps) to emphasize "data-driven" feel.
    *   Bold, large headings for 1RM numbers.

3.  **Navigation:**
    *   **Fixed Bottom Navigation Bar (4 Tabs):**
        *   **BIG3** (Home/Analysis)
        *   **Training** (Log)
        *   **Life** (Weight & Nutrition)
        *   **Settings**

---

## Screen Requirements

### 1. BIG3 (The Coach's Dashboard)
*   **Concept:** "Status at a Glance".
*   **Header:** "MySBDCoach" logo + Weekly Summary.
*   **Main Content (3 Large Cards):**
    *   **Squat / Bench Press / Deadlift Cards:**
        *   **Header:** Lift Name + Status Badge (e.g., "🔥 Breaking Records" or "⚠️ Plateaued").
        *   **Primary Metric:** Estimated 1RM (e.g., "142.5 kg").
        *   **Secondary Metric:** Weekly Delta (e.g., "+2.5kg").
        *   **Quick Insight (Paid Feature Placeholder):** "Estimated Cause: Low Volume" or "Recovery Debt".
    *   **Interaction:** Tapping a card opens a **Detailed Analysis View**:
        *   **Graph:** 1RM Trend Line over time.
        *   **Cause Ranking (Paid Feature):** A list of factors (Volume, Body Weight, Protein Intake, Frequency) ranked by correlation score.
        *   **AI Suggestion (Paid Feature):** Rule-based action (e.g., "Increase Squat volume by 10% next week to break the plateau").

### 2. Training (Workout Log)
*   **Focus:** Speed and BIG3 emphasis.
*   **Structure:**
    *   List of exercises with Sets, Weight, Reps, and RPE.
    *   BIG3 exercises are highlighted or pinned at the top.
    *   **Input UX:** Large, thumb-friendly numeric inputs. "Copy Previous Set" button.

### 3. Life (Simple Metrics)
*   **Focus:** Core physiological data.
*   **Content:**
    *   **Weight Entry:** Massive input for today's body weight.
    *   **Nutrition Entry:** 4 simple fields: Total Calories, Protein, Fat, Carbs (PFC).
    *   **UI:** Minimalist cards. No complex food searching; users enter total numbers (usually from another app or self-calculation).

### 4. Settings
*   **Content:**
    *   User Profile (Experience level, Body weight target).
    *   Goal Setting (Specific 1RM targets for SBD).
    *   Subscription Management (Unlock Analysis/Suggestions).

---

## Interactive Elements
*   **Animations:** Smooth transitions between the BIG3 dashboard and detailed analysis.
*   **Data:** Use realistic SBD progression data, showing a clear plateau being broken by an increase in caloric intake or volume.
