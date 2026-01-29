import { useState } from 'react';
import { MealRecord } from '../../../types/meal';

interface MealInputProps {
  onSave: (record: Omit<MealRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function MealInput({ onSave }: MealInputProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [memo, setMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName || !calories) {
      setError('食品名とカロリーを入力してください');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const mealItem = {
        foodId: Date.now(),
        foodName,
        amount: 100, // 簡易版では固定
        calories: parseFloat(calories),
        protein: parseFloat(protein) || 0,
        fat: parseFloat(fat) || 0,
        carbs: parseFloat(carbs) || 0,
      };

      await onSave({
        date,
        mealType,
        items: [mealItem],
        totalCalories: mealItem.calories,
        totalProtein: mealItem.protein,
        totalFat: mealItem.fat,
        totalCarbs: mealItem.carbs,
        memo: memo || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Reset form
      setFoodName('');
      setCalories('');
      setProtein('');
      setFat('');
      setCarbs('');
      setMemo('');
      alert('食事を記録しました！');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">食事を記録</h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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
          <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
            食事タイプ
          </label>
          <select
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="breakfast">朝食</option>
            <option value="lunch">昼食</option>
            <option value="dinner">夕食</option>
            <option value="snack">間食</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">
          食品名 *
        </label>
        <input
          type="text"
          id="foodName"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="鶏胸肉"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
            カロリー (kcal) *
          </label>
          <input
            type="number"
            id="calories"
            step="0.1"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="200"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
            タンパク質 (g)
          </label>
          <input
            type="number"
            id="protein"
            step="0.1"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="30"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
            脂質 (g)
          </label>
          <input
            type="number"
            id="fat"
            step="0.1"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            placeholder="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
            炭水化物 (g)
          </label>
          <input
            type="number"
            id="carbs"
            step="0.1"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
          メモ
        </label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="備考など..."
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
