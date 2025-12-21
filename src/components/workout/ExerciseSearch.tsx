import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { ExerciseMaster } from '../../db/database';
import { useExerciseMaster } from '../../hooks';
import { formatBodyPart } from '../../utils/formatters';
import { Button } from '../common';

interface ExerciseSearchProps {
  onSelect: (exercise: ExerciseMaster) => void;
}

type BodyPart = 'chest' | 'back' | 'shoulder' | 'arm' | 'leg' | 'core' | 'other';

export function ExerciseSearch({ onSelect }: ExerciseSearchProps) {
  const { searchExercises, exercisesByBodyPart, addExercise } = useExerciseMaster();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExerciseMaster[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newBodyPart, setNewBodyPart] = useState<BodyPart>('other');
  const [newIsCompound, setNewIsCompound] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      const search = async () => {
        setIsSearching(true);
        const exercises = await searchExercises(query);
        setResults(exercises);
        setIsSearching(false);
      };

      const timeoutId = setTimeout(search, 200);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query, searchExercises]);

  const bodyPartOrder: BodyPart[] = ['chest', 'back', 'shoulder', 'arm', 'leg', 'core', 'other'];

  const handleAddExercise = async () => {
    if (!newExerciseName.trim()) return;

    const id = await addExercise({
      name: newExerciseName.trim(),
      bodyPart: newBodyPart,
      isCompound: newIsCompound,
    });

    if (id) {
      const newExercise: ExerciseMaster = {
        id,
        name: newExerciseName.trim(),
        bodyPart: newBodyPart,
        isCompound: newIsCompound,
        isCustom: true,
        createdAt: new Date(),
      };
      onSelect(newExercise);
      setShowAddForm(false);
      setNewExerciseName('');
      setNewBodyPart('other');
      setNewIsCompound(false);
    }
  };

  if (showAddForm) {
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">新しい種目を追加</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            種目名
          </label>
          <input
            type="text"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            placeholder="例: ダンベルカール"
            className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            部位
          </label>
          <select
            value={newBodyPart}
            onChange={(e) => setNewBodyPart(e.target.value as BodyPart)}
            className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {bodyPartOrder.map((part) => (
              <option key={part} value={part}>
                {formatBodyPart(part)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isCompound"
            checked={newIsCompound}
            onChange={(e) => setNewIsCompound(e.target.checked)}
            className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
          />
          <label htmlFor="isCompound" className="text-sm text-gray-700">
            コンパウンド種目（複数の関節を使う種目）
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddForm(false);
              setNewExerciseName('');
            }}
            fullWidth
          >
            キャンセル
          </Button>
          <Button
            onClick={handleAddExercise}
            disabled={!newExerciseName.trim()}
            fullWidth
          >
            追加
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="種目を検索..."
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="max-h-80 overflow-y-auto">
        {query.trim() ? (
          // Search Results
          isSearching ? (
            <p className="text-center py-4 text-gray-400">検索中...</p>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => onSelect(exercise)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <span className="font-medium text-gray-700">{exercise.name}</span>
                  <span className="text-sm text-gray-400">
                    {formatBodyPart(exercise.bodyPart)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-3">該当する種目がありません</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setNewExerciseName(query);
                  setShowAddForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                「{query}」を追加
              </Button>
            </div>
          )
        ) : (
          // Grouped by Body Part
          exercisesByBodyPart && (
            <div className="space-y-4">
              {bodyPartOrder.map((bodyPart) => {
                const exercises = exercisesByBodyPart[bodyPart];
                if (!exercises || exercises.length === 0) return null;

                return (
                  <div key={bodyPart}>
                    <h4 className="text-sm font-semibold text-gray-500 mb-2 px-2">
                      {formatBodyPart(bodyPart)}
                    </h4>
                    <div className="space-y-1">
                      {exercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          onClick={() => onSelect(exercise)}
                          className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <span className="font-medium text-gray-700">
                            {exercise.name}
                          </span>
                          {exercise.isCompound && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded">
                              Compound
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
