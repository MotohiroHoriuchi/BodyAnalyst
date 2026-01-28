import { useState } from 'react';
import { WeightRecord } from '../../../types/weight';

interface WeightInputProps {
  onSave: (record: Omit<WeightRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function WeightInput({ onSave }: WeightInputProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState('');
  const [timing, setTiming] = useState<'morning' | 'evening' | 'other'>('morning');
  const [memo, setMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight) {
      setError('体重を入力してください');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave({
        date,
        weight: parseFloat(weight),
        bodyFatPercentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : undefined,
        timing,
        memo: memo || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Reset form
      setWeight('');
      setBodyFatPercentage('');
      setMemo('');
      alert('体重を記録しました！');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">体重を記録</h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          日付
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
          体重 (kg) *
        </label>
        <input
          type="number"
          id="weight"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="70.5"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700 mb-1">
          体脂肪率 (%)
        </label>
        <input
          type="number"
          id="bodyFat"
          step="0.1"
          value={bodyFatPercentage}
          onChange={(e) => setBodyFatPercentage(e.target.value)}
          placeholder="15.0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="timing" className="block text-sm font-medium text-gray-700 mb-1">
          計測タイミング
        </label>
        <select
          id="timing"
          value={timing}
          onChange={(e) => setTiming(e.target.value as 'morning' | 'evening' | 'other')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="morning">朝</option>
          <option value="evening">夜</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div>
        <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
          メモ
        </label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="体調など..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? '保存中...' : '記録する'}
      </button>
    </form>
  );
}
