import { useState } from "react"
import {
  User,
  RefreshCw,
  Palette,
  Bell,
  FileText,
  Info,
  ChevronRight,
  Check,
  Database,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

const accentColors = [
  { name: "Slate", value: "#64748b" },
  { name: "Zinc", value: "#71717a" },
  { name: "Stone", value: "#78716c" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Teal", value: "#14b8a6" },
]

function SettingsGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="overflow-hidden rounded-3xl bg-card">{children}</div>
    </div>
  )
}

function SettingsRow({
  icon: Icon,
  label,
  value,
  onClick,
  trailing,
  isLast = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: string
  onClick?: () => void
  trailing?: React.ReactNode
  isLast?: boolean
}) {
  if (trailing) {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors",
          !isLast && "border-b border-border"
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="flex-1 text-sm text-foreground">{label}</span>
        {trailing}
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/40",
        !isLast && "border-b border-border"
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        {value && (
          <span className="text-xs text-muted-foreground">{value}</span>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
      </div>
    </button>
  )
}

export function SettingsPage() {
  const [selectedColor, setSelectedColor] = useState("#64748b")
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Google Integration */}
      <SettingsGroup title="Google Integration">
        <div className="px-4 py-4">
          <p className="mb-3 text-xs text-muted-foreground">
            Google Sheets
          </p>
          <button className="w-full rounded-2xl bg-primary/20 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/30">
            Google
          </button>
        </div>
      </SettingsGroup>

      {/* Account */}
      <SettingsGroup title="Account">
        <SettingsRow icon={User} label="Profile" value="Guest" />
        <SettingsRow
          icon={RefreshCw}
          label="Data Sync"
          value="Local"
          isLast
        />
      </SettingsGroup>

      {/* Preferences */}
      <SettingsGroup title="Preferences">
        <div className={cn("border-b border-border px-4 py-3.5")}>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
              <Palette className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-foreground">Accent Color</span>
          </div>
          <div className="flex gap-3 pl-11">
            {accentColors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.value)}
                className="relative flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-90"
                style={{ backgroundColor: color.value }}
                aria-label={`Select ${color.name} color`}
              >
                {selectedColor === color.value && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
        <SettingsRow
          icon={Bell}
          label="Notifications"
          trailing={
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          }
          isLast
        />
      </SettingsGroup>

      {/* Developer Tools */}
      <SettingsGroup title="Developer Tools">
        <SettingsRow
          icon={Database}
          label="Seed Dummy Data"
          value="100 days"
          onClick={() => {
            if (confirm('100 Dummy data will be generated. Continue?')) {
              console.log('Seeding dummy data...')
            }
          }}
        />
        <SettingsRow
          icon={Wrench}
          label="Force Sync"
          onClick={() => {
            console.log('Force syncing...')
          }}
          isLast
        />
      </SettingsGroup>

      {/* System */}
      <SettingsGroup title="System">
        <SettingsRow icon={Info} label="Version" value="1.0.0-beta" />
        <SettingsRow icon={FileText} label="Terms of Service" isLast />
      </SettingsGroup>

      {/* Footer */}
      <p className="text-center text-[10px] text-muted-foreground/50">
        BodyAnalyst v1.0.0-beta
      </p>
    </div>
  )
}
