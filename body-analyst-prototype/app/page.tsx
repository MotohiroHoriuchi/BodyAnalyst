"use client"

import { useState } from "react"
import { BottomNav, type TabId } from "@/components/bottom-nav"
import { DashboardScreen } from "@/components/screens/dashboard"
import { WorkoutScreen } from "@/components/screens/workout"
import { MealScreen } from "@/components/screens/meal"
import { WeightScreen } from "@/components/screens/weight-screen"
import { SettingsScreen } from "@/components/screens/settings"

const screens: Record<TabId, React.ComponentType> = {
  dashboard: DashboardScreen,
  workout: WorkoutScreen,
  meal: MealScreen,
  weight: WeightScreen,
  settings: SettingsScreen,
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard")
  const ActiveScreen = screens[activeTab]

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto max-w-lg px-4 pb-28 pt-[env(safe-area-inset-top,12px)]">
        <div className="pt-4">
          <ActiveScreen />
        </div>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
