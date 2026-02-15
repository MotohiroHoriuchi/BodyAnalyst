import { useState, useEffect } from 'react';
import { WorkoutSession, ExerciseMaster } from '../../../types/workout';
import { useExercise } from '../hooks/useExercise';
import { calculateVolume } from '../utils/oneRmCalculator';
import { ExerciseSelector } from './ExerciseSelector';
import { NewExerciseForm } from './NewExerciseForm';
import { SetTable, type SetData } from './SetTable';

interface WorkoutInputProps {
  onSave: (session: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const DEFAULT_SET_COUNT = 3;

function createEmptySet(): SetData {
  return { weight: '', reps: '', rpe: '' };
}

export function WorkoutInput({ onSave }: WorkoutInputProps) {
  const { exercises, saveExercise } = useExercise();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseMaster | null>(null);
  const [showNewExerciseForm, setShowNewExerciseForm] = useState(false);
  const [sets, setSets] = useState<SetData[]>(
    Array.from({ length: DEFAULT_SET_COUNT }, createEmptySet)
  );
  const [showRpe, setShowRpe] = useState(false);
  const [memo, setMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingExercise, setIsSavingExercise] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExerciseChange = (id: string, exercise: ExerciseMaster | null) => {
    setSelectedExerciseId(id);
    setSelectedExercise(exercise);
  };

  const handleNewExerciseSave = async (exercise: ExerciseMaster) => {
    setIsSavingExercise(true);
    try {
      await saveExercise(exercise);
      setShowNewExerciseForm(false);
      setAutoSelectName(exercise.name);
    } catch {
      // Error is handled by useExercise
    } finally {
      setIsSavingExercise(false);
    }
  };

  // Auto-select newly created exercise
  const [autoSelectName, setAutoSelectName] = useState<string | null>(null);
  useEffect(() => {
    if (autoSelectName && exercises.length > 0) {
      const found = exercises.find((e) => e.name === autoSelectName);
      if (found) {
        setSelectedExerciseId(String(found.id));
        setSelectedExercise(found);
        setAutoSelectName(null);
      }
    }
  }, [autoSelectName, exercises]);

  const handleSetChange = (index: number, field: keyof SetData, value: string) => {
    setSets((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleAddSet = () => {
    setSets((prev) => {
      const last = prev[prev.length - 1];
      // Copy weight/reps from last set for convenience
      return [...prev, { weight: last.weight, reps: last.reps, rpe: '' }];
    });
  };

  const handleRemoveSet = (index: number) => {
    setSets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExercise) {
      setError('種目を選択してください');
      return;
    }

    const filledSets = sets.filter((s) => s.weight && s.reps);
    if (filledSets.length === 0) {
      setError('少なくとも1セットの重量と回数を入力してください');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const workoutSets = filledSets.map((s, i) => ({
        setNumber: i + 1,
        weight: parseFloat(s.weight),
        reps: parseInt(s.reps),
        rpe: s.rpe ? parseInt(s.rpe) : undefined,
        isWarmup: false,
        completedAt: new Date(),
      }));

      const exercise = {
        exerciseId: selectedExercise.id ?? Date.now(),
        exerciseName: selectedExercise.name,
        bodyPart: selectedExercise.bodyPart,
        sets: workoutSets,
        restTimes: Array(Math.max(workoutSets.length - 1, 0)).fill(90),
      };

      const totalVolume = calculateVolume(workoutSets);

      await onSave({
        date,
        startTime: new Date(),
        exercises: [exercise],
        totalVolume,
        memo: memo || undefined,
      });

      // Reset form
      setSelectedExerciseId('');
      setSelectedExercise(null);
      setSets(Array.from({ length: DEFAULT_SET_COUNT }, createEmptySet));
      setShowRpe(false);
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

      <ExerciseSelector
        exercises={exercises}
        value={selectedExerciseId}
        onChange={handleExerciseChange}
        disabled={isSaving}
      />

      {!showNewExerciseForm ? (
        <button
          type="button"
          onClick={() => setShowNewExerciseForm(true)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          + 新しい種目を追加
        </button>
      ) : (
        <NewExerciseForm
          onSave={handleNewExerciseSave}
          onCancel={() => setShowNewExerciseForm(false)}
          saving={isSavingExercise}
        />
      )}

      <SetTable
        sets={sets}
        showRpe={showRpe}
        onShowRpeChange={setShowRpe}
        onSetChange={handleSetChange}
        onAddSet={handleAddSet}
        onRemoveSet={handleRemoveSet}
      />

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
