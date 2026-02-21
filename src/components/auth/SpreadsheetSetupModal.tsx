import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { createSpreadsheet } from '../../db/adapters/google_sheets/spreadsheetSetup';

interface SpreadsheetSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export function SpreadsheetSetupModal({ isOpen, onComplete, onCancel }: SpreadsheetSetupModalProps) {
  const { signOut } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleCreate() {
    setIsCreating(true);
    setError(null);
    try {
      const spreadsheetId = await createSpreadsheet();
      localStorage.setItem('BODYANALYST_SPREADSHEET_ID', spreadsheetId);
      onComplete();
    } catch {
      setError('スプレッドシートの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsCreating(false);
    }
  }

  function handleCancel() {
    signOut();
    onCancel();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-4 w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl">
        <h2 className="mb-1 text-base font-semibold text-foreground">
          データの保存先を設定します
        </h2>
        <p className="mb-6 text-xs text-muted-foreground">
          Google スプレッドシートをデータの保存先として使用します。
          新しいスプレッドシートを作成するか、既存の ID を入力してください。
        </p>

        {error && (
          <p className="mb-4 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? '作成中...' : '新しいスプレッドシートを作成'}
          </button>

          <button
            onClick={handleCancel}
            disabled={isCreating}
            className="w-full rounded-2xl bg-secondary py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
