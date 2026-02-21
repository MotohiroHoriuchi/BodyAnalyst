import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import {
  createSpreadsheet,
  validateSpreadsheet,
  findExistingSpreadsheet,
} from '../../db/adapters/google_sheets/spreadsheetSetup';

interface SpreadsheetSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

type SearchStatus = 'searching' | 'found' | 'not-found' | 'error';

export function SpreadsheetSetupModal({ isOpen, onComplete, onCancel }: SpreadsheetSetupModalProps) {
  const { signOut } = useAuth();
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('searching');
  const [foundSpreadsheet, setFoundSpreadsheet] = useState<{ id: string; name: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setSearchStatus('searching');
    setFoundSpreadsheet(null);
    setError(null);

    findExistingSpreadsheet()
      .then((result) => {
        if (result) {
          setFoundSpreadsheet(result);
          setSearchStatus('found');
        } else {
          setSearchStatus('not-found');
        }
      })
      .catch(() => {
        setSearchStatus('error');
      });
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleUseExisting() {
    if (!foundSpreadsheet) return;
    setIsProcessing(true);
    setError(null);
    try {
      const isValid = await validateSpreadsheet(foundSpreadsheet.id);
      if (!isValid) {
        setError('スプレッドシートの構造が不完全です。新しく作成してください。');
        setSearchStatus('not-found');
        return;
      }
      localStorage.setItem('BODYANALYST_SPREADSHEET_ID', foundSpreadsheet.id);
      onComplete();
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCreate() {
    setIsProcessing(true);
    setError(null);
    try {
      const spreadsheetId = await createSpreadsheet();
      localStorage.setItem('BODYANALYST_SPREADSHEET_ID', spreadsheetId);
      onComplete();
    } catch {
      setError('スプレッドシートの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsProcessing(false);
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

        {searchStatus === 'searching' && (
          <p className="mb-6 text-xs text-muted-foreground">
            既存のデータを検索中...
          </p>
        )}

        {searchStatus === 'found' && foundSpreadsheet && (
          <>
            <p className="mb-2 text-xs text-muted-foreground">
              既存のスプレッドシートが見つかりました。
            </p>
            <div className="mb-6 rounded-2xl bg-secondary px-4 py-3">
              <p className="text-sm font-medium text-foreground">{foundSpreadsheet.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">ID: {foundSpreadsheet.id}</p>
            </div>
          </>
        )}

        {(searchStatus === 'not-found' || searchStatus === 'error') && (
          <p className="mb-6 text-xs text-muted-foreground">
            Google スプレッドシートをデータの保存先として使用します。
            新しいスプレッドシートを作成します。
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {searchStatus === 'found' && (
            <button
              onClick={handleUseExisting}
              disabled={isProcessing}
              className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? '処理中...' : 'このスプレッドシートを使用する'}
            </button>
          )}

          {searchStatus === 'found' && (
            <button
              onClick={handleCreate}
              disabled={isProcessing}
              className="w-full rounded-2xl bg-secondary py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? '作成中...' : '新しく作成する'}
            </button>
          )}

          {(searchStatus === 'not-found' || searchStatus === 'error') && (
            <button
              onClick={handleCreate}
              disabled={isProcessing}
              className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? '作成中...' : '新しいスプレッドシートを作成'}
            </button>
          )}

          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full rounded-2xl bg-secondary py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
