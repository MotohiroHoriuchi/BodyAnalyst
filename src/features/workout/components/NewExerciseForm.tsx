import { useState } from 'react';
import { ExerciseMaster } from '../../../types/workout';

const BODY_PARTS = [
  { value: 'chest', label: '胸' },
  { value: 'back', label: '背中' },
  { value: 'shoulder', label: '肩' },
  { value: 'arm', label: '腕' },
  { value: 'leg', label: '脚' },
  { value: 'core', label: '体幹' },
  { value: 'other', label: 'その他' },
] as const;

interface NewExerciseFormProps {
  onSave: (exercise: ExerciseMaster) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

export function NewExerciseForm({ onSave, onCancel, saving }: NewExerciseFormProps) {
  const [name, setName] = useState('');
  const [bodyPart, setBodyPart] = useState<ExerciseMaster['bodyPart']>('chest');
  const [isCompound, setIsCompound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('種目名を入力してください');
      return;
    }

    setError(null);

    await onSave({
      name: name.trim(),
      bodyPart,
      isCompound,
      isCustom: true,
      createdAt: new Date(),
    });
  };

  return (
    <div className="border border-blue-200 bg-blue-50 rounded-md p-4 space-y-3">
      <h3 className="text-sm font-medium text-blue-900">新しい種目を追加</h3>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-3">
        <div>
          <label htmlFor="newExName" className="block text-sm text-gray-700 mb-1">
            種目名 *
          </label>
          <input
            type="text"
            id="newExName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: インクラインダンベルプレス"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={saving}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="newExBodyPart" className="block text-sm text-gray-700 mb-1">
              部位
            </label>
            <select
              id="newExBodyPart"
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value as ExerciseMaster['bodyPart'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              disabled={saving}
            >
              {BODY_PARTS.map((bp) => (
                <option key={bp.value} value={bp.value}>
                  {bp.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700 pb-2">
              <input
                type="checkbox"
                checked={isCompound}
                onChange={(e) => setIsCompound(e.target.checked)}
                className="rounded border-gray-300"
                disabled={saving}
              />
              コンパウンド種目
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? '保存中...' : '追加'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
