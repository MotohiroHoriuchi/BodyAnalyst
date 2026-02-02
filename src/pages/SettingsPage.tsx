import { useState } from 'react';
import { signOut } from '../db';
import { generateDummyData } from '../utils/generateDummyData';

export function SettingsPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      signOut();
    }
  };

  const handleSeedDummyData = async () => {
    if (!confirm('これにより既存のデータが削除され、100日分のダミーデータで置き換えられます。続行しますか？')) {
      return;
    }

    setIsSeeding(true);
    setSeedMessage('');

    try {
      const { weightRecords, mealRecords, workoutSessions } = generateDummyData(100);

      console.log('Seeding dummy data...');
      console.log(`- ${weightRecords.length} weight records`);
      console.log(`- ${mealRecords.length} meal records`);
      console.log(`- ${workoutSessions.length} workout sessions`);

      // Save to localStorage for prototype
      const weightData = weightRecords.map((record, index) => ({
        ...record,
        id: index + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const mealData = mealRecords.map((record, index) => ({
        ...record,
        id: index + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const workoutData = workoutSessions.map((record, index) => ({
        ...record,
        id: index + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      localStorage.setItem('dummy_weights', JSON.stringify(weightData));
      localStorage.setItem('dummy_meals', JSON.stringify(mealData));
      localStorage.setItem('dummy_workouts', JSON.stringify(workoutData));

      setSeedMessage('✅ 100日分のダミーデータを生成しました！ページをリロードしてください。');

      // Auto reload after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error seeding dummy data:', error);
      setSeedMessage('❌ エラーが発生しました。コンソールを確認してください。');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">設定</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        <div className="p-4">
          <h3 className="font-medium mb-2">開発者ツール</h3>
          <p className="text-sm text-gray-600 mb-3">
            プロトタイプ用のダミーデータを生成します
          </p>
          <button
            onClick={handleSeedDummyData}
            disabled={isSeeding}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSeeding ? '生成中...' : 'ダミーデータを生成（100日分）'}
          </button>
          {seedMessage && (
            <p className={`mt-2 text-sm ${seedMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {seedMessage}
            </p>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-2">アカウント</h3>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            サインアウト
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-2">アプリ情報</h3>
          <p className="text-sm text-gray-600">
            BodyAnalyst - データドリブンなフィットネストラッキング
          </p>
          <p className="text-xs text-gray-500 mt-1">Version: Prototype v2</p>
        </div>
      </div>
    </div>
  );
}
