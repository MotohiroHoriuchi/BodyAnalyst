import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Dumbbell, UtensilsCrossed, Weight, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: '/', label: 'Dashboard', icon: LayoutDashboard },
  { id: '/workout', label: 'Workout', icon: Dumbbell },
  { id: '/meal', label: 'Meal', icon: UtensilsCrossed },
  { id: '/weight', label: 'Weight', icon: Weight },
  { id: '/settings', label: 'Settings', icon: Settings },
] as const

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom,8px)]">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.id}
              to={tab.id}
              role="tab"
              end={tab.id === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 transition-all duration-200',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5px]')} />
                  <span
                    className={cn(
                      'text-[10px] leading-none transition-all',
                      isActive ? 'font-semibold opacity-100' : 'font-normal opacity-60'
                    )}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
