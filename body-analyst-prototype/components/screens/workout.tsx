"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Plus, Check, Clock, Pencil } from "lucide-react"
import { workoutExercises } from "@/lib/dummy-data"
import { cn } from "@/lib/utils"

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

type SetData = {
  set: number
  prevWeight: number
  prevReps: number
  weight: number | null
  reps: number | null
  rpe: number | null
  completed: boolean
}

function SwipeableRow({
  setData,
  onComplete,
  onUpdate,
}: {
  setData: SetData
  onComplete: () => void
  onUpdate: (field: "weight" | "reps" | "rpe", value: number | null) => void
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)
  const [swiping, setSwiping] = useState(false)
  const [swipeX, setSwipeX] = useState(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (setData.completed) return
    startXRef.current = e.touches[0].clientX
    currentXRef.current = 0
    setSwiping(true)
  }, [setData.completed])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swiping) return
    const diff = e.touches[0].clientX - startXRef.current
    const clamped = Math.max(0, Math.min(diff, 120))
    currentXRef.current = clamped
    setSwipeX(clamped)
  }, [swiping])

  const handleTouchEnd = useCallback(() => {
    if (currentXRef.current > 80) {
      onComplete()
    }
    setSwipeX(0)
    setSwiping(false)
  }, [onComplete])

  const handleInputChange = useCallback(
    (field: "weight" | "reps" | "rpe", rawValue: string) => {
      const value = rawValue === "" ? null : parseFloat(rawValue)
      onUpdate(field, value)
    },
    [onUpdate]
  )

  const handleGhostClick = useCallback(
    (field: "weight" | "reps", prevValue: number) => {
      onUpdate(field, prevValue)
    },
    [onUpdate]
  )

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe background */}
      <div
        className={cn(
          "absolute inset-0 flex items-center pl-4 transition-colors",
          swipeX > 80 ? "bg-success/30" : "bg-success/10"
        )}
      >
        <Check className="h-5 w-5 text-success" />
      </div>

      <div
        ref={rowRef}
        className={cn(
          "relative grid grid-cols-[2rem_1fr_1fr_3rem] items-center gap-2 bg-card px-3 py-2.5 transition-transform",
          setData.completed && "opacity-50"
        )}
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Set number */}
        <span className="text-center text-xs font-mono text-muted-foreground">
          {setData.set}
        </span>

        {/* Weight input */}
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            value={setData.weight ?? ""}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            placeholder={String(setData.prevWeight)}
            disabled={setData.completed}
            onClick={() => {
              if (setData.weight === null) {
                handleGhostClick("weight", setData.prevWeight)
              }
            }}
            className="w-full rounded-lg bg-secondary px-3 py-2 text-center text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
            aria-label={`Weight for set ${setData.set}`}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
            kg
          </span>
        </div>

        {/* Reps input */}
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            value={setData.reps ?? ""}
            onChange={(e) => handleInputChange("reps", e.target.value)}
            placeholder={String(setData.prevReps)}
            disabled={setData.completed}
            onClick={() => {
              if (setData.reps === null) {
                handleGhostClick("reps", setData.prevReps)
              }
            }}
            className="w-full rounded-lg bg-secondary px-3 py-2 text-center text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
            aria-label={`Reps for set ${setData.set}`}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
            rps
          </span>
        </div>

        {/* Status */}
        <div className="flex justify-center">
          {setData.completed ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success/20">
              <Check className="h-4 w-4 text-success" />
            </div>
          ) : (
            <button
              onClick={onComplete}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-success hover:text-success"
              aria-label={`Complete set ${setData.set}`}
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function WorkoutScreen() {
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [exercises, setExercises] = useState(workoutExercises)
  const [title, setTitle] = useState("Chest Day")
  const [editingTitle, setEditingTitle] = useState(false)

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  const handleComplete = useCallback(
    (exerciseId: number, setIndex: number) => {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s, i) =>
                  i === setIndex
                    ? {
                        ...s,
                        completed: true,
                        weight: s.weight ?? s.prevWeight,
                        reps: s.reps ?? s.prevReps,
                      }
                    : s
                ),
              }
            : ex
        )
      )
    },
    []
  )

  const handleUpdate = useCallback(
    (
      exerciseId: number,
      setIndex: number,
      field: "weight" | "reps" | "rpe",
      value: number | null
    ) => {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s, i) =>
                  i === setIndex ? { ...s, [field]: value } : s
                ),
              }
            : ex
        )
      )
    },
    []
  )

  const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0)
  const completedSets = exercises.reduce(
    (a, e) => a + e.sets.filter((s) => s.completed).length,
    0
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col gap-1">
          {editingTitle ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
              className="bg-transparent text-xl font-bold text-foreground outline-none"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="flex items-center gap-2 text-xl font-bold text-foreground"
            >
              {title}
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono text-xs">{formatTime(timer)}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {completedSets}/{totalSets} sets
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsRunning(false)}
          className="rounded-2xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Finish
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${totalSets > 0 ? (completedSets / totalSets) * 100 : 0}%` }}
        />
      </div>

      {/* Exercise Cards */}
      {exercises.map((exercise) => (
        <div key={exercise.id} className="rounded-3xl bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            {exercise.name}
          </h3>

          {/* Table header */}
          <div className="mb-1 grid grid-cols-[2rem_1fr_1fr_3rem] gap-2 px-3">
            <span className="text-center text-[10px] text-muted-foreground">Set</span>
            <span className="text-center text-[10px] text-muted-foreground">Weight</span>
            <span className="text-center text-[10px] text-muted-foreground">Reps</span>
            <span className="text-center text-[10px] text-muted-foreground" />
          </div>

          <div className="flex flex-col gap-1">
            {exercise.sets.map((setData, i) => (
              <SwipeableRow
                key={setData.set}
                setData={setData}
                onComplete={() => handleComplete(exercise.id, i)}
                onUpdate={(field, value) =>
                  handleUpdate(exercise.id, i, field, value)
                }
              />
            ))}
          </div>
        </div>
      ))}

      {/* FAB */}
      <button
        className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-95"
        aria-label="Add exercise"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  )
}
