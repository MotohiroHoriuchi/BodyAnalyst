import { useState } from 'react';
import { ExerciseMaster } from '../../../types/workout';
import { calculateVolume } from '../utils/oneRmCalculator';
import { ExerciseSelector } from './ExerciseSelector';
import { NewExerciseForm } from './NewExerciseForm';
import { SetTable, type SetData } from './SetTable';

const DEMO_EXERCISES: ExerciseMaster[] = [
  { id: 1, name: 'ベンチプレス', bodyPart: 'chest', isCompound: true, isCustom: false, createdAt: new Date() },
  { id: 2, name: 'ダンベルフライ', bodyPart: 'chest', isCompound: false, isCustom: false, createdAt: new Date() },
  { id: 3, name: 'デッドリフト', bodyPart: 'back', isCompound: true, isCustom: false, createdAt: new Date() },
  { id: 4, name: 'ラットプルダウン', bodyPart: 'back', isCompound: true, isCustom: false, createdAt: new Date() },
  { id: 5, name: 'ベントオーバーロウ', bodyPart: 'back', isCompound: true, isCustom: false, createdAt: new Date() },
  { id: 6, name: 'オーバーヘッドプレス', bodyPart: 'shoulder', isCompound: true, isCustom: false, createdAt: new Date() },
  { id: 7, name: 'サイドレイズ', bodyPart: 'shoulder', isCompound: false, isCustom: false, createdAt: new Date() },
  { id: 8, name: 'バーベルカール', bodyPart: 'arm', isCompound: false, isCustom: false, createdAt: new Date() },
  { id: 9, name: 'トライセプスプッシュダウン', bodyPart: 'arm', isCompound: false, isCustom: false, createdAt: new Date() },
  { id: 10, name: 'スクワット', bodyPart: 'leg', isCompound: true, isCustom: false, createdAt: new Date() },
  { id: 11, name: 'レッグプレス', bodyPart: 'leg', isCompound: true, isCustom: false, createdAt: new Date() },
  { id: 12, name: 'プランク', bodyPart: 'core', isCompound: false, isCustom: false, createdAt: new Date() },
];

const DEFAULT_SET_COUNT = 3;

function createEmptySet(): SetData {
  return { weight: '', reps: '', rpe: '' };
}

export function WorkoutInputPreview() {
  const [exercises, setExercises] = useState<ExerciseMaster[]>(DEMO_EXERCISES);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseMaster | null>(null);
  const [showNewExerciseForm, setShowNewExerciseForm] = useState(false);
  const [sets, setSets] = useState<SetData[]>(
    Array.from({ length: DEFAULT_SET_COUNT }, createEmptySet)
  );
  const [showRpe, setShowRpe] = useState(false);
  const [memo, setMemo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleExerciseChange = (id: string, exercise: ExerciseMaster | null) => {
    setSelectedExerciseId(id);
    setSelectedExercise(exercise);
  };

  const handleNewExerciseSave = async (exercise: ExerciseMaster) => {
    const newId = Math.max(...exercises.map((e) => e.id ?? 0)) + 1;
    const saved = { ...exercise, id: newId };
    setExercises((prev) => [...prev, saved]);
    setShowNewExerciseForm(false);
    setSelectedExerciseId(String(newId));
    setSelectedExercise(saved);
  };

  const handleSetChange = (index: number, field: keyof SetData, value: string) => {
    setSets((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleAddSet = () => {
    setSets((prev) => {
      const last = prev[prev.length - 1];
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

    setError(null);

    const workoutSets = filledSets.map((s, i) => ({
      setNumber: i + 1,
      weight: parseFloat(s.weight),
      reps: parseInt(s.reps),
      rpe: s.rpe ? parseInt(s.rpe) : undefined,
      isWarmup: false,
      completedAt: new Date(),
    }));

    const totalVolume = calculateVolume(workoutSets);

    const session = {
      date,
      startTime: new Date(),
      exercises: [{
        exerciseId: selectedExercise.id ?? Date.now(),
        exerciseName: selectedExercise.name,
        bodyPart: selectedExercise.bodyPart,
        sets: workoutSets,
        restTimes: Array(Math.max(workoutSets.length - 1, 0)).fill(90),
      }],
      totalVolume,
      memo: memo || undefined,
    };

    console.log('Save called:', session);
    alert(`保存データ:\n種目: ${selectedExercise.name}\nボリューム: ${totalVolume}kg\nセット数: ${workoutSets.length}`);

    // Reset
    setSelectedExerciseId('');
    setSelectedExercise(null);
    setSets(Array.from({ length: DEFAULT_SET_COUNT }, createEmptySet));
    setShowRpe(false);
    setMemo('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
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
            className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            記録する
          </button>
        </form>
      </div>
    </div>
  );
}
