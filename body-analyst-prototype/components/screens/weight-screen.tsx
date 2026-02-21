"use client"

import { useState } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { weightHistory } from "@/lib/dummy-data"
import { AnimatedNumber } from "@/components/animated-number"
import { cn } from "@/lib/utils"

export function WeightScreen() {
  const [weight, setWeight] = useState("72.5")
  const [bodyFat, setBodyFat] = useState("14.2")
  const [muscle, setMuscle] = useState("33.1")

  const latestWeight = parseFloat(weight) || 0
  const prevWeight = weightHistory[1]?.weight ?? 0
  const diff = latestWeight - prevWeight
  const isDown = diff < 0

  return (
    <div className="flex flex-col gap-4">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-card px-6 py-8">
        {/* Weight input */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-muted-foreground">Body Weight</p>
          <div className="flex items-baseline gap-2">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-36 bg-transparent text-center text-5xl font-bold text-foreground outline-none"
              aria-label="Body weight in kilograms"
            />
            <span className="text-lg text-muted-foreground">kg</span>
          </div>
          {/* Trend */}
          <div
            className={cn(
              "mt-1 flex items-center gap-1 text-sm",
              isDown ? "text-success" : "text-destructive/80"
            )}
          >
            {isDown ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            <span className="font-mono">
              {isDown ? "" : "+"}
              {diff.toFixed(1)}kg
            </span>
          </div>
        </div>

        {/* Secondary inputs */}
        <div className="flex w-full gap-4">
          <div className="flex flex-1 flex-col items-center rounded-2xl bg-secondary/50 px-4 py-3">
            <p className="mb-1 text-[10px] text-muted-foreground">Body Fat</p>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-16 bg-transparent text-center text-lg font-semibold text-foreground outline-none"
                aria-label="Body fat percentage"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center rounded-2xl bg-secondary/50 px-4 py-3">
            <p className="mb-1 text-[10px] text-muted-foreground">Muscle Mass</p>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={muscle}
                onChange={(e) => setMuscle(e.target.value)}
                className="w-16 bg-transparent text-center text-lg font-semibold text-foreground outline-none"
                aria-label="Muscle mass in kilograms"
              />
              <span className="text-xs text-muted-foreground">kg</span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80">
          Save Entry
        </button>
      </div>

      {/* History */}
      <div className="rounded-3xl bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">History</h3>
        <div className="flex flex-col gap-1">
          {weightHistory.map((entry, i) => {
            const prevEntry = weightHistory[i + 1]
            const entryDiff = prevEntry
              ? entry.weight - prevEntry.weight
              : 0
            const entryDown = entryDiff < 0

            return (
              <div
                key={entry.date}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/40"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-foreground">
                    {entry.weight.toFixed(1)} kg
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    BF: {entry.bodyFat}% / M: {entry.muscle}kg
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">
                    {entry.date}
                  </span>
                  {prevEntry && (
                    <span
                      className={cn(
                        "text-[10px] font-mono",
                        entryDown
                          ? "text-success"
                          : entryDiff > 0
                            ? "text-destructive/80"
                            : "text-muted-foreground"
                      )}
                    >
                      {entryDown ? "" : "+"}
                      {entryDiff.toFixed(1)}kg
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
