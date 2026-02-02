import { useState } from 'react';
import { WorkoutSession } from '../../../types/workout';

interface WorkoutInputProps {
  onSave: (session: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function WorkoutInput({ onSave }: WorkoutInputProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('3');
  const [memo, setMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!exerciseName || !weight || !reps) {
      setError('種目名、重量、回数を入力してください');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const weightNum = parseFloat(weight);
      const repsNum = parseInt(reps);
      const setsNum = parseInt(sets);

      const workoutSets = Array.from({ length: setsNum }, (_, i) => ({
        setNumber: i + 1,
        weight: weightNum,
        reps: repsNum,
        isWarmup: false,
        completedAt: new Date(),
      }));

      const exercise = {
        exerciseId: Date.now(),
        exerciseName,
        bodyPart: 'other',
        sets: workoutSets,
        restTimes: Array(setsNum - 1).fill(90),
      };

      const totalVolume = weightNum * repsNum * setsNum;

      await onSave({
        date,
        startTime: new Date(),
        exercises: [exercise],
        totalVolume,
        memo: memo || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Reset form
      setExerciseName('');
      setWeight('');
      setReps('');
      setMemo('');
      alert('トレーニングを記録しました！');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">トレーニングを記録</h2>

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
        <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-700 mb-1">
          種目名 *
        </label>
        <input
          type="text"
          id="exerciseName"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          placeholder="ベンチプレス"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            重量 (kg) *
          </label>
          <input
            type="number"
            id="weight"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="80"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="reps" className="block text-sm font-medium text-gray-700 mb-1">
            回数 *
          </label>
          <input
            type="number"
            id="reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="sets" className="block text-sm font-medium text-gray-700 mb-1">
            セット数
          </label>
          <input
            type="number"
            id="sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="3"
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
