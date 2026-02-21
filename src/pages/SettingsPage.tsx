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
  Cloud,
  CloudOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/auth/useAuth"
import { connectGoogleAdapter } from "@/db/index"
import { SpreadsheetSetupModal } from "@/components/auth/SpreadsheetSetupModal"

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
  const [showSetupModal, setShowSetupModal] = useState(false)

  const { authState, googleSyncStatus, signIn, signOut } = useAuth()
  const isConnected = googleSyncStatus === 'connected'

  async function handleConnectGoogle() {
    try {
      await signIn()
      setShowSetupModal(true)
    } catch (error) {
      console.error('Google サインイン失敗:', error)
    }
  }

  async function handleSetupComplete() {
    setShowSetupModal(false)
    await connectGoogleAdapter()
  }

  function handleSetupCancel() {
    setShowSetupModal(false)
  }

  function handleDisconnect() {
    signOut()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-xl font-bold text-foreground">設定</h1>
      </div>

      {/* Google 連携 */}
      <SettingsGroup title="Google 連携">
        <div className="px-4 py-4">
          {isConnected && authState.user ? (
            // 連携済み
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {authState.user.picture ? (
                  <img
                    src={authState.user.picture}
                    alt={authState.user.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{authState.user.name}</span>
                  <span className="text-xs text-muted-foreground">{authState.user.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <Cloud className="h-3.5 w-3.5" />
                <span>Google スプレッドシートで同期中</span>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full rounded-2xl border border-destructive/40 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                連携を解除
              </button>
            </div>
          ) : (
            // 未連携
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <CloudOff className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-foreground">クラウドバックアップ（任意）</p>
                  <p className="text-xs text-muted-foreground">
                    未連携の場合、データはこの端末にのみ保存されます。
                  </p>
                </div>
              </div>
              <button
                onClick={handleConnectGoogle}
                className="w-full rounded-2xl bg-primary/20 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/30"
              >
                Google でバックアップを設定する
              </button>
            </div>
          )}
        </div>
      </SettingsGroup>

      {/* アカウント */}
      <SettingsGroup title="アカウント">
        <SettingsRow
          icon={User}
          label="プロフィール"
          value={isConnected && authState.user ? authState.user.name : 'ゲスト'}
        />
        <SettingsRow
          icon={RefreshCw}
          label="データ同期"
          value={isConnected ? 'Google Drive' : 'ローカル'}
          isLast
        />
      </SettingsGroup>

      {/* 設定 */}
      <SettingsGroup title="設定">
        <div className={cn("border-b border-border px-4 py-3.5")}>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
              <Palette className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-foreground">アクセントカラー</span>
          </div>
          <div className="flex gap-3 pl-11">
            {accentColors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.value)}
                className="relative flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-90"
                style={{ backgroundColor: color.value }}
                aria-label={`${color.name} を選択`}
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
          label="通知"
          trailing={
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          }
          isLast
        />
      </SettingsGroup>

      {/* 開発者ツール */}
      <SettingsGroup title="開発者ツール">
        <SettingsRow
          icon={Database}
          label="ダミーデータを生成"
          value="100日分"
          onClick={() => {
            if (confirm('100日分のダミーデータを生成します。続けますか？')) {
              console.log('Seeding dummy data...')
            }
          }}
        />
        <SettingsRow
          icon={Wrench}
          label="強制同期"
          onClick={() => {
            console.log('Force syncing...')
          }}
          isLast
        />
      </SettingsGroup>

      {/* システム */}
      <SettingsGroup title="システム">
        <SettingsRow icon={Info} label="バージョン" value="1.0.0-beta" />
        <SettingsRow icon={FileText} label="利用規約" isLast />
      </SettingsGroup>

      {/* フッター */}
      <p className="text-center text-[10px] text-muted-foreground/50">
        BodyAnalyst v1.0.0-beta
      </p>

      {/* スプレッドシート設定モーダル */}
      <SpreadsheetSetupModal
        isOpen={showSetupModal}
        onComplete={handleSetupComplete}
        onCancel={handleSetupCancel}
      />
    </div>
  )
}
