import { useState } from 'react';
import { createSpreadsheet, getSpreadsheetUrl } from '../db/adapters/google_sheets/spreadsheetSetup';

interface SetupPageProps {
  onComplete: (spreadsheetId: string) => void;
}

export function SetupPage({ onComplete }: SetupPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');

  const handleAutoCreate = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const spreadsheetId = await createSpreadsheet();
      const url = getSpreadsheetUrl(spreadsheetId);

      // Save to localStorage
      localStorage.setItem('BODYANALYST_SPREADSHEET_ID', spreadsheetId);

      alert(
        `スプレッドシートを作成しました！\n\n` +
        `ID: ${spreadsheetId}\n\n` +
        `以下のURLで確認できます:\n${url}\n\n` +
        `このIDは自動的に保存されました。`
      );

      onComplete(spreadsheetId);
    } catch (err) {
      console.error('Failed to create spreadsheet:', err);
      setError(err instanceof Error ? err.message : 'スプレッドシートの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  const handleManualSetup = () => {
    if (!manualId.trim()) {
      setError('スプレッドシートIDを入力してください');
      return;
    }

    localStorage.setItem('BODYANALYST_SPREADSHEET_ID', manualId.trim());
    onComplete(manualId.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BodyAnalyst!</h1>
        <p className="text-gray-600 mb-8">
          データを保存するためのGoogle Spreadsheetをセットアップしましょう。
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Auto Create Option */}
        <div className="mb-8 p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            🚀 自動セットアップ（推奨）
          </h2>
          <p className="text-gray-700 mb-4">
            必要なシートとヘッダーを含むスプレッドシートを自動的に作成します。
          </p>
          <button
            onClick={handleAutoCreate}
            disabled={isCreating}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                作成中...
              </span>
            ) : (
              'スプレッドシートを自動作成'
            )}
          </button>
        </div>

        {/* Manual Setup Option */}
        <div className="p-6 border-2 border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            📝 手動セットアップ
          </h2>
          <p className="text-gray-700 mb-4">
            既存のスプレッドシートIDを入力してください。
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="spreadsheetId" className="block text-sm font-medium text-gray-700 mb-2">
                スプレッドシートID
              </label>
              <input
                type="text"
                id="spreadsheetId"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="例: 1AbCdEfGhIjKlMnOpQrStUvWxYz"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-2 text-xs text-gray-500">
                URLの /d/ と /edit の間の文字列です
              </p>
            </div>
            <button
              onClick={handleManualSetup}
              className="w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              このIDを使用
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">📋 必要なシート</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Weight - 体重・体組成データ</li>
            <li>• WorkoutSessions - トレーニング記録</li>
            <li>• ExerciseMaster - 種目マスター</li>
            <li>• MealRecords - 食事記録</li>
            <li>• FoodMaster - 食品マスター</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
