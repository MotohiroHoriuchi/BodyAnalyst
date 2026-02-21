import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { mealData } from "@/lib/dummy-data"
import { AnimatedNumber } from "@/components/AnimatedNumber"

function MacroBar({
  label,
  current,
  target,
  color,
}: {
  label: string
  current: number
  target: number
  color: string
}) {
  const pct = Math.min((current / target) * 100, 100)
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-right text-[10px] font-medium text-muted-foreground">
        {label}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-16 text-right text-[10px] text-muted-foreground">
        {current}/{target}g
      </span>
    </div>
  )
}

function MealSection({
  title,
  items,
}: {
  title: string
  items: { name: string; cal: number; protein: number; fat: number; carbs: number }[]
}) {
  return (
    <div className="rounded-3xl bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      {items.length > 0 ? (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2.5">
              <div>
                <p className="text-sm text-foreground">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  P: {item.protein}g / F: {item.fat}g / C: {item.carbs}g
                </p>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {item.cal}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/60">No items logged</p>
      )}
      <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary">
        <Plus className="h-3.5 w-3.5" />
        Add Food
      </button>
    </div>
  )
}

export function MealPage() {
  const [dateOffset, setDateOffset] = useState(0)
  const { target, current, meals } = mealData

  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + dateOffset)
  const dateStr = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const calPct = Math.min((current.calories / target.calories) * 100, 100)

  return (
    <div className="flex flex-col gap-4">
      {/* Date Navigator */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => setDateOffset((d) => d - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-card text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-sm font-semibold text-foreground">{dateStr}</h2>
        <button
          onClick={() => setDateOffset((d) => d + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-card text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calorie Summary */}
      <div className="rounded-3xl bg-card p-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Calories</p>
            <div className="flex items-baseline gap-1">
              <AnimatedNumber
                value={current.calories}
                decimals={0}
                className="text-2xl font-bold text-foreground"
              />
              <span className="text-sm text-muted-foreground">
                / {target.calories}
              </span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(calPct)}%
          </span>
        </div>

        {/* Main calorie bar */}
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${calPct}%` }}
          />
        </div>

        {/* PFC bars */}
        <div className="flex flex-col gap-2">
          <MacroBar label="P" current={current.protein} target={target.protein} color="#94a3b8" />
          <MacroBar label="F" current={current.fat} target={target.fat} color="#64748b" />
          <MacroBar label="C" current={current.carbs} target={target.carbs} color="#475569" />
        </div>
      </div>

      {/* Meal Sections */}
      <MealSection title="Breakfast" items={meals.breakfast} />
      <MealSection title="Lunch" items={meals.lunch} />
      <MealSection title="Dinner" items={meals.dinner} />
      <MealSection title="Snack" items={meals.snack} />
    </div>
  )
}
