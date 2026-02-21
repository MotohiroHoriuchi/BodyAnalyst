"use client"

import { useState, useEffect, useMemo } from "react"
import { Pencil, Plus, X } from "lucide-react"
import {
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import {
  goalTrajectoryData,
  frequencyGainsData,
  volumeIntensityData,
  performanceTags,
} from "@/lib/dummy-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

function WidgetCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-3xl bg-card p-5 ${className}`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

function GoalTrajectoryChart() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return <div className="h-[200px]" />

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={goalTrajectoryData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} domain={[50, 105]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            fontSize: 12,
            color: "#fafafa",
          }}
          labelStyle={{ color: "#a1a1aa" }}
          itemStyle={{ color: "#fafafa" }}
        />
        <ReferenceLine y={100} stroke="#64748b" strokeDasharray="8 4" strokeWidth={2} label={{ value: "Goal: 100kg", position: "right", fill: "#64748b", fontSize: 10 }} />
        <Line type="monotone" dataKey="actual" stroke="#fafafa" strokeWidth={2} dot={{ r: 3, fill: "#fafafa" }} connectNulls={false} animationDuration={1500} />
        <Line type="monotone" dataKey="projected" stroke="#64748b" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3, fill: "#64748b", strokeDasharray: "0" }} connectNulls={false} animationDuration={1500} animationBegin={800} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

function FrequencyGainsChart() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return <div className="h-[180px]" />

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ScatterChart margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="restDays"
          name="Rest Days"
          tick={{ fontSize: 10, fill: "#71717a" }}
          tickLine={false}
          axisLine={false}
          label={{ value: "Days Rested", position: "bottom", offset: -5, fontSize: 10, fill: "#71717a" }}
        />
        <YAxis
          dataKey="gain"
          name="Gain (kg)"
          tick={{ fontSize: 10, fill: "#71717a" }}
          tickLine={false}
          axisLine={false}
          label={{ value: "Gain (kg)", angle: -90, position: "insideLeft", offset: 25, fontSize: 10, fill: "#71717a" }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: "#3f3f46" }}
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            fontSize: 12,
            color: "#fafafa",
          }}
          labelStyle={{ color: "#a1a1aa" }}
          itemStyle={{ color: "#fafafa" }}
        />
        <Scatter data={frequencyGainsData} fill="#94a3b8" animationDuration={1200} animationBegin={400} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

function VolumeIntensityChart() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return <div className="h-[180px]" />

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ScatterChart margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="volume"
          name="Volume"
          tick={{ fontSize: 10, fill: "#71717a" }}
          tickLine={false}
          axisLine={false}
          label={{ value: "Total Volume", position: "bottom", offset: -5, fontSize: 10, fill: "#71717a" }}
        />
        <YAxis
          dataKey="maxWeight"
          name="Max Weight"
          tick={{ fontSize: 10, fill: "#71717a" }}
          tickLine={false}
          axisLine={false}
          label={{ value: "Max Weight", angle: -90, position: "insideLeft", offset: 25, fontSize: 10, fill: "#71717a" }}
        />
        <ZAxis dataKey="rpe" range={[100, 600]} name="RPE" />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: "#3f3f46" }}
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            fontSize: 12,
            color: "#fafafa",
          }}
          labelStyle={{ color: "#a1a1aa" }}
          itemStyle={{ color: "#fafafa" }}
        />
        <Scatter data={volumeIntensityData} fill="#64748b" fillOpacity={0.7} animationDuration={1200} animationBegin={600} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

function PerformanceNebula() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const positioned = useMemo(() => {
    return performanceTags.map((tag, i) => {
      const angle = (i / performanceTags.length) * Math.PI * 2
      const distance = (1 - tag.score) * 42 + 5
      const x = Math.round((50 + Math.cos(angle) * distance) * 100) / 100
      const y = Math.round((50 + Math.sin(angle) * distance) * 100) / 100
      return { ...tag, x, y, delay: i * 0.3 }
    })
  }, [])

  return (
    <div className="relative h-[180px] w-full overflow-hidden rounded-2xl">
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-xl" />
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/60" />

      {mounted &&
        positioned.map((tag) => (
          <div
            key={tag.label}
            className="animate-float absolute"
            style={{
              left: `${tag.x}%`,
              top: `${tag.y}%`,
              transform: "translate(-50%, -50%)",
              animationDelay: `${tag.delay}s`,
              animationDuration: `${4 + tag.delay}s`,
            }}
          >
            <span
              className="whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-medium"
              style={{
                backgroundColor:
                  tag.score > 0.6
                    ? "rgba(100, 116, 139, 0.25)"
                    : "rgba(239, 68, 68, 0.15)",
                color: tag.score > 0.6 ? "#cbd5e1" : "#f87171",
              }}
            >
              {tag.label}
            </span>
          </div>
        ))}
    </div>
  )
}

function CreateAnalysisModal() {
  const [metricA, setMetricA] = useState("")
  const [metricB, setMetricB] = useState("")

  const metrics = [
    "Body Weight",
    "Bench Press 1RM",
    "Squat 1RM",
    "Sleep Hours",
    "Calories Intake",
    "Protein Intake",
    "Training Volume",
    "Rest Days",
    "Caffeine",
    "Steps",
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full rounded-2xl bg-primary/20 text-primary-foreground hover:bg-primary/30">
          <Plus className="mr-2 h-4 w-4" />
          Create New Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl border-border bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Custom Analysis</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select two metrics to compare and generate a correlation chart.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Metric A (X-Axis)
            </label>
            <Select value={metricA} onValueChange={setMetricA}>
              <SelectTrigger className="rounded-xl border-border bg-secondary text-foreground">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-card text-foreground">
                {metrics.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center">
            <X className="h-4 w-4 rotate-45 text-muted-foreground" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Metric B (Y-Axis)
            </label>
            <Select value={metricB} onValueChange={setMetricB}>
              <SelectTrigger className="rounded-xl border-border bg-secondary text-foreground">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-card text-foreground">
                {metrics.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="mt-2 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/80"
            disabled={!metricA || !metricB}
          >
            Generate Chart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function DashboardScreen() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-xs text-muted-foreground">Wednesday, Feb 19</p>
          <h1 className="text-xl font-bold text-foreground">Good Morning</h1>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-2xl bg-card text-muted-foreground transition-colors hover:text-foreground" aria-label="Edit dashboard">
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      <WidgetCard title="Goal Trajectory" subtitle="Bench Press -- Target: 100kg">
        <GoalTrajectoryChart />
      </WidgetCard>

      <WidgetCard title="Frequency vs. Gains" subtitle="Optimal rest period analysis">
        <FrequencyGainsChart />
      </WidgetCard>

      <WidgetCard title="Volume vs. Intensity" subtitle="Bubble size = RPE exertion">
        <VolumeIntensityChart />
      </WidgetCard>

      <WidgetCard title="Performance Nebula" subtitle="Tags near center = best lifts">
        <PerformanceNebula />
      </WidgetCard>

      <CreateAnalysisModal />
    </div>
  )
}
