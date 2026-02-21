# Screen Specification: BIG3 (Main Dashboard)

## Overview
The central hub of MySBDCoach. Displays the current status of the BIG3 lifts and provides in-depth analysis of progress and plateaus.

## Layout Components

### 1. Header
- App Title: "MySBDCoach"
- Active Weekly Summary: Total Volume change % compared to last week.

### 2. BIG3 Lift Cards (Squat, Bench Press, Deadlift)
- **Status Badge:** 
    - `🔥 Progressing`: If 1RM trend is positive over the last 2 weeks.
    - `⚠️ Plateaued`: If 1RM trend is stagnant or negative for 3+ sessions.
- **Estimated 1RM:** Large numerical display (e.g., "150.0 kg").
- **Weekly Delta:** e.g., "+2.5kg" or "-1.0kg".
- **Interaction:** Tap to open **Detailed Analysis Modal**.

### 3. Detailed Analysis (Modal/Expansion)
- **1RM Trend Chart:** Line chart showing the highest estimated 1RM per session over time.
- **Factor Correlation Ranking (Paid):**
    - Ranking of factors affecting the lift (Volume, Body Weight, Protein, Rest Days).
    - Uses rule-based scoring (e.g., "Protein correlation: 0.85 - High Impact").
- **AI Action Plan (Paid):**
    - Rule-based suggestion: "Your weight has decreased by 1kg; this is the likely cause of the Bench Press plateau. Increase calories by 200kcal."

## User Actions
- View BIG3 status.
- Analyze individual lift trends.
- Receive improvement suggestions.
